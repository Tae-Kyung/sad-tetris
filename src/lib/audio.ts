"use client";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "square", volume = 0.08) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

function playNotes(notes: [number, number][], type: OscillatorType = "square", volume = 0.06) {
  try {
    const ctx = getCtx();
    let time = ctx.currentTime;
    for (const [freq, dur] of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + dur);
      time += dur;
    }
  } catch {}
}

export function sfxMove() {
  playTone(200, 0.05, "square", 0.04);
}

export function sfxRotate() {
  playTone(400, 0.08, "square", 0.05);
}

export function sfxDrop() {
  playTone(150, 0.15, "triangle", 0.1);
}

export function sfxClear() {
  playNotes(
    [
      [523, 0.08],
      [659, 0.08],
      [784, 0.08],
      [1047, 0.15],
    ],
    "square",
    0.08
  );
}

export function sfxTetris() {
  playNotes(
    [
      [523, 0.06],
      [659, 0.06],
      [784, 0.06],
      [1047, 0.06],
      [1319, 0.06],
      [1568, 0.15],
    ],
    "square",
    0.1
  );
}

export function sfxHold() {
  playNotes(
    [
      [330, 0.06],
      [440, 0.08],
    ],
    "triangle",
    0.05
  );
}

export function sfxGameOver() {
  playNotes(
    [
      [440, 0.2],
      [415, 0.2],
      [392, 0.2],
      [370, 0.2],
      [349, 0.3],
      [330, 0.5],
    ],
    "sawtooth",
    0.06
  );
}

export function sfxLevelUp() {
  playNotes(
    [
      [523, 0.08],
      [659, 0.08],
      [784, 0.08],
      [1047, 0.08],
      [784, 0.08],
      [1047, 0.15],
    ],
    "square",
    0.07
  );
}

// --- BGM ---
let bgmInterval: ReturnType<typeof setInterval> | null = null;
let bgmPlaying = false;

// Korobeiniki melody (simplified)
const BGM_MELODY: [number, number][] = [
  [659, 0.3], [494, 0.15], [523, 0.15], [587, 0.3], [523, 0.15], [494, 0.15],
  [440, 0.3], [440, 0.15], [523, 0.15], [659, 0.3], [587, 0.15], [523, 0.15],
  [494, 0.3], [494, 0.15], [523, 0.15], [587, 0.3], [659, 0.3],
  [523, 0.3], [440, 0.3], [440, 0.3], [0, 0.15],
  [587, 0.3], [698, 0.15], [880, 0.3], [784, 0.15], [698, 0.15],
  [659, 0.3], [523, 0.15], [659, 0.3], [587, 0.15], [523, 0.15],
  [494, 0.3], [494, 0.15], [523, 0.15], [587, 0.3], [659, 0.3],
  [523, 0.3], [440, 0.3], [440, 0.3], [0, 0.3],
];

function playBgmLoop() {
  if (!bgmPlaying) return;
  try {
    const ctx = getCtx();
    let time = ctx.currentTime;
    for (const [freq, dur] of BGM_MELODY) {
      if (freq === 0) {
        time += dur;
        continue;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.03, time);
      gain.gain.setValueAtTime(0.03, time + dur * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.95);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + dur);
      time += dur;
    }
    const totalDur = BGM_MELODY.reduce((s, [, d]) => s + d, 0);
    if (bgmInterval) clearTimeout(bgmInterval);
    bgmInterval = setTimeout(() => playBgmLoop(), totalDur * 1000);
  } catch {}
}

export function bgmStart() {
  if (bgmPlaying) return;
  bgmPlaying = true;
  playBgmLoop();
}

export function bgmStop() {
  bgmPlaying = false;
  if (bgmInterval) {
    clearTimeout(bgmInterval);
    bgmInterval = null;
  }
}

export function bgmPause() {
  bgmStop();
}

export function bgmResume() {
  bgmStart();
}
