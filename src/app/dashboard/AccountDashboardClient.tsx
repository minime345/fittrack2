"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { KeyRound } from "lucide-react";
import { HeaderNav } from "@/app/personal-plan/components/HeaderNav";
import { SiteFooter } from "@/app/personal-plan/components/SiteFooter";
import { calculateTotal, getTargetCalories, scaleMeal } from "@/app/personal-plan/planLogic";
import type { DayPlan, Diet, ExcludedSource, Goal, PlanStyle } from "@/app/personal-plan/types";
import { translations, type Lang } from "@/lib/translations-plans";
import { createClient } from "@/lib/supabase/client";
import { CustomMealBuilder } from "./CustomMealBuilder";

type CalculatorProfile = {
  age?: number | null;
  weight?: number | null;
  height?: number | null;
  gender?: "male" | "female";
  activity?: number;
  bodyFat?: number | null;
  calories?: number | null;
  proteinMin?: number | null;
  proteinMax?: number | null;
  updatedAt?: number;
};

type StoredPlan = {
  baseCalories: number;
  goal: Goal;
  diet: Diet;
  excludedSources: ExcludedSource[];
  planStyle?: PlanStyle;
  weeklyPlan: DayPlan[];
  swapHistory?: Record<string, string[]>;
};

type Props = {
  userId: string;
  email: string;
  firstName: string;
  profileGoal: Goal | null;
  unitSystem: string;
  weights: { weight_kg: number | string; recorded_on: string }[];
  counts: { mealPlans: number; workoutPlans: number; favorites: number; recipes: number };
};

const calculateProfile = (profile: CalculatorProfile, weight: number) => {
  const age = Number(profile.age);
  const height = Number(profile.height);
  const activity = Number(profile.activity);
  if (!Number.isFinite(age) || !Number.isFinite(height) || !Number.isFinite(activity)) return null;
  const bodyFat = Number(profile.bodyFat);
  const hasBodyFat = Number.isFinite(bodyFat) && bodyFat > 0 && bodyFat < 100;
  const bmr = hasBodyFat
    ? 370 + 21.6 * weight * (1 - bodyFat / 100)
    : profile.gender === "female"
      ? 10 * weight + 6.25 * height - 5 * age - 161
      : 10 * weight + 6.25 * height - 5 * age + 5;
  const factors: Record<string, [number, number]> = {
    "1.2": [1.2, 1.6], "1.375": [1.4, 1.8], "1.55": [1.6, 2], "1.725": [1.8, 2.2], "1.9": [2, 2.4],
  };
  const protein = factors[String(activity)] || [1.6, 2.2];
  return {
    calories: Math.round(bmr * activity),
    proteinMin: Math.round(weight * protein[0]),
    proteinMax: Math.round(weight * protein[1]),
  };
};

const rescalePlan = (plan: DayPlan[], ratio: number): DayPlan[] => plan.map((day) => {
  const adjustedMeals = Object.fromEntries(Object.entries(day.meals).map(([type, dayMeals]) => [
    type,
    dayMeals.map((meal) => scaleMeal(meal, (meal.portionMultiplier || 1) * ratio)),
  ])) as DayPlan["meals"];
  return { meals: adjustedMeals, total: calculateTotal(adjustedMeals) };
});

