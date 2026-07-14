"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { meals } from "@/data/meals";
import Link from "next/link";
import { motion } from "framer-motion";
import { translations, type Lang } from "@/lib/translations-plans";
import { useLang } from "@/context/LangContext";
import { Analytics } from "@vercel/analytics/react";

import type { Diet, ExcludedSource, Goal, PlanMealType, DayPlan } from "./types";
import {
  getTargetCalories,
  filterByMeatType,
  calculateTotal,
  generateDayPlan,
  generateShoppingList,
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

export default function PersonalPlanPage() {
  const searchParams = useSearchParams();
  const baseCalories = Number(searchParams.get("calories")) || 2000;
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
  const [excludedSources, setExcludedSources] = useState<ExcludedSource[]>([]);
  const [swapHistory, setSwapHistory] = useState<Record<string, string[]>>({});
  const [showExcludedOptions, setShowExcludedOptions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Новите стейтове за модалния прозорец
  const [showModal, setShowModal] = useState(false);

  const [selectedMeal, setSelectedMeal] = useState<typeof meals[0] | null>(null);

  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);

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
  useEffect(() => {
  const dailyCalories = getTargetCalories(goal, baseCalories);

  // Филтриране по диета
  let filtered = diet === "all" ? meals : meals.filter((m) => m.categories.includes(diet));
  // Филтриране по месо
  filtered = filterMeatFromPool(filtered);

  // Генериране на 7-дневен план
  const weekPlan = Array.from({ length: 7 }, () =>
    generateDayPlan(filtered, dailyCalories)
  );

  setWeeklyPlan(weekPlan);
}, [baseCalories, goal, diet, excludedSources]);

const replaceMeal = (dayIndex: number, mealType: PlanMealType, oldSlug: string) => {
  const target = getTargetCalories(goal, baseCalories);
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
  const closestChoices = [...candidates]
    .sort((a, b) =>
      Math.abs(caloriesWithoutOld + a.kcal * portionCount - target) - Math.abs(caloriesWithoutOld + b.kcal * portionCount - target)
    )
    .slice(0, Math.min(3, candidates.length));
  const replacement = closestChoices[Math.floor(Math.random() * closestChoices.length)];

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
  downloadPDF({ t, weeklyPlan, goal, goalLabels, diet, dietLabels, lang });
};

  return (
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-sans">
       <HeaderNav t={t} lang={lang} toggleLang={toggleLang} isOpen={isOpen} setIsOpen={setIsOpen} />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
  <motion.h1
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300 text-center mb-6"
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

  <div className="bg-gray-800 px-4 py-3 rounded-lg shadow-md text-white border border-green-500 text-base sm:text-lg w-full sm:max-w-md mx-auto">
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
  <WeeklyTable
    t={t}
    lang={lang}
    weeklyPlan={weeklyPlan}
    mealTypeIcons={mealTypeIcons}
    setSelectedMeal={setSelectedMeal}
    setShowModal={setShowModal}
    replaceMeal={replaceMeal}
  />

{/* --- Мобилна версия: карти по дни --- */}
<WeeklyCards
  t={t}
  lang={lang}
  weeklyPlan={weeklyPlan}
  mealTypeIcons={mealTypeIcons}
  mealTypeLabels={mealTypeLabels}
  setSelectedMeal={setSelectedMeal}
  setShowModal={setShowModal}
  replaceMeal={replaceMeal}
/>

</section>

{/* Бутоните долу */} 
<footer className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4 items-center"> 
  <button onClick={handleDownloadPDF} 
  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded shadow transition-colors w-full sm:w-auto" >
     {t.Main.downloadPdf} 
     </button> <button onClick={() => setShowShoppingList(!showShoppingList)}
      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded shadow transition-colors w-full sm:w-auto" >
         {t.Main.shoppingListBtn} 
         </button> 
         </footer>
         <ShoppingListSection t={t} show={showShoppingList} items={generateShoppingList(weeklyPlan, lang)} />

      {/* Footer секция */}
{/* Footer */}
      <SiteFooter t={t} currentYear={currentYear} />
      <MealModal t={t} lang={lang} showModal={showModal} selectedMeal={selectedMeal} setShowModal={setShowModal} />
 
      <Analytics />
    </main>
  );
}
