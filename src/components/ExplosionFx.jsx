// Layered CSS explosion: nuclear flash, dual shockwaves, 30 flying fire sparks, billowing smoke clouds, and cracked glass.

const SPARKS = Array.from({ length: 30 }, (_, i) => {
  const angle = (i / 30) * Math.PI * 2 + (i % 3) * 0.12;
  const dist = 75 + ((i * 47) % 85);
  return {
    dx: Math.round(Math.cos(angle) * dist),
    dy: Math.round(Math.sin(angle) * dist),
    size: 3 + (i % 4) * 2.5,
    delay: (i % 6) * 0.02,
    dur: 0.65 + (i % 4) * 0.15,
    color:
      i % 4 === 0
        ? '#ffffff'
        : i % 4 === 1
        ? '#ffe600'
        : i % 4 === 2
        ? '#ff6600'
        : '#ff1133',
  };
});

const SMOKE_PUFFS = [
  { dx: -35, delay: 0.05, size: 60, dur: 1.6, bg: 'rgba(50, 55, 70, 0.65)' },
  { dx: 25, delay: 0.12, size: 75, dur: 1.9, bg: 'rgba(40, 42, 55, 0.7)' },
  { dx: -15, delay: 0.22, size: 85, dur: 2.1, bg: 'rgba(75, 45, 35, 0.55)' },
  { dx: 38, delay: 0.18, size: 68, dur: 1.8, bg: 'rgba(35, 38, 50, 0.65)' },
  { dx: 0, delay: 0.08, size: 90, dur: 2.3, bg: 'rgba(30, 32, 45, 0.75)' },
];

export default function ExplosionFx() {
  return (
    <div className="pointer-events-none absolute inset-0 z-15 overflow-visible" aria-hidden="true">
      {/* 1. Nuclear flash that blankets the area */}
      <span className="absolute left-1/2 top-1/2 size-full animate-nuke-flash rounded-full" />

      {/* 2. Primary fiery shockwave ring */}
      <span className="absolute left-1/2 top-1/2 size-3/4 animate-shockwave-1 rounded-full border-4 border-[#ff8800] shadow-[0_0_20px_#ff4400]" />

      {/* 3. Secondary shockwave ring */}
      <span className="absolute left-1/2 top-1/2 size-2/3 animate-shockwave-2 rounded-full border-2 border-[#ffe600] shadow-[0_0_25px_#ff6600]" />

      {/* 4. Volumetric billowing dark & fiery smoke clouds */}
      {SMOKE_PUFFS.map((s, idx) => (
        <span
          key={idx}
          className="absolute left-1/2 top-1/2 animate-smoke-puff rounded-full blur-[6px]"
          style={{
            width: s.size,
            height: s.size,
            background: s.bg,
            '--dx': `${s.dx}px`,
            '--delay': `${s.delay}s`,
            '--dur': `${s.dur}s`,
          }}
        />
      ))}

      {/* 5. 30 High-velocity fire sparks & burning debris */}
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 animate-spark rounded-full"
          style={{
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: `0 0 12px ${s.color}`,
            '--dx': `${s.dx}px`,
            '--dy': `${s.dy}px`,
            '--delay': `${s.delay}s`,
            '--dur': `${s.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Cracked-glass overlay for the exploded tile. */
export function Cracks() {
  return (
    <svg
      viewBox="0 0 100 88"
      className="pointer-events-none absolute inset-0 z-[5] size-full animate-crack"
      aria-hidden="true"
    >
      <g fill="none" stroke="#ffa38a" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
        <path d="M50 44 38 24 40 10M38 24 24 20 14 8" />
        <path d="M50 44 70 36 82 40 94 30M70 36 76 22" />
        <path d="M50 44 62 62 58 78 66 86M62 62 78 68" />
        <path d="M50 44 30 56 22 74 10 80M30 56 14 52" />
      </g>
    </svg>
  );
}
