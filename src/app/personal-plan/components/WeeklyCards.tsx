import type { DayPlan, Meal, PlanMealType } from "../types";
import { groupMealPortions, shortLabel } from "../planLogic";

type WeeklyCardsProps = {
  t: any;
  lang: "bg" | "en";
  weeklyPlan: DayPlan[];
  mealTypeIcons: Record<PlanMealType, string>;
  mealTypeLabels: Record<PlanMealType, string>;
  openMeal: (dayIndex: number, mealType: PlanMealType, meal: Meal) => void;
  replaceMeal: (dayIndex: number, mealType: PlanMealType, oldSlug: string) => void;
};

export function WeeklyCards({
  t,
  lang,
  weeklyPlan,
  mealTypeIcons,
  mealTypeLabels,
  openMeal,
  replaceMeal,
}: WeeklyCardsProps) {
  return (
    <div className="block md:hidden space-y-4">
      {weeklyPlan.map((day, idx) => (
        <div
          key={idx}
          className="fit-surface overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800/60 shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800/80 px-4 py-3">
            <span className="text-base font-semibold text-green-400">{t.Main.day} {idx + 1}</span>
            <span className="rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-300">
              {day.total.kcal} kcal
            </span>
          </div>

          <div className="space-y-4 p-4">
            {(["breakfast", "lunch", "dinner", "snack"] as const).map((mealType) => (
              <div key={mealType}>
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-400 select-none">
                  <span>{mealTypeIcons[mealType]}</span>
                  {mealTypeLabels[mealType]}
                </div>
                {day.meals[mealType].length > 0 ? (
                  <div className="space-y-1.5">
                    {groupMealPortions(day.meals[mealType]).map(({ meal, servings }) => (
                      <div
                        key={meal.slug}
                        className="flex items-center gap-2 rounded-lg bg-gray-900/60 px-2.5 py-2 text-sm text-green-300"
                        title={meal.name[lang]}
                      >
                        <span className="shrink-0 text-xl select-none">{meal.icon || "🍽️"}</span>
                          <button
                            onClick={() => openMeal(idx, mealType, meal)}
                            className="min-w-0 flex-1 truncate text-left hover:text-green-400 focus:outline-none"
                          >
                            {meal.name[lang]}
                          </button>
                        {servings > 1 && (
                          <span
                            className="shrink-0 rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-300"
                            title={lang === "bg" ? "Двойна порция" : "Double portion"}
                          >
                            ×{servings}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => replaceMeal(idx, mealType, meal.slug)}
                          className="shrink-0 rounded border border-green-500/50 px-1.5 py-0.5 text-[10px] text-green-300 hover:bg-green-500 hover:text-black"
                          aria-label={lang === "bg" ? `Смени ${meal.name[lang]}` : `Replace ${meal.name[lang]}`}
                        >
                          <span aria-hidden="true">🔄</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="italic text-gray-600 text-sm">—</span>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2 border-t border-gray-700 bg-gray-900/60 px-3 py-3 text-center">
            <div>
              <div className="font-mono text-sm font-bold text-green-400">{day.total.kcal}</div>
              <div className="text-[10px] uppercase text-gray-400">kcal</div>
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-blue-300">{day.total.protein}g</div>
              <div className="text-[10px] uppercase text-gray-400">{shortLabel(t.Main.proteinLabel)}</div>
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-yellow-300">{day.total.carbs}g</div>
              <div className="text-[10px] uppercase text-gray-400">{shortLabel(t.Main.carb)}</div>
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-pink-300">{day.total.fat}g</div>
              <div className="text-[10px] uppercase text-gray-400">{shortLabel(t.Main.fat)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
