import { Bot, Zap } from 'lucide-react';
import UiBadge from './UiBadge.jsx';
import topBg from '../assets/icons/top.png';
import betBg from '../assets/icons/bet.png';

const TABS = [
  { id: 'manual', label: 'Manual', icon: Zap },
  { id: 'auto', label: 'Auto', icon: Bot },
];

export default function GameMode({ mode, disabled, onChange, radius, height }) {
  return (
    <div className="mobile-land-gamemode relative w-full">
      <div
        className="grid grid-cols-2 gap-1 sm:gap-1.5 rounded-xl sm:rounded-2xl border border-[#593214] sm:border-2 bg-[#241307] p-0.5 sm:p-1 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]"
        style={radius !== undefined ? { borderRadius: `${radius}px` } : undefined}
        role="tablist"
        aria-label="Game mode"
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = mode === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={disabled}
              onClick={() => onChange(id)}
              style={height ? { height: `${height}px` } : undefined}
              className={`relative overflow-hidden flex items-center justify-center gap-1 sm:gap-1.5 rounded-md sm:rounded-lg py-1 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-base font-black transition-all duration-200 disabled:cursor-not-allowed shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${
                active
                  ? 'border-2 border-[#ffe066] shadow-[0_0_12px_rgba(255,193,7,0.65)] scale-[1.01]'
                  : 'border border-transparent hover:text-white opacity-85 hover:opacity-100'
              }`}
            >
              {/* Background: Golden bet.png when active (like bet button), topBg when inactive */}
              <img
                src={active ? betBg : topBg}
                alt=""
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 size-full object-fill select-none ${
                  active ? 'brightness-110' : 'opacity-55'
                }`}
              />
              <Icon
                className={`relative z-10 size-3 sm:size-4 md:size-4.5 ${
                  active ? 'text-[#ffea79] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]' : 'text-[#d8c2aa]'
                }`}
              />
              <span
                className={`relative z-10 font-black tracking-wide drop-shadow-[0_2px_3px_rgba(0,0,0,0.95)] ${
                  active ? 'text-white' : 'text-[#d8c2aa]'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
