function amountOf(opts) {
  return opts.amount ?? 1.5;
}

function dur(api, hover) {
  return api.reduceMotion ? 0 : hover?.duration ?? 0.2;
}

function originOf(el, hover) {
  const ox = el.style.getPropertyValue("--tfx-ox") || "50%";
  const inkY = Number(el.dataset.tfxInkY);
  const base = Number.isFinite(inkY) ? inkY * 100 : 50;
  const bias = (hover?.originY ?? 50) - 50;
  return `${ox} ${base + bias}%`;
}

export function scale(opts, api) {
  function grow(el, hover) {
    if (!el) return;
    el.classList.add("tfx-char--hot");
    api.gsap.killTweensOf(el, "scale,scaleX,scaleY");
    api.gsap.to(el, {
      scale: amountOf(opts),
      duration: dur(api, hover),
      ease: hover?.ease ?? "power2.out",
      overwrite: false,
      transformOrigin: originOf(el, hover),
    });
  }

  function retract(el, hover) {
    if (!el) return;
    api.gsap.killTweensOf(el, "scale,scaleX,scaleY");
    api.gsap.to(el, {
      scale: 1,
      duration: dur(api, hover),
      ease: hover?.ease ?? "power2.out",
      overwrite: false,
      onInterrupt() {
        api.gsap.set(el, { scale: 1 });
      },
      onComplete() {
        if (api.getHover().charEl !== el) el.classList.remove("tfx-char--hot");
      },
    });
  }

  return {
    enter({ el, hover }) {
      grow(el, hover);
    },
    leave({ el, hover }) {
      retract(el, hover);
    },
    leaveField({ hover }) {
      const nodes = api.root.querySelectorAll(".tfx-char");
      api.gsap.killTweensOf(nodes, "scale,scaleX,scaleY");
      api.gsap.to(nodes, {
        scale: 1,
        duration: dur(api, hover),
        ease: hover?.ease ?? "power2.out",
        overwrite: false,
        onInterrupt() {
          api.gsap.set(nodes, { scale: 1 });
        },
        onComplete() {
          nodes.forEach((c) => c.classList.remove("tfx-char--hot"));
        },
      });
    },
    update(next) {
      Object.assign(opts, next);
      const { charEl } = api.getHover();
      if (charEl) grow(charEl, api.getConfig().hover);
    },
    destroy() {
      const chars = api.root.querySelectorAll(".tfx-char");
      api.gsap.set(chars, { scale: 1 });
      chars.forEach((c) => c.classList.remove("tfx-char--hot"));
    },
  };
}
