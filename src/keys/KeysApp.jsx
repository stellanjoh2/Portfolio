import { useEffect, useMemo, useRef, useState } from "react";
import { createKeys } from "./engine.js";
import { fontSpec, loadCycleFonts, loadFromFile, loadFromSystem, loadLocal } from "./fonts.js";
import { EASES, MAIN_FACES, defaultSettings, loadSettings, mainFace, saveSettings } from "./settings.js";

function isTextField(el) {
  return el?.tagName === "TEXTAREA" || (el?.tagName === "INPUT" && el.type === "text");
}

function Section({ title, children }) {
  return (
    <div className="section">
      <h2>{title}</h2>
      {children}
    </div>
  );
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

export function KeysApp() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const fileRef = useRef(null);
  const [settings, setSettings] = useState(loadSettings);
  const [menuOpen, setMenuOpen] = useState(false);
  const [faceStatus, setFaceStatus] = useState("loading");
  const [ready, setReady] = useState(() => new Set());
  const [newFont, setNewFont] = useState("");
  const [copied, setCopied] = useState(false);

  const s = settings;
  const face = mainFace(s);
  const set = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));
  const fontKey = useMemo(() => s.fonts.map((font) => `${font.id}:${font.family}`).join("|"), [s.fonts]);

  useEffect(() => {
    const engine = createKeys(canvasRef.current, settings, {
      ignore: (e) => e.key === "F3" || isTextField(e.target),
    });
    engineRef.current = engine;
    return () => engine.destroy();
  }, []);

  useEffect(() => {
    engineRef.current?.update(settings);
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    let live = true;
    setFaceStatus("loading");
    loadLocal(face).then(async (ok) => {
      if (ok) await document.fonts.load(fontSpec(face, 96), "Aa").catch(() => {});
      if (!live) return;
      setFaceStatus(ok ? "loaded" : "missing");
      engineRef.current?.refreshFonts();
    });
    return () => {
      live = false;
    };
  }, [face.id]);

  useEffect(() => {
    let live = true;
    loadCycleFonts(s.fonts).then((ids) => {
      if (!live) return;
      setReady(ids);
      engineRef.current?.setReady(ids);
      engineRef.current?.refreshFonts();
    });
    return () => {
      live = false;
    };
  }, [fontKey]);

  useEffect(() => {
    function onKey(e) {
      if (e.key !== "F3") return;
      e.preventDefault();
      setMenuOpen((open) => !open);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function findOnSystem() {
    setFaceStatus("loading");
    const ok = await loadFromSystem(face);
    setFaceStatus(ok ? "loaded" : "missing");
    engineRef.current?.refreshFonts();
  }

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const ok = await loadFromFile(face, file);
    setFaceStatus(ok ? "loaded" : "missing");
    engineRef.current?.refreshFonts();
  }

  function patchFont(id, patch) {
    set(
      "fonts",
      s.fonts.map((font) => (font.id === id ? { ...font, ...patch } : font))
    );
  }

  function addFont() {
    const family = newFont.replace(/['"]/g, "").trim();
    if (!family) return;
    setNewFont("");
    set("fonts", [
      ...s.fonts,
      { id: `custom-${family.toLowerCase()}-${Date.now()}`, label: family, family, enabled: true, custom: true },
    ]);
  }

  function copySettings() {
    navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function range(label, key, min, max, step, fmt = (v) => v) {
    return (
      <Row label={label} value={fmt(Number(s[key]))}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={s[key]}
          onChange={(e) => set(key, Number(e.target.value))}
        />
      </Row>
    );
  }

  function select(label, key, options) {
    return (
      <Row label={label}>
        <select
          value={s[key]}
          onChange={(e) => {
            set(key, e.target.value);
            e.target.blur();
          }}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Row>
    );
  }

  function color(label, key) {
    return (
      <Row label={label}>
        <input type="color" value={s[key]} onChange={(e) => set(key, e.target.value)} />
      </Row>
    );
  }

  const cycleMs = Math.round(s.steps * s.interval);

  return (
    <div className={menuOpen ? "keys" : "keys keys--clean"}>
      <canvas ref={canvasRef} className="keys-stage" />

      {menuOpen && (
        <aside className="panel">
          <header className="panel-head">
            <h1>Keys</h1>
            <div className="panel-head-actions">
              <button className="copy" type="button" onClick={() => setMenuOpen(false)}>
                hide · F3
              </button>
              <button className="copy" type="button" onClick={copySettings}>
                {copied ? "copied" : "copy"}
              </button>
            </div>
          </header>

          <Section title="Type">
            <Row label="face">
              <select
                value={s.face}
                onChange={(e) => {
                  set("face", e.target.value);
                  e.target.blur();
                }}
              >
                {MAIN_FACES.map((f) => (
                  <option key={f.id} value={f.id}>
                    NHG {f.label}
                  </option>
                ))}
              </select>
            </Row>
            <p className={`keys-status keys-status--${faceStatus}`}>
              {faceStatus === "loaded" && `${face.local[0]} loaded`}
              {faceStatus === "loading" && "loading face…"}
              {faceStatus === "missing" && "not found via local() — activate it in Adobe Fonts, or:"}
            </p>
            {faceStatus === "missing" && (
              <div className="keys-actions">
                <button className="copy" type="button" onClick={findOnSystem}>
                  search system
                </button>
                <button className="copy" type="button" onClick={() => fileRef.current?.click()}>
                  pick file
                </button>
                <input ref={fileRef} type="file" accept=".otf,.ttf,.woff,.woff2" hidden onChange={onFile} />
              </div>
            )}
            {range("size", "fontSize", 24, 500, 1)}
            {range("tracking", "tracking", -0.15, 0.2, 0.005, (v) => v.toFixed(3))}
            {range("leading", "leading", 0.7, 1.8, 0.01, (v) => v.toFixed(2))}
            {range("wrap", "maxWidth", 0, 3000, 10, (v) => (v ? v : "off"))}
            {select("align", "align", ["left", "center", "right"])}
            {select("anchor", "valign", ["top", "center", "bottom"])}
          </Section>

          <Section title="Composition">
            {range("scale", "scale", 0.25, 6, 0.01, (v) => `${v.toFixed(2)}×`)}
            {range("x", "offsetX", -1500, 1500, 1)}
            {range("y", "offsetY", -1000, 1000, 1)}
            {range("glide", "glide", 0, 400, 5, (v) => (v ? `${v}ms` : "snap"))}
          </Section>

          <Section title="Cycle">
            {range("steps", "steps", 0, 24, 1)}
            {range("interval", "interval", 10, 160, 1, (v) => `${v}ms`)}
            <p className="keys-status">total ≈ {cycleMs}ms before the letter lands</p>
            {range("jitter", "jitter", 0, 1, 0.01, (v) => v.toFixed(2))}
            {select("order", "order", ["random", "sequence"])}
            {range("scramble", "scramble", 0, 1, 0.01, (v) => v.toFixed(2))}
            <Toggle label="match cap height" checked={s.matchHeight} onChange={(v) => set("matchHeight", v)} />
            {range("size jitter", "sizeJitter", 0, 0.8, 0.01, (v) => v.toFixed(2))}
            {range("shake", "shake", 0, 0.3, 0.005, (v) => v.toFixed(3))}
          </Section>

          <Section title="Land">
            {range("overshoot", "landScale", 0.5, 2, 0.01, (v) => `${v.toFixed(2)}×`)}
            {range("duration", "landDuration", 0, 1000, 10, (v) => `${v}ms`)}
            {select("ease", "landEase", EASES)}
          </Section>

          <Section title="Box">
            <Toggle label="boxes" checked={s.box} onChange={(v) => set("box", v)} />
            {select("style", "boxStyle", ["outline", "corners"])}
            {range("padding", "boxPad", 0, 0.3, 0.005, (v) => v.toFixed(3))}
            {range("line", "boxLine", 0.5, 8, 0.5, (v) => `${v}px`)}
            {range("fill", "fillChance", 0, 1, 0.01, (v) => v.toFixed(2))}
            {range("hold", "boxHold", 0, 800, 10, (v) => `${v}ms`)}
            <Toggle label="label" checked={s.label} onChange={(v) => set("label", v)} />
            {range("label size", "labelSize", 6, 32, 1, (v) => `${v}px`)}
          </Section>

          <Section title="Caret">
            <Toggle label="caret" checked={s.caret} onChange={(v) => set("caret", v)} />
            {select("style", "caretStyle", ["bar", "block", "underscore"])}
            {range("blink", "blink", 0, 1200, 10, (v) => (v ? `${v}ms` : "solid"))}
          </Section>

          <Section title="Sound">
            <Toggle label="key strokes" checked={s.sound} onChange={(v) => set("sound", v)} />
            {range("volume", "soundVolume", 0, 1, 0.01, (v) => v.toFixed(2))}
            {range("variance", "soundVariance", 0, 0.4, 0.01, (v) => v.toFixed(2))}
            {range("flips", "flipDb", -40, 0, 1, (v) => (v <= -40 ? "off" : `${v}dB`))}
          </Section>

          <Section title="Colours">
            {color("background", "bg")}
            {color("text", "text")}
            {color("cycle", "cycle")}
            {color("box", "boxColor")}
            {color("label", "labelColor")}
            {color("caret", "caretColor")}
          </Section>

          <Section title="Cycle fonts">
            {s.fonts.map((font) => (
              <div key={font.id} className="keys-font">
                <Toggle
                  label={
                    <span style={{ fontFamily: `"${font.family}", monospace`, fontStyle: font.style || "normal" }}>
                      {font.label}
                    </span>
                  }
                  checked={font.enabled}
                  onChange={(v) => patchFont(font.id, { enabled: v })}
                />
                {!ready.has(font.id) && <span className="keys-missing">missing</span>}
                {font.custom && (
                  <button
                    type="button"
                    className="keys-remove"
                    onClick={() => set("fonts", s.fonts.filter((f) => f.id !== font.id))}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <div className="keys-add">
              <input
                type="text"
                value={newFont}
                placeholder="installed font family"
                onChange={(e) => setNewFont(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFont()}
              />
              <button className="copy" type="button" onClick={addFont}>
                add
              </button>
            </div>
          </Section>

          <div className="keys-actions">
            <button className="copy" type="button" onClick={() => engineRef.current?.clear()}>
              clear text
            </button>
            <button className="copy" type="button" onClick={() => document.documentElement.requestFullscreen?.()}>
              fullscreen
            </button>
            <button className="copy" type="button" onClick={() => setSettings(defaultSettings())}>
              reset
            </button>
          </div>
          <p className="keys-status">
            Type anywhere outside the menu. Backspace deletes, ⌥⌫ a word, ⌘⌫ everything. On a Mac keyboard F3 may need fn.
          </p>
        </aside>
      )}
    </div>
  );
}
