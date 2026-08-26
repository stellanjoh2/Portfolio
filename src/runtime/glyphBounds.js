const MIN_FIT = 0.2;
const MAX_FIT = 12;
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

  const result = found
    ? { width: maxX - minX + 1, height: maxY - minY + 1 }
    : { width: 0, height: 0 };
  inkCache.set(key, result);
  return result;
}

function inkBox(charEl, glyphEl) {
  const box = charEl.getBoundingClientRect();
  if (!box.width || !box.height) return null;

  const node = [...glyphEl.childNodes].find(
    (child) => child.nodeType === Node.TEXT_NODE && child.textContent
  );
  if (!node) return null;

  const range = document.createRange();
  range.selectNodeContents(node);
  const ink = range.getBoundingClientRect();
  if (!ink.width && !ink.height) return null;
  return { box, ink };
}

function rangeCenter(charEl, glyphEl) {
  const measured = inkBox(charEl, glyphEl);
  if (!measured) return { x: 0.5, y: 0.5, bottom: 1 };
  const { box, ink } = measured;
  return {
    x: (ink.left + ink.width / 2 - box.left) / box.width,
    y: (ink.top + ink.height / 2 - box.top) / box.height,
    bottom: (ink.bottom - box.top) / box.height,
  };
}

export function pinGlyphOrigin(charEl, glyphEl) {
  charEl.style.width = `${charEl.offsetWidth}px`;
  charEl.style.height = `${charEl.offsetHeight}px`;
  const ink = rangeCenter(charEl, glyphEl);
  charEl.style.setProperty("--tfx-ox", `${ink.x * 100}%`);
  charEl.dataset.tfxOx = `${ink.x * 100}%`;
  charEl.dataset.tfxW = String(charEl.offsetWidth);
  charEl.dataset.tfxInkY = String(ink.y);
  charEl.dataset.tfxInkBottom = String(ink.bottom);
  const cs = getComputedStyle(glyphEl);
  const raster = rasterInk(cs.fontFamily, cs.fontWeight, glyphEl.textContent);
  if (raster.height) charEl.dataset.tfxInkH = String(raster.height);
}

export function fitGlyphToInk(charEl, glyphEl) {
  const nodes = charEl.querySelectorAll(".tfx-glyph, .tfx-glow");
  nodes.forEach((node) => {
    node.style.fontSize = "";
  });
  const target = Number(charEl.dataset.tfxInkH);
  const text = glyphEl.textContent || charEl.dataset.tfxChar || "";
  if (!target || !text) return;
  const cs = getComputedStyle(glyphEl);
  const raster = rasterInk(cs.fontFamily, cs.fontWeight, text);
  if (!raster.height) return;
  const em = parseFloat(cs.fontSize) || 16;
  let factor = Math.min(MAX_FIT, Math.max(MIN_FIT, target / raster.height));
  const visualH = raster.height * (em / SAMPLE) * factor;
  const maxH = charEl.offsetHeight;
  if (maxH && visualH > maxH) factor *= maxH / visualH;
  if (Math.abs(factor - 1) < 0.03) return;
  nodes.forEach((node) => {
    node.style.fontSize = `${factor}em`;
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
  if (ink.bottom <= box.bottom + 0.5) return 0;
  return (box.bottom - ink.bottom) / parentScaleY;
}

export function inkOffsetToOrigin(charEl, glyphEl) {
  const ox = parseFloat(charEl.style.getPropertyValue("--tfx-ox")) / 100 || 0.5;
  const floor = Number(charEl.dataset.tfxInkBottom);
  const ink = rangeCenter(charEl, glyphEl);
  const yTarget = Number.isFinite(floor) ? floor : 1;
  return {
    x: (ox - ink.x) * charEl.offsetWidth,
    y: (yTarget - ink.bottom) * charEl.offsetHeight,
  };
}
