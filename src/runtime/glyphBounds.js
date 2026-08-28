const SAMPLE = 64;

const inkCache = new Map();

function canvasCtx() {
  const canvas = canvasCtx.el || (canvasCtx.el = document.createElement("canvas"));
  return canvas.getContext("2d", { willReadFrequently: true });
}

function rasterInk(family, weight, text) {
  const key = `${family}\0${weight}\0${text}`;
  const hit = inkCache.get(key);
  if (hit) return hit;

  const pad = SAMPLE * 2;
  const w = pad * 2 + SAMPLE * 4;
  const h = pad * 2 + SAMPLE * 4;
  const ctx = canvasCtx();
  const canvas = ctx.canvas;
  canvas.width = w;
  canvas.height = h;
  ctx.clearRect(0, 0, w, h);
  ctx.font = `${weight} ${SAMPLE}px ${family}`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = "#000";
  ctx.fillText(text || "H", pad, pad + SAMPLE);

  const data = ctx.getImageData(0, 0, w, h).data;
  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  let found = false;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] < 16) continue;
      found = true;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  const baselineY = pad + SAMPLE;
  const result = found
    ? {
        width: maxX - minX + 1,
        height: maxY - minY + 1,
        inkBottom: maxY - baselineY,
        inkTop: minY - baselineY,
        centerX: (minX + maxX) / 2 - pad,
      }
    : { width: 0, height: 0, inkBottom: 0, inkTop: 0, centerX: 0 };
  inkCache.set(key, result);
  return result;
}

function clientRect(left, top, width, height) {
  return {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
  };
}

export function glyphAnchor(glyphEl) {
  const text = glyphEl.textContent || "H";
  const cs = getComputedStyle(glyphEl);
  const em = parseFloat(cs.fontSize) || 16;
  const ow = glyphEl.offsetWidth || 0;
  const oh = glyphEl.offsetHeight || 0;
  const ctx = canvasCtx();
  ctx.font = `${cs.fontWeight} ${em}px ${cs.fontFamily}`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  const m = ctx.measureText(text);
  const fontAscent = m.fontBoundingBoxAscent ?? em * 0.8;
  const fontDescent = m.fontBoundingBoxDescent ?? em * 0.2;
  return {
    x: ow / 2,
    y: (oh - (fontAscent + fontDescent)) / 2 + fontAscent,
    em,
    advance: m.width,
    fontAscent,
    fontDescent,
    left: m.actualBoundingBoxLeft,
    right: m.actualBoundingBoxRight,
    ascent: m.actualBoundingBoxAscent,
    descent: m.actualBoundingBoxDescent,
    family: cs.fontFamily,
    weight: cs.fontWeight,
  };
}

function trueInkRect(glyphEl) {
  const text = glyphEl.textContent || "";
  if (!text.trim()) return null;
  const glyphBox = glyphEl.getBoundingClientRect();
  const ow = glyphEl.offsetWidth || 1;
  const oh = glyphEl.offsetHeight || 1;
  if (!glyphBox.width || !glyphBox.height) return null;
  const sx = glyphBox.width / ow;
  const sy = glyphBox.height / oh;
  const anchor = glyphAnchor(glyphEl);
  const originX = glyphBox.left + (ow - anchor.advance) * 0.5 * sx;
  const homeY = Number(glyphEl.closest(".tfx-char")?.dataset.tfxAnchorY);
  const baseline = glyphBox.top + (Number.isFinite(homeY) ? homeY : anchor.y) * sy;

  const raster = rasterInk(anchor.family, anchor.weight, text);
  if (raster.height) {
    const k = anchor.em / SAMPLE;
    return clientRect(
      originX + (raster.centerX * k - raster.width * k * 0.5) * sx,
      baseline + raster.inkTop * k * sy,
      raster.width * k * sx,
      raster.height * k * sy
    );
  }

  if (anchor.ascent == null) return null;
  return clientRect(
    originX - (anchor.left ?? 0) * sx,
    baseline - anchor.ascent * sy,
    ((anchor.right ?? anchor.advance) + (anchor.left ?? 0)) * sx,
    (anchor.ascent + (anchor.descent ?? 0)) * sy
  );
}

