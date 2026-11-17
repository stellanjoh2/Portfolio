import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
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
  const layoutRef = useRef(null);
  const markRef = useRef(null);
  const titleRef = useRef(null);
  const navRef = useRef(null);
  const sceneApiRef = useRef(null);
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
    sceneApiRef.current = scene;

    const revealItems = [markRef.current, titleRef.current, ...links];
    gsap.set(revealItems, { autoAlpha: 0, y: 28 });

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
      sceneApiRef.current = null;
      scene.dispose();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const api = sceneApiRef.current;
    if (!api) return;

    const links = [...navRef.current.querySelectorAll("a")];
    const items = [markRef.current, titleRef.current, ...links];
    const { videoMix, modelScale } = api.intro;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const repaint = () => api.repaintOverlay();

      if (reduceMotion) {
        gsap.set(videoMix, { value: 1 });
        gsap.set(modelScale, { x: 1, y: 1, z: 1 });
        gsap.set(items, { autoAlpha: 1, y: 0 });
        repaint();
        return;
      }

      // video fade → truck scale (1s power4 out) → UI stagger
      gsap
        .timeline()
        .to(videoMix, { value: 1, duration: 1.2, ease: "power2.out" })
        .to(modelScale, { x: 1, y: 1, z: 1, duration: 1, ease: "power4.out" })
        .to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          onUpdate: repaint,
          onComplete: repaint,
        });
    }, layoutRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <div className="shell">
      <div className={ready ? "hero hero--holding is-blended" : "hero hero--holding"}>
        <div className={ready ? "holding-scene is-ready" : "holding-scene"} ref={sceneRef} />
        <div className="holding-layout" ref={layoutRef}>
          <div className="site-mark" ref={markRef} aria-hidden="true" />
          <h1 className="holding-title" ref={titleRef}>
            This website is still
            <br />
            under construction
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
            <a className="site-contact" href="https://x.com/johstell" target="_blank" rel="noopener noreferrer">
              X
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
