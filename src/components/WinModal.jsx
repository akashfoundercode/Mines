import { Eye, RotateCcw } from 'lucide-react';
import ResultStat from './ResultStat.jsx';
import { formatMoney, formatMultiplier } from '../utils/gameLogic.js';
import diamondImg from '../assets/images/diamond.png';

const COLORS = ['#ffbd45', '#ffd36e', '#00d9ff', '#7ff0ff', '#ffffff'];

const PARTICLES = Array.from({ length: 32 }, (_, i) => {
  const angle = (i / 32) * Math.PI * 2;
  const dist = 120 + ((i * 53) % 130);
  return {
    dx: Math.round(Math.cos(angle) * dist),
    dy: Math.round(Math.sin(angle) * dist * 0.8 + 70),
    rot: `${(i % 2 ? 1 : -1) * (180 + ((i * 41) % 360))}deg`,
    delay: (i % 8) * 0.04,
    dur: 1.3 + (i % 5) * 0.2,
    w: 5 + (i % 3) * 3,
    color: COLORS[i % COLORS.length],
  };
});

function WinParticles() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-24 size-0" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute animate-confetti rounded-[2px]"
          style={{
            width: p.w,
            height: p.w * 1.6,
            background: p.color,
            boxShadow: `0 0 8px ${p.color}`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            '--rot': p.rot,
            '--delay': `${p.delay}s`,
            '--dur': `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function WinModal({ result, onNewGame, onDismiss }) {
  return (
    <div
      className="absolute inset-0 z-30 grid animate-fade-in place-items-center rounded-[inherit] bg-ink/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-title"
    >
      <div className="relative w-full max-w-sm animate-modal-in rounded-3xl border border-gold/70 bg-gradient-to-b from-[#16294a]/95 to-[#0b1426]/95 p-6 text-center shadow-[0_0_60px_rgba(255,189,69,.4),0_0_90px_rgba(0,210,255,.2),inset_0_1px_0_rgba(255,255,255,.12)]">
        <WinParticles />
        <img
          src={diamondImg}
          alt="Winner Diamond"
          className="mx-auto size-24 object-contain drop-shadow-[0_0_25px_rgba(0,210,255,0.95)] drop-shadow-[0_0_50px_rgba(0,180,255,0.6)] animate-bounce"
        />
        <h2
          id="win-title"
          className="mt-1 bg-gradient-to-b from-[#fff0b8] via-gold to-ember bg-clip-text text-5xl font-black tracking-wider text-transparent"
        >
          WIN
        </h2>
        <p className="mt-1 text-4xl font-extrabold tabular-nums text-neon drop-shadow-[0_0_14px_rgba(0,217,255,.6)]">
          {formatMoney(result.payout)}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <ResultStat label="Multiplier" value={formatMultiplier(result.multiplier)} valueClass="text-gold" />
          <ResultStat label="Profit" value={`+${formatMoney(result.profit)}`} valueClass="text-emerald-400" />
          <ResultStat label="Gems" value={result.gems} valueClass="text-neon" />
        </div>

        <button
          type="button"
          autoFocus
          onClick={onNewGame}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#ffd36e] to-[#f28c1c] py-3 text-lg font-extrabold text-[#2a1600] shadow-[0_5px_0_#b8620a,0_10px_24px_rgba(255,160,40,.3)] transition active:translate-y-1 active:shadow-[0_1px_0_#b8620a]"
        >
          <RotateCcw className="size-5" /> New Game
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-white"
        >
          <Eye className="size-4" /> View board
        </button>
      </div>
    </div>
  );
}
