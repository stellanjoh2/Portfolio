import { useEffect, useRef, useState } from "react";
import { createTravel } from "./engine.js";
import { EASES, defaultSettings, loadSettings, saveSettings } from "./settings.js";

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

export function TravelApp() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [settings, setSettings] = useState(loadSettings);
  const [menuOpen, setMenuOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const s = settings;
  const set = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const engine = createTravel(canvasRef.current, settings);
    engineRef.current = engine;
    return () => engine.destroy();
  }, []);

  useEffect(() => {
    engineRef.current?.update(settings);
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    function onKey(e) {
      if (e.target?.tagName === "INPUT" && e.target.type === "text") return;
      if (e.key === "F3") {
        e.preventDefault();
        setMenuOpen((open) => !open);
      } else if (e.code === "Space") {
        e.preventDefault();
        engineRef.current?.replay();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

  function color(label, key) {
    return (
      <Row label={label}>
        <input type="color" value={s[key]} onChange={(e) => set(key, e.target.value)} />
      </Row>
    );
  }

  return (
    <div className={menuOpen ? "travel" : "travel travel--clean"}>
      <canvas ref={canvasRef} className="travel-stage" />

      {menuOpen && (
        <aside className="panel">
          <header className="panel-head">
            <h1>Travel</h1>
            <div className="panel-head-actions">
              <button className="copy" type="button" onClick={() => setMenuOpen(false)}>
                hide · F3
              </button>
              <button className="copy" type="button" onClick={copySettings}>
                {copied ? "copied" : "copy"}
              </button>
            </div>
          </header>

          <div className="travel-actions">
            <button className="copy" type="button" onClick={() => engineRef.current?.replay()}>
              replay · space
            </button>
            <button className="copy" type="button" onClick={() => engineRef.current?.faceOrigin()}>
              face origin
            </button>
          </div>

          <Section title="Origin">
            {range("latitude", "lat", -85, 85, 0.01, (v) => `${v.toFixed(2)}°`)}
            {range("longitude", "lon", -180, 180, 0.01, (v) => `${v.toFixed(2)}°`)}
          </Section>

          <Section title="Routes">
            {range("lines", "count", 1, 48, 1)}
            {range("seed", "seed", 1, 200, 1)}
            {range("min dist", "minDist", 1, 180, 1, (v) => `${v}°`)}
            {range("max dist", "maxDist", 1, 180, 1, (v) => `${v}°`)}
            {range("bearing", "bearingJitter", 0, 1, 0.01, (v) => v.toFixed(2))}
            {range("altitude", "altitude", 0, 0.3, 0.001, (v) => v.toFixed(3))}
            {range("arc", "arc", 0, 0.5, 0.005, (v) => v.toFixed(3))}
          </Section>

          <Section title="Timing">
            {range("duration", "duration", 0.2, 10, 0.05, (v) => `${v.toFixed(2)}s`)}
            <Row label="ease">
              <select
                value={s.ease}
                onChange={(e) => {
                  set("ease", e.target.value);
                  e.target.blur();
                }}
              >
                {EASES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Row>
            {range("stagger", "stagger", 0, 4, 0.05, (v) => `${v.toFixed(2)}s`)}
            {range("speed var", "speedVariance", 0, 0.6, 0.01, (v) => v.toFixed(2))}
            {range("hold", "hold", 0, 5, 0.1, (v) => `${v.toFixed(1)}s`)}
            {range("scene rot", "spin", -20, 20, 0.5, (v) => `${v}°`)}
            <Toggle label="loop" checked={s.loop} onChange={(v) => set("loop", v)} />
          </Section>

          <Section title="Look">
            {range("line width", "lineWidth", 0.5, 12, 0.25, (v) => `${v}px`)}
            {range("dot size", "dotSize", 0, 30, 0.5, (v) => (v ? `${v}px` : "off"))}
            <Toggle label="dot at origin" checked={s.originDot} onChange={(v) => set("originDot", v)} />
            <Toggle label="keep dots on arrival" checked={s.keepDots} onChange={(v) => set("keepDots", v)} />
            <Toggle label="guide grid" checked={s.grid} onChange={(v) => set("grid", v)} />
          </Section>

          <Section title="Colours">
            {color("lines", "lineColor")}
            {color("dots", "dotColor")}
            {color("sphere", "sphereColor")}
            {color("grid", "gridColor")}
            {color("background", "bg")}
          </Section>

          <div className="travel-actions">
            <button className="copy" type="button" onClick={() => document.documentElement.requestFullscreen?.()}>
              fullscreen
            </button>
            <button className="copy" type="button" onClick={() => setSettings(defaultSettings())}>
              reset
            </button>
          </div>
          <p className="travel-note">
            Drag to rotate the planet, scroll to zoom. F3 hides this panel for recording (on a Mac keyboard it may need
            fn). Space replays.
          </p>
        </aside>
      )}
    </div>
  );
}
