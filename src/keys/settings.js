const STORAGE_KEY = "textfx.keys.v1";

/** Adobe Fonts faces are licensed for local use only, so they resolve through local() and are never bundled. */
export const MAIN_FACES = [
  {
    id: "nhg-ds-96",
    label: "Display 96 Black Italic",
    family: "KT NHG DS 96",
    local: ["NHaasGroteskDSPro-96BlkIt", "Neue Haas Grotesk Display Pro 96 Black Italic"],
    italic: true,
  },
  {
    id: "nhg-ds-76",
    label: "Display 76 Bold Italic",
    family: "KT NHG DS 76",
    local: ["NHaasGroteskDSPro-76BdIt", "Neue Haas Grotesk Display Pro 76 Bold Italic"],
    italic: true,
  },
  {
    id: "nhg-tx-76",
    label: "Text 76 Bold Italic",
    family: "KT NHG TX 76",
    local: ["NHaasGroteskTXPro-76BdIt", "Neue Haas Grotesk Text Pro 76 Bold Italic"],
    italic: true,
  },
  {
    id: "nhg-ds-95",
    label: "Display 95 Black",
    family: "KT NHG DS 95",
    local: ["NHaasGroteskDSPro-95Blk", "Neue Haas Grotesk Display Pro 95 Black"],
    italic: false,
  },
  {
    id: "nhg-ds-75",
    label: "Display 75 Bold",
    family: "KT NHG DS 75",
    local: ["NHaasGroteskDSPro-75Bd", "Neue Haas Grotesk Display Pro 75 Bold"],
    italic: false,
  },
];

export const CYCLE_CATALOG = [
  { id: "pixelify", label: "Pixelify Sans", family: "Pixelify Sans", enabled: true },
  { id: "coral", label: "Coral Pixels", family: "Coral Pixels", enabled: true },
  { id: "consent", label: "Manufacturing Consent", family: "Manufacturing Consent", enabled: true },
  { id: "dotgothic", label: "DotGothic16", family: "DotGothic16", enabled: true },
  { id: "tiltortion", label: "Tiltortion", family: "Tiltortion", enabled: true },
  { id: "erki", label: "ERKI 30", family: "ERKI 30", enabled: true },
  { id: "beast", label: "Beast", family: "Beast", enabled: true },
  { id: "monument", label: "PP Monument Wide", family: "PP Monument Wide", weight: 900, enabled: true },
  {
    id: "nhg-thin",
    label: "NHG 26 Thin Italic",
    family: "KT NHG DS 26",
    local: ["NHaasGroteskDSPro-26ThIt", "Neue Haas Grotesk Display Pro 26 Thin Italic"],
    enabled: true,
  },
  {
    id: "nhg-roman",
    label: "NHG 55 Roman",
    family: "KT NHG DS 55",
    local: ["NHaasGroteskDSPro-55Rg", "Neue Haas Grotesk Display Pro 55 Roman"],
    enabled: false,
  },
  { id: "menlo", label: "Menlo", family: "Menlo", enabled: true },
  { id: "times", label: "Times New Roman Italic", family: "Times New Roman", style: "italic", enabled: false },
  { id: "didot", label: "Didot", family: "Didot", enabled: false },
  { id: "skullz", label: "SkullZ", family: "SkullZ", enabled: false },
];

export const EASES = ["expo.out", "power4.out", "power2.out", "back.out(2)", "elastic.out(1, 0.4)", "none"];

export function defaultSettings() {
  return {
    face: "nhg-ds-96",
    fontSize: 96,
    tracking: -0.02,
    leading: 1,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    align: "left",
    valign: "center",
    maxWidth: 1400,
    glide: 40,

    fonts: CYCLE_CATALOG.map((font) => ({ ...font })),
    order: "random",
    steps: 7,
    interval: 38,
    jitter: 0.3,
    scramble: 0.25,
    matchHeight: true,
    sizeJitter: 0.15,
    shake: 0.03,
    landScale: 1.18,
    landDuration: 260,
    landEase: "expo.out",

    box: true,
    boxStyle: "outline",
    boxPad: 0.04,
    boxLine: 1.5,
    fillChance: 0.2,
    boxHold: 90,
    label: true,
    labelSize: 11,

    caret: true,
    caretStyle: "bar",
    blink: 355,

    sound: true,
    soundVolume: 0.8,
    soundVariance: 0.08,
    flipVolume: 0.5,

    bg: "#000000",
    text: "#ffffff",
    cycle: "#ffffff",
    boxColor: "#ff5cd9",
    labelColor: "#bbff00",
    caretColor: "#c8ff00",
  };
}

export function loadSettings() {
  const d = defaultSettings();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return d;
    const fonts = Array.isArray(saved.fonts) ? saved.fonts : d.fonts;
    const known = new Set(fonts.map((font) => font.id));
    if (saved.blink === 530) saved.blink = d.blink;
    return {
      ...d,
      ...saved,
      fonts: [...fonts, ...d.fonts.filter((font) => !known.has(font.id))],
    };
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

export function mainFace(settings) {
  return MAIN_FACES.find((face) => face.id === settings.face) || MAIN_FACES[0];
}
