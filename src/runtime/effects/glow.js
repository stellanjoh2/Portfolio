function glowsIn(el, layer) {
  if (!el) return [];
  return el.querySelectorAll(
    layer === "word" ? ".tfx-glow--word" : ".tfx-glow--letter"
  );
}

export function glow(opts, api) {
  function paint(nodes, hover, extra = {}) {
    if (!nodes.length) return;
    api.gsap.to(nodes, {
      opacity: extra.opacity,
      color: opts.color ?? "#ffffff",
      "--tfx-blur": `${opts.size ?? 16}px`,
      duration: hover.duration,
      ease: hover.ease,
      overwrite: "auto",
    });
  }

  return {
    enter({ el, hover }) {
      const nodes = glowsIn(el, opts.layer);
      paint(nodes, hover, { opacity: opts.layer === "letter" ? 0.95 : 0.55 });
    },
    leave({ el, hover }) {
      const nodes = glowsIn(el, opts.layer);
      if (!nodes.length) return;
      api.gsap.to(nodes, {
        opacity: 0,
        "--tfx-blur": "0px",
        duration: hover.duration,
        ease: hover.ease,
        overwrite: "auto",
      });
    },
    update(next) {
      Object.assign(opts, next);
      const { wordEl, charEl } = api.getHover();
      const el = opts.layer === "word" ? wordEl : charEl;
      const nodes = glowsIn(el, opts.layer);
      if (nodes.length) {
        api.gsap.set(nodes, {
          color: opts.color ?? "#ffffff",
          "--tfx-blur": `${opts.size ?? 16}px`,
        });
      }
    },
    destroy() {},
  };
}
