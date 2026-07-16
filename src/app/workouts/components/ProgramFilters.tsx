import type * as React from "react";
import { equipmentOptions, labels } from "../config";
import type { Equipment } from "../types";

export type DayFilter = "all" | number;
export type EquipmentFilter = "all" | Equipment;

const dayOptions: DayFilter[] = ["all", 2, 3, 4, 5, 6];
const equipmentFilterOptions: EquipmentFilter[] = ["all", ...equipmentOptions];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-9 rounded-full border px-3.5 text-xs font-bold transition ${
        active
          ? "border-green-400 bg-green-500/15 text-green-300"
          : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/25 hover:text-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

export function ProgramFilters({
  lang,
  dayFilter,
  setDayFilter,
  equipmentFilter,
  setEquipmentFilter,
  resultCount,
}: {
  lang: "bg" | "en";
  dayFilter: DayFilter;
  setDayFilter: (value: DayFilter) => void;
  equipmentFilter: EquipmentFilter;
  setEquipmentFilter: (value: EquipmentFilter) => void;
  resultCount: number;
}) {
  const hasActiveFilters = dayFilter !== "all" || equipmentFilter !== "all";

  return (
    <div className="fit-surface mb-5 rounded-2xl p-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            {lang === "bg" ? "Дни седмично" : "Days per week"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {dayOptions.map((value) => (
              <Chip
                key={String(value)}
                active={dayFilter === value}
                onClick={() => setDayFilter(value)}
              >
                {value === "all"
                  ? lang === "bg"
                    ? "Всички"
                    : "All"
                  : `${value} ${lang === "bg" ? "дни" : "days"}`}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            {lang === "bg" ? "Оборудване" : "Equipment"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {equipmentFilterOptions.map((value) => (
              <Chip
                key={value}
                active={equipmentFilter === value}
                onClick={() => setEquipmentFilter(value)}
              >
                {value === "all"
                  ? lang === "bg"
                    ? "Всички"
                    : "All"
                  : labels.equipment[value][lang]}
              </Chip>
            ))}
          </div>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setDayFilter("all");
              setEquipmentFilter("all");
            }}
            className="ml-auto text-xs font-semibold text-gray-500 underline-offset-2 hover:text-gray-300 hover:underline"
          >
            {lang === "bg" ? "Изчисти филтрите" : "Clear filters"}
          </button>
        )}
      </div>
      {hasActiveFilters && (
        <p className="mt-3 text-xs text-gray-500">
          {resultCount}{" "}
          {lang === "bg" ? "съвпадащи програми" : "matching programs"}
        </p>
      )}
    </div>
  );
}
