export default function ResultStat({ label, value, valueClass = 'text-white' }) {
  return (
    <div className="modal-result-stat min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 text-center flex flex-col justify-center">
      <div className="modal-stat-label truncate font-medium uppercase tracking-wider text-muted">
        {label}
      </div>
      <div
        className={`modal-stat-value truncate font-bold tabular-nums ${valueClass}`}
        title={String(value)}
      >
        {value}
      </div>
    </div>
  );
}
