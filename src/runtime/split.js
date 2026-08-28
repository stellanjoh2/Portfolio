import { injectFonts } from "./injectFonts.js";
import { applyVideoStyles } from "./safariVideo.js";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { pinGlyphOrigin, placeLetters } from "./glyphBounds.js";

gsap.registerPlugin(SplitText);

function makeVideo(video) {
  if (!video?.src) return null;
  const el = document.createElement("video");
  el.className = "tfx-video";
  el.src = video.src;
  el.muted = true;
  el.defaultMuted = true;
  el.loop = true;
  el.playsInline = true;
  el.autoplay = true;
  el.preload = "auto";
  el.setAttribute("muted", "");
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "");
  el.setAttribute("aria-hidden", "true");
  el.play().catch(() => {});
  return el;
}

export function applyBase(root, config) {
  root.style.fontFamily = config.base.fontFamily;
  root.style.fontWeight = String(config.base.fontWeight);
  root.style.fontSize = `${config.base.fontSize}px`;
  root.style.letterSpacing = `${config.base.letterSpacing ?? -0.03}em`;
  root.style.lineHeight = String(config.base.lineHeight ?? 1.05);
  root.style.setProperty("--tfx-leading", String(config.base.lineHeight ?? 1.05));
  root.style.maxWidth = `${config.base.width ?? 1375}px`;
  const align = config.base.align === "center" || config.base.align === "right" ? config.base.align : "left";
  root.style.textAlign = align;
  root.style.marginLeft = align === "left" ? "0" : "auto";
  root.style.marginRight = align === "right" ? "0" : "auto";
  root.style.color = config.base.color;
  root.style.setProperty("--tfx-color-neutral", config.base.color);
  applyVideoStyles(root, config.video);
  root.querySelectorAll(".tfx-char").forEach((char) => {
    char.classList.toggle("tfx-char--space", !String(char.dataset.tfxChar || "").trim());
  });
  root.classList.toggle("tfx-root--boxes", Boolean(config.base.boxes));
  if (root.querySelector(".tfx-char")) placeLetters(root, config.hover.originY ?? 50);
}

export async function splitRoot(root, config, isAborted = () => false) {
  if (isAborted()) return null;
  root.classList.add("tfx-root");
  applyBase(root, config);

  const textEl = document.createElement("div");
  textEl.className = "tfx-text";
  textEl.textContent = config.text;
  const hud = document.createElement("div");
  hud.className = "tfx-hud";
  hud.innerHTML = `
    <div class="tfx-box tfx-box--word"><span></span></div>
    <div class="tfx-box tfx-box--letter"><span></span></div>
    <div class="tfx-details"></div>
  `;
  const videoEl = makeVideo(config.video);
  root.replaceChildren(...[videoEl, textEl, hud].filter(Boolean));
  applyVideoStyles(root, config.video);

  await injectFonts();
  await document.fonts.ready;
  await document.fonts
    .load(
      `${config.base.fontWeight} ${config.base.fontSize}px ${config.base.fontFamily}`,
      config.text
    )
    .catch(() => {});
  if (isAborted()) return null;

  const split = SplitText.create(textEl, {
    type: "words,chars",
    wordsClass: "tfx-word",
    charsClass: "tfx-char",
    tag: "span",
    aria: "auto",
  });

  split.chars.forEach((char, i) => {
    const text = char.textContent;
    char.dataset.tfxIndex = String(i);
    char.dataset.tfxChar = text;
    if (!text.trim()) char.classList.add("tfx-char--space");

    const wordGlow = document.createElement("span");
    wordGlow.className = "tfx-glow tfx-glow--word";
    wordGlow.setAttribute("aria-hidden", "true");
    wordGlow.textContent = text;

    const letterGlow = document.createElement("span");
    letterGlow.className = "tfx-glow tfx-glow--letter";
    letterGlow.setAttribute("aria-hidden", "true");
    letterGlow.textContent = text;

    const glyph = document.createElement("span");
    glyph.className = "tfx-glyph";
    glyph.textContent = text;

    char.textContent = "";
    char.append(wordGlow, letterGlow, glyph);
    pinGlyphOrigin(char, glyph);
  });
  placeLetters(root, config.hover.originY ?? 50);

  if (isAborted()) {
    split.revert();
    return null;
  }

  return { split, textEl, hud };
}
