"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Calculator, Dumbbell, KeyRound, Salad, Sparkles } from "lucide-react";
import { HeaderNav } from "@/app/personal-plan/components/HeaderNav";
import { SiteFooter } from "@/app/personal-plan/components/SiteFooter";
import { calculateTotal, getTargetCalories, scaleMeal } from "@/app/personal-plan/planLogic";
import type { DayPlan, Diet, ExcludedSource, Goal, PlanStyle } from "@/app/personal-plan/types";
import { translations, type Lang } from "@/lib/translations-plans";
import { createClient } from "@/lib/supabase/client";
import { MealPreferencePicker } from "./MealPreferencePicker";

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
  firstName: string;
  profileGoal: Goal | null;
  weights: { weight_kg: number | string; recorded_on: string }[];
  initialCalculator: CalculatorProfile | null;
  initialPlan: StoredPlan | null;
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

export function AccountDashboardClient({ userId, firstName, profileGoal, weights, initialCalculator, initialPlan }: Props) {
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
      if (initialCalculator || calculatorRaw) {
        const parsed = initialCalculator || JSON.parse(calculatorRaw!) as CalculatorProfile;
        setCalculator(parsed);
        localStorage.setItem("fittrack-calculator-profile-v1", JSON.stringify(parsed));
        if (Number.isFinite(parsed.weight)) setWeight(String(parsed.weight));
      } else if (latestWeight) setWeight(String(latestWeight.weight_kg));
      const planRaw = localStorage.getItem("fittrack-active-plan-v2");
      if (initialPlan || planRaw) {
        const parsed = initialPlan || JSON.parse(planRaw!) as StoredPlan;
        if (Array.isArray(parsed.weeklyPlan) && parsed.weeklyPlan.length === 7) {
          setActivePlan(parsed);
          setGoal(parsed.goal);
          localStorage.setItem("fittrack-active-plan-v2", JSON.stringify(parsed));
        }
      }
    } catch {
      setMessage("Some saved browser data could not be read. Open the calculator or meal plan to refresh it.");
    }
  }, [initialCalculator, initialPlan, latestWeight]);

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
      <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-11">
        <section className="grid items-end gap-5 sm:grid-cols-[1fr_auto]">
          <div className="min-w-0"><p className="fit-eyebrow">Your FitTrack account</p><h1 className="fit-title-gradient mt-2 text-3xl font-black sm:text-5xl">Welcome, {firstName}</h1><p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-400">See how you are progressing, update your goal, and keep your nutrition plan aligned with your current needs.</p></div>
          <Link href="/auth/update-password" className="fit-secondary-button flex min-h-11 w-fit items-center gap-2 px-4 py-3 text-xs font-bold text-green-300"><KeyRound className="h-4 w-4" /> Change password</Link>
        </section>

        <section className="mt-7 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <ProgressCard weights={weights} featured />
          <div className="grid grid-cols-2 gap-3">
            <OverviewStat label="Current target" value={activePlan ? `${getTargetCalories(activePlan.goal, activePlan.baseCalories)}` : calculator?.calories ? `${calculator.calories}` : "—"} suffix="kcal" />
            <OverviewStat label="Goal" value={goal} />
            <OverviewStat label="Plan" value={activePlan ? "7 days" : "None"} />
            <OverviewStat label="Meal choices" value="Editable" />
          </div>
        </section>

        <div className="mb-4 mt-9"><p className="fit-eyebrow">Personalize</p><h2 className="mt-1 text-2xl font-black">Keep your plan matched to you</h2></div>
        <section className="grid min-w-0 items-start gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div id="plan-settings" className="fit-surface scroll-mt-24 rounded-3xl p-5 sm:p-7">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-b border-white/10 pb-5 sm:grid-cols-4">
              <Summary label="Weight" value={latestWeight ? `${latestWeight.weight_kg} kg` : calculator?.weight ? `${calculator.weight} kg` : "—"} />
              <Summary label="Target" value={activePlan ? `${getTargetCalories(activePlan.goal, activePlan.baseCalories)} kcal` : calculator?.calories ? `${calculator.calories} kcal` : "—"} />
              <Summary label="Plan" value={activePlan ? "7 days" : "None"} />
              <Summary label="Goal" value={goal} />
            </div>
            <form onSubmit={adjustPlan} className="mt-6">
            <p className="fit-eyebrow">Plan settings</p><h2 className="mt-1 text-xl font-black sm:text-2xl">Update weight and goal</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">Your calories and existing portions update automatically.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-gray-200">Current weight<div className="mt-2 flex min-h-12 items-center rounded-xl border border-white/10 bg-black/20 px-3 focus-within:border-green-400"><input type="number" min="20" max="500" step="0.1" required value={weight} onChange={(event) => setWeight(event.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" /><span className="text-xs text-gray-500">kg</span></div></label>
              <label className="text-sm font-semibold text-gray-200">Current goal<select value={goal} onChange={(event) => setGoal(event.target.value as Goal)} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-gray-950 px-3 outline-none focus:border-green-400"><option value="lose">Lose weight</option><option value="maintain">Maintain weight</option><option value="gain">Gain weight</option></select></label>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4 text-xs text-gray-500">
              {calculator ? <span>Using: {calculator.age ?? "—"} years · {calculator.height ?? "—"} cm · activity {calculator.activity ?? "—"} · current maintenance {calculator.calories ?? "—"} kcal</span> : <span>No calculator profile found in this browser. <Link href="/calculator" className="font-bold text-green-300">Complete the calculator →</Link></span>}
            </div>
            <button disabled={saving} className="fit-primary-button mt-5 min-h-11 w-full px-5 text-sm font-black disabled:opacity-60">{saving ? "Updating…" : activePlan ? "Update my plan" : "Save new target"}</button>
            {message && <p role="status" className="mt-3 rounded-xl border border-green-500/15 bg-green-500/5 p-3 text-xs text-green-200">{message}</p>}
            </form>
          </div>
          <div className="min-w-0">
            <section id="meal-preferences" className="fit-surface min-w-0 scroll-mt-24 rounded-3xl p-5 sm:p-7"><MealPreferencePicker userId={userId} compact /></section>
            {activePlan
              ? <CompactPlanPreview plan={activePlan} />
              : <Link href="/personal-plan" className="fit-surface fit-card-interactive mt-4 flex min-h-32 items-center justify-center rounded-3xl p-6 text-center"><span><span className="block text-lg font-black">No current meal plan</span><span className="mt-2 block text-sm text-green-300">Generate your plan →</span></span></Link>}
          </div>
        </section>
        <HelpfulLinks />
      </div>
      <SiteFooter t={t} currentYear={new Date().getFullYear()} />
    </main>
  );
}

