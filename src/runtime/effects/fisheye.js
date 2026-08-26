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
uniform vec2 uCenter;
uniform vec2 uResolution;
uniform float uStrength;
uniform float uRadius;

void main() {
  vec2 px = (vUv - uCenter) * uResolution;
  float r = length(px);
  float R = max(uRadius, 1.0);
  float nr = min(r / R, 1.0);
  float k = clamp(uStrength, 0.0, 1.0);
  float zoom = 1.0 - k * 0.32 * (1.0 - nr * nr);
  vec2 uv = uCenter + px * zoom / uResolution;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) {
    fragColor = vec4(0.0);
    return;
  }
  fragColor = texture(uTex, uv);
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

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.useProgram(prog);
  gl.uniform1i(gl.getUniformLocation(prog, "uTex"), 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
  gl.clearColor(0, 0, 0, 0);

  const uCenter = gl.getUniformLocation(prog, "uCenter");
  const uResolution = gl.getUniformLocation(prog, "uResolution");
  const uStrength = gl.getUniformLocation(prog, "uStrength");
  const uRadius = gl.getUniformLocation(prog, "uRadius");

  return {
    resize(w, h) {
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    },
    upload(source) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    },
    draw(state, cssW, cssH, radius) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform2f(uCenter, state.cx, state.cy);
      gl.uniform2f(uResolution, cssW, cssH);
      gl.uniform1f(uStrength, state.strength);
      gl.uniform1f(uRadius, radius);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    destroy() {
      gl.deleteTexture(tex);
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

export function fisheye(opts, api) {
  const canvas = document.createElement("canvas");
  canvas.className = "tfx-fisheye";
  const off = document.createElement("canvas");
  const ctx = off.getContext("2d");
  const gpu = makeGL(canvas);
  const state = { strength: 0, cx: 0.5, cy: 0.5 };
  const cxTo = api.gsap.quickTo(state, "cx", { duration: 0.45, ease: "power3.out" });
  const cyTo = api.gsap.quickTo(state, "cy", { duration: 0.45, ease: "power3.out" });
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

  function layout() {
    padX = Math.round(api.root.clientWidth * 0.18);
    padY = Math.round(api.root.clientHeight * 0.28);
    const nextW = Math.max(1, api.root.clientWidth + padX * 2);
    const nextH = Math.max(1, api.root.clientHeight + padY * 2);
    canvas.style.left = `${-padX}px`;
    canvas.style.top = `${-padY}px`;
    canvas.style.width = `${nextW}px`;
    canvas.style.height = `${nextH}px`;
    cssW = nextW;
    cssH = nextH;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const bw = Math.max(1, Math.round(cssW * dpr));
    const bh = Math.max(1, Math.round(cssH * dpr));
    gpu.resize(bw, bh);
    if (off.width !== bw) off.width = bw;
    if (off.height !== bh) off.height = bh;
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
      if (!char) continue;
      const box = glyph.getBoundingClientRect();
      if (!box.width || !box.height) continue;
      draws.push({
        ch,
        cs: getComputedStyle(glyph),
        box,
        scale: Number(api.gsap.getProperty(char, "scale")) || 1,
        letterHot: char === hover.charEl,
        wordHot: hover.wordEl && hover.wordEl.contains(char),
      });
    }
    for (const draw of draws) {
      const p = localFromClient(
        canvas,
        draw.box.left + draw.box.width / 2,
        draw.box.top + draw.box.height / 2
      );
      const size = (parseFloat(draw.cs.fontSize) || 16) * draw.scale;
      ctx.font = `${draw.cs.fontStyle} ${draw.cs.fontWeight} ${size}px ${draw.cs.fontFamily}`;
      ctx.fillStyle = draw.cs.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
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
  }

  function paint() {
    if (!gpu || !canvas.isConnected) return;
    layout();
    api.root.classList.add("tfx-root--fisheye");
    stamp();
    gpu.upload(off);
    gpu.draw(state, cssW, cssH, opts.radius ?? 2000);
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
    const p = localFromClient(canvas, clientX, clientY);
    cxTo(p.x / cssW);
    cyTo(p.y / cssH);
  }

  function tweenStrength(value) {
    const hover = api.getConfig().hover;
    api.gsap.to(state, {
      strength: api.reduceMotion ? 0 : Math.max(0, Math.min(1, value)),
      duration: api.reduceMotion ? 0 : hover?.duration ?? 0.18,
      ease: hover?.ease ?? "power2.out",
      overwrite: true,
    });
  }

  function setLive(on) {
    if (api.reduceMotion) on = false;
    if (on === live) return;
    live = on;
    if (on) {
      if (!canvas.isConnected) api.root.appendChild(canvas);
      layout();
      tweenStrength(opts.strength ?? 0.85);
      if (!raf) loop();
      return;
    }
    api.gsap.killTweensOf(state);
    api.gsap.set(state, { strength: 0, cx: 0.5, cy: 0.5 });
    stopLoop();
    hide();
  }

  function heroVisible() {
    if (document.visibilityState === "hidden") return false;
    const r = api.root.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
  }

  function syncLive() {
    setLive(heroVisible());
  }

  function onPointer(e) {
    if (!live) return;
    aim(e.clientX, e.clientY);
  }

  if (!gpu || !ctx) {
    return {
      update(next) {
        Object.assign(opts, next);
      },
      destroy() {},
    };
  }

  const io = new IntersectionObserver(() => syncLive(), {
    threshold: [0, 0.15, 0.5],
  });
  io.observe(api.root);
  window.addEventListener("pointermove", onPointer);
  document.addEventListener("visibilitychange", syncLive);
  window.addEventListener("resize", syncLive);
  syncLive();

  return {
    move({ pointer }) {
      if (live && pointer) aim(pointer.x, pointer.y);
    },
    update(next) {
      Object.assign(opts, next);
      if (live) tweenStrength(opts.strength ?? 0.85);
    },
    destroy() {
      live = false;
      io.disconnect();
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

