import type { DayPlan, Meal, PlanMealType } from "../types";
import { groupMealPortions, shortLabel } from "../planLogic";

type WeeklyTableProps = {
  t: any;
  lang: "bg" | "en";
  weeklyPlan: DayPlan[];
  mealTypeIcons: Record<PlanMealType, string>;
  openMeal: (dayIndex: number, mealType: PlanMealType, meal: Meal) => void;
  replaceMeal: (dayIndex: number, mealType: PlanMealType, oldSlug: string) => void;
};

export function WeeklyTable({
  t,
  lang,
  weeklyPlan,
  mealTypeIcons,
  openMeal,
  replaceMeal,
}: WeeklyTableProps) {
  return (
    <div className="fit-surface hidden max-w-full overflow-x-auto rounded-2xl text-gray-100 shadow-lg md:block">
      <table className="min-w-full table-fixed border-collapse divide-y divide-gray-700">
        <thead>
          <tr className="bg-gray-800 text-green-400 uppercase text-xs tracking-wider select-none border-b border-gray-600">
            <th className="w-[80px] py-3 px-4 border-r border-gray-700 rounded-tl-md">{t.Main.day}</th>
            <th className="w-[180px] py-3 px-4 border-r border-gray-700">
              <span className="mr-1">{mealTypeIcons.breakfast}</span>{t.Main.breakfast}
            </th>
            <th className="w-[180px] py-3 px-4 border-r border-gray-700">
              <span className="mr-1">{mealTypeIcons.lunch}</span>{t.Main.lunch}
            </th>
            <th className="w-[180px] py-3 px-4 border-r border-gray-700">
              <span className="mr-1">{mealTypeIcons.dinner}</span>{t.Main.dinner}
            </th>
            <th className="w-[240px] py-3 px-4 border-r border-gray-700">
              <span className="mr-1">{mealTypeIcons.snack}</span>{t.Main.snack}
            </th>
            <th className="w-[110px] py-3 px-4 rounded-tr-md">{t.Main.macros}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {weeklyPlan.map((day, idx) => (
            <tr
              key={idx}
              className={`transition-colors ${idx % 2 === 0 ? "bg-gray-800/70" : "bg-gray-900/70"} hover:bg-gray-700/80`}
            >
              <td className="border-r border-gray-700 py-4 px-4 font-semibold text-green-400 text-center whitespace-nowrap rounded-bl-md">
                {t.Main.day} {idx + 1}
              </td>

              {(["breakfast", "lunch", "dinner", "snack"] as const).map((mealType) => (
                <td
                  key={mealType}
                  className={`border-r border-gray-700 py-3 px-3 align-top text-gray-300 whitespace-normal break-words ${
                    mealType === "snack" ? "max-w-[220px]" : "max-w-[180px]"
                  }`}
                >
                  {day.meals[mealType].length > 0 ? (
                    <div className="space-y-1">
                      {groupMealPortions(day.meals[mealType]).map(({ meal, servings }) => (
                        <div
                          key={meal.slug}
                          className="flex items-center gap-2 rounded-md bg-gray-900/50 px-2 py-1.5 text-sm"
                          title={meal.name[lang]}
                        >
                          <span className="shrink-0 text-xl select-none">{meal.icon || "🍽️"}</span>
                            <button
                              onClick={() => openMeal(idx, mealType, meal)}
                              className="min-w-0 flex-1 truncate text-left text-green-300 hover:text-green-400 focus:outline-none"
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
                    <span className="italic text-gray-600">—</span>
                  )}
                </td>
              ))}

              <td className="py-3 px-2 align-middle">
                <div className="grid grid-cols-2 gap-1 text-center font-mono text-[10px]">
                  <div className="rounded bg-green-500/10 px-1 py-1">
                    <div className="font-bold text-green-400">{day.total.kcal}</div>
                    <div className="text-gray-400">kcal</div>
                  </div>
                  <div className="rounded bg-blue-500/10 px-1 py-1">
                    <div className="font-bold text-blue-300">{day.total.protein}g</div>
                    <div className="text-gray-400">{shortLabel(t.Main.proteinLabel)}</div>
                  </div>
                  <div className="rounded bg-yellow-500/10 px-1 py-1">
                    <div className="font-bold text-yellow-300">{day.total.carbs}g</div>
                    <div className="text-gray-400">{shortLabel(t.Main.carb)}</div>
                  </div>
                  <div className="rounded bg-pink-500/10 px-1 py-1">
                    <div className="font-bold text-pink-300">{day.total.fat}g</div>
                    <div className="text-gray-400">{shortLabel(t.Main.fat)}</div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
