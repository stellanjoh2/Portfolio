import { useEffect, useRef, useState } from "react";
import { mountHoldingScene } from "./scene.js";

// TODO: replace with the external showreel link.
const SHOWREEL_URL = "#";
const MODEL_URL = `${import.meta.env.BASE_URL}excavator.glb`;

export function HoldingPage() {
  const sceneRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(
    () => mountHoldingScene(sceneRef.current, { modelUrl: MODEL_URL, onReady: () => setReady(true) }),
    []
  );

  return (
    <div className="shell">
      <div className="hero">
        <div className={ready ? "holding-scene is-ready" : "holding-scene"} ref={sceneRef} />
        <h1 className="holding-title">Under Construction</h1>
        <div className="site-mark" aria-hidden="true" />
        <nav className="site-nav">
          <a className="site-contact" href={SHOWREEL_URL} target="_blank" rel="noopener noreferrer">
            Showreel
          </a>
          <a className="site-contact" href="mailto:hello@stellanjohansson.com">
            Contact me
          </a>
        </nav>
      </div>
    </div>
  );
}
