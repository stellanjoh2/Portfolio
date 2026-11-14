import { injectFonts } from "../runtime/injectFonts.js";

const PROBE = "mmmmwwwwAaQg@#81";

export function fontSpec(font, px) {
  return `${font.style || "normal"} ${font.weight || 400} ${px}px "${font.family}"`;
}

function registered(family) {
  return [...document.fonts].some((face) => face.family.replace(/['"]/g, "") === family && face.status === "loaded");
}

async function addFace(family, source) {
  const face = new FontFace(family, source);
  document.fonts.add(await face.load());
}

/** True when the family renders with its own outlines rather than a generic fallback. */
export function renders(font) {
  const ctx = renders.ctx || (renders.ctx = document.createElement("canvas").getContext("2d"));
  const style = `${font.style || "normal"} ${font.weight || 400} 40px`;
  return ["monospace", "serif"].some((generic) => {
    ctx.font = `${style} ${generic}`;
    const base = ctx.measureText(PROBE).width;
    ctx.font = `${style} "${font.family}", ${generic}`;
    return ctx.measureText(PROBE).width !== base;
  });
}

export async function loadLocal(font) {
  if (!font.local) return renders(font);
  if (registered(font.family)) return true;
  try {
    await addFace(font.family, font.local.map((name) => `local(${JSON.stringify(name)})`).join(", "));
    return true;
  } catch {
    return false;
  }
}

/** Chrome's Local Font Access API sees Adobe-activated fonts even when local() matching misses them. */
export async function loadFromSystem(font) {
  if (typeof window.queryLocalFonts !== "function") return false;
  try {
    const names = new Set(font.local || []);
    const all = await window.queryLocalFonts();
    const hit = all.find((f) => names.has(f.postscriptName) || names.has(f.fullName));
    if (!hit) return false;
    await addFace(font.family, await (await hit.blob()).arrayBuffer());
    return true;
  } catch {
    return false;
  }
}

export async function loadFromFile(font, file) {
  try {
    await addFace(font.family, await file.arrayBuffer());
    return true;
  } catch {
    return false;
  }
}

let bundled = null;

export function loadBundled() {
  if (!bundled) bundled = injectFonts().catch(() => {});
  return bundled;
}

export async function loadCycleFonts(fonts) {
  await loadBundled();
  const ready = new Set();
  await Promise.all(
    fonts.map(async (font) => {
      const ok = await loadLocal(font);
      if (!ok) return;
      await document.fonts.load(fontSpec(font, 40), PROBE).catch(() => {});
      if (font.local || renders(font)) ready.add(font.id);
    })
  );
  return ready;
}
