import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

const SAMPLES = 160;
const DEG = Math.PI / 180;
const CAMERA_DISTANCE = 4.2;

const EASE_FNS = {
  linear: (t) => t,
  "sine.inOut": (t) => 0.5 - 0.5 * Math.cos(Math.PI * t),
  "cubic.inOut": (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  "cubic.out": (t) => 1 - (1 - t) ** 3,
  "expo.inOut": (t) =>
    t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2,
  "expo.out": (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t)),
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function latLonToVec(lat, lon) {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  return new THREE.Vector3(-Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
}

function makeDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeGraticule(material) {
  const points = [];
  const r = 1.0015;
  const push = (a, b) => points.push(a.multiplyScalar(r), b.multiplyScalar(r));
  for (let lat = -75; lat <= 75; lat += 15) {
    for (let lon = 0; lon < 360; lon += 3) push(latLonToVec(lat, lon), latLonToVec(lat, lon + 3));
  }
  for (let lon = 0; lon < 360; lon += 15) {
    for (let lat = -90; lat < 90; lat += 3) push(latLonToVec(lat, lon), latLonToVec(lat + 3, lon));
  }
  return new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), material);
}

/** Great-circle route from the origin along a bearing, lifted above the surface. */
function buildRoute(origin, bearing, distance, altitude, arc) {
  let east = new THREE.Vector3(0, 1, 0).cross(origin);
  if (east.lengthSq() < 1e-8) east = new THREE.Vector3(0, 0, -1);
  east.normalize();
  const north = new THREE.Vector3().crossVectors(origin, east);
  const dir = north.multiplyScalar(Math.cos(bearing)).addScaledVector(east, Math.sin(bearing));

  const pointAt = (t, out = new THREE.Vector3()) => {
    const a = distance * t;
    const radius = 1 + altitude + arc * distance * Math.sin(Math.PI * t);
    return out.copy(origin).multiplyScalar(Math.cos(a)).addScaledVector(dir, Math.sin(a)).multiplyScalar(radius);
  };

  const samples = new Float32Array((SAMPLES + 1) * 3);
  const p = new THREE.Vector3();
  for (let i = 0; i <= SAMPLES; i++) pointAt(i / SAMPLES, p).toArray(samples, i * 3);
  return { samples, pointAt };
}

