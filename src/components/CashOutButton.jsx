import { Play, Square } from 'lucide-react';
import { formatMoney } from '../utils/gameLogic.js';

export default function CashOutButton({
  label = 'Cash Out',
  amount,
  disabled = false,
  isStop = false,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-2xl py-3 px-4 transition-all duration-150 active:translate-y-1 ${
        isStop
          ? 'bg-gradient-to-b from-[#ff5252] via-[#e53935] to-[#c62828] text-white shadow-[0_4px_0_#8e1b1b,0_0_24px_rgba(229,57,53,0.5)]'
          : 'bg-gradient-to-b from-[#ffe082] via-[#ffc107] to-[#f57c00] text-[#1c1000] shadow-[0_4px_0_#b26a00,0_0_26px_rgba(255,193,7,0.45)] enabled:hover:brightness-105 enabled:hover:shadow-[0_4px_0_#b26a00,0_0_36px_rgba(255,193,7,0.7)]'
      } disabled:cursor-not-allowed disabled:opacity-45 disabled:grayscale-[0.6] disabled:shadow-none`}
    >
      {/* Shine overlay sweep */}
      {!disabled && !isStop && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/4 animate-shine bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />
      )}

      {/* Main label with play icon */}
      <span className="relative flex items-center justify-center gap-2 text-2xl font-black leading-tight tracking-wide">
        {isStop ? (
          <Square className="size-5 fill-current" />
        ) : (
          <Play className="size-5 fill-current" />
        )}
        {label}
      </span>

      {/* Sub amount */}
      {amount !== undefined && (
        <span className="relative block text-center text-base sm:text-lg font-black tabular-nums tracking-wide opacity-95">
          {formatMoney(amount)}
        </span>
      )}
    </button>
  );
}
