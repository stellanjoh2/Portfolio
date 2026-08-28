import videoUrl from "../assets/featureloop-virtualstudio.mp4?url";
import { isSafari } from "./browser.js";

export const DEFAULT_TEXT = "Welcome to my stupid homepage";

export const DEFAULT_BASE_FONT = '"PP Monument Wide"';

export const DEFAULT_VIDEO = videoUrl;

export const ENGINE_KEYS = ["chrome", "safari"];

const DEFAULT_VIDEO_TUNING = {
  scale: 1.45,
  z: 1.4,
  front: 0.165,
  radius: 36,
  parallax: 0.95,
};

export const CYCLE_FONTS = [
  '"Pixelify Sans", sans-serif',
  '"Coral Pixels", sans-serif',
  '"Manufacturing Consent", sans-serif',
  '"DotGothic16", sans-serif',
  '"Tiltortion", sans-serif',
  '"ERKI 30", sans-serif',
  '"Beast", sans-serif',
  "glyph:f",
];

export function defaultConfig() {
  return {
    text: DEFAULT_TEXT,
    base: {
      fontFamily: DEFAULT_BASE_FONT,
      fontWeight: 900,
      fontSize: 212,
      letterSpacing: -0.06,
      lineHeight: 0.95,
      width: 1568,
      align: "center",
      color: "#3600b3",
    },
    hover: {
      duration: 0.18,
      ease: "elastic.out(1, 0.5)",
      originY: 50,
    },
    word: {
      effects: [
        { type: "color", color: "#e1ff00" },
        { type: "glow", size: 14, color: "#c8ff00" },
      ],
    },
    letter: {
      effects: [
        { type: "color", color: "#ffffff" },
        { type: "scale", amount: 1.5 },
        { type: "glow", size: 4, color: "#ffffff" },
        {
          type: "fontCycle",
          fonts: CYCLE_FONTS,
          interval: 90,
        },
        { type: "magnetic", strength: 80, radius: 360, follow: 1.2 },
        { type: "fisheye", strength: 1, radius: 2661, look: 1 },
        { type: "sound" },
        { type: "box", details: true, extraWidth: 0 },
      ],
    },
    video: {
      src: DEFAULT_VIDEO,
      chrome: { ...DEFAULT_VIDEO_TUNING },
      safari: { scale: DEFAULT_VIDEO_TUNING.scale },
    },
  };
}

export function activeEngineKey() {
  return isSafari() ? "safari" : "chrome";
}

export function normalizeVideo(video = {}) {
  const d = defaultConfig().video;
  const { src, scale, z, front, radius, parallax } = video;
  const legacy = { scale, z, front, radius, parallax };
  const hasLegacy = Object.values(legacy).some((v) => v !== undefined);
  const chrome = {
    ...d.chrome,
    ...(video.chrome || {}),
    ...(hasLegacy ? legacy : {}),
  };
  const safariScale =
    video.safari?.scale ??
    (hasLegacy ? legacy.scale : undefined) ??
    chrome.scale ??
    d.safari.scale;
  return {
    src: video.src ?? src ?? d.src,
    chrome,
    safari: { scale: safariScale },
  };
}

export function resolveConfig(config) {
  const video = normalizeVideo(config.video);
  const tuning =
    activeEngineKey() === "safari"
      ? { ...video.chrome, scale: video.safari.scale }
      : video.chrome;
  return {
    ...config,
    video: { src: video.src, ...tuning },
  };
}

export function patchEngineVideo(config, engine, patch) {
  const video = normalizeVideo(config.video);
  if (engine === "safari") {
    const next = { ...config, video: { ...video, safari: { ...video.safari } } };
    if (patch.scale !== undefined) next.video.safari.scale = patch.scale;
    return next;
  }
  return {
    ...config,
    video: {
      ...video,
      chrome: { ...video.chrome, ...patch },
    },
  };
}

export function normalizeConfig(input = {}) {
  const d = defaultConfig();
  return {
    text: input.text ?? d.text,
    base: { ...d.base, ...(input.base || {}) },
    hover: { ...d.hover, ...(input.hover || {}) },
    word: {
      effects: Array.isArray(input.word?.effects)
        ? input.word.effects
        : d.word.effects,
    },
    letter: {
      effects: Array.isArray(input.letter?.effects)
        ? input.letter.effects
        : d.letter.effects,
    },
    video: normalizeVideo(input.video || d.video),
  };
}

export function effectTypes(config, layer) {
  return (config[layer]?.effects || []).map((e) => e.type).join(",");
}

export function hasEffect(config, layer, type) {
  return (config[layer]?.effects || []).some((e) => e.type === type);
}

export function getEffect(config, layer, type) {
  return (config[layer]?.effects || []).find((e) => e.type === type);
}

export function setEffect(config, layer, type, enabled, spec = {}) {
  const current = config[layer]?.effects || [];
  if (enabled) {
    if (current.some((e) => e.type === type)) {
      return patchEffect(config, layer, type, spec);
    }
    return {
      ...config,
      [layer]: { ...config[layer], effects: [...current, { type, ...spec }] },
    };
  }
  return {
    ...config,
    [layer]: { ...config[layer], effects: current.filter((e) => e.type !== type) },
  };
}

export function patchEffect(config, layer, type, patch) {
  return {
    ...config,
    [layer]: {
      ...config[layer],
      effects: (config[layer]?.effects || []).map((e) =>
        e.type === type ? { ...e, ...patch } : e
      ),
    },
  };
}

const GLYPH_TYPES = ["fontCycle", "ascii", "dotgrid"];

export function setGlyphMode(config, mode) {
  let effects = (config.letter?.effects || []).filter(
    (e) => !GLYPH_TYPES.includes(e.type)
  );
  if (mode === "cycle") {
    effects.push({
      type: "fontCycle",
      fonts: getEffect(config, "letter", "fontCycle")?.fonts || CYCLE_FONTS,
      interval: getEffect(config, "letter", "fontCycle")?.interval || 90,
    });
  } else if (mode === "ascii") {
    effects.push({ type: "ascii", cols: 8, rows: 12 });
  } else if (mode === "dotgrid") {
    effects.push({ type: "dotgrid", cols: 7, rows: 9 });
  }
  return { ...config, letter: { ...config.letter, effects } };
}

export function glyphMode(config) {
  if (hasEffect(config, "letter", "ascii")) return "ascii";
  if (hasEffect(config, "letter", "dotgrid")) return "dotgrid";
  if (hasEffect(config, "letter", "fontCycle")) return "cycle";
  return "none";
}