function Summary({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</p><p className="mt-1 truncate text-base font-black capitalize text-white">{value}</p></div>; }

function ProgressCard({ weights, featured = false }: { weights: { weight_kg: number | string; recorded_on: string }[]; featured?: boolean }) {
  const latest = weights[0];
  const previous = weights[1];
  const change = latest && previous ? Number(latest.weight_kg) - Number(previous.weight_kg) : null;
  return <section className={`${featured ? "fit-surface rounded-3xl" : ""} p-5 sm:p-6`}><p className="fit-eyebrow">Your progress</p><div className="mt-2 flex items-end justify-between gap-4"><div><h2 className="text-xl font-black sm:text-2xl">Weight history</h2><p className="mt-1 text-xs text-gray-500">Your most recent weigh-ins</p></div><div className="text-right"><p className="text-2xl font-black text-green-300">{latest ? `${latest.weight_kg} kg` : "—"}</p>{change !== null && <p className="text-[10px] text-gray-500">{change > 0 ? "+" : ""}{change.toFixed(1)} kg since last entry</p>}</div></div>{weights.length ? <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{weights.slice(0, 4).map((entry, index) => <div key={entry.recorded_on} className={`rounded-xl p-3 ${index === 0 ? "bg-green-500/10" : "bg-black/15"}`}><p className="text-[10px] text-gray-500">{new Date(`${entry.recorded_on}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p><p className="mt-1 text-sm font-black text-gray-200">{entry.weight_kg} kg</p></div>)}</div> : <p className="mt-4 text-xs text-gray-500">Update your weight below to start tracking progress.</p>}</section>;
}

function OverviewStat({ label, value, suffix }: { label: string; value: string; suffix?: string }) { return <article className="fit-surface min-w-0 rounded-2xl p-4"><p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">{label}</p><p className="mt-2 truncate text-lg font-black capitalize text-white">{value}{suffix && value !== "—" ? <span className="ml-1 text-[10px] text-gray-500">{suffix}</span> : null}</p></article>; }

function HelpfulLinks() {
  const links = [
    { title: "Calculator", text: "Update body details and calorie needs", href: "/calculator", eyebrow: "Your details", icon: <Calculator className="h-5 w-5" /> },
    { title: "Full meal plan", text: "View portions, recipes, and shopping list", href: "/personal-plan#weekly-plan", eyebrow: "Nutrition", icon: <Salad className="h-5 w-5" /> },
    { title: "Workout programs", text: "Find training matched to your preferences", href: "/workouts", eyebrow: "Training", icon: <Dumbbell className="h-5 w-5" /> },
    { title: "Recipe library", text: "Browse all available meals", href: "/meals", eyebrow: "Recipes", icon: <BookOpen className="h-5 w-5" /> },
    { title: "Nutrition guides", text: "Compare popular eating approaches", href: "/plans", eyebrow: "Guides", icon: <Sparkles className="h-5 w-5" /> },
  ];
  return <section className="mt-9"><p className="fit-eyebrow">Your FitTrack</p><h2 className="mt-1 text-2xl font-black">Tools and resources</h2><nav className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="FitTrack tools">{links.map((item) => <Link key={item.href} href={item.href} className="fit-surface fit-card-interactive group flex min-h-36 flex-col rounded-3xl p-5"><span className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/10 text-green-300">{item.icon}</span><ArrowRight className="h-4 w-4 text-green-400 transition group-hover:translate-x-1" /></span><span className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-green-400">{item.eyebrow}</span><span className="mt-1 text-lg font-bold text-white">{item.title}</span><span className="mt-2 text-xs leading-relaxed text-gray-500">{item.text}</span></Link>)}</nav></section>;
}

function CompactPlanPreview({ plan }: { plan: StoredPlan }) {
  return <Link href="/personal-plan#weekly-plan" className="fit-surface fit-card-interactive mt-5 block rounded-3xl p-5 sm:p-6">
    <div className="flex items-end justify-between gap-3"><div className="min-w-0"><p className="fit-eyebrow">Current plan</p><h2 className="mt-1 text-xl font-black">Seven-day overview</h2></div><span className="shrink-0 text-xs font-bold text-green-300">Open →</span></div>
    <div className="mt-3 flex overflow-x-auto rounded-xl border border-white/5 lg:grid lg:grid-cols-7">{plan.weeklyPlan.map((day, index) => {
      const dayMeals = Object.values(day.meals).flat();
      return <div key={index} className="w-[105px] shrink-0 border-r border-white/5 bg-gray-950/55 px-3 py-2.5 last:border-r-0 lg:w-auto"><p className="text-[9px] font-bold uppercase text-green-400">Day {index + 1}</p><p className="mt-1 text-[10px] font-black text-white">{day.total.kcal} <span className="font-medium text-gray-600">kcal</span></p><p className="text-[8px] text-gray-600">{dayMeals.length} meals</p></div>;
    })}</div>
  </Link>;
}
