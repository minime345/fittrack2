export function SelectField({
  testId,
  label,
  value,
  onChange,
  options,
}: {
  testId: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <select
        data-testid={testId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-xl border border-white/10 bg-gray-950 px-3 text-sm font-semibold text-white outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-500/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