function inkBox(charEl, glyphEl) {
  const box = charEl.getBoundingClientRect();
  if (!box.width || !box.height) return null;
  const ink = trueInkRect(glyphEl);
  if (!ink || (!ink.width && !ink.height)) return null;
  return { box, ink };
}

function rangeCenter(charEl, glyphEl) {
  const measured = inkBox(charEl, glyphEl);
  if (!measured) return { x: 0.5, y: 0.5, bottom: 1 };
  const { box, ink } = measured;
  return {
    x: (ink.left + ink.width / 2 - box.left) / box.width,
    y: (ink.top + ink.height / 2 - box.top) / box.height,
    bottom: (ink.top + ink.height - box.top) / box.height,
  };
}

export function inkClientRect(charEl) {
  const glyph = charEl.querySelector(".tfx-glyph");
  if (!glyph) return charEl.getBoundingClientRect();
  return trueInkRect(glyph) || charEl.getBoundingClientRect();
}

export function pinGlyphOrigin(charEl, glyphEl) {
  charEl.style.width = `${charEl.offsetWidth}px`;
  charEl.style.height = `${charEl.offsetHeight}px`;
  const ink = rangeCenter(charEl, glyphEl);
  charEl.style.setProperty("--tfx-ox", `${ink.x * 100}%`);
  charEl.dataset.tfxOx = `${ink.x * 100}%`;
  charEl.dataset.tfxW = String(charEl.offsetWidth);
  charEl.dataset.tfxInkY = String(ink.y);
  charEl.dataset.tfxAnchorY = String(glyphAnchor(glyphEl).y);
}

export function inkShiftY(charEl, glyphEl, t) {
  const measured = inkBox(charEl, glyphEl);
  if (!measured) return 0;
  const { box, ink } = measured;
  const k = box.height / (charEl.offsetHeight || 1) || 1;
  const slack = Math.max(0, (box.height - ink.height) / k);
  const currentTop = (ink.top - box.top) / k;
  return slack * t - currentTop;
}

export function placeLetters(root, originY) {
  const t = Math.max(0, Math.min(100, originY ?? 50)) / 100;
  root.dataset.tfxOriginY = String(originY ?? 50);
  root.querySelectorAll(".tfx-char").forEach((char) => {
    if (char.classList.contains("tfx-char--space")) return;
    char.dataset.tfxOriginT = String(t);
    if (char.classList.contains("tfx-char--hot")) return;
    const glyph = char.querySelector(".tfx-glyph");
    if (!glyph) return;
    const nodes = char.querySelectorAll(".tfx-glyph, .tfx-glow");
    nodes.forEach((node) => {
      node.style.transform = "";
    });
    const y = inkShiftY(char, glyph, t);
    char.dataset.tfxLetterY = String(y);
    const tr = y ? `translateY(${y}px)` : "";
    nodes.forEach((node) => {
      node.style.transform = tr;
    });
    const ink = rangeCenter(char, glyph);
    char.dataset.tfxInkY = String(ink.y);
    char.style.setProperty("--tfx-oy", `${ink.y * 100}%`);
  });
}

export function restoreCharBox(charEl) {
  if (charEl.dataset.tfxW) charEl.style.width = `${charEl.dataset.tfxW}px`;
  if (charEl.dataset.tfxOx) charEl.style.setProperty("--tfx-ox", charEl.dataset.tfxOx);
}

export function liftInkIntoBox(charEl, glyphEl) {
  const measured = inkBox(charEl, glyphEl);
  if (!measured) return 0;
  const { box, ink } = measured;
  const parentScaleY = box.height / (charEl.offsetHeight || 1) || 1;
  const inkBottom = ink.top + ink.height;
  if (inkBottom <= box.bottom + 0.5) return 0;
  return (box.bottom - inkBottom) / parentScaleY;
}
