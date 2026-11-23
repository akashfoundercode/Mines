export default function ResultStat({ label, value, valueClass = 'text-white' }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted">{label}</div>
      <div className={`text-base font-bold tabular-nums ${valueClass}`}>{value}</div>
    </div>
  );
}