export function createTravel(canvas, initial) {
  let settings = initial;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.6;
  controls.minDistance = 1.3;
  controls.maxDistance = 20;

  const globe = new THREE.Group();
  scene.add(globe);

  const sphereMaterial = new THREE.MeshBasicMaterial({ color: settings.sphereColor });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), sphereMaterial);
  globe.add(sphere);

  const gridMaterial = new THREE.LineBasicMaterial({ color: settings.gridColor });
  const grid = makeGraticule(gridMaterial);
  globe.add(grid);

  const lineMaterial = new LineMaterial({ color: settings.lineColor, linewidth: settings.lineWidth });

  const dotTexture = makeDotTexture();
  const dotMaterial = new THREE.PointsMaterial({
    color: settings.dotColor,
    size: settings.dotSize,
    sizeAttenuation: false,
    map: dotTexture,
    transparent: true,
    alphaTest: 0.01,
  });
  const dotGeometry = new THREE.BufferGeometry();
  const dots = new THREE.Points(dotGeometry, dotMaterial);
  dots.frustumCulled = false;
  globe.add(dots);

  const originGeometry = new THREE.BufferGeometry();
  const originDot = new THREE.Points(originGeometry, dotMaterial);
  originDot.frustumCulled = false;
  globe.add(originDot);

  let flights = [];
  let start = performance.now();
  let raf = 0;
  const head = new THREE.Vector3();

  function clearFlights() {
    for (const f of flights) {
      globe.remove(f.line);
      f.line.geometry.dispose();
    }
    flights = [];
  }

  function buildFlights() {
    clearFlights();
    const s = settings;
    const rand = mulberry32(s.seed * 9973 + 17);
    const origin = latLonToVec(s.lat, s.lon);
    const lo = Math.min(s.minDist, s.maxDist);
    const hi = Math.max(s.minDist, s.maxDist);
    const offset = rand() * Math.PI * 2;

    for (let i = 0; i < s.count; i++) {
      const bearing = offset + ((i + (rand() - 0.5) * s.bearingJitter) / s.count) * Math.PI * 2;
      const distance = (lo + (hi - lo) * rand()) * DEG;
      const route = buildRoute(origin, bearing, distance, s.altitude, s.arc);

      const geometry = new LineGeometry();
      geometry.setPositions(route.samples);
      geometry.instanceCount = 0;
      const line = new Line2(geometry, lineMaterial);
      line.frustumCulled = false;
      globe.add(line);

      flights.push({
        ...route,
        line,
        buffer: geometry.attributes.instanceStart.data,
        delay: rand(),
        pace: 1 + (rand() * 2 - 1) * s.speedVariance,
      });
    }

    dotGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(s.count * 3), 3));
    const lifted = origin.clone().multiplyScalar(1 + s.altitude);
    originGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lifted.toArray()), 3));
  }

  function timing(f) {
    const s = settings;
    const begin = f.delay * s.stagger;
    return { begin, length: Math.max(0.05, s.duration / f.pace) };
  }

  function cycleLength() {
    let end = 0;
    for (const f of flights) {
      const { begin, length } = timing(f);
      end = Math.max(end, begin + length);
    }
    return end + settings.hold;
  }

  /** Draws the route up to `progress` and leaves the plane position in `head`. */
  function drawFlight(f, progress) {
    const ease = EASE_FNS[settings.ease] || EASE_FNS.linear;
    const h = ease(progress);
    f.pointAt(h, head);

    if (h <= 0) {
      f.line.geometry.instanceCount = 0;
      return;
    }

    const arr = f.buffer.array;
    const src = f.samples;
    const full = Math.min(Math.floor(h * SAMPLES), SAMPLES - 1);
    for (let j = 0; j < full; j++) arr.set(src.subarray(j * 3, j * 3 + 6), j * 6);
    arr.set(src.subarray(full * 3, full * 3 + 3), full * 6);
    head.toArray(arr, full * 6 + 3);
    f.buffer.needsUpdate = true;
    f.line.geometry.instanceCount = full + 1;
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    controls.update();

    let t = (now - start) / 1000;
    const cycle = cycleLength();
    if (settings.loop && t > cycle) {
      start = now;
      t = 0;
    }
    const travel = Math.max(0.001, cycle - settings.hold);
    globe.rotation.y = Math.min(1, t / travel) * settings.spin * DEG;

    const positions = dotGeometry.attributes.position;
    let visible = 0;
    for (const f of flights) {
      const { begin, length } = timing(f);
      const progress = Math.min(1, Math.max(0, (t - begin) / length));
      drawFlight(f, progress);
      if (progress < 1 || settings.keepDots) positions.setXYZ(visible++, head.x, head.y, head.z);
    }
    positions.needsUpdate = true;
    dotGeometry.setDrawRange(0, visible);

    renderer.render(scene, camera);
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function faceOrigin() {
    const dir = latLonToVec(Math.max(-89, Math.min(89, settings.lat - 25)), settings.lon);
    camera.position.copy(dir.multiplyScalar(CAMERA_DISTANCE));
    controls.target.set(0, 0, 0);
    controls.update();
  }

  function applyLook() {
    const s = settings;
    renderer.setClearColor(s.bg);
    sphereMaterial.color.set(s.sphereColor);
    gridMaterial.color.set(s.gridColor);
    grid.visible = s.grid;
    lineMaterial.color.set(s.lineColor);
    lineMaterial.linewidth = s.lineWidth;
    dotMaterial.color.set(s.dotColor);
    dotMaterial.size = s.dotSize;
    dots.visible = s.dotSize > 0;
    originDot.visible = s.originDot && s.dotSize > 0;
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  resize();
  buildFlights();
  applyLook();
  faceOrigin();
  raf = requestAnimationFrame(frame);

  return {
    update(next) {
      settings = next;
      buildFlights();
      applyLook();
    },
    replay() {
      start = performance.now();
    },
    faceOrigin,
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      clearFlights();
      sphere.geometry.dispose();
      grid.geometry.dispose();
      dotGeometry.dispose();
      originGeometry.dispose();
      [sphereMaterial, gridMaterial, lineMaterial, dotMaterial, dotTexture].forEach((x) => x.dispose());
      renderer.dispose();
    },
  };
}
