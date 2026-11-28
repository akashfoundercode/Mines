import { Trophy, Loader2 } from 'lucide-react';
import { formatMoney } from '../utils/gameLogic.js';
import { useLeaderboard } from '../hooks/useLeaderboard.js';
import topBg from '../assets/icons/top.png';

export default function LeaderboardPanel() {
  const { players, loading, error } = useLeaderboard();

  return (
    <section
      aria-label="Leader Board"
      className="mobile-land-details relative rounded-xl sm:rounded-2xl border border-[#593214] sm:border-2 bg-[#241307]/90 shadow-[inset_0_2px_8px_rgba(0,0,0,0.7)] shrink min-h-0 flex flex-col justify-between"
    >
      <div className="mobile-land-details-header relative overflow-hidden rounded-md sm:rounded-lg flex items-center justify-between">
        <img
          src={topBg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-fill select-none brightness-110"
        />
        <div className="relative z-10 flex items-center gap-1 sm:gap-1.5">
          <Trophy className="size-2.5 sm:size-3.5 md:size-4 text-[#ffc107]" aria-hidden="true" />
          <span className="font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tracking-wide">
            Leader Board
          </span>
        </div>
        <span className="relative z-10 text-[8px] sm:text-[10px] font-bold text-[#ffdb58]/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          Top Wins
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between min-h-0 gap-0.5 sm:gap-1 overflow-y-auto scrollbar-none">
        {loading && (
          <div className="flex-1 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-[#d8c2aa]">
            <Loader2 className="size-3.5 animate-spin text-[#ffc107]" />
            <span>Loading...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex-1 flex items-center justify-center text-center text-[9px] sm:text-xs text-red-300 px-1">
            {error}
          </div>
        )}

        {!loading && !error && players.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-[9px] sm:text-xs text-[#bda086]">
            No winners yet
          </div>
        )}

        {!loading &&
          !error &&
          players.slice(0, 3).map((player) => (
            <div
              key={`${player.rank}-${player.name}`}
              className="mobile-land-details-row relative overflow-hidden flex items-center justify-between px-1.5 sm:px-2.5 md:px-3 rounded sm:rounded-xl border border-[#593214]/60 shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            >
              <img
                src={topBg}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full object-fill select-none opacity-90 brightness-105"
              />

              <div className="relative z-10 flex items-center gap-1 sm:gap-1.5 min-w-0">
                <span className="text-[9px] sm:text-xs font-black shrink-0">{player.badge}</span>
                <span className="text-[9px] sm:text-xs md:text-sm font-bold text-[#e6d0ba] truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  {player.name}
                </span>
              </div>

              <span className="relative z-10 text-[10px] sm:text-xs md:text-sm font-black tabular-nums tracking-wide text-[#ffdb58] shrink-0 ml-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {formatMoney(player.win)}
              </span>
            </div>
          ))}
      </div>
    </section>
  );
}
