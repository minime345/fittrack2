import type { Meal as BaseMeal } from "@/data/meals";

export type LocalizedString = { bg: string; en: string };
export type Goal = "maintain" | "lose" | "gain";
export type Diet = "all" | "balanced" | "high-protein" | "keto" | "vegan" | "vegetarian";
export type ExcludedSource = "chicken" | "beef" | "pork" | "fish" | "supplement" | "vegan" | "egg" | "dairy";
export type Ingredient = {
  name: { bg: string; en: string };
  amount: number;
  unit: string;
};
export type Meal = BaseMeal & { portionMultiplier?: number };
export type PlanMealType = "breakfast" | "lunch" | "dinner" | "snack";
export type DayPlan = {
  meals: Record<PlanMealType, Meal[]>;
  total: { kcal: number; protein: number; carbs: number; fat: number };
};
