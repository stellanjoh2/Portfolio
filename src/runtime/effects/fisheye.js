import { isSafari } from "../browser.js";
import { glyphAnchor, inkClientRect } from "../glyphBounds.js";

const VS = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTex;
uniform sampler2D uVideo;
uniform sampler2D uHud;
uniform vec2 uCenter;
uniform vec2 uResolution;
uniform float uStrength;
uniform float uRadius;
uniform float uVideoZ;
uniform float uHudZ;
uniform float uParallax;
uniform float uChroma;

vec4 sampleLayer(sampler2D tex, vec2 uv) {
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec4(0.0);
  return texture(tex, uv);
}

vec4 scene(vec2 uv) {
  vec2 look = uCenter;
  vec2 world = vec2(0.5);
  vec2 px = (uv - look) * uResolution;
  float r = length(px);
  float R = max(uRadius, 1.0);
  float nr = min(r / R, 1.0);
  float k = clamp(uStrength, 0.0, 1.0);
  float bulge = k * 0.32 * (1.0 - nr * nr);
  vec2 travel = look - world;

  vec2 textUv = look + (uv - look) * (1.0 - bulge);
  vec4 text = sampleLayer(uTex, textUv);

  float z = max(uVideoZ, 0.0);
  float far = 1.0 + z;
  vec2 farUv = look + (uv - look) * (1.0 - bulge);
  vec2 videoUv = world + (farUv - world - travel * (1.0 - 1.0 / far) * uParallax) * far;
  vec4 video = sampleLayer(uVideo, videoUv);

  float hz = max(uHudZ, 0.0);
  float near = 1.0 + hz;
  vec2 nearUv = look + (uv - look) * (1.0 - min(bulge * near, 0.92));
  vec2 hudUv = world + (nearUv - world + travel * (1.0 - 1.0 / near) * uParallax) / near;
  vec4 hud = sampleLayer(uHud, hudUv);

  vec4 mid = text + video * (1.0 - text.a);
  return hud + mid * (1.0 - hud.a);
}

