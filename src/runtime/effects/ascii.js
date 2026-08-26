import { gridToAscii, sampleGlyph } from "../glyphSample.js";

export function ascii(opts, api) {
  let node = null;

  function clear() {
    if (node?.parentNode) node.remove();
    node = null;
  }

  return {
    enter({ el, config }) {
      clear();
      if (!el) return;
      const glyph = el.querySelector(".tfx-glyph");
      const ch = glyph?.textContent || "";
      if (!ch.trim()) return;
      const grid = sampleGlyph(ch, {
        fontFamily: config.base.fontFamily,
        fontWeight: config.base.fontWeight,
        cols: opts.cols ?? 8,
        rows: opts.rows ?? 12,
      });
      node = document.createElement("pre");
      node.className = "tfx-ascii";
      node.textContent = gridToAscii(grid);
      glyph.style.visibility = "hidden";
      el.appendChild(node);
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
