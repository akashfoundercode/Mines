import { Info, Minus, Plus } from 'lucide-react';
import { MAX_MINES, MIN_MINES } from '../utils/gameLogic.js';

const BTN =
  'h-10 rounded-xl border border-[#182c4e] bg-[#0d1a33] text-sm font-bold text-white transition hover:border-[#2b4e8c] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40';

export default function MinesSelector({ value, disabled, onChange }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8b9bb4]">
        <span>Mines</span>
        <Info className="size-3.5 text-[#6c7d99]" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-[1fr_1fr_36px_1.4fr_36px_1fr_1fr] items-center gap-1.5 rounded-2xl border border-[#142340] bg-[#060c18] p-1.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
        {/* Preset 3 */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(3)}
          className={`${BTN} ${value === 3 ? 'border-[#ffc53d]/50 text-[#ffc53d]' : ''}`}
        >
          3
        </button>

        {/* Preset 5 */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(5)}
          className={`${BTN} ${value === 5 ? 'border-[#ffc53d]/50 text-[#ffc53d]' : ''}`}
        >
          5
        </button>

        {/* Minus */}
        <button
          type="button"
          aria-label="Fewer mines"
          disabled={disabled || value <= MIN_MINES}
          onClick={() => onChange(value - 1)}
          className={`${BTN} grid place-items-center`}
        >
          <Minus className="size-3.5" />
        </button>

        {/* Highlighted current value: Mines [value] */}
        <div
          className="flex h-10 flex-col items-center justify-center rounded-xl border border-[#ffc53d] bg-gradient-to-b from-[#251e10] to-[#141008] leading-none shadow-[0_0_12px_rgba(255,197,61,0.35)]"
          aria-live="polite"
        >
          <span className="text-[10px] font-semibold text-[#ffc53d]/90">Mines</span>
          <span className="mt-0.5 text-base font-black text-[#ffc53d]">{value}</span>
        </div>

        {/* Plus */}
        <button
          type="button"
          aria-label="More mines"
          disabled={disabled || value >= MAX_MINES}
          onClick={() => onChange(value + 1)}
          className={`${BTN} grid place-items-center`}
        >
          <Plus className="size-3.5" />
        </button>

        {/* Preset 10 */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(10)}
          className={`${BTN} ${value === 10 ? 'border-[#ffc53d]/50 text-[#ffc53d]' : ''}`}
        >
          10
        </button>

        {/* Preset 20 */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(20)}
          className={`${BTN} ${value === 20 ? 'border-[#ffc53d]/50 text-[#ffc53d]' : ''}`}
        >
          20
        </button>
      </div>
    </div>
  );
}