void main() {
  vec2 px = (vUv - uCenter) * uResolution;
  float r = length(px);
  vec2 ndir = r > 1.0 ? px / r : vec2(0.0);
  float falloff = 0.4 + 0.8 * (r / max(length(uResolution) * 0.5, 1.0));
  vec2 shift = ndir * (uChroma * 96.0 * falloff) / uResolution;
  vec4 cg = scene(vUv);
  if (uChroma < 0.001) {
    fragColor = cg;
    return;
  }
  vec4 cr = scene(vUv + shift);
  vec4 cb = scene(vUv - shift);
  fragColor = vec4(cr.r, cg.g, cb.b, max(max(cr.a, cg.a), cb.a));
}`;

function shader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("[textfx] fisheye shader", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function makeGL(canvas) {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
  });
  if (!gl) return null;

  const vs = shader(gl, gl.VERTEX_SHADER, VS);
  const fs = shader(gl, gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("[textfx] fisheye program", gl.getProgramInfoLog(prog));
    return null;
  }

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  function makeTex() {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  const texText = makeTex();
  const texVideo = makeTex();
  const texHud = makeTex();

  gl.useProgram(prog);
  gl.uniform1i(gl.getUniformLocation(prog, "uTex"), 0);
  gl.uniform1i(gl.getUniformLocation(prog, "uVideo"), 1);
  gl.uniform1i(gl.getUniformLocation(prog, "uHud"), 2);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
  gl.clearColor(0, 0, 0, 0);

  const uCenter = gl.getUniformLocation(prog, "uCenter");
  const uResolution = gl.getUniformLocation(prog, "uResolution");
  const uStrength = gl.getUniformLocation(prog, "uStrength");
  const uRadius = gl.getUniformLocation(prog, "uRadius");
  const uVideoZ = gl.getUniformLocation(prog, "uVideoZ");
  const uHudZ = gl.getUniformLocation(prog, "uHudZ");
  const uParallax = gl.getUniformLocation(prog, "uParallax");
  const uChroma = gl.getUniformLocation(prog, "uChroma");

  return {
    resize(w, h) {
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    },
    upload(textSource, videoSource, hudSource) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texText);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textSource);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texVideo);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoSource);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, texHud);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hudSource);
    },
    draw(state, cssW, cssH, radius, video = {}, chroma = 0) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texText);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texVideo);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, texHud);
      gl.uniform2f(uCenter, state.cx, state.cy);
      gl.uniform2f(uResolution, cssW, cssH);
      gl.uniform1f(uStrength, state.strength);
      gl.uniform1f(uRadius, radius);
      gl.uniform1f(uVideoZ, Math.max(0, Number(video.z) || 0));
      gl.uniform1f(uHudZ, Math.max(0, Number(video.front) || 0));
      gl.uniform1f(uParallax, video.parallax == null ? 1 : Math.max(0, Number(video.parallax)));
      gl.uniform1f(uChroma, Math.max(0, Number(chroma) || 0));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    destroy() {
      gl.deleteTexture(texText);
      gl.deleteTexture(texVideo);
      gl.deleteTexture(texHud);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      const lose = gl.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    },
  };
}

function localFromClient(el, clientX, clientY) {
  const r = el.getBoundingClientRect();
  const sx = r.width ? el.clientWidth / r.width : 1;
  const sy = r.height ? el.clientHeight / r.height : 1;
  return {
    x: (clientX - r.left) * sx,
    y: (clientY - r.top) * sy,
  };
}

function scaledGlyphCenter(char, glyph, gsap) {
  const scale = Number(gsap.getProperty(char, "scale")) || 1;
  const mx = Number(gsap.getProperty(char, "x")) || 0;
  const my = Number(gsap.getProperty(char, "y")) || 0;
  const parts = getComputedStyle(char).transformOrigin.split(" ");
  const ox = parseFloat(parts[0]) || char.offsetWidth / 2;
  const oy = parseFloat(parts[1]) || char.offsetHeight / 2;
  const cr = char.getBoundingClientRect();
  const layoutLeft = cr.left - mx - ox * (1 - scale);
  const layoutTop = cr.top - my - oy * (1 - scale);
  const anchor = glyphAnchor(glyph);
  const homeY = Number(char.dataset.tfxAnchorY);
  let gx = glyph.offsetLeft + anchor.x;
  let gy = glyph.offsetTop + (Number.isFinite(homeY) ? homeY : anchor.y);
  const gt = getComputedStyle(glyph).transform;
  if (gt && gt !== "none") {
    const m = new DOMMatrix(gt);
    gx += m.e;
    gy += m.f;
  }
  return {
    x: layoutLeft + ox + (gx - ox) * scale + mx,
    y: layoutTop + oy + (gy - oy) * scale + my,
    scale,
  };
}

function localRect(el, box) {
  const r = el.getBoundingClientRect();
  const sx = r.width ? el.clientWidth / r.width : 1;
  const sy = r.height ? el.clientHeight / r.height : 1;
  return {
    x: (box.left - r.left) * sx,
    y: (box.top - r.top) * sy,
    w: box.width * sx,
    h: box.height * sy,
  };
}

function backingSize(cssW, cssH) {
  const dpr = Math.min(1.25, window.devicePixelRatio || 1);
  let bw = Math.max(1, Math.round(cssW * dpr));
  let bh = Math.max(1, Math.round(cssH * dpr));
  const edge = Math.max(bw, bh);
  if (edge > 1920) {
    const k = 1920 / edge;
    bw = Math.max(1, Math.round(bw * k));
    bh = Math.max(1, Math.round(bh * k));
  }
  return { bw, bh };
}

export function fisheye(opts, api) {
  if (isSafari()) {
    return {
      update(next) {
        Object.assign(opts, next);
      },
      pause() {},
      resume() {},
      destroy() {},
    };
  }

  const canvas = document.createElement("canvas");
  canvas.className = "tfx-fisheye";
  const off = document.createElement("canvas");
  const offVideo = document.createElement("canvas");
  const offHud = document.createElement("canvas");
  const ctx = off.getContext("2d");
  const vctx = offVideo.getContext("2d");
  const hctx = offHud.getContext("2d");
  const probe = document.createElement("canvas");
  probe.width = 8;
  probe.height = 8;
  const probeCtx = probe.getContext("2d", { willReadFrequently: true });
  const gpu = makeGL(canvas);
  const state = { strength: 0, cx: 0.5, cy: 0.5 };
  let cxTo = api.gsap.quickTo(state, "cx", { duration: 0.45, ease: "power3.out" });
  let cyTo = api.gsap.quickTo(state, "cy", { duration: 0.45, ease: "power3.out" });
  let live = false;
  let raf = 0;
  let cssW = 1;
  let cssH = 1;
  let padX = 0;
  let padY = 0;

  function stopLoop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function hide() {
    api.root.classList.remove("tfx-root--fisheye");
    canvas.remove();
  }

  function videoScale() {
    return Math.max(0.01, Number(api.getConfig().video?.scale) || 1);
  }

  function typeBleed() {
    const bx = Math.round(api.root.clientWidth * 0.18);
    const by = Math.round(api.root.clientHeight * 0.28);
    return {
      w: Math.max(1, api.root.clientWidth + bx * 2),
      h: Math.max(1, api.root.clientHeight + by * 2),
    };
  }

  function viewCover() {
    const root = api.root;
    const host = root.closest(".hero") || root;
    const rr = root.getBoundingClientRect();
    const hr = host.getBoundingClientRect();
    const sx = rr.width ? root.clientWidth / rr.width : 1;
    const sy = rr.height ? root.clientHeight / rr.height : 1;
    return {
      w: Math.max(1, Math.round(hr.width * sx)),
      h: Math.max(1, Math.round(hr.height * sy)),
    };
  }

  function layout() {
    const bleed = typeBleed();
    const view = viewCover();
    let nextW = Math.max(bleed.w, view.w);
    let nextH = Math.max(bleed.h, view.h);
    const video = api.root.querySelector(".tfx-video");
    const vw = video?.videoWidth || 0;
    const vh = video?.videoHeight || 0;
    if (vw && vh) {
      const fit = Math.min(bleed.w / vw, bleed.h / vh) * videoScale();
      nextW = Math.max(nextW, Math.ceil(vw * fit));
      nextH = Math.max(nextH, Math.ceil(vh * fit));
    }
    padX = Math.round((nextW - api.root.clientWidth) / 2);
    padY = Math.round((nextH - api.root.clientHeight) / 2);
    canvas.style.left = `${-padX}px`;
    canvas.style.top = `${-padY}px`;
    canvas.style.width = `${nextW}px`;
    canvas.style.height = `${nextH}px`;
    cssW = nextW;
    cssH = nextH;
    const { bw, bh } = backingSize(cssW, cssH);
    gpu.resize(bw, bh);
    if (off.width !== bw) off.width = bw;
    if (off.height !== bh) off.height = bh;
    if (offVideo.width !== bw) offVideo.width = bw;
    if (offVideo.height !== bh) offVideo.height = bh;
    if (offHud.width !== bw) offHud.width = bw;
    if (offHud.height !== bh) offHud.height = bh;
  }

  function hasPicture(video) {
    if (!video || video.seeking || video.ended || video.readyState < 2) return false;
    if (!video.videoWidth || !video.videoHeight) return false;
    probeCtx.drawImage(video, 0, 0, 8, 8);
    const px = probeCtx.getImageData(0, 0, 8, 8).data;
    let energy = 0;
    for (let i = 0; i < px.length; i += 4) energy += px[i] + px[i + 1] + px[i + 2];
    return energy > 8 * 8 * 3 * 8;
  }

  function stampVideo() {
    const video = api.root.querySelector(".tfx-video");
    if (!hasPicture(video)) return;
    const dpr = offVideo.width / cssW;
    vctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    vctx.clearRect(0, 0, cssW, cssH);
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const bleed = typeBleed();
    const fit = Math.min(bleed.w / vw, bleed.h / vh) * videoScale();
    const dw = vw * fit;
    const dh = vh * fit;
    const dx = (cssW - dw) / 2;
    const dy = (cssH - dh) / 2;
    const round = Math.max(0, Number(api.getConfig().video?.radius) || 0);
    if (round > 0) {
      const rr = Math.min(round, dw / 2, dh / 2);
      vctx.save();
      vctx.beginPath();
      if (vctx.roundRect) vctx.roundRect(dx, dy, dw, dh, rr);
      else {
        vctx.moveTo(dx + rr, dy);
        vctx.arcTo(dx + dw, dy, dx + dw, dy + dh, rr);
        vctx.arcTo(dx + dw, dy + dh, dx, dy + dh, rr);
        vctx.arcTo(dx, dy + dh, dx, dy, rr);
        vctx.arcTo(dx, dy, dx + dw, dy, rr);
        vctx.closePath();
      }
      vctx.clip();
      vctx.drawImage(video, dx, dy, dw, dh);
      vctx.restore();
      return;
    }
    vctx.drawImage(video, dx, dy, dw, dh);
  }

  function stamp() {
    const dpr = off.width / cssW;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    const hover = api.getHover();
    const config = api.getConfig();
    const letterGlow = (config.letter?.effects || []).find((e) => e.type === "glow");
    const wordGlow = (config.word?.effects || []).find((e) => e.type === "glow");
    const glyphs = api.root.querySelectorAll(".tfx-glyph");
    const draws = [];
    for (const glyph of glyphs) {
      const ch = glyph.textContent || "";
      if (!ch.trim()) continue;
      const char = glyph.closest(".tfx-char");
      if (!char || !char.offsetWidth || !glyph.offsetWidth) continue;
      const placed = scaledGlyphCenter(char, glyph, api.gsap);
      draws.push({
        ch,
        cs: getComputedStyle(glyph),
        placed,
        letterHot: char === hover.charEl,
        wordHot: hover.wordEl && hover.wordEl.contains(char),
      });
    }
    for (const draw of draws) {
      const p = localFromClient(canvas, draw.placed.x, draw.placed.y);
      const size = (parseFloat(draw.cs.fontSize) || 16) * draw.placed.scale;
      ctx.font = `${draw.cs.fontStyle} ${draw.cs.fontWeight} ${size}px ${draw.cs.fontFamily}`;
      ctx.fillStyle = draw.cs.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      if (draw.letterHot && letterGlow) {
        ctx.shadowColor = letterGlow.color ?? "#ffffff";
        ctx.shadowBlur = letterGlow.size ?? 4;
      } else if (draw.wordHot && wordGlow) {
        ctx.shadowColor = wordGlow.color ?? "#ffffff";
        ctx.shadowBlur = wordGlow.size ?? 12;
      }
      ctx.fillText(draw.ch, p.x, p.y);
    }
    ctx.shadowBlur = 0;
    stampGrid();
    stampLetterBox();
  }

  function hudOpacity(node) {
    if (!node) return 0;
    return Number(api.gsap.getProperty(node, "opacity")) || 0;
  }

  function strokeCorners(c, r, tick) {
    c.beginPath();
    c.moveTo(r.x, r.y + tick);
    c.lineTo(r.x, r.y);
    c.lineTo(r.x + tick, r.y);
    c.moveTo(r.x + r.w - tick, r.y);
    c.lineTo(r.x + r.w, r.y);
    c.lineTo(r.x + r.w, r.y + tick);
    c.moveTo(r.x, r.y + r.h - tick);
    c.lineTo(r.x, r.y + r.h);
    c.lineTo(r.x + tick, r.y + r.h);
    c.moveTo(r.x + r.w - tick, r.y + r.h);
    c.lineTo(r.x + r.w, r.y + r.h);
    c.lineTo(r.x + r.w, r.y + r.h - tick);
    c.stroke();
  }

  function stampGrid() {
    const config = api.getConfig();
    if (!config.base.boxes) return;
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.lineJoin = "miter";
    ctx.lineCap = "square";
    ctx.globalAlpha = 1;
    ctx.strokeStyle =
      getComputedStyle(api.root).getPropertyValue("--tfx-color-neutral").trim() ||
      config.base.color;
    ctx.lineWidth = 1;
    for (const char of api.root.querySelectorAll(".tfx-char")) {
      if (char.classList.contains("tfx-char--space") || char.classList.contains("tfx-char--hot")) {
        continue;
      }
      const box = inkClientRect(char);
      if (!box.width && !box.height) continue;
      const r = localRect(canvas, box);
      ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w, r.h);
    }
  }

  function stampLetterBox() {
    const letter = api.root.querySelector(".tfx-box--letter");
    const aLetter = hudOpacity(letter);
    if (aLetter <= 0.01) return;
    const r = localRect(canvas, letter.getBoundingClientRect());
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.lineJoin = "miter";
    ctx.lineCap = "square";
    ctx.globalAlpha = aLetter;
    ctx.strokeStyle = getComputedStyle(letter).color;
    ctx.lineWidth = 1;
    ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w, r.h);
    ctx.globalAlpha = 1;
  }

  function stampHud() {
    const dpr = offHud.width / cssW;
    hctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    hctx.clearRect(0, 0, cssW, cssH);
    const em = parseFloat(getComputedStyle(api.root).fontSize) || 16;
    const tick = em * 0.035;
    hctx.shadowColor = "transparent";
    hctx.shadowBlur = 0;
    hctx.lineJoin = "miter";
    hctx.lineCap = "square";
    hctx.lineWidth = 1;

    const word = api.root.querySelector(".tfx-box--word");
    const aWord = hudOpacity(word);
    if (aWord > 0.01) {
      const r = localRect(canvas, word.getBoundingClientRect());
      hctx.globalAlpha = aWord;
      hctx.strokeStyle = getComputedStyle(word).color;
      strokeCorners(hctx, r, tick);
    }

    const letter = api.root.querySelector(".tfx-box--letter");
    const aLetter = hudOpacity(letter);
    if (aLetter > 0.01) {
      const r = localRect(canvas, letter.getBoundingClientRect());
      hctx.globalAlpha = aLetter;
      hctx.strokeStyle = getComputedStyle(letter).color;
      strokeCorners(hctx, r, tick);
    }

    const details = api.root.querySelector(".tfx-details");
    const aDetails = hudOpacity(details);
    if (aDetails > 0.01 && details?.textContent) {
      const r = localRect(canvas, details.getBoundingClientRect());
      const cs = getComputedStyle(details);
      hctx.globalAlpha = aDetails;
      hctx.fillStyle = cs.color;
      hctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      hctx.textAlign = "left";
      hctx.textBaseline = "top";
      if ("letterSpacing" in hctx) hctx.letterSpacing = cs.letterSpacing;
      hctx.fillText(details.textContent.toUpperCase(), r.x, r.y);
      if ("letterSpacing" in hctx) hctx.letterSpacing = "0px";
    }

    hctx.globalAlpha = 1;
  }

  function paint() {
    if (!gpu || !canvas.isConnected) return;
    layout();
    api.root.classList.add("tfx-root--fisheye");
    stamp();
    stampVideo();
    stampHud();
    gpu.upload(off, offVideo, offHud);
    const lookX = state.cx * cssW;
    const lookY = state.cy * cssH;
    const cover = Math.max(
      Math.hypot(lookX, lookY),
      Math.hypot(cssW - lookX, lookY),
      Math.hypot(lookX, cssH - lookY),
      Math.hypot(cssW - lookX, cssH - lookY)
    );
    gpu.draw(
      state,
      cssW,
      cssH,
      Math.max(opts.radius ?? 4200, cover),
      api.getConfig().video,
      opts.chroma ?? 0.85
    );
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    if (!live) {
      stopLoop();
      return;
    }
    paint();
  }

  function aim(clientX, clientY) {
    if (!canvas.isConnected) return;
    const root = api.root;
    const p = localFromClient(root, clientX, clientY);
    const amount = Math.max(0, Math.min(1, opts.look ?? 0.4));
    const rw = Math.max(1, root.clientWidth);
    const rh = Math.max(1, root.clientHeight);
    const edge = 0.1;
    const nx = Math.max(edge, Math.min(1 - edge, 0.5 + (p.x / rw - 0.5) * amount));
    const ny = Math.max(edge, Math.min(1 - edge, 0.5 + (p.y / rh - 0.5) * amount));
    cxTo((padX + nx * rw) / cssW);
    cyTo((padY + ny * rh) / cssH);
  }

  function tweenStrength(value) {
    const hover = api.getConfig().hover;
    api.gsap.to(state, {
      strength: api.reduceMotion ? 0 : Math.max(0, Math.min(1, value)),
      duration: api.reduceMotion ? 0 : hover?.duration ?? 0.18,
      ease: hover?.ease ?? "power2.out",
      overwrite: "auto",
    });
  }

  function setLive(on) {
    if (api.reduceMotion) on = false;
    if (on === live) {
      if (on) paint();
      return;
    }
    live = on;
    if (on) {
      if (!canvas.isConnected) api.root.appendChild(canvas);
      layout();
      cxTo = api.gsap.quickTo(state, "cx", { duration: 0.45, ease: "power3.out" });
      cyTo = api.gsap.quickTo(state, "cy", { duration: 0.45, ease: "power3.out" });
      tweenStrength(opts.strength ?? 0.85);
      paint();
      if (!raf) loop();
      return;
    }
    api.gsap.killTweensOf(state);
    api.gsap.set(state, { strength: 0, cx: 0.5, cy: 0.5 });
    stopLoop();
    hide();
  }

  function syncLive() {
    if (api.isPaused?.() || document.visibilityState === "hidden") setLive(false);
    else setLive(true);
  }

  function onPointer(e) {
    if (!live) return;
    aim(e.clientX, e.clientY);
  }

  if (!gpu || !ctx || !vctx || !hctx || !probeCtx) {
    return {
      update(next) {
        Object.assign(opts, next);
      },
      pause() {},
      resume() {},
      destroy() {},
    };
  }

  window.addEventListener("pointermove", onPointer);
  document.addEventListener("visibilitychange", syncLive);
  window.addEventListener("resize", syncLive);
  syncLive();

  return {
    move({ pointer }) {
      if (live && pointer) aim(pointer.x, pointer.y);
    },
    pause() {
      setLive(false);
    },
    resume() {
      setLive(true);
    },
    update(next) {
      const strength = next.strength ?? opts.strength;
      const changed = strength !== opts.strength;
      Object.assign(opts, next);
      if (live && changed) tweenStrength(opts.strength ?? 0.85);
    },
    destroy() {
      live = false;
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", syncLive);
      window.removeEventListener("resize", syncLive);
      stopLoop();
      api.gsap.killTweensOf(state);
      hide();
      gpu.destroy();
    },
  };
}

