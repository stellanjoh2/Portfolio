import skullzUrl from "./fonts/skullz.ttf?url";

export const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Bytesized&family=Coral+Pixels&family=DotGothic16&family=Manufacturing+Consent&family=Pixelify+Sans:wght@400;700&display=swap";

export const SKULLZ_FAMILY = "SkullZ";

const FACES = [
  '400 16px "Pixelify Sans"',
  '400 16px "Coral Pixels"',
  '400 16px "Manufacturing Consent"',
  '400 16px "DotGothic16"',
  '400 16px "Bytesized"',
];

function loadFaces() {
  return Promise.all(FACES.map((face) => document.fonts.load(face).catch(() => {})));
}

async function loadSkullz() {
  if ([...document.fonts].some((face) => face.family.replace(/['"]/g, "") === SKULLZ_FAMILY)) {
    return document.fonts.load(`400 16px "${SKULLZ_FAMILY}"`, "Dh").catch(() => {});
  }
  const face = new FontFace(SKULLZ_FAMILY, `url(${JSON.stringify(skullzUrl)})`, {
    weight: "400",
    style: "normal",
  });
  document.fonts.add(await face.load());
  await document.fonts.load(`400 16px "${SKULLZ_FAMILY}"`, "Dh");
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
  await Promise.all([google, loadSkullz().catch(() => {})]);
}
