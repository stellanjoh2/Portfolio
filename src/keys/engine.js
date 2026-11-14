import { gsap } from "gsap";
import { fontSpec } from "./fonts.js";
import { mainFace } from "./settings.js";
import { playStroke, primeKeys } from "./sound.js";

const REF = 200;
const BOX_FADE = 140;
const ITALIC_SLANT = Math.tan((11 * Math.PI) / 180);
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$*+=/<>?!";
const LOWER = "abcdefghijklmnopqrstuvwxyz0123456789#%&@$*+=/<>?!";

const rand = (amount) => (Math.random() * 2 - 1) * amount;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function scrambled(ch) {
  const set = ch === ch.toLowerCase() && ch !== ch.toUpperCase() ? LOWER : UPPER;
  return set[Math.floor(Math.random() * set.length)];
}

function codePoint(ch) {
  return `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`;
}

export function createKeys(canvas, initial, { ignore = () => false } = {}) {
  const ctx = canvas.getContext("2d");
  const metrics = new Map();
  const chars = [];
  let s = initial;
  let ready = new Set();
  let ease = gsap.parseEase(s.landEase);
  let sequence = 0;
  let layout = null;
  let lineX = [];
  let blockTop = null;
  let caret = null;
  let lastKey = performance.now();
  let lastFrame = lastKey;
  let raf = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;

  function main() {
    return { family: mainFace(s).family };
  }

  /** Metrics scale linearly with size, so one cached measurement per font and string serves every jittered size. */
  function measure(font, text) {
    const key = `${font.family}\0${font.style || ""}\0${font.weight || ""}\0${text}`;
    let m = metrics.get(key);
    if (!m) {
      ctx.font = fontSpec(font, REF);
      const t = ctx.measureText(text);
      m = {
        width: t.width,
        left: t.actualBoundingBoxLeft,
        right: t.actualBoundingBoxRight,
        ascent: t.actualBoundingBoxAscent,
        descent: t.actualBoundingBoxDescent,
      };
      metrics.set(key, m);
    }
    return m;
  }

  function scaled(font, text, px) {
    const m = measure(font, text);
    const k = px / REF;
    return {
      width: m.width * k,
      left: m.left * k,
      right: m.right * k,
      ascent: m.ascent * k,
      descent: m.descent * k,
    };
  }

  function capHeight(font, px) {
    return scaled(font, "H", px).ascent;
  }

  function advance(prev, ch) {
    const font = main();
    const px = s.fontSize;
    const solo = scaled(font, ch, px).width;
    if (!prev) return solo;
    return scaled(font, prev + ch, px).width - scaled(font, prev, px).width;
  }

  function computeLayout() {
    const px = s.fontSize;
    const track = s.tracking * px;
    const lines = [];
    let line = { chars: [], width: 0 };
    let x = 0;
    let prev = "";

    const breakLine = () => {
      line.width = Math.max(0, x);
      lines.push(line);
      line = { chars: [], width: 0 };
      x = 0;
      prev = "";
    };

    let i = 0;
    while (i < chars.length) {
      const c = chars[i];
      if (c.ch === "\n") {
        c.line = lines.length;
        c.x = x;
        c.adv = 0;
        breakLine();
        i += 1;
        continue;
      }
      let j = i;
      while (j < chars.length && chars[j].ch !== "\n" && chars[j].ch !== " ") j += 1;
      while (j < chars.length && chars[j].ch === " ") j += 1;
      const word = chars.slice(i, j);
      let wordWidth = 0;
      let p = prev;
      for (const w of word) {
        if (w.ch !== " ") wordWidth += advance(p, w.ch) + track;
        p = w.ch;
      }
      if (s.maxWidth > 0 && x > 0 && x + wordWidth - track > s.maxWidth) breakLine();
      for (const w of word) {
        w.adv = advance(prev, w.ch) + track;
        w.glyphAdv = w.adv - track;
        w.x = x;
        w.line = lines.length;
        line.chars.push(w);
        x += w.adv;
        prev = w.ch;
      }
      line.width = x;
      i = j;
    }
    line.width = Math.max(0, x);
    lines.push(line);

    for (const l of lines) {
      let end = l.chars.length;
      while (end > 0 && l.chars[end - 1].ch === " ") end -= 1;
      l.width = end ? l.chars[end - 1].x + l.chars[end - 1].adv - track : 0;
    }

    const lineH = px * s.leading;
    const total = lines.length * lineH;
    const block = Math.max(...lines.map((l) => l.width));
    const top = s.valign === "top" ? -lineH / 2 : s.valign === "bottom" ? lineH / 2 - total : -total / 2;
    const xs = lines.map((l) =>
      s.align === "center" ? -l.width / 2 : s.align === "right" ? block / 2 - l.width : -block / 2
    );
    return { lines, lineH, top, xs, cap: capHeight(main(), px) };
  }

  function invalidate() {
    layout = null;
  }

  function glide(current, target, dt) {
    if (current == null || s.glide <= 0) return target;
    return current + (target - current) * (1 - Math.exp(-dt / s.glide));
  }

  function baseline(line) {
    return blockTop + line * layout.lineH + (layout.lineH + layout.cap) / 2;
  }

  function buildSteps(c, now) {
    const pool = s.fonts.filter((font) => font.enabled && ready.has(font.id));
    if (!pool.length || s.steps <= 0) return now;
    let t = now;
    let last = -1;
    for (let i = 0; i < s.steps; i++) {
      let index;
      if (s.order === "random") {
        index = Math.floor(Math.random() * pool.length);
        if (index === last && pool.length > 1) index = (index + 1) % pool.length;
      } else {
        index = sequence++ % pool.length;
      }
      last = index;
      c.steps.push({
        at: t,
        font: pool[index],
        glyph: Math.random() < s.scramble ? scrambled(c.ch) : c.ch,
        scale: 1 + rand(s.sizeJitter),
        dx: rand(s.shake),
        dy: rand(s.shake),
        fill: Math.random() < s.fillChance,
      });
      t += Math.max(8, s.interval * (1 + rand(s.jitter)));
    }
    return t;
  }

  function stroke(c, now) {
    if (!s.sound) return;
    playStroke({
      volume: s.soundVolume,
      variance: s.soundVariance,
      flipDb: s.flipDb,
      flips: c ? c.steps.slice(1).map((step) => step.at - now) : [],
    });
  }

  function type(ch) {
    const now = performance.now();
    const c = { ch, born: now, steps: [], end: now };
    if (ch.trim()) c.end = buildSteps(c, now);
    stroke(c, now);
    chars.push(c);
    lastKey = now;
    invalidate();
  }

  function erase(mode) {
    if (chars.length) stroke(null);
    if (mode === "all") chars.length = 0;
    else if (mode === "word") {
      while (chars.length && /\s/.test(chars[chars.length - 1].ch)) chars.pop();
      while (chars.length && !/\s/.test(chars[chars.length - 1].ch)) chars.pop();
    } else chars.pop();
    lastKey = performance.now();
    invalidate();
  }

  function onKey(e) {
    if (ignore(e)) return;
    if (e.key === "Backspace" || e.key === "Enter" || [...e.key].length === 1) document.activeElement?.blur?.();
    if (e.key === "Backspace") {
      e.preventDefault();
      erase(e.metaKey || e.ctrlKey ? "all" : e.altKey ? "word" : "one");
      return;
    }
    if (e.metaKey || e.ctrlKey) return;
    if (e.key === "Enter") {
      e.preventDefault();
      type("\n");
    } else if (e.key === "Tab") {
      e.preventDefault();
    } else if ([...e.key].length === 1) {
      e.preventDefault();
      type(e.key);
    }
  }

  function strokeBox(x, y, w, h, scale) {
    const line = s.boxLine / scale;
    ctx.lineWidth = line;
    if (s.boxStyle === "corners") {
      const tick = Math.min(w / 2, h / 2, s.fontSize * 0.12);
      ctx.beginPath();
      for (const [cx, cy, sx, sy] of [
        [x, y, 1, 1],
        [x + w, y, -1, 1],
        [x, y + h, 1, -1],
        [x + w, y + h, -1, -1],
      ]) {
        ctx.moveTo(cx + sx * tick, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + sy * tick);
      }
      ctx.stroke();
    } else {
      ctx.strokeRect(x + line / 2, y + line / 2, w - line, h - line);
    }
  }

  function inkBox(m, x, base) {
    const pad = s.boxPad * s.fontSize;
    return {
      x: x - m.left - pad,
      y: base - m.ascent - pad,
      w: m.left + m.right + pad * 2,
      h: m.ascent + m.descent + pad * 2,
    };
  }

  function drawStep(c, step, x, base, scale) {
    const font = step.font;
    const fit = s.matchHeight ? clamp(layout.cap / (capHeight(font, s.fontSize) || layout.cap), 0.5, 2.5) : 1;
    const px = s.fontSize * fit * step.scale;
    const m = scaled(font, step.glyph, px);
    const gx = x + c.glyphAdv / 2 - m.width / 2 + step.dx * s.fontSize;
    const gy = base + step.dy * s.fontSize;
    const box = inkBox(m, gx, gy);
    const hasInk = box.w > 0 && m.left + m.right > 0;

    if (s.box && hasInk) {
      if (step.fill) {
        ctx.fillStyle = s.boxColor;
        ctx.fillRect(box.x, box.y, box.w, box.h);
      } else {
        ctx.strokeStyle = s.boxColor;
        strokeBox(box.x, box.y, box.w, box.h, scale);
      }
      if (s.label) {
        const size = s.labelSize / scale;
        ctx.font = `500 ${size}px ui-monospace, "SF Mono", Menlo, monospace`;
        ctx.fillStyle = s.labelColor;
        ctx.textBaseline = "bottom";
        ctx.fillText(`${font.label.toUpperCase()}  ${codePoint(step.glyph)}`, box.x, box.y - size * 0.4);
        ctx.textBaseline = "alphabetic";
      }
    }

    ctx.font = fontSpec(font, px);
    ctx.fillStyle = s.box && step.fill && hasInk ? s.bg : s.cycle;
    ctx.fillText(step.glyph, gx, gy);
  }

  function drawLanded(c, x, base, now, scale) {
    const since = now - c.end;
    const k = s.landDuration > 0 ? clamp(since / s.landDuration, 0, 1) : 1;
    const zoom = s.landScale + (1 - s.landScale) * ease(k);
    const font = main();
    const m = scaled(font, c.ch, s.fontSize);
    const cx = x + (m.right - m.left) / 2;
    const cy = base + (m.descent - m.ascent) / 2;
    const animating = c.steps.length && Math.abs(zoom - 1) > 0.001;

    if (animating) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(zoom, zoom);
      ctx.translate(-cx, -cy);
    }
    ctx.font = fontSpec(font, s.fontSize);
    ctx.fillStyle = s.text;
    ctx.fillText(c.ch, x, base);

    if (s.box && c.steps.length && since < s.boxHold + BOX_FADE) {
      const box = inkBox(m, x, base);
      ctx.globalAlpha = since < s.boxHold ? 1 : 1 - (since - s.boxHold) / BOX_FADE;
      ctx.strokeStyle = s.boxColor;
      strokeBox(box.x, box.y, box.w, box.h, scale * zoom);
      ctx.globalAlpha = 1;
    }
    if (animating) ctx.restore();
  }

  function drawCaret(now, dt) {
    if (!s.caret) return;
    const last = chars[chars.length - 1];
    let line = 0;
    let cx = 0;
    if (last) {
      line = last.ch === "\n" ? last.line + 1 : last.line;
      cx = last.ch === "\n" ? 0 : last.x + last.adv;
    }
    const target = { x: lineX[line] + cx, y: baseline(line) };
    caret = caret ? { x: glide(caret.x, target.x, dt * 0.6), y: glide(caret.y, target.y, dt * 0.6) } : target;

    const idle = now - lastKey;
    if (s.blink > 0 && idle > s.blink && Math.floor(idle / s.blink) % 2 === 1) return;

    const em = s.fontSize;
    const cap = layout.cap;
    const [w, h, lift] =
      s.caretStyle === "block"
        ? [em * 0.55, cap * 1.08, 0]
        : s.caretStyle === "underscore"
          ? [em * 0.55, em * 0.07, -em * 0.07]
          : [em * 0.07, cap * 1.3, em * 0.12];
    ctx.save();
    ctx.translate(caret.x + em * 0.07, caret.y + lift);
    if (mainFace(s).italic) ctx.transform(1, 0, -ITALIC_SLANT, 1, 0, 0);
    ctx.fillStyle = s.caretColor;
    ctx.fillRect(0, -h, w, h);
    ctx.restore();
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(64, now - lastFrame);
    lastFrame = now;
    if (!width || !height) return;

    if (!layout) layout = computeLayout();
    const { lines, xs, top } = layout;
    blockTop = glide(blockTop, top, dt);
    lineX = xs.map((x, i) => (lineX[i] == null ? x : glide(lineX[i], x, dt)));

    const scale = s.scale;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = s.bg;
    ctx.fillRect(0, 0, width, height);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * (width / 2 + s.offsetX), dpr * (height / 2 + s.offsetY));
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";

    const cycling = [];
    lines.forEach((line, li) => {
      const base = baseline(li);
      for (const c of line.chars) {
        if (!c.ch.trim()) continue;
        const x = lineX[li] + c.x;
        if (now < c.end) cycling.push([c, x, base]);
        else drawLanded(c, x, base, now, scale);
      }
    });
    for (const [c, x, base] of cycling) {
      let step = c.steps[0];
      for (const st of c.steps) if (st.at <= now) step = st;
      drawStep(c, step, x, base, scale);
    }
    drawCaret(now, dt);
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    width = r.width;
    height = r.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  primeKeys();
  window.addEventListener("keydown", onKey);
  raf = requestAnimationFrame(frame);

  return {
    update(next) {
      s = next;
      ease = gsap.parseEase(s.landEase) || ((t) => t);
      invalidate();
    },
    setReady(ids) {
      ready = ids;
    },
    refreshFonts() {
      metrics.clear();
      invalidate();
    },
    clear() {
      erase("all");
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
    },
  };
}
