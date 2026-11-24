import { Trophy, X, Medal, Flame } from 'lucide-react';
import { formatMoney } from '../utils/gameLogic.js';

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Aarav Sharma', score: 'x48.50', win: 97000, mines: 5, badge: '🥇' },
  { rank: 2, name: 'Rohan Gupta', score: 'x32.20', win: 64400, mines: 7, badge: '🥈' },
  { rank: 3, name: 'Priya Patel', score: 'x24.80', win: 49600, mines: 3, badge: '🥉' },
  { rank: 4, name: 'Vikram Singh', score: 'x18.40', win: 36800, mines: 4, badge: '4' },
  { rank: 5, name: 'Ananya Verma', score: 'x14.60', win: 29200, mines: 3, badge: '5' },
];

export default function LeaderboardModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-3 backdrop-blur-md animate-fade-in select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border-2 border-[#ffc107]/60 bg-gradient-to-b from-[#241307] via-[#1a0e05] to-[#0c0702] p-4 sm:p-6 text-white shadow-[0_0_50px_rgba(255,193,7,0.35),0_20px_50px_rgba(0,0,0,0.9)] animate-modal-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#593214]">
          <div className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-xl border border-[#ffc107] bg-[#42220b] text-[#ffc107] shadow-[0_0_12px_rgba(255,193,7,0.5)]">
              <Trophy className="size-5" />
            </div>
            <div>
              <h2 id="leaderboard-title" className="text-base sm:text-lg font-black tracking-wide text-[#ffe396]">
                Leader Board
              </h2>
              <p className="text-[10px] sm:text-xs text-[#bda086]">Top Mines High Rollers</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close leaderboard"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg border border-[#593214] bg-[#2b170a] text-[#d8c2aa] hover:border-[#ffc107] hover:text-white transition active:scale-95"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Players List */}
        <div className="mt-3 sm:mt-4 space-y-2">
          {LEADERBOARD_DATA.map((player) => (
            <div
              key={player.rank}
              className={`flex items-center justify-between rounded-xl border p-2 sm:p-2.5 transition ${
                player.rank === 1
                  ? 'border-[#ffc107] bg-gradient-to-r from-[#4a260c] to-[#2b1506] shadow-[0_0_15px_rgba(255,193,7,0.3)]'
                  : 'border-[#593214]/60 bg-[#1e1006]/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base sm:text-lg font-black w-6 text-center text-[#ffc107]">
                  {player.badge}
                </span>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    {player.name}
                    {player.rank === 1 && <Flame className="size-3.5 text-[#ff7043] inline" />}
                  </div>
                  <div className="text-[10px] text-[#bda086]">
                    {player.mines} Mines · <span className="text-[#ffe396] font-semibold">{player.score}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-black text-[#ffc107] tabular-nums">
                  {formatMoney(player.win)}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-[#00d2ff] font-semibold">Won</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-[#593214]/60 text-center text-[10px] sm:text-xs text-[#a38771]">
          Live player payouts updated in real-time
        </div>
      </div>
    </div>
  );
}
