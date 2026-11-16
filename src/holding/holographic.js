import * as THREE from "three";

// Port of Orby's "holographic" Shader Lab preset (surface detail, lift/crush and hue shift off).

const VERTEX = /* glsl */ `
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
void main() {
  vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const FRAGMENT = /* glsl */ `
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
uniform float uTime;
uniform float uPatternScale;
uniform float uIntensity;
uniform float uBrightness;

void main() {
  vec3 V = normalize(cameraPosition - vWorldPosition);
  // Interpolated normals can collapse to ~zero across hard seams; normalize() would emit NaN.
  float nLen = length(vWorldNormal);
  vec3 N = nLen > 1e-4 ? vWorldNormal / nLen : V;
  float ndv = max(dot(N, V), 1e-4);
  float F = 1.0 - ndv;
  float inten = clamp(uIntensity, 0.0, 2.0);
  float d = inten - 1.0;
  float up = max(d, 0.0);
  float down = max(-d, 0.0);

  float fresnelWide = pow(F, 1.28);
  float fresnel = pow(F, 2.05);
  float fresnelTight = pow(F, 5.0);

  float sc = clamp(uPatternScale, 0.1, 5.0);
  float logMin = -3.321928094887362;
  float logMax = 2.321928094887362;
  float u = (log2(sc) - logMin) / (logMax - logMin);
  float wFreq = mix(2.923, 0.25, u);
  vec3 pw = vWorldPosition * wFreq;
  float t = uTime * (wFreq / 1.35);

  float oil =
    sin(pw.x * 0.72 + t * 0.72) * cos(pw.y * 0.78 - t * 0.62) +
    sin(pw.z * 0.68 + t * 0.42) * 0.45 +
    sin(dot(pw, vec3(0.72, 1.02, 0.58)) * 1.05 + t * 0.85) * 0.35;
  oil *= 1.0 - down * 0.45 + up * 0.72;

  float film =
    fresnel * (6.2 + up * 2.2 - down * 2.0) +
    oil * (1.45 + up * 0.6 - down * 0.5) +
    dot(N, vec3(0.15, 0.97, 0.18)) * (0.38 + up * 0.14 - down * 0.16) +
    t * (0.48 + up * 0.2 - down * 0.2);

  float chrom = fresnel * fresnel * (1.55 + up * 0.2 - down * 0.7);
  vec3 phase = film * vec3(3.45, 4.15, 4.95) + vec3(0.0, 2.2, 5.0);
  phase += vec3(chrom * 1.05, -chrom * 0.78, chrom * 0.92);

  vec3 holo = 0.5 + 0.53 * cos(phase);
  holo *= 0.96 + 0.04 * sin(film * 4.2 + t * 1.15);
  holo = pow(max(holo, vec3(0.0)), vec3(0.93 - down * 0.07 + up * 0.07));

  vec3 base = vec3(0.0035, 0.0065, 0.0165);
  float rimMix = fresnelWide * 0.82 + fresnel * 0.58 + fresnelTight * 0.38;
  rimMix = clamp(rimMix * (1.0 + up * 0.28 - down * 0.58), 0.0, 1.0);
  vec3 col = mix(base, holo, rimMix);

  vec3 L = normalize(vec3(0.42, 0.9, 0.36));
  vec3 H = normalize(L + V);
  float nh = max(dot(N, H), 0.0);
  float spHi = pow(nh, 228.0);
  float spLo = pow(nh, 68.0);
  vec3 specTint = mix(vec3(0.72, 0.94, 1.05), vec3(1.05, 0.58, 0.92), fresnel);
  col += specTint * (spHi * 1.25 + spLo * 0.38) * (0.18 + fresnel * 0.92) * (1.0 + up * 0.2 - down * 0.33);

  vec3 rimPink = vec3(1.0, 0.28, 0.82);
  col += fresnelTight * rimPink * (0.62 + up * 0.43 - down * 0.44);
  col += fresnel * vec3(0.1, 0.48, 1.05) * (0.48 + up * 0.24 - down * 0.26);
  col += oil * (fresnel + 0.15) * vec3(0.2, 0.88, 1.0) * (0.14 + up * 0.1 - down * 0.08);

  col = max(col * uBrightness, vec3(0.0));
  // NaN/Inf fails every comparison; one bad pixel turns into a black block after the bloom blur.
  if (!(col.r < 1e4 && col.g < 1e4 && col.b < 1e4)) col = vec3(0.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * @param {{ patternScale?: number, intensity?: number, brightness?: number }} [opts]
 *   Orby UI values; brightness is the Material slider (Orby doubles it internally).
 */
export function createHolographicMaterial({ patternScale = 1, intensity = 1, brightness = 1 } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPatternScale: { value: patternScale },
      uIntensity: { value: intensity },
      uBrightness: { value: brightness * 2 },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
  });
}
