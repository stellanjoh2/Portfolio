// Paints DOM text and masked marks into a 2D canvas at their exact on-screen positions,
// so the WebGL composite can difference-blend them (CSS mix-blend-mode over WebGL fails on iOS).

const markImages = new Map();

function loadMarkImage(url) {
  let entry = markImages.get(url);
  if (!entry) {
    const img = new Image();
    entry = { img, ready: new Promise((resolve) => (img.onload = resolve)) };
    img.src = url;
    markImages.set(url, entry);
  }
  return entry;
}

/** Glyph-by-glyph so letter-spacing and kerning come straight from the browser's own layout. */
function paintText(ctx, el, color, origin) {
  const rootStyle = getComputedStyle(el);
  if (rootStyle.visibility === "hidden") return;
  const rootOpacity = Number(rootStyle.opacity);
  if (!(rootOpacity > 0)) return;

  ctx.font = `${rootStyle.fontStyle} ${rootStyle.fontWeight} ${rootStyle.fontSize} ${rootStyle.fontFamily}`;
  ctx.fillStyle = color;
  ctx.textBaseline = "alphabetic";
  const metrics = ctx.measureText("Hg");
  const ascent = metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent;
  const descent = metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent;

  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    // Per-word spans carry their own opacity during the staggered reveal.
    const wordStyle = getComputedStyle(node.parentElement);
    if (wordStyle.visibility === "hidden") continue;
    const opacity = rootOpacity * Number(wordStyle.opacity);
    if (!(opacity > 0)) continue;

    ctx.save();
    ctx.globalAlpha = opacity;
    const text = node.textContent;
    for (let i = 0; i < text.length; i++) {
      if (/\s/.test(text[i])) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const rect = range.getClientRects()[0];
      if (!rect) continue;
      const baseline = rect.top + (rect.height * ascent) / (ascent + descent);
      ctx.fillText(text[i], rect.left - origin.left, baseline - origin.top);
    }
    ctx.restore();
  }
}

function paintMark(ctx, el, color, origin, url) {
  const style = getComputedStyle(el);
  const opacity = Number(style.opacity);
  if (!(opacity > 0) || style.visibility === "hidden") return;
  const { img } = loadMarkImage(url);
  if (!img.complete || !img.naturalWidth) return;
  const rect = el.getBoundingClientRect();
  const dpr = ctx.getTransform().a;
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));
  const tint = document.createElement("canvas");
  tint.width = w;
  tint.height = h;
  const t = tint.getContext("2d");
  t.drawImage(img, 0, 0, w, h);
  t.globalCompositeOperation = "source-in";
  t.fillStyle = color;
  t.fillRect(0, 0, w, h);
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.drawImage(tint, rect.left - origin.left, rect.top - origin.top, rect.width, rect.height);
  ctx.restore();
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLElement} host — element the WebGL canvas covers (coordinates are relative to it)
 * @param {{ texts: { el: HTMLElement, color: string }[], marks: { el: HTMLElement, color: string, url: string }[], dpr: number }} opts
 */
export function paintUiMask(canvas, host, { texts, marks, dpr }) {
  const origin = host.getBoundingClientRect();
  const w = Math.max(1, Math.round(origin.width * dpr));
  const h = Math.max(1, Math.round(origin.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  for (const { el, color } of texts) paintText(ctx, el, color, origin);
  for (const { el, color, url } of marks) paintMark(ctx, el, color, origin, url);
}

export function markImagesReady(urls) {
  return Promise.all(urls.map((url) => loadMarkImage(url).ready));
}
