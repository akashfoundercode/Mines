const FIELD =
  'w-full rounded-lg border border-azure/25 bg-ink/70 px-3 py-2 text-base font-bold tabular-nums text-white outline-none transition focus:border-neon/70 disabled:opacity-50';

export default function AutoSettings({ rounds, picks, left, running, onRounds, onPicks }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <label className="text-sm font-medium text-muted">
        Rounds
        <input type="number" min="1" max="100" disabled={running} value={rounds} onChange={(e) => onRounds(e.target.value)} className={`${FIELD} mt-1.5`} />
      </label>
      <label className="text-sm font-medium text-muted">
        Tiles per round
        <input type="number" min="1" max="24" disabled={running} value={picks} onChange={(e) => onPicks(e.target.value)} className={`${FIELD} mt-1.5`} />
      </label>
      {running && (
        <p className="col-span-2 text-center text-xs font-medium text-neon" aria-live="polite">
          Auto running — {left} round{left === 1 ? '' : 's'} left
        </p>
      )}
    </div>
  );
}
