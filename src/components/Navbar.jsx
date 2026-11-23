import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Crown, Gift, Plus, RotateCcw, Settings, Trophy, Volume2, VolumeX, Wallet } from 'lucide-react';
import { formatMoney } from '../utils/gameLogic.js';
import bombExplosionImg from '../assets/images/BOMB.png';

const NAV_ITEMS = [
  { id: 'lobby', label: 'Lobby', icon: Crown },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'promotions', label: 'Promotions', icon: Gift },
];

const ICON_BTN =
  'grid size-10 sm:size-11 shrink-0 place-items-center rounded-2xl border border-[#1b3158] bg-[#09152a]/90 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:border-[#2b5192] hover:text-white hover:shadow-[0_0_16px_rgba(22,139,255,0.25)] active:scale-95';

function SettingsMenu({ onResetDemo }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Settings"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={ICON_BTN}
      >
        <Settings className="size-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-14 z-50 w-64 animate-fade-in rounded-2xl border border-[#1b3158] bg-[#0b1428]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <p className="text-sm font-bold text-white">Demo mode</p>
          <p className="mt-1 text-xs leading-relaxed text-[#8d9bb5]">
            Virtual credits only. Mines and payouts are generated in your browser.
          </p>
          <button
            type="button"
            onClick={() => {
              onResetDemo();
              setOpen(false);
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#1b3158] bg-[#0e1b34] py-2 text-sm font-semibold text-white transition hover:border-[#ffc53d]/70 hover:text-[#ffc53d]"
          >
            <RotateCcw className="size-4" /> Reset demo balance
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar({ balance, soundOn, onToggleSound, onAddFunds, onResetDemo }) {
  const [active, setActive] = useState('lobby');

  return (
    <header className="relative z-20 border-b border-[#142340]/50 bg-[#060c19]/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          type="button"
          aria-label="Back"
          onClick={() => window.history.length > 1 && window.history.back()}
          className={ICON_BTN}
        >
          <ArrowLeft className="size-5" />
        </button>

        {/* Brand logo: Glowing bomb + MINES text */}
        <div className="flex items-center gap-2 sm:ml-1">
          <img
            src={bombExplosionImg}
            alt="Bomb Logo"
            className="size-8 sm:size-9 object-contain drop-shadow-[0_0_12px_rgba(255,140,20,0.85)]"
          />
          <span className="bg-gradient-to-b from-[#fff3b0] via-[#ffc53d] to-[#d48806] bg-clip-text text-2xl sm:text-3xl font-black tracking-wider text-transparent drop-shadow-[0_2px_12px_rgba(255,197,61,0.55)]">
            MINES
          </span>
        </div>

        {/* Navigation tabs in center */}
        <nav aria-label="Primary" className="ml-4 hidden items-center gap-2.5 lg:flex xl:ml-8">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-current={active === id ? 'page' : undefined}
              onClick={() => setActive(id)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:border-[#ffc53d]/60 hover:text-white ${
                active === id
                  ? 'border-[#ffc53d]/50 bg-[#12203d] text-white shadow-[0_0_16px_rgba(255,197,61,0.2)]'
                  : 'border-[#172a4d] bg-[#091428]/80 text-[#a0b0cb]'
              }`}
            >
              <Icon className="size-4 text-[#ffc53d]" /> {label}
            </button>
          ))}
        </nav>

        {/* Right side: Balance with + button, Sound toggle, Settings */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-[#1b3158] bg-[#09152a]/90 py-1.5 pl-3 pr-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_12px_rgba(0,0,0,0.4)]">
            <Wallet className="size-5 text-[#ffc53d]" aria-hidden="true" />
            <span className="text-sm font-medium text-[#8d9bb5] max-md:hidden">Balance:</span>
            <span className="text-sm font-extrabold tabular-nums tracking-wide text-white sm:text-base" aria-live="polite">
              {formatMoney(balance)}
            </span>
            <button
              type="button"
              aria-label="Add ₹500 demo balance"
              onClick={onAddFunds}
              className="grid size-7 sm:size-8 place-items-center rounded-xl bg-gradient-to-b from-[#ffd666] via-[#faad14] to-[#f59e0b] text-[#241500] font-black shadow-[0_0_12px_rgba(250,173,20,0.6)] transition hover:brightness-110 active:scale-95"
            >
              <Plus className="size-4 stroke-[3]" />
            </button>
          </div>

          <button
            type="button"
            aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
            aria-pressed={soundOn}
            onClick={onToggleSound}
            className={ICON_BTN}
          >
            {soundOn ? <Volume2 className="size-5" /> : <VolumeX className="size-5 text-[#8d9bb5]" />}
          </button>
          <SettingsMenu onResetDemo={onResetDemo} />
        </div>
      </div>
    </header>
  );
}
