"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { meals } from "@/data/meals";
import Link from "next/link";
import { motion } from "framer-motion";
import { translations, type Lang } from "@/lib/translations-plans";
import { useLang } from "@/context/LangContext";
import { Analytics } from "@vercel/analytics/react";

import type { Diet, ExcludedSource, Goal, PlanMealType, DayPlan, Meal, PlanStyle } from "./types";
import {
  getTargetCalories,
  filterByMeatType,
  calculateTotal,
  generateWeekPlan,
  generateShoppingList,
  scaleMeal,
} from "./planLogic";
import { downloadPDF } from "./pdfExport";
import { HeaderNav } from "./components/HeaderNav";
import { GoalSelector } from "./components/GoalSelector";
import { ExclusionFilter } from "./components/ExclusionFilter";
import { WeeklyTable } from "./components/WeeklyTable";
import { WeeklyCards } from "./components/WeeklyCards";
import { ShoppingListSection } from "./components/ShoppingListSection";
import { SiteFooter } from "./components/SiteFooter";
import { MealModal } from "./components/MealModal";
import { PlanOverview } from "./components/PlanOverview";
import { PlanGuide } from "./components/PlanGuide";

export default function PersonalPlanPage() {
  const searchParams = useSearchParams();
  const requestedCalories = Number(searchParams.get("calories")) || 2000;
  const [baseCalories, setBaseCalories] = useState(requestedCalories);
 const currentYear = new Date().getFullYear();
const [showShoppingList, setShowShoppingList] = useState(false);
const [lang, setLang] = useState<Lang>("bg"); // default bg
     useEffect(() => {
        const saved = localStorage.getItem("lang");
        if (saved === "en" || saved === "bg") {
          setLang(saved);
        }
      }, []);
    
      const toggleLang = () => {
        const newLang = lang === "bg" ? "en" : "bg";
        setLang(newLang);
        localStorage.setItem("lang", newLang);
      };
      const t = translations[lang] || translations.bg;

  const [goal, setGoal] = useState<Goal>("maintain");
  const [diet, setDiet] = useState<Diet>("all");
  const [planStyle, setPlanStyle] = useState<PlanStyle>("diverse");
  const [excludedSources, setExcludedSources] = useState<ExcludedSource[]>([]);
  const [swapHistory, setSwapHistory] = useState<Record<string, string[]>>({});
  const [showExcludedOptions, setShowExcludedOptions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Новите стейтове за модалния прозорец
  const [showModal, setShowModal] = useState(false);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ dayIndex: number; mealType: PlanMealType } | null>(null);

  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);
  const [planStorageReady, setPlanStorageReady] = useState(false);
  const [generatedSettings, setGeneratedSettings] = useState<{
    baseCalories: number;
    goal: Goal;
    diet: Diet;
    excludedSources: ExcludedSource[];
    planStyle: PlanStyle;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fittrack-active-plan-v2");
      if (raw) {
        const saved = JSON.parse(raw) as {
          baseCalories: number;
          goal: Goal;
          diet: Diet;
          excludedSources: ExcludedSource[];
          planStyle?: PlanStyle;
          weeklyPlan: DayPlan[];
          swapHistory?: Record<string, string[]>;
        };
        if (Array.isArray(saved.weeklyPlan) && saved.weeklyPlan.length === 7) {
          if (!searchParams.has("calories")) setBaseCalories(saved.baseCalories);
          setGoal(saved.goal);
          setDiet(saved.diet);
          setPlanStyle(saved.planStyle || "diverse");
          setExcludedSources(saved.excludedSources || []);
          setWeeklyPlan(saved.weeklyPlan);
          setSwapHistory(saved.swapHistory || {});
          setGeneratedSettings({
            baseCalories: saved.baseCalories,
            goal: saved.goal,
            diet: saved.diet,
            excludedSources: saved.excludedSources || [],
            planStyle: saved.planStyle || "diverse",
          });
        }
      }
    } catch {
      localStorage.removeItem("fittrack-active-plan-v2");
    } finally {
      setPlanStorageReady(true);
    }
  }, [searchParams]);

  const goalLabels: Record<Goal, string> = {
    maintain: t.Main.maintain,
    lose: t.Main.lose,
    gain: t.Main.gain,
  };

