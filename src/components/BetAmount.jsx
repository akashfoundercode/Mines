import { useEffect, useState } from 'react';
import { Info, Minus, Plus } from 'lucide-react';

const QUICK = [10, 50, 100, 500];

const STEP_BTN =
  'grid size-8 place-items-center rounded-lg border border-[#1c335a] bg-[#0d1a33] text-white transition hover:border-[#2f5596] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40';

const CHIP =
  'rounded-xl border border-[#182c4e] bg-[#0d1a33] py-2 text-sm font-bold text-white transition hover:border-[#faad14]/60 hover:text-[#faad14] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40';

export default function BetAmount({ value, disabled, onChange }) {
  const [draft, setDraft] = useState(value.toFixed(2));

  useEffect(() => {
    setDraft(value.toFixed(2));
  }, [value]);

  const commit = () => {
    const parsed = parseFloat(draft);
    if (Number.isFinite(parsed)) setDraft(onChange(parsed).toFixed(2));
    else setDraft(value.toFixed(2));
  };

  const step = value >= 100 ? 50 : value >= 50 ? 10 : 5;

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8b9bb4]">
        <span>Bet Amount</span>
        <Info className="size-3.5 text-[#6c7d99]" aria-hidden="true" />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-[#182c4e] bg-[#060c18] p-2 pl-3.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] focus-within:border-[#ffc53d]/70">
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-bold text-[#ffc53d]">₹</span>
          <input
            id="bet-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            disabled={disabled}
            value={draft}
            onChange={(e) => /^\d*\.?\d{0,2}$/.test(e.target.value) && setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="w-28 bg-transparent text-xl font-bold tabular-nums text-white outline-none disabled:opacity-60"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Decrease bet"
            disabled={disabled}
            onClick={() => onChange(value - step)}
            className={STEP_BTN}
          >
            <Minus className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Increase bet"
            disabled={disabled}
            onClick={() => onChange(value + step)}
            className={STEP_BTN}
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-4 gap-2">
        {QUICK.map((amount) => (
          <button
            key={amount}
            type="button"
            disabled={disabled}
            onClick={() => onChange(amount)}
            className={`${CHIP} ${value === amount ? 'border-[#ffc53d]/70 text-[#ffc53d]' : ''}`}
          >
            ₹{amount}
          </button>
        ))}
      </div>
    </div>
  );
}
