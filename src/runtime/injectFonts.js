import monumentUrl from "./fonts/PPMonumentWide-Black.otf?url";
import skullzUrl from "./fonts/skullz.ttf?url";
import tiltortionUrl from "./fonts/Tiltortion.otf?url";
import erki30Url from "./fonts/erki30.woff?url";
import beastUrl from "./fonts/Beast-Regular.woff2?url";

export const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Coral+Pixels&family=DotGothic16&family=Manufacturing+Consent&family=Pixelify+Sans:wght@400;700&display=swap";

export const MONUMENT_FAMILY = "PP Monument Wide";
export const SKULLZ_FAMILY = "SkullZ";
export const TILTORTION_FAMILY = "Tiltortion";
export const ERKI30_FAMILY = "ERKI 30";
export const BEAST_FAMILY = "Beast";

const FACES = [
  '400 16px "Pixelify Sans"',
  '400 16px "Coral Pixels"',
  '400 16px "Manufacturing Consent"',
  '400 16px "DotGothic16"',
];

function loadFaces() {
  return Promise.all(FACES.map((face) => document.fonts.load(face).catch(() => {})));
}

async function loadLocalFace(family, url, weight, sample, descriptors = {}) {
  if ([...document.fonts].some((face) => face.family.replace(/['"]/g, "") === family)) {
    return document.fonts.load(`${weight} 16px "${family}"`, sample).catch(() => {});
  }
  const face = new FontFace(family, `url(${JSON.stringify(url)})`, {
    weight,
    style: "normal",
    ...descriptors,
  });
  document.fonts.add(await face.load());
  await document.fonts.load(`${weight} 16px "${family}"`, sample);
}

async function loadSkullz() {
  return loadLocalFace(SKULLZ_FAMILY, skullzUrl, "400", "D");
}

async function loadMonument() {
  return loadLocalFace(MONUMENT_FAMILY, monumentUrl, "900", "Welcome");
}

async function loadTiltortion() {
  return loadLocalFace(TILTORTION_FAMILY, tiltortionUrl, "400", "A");
}

async function loadErki30() {
  return loadLocalFace(ERKI30_FAMILY, erki30Url, "400", "A", {
    ascentOverride: "104%",
    descentOverride: "20%",
  });
}

async function loadBeast() {
  return loadLocalFace(BEAST_FAMILY, beastUrl, "400", "A");
}

export async function injectFonts() {
  let link = document.getElementById("tfx-fonts");
  if (!link) {
    link = document.createElement("link");
    link.id = "tfx-fonts";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  const google =
    link.getAttribute("href") !== GOOGLE_FONTS_HREF
      ? new Promise((resolve) => {
          link.onload = () => resolve(loadFaces());
          link.onerror = () => resolve();
          link.href = GOOGLE_FONTS_HREF;
        })
      : loadFaces();
  await Promise.all([
    google,
    loadSkullz().catch(() => {}),
    loadMonument().catch(() => {}),
    loadTiltortion().catch(() => {}),
    loadErki30().catch(() => {}),
    loadBeast().catch(() => {}),
  ]);
}
