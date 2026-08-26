import { sampleGlyph } from "../glyphSample.js";

export function dotgrid(opts, api) {
  let wrap = null;

  function clear() {
    if (wrap?.parentNode) wrap.remove();
    wrap = null;
  }

  return {
    enter({ el, config }) {
      clear();
      if (!el) return;
      const glyph = el.querySelector(".tfx-glyph");
      const ch = glyph?.textContent || "";
      if (!ch.trim()) return;
      const cols = opts.cols ?? 7;
      const rows = opts.rows ?? 9;
      const grid = sampleGlyph(ch, {
        fontFamily: config.base.fontFamily,
        fontWeight: config.base.fontWeight,
        cols,
        rows,
      });
      const canvas = document.createElement("canvas");
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = el.offsetWidth || 80;
      const h = el.offsetHeight || 80;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      const cellW = w / cols;
      const cellH = h / rows;
      const color = (config.letter.effects || []).find((e) => e.type === "color")?.color || "#ffffff";
      ctx.fillStyle = color;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = grid[y][x];
          if (v < 0.12) continue;
          const r = Math.max(1.2, Math.min(cellW, cellH) * 0.32 * (0.35 + v));
          ctx.beginPath();
          ctx.arc((x + 0.5) * cellW, (y + 0.5) * cellH, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      wrap = document.createElement("div");
      wrap.className = "tfx-dotgrid";
      wrap.appendChild(canvas);
      glyph.style.visibility = "hidden";
      el.appendChild(wrap);
    },
    leave({ el }) {
      const glyph = el?.querySelector(".tfx-glyph");
      if (glyph) glyph.style.visibility = "";
      clear();
    },
    update(next) {
      Object.assign(opts, next);
    },
    destroy() {
      clear();
    },
  };
}
