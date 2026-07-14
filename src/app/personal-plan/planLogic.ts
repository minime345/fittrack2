import { meals } from "@/data/meals";
import type { DayPlan, ExcludedSource, Goal, Meal, PlanMealType } from "./types";

export type ShoppingIngredient = {
  name: string;
  amount: number;
  unit: string;
};

export function getTargetCalories(goal: Goal, baseCalories: number): number {
  const deficit = 0.15;
  switch (goal) {
    case "maintain":
      return baseCalories;
    case "lose":
      return Math.round(baseCalories * (1 - deficit));
    case "gain":
      return Math.round(baseCalories * (1 + deficit));
  }
}

// Филтриране по месо
export const filterByMeatType = (
  mealsList: typeof meals,
  excludedSources: ExcludedSource[]
): typeof meals => {
  return mealsList.filter((meal) => !excludedSources.includes(meal.proteinSource as ExcludedSource));
};

export const calculateTotal = (selectedMeals: DayPlan["meals"]): DayPlan["total"] => {
  const total = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  Object.values(selectedMeals).flat().forEach((meal) => {
    total.kcal += meal.kcal;
    total.protein += meal.protein;
    total.carbs += meal.carbs;
    total.fat += meal.fat;
  });
  return total;
};

export const generateDayPlan = (pool: typeof meals, target: number): DayPlan => {
  const byType = (type: PlanMealType) => pool.filter((meal) => meal.mealType.includes(type));
  const mainTypes: PlanMealType[] = ["breakfast", "lunch", "dinner"];
  if (!mainTypes.every((type) => byType(type).length > 0)) {
    return { meals: { breakfast: [], lunch: [], dinner: [], snack: [] }, total: { kcal: 0, protein: 0, carbs: 0, fat: 0 } };
  }

  let bestPlan: DayPlan | null = null;
  let bestDifference = Number.POSITIVE_INFINITY;
  const snackLimit = target < 1600 ? 0 : target < 2100 ? 1 : target < 2700 ? 2 : 3;

  for (let attempt = 0; attempt < 600; attempt += 1) {
    const selectedMeals: DayPlan["meals"] = { breakfast: [], lunch: [], dinner: [], snack: [] };
    const used = new Set<string>();
    for (const type of mainTypes) {
      const choices = byType(type).filter((meal) => !used.has(meal.slug));
      const meal = choices[Math.floor(Math.random() * choices.length)];
      selectedMeals[type] = [meal];
      used.add(meal.slug);
    }
    const snacks = byType("snack").filter((meal) => !used.has(meal.slug));
    selectedMeals.snack = [...snacks].sort(() => Math.random() - 0.5).slice(0, Math.min(snackLimit, snacks.length));
    let total = calculateTotal(selectedMeals);

    // A second serving is only added when it makes the daily target more accurate.
    // No meal can be added more than twice.
    for (let extraPortion = 0; extraPortion < 2 && total.kcal < target; extraPortion += 1) {
      const doublePortionChoices = (Object.entries(selectedMeals) as [PlanMealType, Meal[]][])
        .flatMap(([type, mealList]) => mealList.map((meal) => ({ type, meal })))
        .filter(({ type, meal }) => selectedMeals[type].filter((item) => item.slug === meal.slug).length === 1)
        .filter(({ meal }) => Math.abs(total.kcal + meal.kcal - target) < Math.abs(total.kcal - target));
      if (!doublePortionChoices.length) break;

      const bestDoublePortion = doublePortionChoices.reduce((best, candidate) =>
        Math.abs(total.kcal + candidate.meal.kcal - target) < Math.abs(total.kcal + best.meal.kcal - target)
          ? candidate
          : best
      );
      selectedMeals[bestDoublePortion.type].push(bestDoublePortion.meal);
      total = calculateTotal(selectedMeals);
    }
    const difference = Math.abs(total.kcal - target);
    if (difference < bestDifference) {
      bestPlan = { meals: selectedMeals, total };
      bestDifference = difference;
      if (difference <= 25) break;
    }
  }
  return bestPlan!;
};

/* Legacy generator retained below temporarily

  // Калкулиране на макросите
  const total = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

  const sumMacros = (mealList: typeof meals) => {
    for (const m of mealList) {
      total.kcal += m.kcal;
      total.protein += m.protein;
      total.carbs += m.carbs;
      total.fat += m.fat;
    }
  };

  Object.values(selectedMeals).forEach(sumMacros);

  // Оставащи ястия (избягваме дублиране)
  const usedSlugs = new Set(
    [...selectedMeals.breakfast, ...selectedMeals.lunch, ...selectedMeals.dinner, ...selectedMeals.snack].map(
      (m) => m.slug
    )
  );
  const remaining = pool.filter((m) => !usedSlugs.has(m.slug));

  // Добавяме допълнителни снаксове ако е нужно (само при по-високи цели)
  if (target > 1500) {
    for (const snack of remaining.sort(() => 0.5 - Math.random())) {
      if (!snack.mealType.includes("snack")) continue;
      if (total.kcal + snack.kcal > target + 50) continue;

      selectedMeals.snack.push(snack);
      total.kcal += snack.kcal;
      total.protein += snack.protein;
      total.carbs += snack.carbs;
      total.fat += snack.fat;

      if (total.kcal >= target - 50) break;
    }
  }

  return { meals: selectedMeals, total };
};
*/

export const groupMealPortions = (mealList: Meal[]) =>
  mealList.reduce<{ meal: Meal; servings: number }[]>((grouped, meal) => {
    const existing = grouped.find((item) => item.meal.slug === meal.slug);
    if (existing) existing.servings += 1;
    else grouped.push({ meal, servings: 1 });
    return grouped;
  }, []);

export const shortLabel = (label: string) => label.replace(/:\s*$/, "");

export function generateShoppingList(weeklyPlan: DayPlan[], lang: "bg" | "en"): ShoppingIngredient[] {
  const ingredientMap = new Map<string, ShoppingIngredient>();

  // Обхождаме всеки ден от седмичния план
  weeklyPlan.forEach((day) => {
    // Взимаме всички ястия за деня
    const allMeals = [
      ...day.meals.breakfast,
      ...day.meals.lunch,
      ...day.meals.dinner,
      ...day.meals.snack,
    ];

    // Обхождаме всяко ястие и неговите съставки
    allMeals.forEach((meal) => {
      meal.ingredients?.forEach(({ name, amount, unit }) => {
        const ingredientName = typeof name === "string" ? name : name[lang];
        const key = `${ingredientName}_${unit}`;
        if (ingredientMap.has(key)) {
          ingredientMap.get(key)!.amount += amount;
        } else {
          ingredientMap.set(key, { name: ingredientName, amount, unit });
        }
      });
    });
  });

  // Връщаме масив от съставки, сортиран по име
  return Array.from(ingredientMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}
