// Enhanced WebAudio sound effects with visceral explosion thud & crunch.

let ctx = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone({ freq, slideTo, type = 'sine', duration = 0.15, gain = 0.05, delay = 0 }) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function noiseBurst({ duration = 0.7, gain = 0.35, cutoff = 1200 }) {
  const c = getCtx();
  if (!c) return;
  const len = Math.floor(c.sampleRate * duration);
  const buffer = c.createBuffer(1, len, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) {
    // Non-linear decaying noise
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.8);
  }
  const src = c.createBufferSource();
  const filter = c.createBiquadFilter();
  const g = c.createGain();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(cutoff, c.currentTime);
  filter.frequency.exponentialRampToValueAtTime(120, c.currentTime + duration);
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  src.buffer = buffer;
  src.connect(filter).connect(g).connect(c.destination);
  src.start();
}

export const sounds = {
  click: () => tone({ freq: 320, slideTo: 440, type: 'triangle', duration: 0.08, gain: 0.04 }),
  reveal: () => {
    tone({ freq: 660, type: 'sine', duration: 0.18, gain: 0.05 });
    tone({ freq: 990, type: 'sine', duration: 0.22, gain: 0.04, delay: 0.07 });
  },
  explode: () => {
    // 1. Initial explosive crack & sonic punch
    noiseBurst({ duration: 0.75, gain: 0.5, cutoff: 1600 });
    // 2. Heavy sub-bass pitch drop (180Hz down to 25Hz)
    tone({ freq: 180, slideTo: 28, type: 'sawtooth', duration: 0.65, gain: 0.38 });
    tone({ freq: 90, slideTo: 24, type: 'sine', duration: 0.85, gain: 0.45, delay: 0.02 });
    // 3. Low rumbling tail
    tone({ freq: 50, slideTo: 18, type: 'triangle', duration: 1.0, gain: 0.3, delay: 0.06 });
  },
  win: () => {
    [523, 659, 784, 1046].forEach((f, i) =>
      tone({ freq: f, type: 'triangle', duration: 0.28, gain: 0.05, delay: i * 0.09 }),
    );
  },
};