const dietLabels: Record<Diet, string> = t.Main.diet;
  const dietIcons: Record<Diet, string> = {
    all: "🍽️",
    balanced: "⚖️",
    "high-protein": "🍗",
    keto: "🥑",
    vegan: "🌱",
    vegetarian: "🥦",
  };
  const mealTypeIcons: Record<PlanMealType, string> = {
    breakfast: "🌅",
    lunch: "☀️",
    dinner: "🌙",
    snack: "🍎",
  };
  const mealTypeLabels: Record<PlanMealType, string> = {
    breakfast: t.Main.breakfast,
    lunch: t.Main.lunch,
    dinner: t.Main.dinner,
    snack: t.Main.snack,
  };
  const sourceOptions: { source: ExcludedSource; label: string }[] = [
    { source: "chicken", label: t.Main.meatOptions.noChicken },
    { source: "beef", label: t.Main.meatOptions.noBeef },
    { source: "pork", label: t.Main.meatOptions.noPork },
    { source: "fish", label: t.Main.meatOptions.noFish },
    { source: "supplement", label: t.Main.meatOptions.noSupplements },
    { source: "vegan", label: t.Main.meatOptions.noVegan },
    { source: "egg", label: t.Main.meatOptions.noEgg },
    { source: "dairy", label: t.Main.meatOptions.noDairy },
  ];

  const proteinMin = parseInt(searchParams.get("proteinMin") || "100", 10);
  const proteinMax = parseInt(searchParams.get("proteinMax") || "150", 10);

  // Филтриране по месо
  const filterMeatFromPool = (mealsList: typeof meals): typeof meals => filterByMeatType(mealsList, excludedSources);

