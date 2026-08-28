import { isSafari } from "./browser.js";

function videoScale(video) {
  const scale = Number(video?.scale) || 1;
  const z = Number(video?.z) || 0;
  return scale * (1 + z * 0.12);
}

export function applyVideoStyles(root, video) {
  const radius = Math.max(0, Number(video?.radius) || 0);
  root.style.setProperty("--tfx-video-scale", String(videoScale(video)));
  root.style.setProperty("--tfx-video-radius", `${radius}px`);
  root.style.setProperty("--tfx-video-parallax", String(video?.parallax ?? 0));
  root.classList.toggle("tfx-root--native-video", isSafari());
}

export function idleSafariVideo(root, video) {
  if (!isSafari()) return;
  const el = root.querySelector(".tfx-video");
  if (!el) return;
  const scale = videoScale(video);
  el.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

export function moveSafariVideo(root, video, pointer) {
  if (!isSafari()) return;
  const el = root.querySelector(".tfx-video");
  if (!el || !pointer) return;
  const parallax = Math.max(0, Number(video?.parallax) || 0);
  const scale = videoScale(video);
  const box = root.getBoundingClientRect();
  if (!box.width || !box.height) return;
  const nx = (pointer.x - box.left) / box.width - 0.5;
  const ny = (pointer.y - box.top) / box.height - 0.5;
  const amount = parallax * 48;
  const px = nx * amount;
  const py = ny * amount;
  el.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) scale(${scale})`;
}
