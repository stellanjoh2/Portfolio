import { inkClientRect } from "../glyphBounds.js";

function boxEl(api, layer) {
  return api.root.querySelector(`.tfx-box--${layer}`);
}

function detailsEl(api) {
  return api.root.querySelector(".tfx-details");
}

function visualRect(el) {
  if (!el) return null;
  if (el.classList.contains("tfx-word")) {
    const chars = el.querySelectorAll(".tfx-char");
    if (!chars.length) return el.getBoundingClientRect();
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    for (const char of chars) {
      const r = inkClientRect(char);
      if (!r.width && !r.height) continue;
      left = Math.min(left, r.left);
      top = Math.min(top, r.top);
      right = Math.max(right, r.right);
      bottom = Math.max(bottom, r.bottom);
    }
    if (!Number.isFinite(left)) return el.getBoundingClientRect();
    return { left, top, width: right - left, height: bottom - top };
  }
  if (el.classList.contains("tfx-char")) return inkClientRect(el);
  return el.getBoundingClientRect();
}

function emPx(root, em) {
  return (parseFloat(getComputedStyle(root).fontSize) || 16) * em;
}

function place(node, el, root, gsap) {
  if (!node || !el) return;
  const r = visualRect(el);
  if (!r) return;
  const b = root.getBoundingClientRect();
  gsap.set(node, {
    x: r.left - b.left,
    y: r.top - b.top,
    width: r.width,
    height: r.height,
  });
}

function placeDetails(node, el, root, gsap, text) {
  if (!node || !el) return;
  const r = visualRect(el);
  if (!r) return;
  const b = root.getBoundingClientRect();
  const line = emPx(root, 0.035) * 1.3;
  node.textContent = text;
  gsap.set(node, {
    x: r.left - b.left,
    y: r.top - b.top - line * 2,
  });
}

function codePoint(el) {
  const ch = el?.querySelector(".tfx-glyph")?.textContent || "";
  if (!ch) return "";
  const cp = ch.codePointAt(0);
  return `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`;
}

export function box(opts, api) {
  let raf = 0;

  function sync(ctx) {
    const node = boxEl(api, opts.layer);
    const el = opts.layer === "word" ? ctx.wordEl : ctx.charEl;
    place(node, el, api.root, api.gsap);
    if (opts.details && opts.layer === "letter" && ctx.charEl) {
      const idx = ctx.charEl.dataset.tfxIndex ?? "";
      const ch = ctx.charEl.querySelector(".tfx-glyph")?.textContent || "";
      placeDetails(
        detailsEl(api),
        ctx.charEl,
        api.root,
        api.gsap,
        `${codePoint(ctx.charEl)}   ${ch}   ${idx}`
      );
    } else if (opts.layer === "letter") {
      api.gsap.set(detailsEl(api), { autoAlpha: 0 });
    }
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function hide(hover) {
    stop();
    const node = boxEl(api, opts.layer);
    api.gsap.to(node, {
      autoAlpha: 0,
      duration: hover?.duration ?? 0.15,
      ease: hover?.ease ?? "power2.out",
      overwrite: "auto",
    });
    if (opts.details && opts.layer === "letter") {
      api.gsap.to(detailsEl(api), { autoAlpha: 0, duration: hover?.duration ?? 0.15, ease: hover?.ease ?? "power2.out" });
    }
  }

  function onCycle() {
    if (opts.layer !== "letter") return;
    if (!api.getHover().charEl) return;
    const nodes = [boxEl(api, "letter")];
    if (opts.details) nodes.push(detailsEl(api));
    const targets = nodes.filter(Boolean);
    if (!targets.length) return;
    api.gsap.fromTo(
      targets,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.05, ease: "none", overwrite: "auto" }
    );
  }

  if (opts.layer === "letter") {
    api.root.addEventListener("tfxcycle", onCycle);
  }

  return {
    enter() {
      stop();
      const node = boxEl(api, opts.layer);
      api.gsap.set(node, { autoAlpha: 1 });
      if (opts.details && opts.layer === "letter") {
        api.gsap.set(detailsEl(api), { autoAlpha: 1 });
      }
      const loop = () => {
        const live = api.getHover();
        sync({ ...live, config: api.getConfig() });
        raf = requestAnimationFrame(loop);
      };
      loop();
    },
    move() {
      if (!raf) {
        const live = api.getHover();
        sync({ ...live, config: api.getConfig() });
      }
    },
    leave({ hover }) {
      hide(hover);
    },
    leaveField({ hover }) {
      hide(hover);
    },
    update(next) {
      Object.assign(opts, next);
    },
    destroy() {
      stop();
      api.root.removeEventListener("tfxcycle", onCycle);
    },
  };
}