useEffect(() => {
  if (showModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [showModal]);
const regeneratePlan = () => {
  const dailyCalories = getTargetCalories(goal, baseCalories);

  // Филтриране по диета
  let filtered = diet === "all" ? meals : meals.filter((m) => m.categories.includes(diet));
  // Филтриране по месо
  filtered = filterMeatFromPool(filtered);

  // Генериране на 7-дневен план
  const weekPlan = generateWeekPlan(filtered, dailyCalories, planStyle);

  setWeeklyPlan(weekPlan);
  setSwapHistory({});
  setGeneratedSettings({ baseCalories, goal, diet, excludedSources: [...excludedSources], planStyle });
};

useEffect(() => {
  if (!planStorageReady) return;
  const settingsChanged = !generatedSettings ||
    generatedSettings.baseCalories !== baseCalories ||
    generatedSettings.goal !== goal ||
    generatedSettings.diet !== diet ||
    generatedSettings.planStyle !== planStyle ||
    JSON.stringify([...generatedSettings.excludedSources].sort()) !== JSON.stringify([...excludedSources].sort());

  if (weeklyPlan.length !== 7 || settingsChanged) regeneratePlan();
  // Regenerate only when inputs change; the saved plan is reused after navigation.
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [planStorageReady, baseCalories, goal, diet, planStyle, excludedSources, generatedSettings]);

useEffect(() => {
  if (!planStorageReady || weeklyPlan.length !== 7 || !generatedSettings) return;
  localStorage.setItem("fittrack-active-plan-v2", JSON.stringify({
    ...generatedSettings,
    weeklyPlan,
    swapHistory,
  }));
}, [weeklyPlan, swapHistory, generatedSettings, planStorageReady]);

const replaceMeal = (dayIndex: number, mealType: PlanMealType, oldSlug: string) => {
  const target = generatedSettings
    ? getTargetCalories(generatedSettings.goal, generatedSettings.baseCalories)
    : getTargetCalories(goal, baseCalories);
  const day = weeklyPlan[dayIndex];
  const oldMeal = day?.meals[mealType].find((meal) => meal.slug === oldSlug);
  if (!day || !oldMeal) return;
  const portionCount = day.meals[mealType].filter((meal) => meal.slug === oldSlug).length;
  let pool = diet === "all" ? meals : meals.filter((meal) => meal.categories.includes(diet));
  pool = filterMeatFromPool(pool);
  const used = new Set(Object.values(day.meals).flat().map((meal) => meal.slug));
  const slotKey = `${dayIndex}-${mealType}`;
  const alreadyShown = new Set(swapHistory[slotKey] || []);
  const allAlternatives = pool.filter((meal) =>
    meal.mealType.includes(mealType) && meal.slug !== oldSlug && !used.has(meal.slug)
  );
  const unseenAlternatives = allAlternatives.filter((meal) => !alreadyShown.has(meal.slug));
  const candidates = unseenAlternatives.length ? unseenAlternatives : allAlternatives;
  if (!candidates.length) return;

  const caloriesWithoutOld = day.total.kcal - oldMeal.kcal * portionCount;
  // Preserve the calorie role of the slot. Matching only the old weight can
  // drastically reduce calories when the replacement is less calorie-dense.
  const preservePortion = (candidate: Meal) =>
    scaleMeal(candidate, oldMeal.kcal / candidate.kcal);
  const closestChoices = [...candidates]
    .sort((a, b) => {
      const scaledA = preservePortion(a);
      const scaledB = preservePortion(b);
      return Math.abs(caloriesWithoutOld + scaledA.kcal * portionCount - target)
        - Math.abs(caloriesWithoutOld + scaledB.kcal * portionCount - target);
    })
    .slice(0, Math.min(3, candidates.length));
  const replacement = preservePortion(closestChoices[Math.floor(Math.random() * closestChoices.length)]);

  // Replace every serving of the old meal with the new one, so a double
  // portion stays a double portion of the newly-swapped meal.
  const updatedMeals = {
    ...day.meals,
    [mealType]: day.meals[mealType].map((meal) => (meal.slug === oldSlug ? replacement : meal)),
  };

  setWeeklyPlan((currentPlan) => currentPlan.map((currentDay, index) =>
    index === dayIndex ? { meals: updatedMeals, total: calculateTotal(updatedMeals) } : currentDay
  ));
  setSwapHistory((history) => ({
    ...history,
    [slotKey]: unseenAlternatives.length ? [...(history[slotKey] || []), oldSlug] : [oldSlug],
  }));
};

const handleDownloadPDF = () => {
  downloadPDF({
    t,
    weeklyPlan,
    goal: generatedSettings?.goal ?? goal,
    goalLabels,
    diet: generatedSettings?.diet ?? diet,
    dietLabels,
    lang,
  });
};

const toggleShoppingList = () => {
  const nextValue = !showShoppingList;
  setShowShoppingList(nextValue);
  if (nextValue) {
    window.setTimeout(() => document.getElementById("shopping-list")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }
};

const openMeal = (dayIndex: number, mealType: PlanMealType, meal: Meal) => {
  setSelectedMeal(meal);
  setSelectedLocation({ dayIndex, mealType });
  setShowModal(true);
};

const changeMealWeight = (weight: number) => {
  if (!selectedMeal || !selectedLocation || !Number.isFinite(weight) || weight < 50) return;
  const baseWeight = selectedMeal.weight / (selectedMeal.portionMultiplier || 1);
  const updatedMeal = scaleMeal(selectedMeal, weight / baseWeight);
  const { dayIndex, mealType } = selectedLocation;
  setSelectedMeal(updatedMeal);
  setWeeklyPlan((currentPlan) => currentPlan.map((day, index) => {
    if (index !== dayIndex) return day;
    const updatedMeals = {
      ...day.meals,
      [mealType]: day.meals[mealType].map((meal) => meal.slug === selectedMeal.slug ? updatedMeal : meal),
    };
    return { meals: updatedMeals, total: calculateTotal(updatedMeals) };
  }));
};

  return (
      <main className="fit-shell min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-sans">
       <HeaderNav t={t} lang={lang} toggleLang={toggleLang} isOpen={isOpen} setIsOpen={setIsOpen} />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
  <PlanOverview
    t={t} lang={lang} baseCalories={baseCalories} proteinMin={proteinMin} proteinMax={proteinMax}
    goal={goal} setGoal={setGoal} goalLabels={goalLabels} diet={diet} setDiet={setDiet}
    planStyle={planStyle} setPlanStyle={setPlanStyle}
    dietLabels={dietLabels} dietIcons={dietIcons} excludedSources={excludedSources}
    setExcludedSources={setExcludedSources} sourceOptions={sourceOptions}
    showExcludedOptions={showExcludedOptions} setShowExcludedOptions={setShowExcludedOptions}
  />
  <PlanGuide lang={lang} hasCalculatedTarget={searchParams.has("calories")} />
  <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-green-500/15 bg-green-500/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm font-semibold text-green-300">
        {lang === "bg" ? "Този план е запазен в браузъра" : "This plan is saved in your browser"}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-gray-400">
        {lang === "bg"
          ? "Обновява се при нови калории, цел, режим, стил или изключени храни. Навигацията в сайта не го променя."
          : "It updates for new calories, goal, diet, style, or exclusions. Navigating the site does not change it."}
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-300">
        ✓ {lang === "bg" ? "Автоматично запазване" : "Autosaved"}
      </span>
      <button
        type="button"
        onClick={regeneratePlan}
        className="fit-secondary-button rounded-xl border border-green-500/30 px-3 py-2 text-xs font-semibold text-green-200"
      >
        ↻ {lang === "bg" ? "Обнови целия план" : "Refresh entire plan"}
      </button>
    </div>
  </div>
  <div className="hidden">
  <motion.h1
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="fit-title-gradient text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-7"
  >
    {t.Main.heading}
  </motion.h1>

  {baseCalories === 2000 && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-center mb-4"
    >
      <p className="text-yellow-400 text-sm">{t.Main.warning}</p>
      <Link href="/calculator">
        <button className="mt-2 bg-green-500 text-black font-semibold px-4 py-1 rounded-lg hover:bg-green-400 transition text-sm">
          {t.Main.calculateButton}
        </button>
      </Link>
    </motion.div>
  )}

  <div className="fit-surface bg-gray-800/80 px-5 py-4 rounded-2xl shadow-md text-white border border-green-500/40 text-base sm:text-lg w-full sm:max-w-md mx-auto">
  <div className="flex justify-between items-center">
    <span className="text-green-400 font-semibold">
      {t.Main.calculateButton} {goalLabels[goal]}:
    </span>
    <span>{getTargetCalories(goal, baseCalories)} kcal</span>
  </div>
  <div className="flex justify-between items-center border-t border-gray-700 mt-2 pt-2">
     <span className="text-green-400 font-semibold">{t.Main.proteinLabel}:</span>
    <span>{proteinMin} – {proteinMax} g</span>
  </div>
</div>

  <div className="mb-6">
    <label className="mb-2 block text-sm text-gray-200">{t.Main.dietLabel}</label>
    <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
      {(Object.entries(dietLabels) as [Diet, string][]).map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => setDiet(key)}
          aria-pressed={diet === key}
          className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
            diet === key
              ? "border-green-400 bg-green-500/10 text-green-300"
              : "border-white/10 bg-gray-800 text-gray-200 hover:border-green-400/50 hover:bg-gray-700"
          }`}
        >
          <span className="text-lg">{dietIcons[key]}</span>
          {label}
        </button>
      ))}
    </div>
  </div>

  <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center mb-10 text-sm">
          <GoalSelector t={t} goal={goal} goalLabels={goalLabels} setGoal={setGoal} />

          <ExclusionFilter
            t={t}
            excludedSources={excludedSources}
            setExcludedSources={setExcludedSources}
            sourceOptions={sourceOptions}
            showExcludedOptions={showExcludedOptions}
            setShowExcludedOptions={setShowExcludedOptions}
          />

<div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/40 rounded-xl p-3 text-xs sm:text-sm text-gray-200 shadow-inner mb-6">
      <h2 className="text-green-400 text-base font-semibold mb-1 flex items-center gap-2">
        {t.Main.infoHeading}
      </h2>
      <ul className="space-y-0.5 list-disc list-inside text-gray-300">
        {t.Main.infoItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  </div>




      {/* --- Десктоп: таблица с разграфяване --- */}
  </div>
  <div id="weekly-plan" className="mb-3 flex flex-wrap items-center justify-between gap-2">
    <h2 className="text-lg font-bold text-white sm:text-xl">
      {lang === "bg" ? "Твоят седмичен план" : "Your weekly plan"}
    </h2>
    <div className="flex flex-wrap gap-2 text-[11px] text-gray-400">
      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
        {lang === "bg" ? "Натисни ястие за рецепта и порция" : "Select a meal for its recipe and portion"}
      </span>
      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
        ↻ {lang === "bg" ? "сменя ястието" : "replaces the meal"}
      </span>
    </div>
  </div>
  <WeeklyTable
    t={t}
    lang={lang}
    weeklyPlan={weeklyPlan}
    mealTypeIcons={mealTypeIcons}
    openMeal={openMeal}
    replaceMeal={replaceMeal}
  />

{/* --- Мобилна версия: карти по дни --- */}
<WeeklyCards
  t={t}
  lang={lang}
  weeklyPlan={weeklyPlan}
  mealTypeIcons={mealTypeIcons}
  mealTypeLabels={mealTypeLabels}
  openMeal={openMeal}
  replaceMeal={replaceMeal}
/>

</section>

{/* Бутоните долу */} 
<footer id="plan-actions" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 gap-3 sm:grid-cols-2"> 
  <button onClick={handleDownloadPDF} 
  className="fit-primary-button w-full rounded-xl bg-green-600 px-6 py-3 text-left text-white shadow transition-colors hover:bg-green-700" >
     <span className="block font-semibold">{t.Main.downloadPdf}</span>
     <span className="mt-0.5 block text-xs font-normal text-green-100/75">{lang === "bg" ? "Запази текущия план и рецептите" : "Save the current plan and recipes"}</span>
     </button> <button onClick={toggleShoppingList}
      className="fit-secondary-button w-full rounded-xl border border-green-500/30 px-6 py-3 text-left text-white transition-colors" >
         <span className="block font-semibold">{t.Main.shoppingListBtn}</span>
         <span className="mt-0.5 block text-xs font-normal text-gray-400">{lang === "bg" ? "Количества за всички избрани порции" : "Quantities for all selected portions"}</span>
         </button> 
         </footer>
         <ShoppingListSection
           t={t}
           lang={lang}
           show={showShoppingList}
           items={generateShoppingList(weeklyPlan, lang)}
           onClose={() => setShowShoppingList(false)}
         />

      {/* Footer секция */}
{/* Footer */}
      <SiteFooter t={t} currentYear={currentYear} />
      <MealModal t={t} lang={lang} showModal={showModal} selectedMeal={selectedMeal} setShowModal={setShowModal} onWeightChange={changeMealWeight} />
 
      <Analytics />
    </main>
  );
}
