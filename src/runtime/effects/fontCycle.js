import { SKULLZ_FAMILY } from "../injectFonts.js";
import { fitGlyphToInk, inkOffsetToOrigin, restoreCharBox } from "../glyphBounds.js";

function glyphOf(spec) {
  if (typeof spec !== "string" || !spec.startsWith("glyph:")) return null;
  return spec.slice(6);
}

function faceName(spec) {
  return String(spec || "")
    .replace(/['"]/g, "")
    .split(",")[0]
    .trim()
    .toLowerCase();
}

function paintText(el, text) {
  el.querySelectorAll(".tfx-glyph, .tfx-glow").forEach((node) => {
    node.textContent = text;
  });
}

function alignInk(el, lift = false) {
  const glyph = el.querySelector(".tfx-glyph");
  const nodes = el.querySelectorAll(".tfx-glyph, .tfx-glow");
  if (!glyph) return;
  fitGlyphToInk(el, glyph);
  nodes.forEach((node) => {
    node.style.transform = "";
  });
  const { x, y } = inkOffsetToOrigin(el, glyph, { snapBottom: true });
  let ty = lift ? y - el.offsetHeight * 0.25 : y;
  const t = `translate(${x}px, ${ty}px)`;
  nodes.forEach((node) => {
    node.style.transform = t;
  });
}

function paintFace(el, family, weight) {
  el.querySelectorAll(".tfx-glyph, .tfx-glow").forEach((node) => {
    node.style.fontFamily = family;
    node.style.fontWeight = weight;
  });
}

function clearFace(el) {
  el.querySelectorAll(".tfx-glyph, .tfx-glow").forEach((node) => {
    node.style.fontFamily = "";
    node.style.fontWeight = "";
    node.style.fontSize = "";
    node.style.transform = "";
  });
}

function restore(el) {
  if (!el) return;
  el.style.fontFamily = "";
  el.style.fontWeight = "";
  clearFace(el);
  paintText(el, el.dataset.tfxChar || "");
  restoreCharBox(el);
}

export function fontCycle(opts, api) {
  let timer = 0;
  let index = 0;
  let current = null;
  let original = "";

  function fontsOf() {
    const fonts = [...(opts.fonts || [])];
    const base = api.getConfig().base?.fontFamily;
    if (!base) return fonts;
    const baseFace = faceName(base);
    if (fonts.some((font) => faceName(font) === baseFace)) return fonts;
    return [base, ...fonts];
  }

  function apply(el, spec) {
    const home = el.dataset.tfxChar || original;
    const glyph = glyphOf(spec);
    if (glyph) {
      paintFace(el, `"${SKULLZ_FAMILY}"`, "400");
      paintText(el, glyph);
    } else {
      const base = api.getConfig().base || {};
      const weight = faceName(spec) === faceName(base.fontFamily) ? String(base.fontWeight || 400) : "400";
      paintFace(el, spec, weight);
      paintText(el, home);
    }
    alignInk(el, Boolean(glyph));
  }

  function tick(el, spec) {
    apply(el, spec);
    api.root.dispatchEvent(new Event("tfxcycle"));
  }

  function halt() {
    if (timer) clearInterval(timer);
    timer = 0;
  }

  function startCycle(el, fonts) {
    halt();
    if (!fonts.length) return;
    index = 0;
    tick(el, fonts[0]);
    timer = window.setInterval(() => {
      index = (index + 1) % fonts.length;
      if (current) tick(current, fonts[index]);
    }, opts.interval ?? 90);
  }

  function stop(el) {
    halt();
    if (el) restore(el);
    current = null;
    original = "";
  }

  return {
    enter({ el }) {
      if (api.reduceMotion || !el) return;
      if (current && current !== el) stop(current);
      current = el;
      original = el.dataset.tfxChar || el.querySelector(".tfx-glyph")?.textContent || "";
      startCycle(el, fontsOf());
    },
    leave({ el }) {
      if (el === current) stop(el);
      else if (el) restore(el);
    },
    leaveField() {
      stop(current);
    },
    update(next) {
      Object.assign(opts, next);
    },
    destroy() {
      stop(current);
    },
  };
}
