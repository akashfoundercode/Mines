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
    <div className="pointer-events-none absolute left-1/2 top-14 sm:top-24 size-0" aria-hidden="true">
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
      className="absolute inset-0 z-30 flex items-center justify-center rounded-[inherit] bg-ink/75 p-1 sm:p-2 md:p-4 backdrop-blur-sm overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-title"
    >
      <div className="modal-result-card relative w-full max-w-sm animate-modal-in rounded-3xl border border-gold/70 bg-gradient-to-b from-[#16294a]/95 to-[#0b1426]/95 text-center shadow-[0_0_60px_rgba(255,189,69,.4),0_0_90px_rgba(0,210,255,.2),inset_0_1px_0_rgba(255,255,255,.12)] flex flex-col items-center justify-between overflow-y-auto scrollbar-none">
        <WinParticles />

        <img
          src={diamondImg}
          alt="Winner Diamond"
          className="modal-result-bomb-img mx-auto object-contain drop-shadow-[0_0_25px_rgba(0,210,255,0.95)] drop-shadow-[0_0_50px_rgba(0,180,255,0.6)] animate-bounce shrink-0"
        />

        <h2
          id="win-title"
          className="modal-result-title bg-gradient-to-b from-[#fff0b8] via-gold to-ember bg-clip-text font-black tracking-wider text-transparent shrink-0"
        >
          WIN
        </h2>

        <p className="modal-result-payout font-extrabold tabular-nums text-neon drop-shadow-[0_0_14px_rgba(0,217,255,.6)] shrink-0">
          {formatMoney(result.payout)}
        </p>

        <div className="modal-result-stats-grid grid w-full grid-cols-3 shrink-0">
          <ResultStat label="Multiplier" value={formatMultiplier(result.multiplier)} valueClass="text-gold" />
          <ResultStat label="Profit" value={`+${formatMoney(result.profit)}`} valueClass="text-emerald-400" />
          <ResultStat label="Gems" value={result.gems} valueClass="text-neon" />
        </div>

        <button
          type="button"
          autoFocus
          onClick={onNewGame}
          className="modal-result-action-btn flex w-full items-center justify-center font-extrabold text-[#2a1600] rounded-2xl bg-gradient-to-b from-[#ffd36e] to-[#f28c1c] shadow-[0_4px_0_#b8620a,0_8px_20px_rgba(255,160,40,.3)] transition active:translate-y-0.5 active:shadow-[0_1px_0_#b8620a] shrink-0"
        >
          <RotateCcw className="size-4 sm:size-5" /> New Game
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="modal-result-dismiss-btn inline-flex items-center font-medium text-muted transition hover:text-white shrink-0"
        >
          <Eye className="size-3.5 sm:size-4" /> View board
        </button>
      </div>
    </div>
  );
}
