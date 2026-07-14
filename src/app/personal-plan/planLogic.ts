import { meals } from "@/data/meals";
import type { DayPlan, ExcludedSource, Goal, Meal, PlanMealType, PlanStyle } from "./types";

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
  return Object.fromEntries(Object.entries(total).map(([key, value]) => [key, Math.round(value)])) as DayPlan["total"];
};

const roundRecipeAmount = (amount: number, unit: string): number => {
  // Countable foods (eggs, bananas, avocados) are practical in half-item steps.
  if (!unit) return Math.max(0.5, Math.round(amount * 2) / 2);
  // Keep seasonings and other tiny quantities precise enough for cooking.
  if (amount < 10) return Math.max(1, Math.round(amount));
  // Typical additions such as oil, nuts, and cheese use 5 g/ml steps.
  if (amount < 100) return Math.max(5, Math.round(amount / 5) * 5);
  // Main ingredients use familiar 25 g/ml steps: 100, 125, 150, etc.
  return Math.max(25, Math.round(amount / 25) * 25);
};

export const scaleMeal = (meal: Meal, multiplier: number): Meal => {
  if (meal.fixedPortion) return meal;
  const baseMultiplier = meal.portionMultiplier || 1;
  const baseWeight = meal.weight / baseMultiplier;
  const requestedScale = Math.max(0.5, Math.min(3, multiplier));
  // Portion weights use practical 50 g increments: 300, 350, 400, etc.
  const roundedWeight = Math.max(50, Math.round((baseWeight * requestedScale) / 50) * 50);
  const scale = roundedWeight / baseWeight;
  const round = (value: number) => Math.round((value / baseMultiplier) * scale);
  return {
    ...meal,
    kcal: round(meal.kcal),
    protein: round(meal.protein),
    carbs: round(meal.carbs),
    fat: round(meal.fat),
    weight: roundedWeight,
    ingredients: meal.ingredients.map((ingredient) => ({
      ...ingredient,
      amount: roundRecipeAmount((ingredient.amount / baseMultiplier) * scale, ingredient.unit),
    })),
    portionMultiplier: scale,
  };
};

const scaleGeneratedMeal = (meal: Meal, multiplier: number): Meal => {
  if (meal.fixedPortion) return meal;
  // Generated plans should add another eating occasion instead of producing
  // an impractically large single serving (for example, a 1 litre shake).
  const maxWeight = meal.slug.includes("shake")
    ? 500
    : meal.mealType.includes("breakfast")
      ? 600
      : 800;
  return scaleMeal(meal, Math.min(multiplier, maxWeight / meal.weight));
};

export const generateDayPlan = (pool: typeof meals, target: number): DayPlan => {
  const byType = (type: PlanMealType) => pool.filter((meal) => meal.mealType.includes(type));
  const mainTypes: PlanMealType[] = ["breakfast", "lunch", "dinner"];
  if (!mainTypes.every((type) => byType(type).length > 0)) {
    return { meals: { breakfast: [], lunch: [], dinner: [], snack: [] }, total: { kcal: 0, protein: 0, carbs: 0, fat: 0 } };
  }

  let bestPlan: DayPlan | null = null;
  let bestDifference = Number.POSITIVE_INFINITY;
  // Higher targets can use more eating occasions, while ordinary plans keep
  // snacks limited and continue to prioritize proper meals.
  const snackLimit = target < 1800 ? 0 : target < 3000 ? 1 : target < 4000 ? 2 : 3;

  for (let attempt = 0; attempt < 600; attempt += 1) {
    const selectedMeals: DayPlan["meals"] = { breakfast: [], lunch: [], dinner: [], snack: [] };
    const used = new Set<string>();
    for (const type of mainTypes) {
      const choices = byType(type).filter((meal) => !used.has(meal.slug));
      const meal = choices[Math.floor(Math.random() * choices.length)];
      selectedMeals[type] = [meal];
      used.add(meal.slug);
    }
    // Reserve the expected snack slots first so high-calorie days do not end
    // up with no snacks simply because extra main meals filled the target.
    const snackChoices = [...byType("snack")]
      .filter((meal) => !used.has(meal.slug))
      .sort(() => Math.random() - 0.5)
      .slice(0, snackLimit);
    selectedMeals.snack = snackChoices;
    snackChoices.forEach((meal) => used.add(meal.slug));

    const reservedSnackCalories = calculateTotal({
      breakfast: [], lunch: [], dinner: [], snack: selectedMeals.snack,
    }).kcal;
    const mainCalories = mainTypes.reduce((sum, type) => sum + selectedMeals[type][0].kcal, 0);
    const requestedScale = Math.max(0, target - reservedSnackCalories) / mainCalories;
    // Generated portions use familiar 25% serving steps and stay within a
    // normal 0.75–1.5 serving range. The daily calories may be approximate.
    const maxMainScale = target >= 3000 ? 2 : 1.5;
    const mainScale = Math.max(0.75, Math.min(maxMainScale, Math.round(requestedScale * 4) / 4));
    for (const type of mainTypes) selectedMeals[type] = [scaleGeneratedMeal(selectedMeals[type][0], mainScale)];

    // Add as many extra proper meals as the high target reasonably needs
    // (up to six distinct meals) before reaching for more snacks.
    const caloriesAfterMainMeals = calculateTotal(selectedMeals).kcal;
    const extraMealLimit = Math.min(6, Math.max(0, Math.ceil((target - caloriesAfterMainMeals) / 600)));
    for (let extra = 0; extra < extraMealLimit; extra += 1) {
      const current = calculateTotal(selectedMeals);
      if (target - current.kcal < 350) break;
      // Fill the least-used main-meal slot first. This makes a second
      // breakfast possible instead of endlessly enlarging the first one.
      const typesByUse = [...mainTypes].sort((a, b) => selectedMeals[a].length - selectedMeals[b].length);
      const type = typesByUse.find((candidateType) =>
        pool.some((meal) => !used.has(meal.slug) && meal.mealType.includes(candidateType))
      );
      if (!type) break;
      const candidates = pool.filter((meal) => !used.has(meal.slug) && meal.mealType.includes(type));
      if (!candidates.length) break;
      const candidate = candidates.reduce((best, meal) =>
        Math.abs(meal.kcal - (target - current.kcal)) < Math.abs(best.kcal - (target - current.kcal)) ? meal : best
      );
      const extraScale = Math.max(0.75, Math.min(1.5, Math.round(((target - current.kcal) / candidate.kcal) * 4) / 4));
      const scaledCandidate = scaleGeneratedMeal(candidate, extraScale);
      selectedMeals[type].push(scaledCandidate);
      used.add(candidate.slug);
    }

    // Non-packaged snacks remain flexible. Share a meaningful remaining gap
    // between them, while store-bought fixed portions stay untouched.
    const flexibleSnacks = selectedMeals.snack.filter((meal) => !meal.fixedPortion);
    flexibleSnacks.forEach((snack) => {
      const current = calculateTotal(selectedMeals);
      const remaining = target - current.kcal;
      if (remaining < 100) return;
      const share = remaining / flexibleSnacks.length;
      const scaledSnack = scaleGeneratedMeal(snack, Math.min(2, (snack.kcal + share) / snack.kcal));
      selectedMeals.snack = selectedMeals.snack.map((item) => item.slug === snack.slug ? scaledSnack : item);
    });

    const total = calculateTotal(selectedMeals);
    const difference = Math.abs(total.kcal - target);
    if (difference < bestDifference) {
      bestPlan = { meals: selectedMeals, total };
      bestDifference = difference;
      if (difference <= 25) break;
    }
  }
  return bestPlan!;
};

