import { SKULLZ_FAMILY } from "../injectFonts.js";
import { restoreCharBox } from "../glyphBounds.js";

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

const SKULL_SIZE = 0.6375;

function homeTransform(el, fontScale = 1) {
  const y = Number(el.dataset.tfxLetterY) || 0;
  const t = y ? `translateY(${y}px)` : "";
  el.querySelectorAll(".tfx-glyph, .tfx-glow").forEach((node) => {
    node.style.fontSize = fontScale === 1 ? "" : `${fontScale}em`;
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

const MORPH = { duration: 0.25, ease: "power2.out" };

function restoreFace(el) {
  el.style.fontFamily = "";
  el.style.fontWeight = "";
  clearFace(el);
  paintText(el, el.dataset.tfxChar || "");
  restoreCharBox(el);
  homeTransform(el);
}

function glyphBox(el) {
  const r = el.querySelector(".tfx-glyph")?.getBoundingClientRect();
  return r && r.height ? r : null;
}

export function fontCycle(opts, api) {
  let timer = 0;
  let index = 0;
  let current = null;
  let original = "";
  let morphNext = false;

  function fontsOf() {
    const fonts = [...(opts.fonts || [])];
    const base = api.getConfig().base?.fontFamily;
    if (!base) return fonts;
    const baseFace = faceName(base);
    if (fonts.some((font) => faceName(font) === baseFace)) return fonts;
    return [base, ...fonts];
  }

  function isHomeFace(spec) {
    return !glyphOf(spec) && faceName(spec) === faceName(api.getConfig().base?.fontFamily);
  }

  function morphScale(el, before) {
    const after = glyphBox(el);
    const from = before && after ? before.height / after.height : 1;
    api.gsap.killTweensOf(el, "--tfx-cycle-scale");
    if (!Number.isFinite(from) || Math.abs(from - 1) < 0.02) {
      el.style.removeProperty("--tfx-cycle-scale");
      return;
    }
    api.gsap.fromTo(el, { "--tfx-cycle-scale": from }, { ...MORPH, "--tfx-cycle-scale": 1, overwrite: "auto" });
  }

  function apply(el, spec) {
    const home = el.dataset.tfxChar || original;
    const before = morphNext && !api.reduceMotion ? glyphBox(el) : null;
    const glyph = glyphOf(spec);
    if (glyph) {
      paintFace(el, `"${SKULLZ_FAMILY}"`, "400");
      paintText(el, glyph);
      homeTransform(el, SKULL_SIZE);
    } else {
      const base = api.getConfig().base || {};
      const weight = faceName(spec) === faceName(base.fontFamily) ? String(base.fontWeight || 400) : "400";
      paintFace(el, spec, weight);
      paintText(el, home);
      homeTransform(el);
    }
    if (morphNext) {
      morphNext = false;
      if (before) morphScale(el, before);
    }
  }

  function restore(el, morph) {
    if (!el) return;
    const before = morph && !api.reduceMotion ? glyphBox(el) : null;
    api.gsap.killTweensOf(el, "--tfx-cycle-scale");
    restoreFace(el);
    if (before) morphScale(el, before);
    else el.style.removeProperty("--tfx-cycle-scale");
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
    const first = fonts.findIndex((font) => !isHomeFace(font));
    index = first >= 0 ? first : 0;
    morphNext = true;
    tick(el, fonts[index]);
    timer = window.setInterval(() => {
      index = (index + 1) % fonts.length;
      if (current) tick(current, fonts[index]);
    }, opts.interval ?? 90);
  }

  function stop(el, morph = true) {
    halt();
    morphNext = false;
    if (el) restore(el, morph);
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
      else if (el) restore(el, true);
    },
    leaveField() {
      stop(current);
    },
    update(next) {
      Object.assign(opts, next);
    },
    destroy() {
      stop(current, false);
    },
  };
}
