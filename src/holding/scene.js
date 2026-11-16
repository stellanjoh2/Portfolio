import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { createHolographicMaterial } from "./holographic.js";

// Values from the Orby scene export (Excavator, holographic look).
const LOOK = {
  shaderAnimationSpeed: 0.4,
  patternScale: 0.5,
  intensity: 0.25,
  brightness: 1,
};
const AUTO_ROTATE = 0.5; // rad/s around world Y, Orby "forward"
// Camera drift around the target: counter-yaw plus a slow pitch swing, so the motion is not single-axis.
const GIMBAL = {
  yawSpeed: -0.12, // rad/s
  pitchAmplitude: 0.38, // rad
  pitchSpeed: 0.21, // rad/s of the sine phase
  resumeRate: 0.8, // how fast the drift eases back in after a drag (1/s)
};
const IMPORT_MAX_DIMENSION = 2; // Orby fits imports to this AABB size, centered at the origin
const CAMERA = {
  fov: 45,
  position: new THREE.Vector3(-1.0023584236479681, -0.0011811847795336061, -1.42632454125149),
  target: new THREE.Vector3(-0.1380760336846219, -0.2324481589637001, -0.03764419707844621),
};
// Orby's bloom panel maps threshold t to t * 0.78 + 0.08.
const BLOOM = { threshold: 1 * 0.78 + 0.08, strength: 0.2, radius: 0.2, tint: "#ffb3d9" };
// The Orby framing was authored on a landscape viewport; pull back on narrow screens so the model stays in frame.
const FRAMING_ASPECT = 1.2;
const MAX_PORTRAIT_PULLBACK = 2;

/**
 * @param {HTMLElement} host
 * @param {{ modelUrl: string, onReady?: () => void }} opts
 */
export function mountHoldingScene(host, { modelUrl, onReady }) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, 0.1, 100);
  camera.position.copy(CAMERA.position);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.target.copy(CAMERA.target);
  controls.minDistance = 0.6;
  controls.maxDistance = 6;
  controls.minPolarAngle = 0.15;
  controls.maxPolarAngle = Math.PI - 0.15;

  let dragging = false;
  controls.addEventListener("start", () => {
    dragging = true;
  });
  controls.addEventListener("end", () => {
    dragging = false;
  });

  const composer = new EffectComposer(
    renderer,
    new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType })
  );
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), BLOOM.strength, BLOOM.radius, BLOOM.threshold);
  const tint = new THREE.Color(BLOOM.tint);
  for (const c of bloom.bloomTintColors) c.set(tint.r, tint.g, tint.b);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const fxaa = new ShaderPass(FXAAShader);
  composer.addPass(fxaa);

  const material = createHolographicMaterial(LOOK);
  const pivot = new THREE.Group();
  scene.add(pivot);

  let disposed = false;
  new GLTFLoader().load(modelUrl, (gltf) => {
    if (disposed) return;
    const model = gltf.scene;
    model.traverse((obj) => {
      if (obj.isMesh) obj.material = material;
    });
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = IMPORT_MAX_DIMENSION / Math.max(size.x, size.y, size.z);
    model.scale.multiplyScalar(scale);
    model.position.sub(center.multiplyScalar(scale));
    pivot.add(model);
    onReady?.();
  });

  function resize() {
    const w = host.clientWidth || window.innerWidth;
    const h = host.clientHeight || window.innerHeight;
    const aspect = w / h;
    const dpr = renderer.getPixelRatio();
    renderer.setSize(w, h, false);
    composer.setPixelRatio(dpr);
    composer.setSize(w, h);
    fxaa.material.uniforms.resolution.value.set(1 / (w * dpr), 1 / (h * dpr));

    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    const pullback = THREE.MathUtils.clamp(FRAMING_ASPECT / aspect, 1, MAX_PORTRAIT_PULLBACK);
    const offset = camera.position.clone().sub(controls.target);
    const base = CAMERA.position.distanceTo(CAMERA.target);
    camera.position.copy(controls.target).add(offset.setLength(base * pullback));
    controls.update();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const timer = new THREE.Timer();
  timer.connect(document);
  let elapsed = 0;
  const orbitOffset = new THREE.Vector3();
  const orbit = new THREE.Spherical();
  let gimbalWeight = 1;
  let gimbalPhase = 0;
  let lastPitch = 0;

  function driftCamera(delta) {
    const goal = dragging ? 0 : 1;
    gimbalWeight += (goal - gimbalWeight) * Math.min(1, delta * GIMBAL.resumeRate);
    gimbalPhase += delta * GIMBAL.pitchSpeed * gimbalWeight;
    const pitch = GIMBAL.pitchAmplitude * Math.sin(gimbalPhase);
    const pitchStep = pitch - lastPitch;
    lastPitch = pitch;

    orbitOffset.copy(camera.position).sub(controls.target);
    orbit.setFromVector3(orbitOffset);
    orbit.theta += GIMBAL.yawSpeed * delta * gimbalWeight;
    orbit.phi = THREE.MathUtils.clamp(orbit.phi + pitchStep, controls.minPolarAngle, controls.maxPolarAngle);
    camera.position.setFromSpherical(orbit).add(controls.target);
  }

  renderer.setAnimationLoop((now) => {
    timer.update(now);
    const delta = Math.min(timer.getDelta(), 0.1);
    elapsed += delta;
    material.uniforms.uTime.value = elapsed * LOOK.shaderAnimationSpeed;
    if (!reduceMotion) {
      pivot.rotation.y += delta * AUTO_ROTATE;
      driftCamera(delta);
    }
    controls.update();
    composer.render();
  });

  return () => {
    disposed = true;
    renderer.setAnimationLoop(null);
    timer.dispose();
    ro.disconnect();
    controls.dispose();
    pivot.traverse((obj) => obj.geometry?.dispose());
    material.dispose();
    composer.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
