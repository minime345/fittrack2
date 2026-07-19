"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Calculator, Dumbbell, Flame, KeyRound, Salad, Scale, Sparkles, Target } from "lucide-react";
import { HeaderNav } from "@/app/personal-plan/components/HeaderNav";
import { SiteFooter } from "@/app/personal-plan/components/SiteFooter";
import { calculateTotal, getTargetCalories, scaleMeal } from "@/app/personal-plan/planLogic";
import type { DayPlan, Diet, ExcludedSource, Goal, PlanStyle } from "@/app/personal-plan/types";
import { translations, type Lang } from "@/lib/translations-plans";
import { createClient } from "@/lib/supabase/client";
import { MealPreferencePicker } from "./MealPreferencePicker";
import { dashboardCopy } from "./dashboard-copy";

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
  const [activity, setActivity] = useState<number | "">("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const t = translations[lang];
  const copy = dashboardCopy[lang];
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
        if (Number.isFinite(parsed.activity)) setActivity(Number(parsed.activity));
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
      setMessage(copy.messages.browserData);
    }
  }, [copy.messages.browserData, initialCalculator, initialPlan, latestWeight]);

  const planCalories = useMemo(() => {
    if (!activePlan?.weeklyPlan.length) return null;
    return Math.round(activePlan.weeklyPlan.reduce((sum, day) => sum + day.total.kcal, 0) / activePlan.weeklyPlan.length);
  }, [activePlan]);

  const planNutrition = useMemo(() => {
    if (!activePlan?.weeklyPlan.length) return null;
    const totals = activePlan.weeklyPlan.reduce((sum, day) => ({
      kcal: sum.kcal + day.total.kcal,
      protein: sum.protein + day.total.protein,
      carbs: sum.carbs + day.total.carbs,
      fat: sum.fat + day.total.fat,
    }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });
    const days = activePlan.weeklyPlan.length;
    return {
      kcal: Math.round(totals.kcal / days),
      protein: Math.round(totals.protein / days),
      carbs: Math.round(totals.carbs / days),
      fat: Math.round(totals.fat / days),
    };
  }, [activePlan]);

  const toggleLang = () => {
    const next = lang === "bg" ? "en" : "bg";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  const adjustPlan = async (event: FormEvent) => {
    event.preventDefault();
    const nextWeight = Number(weight);
    if (!Number.isFinite(nextWeight) || nextWeight <= 20 || nextWeight >= 500) return setMessage(copy.messages.invalidWeight);
    if (!calculator) return setMessage(copy.messages.calculatorFirst);
    const nextActivity = Number(activity);
    if (![1.2, 1.375, 1.55, 1.725, 1.9].includes(nextActivity)) return setMessage(copy.messages.selectActivity);
    const calculatorWithActivity = { ...calculator, activity: nextActivity };
    const recalculated = calculateProfile(calculatorWithActivity, nextWeight);
    if (!recalculated) return setMessage(copy.messages.incompleteProfile);

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
      ...calculatorWithActivity,
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
    if (syncError) return setMessage(`${copy.messages.syncFailed}: ${syncError.message}`);
    setMessage(nextPlan
      ? copy.messages.planUpdated(targetCalories)
      : copy.messages.targetSaved(targetCalories));
  };

  return (
    <main className="fit-shell min-h-screen text-white">
      <HeaderNav t={t} lang={lang} toggleLang={toggleLang} isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-11">
        <section className="grid items-end gap-5 sm:grid-cols-[1fr_auto]">
          <div className="min-w-0"><p className="fit-eyebrow">{copy.accountEyebrow}</p><h1 className="fit-title-gradient mt-2 text-3xl font-black sm:text-5xl">{copy.welcome}, {firstName}</h1><p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-400">{copy.intro}</p></div>
          <Link href="/auth/update-password" className="fit-secondary-button flex min-h-11 w-fit items-center gap-2 px-4 py-3 text-xs font-bold text-green-300"><KeyRound className="h-4 w-4" /> {copy.changePassword}</Link>
        </section>

        <ProgressDashboard
          weights={weights}
          goal={goal}
          targetCalories={activePlan ? getTargetCalories(activePlan.goal, activePlan.baseCalories) : calculator?.calories ? getTargetCalories(goal, calculator.calories) : null}
          proteinMin={calculator?.proteinMin || null}
          proteinMax={calculator?.proteinMax || null}
          nutrition={planNutrition}
          hasPlan={Boolean(activePlan)}
          lang={lang}
        />

        <div className="mb-4 mt-9"><p className="fit-eyebrow">{copy.personalize}</p><h2 className="mt-1 text-2xl font-black">{copy.matchTitle}</h2></div>
        <section className="grid min-w-0 items-start gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div id="plan-settings" className="fit-surface scroll-mt-24 rounded-3xl p-5 sm:p-7">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-b border-white/10 pb-5 sm:grid-cols-4">
              <Summary label={copy.summary.weight} value={latestWeight ? `${latestWeight.weight_kg} kg` : calculator?.weight ? `${calculator.weight} kg` : "—"} />
              <Summary label={copy.summary.target} value={activePlan ? `${getTargetCalories(activePlan.goal, activePlan.baseCalories)} kcal` : calculator?.calories ? `${calculator.calories} kcal` : "—"} />
              <Summary label={copy.summary.plan} value={activePlan ? copy.summary.days : copy.summary.none} />
              <Summary label={copy.summary.goal} value={copy.goals[goal]} />
            </div>
            <form onSubmit={adjustPlan} className="mt-6">
            <p className="fit-eyebrow">{copy.settingsEyebrow}</p><h2 className="mt-1 text-xl font-black sm:text-2xl">{copy.settingsTitle}</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{copy.settingsText}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-semibold text-gray-200">{copy.currentWeight}<div className="mt-2 flex min-h-12 items-center rounded-xl border border-white/10 bg-black/20 px-3 focus-within:border-green-400"><input type="number" min="20" max="500" step="0.1" required value={weight} onChange={(event) => setWeight(event.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" /><span className="text-xs text-gray-500">kg</span></div></label>
              <label className="text-sm font-semibold text-gray-200">{copy.currentGoal}<select value={goal} onChange={(event) => setGoal(event.target.value as Goal)} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-gray-950 px-3 outline-none focus:border-green-400"><option value="lose">{copy.goals.lose}</option><option value="maintain">{copy.goals.maintain}</option><option value="gain">{copy.goals.gain}</option></select></label>
              <label className="text-sm font-semibold text-gray-200">{copy.activityLevel}<select required value={activity} onChange={(event) => setActivity(Number(event.target.value))} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-gray-950 px-3 outline-none focus:border-green-400"><option value="" disabled>{copy.selectActivity}</option><option value="1.2">{copy.activities[0]}</option><option value="1.375">{copy.activities[1]}</option><option value="1.55">{copy.activities[2]}</option><option value="1.725">{copy.activities[3]}</option><option value="1.9">{copy.activities[4]}</option></select></label>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4 text-xs text-gray-500">
              {calculator ? <span>{copy.using}: {calculator.age ?? "—"} {copy.years} · {calculator.height ?? "—"} cm · {copy.activityLevel.toLowerCase()} {activity || "—"} · {copy.currentMaintenance} {calculator.calories ?? "—"} kcal</span> : <span>{copy.noCalculator} <Link href="/calculator" className="font-bold text-green-300">{copy.completeCalculator}</Link></span>}
            </div>
            <button disabled={saving} className="fit-primary-button mt-5 min-h-11 w-full px-5 text-sm font-black disabled:opacity-60">{saving ? copy.updating : activePlan ? copy.updatePlan : copy.saveTarget}</button>
            {message && <p role="status" className="mt-3 rounded-xl border border-green-500/15 bg-green-500/5 p-3 text-xs text-green-200">{message}</p>}
            </form>
          </div>
          <div className="min-w-0">
            <section id="meal-preferences" className="fit-surface min-w-0 scroll-mt-24 rounded-3xl p-5 sm:p-7"><MealPreferencePicker userId={userId} lang={lang} compact /></section>
            {activePlan
              ? <CompactPlanPreview plan={activePlan} lang={lang} />
              : <Link href="/personal-plan" className="fit-surface fit-card-interactive mt-4 flex min-h-32 items-center justify-center rounded-3xl p-6 text-center"><span><span className="block text-lg font-black">{copy.noCurrentPlan}</span><span className="mt-2 block text-sm text-green-300">{copy.generatePlan}</span></span></Link>}
          </div>
        </section>
        <HelpfulLinks lang={lang} />
      </div>
      <SiteFooter t={t} currentYear={new Date().getFullYear()} />
    </main>
  );
}

