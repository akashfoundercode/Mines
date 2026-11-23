// Reusable SVG game graphics matching the reference design.

const GEM_FACETS = [
  ['2,34 25,8 36,34', '#93f5ff'],
  ['25,8 50,8 36,34', '#c9fcff'],
  ['50,8 64,34 36,34', '#f0feff'],
  ['50,8 75,8 64,34', '#6be5ff'],
  ['75,8 98,34 64,34', '#2db7ff'],
  ['2,34 36,34 50,90', '#30adff'],
  ['36,34 64,34 50,90', '#54d8ff'],
  ['64,34 98,34 50,90', '#0a6fd8'],
];

/** variant: 'gem' = brilliant crystal, 'ghost' = faint tile silhouette */
export function DiamondIcon({ className = '', variant = 'gem', style }) {
  if (variant === 'ghost') {
    return (
      <svg viewBox="0 0 100 92" className={className} style={style} aria-hidden="true">
        <path d="M25 8h50l23 26-48 56L2 34z" fill="currentColor" fillOpacity="0.4" />
        <path
          d="M2 34h96M25 8l11 26 14 56 14-56 11-26M36 34h28"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.8"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 92" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id="gem-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {GEM_FACETS.map(([points, fill]) => (
        <polygon
          key={points}
          points={points}
          fill={fill}
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      ))}
      {/* Specular sparkle */}
      <polygon points="42,12 48,12 44,26" fill="#fff" opacity="0.9" />
      <polygon points="26,10 32,10 30,22" fill="#fff" opacity="0.6" />
    </svg>
  );
}

export function BombIcon({ className = '', glow = false }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <div
          className="absolute inset-0 scale-125 rounded-full blur-md"
          style={{
            background: 'radial-gradient(circle, rgba(255,160,20,0.85) 0%, rgba(255,60,20,0) 70%)',
          }}
        />
      )}
      <svg viewBox="0 0 100 100" className="relative z-10 size-full" aria-hidden="true">
        {/* fuse */}
        <path
          d="M62 25c5-12 15-15 24-8"
          fill="none"
          stroke="#d2b07e"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* spark star on lit fuse */}
        <polygon
          points="86,4 89,13 98,14 90,19 93,28 86,22 78,28 81,19 74,14 83,13"
          fill="#ffe600"
          stroke="#ff8800"
          strokeWidth="1.5"
        />
        {/* fuse neck */}
        <rect x="48" y="19" width="22" height="12" rx="3" transform="rotate(22 59 25)" fill="#373d4b" />
        {/* bomb round body */}
        <circle cx="48" cy="62" r="34" fill="#151722" stroke="#2c3345" strokeWidth="2.5" />
        {/* light reflection */}
        <ellipse cx="35" cy="45" rx="10" ry="5.5" transform="rotate(-35 35 45)" fill="#ffffff" opacity="0.22" />
        {/* skull forehead */}
        <ellipse cx="48" cy="58" rx="15" ry="13" fill="#f4f5f8" />
        {/* skull jaw */}
        <rect x="40" y="66" width="16" height="10" rx="3" fill="#f4f5f8" />
        {/* eye sockets */}
        <circle cx="43" cy="57" r="4.2" fill="#151722" />
        <circle cx="53" cy="57" r="4.2" fill="#151722" />
        {/* nose hole */}
        <polygon points="48,63 45.5,67 50.5,67" fill="#151722" />
        {/* teeth slits */}
        <path d="M44 71v5M48 71v5M52 71v5" stroke="#151722" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** Fiery sunburst radiating blast behind exploded bomb */
export function ExplosionSunburst({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`pointer-events-none absolute -inset-6 size-[calc(100%+3rem)] animate-pulse ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="blast-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="25%" stopColor="#ffe600" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#ff5500" stopOpacity="0.8" />
          <stop offset="85%" stopColor="#ff0044" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* 16 burst spike rays */}
      <g transform="translate(100, 100)" fill="url(#blast-grad)">
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          const length = i % 2 === 0 ? 98 : 72;
          const width = i % 2 === 0 ? 16 : 10;
          return (
            <polygon
              key={i}
              points={`0,-${length} ${width / 2},0 0,${width / 3} -${width / 2},0`}
              transform={`rotate(${angle})`}
            />
          );
        })}
      </g>
    </svg>
  );
}
