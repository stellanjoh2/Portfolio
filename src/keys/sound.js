import press01 from "./sounds/press-01.wav?url";
import press02 from "./sounds/press-02.wav?url";
import press03 from "./sounds/press-03.wav?url";
import press04 from "./sounds/press-04.wav?url";
import flip01 from "./sounds/flip-01.wav?url";
import flip02 from "./sounds/flip-02.wav?url";
import flip03 from "./sounds/flip-03.wav?url";
import flip04 from "./sounds/flip-04.wav?url";

const PRESS = [press01, press02, press03, press04];
const FLIP = [flip01, flip02, flip03, flip04];

/** Seconds a flip must trail the press, and each other, before it is allowed to sound. */
const PRESS_GUARD = 0.03;
const FLIP_GAP = 0.018;
const CHOKE = 0.004;

let ctx = null;
let kits = null;
let loading = null;
const lastPick = new Map();
let voices = [];

function audio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state !== "running") void ctx.resume().catch(() => {});
  return ctx;
}

function decodeAll(ac, urls) {
  return Promise.all(
    urls.map((url) =>
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((data) => ac.decodeAudioData(data))
        .catch(() => null)
    )
  ).then((list) => list.filter(Boolean));
}

function load(ac) {
  if (kits || loading) return loading;
  loading = Promise.all([decodeAll(ac, PRESS), decodeAll(ac, FLIP)]).then(([press, flip]) => {
    kits = { press, flip };
  });
  return loading;
}

function pick(kit) {
  const list = kits[kit];
  let index = Math.floor(Math.random() * list.length);
  if (index === lastPick.get(kit) && list.length > 1) index = (index + 1) % list.length;
  lastPick.set(kit, index);
  return list[index];
}

function voice(ac, kit, at, volume, variance) {
  const src = ac.createBufferSource();
  src.buffer = pick(kit);
  src.playbackRate.value = 1 + (Math.random() * 2 - 1) * variance;
  const gain = ac.createGain();
  const level = volume * (1 - Math.random() * variance);
  gain.gain.setValueAtTime(level, at);
  src.connect(gain).connect(ac.destination);
  src.start(at);
  return { src, gain, at, level, end: at + src.buffer.duration / src.playbackRate.value };
}

function choke(v, at) {
  v.end = at + CHOKE;
  const g = v.gain.gain;
  g.cancelScheduledValues(at);
  g.setValueAtTime(v.level, at);
  g.linearRampToValueAtTime(0, at + CHOKE);
  v.src.stop(at + CHOKE);
}

/**
 * One voice at a time: a press drops flips still queued from earlier letters and
 * fades out whatever is ringing, then the new letter's flips follow it in sequence.
 */
export function playStroke({ volume = 1, variance = 0, flipDb = -10, flips = [] } = {}) {
  const ac = audio();
  if (!ac || volume <= 0) return;
  if (!kits) {
    void load(ac);
    return;
  }
  if (!kits.press.length) return;

  const now = ac.currentTime;
  for (const v of voices) {
    if (v.at > now) v.src.stop();
    else if (v.end > now) choke(v, now);
  }

  const press = voice(ac, "press", now + CHOKE, volume, variance);
  voices = [press];
  if (!kits.flip.length || flipDb <= -40) return;

  const flipVolume = volume * 10 ** (flipDb / 20);
  let prev = press;
  for (const delay of flips) {
    const at = now + CHOKE + delay / 1000;
    if (at - prev.at < (prev === press ? PRESS_GUARD : FLIP_GAP)) continue;
    choke(prev, at - CHOKE);
    prev = voice(ac, "flip", at, flipVolume, variance);
    voices.push(prev);
  }
}

export function primeKeys() {
  const ac = audio();
  if (ac) void load(ac);
}
