import { useEffect, useRef, useState } from "react";
import logoUrl from "../assets/s-logo.svg?url";
import { mountHoldingScene } from "./scene.js";
import { markImagesReady, paintUiMask } from "./uiMask.js";

const SHOWREEL_URL = "https://www.youtube.com/watch?v=SXf1NswrDpw";
// Split so the address never appears verbatim in the bundle for scrapers.
const EMAIL_HREF = ["mailto:hello", "stellanjohansson.com"].join("@");
const MODEL_URL = `${import.meta.env.BASE_URL}excavator.glb`;
const VIDEO_URL = `${import.meta.env.BASE_URL}holding-bg.mp4`;
const INK = "#ffffff";
const HOVER = "#c4ff00";

export function HoldingPage() {
  const sceneRef = useRef(null);
  const markRef = useRef(null);
  const titleRef = useRef(null);
  const navRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    const links = [...nav.querySelectorAll("a")];
    let hovered = null;

    const paintOverlay = (canvas, dpr) =>
      paintUiMask(canvas, sceneRef.current, {
        dpr,
        texts: [
          { el: titleRef.current, color: INK },
          ...links.map((el) => ({ el, color: el === hovered ? HOVER : INK })),
        ],
        marks: [{ el: markRef.current, color: hovered === markRef.current ? HOVER : INK, url: logoUrl }],
      });

    const scene = mountHoldingScene(sceneRef.current, {
      modelUrl: MODEL_URL,
      videoUrl: VIDEO_URL,
      paintOverlay,
      onReady: () => setReady(true),
    });

    const repaint = () => scene.repaintOverlay();
    Promise.all([document.fonts.ready, markImagesReady([logoUrl])]).then(repaint);
    document.fonts.addEventListener("loadingdone", repaint);

    const hoverables = [...links, markRef.current];
    const onEnter = (e) => {
      hovered = e.currentTarget;
      repaint();
    };
    const onLeave = () => {
      hovered = null;
      repaint();
    };
    for (const el of hoverables) {
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
    }

    return () => {
      document.fonts.removeEventListener("loadingdone", repaint);
      for (const el of hoverables) {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
      }
      scene.dispose();
    };
  }, []);

  return (
    <div className="shell">
      <div className={ready ? "hero hero--holding is-blended" : "hero hero--holding"}>
        <div className={ready ? "holding-scene is-ready" : "holding-scene"} ref={sceneRef} />
        <div className="holding-layout">
          <div className="site-mark" ref={markRef} aria-hidden="true" />
          <h1 className="holding-title" ref={titleRef}>
            This website is still under construction
          </h1>
          <nav className="site-nav" ref={navRef}>
            <a className="site-contact" href={SHOWREEL_URL} target="_blank" rel="noopener noreferrer">
              Showreel
            </a>
            <a
              className="site-contact"
              href="https://www.linkedin.com/in/stellanj/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a className="site-contact" href={EMAIL_HREF}>
              Email me
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
