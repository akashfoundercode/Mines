import { useEffect, useState } from 'react';
import { Info, Minus, Plus } from 'lucide-react';
import UiBadge from './UiBadge.jsx';
import topBg from '../assets/icons/top.png';

const QUICK = [10, 50, 100, 500, 1000];

const STEP_BTN =
  'mobile-land-step-btn relative grid size-4.5 sm:size-6 md:size-6.5 place-items-center rounded-sm sm:rounded-md border border-[#6b3c18] bg-[#40220d] text-[#ffe396] transition hover:border-[#ffc107] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 z-10 shrink-0';

export default function BetAmount({ value, disabled, onChange, inputH, chipsH }) {
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
    <div className="w-full">
      {/* Bet Amount Label & Info */}
      <div className="mobile-land-bet-label relative mb-0.5 sm:mb-1 flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-bold text-[#e6d0ba]">
        <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Bet Amount (₹)</span>
        <Info className="size-2.5 sm:size-3.5 text-[#b09276]" aria-hidden="true" />
      </div>

      {/* Bet Amount Input Box featuring top.png behind text */}
      <div
        className="mobile-land-bet-input-box relative overflow-hidden flex items-center justify-between rounded-lg sm:rounded-xl border border-[#593214] p-0.5 sm:p-1.5 md:p-2 pl-2 sm:pl-3 shadow-[0_4px_10px_rgba(0,0,0,0.6)] focus-within:border-[#ffc107]"
        style={inputH ? { height: `${inputH}px` } : undefined}
      >
        {/* top.png background */}
        <img
          src={topBg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-fill select-none"
        />

        <div className="relative z-10 flex items-center gap-0.5 sm:gap-1 flex-1 min-w-0 ml-3 sm:ml-5">
          <span className="text-xs sm:text-base md:text-lg font-black text-[#ffc107] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] shrink-0 select-none">
            ₹
          </span>
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
            className="w-full min-w-0 bg-transparent text-left text-xs sm:text-sm md:text-base lg:text-lg font-black tabular-nums text-white outline-none disabled:opacity-60 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] pl-0.5"
          />
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 z-10 shrink-0 mr-1.5 sm:mr-3">
          {/* Minus Button */}
          <button
            type="button"
            aria-label="Decrease bet"
            disabled={disabled}
            onClick={() => onChange(value - step)}
            className={STEP_BTN}
          >
            <Minus className="size-2 sm:size-3 stroke-[2.5]" />
          </button>

          {/* Plus Button */}
          <button
            type="button"
            aria-label="Increase bet"
            disabled={disabled}
            onClick={() => onChange(value + step)}
            className={STEP_BTN}
          >
            <Plus className="size-2 sm:size-3 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Quick Chips Row featuring top.png behind text */}
      <div className="mobile-land-quick-chips relative mt-0.5 sm:mt-1.5 grid grid-cols-5 gap-0.5 sm:gap-1 md:gap-1.5">
        {QUICK.map((amount) => {
          const selected = value === amount;
          return (
            <button
              key={amount}
              type="button"
              disabled={disabled}
              onClick={() => onChange(amount)}
              style={chipsH ? { height: `${chipsH}px` } : undefined}
              className={`relative overflow-hidden rounded-md sm:rounded-lg border py-0.5 sm:py-1.5 md:py-2 text-[9px] sm:text-xs md:text-sm font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 shadow-[0_2px_6px_rgba(0,0,0,0.5)] ${
                selected
                  ? 'border-[#ffe066] shadow-[0_0_8px_rgba(255,193,7,0.5)]'
                  : 'border-[#593214]'
              }`}
            >
              {/* top.png background */}
              <img
                src={topBg}
                alt=""
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 size-full object-fill select-none ${
                  selected ? 'brightness-125' : 'opacity-80'
                }`}
              />
              <span
                className={`relative z-10 font-black drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${
                  selected ? 'text-[#ffdb58]' : 'text-white'
                }`}
              >
                ₹{amount >= 1000 ? `${amount / 1000}k` : amount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
