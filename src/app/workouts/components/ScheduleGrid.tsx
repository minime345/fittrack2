import { getExerciseName } from "../data/exercises";
import type { Equipment, LocalText, Program, SessionTemplate } from "../types";

export function ScheduleGrid({
  planId,
  schedule,
  scheduleDays,
  minutes,
  exerciseLimit,
  equipment,
  lang,
}: {
  planId: Program["id"];
  schedule: SessionTemplate[];
  scheduleDays: LocalText[];
  minutes: number;
  exerciseLimit: number;
  equipment: Equipment;
  lang: "bg" | "en";
}) {
  return (
    <div className="grid gap-px bg-white/5 md:grid-cols-2">
      {schedule.map((session, index) => (
        <article
          key={`${planId}-${index}`}
          className="bg-gray-900/95 p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-green-400">
              {scheduleDays[index]?.[lang] ||
                `${lang === "bg" ? "Ден" : "Day"} ${index + 1}`}
            </p>
            <span className="text-[10px] text-gray-500">~{minutes} min</span>
          </div>
          <h3 className="mt-1 text-lg font-bold">{session.focus[lang]}</h3>
          <ul className="mt-4 space-y-2.5">
            {session.exercises.slice(0, exerciseLimit).map((exercise) => (
              <li
                key={`${exercise.id}-${exercise.prescription}`}
                className="flex gap-2 text-sm text-gray-300"
              >
                <span className="mt-0.5 text-green-400">✓</span>
                <span>
                  {getExerciseName(exercise.id, equipment, lang)}{" "}
                  <span className="text-gray-500">
                    - {exercise.prescription}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
