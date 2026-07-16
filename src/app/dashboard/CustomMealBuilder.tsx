"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Utensils } from "lucide-react";
import type { Meal } from "@/app/personal-plan/types";
import type { PlanMealType } from "@/app/personal-plan/types";
import { createClient } from "@/lib/supabase/client";

type Food = { id: string; name: string; kcal: number; protein: number; carbs: number; fat: number };
type Row = { id: string; foodId: string; grams: string };

const foods: Food[] = [
  { id: "chicken", name: "Chicken breast, cooked", kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "beef", name: "Lean beef, cooked", kcal: 250, protein: 26, carbs: 0, fat: 15 },
  { id: "salmon", name: "Salmon, cooked", kcal: 208, protein: 20, carbs: 0, fat: 13 },
  { id: "tuna", name: "Tuna in water", kcal: 116, protein: 26, carbs: 0, fat: 1 },
  { id: "egg", name: "Whole egg", kcal: 143, protein: 13, carbs: 0.7, fat: 9.5 },
  { id: "tofu", name: "Firm tofu", kcal: 144, protein: 17, carbs: 3, fat: 9 },
  { id: "greek-yogurt", name: "Greek yogurt, 2%", kcal: 73, protein: 10, carbs: 4, fat: 2 },
  { id: "cottage-cheese", name: "Cottage cheese", kcal: 98, protein: 11, carbs: 3.4, fat: 4.3 },
  { id: "rice", name: "Rice, cooked", kcal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { id: "pasta", name: "Pasta, cooked", kcal: 158, protein: 5.8, carbs: 31, fat: 0.9 },
  { id: "potato", name: "Potato, cooked", kcal: 87, protein: 1.9, carbs: 20, fat: 0.1 },
  { id: "oats", name: "Oats, dry", kcal: 389, protein: 16.9, carbs: 66, fat: 6.9 },
  { id: "bread", name: "Whole-grain bread", kcal: 247, protein: 13, carbs: 41, fat: 4.2 },
  { id: "quinoa", name: "Quinoa, cooked", kcal: 120, protein: 4.4, carbs: 21, fat: 1.9 },
  { id: "beans", name: "Beans, cooked", kcal: 127, protein: 8.7, carbs: 23, fat: 0.5 },
  { id: "lentils", name: "Lentils, cooked", kcal: 116, protein: 9, carbs: 20, fat: 0.4 },
  { id: "avocado", name: "Avocado", kcal: 160, protein: 2, carbs: 8.5, fat: 14.7 },
  { id: "olive-oil", name: "Olive oil", kcal: 884, protein: 0, carbs: 0, fat: 100 },
  { id: "peanut-butter", name: "Peanut butter", kcal: 588, protein: 25, carbs: 20, fat: 50 },
  { id: "almonds", name: "Almonds", kcal: 579, protein: 21, carbs: 22, fat: 50 },
  { id: "banana", name: "Banana", kcal: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { id: "berries", name: "Mixed berries", kcal: 50, protein: 0.7, carbs: 12, fat: 0.3 },
  { id: "broccoli", name: "Broccoli", kcal: 35, protein: 2.4, carbs: 7, fat: 0.4 },
  { id: "tomato", name: "Tomato", kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  { id: "spinach", name: "Spinach", kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
];

const storageKey = "fittrack-custom-meals-v1";
const emptyRow = (): Row => ({ id: crypto.randomUUID(), foodId: foods[0].id, grams: "100" });

export function CustomMealBuilder({ userId }: { userId: string }) {
  const [name, setName] = useState("");
  const [mealType, setMealType] = useState<PlanMealType>("lunch");
  const [instructions, setInstructions] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [savedMeals, setSavedMeals] = useState<Meal[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRows([emptyRow()]);
    let localMeals: Meal[] = [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        localMeals = JSON.parse(raw) as Meal[];
        setSavedMeals(localMeals);
      }
    } catch { localStorage.removeItem(storageKey); }
    const loadAccountMeals = async () => {
      const { data } = await createClient().from("custom_recipes").select("id,name,description,ingredients,nutrition,categories,meal_types").eq("user_id", userId).order("created_at", { ascending: true });
      if (!data?.length) return;
      const accountMeals = data.map((recipe) => {
        const nutrition = (recipe.nutrition || {}) as Record<string, number>;
        const rawIngredients = Array.isArray(recipe.ingredients) ? recipe.ingredients as Record<string, unknown>[] : [];
        const ingredients = rawIngredients.map((ingredient) => ({
          name: { bg: String(ingredient.name || "Ingredient"), en: String(ingredient.name || "Ingredient") },
          amount: Number(ingredient.grams || ingredient.amount || 0),
          unit: "g",
        })).filter((ingredient) => ingredient.amount > 0);
        return {
          slug: `custom-${recipe.id}`, icon: "🍽️", kcal: Math.round(Number(nutrition.kcal || 0)), protein: Math.round(Number(nutrition.protein || 0)), carbs: Math.round(Number(nutrition.carbs || 0)), fat: Math.round(Number(nutrition.fat || 0)), weight: Math.round(Number(nutrition.weight || ingredients.reduce((sum, item) => sum + item.amount, 0))),
          categories: recipe.categories?.length ? recipe.categories : ["balanced", "custom"], name: { bg: recipe.name, en: recipe.name }, recipe: { bg: recipe.description || "Combine and prepare the listed ingredients.", en: recipe.description || "Combine and prepare the listed ingredients." }, ingredients, link: "/dashboard#custom-meals", mealType: recipe.meal_types?.length ? recipe.meal_types : ["lunch"], proteinSource: "custom",
        } as Meal;
      }).filter((meal) => meal.kcal > 0 && meal.ingredients.length > 0);
      const merged = [...localMeals.filter((meal) => !accountMeals.some((accountMeal) => accountMeal.slug === meal.slug)), ...accountMeals];
      setSavedMeals(merged);
      localStorage.setItem(storageKey, JSON.stringify(merged));
    };
    void loadAccountMeals();
  }, [userId]);

  const totals = useMemo(() => rows.reduce((total, row) => {
    const food = foods.find((item) => item.id === row.foodId);
    const grams = Number(row.grams);
    if (!food || !Number.isFinite(grams) || grams <= 0) return total;
    const scale = grams / 100;
    total.weight += grams;
    total.kcal += food.kcal * scale;
    total.protein += food.protein * scale;
    total.carbs += food.carbs * scale;
    total.fat += food.fat * scale;
    return total;
  }, { weight: 0, kcal: 0, protein: 0, carbs: 0, fat: 0 }), [rows]);
  const rounded = Object.fromEntries(Object.entries(totals).map(([key, value]) => [key, Math.round(value)])) as typeof totals;

  const updateRow = (id: string, patch: Partial<Row>) => setRows((current) => current.map((row) => row.id === id ? { ...row, ...patch } : row));

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return setMessage("Name your meal first.");
    if (!rows.length || rounded.weight <= 0) return setMessage("Add at least one ingredient and weight.");
    const id = crypto.randomUUID();
    const ingredients = rows.map((row) => {
      const food = foods.find((item) => item.id === row.foodId)!;
      return { name: { bg: food.name, en: food.name }, amount: Number(row.grams), unit: "g" };
    });
    const meal: Meal = {
      slug: `custom-${id}`,
      icon: "🍽️",
      kcal: rounded.kcal,
      protein: rounded.protein,
      carbs: rounded.carbs,
      fat: rounded.fat,
      weight: rounded.weight,
      categories: ["balanced", "custom"],
      name: { bg: name.trim(), en: name.trim() },
      recipe: { bg: instructions.trim() || "Combine and prepare the listed ingredients.", en: instructions.trim() || "Combine and prepare the listed ingredients." },
      ingredients,
      link: "/dashboard#custom-meals",
      mealType: [mealType],
      proteinSource: "custom",
    };
    setSaving(true);
    setMessage("");
    const { error } = await createClient().from("custom_recipes").insert({
      id,
      user_id: userId,
      name: name.trim(),
      description: instructions.trim() || null,
      ingredients: rows.map((row) => ({ foodId: row.foodId, name: foods.find((food) => food.id === row.foodId)?.name, grams: Number(row.grams) })),
      instructions: instructions.trim() ? [instructions.trim()] : [],
      nutrition: rounded,
      categories: ["balanced", "custom"],
      meal_types: [mealType],
    });
    setSaving(false);
    if (error) return setMessage(error.message);
    const next = [...savedMeals, meal];
    setSavedMeals(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    setName(""); setInstructions(""); setRows([emptyRow()]);
    setMessage("Meal saved. It is now available when generating or swapping meals in your personal plan.");
  };

  const remove = async (meal: Meal) => {
    const id = meal.slug.replace(/^custom-/, "");
    const { error } = await createClient().from("custom_recipes").delete().eq("id", id).eq("user_id", userId);
    if (error) return setMessage(error.message);
    const next = savedMeals.filter((item) => item.slug !== meal.slug);
    setSavedMeals(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    setMessage("Custom meal removed.");
  };

  return (
    <section id="custom-meals" className="scroll-mt-24">
      <div><p className="fit-eyebrow">Custom meals</p><h2 className="mt-2 text-2xl font-black">Create your own meal</h2><p className="mt-2 text-sm leading-relaxed text-gray-400">Choose ingredients, enter their weights, and FitTrack calculates estimated macros for the full portion.</p></div>
      <form onSubmit={save} className="mt-5 space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_150px]"><label className="text-xs font-bold text-gray-300">Meal name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. My chicken bowl" className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-gray-950 px-3 text-sm outline-none focus:border-green-400" /></label><label className="text-xs font-bold text-gray-300">Use for<select value={mealType} onChange={(event) => setMealType(event.target.value as PlanMealType)} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-gray-950 px-3 text-sm outline-none"><option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option><option value="snack">Snack</option></select></label></div>
        <div className="space-y-2">{rows.map((row) => <div key={row.id} className="grid grid-cols-[1fr_88px_40px] gap-2"><select value={row.foodId} onChange={(event) => updateRow(row.id, { foodId: event.target.value })} className="min-w-0 rounded-xl border border-white/10 bg-gray-950 px-3 text-sm outline-none"><option value="" disabled>Choose ingredient</option>{foods.map((food) => <option key={food.id} value={food.id}>{food.name}</option>)}</select><div className="flex items-center rounded-xl border border-white/10 bg-gray-950 px-2"><input type="number" min="1" max="3000" required value={row.grams} onChange={(event) => updateRow(row.id, { grams: event.target.value })} className="min-w-0 flex-1 bg-transparent text-sm outline-none" /><span className="text-[10px] text-gray-500">g</span></div><button type="button" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} disabled={rows.length === 1} className="flex items-center justify-center rounded-xl border border-white/10 text-gray-500 hover:text-red-300 disabled:opacity-30" aria-label="Remove ingredient"><Trash2 className="h-4 w-4" /></button></div>)}</div>
        <button type="button" onClick={() => setRows((current) => [...current, emptyRow()])} className="flex items-center gap-2 text-xs font-bold text-green-300"><Plus className="h-4 w-4" /> Add ingredient</button>
        <label className="block text-xs font-bold text-gray-300">Preparation notes (optional)<textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} rows={2} placeholder="How do you prepare it?" className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-gray-950 p-3 text-sm outline-none focus:border-green-400" /></label>
        <div className="grid grid-cols-5 gap-2 rounded-2xl border border-green-500/15 bg-green-500/5 p-3 text-center"><Macro label="Weight" value={`${rounded.weight}g`} /><Macro label="Calories" value={`${rounded.kcal}`} /><Macro label="Protein" value={`${rounded.protein}g`} /><Macro label="Carbs" value={`${rounded.carbs}g`} /><Macro label="Fat" value={`${rounded.fat}g`} /></div>
        <button disabled={saving} className="fit-primary-button min-h-11 w-full px-4 text-sm font-black disabled:opacity-60">{saving ? "Saving…" : "Save custom meal"}</button>
        {message && <p role="status" className="text-xs text-green-300">{message}</p>}
      </form>
      {savedMeals.length > 0 && <div className="mt-6 border-t border-white/10 pt-5"><p className="text-xs font-bold uppercase tracking-wider text-gray-500">Your custom meals</p><div className="mt-3 space-y-2">{savedMeals.map((meal) => <div key={meal.slug} className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/15 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10 text-green-300"><Utensils className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{meal.name.en}</p><p className="text-[11px] text-gray-500">{meal.kcal} kcal · P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g</p></div><button type="button" onClick={() => remove(meal)} className="p-2 text-gray-600 hover:text-red-300" aria-label={`Delete ${meal.name.en}`}><Trash2 className="h-4 w-4" /></button></div>)}</div></div>}
    </section>
  );
}

function Macro({ label, value }: { label: string; value: string }) { return <div><p className="text-[9px] uppercase text-gray-500">{label}</p><p className="mt-1 text-xs font-black text-white sm:text-sm">{value}</p></div>; }
