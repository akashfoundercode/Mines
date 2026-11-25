import { Play, Square } from 'lucide-react';
import { formatMoney } from '../utils/gameLogic.js';
import UiBadge from './UiBadge.jsx';
import topBg from '../assets/icons/top.png';
import betBg from '../assets/icons/bet.png';

export default function CashOutButton({
  label = 'Cash Out',
  amount,
  disabled = false,
  isStop = false,
  onClick,
}) {
  return (
    <div className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`mobile-land-cashout-btn group relative w-full overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl py-1.5 sm:py-2.5 md:py-4 px-2 sm:px-4 transition-all duration-150 active:translate-y-0.5 border-2 ${
          isStop
            ? 'border-[#ff8888] shadow-[0_2px_0_#751515,0_0_15px_rgba(229,57,53,0.5)]'
            : 'border-[#ffe066] shadow-[0_2px_0_#874d00,0_0_20px_rgba(255,197,61,0.55)] enabled:hover:brightness-110'
        } disabled:cursor-not-allowed disabled:opacity-45 disabled:grayscale-[0.6] select-none`}
      >
        {/* bet.png background banner (golden like bet button) */}
        <img
          src={isStop ? topBg : betBg}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 size-full object-fill select-none ${
            isStop ? 'brightness-90 hue-rotate-[320deg]' : 'brightness-105'
          }`}
        />

        {/* 4 Corner Screws / Rivets */}
        <span className="pointer-events-none absolute top-1 left-1.5 size-1 sm:size-1.5 rounded-full bg-[#3d2008] shadow-[inset_0_1px_1px_#fff,0_1px_1px_rgba(0,0,0,0.8)] z-10" />
        <span className="pointer-events-none absolute top-1 right-1.5 size-1 sm:size-1.5 rounded-full bg-[#3d2008] shadow-[inset_0_1px_1px_#fff,0_1px_1px_rgba(0,0,0,0.8)] z-10" />
        <span className="pointer-events-none absolute bottom-1 left-1.5 size-1 sm:size-1.5 rounded-full bg-[#3d2008] shadow-[inset_0_1px_1px_#fff,0_1px_1px_rgba(0,0,0,0.8)] z-10" />
        <span className="pointer-events-none absolute bottom-1 right-1.5 size-1 sm:size-1.5 rounded-full bg-[#3d2008] shadow-[inset_0_1px_1px_#fff,0_1px_1px_rgba(0,0,0,0.8)] z-10" />

        {/* Shine overlay sweep */}
        {!disabled && !isStop && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/4 animate-shine bg-gradient-to-r from-transparent via-white/50 to-transparent z-10"
          />
        )}

        {/* Main label with play icon - on top of bet.png */}
        <span className="cashout-label relative z-10 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base md:text-lg font-black leading-tight tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
          {isStop ? (
            <Square className="size-3 sm:size-4 md:size-5 fill-current text-[#ff5252]" />
          ) : (
            <Play className="size-3 sm:size-4 md:size-5 fill-current text-[#ffdb58]" />
          )}
          {label}
        </span>

        {/* Sub amount - on top of bet.png */}
        {amount !== undefined && (
          <span className="cashout-sub relative z-10 block text-center text-[9px] sm:text-sm md:text-base font-black tabular-nums tracking-wide text-[#ffdb58] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] opacity-95 mt-0.5">
            {formatMoney(amount)}
          </span>
        )}
      </button>
    </div>
  );
}
