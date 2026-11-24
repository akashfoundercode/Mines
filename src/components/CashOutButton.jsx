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
          ? 'border-2 border-[#ff8888] bg-gradient-to-b from-[#ff5252] via-[#e53935] to-[#c62828] text-white shadow-[0_4px_0_#751515,0_0_24px_rgba(229,57,53,0.5)]'
          : 'border-2 border-[#fff0a6] bg-gradient-to-b from-[#ffe58f] via-[#ffc53d] to-[#d48806] text-[#241300] shadow-[0_4px_0_#874d00,0_0_25px_rgba(255,197,61,0.5)] enabled:hover:brightness-105 enabled:hover:shadow-[0_4px_0_#874d00,0_0_35px_rgba(255,197,61,0.7)]'
      } disabled:cursor-not-allowed disabled:opacity-45 disabled:grayscale-[0.6] disabled:shadow-none select-none`}
    >
      {/* 4 Corner Screws / Rivets matching reference */}
      <span className="pointer-events-none absolute top-2 left-3 size-2 rounded-full bg-[#3d2008] shadow-[inset_0_1px_1px_#fff,0_1px_2px_rgba(0,0,0,0.8)]" />
      <span className="pointer-events-none absolute top-2 right-3 size-2 rounded-full bg-[#3d2008] shadow-[inset_0_1px_1px_#fff,0_1px_2px_rgba(0,0,0,0.8)]" />
      <span className="pointer-events-none absolute bottom-2 left-3 size-2 rounded-full bg-[#3d2008] shadow-[inset_0_1px_1px_#fff,0_1px_2px_rgba(0,0,0,0.8)]" />
      <span className="pointer-events-none absolute bottom-2 right-3 size-2 rounded-full bg-[#3d2008] shadow-[inset_0_1px_1px_#fff,0_1px_2px_rgba(0,0,0,0.8)]" />

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
