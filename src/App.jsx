import { useEffect, useRef, useState } from "react";
import { FONT_CREDITS } from "./fontCredits.js";
import { isSafari } from "./runtime/browser.js";
import {
  CYCLE_FONTS,
  defaultConfig,
  getEffect,
  glyphMode,
  hasEffect,
  mount,
  patchEffect,
  patchEngineVideo,
  setEffect,
  setGlyphMode,
} from "./runtime/index.js";

const EASES = [
  "power1.out",
  "power2.out",
  "power3.out",
  "expo.out",
  "back.out(1.7)",
  "elastic.out(1, 0.5)",
  "none",
];

function Section({ title, children }) {
  return (
    <div className="section">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function Fx({ children }) {
  return <div className="fx">{children}</div>;
}

function Row({ label, value, children }) {
  return (
    <div className={value != null ? "row row--val" : "row"}>
      <label>{label}</label>
      {children}
      {value != null && <span className="val">{value}</span>}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function SoundSwitch({ on, onChange }) {
  return (
    <Row label="sound">
      <div className="sound-switch" role="group" aria-label="sound">
        <button type="button" className={on ? "is-on" : undefined} aria-pressed={on} onClick={() => onChange(true)}>
          on
        </button>
        <button type="button" className={!on ? "is-on" : undefined} aria-pressed={!on} onClick={() => onChange(false)}>
          off
        </button>
      </div>
    </Row>
  );
}

function EngineTabs({ value, onChange }) {
  return (
    <div className="engine-tabs" role="tablist" aria-label="engine settings">
      <button
        type="button"
        role="tab"
        className={value === "chrome" ? "is-on" : undefined}
        aria-selected={value === "chrome"}
        onClick={() => onChange("chrome")}
      >
        chrome
      </button>
      <button
        type="button"
        role="tab"
        className={value === "safari" ? "is-on" : undefined}
        aria-selected={value === "safari"}
        onClick={() => onChange("safari")}
      >
        safari
      </button>
    </div>
  );
}

function displayFont(family) {
  const quoted = String(family).match(/"([^"]+)"/);
  if (quoted) return quoted[1];
  return String(family).split(",")[0].trim() || "font";
}

function familyFromFile(file) {
  const raw = file.name.replace(/\.[^.]+$/, "").replace(/['"]/g, "").trim();
  return raw || "LocalFont";
}

function weightFromStyle(style = "") {
  const s = style.toLowerCase();
  if (/\b(thin|hairline)\b/.test(s)) return "100";
  if (/\b(extra\s*light|ultra\s*light)\b/.test(s)) return "200";
  if (/\blight\b/.test(s)) return "300";
  if (/\bmedium\b/.test(s)) return "500";
  if (/\b(semi\s*bold|demi\s*bold)\b/.test(s)) return "600";
  if (/\b(extra\s*bold|ultra\s*bold)\b/.test(s)) return "800";
  if (/\b(black|heavy)\b/.test(s)) return "900";
  if (/\bbold\b/.test(s)) return "700";
  return "400";
}

function bestLocalFace(faces, targetWeight) {
  if (!faces.length) return null;
  return faces.slice().sort((a, b) => {
    const italicA = /italic|oblique/i.test(a.style) ? 1 : 0;
    const italicB = /italic|oblique/i.test(b.style) ? 1 : 0;
    const distA = Math.abs(Number(weightFromStyle(a.style)) - targetWeight);
    const distB = Math.abs(Number(weightFromStyle(b.style)) - targetWeight);
    return italicA - italicB || distA - distB;
  })[0];
}

export function App() {
  const stageRef = useRef(null);
  const heroRef = useRef(null);
  const instRef = useRef(null);
  const fontFileRef = useRef(null);
  const fontsLoaded = useRef(false);
  const localFontsRef = useRef([]);
  const skipUpdate = useRef(true);
  const [config, setConfig] = useState(() => defaultConfig());
  const [copied, setCopied] = useState(false);
  const [uiHidden, setUiHidden] = useState(true);
  const [fpsOn, setFpsOn] = useState(false);
  const [fps, setFps] = useState(0);
  const [systemFonts, setSystemFonts] = useState([]);
  const [fontOpen, setFontOpen] = useState(false);
  const [fontQuery, setFontQuery] = useState("");
  const [fontStatus, setFontStatus] = useState("idle");
  const [pendingFont, setPendingFont] = useState(null);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [engineTab, setEngineTab] = useState(() => (isSafari() ? "safari" : "chrome"));

  useEffect(() => {
    const inst = mount(stageRef.current, config);
    instRef.current = inst;
    skipUpdate.current = true;

    const hero = heroRef.current;
    function sync() {
      if (!hero) return;
      if (hero.getBoundingClientRect().bottom <= 0) inst.pause();
      else inst.resume();
    }
    document.addEventListener("scroll", sync, { passive: true, capture: true });
    sync();

    return () => {
      document.removeEventListener("scroll", sync, { capture: true });
      inst.destroy();
      instRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (skipUpdate.current) {
      skipUpdate.current = false;
      return;
    }
    instRef.current?.update(config);
  }, [config]);

  useEffect(() => {
    function onKey(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        setUiHidden((hidden) => !hidden);
        return;
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        setFpsOn((on) => !on);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!fpsOn) return;
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    function loop(now) {
      frames += 1;
      const elapsed = now - last;
      if (elapsed >= 500) {
        setFps(Math.round((frames * 1000) / elapsed));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fpsOn]);

  const wordColor = getEffect(config, "word", "color")?.color ?? "#e1ff00";
  const letterColor = getEffect(config, "letter", "color")?.color ?? "#ffffff";
  const wordGlow = getEffect(config, "word", "glow");
  const letterGlow = getEffect(config, "letter", "glow");
  const wordGlowSize = wordGlow?.size ?? 12;
  const letterGlowSize = letterGlow?.size ?? 34;
  const wordGlowColor = wordGlow?.color ?? "#c8ff00";
  const letterGlowColor = letterGlow?.color ?? "#ffffff";
  const letterScale = getEffect(config, "letter", "scale");
  const magnetic = getEffect(config, "letter", "magnetic");
  const fisheye = getEffect(config, "letter", "fisheye");
  const cycle = getEffect(config, "letter", "fontCycle");
  const cycleFonts = cycle?.fonts || CYCLE_FONTS;
  const mode = glyphMode(config);
  const chromeTune = config.video?.chrome ?? {};
  const safariScale = config.video?.safari?.scale ?? chromeTune.scale ?? 1;
  const scaleValue = engineTab === "safari" ? safariScale : chromeTune.scale ?? 1;
  const fontNeedle = fontQuery.trim().toLowerCase();
  const fontMatches = fontNeedle
    ? systemFonts.filter((family) => family.toLowerCase().includes(fontNeedle))
    : systemFonts;

  function setChromeVideo(patch) {
    setConfig(patchEngineVideo(config, "chrome", patch));
  }

  function setSafariScale(scale) {
    setConfig(patchEngineVideo(config, "safari", { scale }));
  }

  function copyConfig() {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  async function ensureSystemFonts() {
    if (fontsLoaded.current) return;
    if (typeof window.queryLocalFonts !== "function") {
      setFontStatus("unsupported");
      return;
    }
    setFontStatus("loading");
    try {
      const fonts = await window.queryLocalFonts();
      localFontsRef.current = fonts;
      const families = [...new Set(fonts.map((font) => font.family))].sort((a, b) =>
        a.localeCompare(b)
      );
      fontsLoaded.current = true;
      setSystemFonts(families);
      setFontStatus("ready");
    } catch {
      setFontStatus("denied");
    }
  }

  function openFontPicker() {
    setFontOpen(true);
    setFontQuery("");
    ensureSystemFonts();
  }

  async function pickFamily(family) {
    setFontOpen(false);
    setFontQuery("");
    setPendingFont(family);
    const faces = localFontsRef.current.filter((font) => font.family === family);
    const best = bestLocalFace(faces, Number(config.base.fontWeight) || 400);
    try {
      if (!best?.blob) throw new Error("no face");
      const weight = weightFromStyle(best.style);
      const face = new FontFace(family, await (await best.blob()).arrayBuffer(), {
        weight,
        style: /italic|oblique/i.test(best.style) ? "italic" : "normal",
      });
      await face.load();
      document.fonts.add(face);
      await document.fonts.load(
        `${weight} ${config.base.fontSize}px "${family}"`,
        config.text
      );
      setConfig((c) => ({
        ...c,
        base: {
          ...c.base,
          fontFamily: `"${family}"`,
          fontWeight: Number(weight) || 400,
        },
      }));
    } catch {
      setConfig((c) => ({
        ...c,
        base: { ...c.base, fontFamily: `"${family}", sans-serif` },
      }));
    }
    setPendingFont(null);
  }

  async function onBaseFontFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const name = familyFromFile(file);
    try {
      const face = new FontFace(name, await file.arrayBuffer());
      await face.load();
      document.fonts.add(face);
      await document.fonts.load(`400 ${config.base.fontSize}px "${name}"`, config.text);
    } catch {
      return;
    }
    setFontOpen(false);
    setConfig((c) => ({
      ...c,
      base: { ...c.base, fontFamily: `"${name}", sans-serif`, fontWeight: 400 },
    }));
  }

  return (
    <div className="shell">
    <div className="hero" ref={heroRef}>
    {/* <div className="hero-logo" aria-hidden="true">S</div> */}
    <div className="artboard">
    <div className={uiHidden ? "editor editor--ui-hidden" : "editor"}>
      <div className="stage">
        <div className="preview" ref={stageRef} />
      </div>

      {fpsOn && (
        <div className="fps" aria-live="polite">
          {fps} fps
        </div>
      )}

      {uiHidden && (
        <button className="ui-toggle" type="button" onClick={() => setUiHidden(false)}>
          ui
        </button>
      )}

      <aside className="panel">
        <header className="panel-head">
          <h1>
            <button
              type="button"
              className="panel-title"
              onClick={() => setCreditsOpen((open) => !open)}
            >
              TextFX
            </button>
          </h1>
          <div className="panel-head-actions">
            {creditsOpen ? (
              <button className="copy" type="button" onClick={() => setCreditsOpen(false)}>
                back
              </button>
            ) : (
              <>
                <button className="copy" type="button" onClick={() => setUiHidden(true)}>
                  hide
                </button>
                <button className="copy" type="button" onClick={copyConfig}>
                  {copied ? "copied" : "copy"}
                </button>
              </>
            )}
          </div>
        </header>

        {creditsOpen ? (
          <div className="credits">
            <p className="credits-lead">Open source typefaces used in the hover font cycle.</p>
            {FONT_CREDITS.map((entry) => (
              <article key={entry.name} className="credit">
                <h3 className="credit-name">
                  {entry.name}
                  {entry.year ? ` (${entry.year})` : ""}
                </h3>
                <p className="credit-by">by {entry.by}</p>
                {entry.description && <p className="credit-desc">{entry.description}</p>}
                {entry.note && <p className="credit-note">{entry.note}</p>}
                {entry.license && <p className="credit-license">{entry.license}</p>}
              </article>
            ))}
          </div>
        ) : (
          <>
        <Section title="Type">
          <Row label="text">
            <input
              type="text"
              value={config.text}
              onChange={(e) => setConfig({ ...config, text: e.target.value })}
            />
          </Row>
          <Row label="font">
            <div
              className="font-pick-wrap"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setFontOpen(false);
              }}
            >
              <input
                className="font-pick"
                type="text"
                value={
                  fontOpen
                    ? fontQuery
                    : pendingFont || displayFont(config.base.fontFamily)
                }
                placeholder="search fonts"
                onFocus={openFontPicker}
                onChange={(e) => {
                  setFontOpen(true);
                  setFontQuery(e.target.value);
                  ensureSystemFonts();
                }}
              />
              {fontOpen && (
                <div className="font-list">
                  {fontStatus === "loading" && <div className="font-list-msg">loading fonts…</div>}
                  {fontStatus === "denied" && (
                    <div className="font-list-msg">allow font access in the browser prompt</div>
                  )}
                  {fontStatus === "unsupported" && (
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => fontFileRef.current?.click()}>
                      pick a font file…
                    </button>
                  )}
                  {fontStatus === "ready" &&
                    (fontMatches.length ? (
                      fontMatches.map((family) => (
                          <button
                            key={family}
                            type="button"
                            className={
                              displayFont(config.base.fontFamily) === family ? "is-on" : undefined
                            }
                            style={{ fontFamily: `"${family}", sans-serif` }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              pickFamily(family);
                            }}
                          >
                            {family}
                          </button>
                        ))
                    ) : (
                      <div className="font-list-msg">no matches</div>
                    ))}
                </div>
              )}
              <input
                ref={fontFileRef}
                type="file"
                accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2"
                hidden
                onChange={onBaseFontFile}
              />
            </div>
          </Row>
          <Row label="color">
            <input
              type="color"
              value={config.base.color}
              onChange={(e) =>
                setConfig({ ...config, base: { ...config.base, color: e.target.value } })
              }
            />
          </Row>
          <Toggle
            label="boxes"
            checked={Boolean(config.base.boxes)}
            onChange={(on) =>
              setConfig({ ...config, base: { ...config.base, boxes: on } })
            }
          />
          <SoundSwitch
            on={hasEffect(config, "letter", "sound")}
            onChange={(on) => setConfig(setEffect(config, "letter", "sound", on))}
          />
        </Section>

        <Section title="Layout">
          <Row label="size" value={config.base.fontSize}>
            <input
              type="range"
              min="48"
              max="400"
              step="1"
              value={config.base.fontSize}
              onChange={(e) =>
                setConfig({
                  ...config,
                  base: { ...config.base, fontSize: Number(e.target.value) },
                })
              }
            />
          </Row>
          <Row label="width" value={config.base.width ?? 1375}>
            <input
              type="range"
              min="400"
              max="2400"
              step="10"
              value={config.base.width ?? 1375}
              onChange={(e) =>
                setConfig({
                  ...config,
                  base: { ...config.base, width: Number(e.target.value) },
                })
              }
            />
          </Row>
          <Row label="align">
            <select
              value={config.base.align ?? "left"}
              onChange={(e) =>
                setConfig({
                  ...config,
                  base: { ...config.base, align: e.target.value },
                })
              }
            >
              <option value="left">left</option>
              <option value="center">center</option>
              <option value="right">right</option>
            </select>
          </Row>
          <Row label="spacing" value={(config.base.letterSpacing ?? -0.03).toFixed(3)}>
            <input
              type="range"
              min="-0.12"
              max="0.2"
              step="0.005"
              value={config.base.letterSpacing ?? -0.03}
              onChange={(e) =>
                setConfig({
                  ...config,
                  base: { ...config.base, letterSpacing: Number(e.target.value) },
                })
              }
            />
          </Row>
          <Row label="leading" value={(config.base.lineHeight ?? 1.05).toFixed(2)}>
            <input
              type="range"
              min="0.55"
              max="1.6"
              step="0.01"
              value={config.base.lineHeight ?? 1.05}
              onChange={(e) =>
                setConfig({
                  ...config,
                  base: { ...config.base, lineHeight: Number(e.target.value) },
                })
              }
            />
          </Row>
        </Section>

        <Section title="Video">
          <EngineTabs value={engineTab} onChange={setEngineTab} />
          <Row label="scale" value={`${Number(scaleValue).toFixed(2)}×`}>
            <input
              type="range"
              min="0.2"
              max="4"
              step="0.05"
              value={scaleValue}
              onChange={(e) =>
                engineTab === "safari"
                  ? setSafariScale(Number(e.target.value))
                  : setChromeVideo({ scale: Number(e.target.value) })
              }
            />
          </Row>
          <Row label="z" value={Number(chromeTune.z ?? 0).toFixed(2)}>
            <input
              type="range"
              min="0"
              max="2.5"
              step="0.05"
              value={chromeTune.z ?? 0}
              onChange={(e) => setChromeVideo({ z: Number(e.target.value) })}
            />
          </Row>
          <Row label="round" value={Math.round(chromeTune.radius ?? 0)}>
            <input
              type="range"
              min="0"
              max="160"
              step="1"
              value={chromeTune.radius ?? 0}
              onChange={(e) => setChromeVideo({ radius: Number(e.target.value) })}
            />
          </Row>
          <Row label="parallax" value={Number(chromeTune.parallax ?? 1).toFixed(2)}>
            <input
              type="range"
              min="0"
              max="2.5"
              step="0.05"
              value={chromeTune.parallax ?? 1}
              onChange={(e) => setChromeVideo({ parallax: Number(e.target.value) })}
            />
          </Row>
        </Section>

        <Section title="Motion">
          <Row label="duration" value={Number(config.hover.duration).toFixed(2)}>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.01"
              value={config.hover.duration}
              onChange={(e) =>
                setConfig({
                  ...config,
                  hover: { ...config.hover, duration: Number(e.target.value) },
                })
              }
            />
          </Row>
          <Row label="ease">
            <select
              value={config.hover.ease}
              onChange={(e) =>
                setConfig({ ...config, hover: { ...config.hover, ease: e.target.value } })
              }
            >
              {EASES.map((ease) => (
                <option key={ease} value={ease}>
                  {ease}
                </option>
              ))}
            </select>
          </Row>
          <Fx>
            <Toggle
              label="scale"
              checked={hasEffect(config, "letter", "scale")}
              onChange={(on) =>
                setConfig(
                  setEffect(config, "letter", "scale", on, {
                    amount: letterScale?.amount ?? 1.5,
                  })
                )
              }
            />
            {hasEffect(config, "letter", "scale") && (
              <Row label="amount" value={`${Number(letterScale?.amount ?? 1.5).toFixed(2)}×`}>
                <input
                  type="range"
                  min="1.05"
                  max="3"
                  step="0.05"
                  value={letterScale?.amount ?? 1.5}
                  onChange={(e) =>
                    setConfig(
                      patchEffect(config, "letter", "scale", {
                        amount: Number(e.target.value),
                      })
                    )
                  }
                />
              </Row>
            )}
          </Fx>
        </Section>

        <Section title="Word">
          <Fx>
            <Toggle
              label="color"
              checked={hasEffect(config, "word", "color")}
              onChange={(on) => setConfig(setEffect(config, "word", "color", on, { color: wordColor }))}
            />
            {hasEffect(config, "word", "color") && (
              <Row label="tint">
                <input
                  type="color"
                  value={wordColor}
                  onChange={(e) =>
                    setConfig(patchEffect(config, "word", "color", { color: e.target.value }))
                  }
                />
              </Row>
            )}
          </Fx>
          <Fx>
            <Toggle
              label="glow"
              checked={hasEffect(config, "word", "glow")}
              onChange={(on) =>
                setConfig(setEffect(config, "word", "glow", on, { size: wordGlowSize, color: wordGlowColor }))
              }
            />
            {hasEffect(config, "word", "glow") && (
              <>
                <Row label="tint">
                  <input
                    type="color"
                    value={wordGlowColor}
                    onChange={(e) =>
                      setConfig(patchEffect(config, "word", "glow", { color: e.target.value }))
                    }
                  />
                </Row>
                <Row label="size" value={wordGlowSize}>
                  <input
                    type="range"
                    min="2"
                    max="60"
                    value={wordGlowSize}
                    onChange={(e) =>
                      setConfig(patchEffect(config, "word", "glow", { size: Number(e.target.value) }))
                    }
                  />
                </Row>
              </>
            )}
          </Fx>
          <Fx>
            <Toggle
              label="box"
              checked={hasEffect(config, "word", "box")}
              onChange={(on) => setConfig(setEffect(config, "word", "box", on, { details: false }))}
            />
          </Fx>
        </Section>

        <Section title="Letter">
          <Row label="origin y" value={config.hover.originY ?? 50}>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={config.hover.originY ?? 50}
              onChange={(e) =>
                setConfig({
                  ...config,
                  hover: { ...config.hover, originY: Number(e.target.value) },
                })
              }
            />
          </Row>
          <Fx>
            <Toggle
              label="color"
              checked={hasEffect(config, "letter", "color")}
              onChange={(on) =>
                setConfig(setEffect(config, "letter", "color", on, { color: letterColor }))
              }
            />
            {hasEffect(config, "letter", "color") && (
              <Row label="tint">
                <input
                  type="color"
                  value={letterColor}
                  onChange={(e) =>
                    setConfig(patchEffect(config, "letter", "color", { color: e.target.value }))
                  }
                />
              </Row>
            )}
          </Fx>
          <Fx>
            <Toggle
              label="glow"
              checked={hasEffect(config, "letter", "glow")}
              onChange={(on) =>
                setConfig(
                  setEffect(config, "letter", "glow", on, { size: letterGlowSize, color: letterGlowColor })
                )
              }
            />
            {hasEffect(config, "letter", "glow") && (
              <>
                <Row label="tint">
                  <input
                    type="color"
                    value={letterGlowColor}
                    onChange={(e) =>
                      setConfig(patchEffect(config, "letter", "glow", { color: e.target.value }))
                    }
                  />
                </Row>
                <Row label="size" value={letterGlowSize}>
                  <input
                    type="range"
                    min="2"
                    max="80"
                    value={letterGlowSize}
                    onChange={(e) =>
                      setConfig(patchEffect(config, "letter", "glow", { size: Number(e.target.value) }))
                    }
                  />
                </Row>
              </>
            )}
          </Fx>
          <Fx>
            <Toggle
              label="box"
              checked={hasEffect(config, "letter", "box")}
              onChange={(on) =>
                setConfig(
                  setEffect(config, "letter", "box", on, {
                    details: getEffect(config, "letter", "box")?.details ?? false,
                  })
                )
              }
            />
            {hasEffect(config, "letter", "box") && (
              <>
                <Row label="front" value={Number(chromeTune.front ?? 0).toFixed(3)}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.005"
                    value={chromeTune.front ?? 0}
                    onChange={(e) => setChromeVideo({ front: Number(e.target.value) })}
                  />
                </Row>
                <Toggle
                  label="details"
                  checked={Boolean(getEffect(config, "letter", "box")?.details)}
                  onChange={(on) => setConfig(patchEffect(config, "letter", "box", { details: on }))}
                />
              </>
            )}
          </Fx>
          <Fx>
            <Toggle
              label="magnetic"
              checked={hasEffect(config, "letter", "magnetic")}
              onChange={(on) =>
                setConfig(
                  setEffect(config, "letter", "magnetic", on, {
                    strength: magnetic?.strength ?? 80,
                    radius: magnetic?.radius ?? 360,
                    follow: magnetic?.follow ?? 0.95,
                  })
                )
              }
            />
            {hasEffect(config, "letter", "magnetic") && (
              <>
                <Row label="push" value={magnetic?.strength ?? 80}>
                  <input
                    type="range"
                    min="4"
                    max="80"
                    value={magnetic?.strength ?? 80}
                    onChange={(e) =>
                      setConfig(
                        patchEffect(config, "letter", "magnetic", {
                          strength: Number(e.target.value),
                        })
                      )
                    }
                  />
                </Row>
                <Row label="radius" value={magnetic?.radius ?? 360}>
                  <input
                    type="range"
                    min="40"
                    max="360"
                    value={magnetic?.radius ?? 360}
                    onChange={(e) =>
                      setConfig(
                        patchEffect(config, "letter", "magnetic", {
                          radius: Number(e.target.value),
                        })
                      )
                    }
                  />
                </Row>
                <Row label="lag" value={Number(magnetic?.follow ?? 0.95).toFixed(2)}>
                  <input
                    type="range"
                    min="0.1"
                    max="1.2"
                    step="0.05"
                    value={magnetic?.follow ?? 0.95}
                    onChange={(e) =>
                      setConfig(
                        patchEffect(config, "letter", "magnetic", {
                          follow: Number(e.target.value),
                        })
                      )
                    }
                  />
                </Row>
              </>
            )}
          </Fx>
          {!isSafari() && (
          <Fx>
            <Toggle
              label="fisheye"
              checked={hasEffect(config, "letter", "fisheye")}
              onChange={(on) =>
                setConfig(
                  setEffect(config, "letter", "fisheye", on, {
                    strength: fisheye?.strength ?? 1,
                    radius: fisheye?.radius ?? 2302,
                    look: fisheye?.look ?? 0.4,
                    chroma: fisheye?.chroma ?? 0.85,
                  })
                )
              }
            />
            {hasEffect(config, "letter", "fisheye") && (
              <>
                <Row label="bend" value={Number(fisheye?.strength ?? 1).toFixed(2)}>
                  <input
                    type="range"
                    min="0.15"
                    max="1"
                    step="0.01"
                    value={fisheye?.strength ?? 1}
                    onChange={(e) =>
                      setConfig(
                        patchEffect(config, "letter", "fisheye", {
                          strength: Number(e.target.value),
                        })
                      )
                    }
                  />
                </Row>
                <Row label="radius" value={fisheye?.radius ?? 2302}>
                  <input
                    type="range"
                    min="200"
                    max="6000"
                    value={fisheye?.radius ?? 2302}
                    onChange={(e) =>
                      setConfig(
                        patchEffect(config, "letter", "fisheye", {
                          radius: Number(e.target.value),
                        })
                      )
                    }
                  />
                </Row>
                <Row label="3d" value={Number(fisheye?.look ?? 0.4).toFixed(2)}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={fisheye?.look ?? 0.4}
                    onChange={(e) =>
                      setConfig(
                        patchEffect(config, "letter", "fisheye", {
                          look: Number(e.target.value),
                        })
                      )
                    }
                  />
                </Row>
                <Row label="chroma" value={Number(fisheye?.chroma ?? 0.85).toFixed(2)}>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.01"
                    value={fisheye?.chroma ?? 0.85}
                    onChange={(e) =>
                      setConfig(
                        patchEffect(config, "letter", "fisheye", {
                          chroma: Number(e.target.value),
                        })
                      )
                    }
                  />
                </Row>
              </>
            )}
          </Fx>
          )}
        </Section>

        <Section title="Glyph">
          <Row label="mode">
            <select data-field="glyph" value={mode} onChange={(e) => setConfig(setGlyphMode(config, e.target.value))}>
              <option value="none">none</option>
              <option value="cycle">font cycle</option>
              <option value="ascii">ascii</option>
              <option value="dotgrid">dot grid</option>
            </select>
          </Row>
          {mode === "cycle" && (
            <>
              <Fx>
                <Toggle
                  label="skulls"
                  checked={cycleFonts.some((font) => String(font).startsWith("glyph:"))}
                  onChange={(on) => {
                    const faces = cycleFonts.filter((font) => !String(font).startsWith("glyph:"));
                    setConfig(
                      patchEffect(config, "letter", "fontCycle", {
                        fonts: on ? [...faces, "glyph:f"] : faces,
                      })
                    );
                  }}
                />
                {cycleFonts.map((font, i) =>
                  String(font).startsWith("glyph:") ? (
                    <Row key={i} label={`skull ${String(font).slice(6)}`}>
                      <input
                        type="text"
                        value={String(font).slice(6)}
                        onChange={(e) => {
                          const fonts = [...cycleFonts];
                          fonts[i] = `glyph:${e.target.value}`;
                          setConfig(patchEffect(config, "letter", "fontCycle", { fonts }));
                        }}
                      />
                    </Row>
                  ) : null
                )}
              </Fx>
              <div className="stack-fonts">
                {cycleFonts.map((font, i) =>
                  String(font).startsWith("glyph:") ? null : (
                    <input
                      key={i}
                      type="text"
                      value={font}
                      onChange={(e) => {
                        const fonts = [...cycleFonts];
                        fonts[i] = e.target.value;
                        setConfig(patchEffect(config, "letter", "fontCycle", { fonts }));
                      }}
                    />
                  )
                )}
              </div>
            </>
          )}
        </Section>
          </>
        )}
      </aside>
    </div>
    </div>
    </div>
    <section className="site" aria-label="site" />
    </div>
  );
}
