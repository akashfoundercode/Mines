import { Eye, RotateCcw } from 'lucide-react';
import ResultStat from './ResultStat.jsx';
import { formatMoney } from '../utils/gameLogic.js';
import bombBgImg from '../assets/images/bomb_bg.png';
import bombImg from '../assets/images/BOMB.png';

export default function GameOverModal({ result, onNewGame, onDismiss }) {
  return (
    <div
      className="absolute inset-0 z-30 grid animate-fade-in place-items-center rounded-[inherit] bg-ink/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameover-title"
    >
      <div className="w-full max-w-sm animate-modal-in rounded-3xl border border-danger/60 bg-gradient-to-b from-[#2a0f1c]/95 to-[#12081a]/95 p-6 text-center shadow-[0_0_60px_rgba(255,53,77,.45),inset_0_1px_0_rgba(255,255,255,.1)]">
        {/* Layered Bomb with fiery background and bomb on top */}
        <div className="relative mx-auto size-24 flex items-center justify-center">
          <img
            src={bombBgImg}
            alt=""
            className="absolute inset-0 size-full object-contain animate-pulse drop-shadow-[0_0_20px_#ff4400]"
          />
          <img
            src={bombImg}
            alt="Bomb exploded"
            className="relative z-10 size-20 object-contain drop-shadow-[0_0_20px_rgba(255,100,20,0.95)] animate-bounce"
          />
        </div>
        <h2
          id="gameover-title"
          className="mt-2 bg-gradient-to-b from-[#ff8a8a] via-danger to-ember bg-clip-text text-4xl font-black tracking-wide text-transparent"
        >
          GAME OVER
        </h2>
        <p className="mt-1 text-lg font-semibold text-danger">
          Bet Lost <span className="text-white/90">−{formatMoney(result.bet)}</span>
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <ResultStat label="Round" value={`#${result.roundId}`} />
          <ResultStat label="Mines" value={result.mines} valueClass="text-ember" />
          <ResultStat label="Gems found" value={result.gems} valueClass="text-neon" />
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
