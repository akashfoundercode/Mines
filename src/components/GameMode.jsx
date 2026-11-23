import { Bot, Zap } from 'lucide-react';

const TABS = [
  { id: 'manual', label: 'Manual', icon: Zap },
  { id: 'auto', label: 'Auto', icon: Bot },
];

export default function GameMode({ mode, disabled, onChange }) {
  return (
    <div
      className="grid grid-cols-2 gap-1.5 rounded-2xl border border-[#142340] bg-[#060c18] p-1"
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
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm sm:text-base font-bold transition-all duration-200 disabled:cursor-not-allowed ${
              active
                ? 'border-2 border-[#ffc53d] bg-[#0c1830] text-white shadow-[0_0_16px_rgba(255,197,61,0.35)]'
                : 'border border-transparent text-[#7e8ea6] hover:text-white'
            }`}
          >
            <Icon
              className={`size-4 sm:size-[18px] ${active ? 'text-[#ffc53d] fill-[#ffc53d]' : 'text-[#7e8ea6]'}`}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}
