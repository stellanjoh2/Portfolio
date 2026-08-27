import { defaultConfig, normalizeConfig } from "./config.js";
import { registerBuiltins } from "./effects/index.js";
import { createEngine } from "./engine.js";
import { injectStyles } from "./injectStyles.js";
import { register } from "./registry.js";

registerBuiltins();

export {
  defaultConfig,
  getEffect,
  glyphMode,
  hasEffect,
  normalizeConfig,
  patchEffect,
  setEffect,
  setGlyphMode,
  CYCLE_FONTS,
} from "./config.js";
export { register };

export function mount(target, userConfig) {
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) throw new Error("[textfx] mount target not found");

  injectStyles();
  const config = normalizeConfig(userConfig);
  const engine = createEngine(el, config);
  let chain = engine.ready;
  let dead = false;

  return {
    el,
    ready: engine.ready,
    update(next) {
      chain = chain.then(() => {
        if (dead) return;
        return engine.update(normalizeConfig(next));
      });
      return chain;
    },
    pause() {
      engine.pause();
    },
    resume() {
      engine.resume();
    },
    destroy() {
      dead = true;
      engine.destroy();
    },
  };
}
