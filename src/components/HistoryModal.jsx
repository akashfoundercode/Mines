import { History, X, Loader2, RefreshCw, Bomb, Gem } from 'lucide-react';
import { formatMoney } from '../utils/gameLogic.js';
import { useGameHistory } from '../hooks/useGameHistory.js';

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryModal({ onClose }) {
  const { items, loading, error, refresh } = useGameHistory({ limit: 20 });

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-3 backdrop-blur-md animate-fade-in select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl border-2 border-[#ffc107]/60 bg-gradient-to-b from-[#241307] via-[#1a0e05] to-[#0c0702] p-4 sm:p-6 text-white shadow-[0_0_50px_rgba(255,193,7,0.35),0_20px_50px_rgba(0,0,0,0.9)] animate-modal-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#593214]">
          <div className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-xl border border-[#ffc107] bg-[#42220b] text-[#ffc107] shadow-[0_0_12px_rgba(255,193,7,0.5)]">
              <History className="size-5" />
            </div>
            <div>
              <h2 id="history-title" className="text-base sm:text-lg font-black tracking-wide text-[#ffe396]">
                Game History
              </h2>
              <p className="text-[10px] sm:text-xs text-[#bda086]">Your Recent Mines Rounds</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Refresh history"
              onClick={refresh}
              disabled={loading}
              className="grid size-8 place-items-center rounded-lg border border-[#593214] bg-[#2b170a] text-[#d8c2aa] hover:border-[#ffc107] hover:text-white transition active:scale-95 disabled:opacity-40"
            >
              <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              aria-label="Close history"
              onClick={onClose}
              className="grid size-8 place-items-center rounded-lg border border-[#593214] bg-[#2b170a] text-[#d8c2aa] hover:border-[#ffc107] hover:text-white transition active:scale-95"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="mt-3 sm:mt-4 space-y-2 min-h-[180px] max-h-[60dvh] overflow-y-auto scrollbar-none">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-[#d8c2aa]">
              <Loader2 className="size-6 animate-spin text-[#ffc107]" />
              <span className="text-xs">Loading round history...</span>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-center text-xs text-red-200">
              {error}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="py-10 text-center text-xs text-[#bda086]">
              No rounds played yet.
            </div>
          )}

          {!loading &&
            !error &&
            items.map((round) => (
              <div
                key={round.id}
                className={`flex items-center justify-between rounded-xl border p-2.5 transition ${
                  round.isWin
                    ? 'border-emerald-500/40 bg-[#122417]/70'
                    : 'border-[#593214]/70 bg-[#1e1006]/85'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`grid size-8 shrink-0 place-items-center rounded-lg border ${
                      round.isWin
                        ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300'
                        : 'border-red-400/40 bg-red-500/15 text-red-300'
                    }`}
                  >
                    {round.isWin ? <Gem className="size-4" /> : <Bomb className="size-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
                      <span>Round #{String(round.id).slice(-6)}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase ${
                          round.isWin
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {round.isWin ? round.multiplier : 'Lost'}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#bda086] truncate">
                      Bet {formatMoney(round.bet)} · {round.mines} Mines · {round.gems} Gems
                      {round.createdAt ? ` · ${formatTime(round.createdAt)}` : ''}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <div
                    className={`text-xs sm:text-sm font-black tabular-nums ${
                      round.isWin ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {round.isWin ? `+${formatMoney(round.payout)}` : `-${formatMoney(round.bet)}`}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-[#bda086] font-semibold">
                    {round.isWin ? 'Payout' : 'Lost'}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#593214]/60 text-center text-[10px] sm:text-xs text-[#a38771]">
          Showing latest {items.length} rounds from server
        </div>
      </div>
    </div>
  );
}
