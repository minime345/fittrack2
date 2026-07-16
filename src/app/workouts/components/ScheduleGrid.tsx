"use client";

import { useState } from "react";
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
  const [openDays, setOpenDays] = useState<Set<number>>(
    () => new Set(schedule.map((_, index) => index)),
  );

  const toggleDay = (index: number) => {
    setOpenDays((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const allOpen = openDays.size >= schedule.length;
  const expandAll = () =>
    setOpenDays(new Set(schedule.map((_, index) => index)));
  const collapseAll = () => setOpenDays(new Set());

  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-gray-900/60 px-5 py-2.5 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          {schedule.length} {lang === "bg" ? "тренировъчни дни" : "training days"}
        </p>
        <button
          type="button"
          onClick={allOpen ? collapseAll : expandAll}
          className="text-xs font-bold text-green-300 hover:text-green-200"
        >
          {allOpen
            ? lang === "bg"
              ? "Свий всички"
              : "Collapse all"
            : lang === "bg"
              ? "Разгъни всички"
              : "Expand all"}
        </button>
      </div>
      <div className="grid gap-px bg-white/5 md:grid-cols-2">
        {schedule.map((session, index) => {
          const isOpen = openDays.has(index);
          const dayLabel =
            scheduleDays[index]?.[lang] ||
            `${lang === "bg" ? "Ден" : "Day"} ${index + 1}`;
          return (
            <article key={`${planId}-${index}`} className="bg-gray-900/70">
              <button
                type="button"
                onClick={() => toggleDay(index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 p-5 text-left sm:p-6"
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-green-400">
                      {dayLabel}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      ~{minutes} min
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-lg font-bold">
                    {session.focus[lang]}
                  </span>
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20 text-sm text-gray-300 transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                  ⌄
                </span>
              </button>
              {isOpen && (
                <ul className="space-y-2.5 px-5 pb-5 sm:px-6 sm:pb-6">
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
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