export function AccountDashboardClient({ userId, email, firstName, profileGoal, unitSystem, weights, counts }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [isOpen, setIsOpen] = useState(false);
  const [calculator, setCalculator] = useState<CalculatorProfile | null>(null);
  const [activePlan, setActivePlan] = useState<StoredPlan | null>(null);
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState<Goal>(profileGoal || "maintain");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const t = translations[lang];
  const latestWeight = weights[0];

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang === "bg" || savedLang === "en") setLang(savedLang);
    try {
      const calculatorRaw = localStorage.getItem("fittrack-calculator-profile-v1");
      if (calculatorRaw) {
        const parsed = JSON.parse(calculatorRaw) as CalculatorProfile;
        setCalculator(parsed);
        if (Number.isFinite(parsed.weight)) setWeight(String(parsed.weight));
      } else if (latestWeight) setWeight(String(latestWeight.weight_kg));
      const planRaw = localStorage.getItem("fittrack-active-plan-v2");
      if (planRaw) {
        const parsed = JSON.parse(planRaw) as StoredPlan;
        if (Array.isArray(parsed.weeklyPlan) && parsed.weeklyPlan.length === 7) {
          setActivePlan(parsed);
          setGoal(parsed.goal);
        }
      }
    } catch {
      setMessage("Some saved browser data could not be read. Open the calculator or meal plan to refresh it.");
    }
  }, [latestWeight]);

  const planCalories = useMemo(() => {
    if (!activePlan?.weeklyPlan.length) return null;
    return Math.round(activePlan.weeklyPlan.reduce((sum, day) => sum + day.total.kcal, 0) / activePlan.weeklyPlan.length);
  }, [activePlan]);

  const toggleLang = () => {
    const next = lang === "bg" ? "en" : "bg";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  const adjustPlan = async (event: FormEvent) => {
    event.preventDefault();
    const nextWeight = Number(weight);
    if (!Number.isFinite(nextWeight) || nextWeight <= 20 || nextWeight >= 500) return setMessage("Enter a valid weight between 20 and 500 kg.");
    if (!calculator) return setMessage("Complete the calorie calculator first so FitTrack can recalculate your calorie target accurately.");
    const recalculated = calculateProfile(calculator, nextWeight);
    if (!recalculated) return setMessage("Your calculator profile is incomplete. Add age, height, gender, and activity level in the calculator first.");

    setSaving(true);
    setMessage("");
    const targetCalories = getTargetCalories(goal, recalculated.calories);
    let nextPlan = activePlan;
    if (activePlan?.weeklyPlan.length) {
      const currentTarget = getTargetCalories(activePlan.goal, activePlan.baseCalories) || planCalories || targetCalories;
      nextPlan = {
        ...activePlan,
        baseCalories: recalculated.calories,
        goal,
        weeklyPlan: rescalePlan(activePlan.weeklyPlan, targetCalories / currentTarget),
      };
      localStorage.setItem("fittrack-active-plan-v2", JSON.stringify(nextPlan));
      setActivePlan(nextPlan);
    }

    const updatedCalculator: CalculatorProfile = {
      ...calculator,
      weight: nextWeight,
      calories: recalculated.calories,
      proteinMin: recalculated.proteinMin,
      proteinMax: recalculated.proteinMax,
      updatedAt: Date.now(),
    };
    localStorage.setItem("fittrack-calculator-profile-v1", JSON.stringify(updatedCalculator));
    setCalculator(updatedCalculator);

    const supabase = createClient();
    const today = new Date().toISOString().slice(0, 10);
    const operations = [
      supabase.from("profiles").update({ goal, updated_at: new Date().toISOString() }).eq("id", userId),
      supabase.from("weight_entries").upsert({ user_id: userId, weight_kg: nextWeight, recorded_on: today }, { onConflict: "user_id,recorded_on" }),
    ];
    const results = await Promise.all(operations);
    let syncError = results.find((result) => result.error)?.error;

    if (!syncError && nextPlan) {
      await supabase.from("saved_meal_plans").update({ is_active: false }).eq("user_id", userId).eq("is_active", true);
      const { error } = await supabase.from("saved_meal_plans").insert({
        user_id: userId,
        name: "Adjusted personal meal plan",
        settings: { baseCalories: recalculated.calories, targetCalories, goal, diet: nextPlan.diet, excludedSources: nextPlan.excludedSources, planStyle: nextPlan.planStyle || "diverse" },
        plan_data: nextPlan.weeklyPlan,
        is_active: true,
      });
      syncError = error;
    }

    setSaving(false);
    if (syncError) return setMessage(`Your browser plan was updated, but account sync failed: ${syncError.message}`);
    setMessage(nextPlan
      ? `Updated to ${targetCalories} kcal/day. Your current plan portions and account details have been adjusted.`
      : `Weight and goal saved. Your new target is ${targetCalories} kcal/day; generate a meal plan to apply it.`);
  };

  return (
    <main className="fit-shell min-h-screen text-white">
      <HeaderNav t={t} lang={lang} toggleLang={toggleLang} isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div><p className="fit-eyebrow">Your FitTrack account</p><h1 className="fit-title-gradient mt-3 text-4xl font-black sm:text-5xl">Welcome, {firstName}</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">Your measurements, progress, and current plans now sit alongside the same FitTrack tools and navigation you use everywhere else.</p></div>
          <Link href="/auth/reset-password" className="fit-secondary-button flex min-h-11 items-center gap-2 px-4 py-3 text-sm font-bold text-green-300"><KeyRound className="h-4 w-4" /> Account security</Link>
        </section>

        <nav className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-y border-white/10 py-4 text-sm font-bold text-gray-400" aria-label="Account sections">
          <a href="#plan-settings" className="hover:text-green-300">Plan settings</a><a href="#custom-meals" className="hover:text-green-300">Custom meals</a><Link href="/personal-plan" className="hover:text-green-300">Current plan</Link><Link href="/calculator" className="hover:text-green-300">Calculator</Link><Link href="/workouts" className="hover:text-green-300">Workouts</Link>
        </nav>

        <section className="mt-8 grid items-start gap-8 lg:grid-cols-2">
          <div id="plan-settings" className="fit-surface scroll-mt-24 rounded-3xl p-5 sm:p-6">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-b border-white/10 pb-5 sm:grid-cols-4">
              <Summary label="Weight" value={latestWeight ? `${latestWeight.weight_kg} kg` : calculator?.weight ? `${calculator.weight} kg` : "—"} />
              <Summary label="Target" value={activePlan ? `${getTargetCalories(activePlan.goal, activePlan.baseCalories)} kcal` : calculator?.calories ? `${calculator.calories} kcal` : "—"} />
              <Summary label="Plan" value={activePlan ? "7 days" : "None"} />
              <Summary label="Goal" value={goal} />
            </div>
            <form onSubmit={adjustPlan} className="mt-6">
            <p className="fit-eyebrow">Update and adjust</p><h2 className="mt-2 text-2xl font-black">Recalculate your current plan</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">Enter your current weight and goal. We recalculate your calorie needs from the measurements already saved in the calculator, then resize the portions in your existing plan.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-gray-200">Current weight<div className="mt-2 flex min-h-12 items-center rounded-xl border border-white/10 bg-black/20 px-3 focus-within:border-green-400"><input type="number" min="20" max="500" step="0.1" required value={weight} onChange={(event) => setWeight(event.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" /><span className="text-xs text-gray-500">kg</span></div></label>
              <label className="text-sm font-semibold text-gray-200">Current goal<select value={goal} onChange={(event) => setGoal(event.target.value as Goal)} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-gray-950 px-3 outline-none focus:border-green-400"><option value="lose">Lose weight</option><option value="maintain">Maintain weight</option><option value="gain">Gain weight</option></select></label>
            </div>
            <div className="mt-4 rounded-2xl border border-white/5 bg-black/15 p-4 text-xs text-gray-400">
              {calculator ? <span>Using: {calculator.age ?? "—"} years · {calculator.height ?? "—"} cm · activity {calculator.activity ?? "—"} · current maintenance {calculator.calories ?? "—"} kcal</span> : <span>No calculator profile found in this browser. <Link href="/calculator" className="font-bold text-green-300">Complete the calculator →</Link></span>}
            </div>
            <button disabled={saving} className="fit-primary-button mt-5 min-h-12 w-full px-5 font-black disabled:opacity-60">{saving ? "Updating…" : activePlan ? "Update weight, goal, and plan portions" : "Save weight and new calorie target"}</button>
            {message && <p role="status" className="mt-3 rounded-xl border border-green-500/15 bg-green-500/5 p-3 text-xs text-green-200">{message}</p>}
            </form>
            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-gray-500">{email} · {unitSystem} units · {activePlan ? `${activePlan.diet} plan averaging ${planCalories || "—"} kcal/day` : "no generated plan yet"}</p>
            <Link href={activePlan ? "/personal-plan#weekly-plan" : "/personal-plan"} className="fit-secondary-button mt-5 flex min-h-11 items-center justify-between px-4 py-3 text-sm font-bold text-green-300"><span>{activePlan ? "Open current meal plan" : "Generate a meal plan"}</span><span>→</span></Link>
          </div>
          <div className="fit-surface rounded-3xl p-5 sm:p-6"><CustomMealBuilder userId={userId} /></div>
        </section>
      </div>
      <SiteFooter t={t} currentYear={new Date().getFullYear()} />
    </main>
  );
}

function Summary({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</p><p className="mt-1 truncate text-base font-black capitalize text-white">{value}</p></div>; }
