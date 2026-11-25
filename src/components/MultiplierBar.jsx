import { formatMultiplier } from '../utils/gameLogic.js';
import topBg from '../assets/icons/top.png';

export default function MultiplierBar({ items }) {
  return (
    <div className="relative w-full">
      <div
        className="mobile-land-multiplier-box flex gap-0.5 sm:gap-1.5 md:gap-2 rounded-lg sm:rounded-2xl border border-[#593214] sm:border-2 bg-[#241307] p-0.5 sm:p-1.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.7)]"
        role="list"
        aria-label="Multiplier ladder"
      >
        {items.map((item) => {
          const { isCurrent, isReached, isNext, step, value } = item;
          return (
            <div
              key={step}
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
              className={`mobile-land-multiplier-item relative overflow-hidden flex-1 rounded-md sm:rounded-xl px-0.5 sm:px-2 py-0.5 sm:py-2 md:py-2.5 text-center text-[9px] sm:text-xs md:text-base font-black tabular-nums transition-all duration-300 border ${
                isCurrent
                  ? 'scale-105 border-2 border-[#ffe066] shadow-[0_0_14px_rgba(255,193,7,0.8)]'
                  : isReached
                    ? 'border-[#ffc107]/60'
                    : isNext
                      ? 'border-[#ffbd45]/50'
                      : 'border-[#542d12]'
              }`}
            >
              {/* top.png background behind multiplier text */}
              <img
                src={topBg}
                alt=""
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 size-full object-fill select-none ${
                  isCurrent ? 'brightness-125' : isReached ? 'brightness-105' : 'opacity-70'
                }`}
              />

              <span
                className={`relative z-10 font-black tracking-wide drop-shadow-[0_2px_3px_rgba(0,0,0,0.95)] ${
                  isCurrent
                    ? 'text-[#ffdb58]'
                    : isReached
                      ? 'text-[#ffe396]'
                      : isNext
                        ? 'text-white'
                        : 'text-[#d8c2aa]'
                }`}
              >
                {formatMultiplier(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
