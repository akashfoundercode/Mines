// Pure game logic. No React, no DOM — easy to test and to swap for a backend later.

export const GRID_SIZE = 25;
export const MIN_MINES = 1;
export const MAX_MINES = 24;
export const MIN_BET = 1;
export const MAX_BET = 100000;

// 0.95 reproduces the reference ladder exactly for 3 mines:
// x1.08, x1.23, x1.42, x1.64, x1.92, x2.25, x2.68
export const PAYOUT_FACTOR = 0.95;

/** Unbiased random integer in [0, max) using the Web Crypto API when available. */
export function randomInt(max) {
  const c = globalThis.crypto;
  if (c?.getRandomValues) {
    const limit = Math.floor(0x100000000 / max) * max;
    const buf = new Uint32Array(1);
    do {
      c.getRandomValues(buf);
    } while (buf[0] >= limit);
    return buf[0] % max;
  }
  return Math.floor(Math.random() * max);
}

/** Fisher–Yates shuffle, then take the first `count` positions as mines. Called once per round. */
export function generateMines(count, size = GRID_SIZE) {
  const tiles = Array.from({ length: size }, (_, i) => i);
  for (let i = size - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles.slice(0, count).sort((a, b) => a - b);
}

/** Payout multiplier after `opened` safe tiles with `mines` mines on the board. */
export function getMultiplier(opened, mines, size = GRID_SIZE) {
  const steps = Math.min(opened, size - mines);
  if (steps <= 0) return 1;
  let m = 1;
  for (let i = 0; i < steps; i++) m *= (size - i) / (size - mines - i);
  return m * PAYOUT_FACTOR;
}

/** Chance (in %) that the next pick is a mine. */
export function getMineRisk(opened, mines, size = GRID_SIZE) {
  const remaining = size - opened;
  return remaining > 0 ? (mines / remaining) * 100 : 0;
}

/** A sliding window of the multiplier ladder for the bar above the board. */
export function getMultiplierWindow(opened, mines, windowSize = 7) {
  const maxSteps = GRID_SIZE - mines;
  const count = Math.min(windowSize, maxSteps);
  const start = Math.max(1, Math.min(opened - 2, maxSteps - count + 1));
  return Array.from({ length: count }, (_, i) => {
    const step = start + i;
    return {
      step,
      value: getMultiplier(step, mines),
      isCurrent: step === opened,
      isReached: step < opened,
      isNext: step === opened + 1,
    };
  });
}

export const roundMoney = (n) => Math.round(n * 100) / 100;
export const formatMoney = (n) =>
  `₹${Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
export const formatMultiplier = (n) => `x${Number(n).toFixed(2)}`;
