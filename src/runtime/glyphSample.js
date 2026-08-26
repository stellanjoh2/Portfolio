const RAMP = " ·:+*#@";

export function sampleGlyph(char, { fontFamily, fontWeight = 700, cols = 8, rows = 12 } = {}) {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#fff";
  ctx.font = `${fontWeight} ${Math.floor(size * 0.78)}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, size / 2, size / 2 + 2);

  const { data } = ctx.getImageData(0, 0, size, size);
  const grid = [];
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      const px = Math.min(size - 1, Math.floor((x + 0.5) * (size / cols)));
      const py = Math.min(size - 1, Math.floor((y + 0.5) * (size / rows)));
      const i = (py * size + px) * 4;
      row.push(data[i] / 255);
    }
    grid.push(row);
  }
  return grid;
}

export function gridToAscii(grid) {
  return grid
    .map((row) =>
      row
        .map((v) => RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))])
        .join("")
    )
    .join("\n");
}
