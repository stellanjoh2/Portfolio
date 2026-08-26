function paint(api, targets, color, hover) {
  if (!targets.length) return;
  api.gsap.killTweensOf(targets);
  api.gsap.to(targets, {
    color,
    duration: hover.duration,
    ease: hover.ease,
    overwrite: "auto",
  });
}

export function color(opts, api) {
  return {
    enter({ el, hover }) {
      if (!el) return;
      paint(api, el.querySelectorAll(".tfx-glyph"), opts.color, hover);
      api.root.style.setProperty(
        opts.layer === "word" ? "--tfx-color-word" : "--tfx-color-letter",
        opts.color
      );
    },
    leave({ el, hover, config, wordEl }) {
      if (!el) return;
      const wordColor = (config.word.effects || []).find((e) => e.type === "color")?.color;
      const stillInWord = opts.layer === "letter" && wordEl && wordEl.contains(el);
      const fallback = stillInWord ? wordColor || config.base.color : config.base.color;
      paint(api, el.querySelectorAll(".tfx-glyph"), fallback, hover);
    },
    leaveField({ hover, config }) {
      paint(
        api,
        api.root.querySelectorAll(".tfx-glyph"),
        config.base.color,
        hover
      );
    },
    update(next) {
      Object.assign(opts, next);
    },
    destroy() {},
  };
}
