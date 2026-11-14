import key01 from "./sounds/key-01.wav?url";
import key02 from "./sounds/key-02.wav?url";
import key03 from "./sounds/key-03.wav?url";
import key04 from "./sounds/key-04.wav?url";

const KIT = [key01, key02, key03, key04];

let ctx = null;
let buffers = null;
let loading = null;
let last = -1;

function audio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state !== "running") void ctx.resume().catch(() => {});
  return ctx;
}

function load(ac) {
  if (buffers || loading) return loading;
  loading = Promise.all(
    KIT.map((url) =>
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((data) => ac.decodeAudioData(data))
        .catch(() => null)
    )
  ).then((list) => {
    buffers = list.filter(Boolean);
  });
  return loading;
}

/** Plays a random clip from the type kit, never the same one twice in a row; `variance` detunes each stroke. */
export function playKey({ volume = 1, variance = 0, delay = 0 } = {}) {
  const ac = audio();
  if (!ac || volume <= 0) return;
  if (!buffers) {
    void load(ac);
    return;
  }
  if (!buffers.length) return;
  let index = Math.floor(Math.random() * buffers.length);
  if (index === last && buffers.length > 1) index = (index + 1) % buffers.length;
  last = index;

  const src = ac.createBufferSource();
  src.buffer = buffers[index];
  src.playbackRate.value = 1 + (Math.random() * 2 - 1) * variance;
  const gain = ac.createGain();
  gain.gain.value = volume * (1 - Math.random() * variance);
  src.connect(gain).connect(ac.destination);
  src.start(ac.currentTime + Math.max(0, delay) / 1000);
}

export function primeKeys() {
  const ac = audio();
  if (ac) void load(ac);
}
