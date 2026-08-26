import hoverUrl from "../sounds/uisound-hover.wav?url";

const COALESCE_MS = 16;
const GAIN = 0.9189 * 10 ** (5 / 20);

let ctx = null;
let buf = null;
let loading = null;
let nextAt = 0;

function audioContext() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx || ctx.state === "closed") ctx = new AC();
  if (ctx.state !== "running") void ctx.resume().catch(() => {});
  return ctx;
}

async function decoded() {
  if (buf) return buf;
  if (loading) return loading;
  loading = (async () => {
    const audio = audioContext();
    if (!audio) return null;
    const res = await fetch(hoverUrl);
    if (!res.ok) return null;
    buf = await audio.decodeAudioData(await res.arrayBuffer());
    return buf;
  })().finally(() => {
    loading = null;
  });
  return loading;
}

function playHoverSound() {
  const now = performance.now();
  if (now < nextAt) return;
  nextAt = now + COALESCE_MS;
  const audio = audioContext();
  if (!audio) return;
  void decoded().then((decodedBuf) => {
    if (!decodedBuf || audio.state !== "running") return;
    const src = audio.createBufferSource();
    src.buffer = decodedBuf;
    const gain = audio.createGain();
    gain.gain.value = GAIN;
    src.connect(gain);
    gain.connect(audio.destination);
    src.start(0);
  });
}

export function sound(opts, api) {
  function unlock() {
    audioContext();
  }

  function onCycle() {
    if (!api.getHover().charEl) return;
    playHoverSound();
  }

  api.root.addEventListener("pointerdown", unlock);
  api.root.addEventListener("tfxcycle", onCycle);

  return {
    enter() {
      playHoverSound();
    },
    destroy() {
      api.root.removeEventListener("pointerdown", unlock);
      api.root.removeEventListener("tfxcycle", onCycle);
    },
  };
}
