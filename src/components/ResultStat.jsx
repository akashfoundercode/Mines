export default function ResultStat({ label, value, valueClass = 'text-white' }) {
  return (
    <div className="modal-result-stat rounded-xl border border-white/10 bg-white/5 text-center">
      <div className="modal-stat-label font-medium uppercase tracking-wider text-muted">{label}</div>
      <div className={`modal-stat-value font-bold tabular-nums ${valueClass}`}>{value}</div>
    </div>
  );
}
