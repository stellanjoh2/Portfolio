import { isSafari } from "./browser.js";

function videoScale(video) {
  const scale = Number(video?.scale) || 1;
  const z = Number(video?.z) || 0;
  return scale * (1 + z * 0.12);
}

const offset = new WeakMap();

function setTransform(el, video, px, py) {
  offset.set(el, { px, py });
  const scale = videoScale(video);
  el.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) scale(${scale})`;
}

function videoEl(root) {
  return root.querySelector(".tfx-video");
}

export function applyVideoStyles(root, video) {
  const radius = Math.max(0, Number(video?.radius) || 0);
  root.style.setProperty("--tfx-video-scale", String(videoScale(video)));
  root.style.setProperty("--tfx-video-radius", `${radius}px`);
  root.style.setProperty("--tfx-video-parallax", String(video?.parallax ?? 0));
  root.classList.toggle("tfx-root--native-video", isSafari());
  const el = videoEl(root);
  if (isSafari() && el) {
    const last = offset.get(el) || { px: 0, py: 0 };
    setTransform(el, video, last.px, last.py);
  }
}

export function idleSafariVideo(root, video) {
  if (!isSafari()) return;
  const el = videoEl(root);
  if (!el) return;
  setTransform(el, video, 0, 0);
}

export function moveSafariVideo(root, video, pointer) {
  if (!isSafari()) return;
  const el = videoEl(root);
  if (!el || !pointer) return;
  const parallax = Math.max(0, Number(video?.parallax) || 0);
  const box = root.getBoundingClientRect();
  if (!box.width || !box.height) return;
  const nx = Math.max(-0.5, Math.min(0.5, (pointer.x - box.left) / box.width - 0.5));
  const ny = Math.max(-0.5, Math.min(0.5, (pointer.y - box.top) / box.height - 0.5));
  const amount = parallax * 96;
  setTransform(el, video, nx * amount, ny * amount);
}

export function bindSafariVideoParallax(root, getVideo) {
  if (!isSafari()) return () => {};
  function onPointer(e) {
    moveSafariVideo(root, getVideo(), { x: e.clientX, y: e.clientY });
  }
  window.addEventListener("pointermove", onPointer);
  return () => window.removeEventListener("pointermove", onPointer);
}
