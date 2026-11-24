import { Info, Minus, Plus } from 'lucide-react';
import { MAX_MINES, MIN_MINES } from '../utils/gameLogic.js';
import topBg from '../assets/icons/top.png';

export default function MinesSelector({ value, disabled, onChange }) {
  return (
    <div className="w-full">
      {/* Mines Count Label & Info */}
      <div className="relative mb-0.5 sm:mb-1 flex items-center gap-1 text-[11px] sm:text-xs md:text-sm font-bold text-[#e6d0ba]">
        <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Mines</span>
        <Info className="size-3 sm:size-3.5 text-[#b09276]" aria-hidden="true" />
      </div>

      {/* Mines Selector Bar with buttons featuring top.png */}
      <div className="relative grid grid-cols-[1fr_1fr_26px_1.3fr_26px_1fr_1fr] sm:grid-cols-[1fr_1fr_32px_1.4fr_32px_1fr_1fr] items-center gap-0.5 sm:gap-1 rounded-lg sm:rounded-xl border border-[#593214] bg-[#241307] p-1 sm:p-1.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)]">
        {/* Preset 3 */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(3)}
          className={`relative overflow-hidden h-7 sm:h-8 md:h-9 rounded-md sm:rounded-lg border text-xs sm:text-sm md:text-base font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
            value === 3 ? 'border-[#ffe066] shadow-[0_0_8px_rgba(255,193,7,0.5)]' : 'border-[#593214]'
          }`}
        >
          <img src={topBg} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full object-fill select-none" />
          <span className={`relative z-10 font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${value === 3 ? 'text-[#ffdb58]' : 'text-white'}`}>3</span>
        </button>

        {/* Preset 5 */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(5)}
          className={`relative overflow-hidden h-7 sm:h-8 md:h-9 rounded-md sm:rounded-lg border text-xs sm:text-sm md:text-base font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
            value === 5 ? 'border-[#ffe066] shadow-[0_0_8px_rgba(255,193,7,0.5)]' : 'border-[#593214]'
          }`}
        >
          <img src={topBg} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full object-fill select-none" />
          <span className={`relative z-10 font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${value === 5 ? 'text-[#ffdb58]' : 'text-white'}`}>5</span>
        </button>

        {/* Minus */}
        <button
          type="button"
          aria-label="Fewer mines"
          disabled={disabled || value <= MIN_MINES}
          onClick={() => onChange(value - 1)}
          className="relative overflow-hidden h-7 sm:h-8 md:h-9 rounded-md sm:rounded-lg border border-[#593214] grid place-items-center transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <img src={topBg} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full object-fill select-none" />
          <Minus className="relative z-10 size-3 sm:size-3.5 stroke-[3] text-[#ffe396]" />
        </button>

        {/* Highlighted current value badge featuring top.png */}
        <div
          className="relative overflow-hidden flex h-7 sm:h-8 md:h-9 flex-col items-center justify-center rounded-md sm:rounded-lg border-2 border-[#ffe066] leading-none shadow-[0_0_10px_rgba(255,193,7,0.5)]"
          aria-live="polite"
        >
          <img src={topBg} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full object-fill select-none brightness-125" />
          <span className="relative z-10 text-xs sm:text-sm md:text-base font-black text-[#ffdb58] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{value}</span>
        </div>

        {/* Plus */}
        <button
          type="button"
          aria-label="More mines"
          disabled={disabled || value >= MAX_MINES}
          onClick={() => onChange(value + 1)}
          className="relative overflow-hidden h-7 sm:h-8 md:h-9 rounded-md sm:rounded-lg border border-[#593214] grid place-items-center transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <img src={topBg} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full object-fill select-none" />
          <Plus className="relative z-10 size-3 sm:size-3.5 stroke-[3] text-[#ffe396]" />
        </button>

        {/* Preset 10 */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(10)}
          className={`relative overflow-hidden h-7 sm:h-8 md:h-9 rounded-md sm:rounded-lg border text-xs sm:text-sm md:text-base font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
            value === 10 ? 'border-[#ffe066] shadow-[0_0_8px_rgba(255,193,7,0.5)]' : 'border-[#593214]'
          }`}
        >
          <img src={topBg} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full object-fill select-none" />
          <span className={`relative z-10 font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${value === 10 ? 'text-[#ffdb58]' : 'text-white'}`}>10</span>
        </button>

        {/* Preset 20 */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(20)}
          className={`relative overflow-hidden h-7 sm:h-8 md:h-9 rounded-md sm:rounded-lg border text-xs sm:text-sm md:text-base font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
            value === 20 ? 'border-[#ffe066] shadow-[0_0_8px_rgba(255,193,7,0.5)]' : 'border-[#593214]'
          }`}
        >
          <img src={topBg} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full object-fill select-none" />
          <span className={`relative z-10 font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${value === 20 ? 'text-[#ffdb58]' : 'text-white'}`}>20</span>
        </button>
      </div>
    </div>
  );
}
