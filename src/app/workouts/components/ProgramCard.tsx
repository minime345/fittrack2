import type { Program } from "../types";

export function ProgramCard({
  program,
  lang,
  selected,
  isPreviewed,
  isRecommended,
  onTogglePreview,
  onSelect,
}: {
  program: Program;
  lang: "bg" | "en";
  selected: boolean;
  isPreviewed: boolean;
  isRecommended: boolean;
  onTogglePreview: () => void;
  onSelect: () => void;
}) {
  return (
    <article
      className={`relative rounded-2xl border p-5 transition ${selected ? "border-green-400 bg-green-500/10 shadow-lg shadow-green-950/20" : isPreviewed ? "border-green-400/60 bg-gray-900" : "border-white/10 bg-gray-900/70 hover:border-green-400/35"}`}
    >
      <button
        type="button"
        onClick={onTogglePreview}
        aria-expanded={isPreviewed}
        className="block w-full text-left"
      >
        {isRecommended && (
          <span className="absolute right-4 top-4 rounded-full bg-green-500 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-black">
            {lang === "bg" ? "За теб" : "For you"}
          </span>
        )}
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-sm font-black text-green-300">
          {program.icon}
        </span>
        <span className="mt-4 block pr-16 text-lg font-bold">
          {program.name[lang]}
        </span>
        <span className="mt-2 block text-sm leading-relaxed text-gray-400">
          {program.summary[lang]}
        </span>
        <span className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wide text-green-300">
          <span>
            {program.days.join("/")} {lang === "bg" ? "дни" : "days"}
          </span>
          <span>•</span>
          <span>
            {program.duration[0]}-{program.duration[1]} min
          </span>
        </span>
        <span className="mt-4 block text-xs font-semibold text-gray-300">
          {isPreviewed
            ? lang === "bg"
              ? "Скрий описанието"
              : "Hide preview"
            : lang === "bg"
              ? "Виж кратко описание"
              : "View short preview"}
        </span>
      </button>

      {isPreviewed && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-xs leading-relaxed text-gray-300">
            {lang === "bg"
              ? `Подходящо за ${program.level.bg.toLowerCase()}, ${program.days.join("/")} дни седмично и тренировки от ${program.duration[0]} до ${program.duration[1]} минути.`
              : `Best for ${program.level.en.toLowerCase()}, ${program.days.join("/")} days per week, with sessions lasting ${program.duration[0]}-${program.duration[1]} minutes.`}
          </p>
          <button
            type="button"
            onClick={onSelect}
            className="mt-4 min-h-11 w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-black text-black transition hover:bg-green-400"
          >
            {selected
              ? lang === "bg"
                ? "Отвори плана"
                : "Open plan"
              : lang === "bg"
                ? "Избери и виж целия план"
                : "Select and view full plan"}
          </button>
        </div>
      )}
    </article>
  );
}
