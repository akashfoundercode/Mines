import { Eye, RotateCcw } from 'lucide-react';
import ResultStat from './ResultStat.jsx';
import { formatMoney } from '../utils/gameLogic.js';
import bombBgImg from '../assets/images/bomb_bg.png';
import bombImg from '../assets/images/BOMB.png';

function shortRoundId(id) {
  const s = String(id ?? '');
  return s.length > 8 ? `#${s.slice(-6)}` : `#${s}`;
}

export default function GameOverModal({ result, onNewGame, onDismiss }) {
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center rounded-[inherit] bg-ink/75 p-1.5 sm:p-3 md:p-4 backdrop-blur-sm overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameover-title"
    >
      <div className="modal-result-card relative w-full max-w-sm animate-modal-in rounded-3xl border border-danger/60 bg-gradient-to-b from-[#2a0f1c]/95 to-[#12081a]/95 text-center shadow-[0_0_60px_rgba(255,53,77,.45),inset_0_1px_0_rgba(255,255,255,.1)] flex flex-col items-center justify-center overflow-y-auto scrollbar-none">
        {/* Layered Bomb with fiery background and bomb on top */}
        <div className="modal-result-bomb-box relative mx-auto flex items-center justify-center shrink-0">
          <img
            src={bombBgImg}
            alt=""
            className="absolute inset-0 size-full object-contain animate-pulse drop-shadow-[0_0_20px_#ff4400]"
          />
          <img
            src={bombImg}
            alt="Bomb exploded"
            className="modal-result-bomb-img relative z-10 object-contain drop-shadow-[0_0_20px_rgba(255,100,20,0.95)] animate-bounce"
          />
        </div>

        <h2
          id="gameover-title"
          className="modal-result-title bg-gradient-to-b from-[#ff8a8a] via-danger to-ember bg-clip-text font-black tracking-wide text-transparent shrink-0"
        >
          GAME OVER
        </h2>

        <p className="modal-result-subtitle font-semibold text-danger shrink-0">
          Bet Lost <span className="text-white/90">−{formatMoney(result.bet)}</span>
        </p>

        <div className="modal-result-stats-grid grid w-full grid-cols-3 shrink-0">
          <ResultStat label="Round" value={shortRoundId(result.roundId)} />
          <ResultStat label="Mines" value={result.mines} valueClass="text-ember" />
          <ResultStat label="Gems found" value={result.gems} valueClass="text-neon" />
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
