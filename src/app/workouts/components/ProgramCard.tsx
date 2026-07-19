import Image from "next/image";
import type { Program } from "../types";
import { workoutImageFor } from "@/lib/visual-assets";

export function ProgramCard({
  program,
  lang,
  selected,
  isPreviewed,
  isRecommended,
  rank,
  matchScore,
  onTogglePreview,
  onSelect,
}: {
  program: Program;
  lang: "bg" | "en";
  selected: boolean;
  isPreviewed: boolean;
  isRecommended: boolean;
  rank: number;
  matchScore: number;
  onTogglePreview: () => void;
  onSelect: () => void;
}) {
  return (
    <article
      className={`fit-surface fit-card-interactive relative self-start overflow-hidden rounded-2xl border ${selected ? "border-green-400 bg-green-500/10 shadow-lg shadow-green-950/20" : isPreviewed ? "border-green-400/60" : "border-white/10"}`}
    >
      <button
        type="button"
        onClick={onTogglePreview}
        aria-expanded={isPreviewed}
        className="block w-full text-left"
      >
        <span className="relative block h-36 overflow-hidden">
          <Image src={workoutImageFor(program.id)} alt={program.name[lang]} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 hover:scale-[1.03]" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        </span>
        <span className="absolute right-4 top-4 z-10 flex items-center gap-1.5">
          <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-gray-300">
            #{rank} · {matchScore}%
          </span>
          {isRecommended && (
            <span className="rounded-full bg-green-500 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-black">
              {lang === "bg" ? "За теб" : "For you"}
            </span>
          )}
        </span>
        <span className="mx-5 mt-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-sm font-black text-green-300">
          {program.icon}
        </span>
        <span className="mx-5 mt-4 block pr-24 text-lg font-bold">
          {program.name[lang]}
        </span>
        <span className="mx-5 mt-2 block text-sm leading-relaxed text-gray-400">
          {program.summary[lang]}
        </span>
        <span className="mx-5 mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wide text-green-300">
          <span>
            {program.days.join("/")} {lang === "bg" ? "дни" : "days"}
          </span>
          <span>•</span>
          <span>
            {program.duration[0]}-{program.duration[1]} min
          </span>
        </span>
        <span className="mx-5 mb-5 mt-4 block text-xs font-semibold text-gray-300">
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
        <div className="border-t border-white/10 p-5">
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
