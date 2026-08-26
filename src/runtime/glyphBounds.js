function rangeCenter(charEl, glyphEl) {
  const box = charEl.getBoundingClientRect();
  if (!box.width || !box.height) return { x: 0.5, y: 0.5 };

  const text = [...glyphEl.childNodes].find(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent
  );
  if (!text) return { x: 0.5, y: 0.5 };

  const range = document.createRange();
  range.selectNodeContents(text);
  const ink = range.getBoundingClientRect();
  if (!ink.width && !ink.height) return { x: 0.5, y: 0.5 };

  return {
    x: (ink.left + ink.width / 2 - box.left) / box.width,
    y: (ink.top + ink.height / 2 - box.top) / box.height,
  };
}

export function pinGlyphOrigin(charEl, glyphEl) {
  const box = charEl.getBoundingClientRect();
  charEl.style.width = `${box.width}px`;
  charEl.style.height = `${box.height}px`;
  const ink = rangeCenter(charEl, glyphEl);
  charEl.style.setProperty("--tfx-ox", `${((ink.x + 0.5) / 2) * 100}%`);
}

export function inkOffsetToOrigin(charEl, glyphEl) {
  const ox = parseFloat(charEl.style.getPropertyValue("--tfx-ox")) / 100 || 0.5;
  const ink = rangeCenter(charEl, glyphEl);
  return {
    x: (ox - ink.x) * charEl.offsetWidth,
    y: 0,
  };
}