const mealIngredientKeys = (meal: Meal) => new Set(
  meal.ingredients.map((ingredient) => `${ingredient.name.bg}|${ingredient.name.en}`)
);

const daySignature = (day: DayPlan) => (["breakfast", "lunch", "dinner", "snack"] as PlanMealType[])
  .map((type) => day.meals[type].map((meal) => meal.slug).sort().join(","))
  .join("|");

const generateIngredientFriendlyWeek = (
  pool: typeof meals,
  target: number,
  choicesPerMealType: number
): DayPlan[] => {
  const firstDay = generateDayPlan(pool, target);
  const coreIngredients = new Set(
    Object.values(firstDay.meals).flat().flatMap((meal) => Array.from(mealIngredientKeys(meal)))
  );
  const compactPool = new Map<string, (typeof meals)[number]>();

  (["breakfast", "lunch", "dinner", "snack"] as PlanMealType[]).forEach((type) => {
    pool
      .filter((meal) => meal.mealType.includes(type))
      .map((meal) => ({
        meal,
        overlap: Array.from(mealIngredientKeys(meal)).filter((ingredient) => coreIngredients.has(ingredient)).length,
      }))
      .sort((a, b) => b.overlap - a.overlap || Math.random() - 0.5)
      .slice(0, choicesPerMealType)
      .forEach(({ meal }) => compactPool.set(meal.slug, meal));
  });

  const focusedPool = Array.from(compactPool.values());
  const week = [firstDay];
  const signatures = new Set([daySignature(firstDay)]);
  while (week.length < 7) {
    let candidate = generateDayPlan(focusedPool, target);
    for (let attempt = 0; attempt < 4 && signatures.has(daySignature(candidate)); attempt += 1) {
      candidate = generateDayPlan(focusedPool, target);
    }
    signatures.add(daySignature(candidate));
    week.push(candidate);
  }
  return week;
};

export const generateWeekPlan = (pool: typeof meals, target: number, style: PlanStyle): DayPlan[] => {
  if (style === "very-simple") {
    // A small recipe pool adds light variety while strongly reusing ingredients.
    return generateIngredientFriendlyWeek(pool, target, 4);
  }

  if (style === "simple") {
    // A wider rotation still favors recipes built from the same core groceries.
    return generateIngredientFriendlyWeek(pool, target, 7);
  }

  // Prefer unused recipes across the week. Once a meal type runs out, the
  // full eligible pool becomes available again so every day remains complete.
  const used = new Set<string>();
  return Array.from({ length: 7 }, () => {
    const unusedPool = pool.filter((meal) => !used.has(meal.slug));
    const hasEveryMainType = (["breakfast", "lunch", "dinner"] as PlanMealType[])
      .every((type) => unusedPool.some((meal) => meal.mealType.includes(type)));
    const day = generateDayPlan(hasEveryMainType ? unusedPool : pool, target);
    Object.values(day.meals).flat().forEach((meal) => used.add(meal.slug));
    return day;
  });
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
  return Array.from(ingredientMap.values())
    .map((ingredient) => ({
      ...ingredient,
      // Grams and millilitres are useful in 5-unit shopping increments;
      // unitless foods such as eggs, bananas, and avocados are whole items.
      amount: ingredient.unit === "g" || ingredient.unit === "ml"
        ? ingredient.amount >= 100
          ? Math.round(ingredient.amount / 50) * 50
          : Math.round(ingredient.amount / 5) * 5
        : Math.round(ingredient.amount),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
