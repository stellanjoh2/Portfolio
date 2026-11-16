const STORAGE_KEY = "textfx.travel.v1";

export const EASES = ["linear", "sine.inOut", "cubic.inOut", "cubic.out", "expo.inOut", "expo.out"];

export function defaultSettings() {
  return {
    lat: 57.71,
    lon: 11.97,

    count: 21,
    seed: 1,
    minDist: 20,
    maxDist: 180,
    bearingJitter: 0.5,
    altitude: 0.02,
    arc: 0.12,

    duration: 3.5,
    ease: "cubic.inOut",
    stagger: 0.4,
    speedVariance: 0.2,
    hold: 1,
    loop: true,

    lineWidth: 1.25,
    dotSize: 17.5,
    originDot: true,
    keepDots: true,
    grid: true,

    lineColor: "#ffffff",
    dotColor: "#c8ff00",
    sphereColor: "#000000",
    gridColor: "#000000",
    bg: "#000000",
  };
}

export function loadSettings() {
  const d = defaultSettings();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return saved && typeof saved === "object" ? { ...d, ...saved } : d;
  } catch {
    return d;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* storage full or blocked */
  }
}
