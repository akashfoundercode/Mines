import { formatMultiplier } from '../utils/gameLogic.js';

const CHIP =
  'flex-1 rounded-xl px-1 py-2 text-center text-xs sm:text-sm font-extrabold tabular-nums transition-all duration-300';

function chipClass({ isCurrent, isReached, isNext }) {
  if (isCurrent) {
    return 'scale-105 border border-[#fff3b0] bg-gradient-to-b from-[#ffe082] via-[#ffc107] to-[#ffa000] text-[#1c1000] font-black shadow-[0_0_16px_rgba(255,193,7,0.75)]';
  }
  if (isReached) {
    return 'border border-[#ffc107]/40 bg-[#162137] text-[#ffc107]';
  }
  if (isNext) {
    return 'border border-[#00d2ff]/40 bg-[#0d1a33] text-white shadow-[0_0_10px_rgba(0,210,255,0.2)]';
  }
  return 'border border-[#182c4e] bg-[#0d1a33] text-white/80';
}

export default function MultiplierBar({ items }) {
  return (
    <div
      className="flex gap-1.5 sm:gap-2 rounded-2xl border border-[#142340] bg-[#060c18] p-1.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]"
      role="list"
      aria-label="Multiplier ladder"
    >
      {items.map((item) => (
        <div
          key={item.step}
          role="listitem"
          aria-current={item.isCurrent ? 'step' : undefined}
          className={`${CHIP} ${chipClass(item)}`}
        >
          {formatMultiplier(item.value)}
        </div>
      ))}
    </div>
  );
}