function Summary({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</p><p className="mt-1 truncate text-base font-black capitalize text-white">{value}</p></div>; }

type ProgressNutrition = { kcal: number; protein: number; carbs: number; fat: number } | null;

function ProgressDashboard({ weights, goal, targetCalories, proteinMin, proteinMax, nutrition, hasPlan, lang }: {
  weights: { weight_kg: number | string; recorded_on: string }[];
  goal: Goal;
  targetCalories: number | null;
  proteinMin: number | null;
  proteinMax: number | null;
  nutrition: ProgressNutrition;
  hasPlan: boolean;
  lang: Lang;
}) {
  const copy = dashboardCopy[lang];
  const progress = copy.progress;
  const latest = weights[0];
  const previous = weights[1];
  const change = latest && previous ? Number(latest.weight_kg) - Number(previous.weight_kg) : null;
  const chartEntries = weights.slice(0, 7).reverse();
  const chartValues = chartEntries.map((entry) => Number(entry.weight_kg));
  const minimum = chartValues.length ? Math.min(...chartValues) : 0;
  const maximum = chartValues.length ? Math.max(...chartValues) : 0;
  const range = Math.max(maximum - minimum, 1);
  const protein = nutrition?.protein || 0;
  const carbs = nutrition?.carbs || 0;
  const fat = nutrition?.fat || 0;
  const macroCalories = protein * 4 + carbs * 4 + fat * 9;
  const proteinShare = macroCalories ? (protein * 4 / macroCalories) * 100 : 34;
  const carbsShare = macroCalories ? (carbs * 4 / macroCalories) * 100 : 33;
  const ringBackground = `conic-gradient(#5c7f38 0 ${proteinShare}%, #d79a45 ${proteinShare}% ${proteinShare + carbsShare}%, #cf5c45 ${proteinShare + carbsShare}% 100%)`;
  const metrics = [
    { label: progress.currentWeight, value: latest ? `${latest.weight_kg} kg` : "—", note: change === null ? progress.firstWeighIn : `${change > 0 ? "+" : ""}${change.toFixed(1)} kg ${progress.fromPrevious}`, icon: <Scale className="h-4 w-4" /> },
    { label: progress.dailyTarget, value: targetCalories ? `${targetCalories.toLocaleString(lang === "bg" ? "bg-BG" : "en-GB")} kcal` : "—", note: hasPlan ? progress.appliedPlan : progress.completeCalculator, icon: <Flame className="h-4 w-4" /> },
    { label: progress.proteinRange, value: proteinMin ? `${proteinMin}–${proteinMax || proteinMin} g` : nutrition ? `${nutrition.protein} g` : "—", note: progress.recommended, icon: <Salad className="h-4 w-4" /> },
    { label: progress.currentGoal, value: copy.goals[goal], note: hasPlan ? progress.activePlan : progress.noActivePlan, icon: <Target className="h-4 w-4" /> },
  ];

  return <section className="fit-surface mt-7 overflow-hidden rounded-3xl">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
      <div><p className="fit-eyebrow">{progress.eyebrow}</p><h2 className="mt-1 text-xl font-black sm:text-2xl">{progress.title}</h2></div>
      <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">{progress.latest}</span>
    </div>
    <div className="grid lg:grid-cols-[0.78fr_1.35fr_0.95fr]">
      <div className="grid grid-cols-2 border-b border-white/10 lg:grid-cols-1 lg:border-b-0 lg:border-r">
        {metrics.map((metric, index) => <div key={metric.label} className={`min-w-0 p-4 sm:p-5 ${index % 2 === 0 ? "border-r border-white/10 lg:border-r-0" : ""} ${index < 2 ? "border-b border-white/10" : ""} ${index === 2 ? "lg:border-b lg:border-white/10" : ""}`}>
          <div className="flex items-center gap-2 text-green-300"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10">{metric.icon}</span><p className="truncate text-[10px] font-bold uppercase tracking-wider text-gray-500">{metric.label}</p></div>
          <p className="mt-2 truncate text-base font-black text-white sm:text-lg">{metric.value}</p>
          <p className="mt-0.5 truncate text-[9px] text-gray-500">{metric.note}</p>
        </div>)}
      </div>

      <div className="border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black text-white">{progress.weightTrend}</p><p className="mt-1 text-[10px] text-gray-500">{lang === "bg" ? `${chartEntries.length} ${progress.lastWeighIns}` : `Your last ${chartEntries.length} ${progress.lastWeighIns}`}</p></div>{latest && <p className="text-right text-lg font-black text-green-300">{latest.weight_kg}<span className="ml-1 text-[10px] text-gray-500">kg</span></p>}</div>
        {chartEntries.length ? <div className="mt-5 flex h-36 items-end gap-2 sm:gap-3" aria-label={progress.chartLabel}>
          {chartEntries.map((entry, index) => {
            const value = Number(entry.weight_kg);
            const height = 28 + ((value - minimum) / range) * 48;
            const isLatest = index === chartEntries.length - 1;
            return <div key={entry.recorded_on} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
              <span className={`text-[8px] font-bold ${isLatest ? "text-green-300" : "text-gray-500"}`}>{value}</span>
              <div className={`w-full max-w-8 rounded-t-md ${isLatest ? "bg-green-400" : "bg-green-500/15"}`} style={{ height: `${height}%` }} />
              <span className="truncate text-[8px] text-gray-500">{new Date(`${entry.recorded_on}T00:00:00`).toLocaleDateString(lang === "bg" ? "bg-BG" : "en-GB", { day: "numeric", month: "short" })}</span>
            </div>;
          })}
        </div> : <div className="mt-5 flex h-36 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 px-6 text-center text-xs text-gray-500">{progress.chartEmpty}</div>}
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-xs font-black text-white">{progress.dailyNutrition}</p><p className="mt-1 text-[10px] text-gray-500">{progress.nutritionAverage}</p>
        <div className="mt-5 flex items-center gap-5 lg:flex-col xl:flex-row">
          <div className="relative h-32 w-32 shrink-0 rounded-full" style={{ background: ringBackground }}>
            <div className="absolute inset-[17px] flex flex-col items-center justify-center rounded-full bg-gray-950/60 text-center"><span className="text-xl font-black text-white">{nutrition?.kcal?.toLocaleString(lang === "bg" ? "bg-BG" : "en-GB") || "—"}</span><span className="text-[9px] text-gray-500">{progress.perDay}</span></div>
          </div>
          <div className="min-w-0 flex-1 space-y-2.5">
            <MacroLegend color="#5c7f38" label={progress.protein} value={nutrition ? `${nutrition.protein} g` : progress.noPlan} />
            <MacroLegend color="#d79a45" label={progress.carbs} value={nutrition ? `${nutrition.carbs} g` : progress.noPlan} />
            <MacroLegend color="#cf5c45" label={progress.fat} value={nutrition ? `${nutrition.fat} g` : progress.noPlan} />
          </div>
        </div>
      </div>
    </div>
  </section>;
}

function MacroLegend({ color, label, value }: { color: string; label: string; value: string }) { return <div className="flex items-center justify-between gap-3 text-[10px]"><span className="flex items-center gap-2 text-gray-500"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />{label}</span><span className="font-black text-white">{value}</span></div>; }

function HelpfulLinks({ lang }: { lang: Lang }) {
  const copy = dashboardCopy[lang].helpful;
  const routes = ["/calculator", "/personal-plan#weekly-plan", "/workouts", "/meals", "/plans"];
  const icons = [<Calculator key="calculator" className="h-5 w-5" />, <Salad key="salad" className="h-5 w-5" />, <Dumbbell key="dumbbell" className="h-5 w-5" />, <BookOpen key="book" className="h-5 w-5" />, <Sparkles key="sparkles" className="h-5 w-5" />];
  const links = copy.links.map(([title, text, eyebrow], index) => ({ title, text, eyebrow, href: routes[index], icon: icons[index] }));
  return <section className="mt-9"><p className="fit-eyebrow">{copy.eyebrow}</p><h2 className="mt-1 text-2xl font-black">{copy.title}</h2><nav className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label={copy.aria}>{links.map((item) => <Link key={item.href} href={item.href} className="fit-surface fit-card-interactive group flex min-h-36 flex-col rounded-3xl p-5"><span className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/10 text-green-300">{item.icon}</span><ArrowRight className="h-4 w-4 text-green-400 transition group-hover:translate-x-1" /></span><span className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-green-400">{item.eyebrow}</span><span className="mt-1 text-lg font-bold text-white">{item.title}</span><span className="mt-2 text-xs leading-relaxed text-gray-500">{item.text}</span></Link>)}</nav></section>;
}

function CompactPlanPreview({ plan, lang }: { plan: StoredPlan; lang: Lang }) {
  const copy = dashboardCopy[lang].compactPlan;
  return <Link href="/personal-plan#weekly-plan" className="fit-surface fit-card-interactive mt-5 block rounded-3xl p-5 sm:p-6">
    <div className="flex items-end justify-between gap-3"><div className="min-w-0"><p className="fit-eyebrow">{copy.eyebrow}</p><h2 className="mt-1 text-xl font-black">{copy.title}</h2></div><span className="shrink-0 text-xs font-bold text-green-300">{copy.open}</span></div>
    <div className="mt-3 flex overflow-x-auto rounded-xl border border-white/5 lg:grid lg:grid-cols-7">{plan.weeklyPlan.map((day, index) => {
      const dayMeals = Object.values(day.meals).flat();
      return <div key={index} className="w-[105px] shrink-0 border-r border-white/5 bg-gray-950/55 px-3 py-2.5 last:border-r-0 lg:w-auto"><p className="text-[9px] font-bold uppercase text-green-400">{copy.day} {index + 1}</p><p className="mt-1 text-[10px] font-black text-white">{day.total.kcal} <span className="font-medium text-gray-600">kcal</span></p><p className="text-[8px] text-gray-600">{dayMeals.length} {copy.meals}</p></div>;
    })}</div>
  </Link>;
}
