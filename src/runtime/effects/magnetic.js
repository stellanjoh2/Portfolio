export function magnetic(opts, api) {
  let rests = [];
  let trackers = [];
  let hovering = false;

  function chars() {
    return api.root.querySelectorAll(".tfx-char");
  }

  function promote(on) {
    api.root.classList.toggle("tfx-root--magnetic", on);
  }

  function capture() {
    const rootB = api.root.getBoundingClientRect();
    rests = [...chars()].map((el) => {
      const b = el.getBoundingClientRect();
      const x = Number(api.gsap.getProperty(el, "x")) || 0;
      const y = Number(api.gsap.getProperty(el, "y")) || 0;
      return {
        el,
        lx: b.left + b.width / 2 - rootB.left - x,
        ly: b.top + b.height / 2 - rootB.top - y,
      };
    });
  }

  function killTrackers() {
    for (const t of trackers) {
      t.x.tween?.kill();
      t.y.tween?.kill();
    }
    trackers = [];
  }

  function ensureTrackers() {
    if (trackers.length) return;
    const follow = opts.follow ?? 0.5;
    trackers = rests.map(({ el }) => ({
      el,
      x: api.gsap.quickTo(el, "x", {
        duration: follow,
        ease: "power3.out",
        overwrite: false,
      }),
      y: api.gsap.quickTo(el, "y", {
        duration: follow,
        ease: "power3.out",
        overwrite: false,
      }),
    }));
  }

  function onResize() {
    if (!hovering) {
      killTrackers();
      capture();
    }
  }

  capture();
  window.addEventListener("resize", onResize);

  return {
    move({ pointer, charEl }) {
      if (api.reduceMotion) return;
      hovering = true;
      promote(true);
      if (!rests.length) capture();
      ensureTrackers();
      const rootB = api.root.getBoundingClientRect();
      const radius = opts.radius ?? 160;
      const k = (opts.strength ?? 36) / 50;
      for (let i = 0; i < trackers.length; i++) {
        const rest = rests[i];
        const t = trackers[i];
        if (!rest || !t) continue;
        const rx = rootB.left + rest.lx;
        const ry = rootB.top + rest.ly;
        const dx = pointer.x - rx;
        const dy = pointer.y - ry;
        const dist = Math.hypot(dx, dy);
        if (rest.el === charEl) {
          const cap = 12;
          t.x(Math.max(-cap, Math.min(cap, dx * 0.18)));
          t.y(Math.max(-cap, Math.min(cap, dy * 0.18)));
          continue;
        }
        if (dist < 0.001 || dist >= radius) {
          t.x(0);
          t.y(0);
          continue;
        }
        const falloff = 1 - dist / radius;
        const push = radius * k * 0.45 * falloff;
        t.x(-(dx / dist) * push);
        t.y(-(dy / dist) * push);
      }
    },
    leaveField() {
      hovering = false;
      const nodes = chars();
      killTrackers();
      api.gsap.killTweensOf(nodes, "x,y");
      api.gsap.to(nodes, {
        x: 0,
        y: 0,
        duration: api.reduceMotion ? 0 : opts.release ?? 0.25,
        ease: opts.releaseEase ?? "power2.out",
        overwrite: false,
        onComplete() {
          if (!hovering) promote(false);
        },
      });
    },
    pause() {
      hovering = false;
      killTrackers();
      const nodes = chars();
      api.gsap.killTweensOf(nodes, "x,y");
      api.gsap.set(nodes, { x: 0, y: 0 });
      promote(false);
    },
    update(next) {
      Object.assign(opts, next);
      killTrackers();
    },
    destroy() {
      window.removeEventListener("resize", onResize);
      killTrackers();
      rests = [];
      promote(false);
    },
  };
}
