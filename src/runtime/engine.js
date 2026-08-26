import gsap from "gsap";
import { createEffect } from "./registry.js";
import { effectTypes } from "./config.js";
import { applyBase, splitRoot } from "./split.js";

function fire(instances, hook, ctx) {
  for (const inst of instances) {
    inst?.[hook]?.(ctx);
  }
}

function allEffects(effects) {
  return [...effects.word, ...effects.letter];
}

export function createEngine(root, initialConfig) {
  let config = initialConfig;
  let splitBag = null;
  let effects = { word: [], letter: [] };
  const hover = { wordEl: null, charEl: null, pointer: { x: 0, y: 0 } };
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const api = {
    root,
    gsap,
    reduceMotion,
    getHover: () => hover,
    getConfig: () => config,
  };

  function makeCtx(extra = {}) {
    return {
      root,
      wordEl: hover.wordEl,
      charEl: hover.charEl,
      pointer: hover.pointer,
      config,
      hover: config.hover,
      el: extra.el,
      target: extra.target,
      ...extra,
    };
  }

  function destroyEffects() {
    fire(allEffects(effects), "destroy");
    effects = { word: [], letter: [] };
  }

  function buildEffects() {
    destroyEffects();
    const make = (spec, layer) => createEffect(spec, layer, api);
    effects.word = (config.word.effects || [])
      .map((spec) => make(spec, "word"))
      .filter(Boolean);
    effects.letter = (config.letter.effects || [])
      .map((spec) => make(spec, "letter"))
      .filter(Boolean);
  }

  function charFromPoint(x, y) {
    const stack = document.elementsFromPoint(x, y);
    for (const node of stack) {
      if (!(node instanceof Element)) continue;
      if (node.classList.contains("tfx-char")) return node;
      const closest = node.closest(".tfx-char");
      if (closest && root.contains(closest)) return closest;
    }
    return null;
  }

  function setHovered(char) {
    const word = char?.closest(".tfx-word") ?? null;
    const prevChar = hover.charEl;
    const prevWord = hover.wordEl;

    if (char !== prevChar && prevChar) {
      fire(effects.letter, "leave", makeCtx({ el: prevChar, target: "letter" }));
    }

    if (word !== prevWord) {
      if (prevWord) {
        fire(effects.word, "leave", makeCtx({ el: prevWord, target: "word" }));
      }
      hover.wordEl = word;
      if (hover.wordEl) {
        fire(effects.word, "enter", makeCtx({ el: hover.wordEl, target: "word" }));
      }
    }

    if (char !== prevChar) {
      hover.charEl = char;
      if (hover.charEl) {
        fire(effects.letter, "enter", makeCtx({ el: hover.charEl, target: "letter" }));
      }
    }
  }

  function onMove(e) {
    hover.pointer = { x: e.clientX, y: e.clientY };
    setHovered(charFromPoint(e.clientX, e.clientY));
    const ctx = makeCtx();
    fire(effects.word, "move", ctx);
    fire(effects.letter, "move", ctx);
  }

  function onLeaveField() {
    if (hover.charEl) {
      fire(effects.letter, "leave", makeCtx({ el: hover.charEl, target: "letter" }));
    }
    if (hover.wordEl) {
      fire(effects.word, "leave", makeCtx({ el: hover.wordEl, target: "word" }));
    }
    hover.charEl = null;
    hover.wordEl = null;
    fire(allEffects(effects), "leaveField", makeCtx());
  }

  function onDown(e) {
    hover.pointer = { x: e.clientX, y: e.clientY };
    setHovered(charFromPoint(e.clientX, e.clientY));
    if (!hover.charEl) return;
    fire(effects.letter, "click", makeCtx({ el: hover.charEl, target: "letter" }));
  }

  let cancelled = false;

  async function setup() {
    splitBag = await splitRoot(root, config, () => cancelled);
    if (cancelled || !splitBag) return;
    buildEffects();
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeaveField);
    root.addEventListener("pointerdown", onDown);
  }

  function teardownSplit() {
    root.removeEventListener("pointermove", onMove);
    root.removeEventListener("pointerleave", onLeaveField);
    root.removeEventListener("pointerdown", onDown);
    onLeaveField();
    destroyEffects();
    splitBag?.split?.revert();
    splitBag = null;
    gsap.killTweensOf(root.querySelectorAll(".tfx-char, .tfx-glow, .tfx-glyph, .tfx-box, .tfx-details"));
  }

  function patchEffects() {
    const assign = (layer) => {
      (config[layer].effects || []).forEach((spec, i) => {
        effects[layer][i]?.update?.(spec);
      });
    };
    assign("word");
    assign("letter");
  }

  function reenter() {
    if (hover.wordEl) {
      fire(effects.word, "enter", makeCtx({ el: hover.wordEl, target: "word" }));
    }
    if (hover.charEl) {
      fire(effects.letter, "enter", makeCtx({ el: hover.charEl, target: "letter" }));
    }
  }

  const ready = setup();

  return {
    ready,
    update(next) {
      const prev = config;
      config = next;
      applyBase(root, config);

      const splitChanged =
        prev.text !== next.text ||
        prev.base.fontFamily !== next.base.fontFamily ||
        prev.base.fontSize !== next.base.fontSize ||
        prev.base.fontWeight !== next.base.fontWeight ||
        prev.base.letterSpacing !== next.base.letterSpacing ||
        prev.base.lineHeight !== next.base.lineHeight ||
        prev.base.width !== next.base.width ||
        prev.base.align !== next.base.align;

      if (splitChanged) {
        teardownSplit();
        return setup();
      }

      const stackChanged =
        effectTypes(prev, "word") !== effectTypes(next, "word") ||
        effectTypes(prev, "letter") !== effectTypes(next, "letter");

      if (stackChanged) {
        const wordEl = hover.wordEl;
        const charEl = hover.charEl;
        destroyEffects();
        buildEffects();
        hover.wordEl = wordEl;
        hover.charEl = charEl;
        reenter();
        return;
      }

      patchEffects();
    },
    destroy() {
      cancelled = true;
      teardownSplit();
      root.classList.remove("tfx-root");
      root.replaceChildren();
    },
  };
}
