export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-20 rounded-xl border border-white/5 bg-black/15 p-2">
      <p className="truncate text-sm font-black text-white">{value}</p>
      <p className="text-[9px] uppercase tracking-wide text-gray-500">
        {label}
      </p>
    </div>
  );
}
