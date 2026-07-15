"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { meals, type Meal } from "@/data/meals";
import { mealDetails } from "@/data/meal-details";
import { generatedMealRecipeSteps } from "@/data/meal-recipe-steps";
import { translations } from "@/lib/translations";
import { useLang } from "@/context/LangContext";
import { scaleMeal } from "@/app/personal-plan/planLogic";
import { SiteNavLink } from "@/components/SiteNavLink";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="fit-logo-mark w-10 h-10 bg-gradient-to-tr from-green-400 to-lime-500 rounded-xl flex items-center justify-center text-black font-bold text-lg shadow-md">F</div>
      <span className="text-xl md:text-2xl font-bold tracking-wide text-white">FitTrack</span>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return <SiteNavLink href={href} label={label} />;
}

export function MealDetailPage({ slug }: { slug: string }) {
  const baseMeal = meals.find((meal) => meal.slug === slug)! as Meal;
  const router = useRouter();
  const detail = mealDetails[slug];
  const [weight, setWeight] = useState(baseMeal.weight);
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useLang();
  const t = translations[lang] || translations.bg;
  const meal = useMemo(() => scaleMeal(baseMeal, weight / baseMeal.weight), [baseMeal, weight]);

  useEffect(() => {
    if (baseMeal.fixedPortion) return;
    const requested = Number(new URLSearchParams(window.location.search).get("portion"));
    if (Number.isFinite(requested) && requested >= 50) setWeight(Math.round(requested / 50) * 50);
  }, [baseMeal]);

  const changeWeight = (nextWeight: number) => {
    if (!Number.isFinite(nextWeight) || nextWeight < 50 || baseMeal.fixedPortion) return;
    const rounded = Math.round(nextWeight / 50) * 50;
    setWeight(rounded);
    const url = new URL(window.location.href);
    url.searchParams.set("portion", String(rounded));
    window.history.replaceState({}, "", url);
  };

  const toggleLang = () => {
    const next = lang === "bg" ? "en" : "bg";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  return (
    <main className="fit-shell min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-sans">
      <header className="fit-header sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-5 lg:gap-7">
              <NavLink href="/" label={t.nav.home} />
              <NavLink href="/calculator" label={t.nav.calculator} />
              <NavLink href="/personal-plan" label={t.nav.personal} />
              <NavLink href="/plans" label={t.nav.plans} />
              <NavLink href="/workouts" label={t.nav.workouts} />
              <NavLink href="/meals" label={t.nav.meals} />
            </nav>
            <button onClick={toggleLang} aria-label="Switch language" className="fit-language px-3 py-1.5 border border-green-400/70 text-green-400 rounded-lg hover:bg-green-500 hover:text-black transition text-sm font-medium">
              {lang === "bg" ? "BG" : "EN"}
            </button>
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu"><Menu className="w-6 h-6 text-white" /></button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden bg-black/80 px-6 pb-4">
            <div className="flex flex-col gap-4">
              <NavLink href="/" label={t.nav.home} />
              <NavLink href="/calculator" label={t.nav.calculator} />
              <NavLink href="/personal-plan" label={t.nav.personal} />
              <NavLink href="/plans" label={t.nav.plans} />
              <NavLink href="/workouts" label={t.nav.workouts} />
              <NavLink href="/meals" label={t.nav.meals} />
            </div>
          </div>
        )}
      </header>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-green-500/50 bg-gray-900/60 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500 hover:text-black"
        >
          <span aria-hidden="true">←</span>
          {lang === "bg" ? "Обратно към личния план" : "Back to personal plan"}
        </button>
        <div className="flex items-center gap-4 mb-8">
          <span className="text-6xl">{detail?.icon || baseMeal.icon}</span>
          <h1 className="fit-title-gradient text-4xl sm:text-5xl font-extrabold tracking-tight">{detail?.name[lang] || baseMeal.name[lang]}</h1>
        </div>

        <div className="fit-surface grid grid-cols-2 sm:grid-cols-3 gap-6 bg-gray-800 p-6 rounded-3xl mb-10 text-center">
          <div><div className="text-3xl font-bold text-green-400">{meal.kcal}</div><div className="text-sm text-gray-300">{t.meals.cal}</div></div>
          <div><div className="text-3xl font-bold text-green-400">{meal.protein} g</div><div className="text-sm text-gray-300">{t.meals.prot}</div></div>
          <div><div className="text-3xl font-bold text-green-400">{meal.carbs} g</div><div className="text-sm text-gray-300">{t.meals.carb}</div></div>
          <div><div className="text-3xl font-bold text-green-400">{meal.fat} g</div><div className="text-sm text-gray-300">{t.meals.fat}</div></div>
          <div>
            {baseMeal.fixedPortion ? (
              <div className="text-3xl font-bold text-green-400">{baseMeal.weight} g</div>
            ) : (
              <div className="flex items-center justify-center gap-1">
                <input
                  type="number"
                  min="50"
                  max={baseMeal.weight * 3}
                  step="50"
                  value={meal.weight}
                  onChange={(event) => changeWeight(Number(event.target.value))}
                  aria-label={lang === "bg" ? "Тегло на порцията" : "Portion weight"}
                  className="w-28 rounded-lg border border-green-500/50 bg-gray-900 px-2 py-1 text-center text-2xl font-bold text-green-400 outline-none focus:border-green-400"
                />
                <span className="text-xl font-bold text-green-400">g</span>
              </div>
            )}
            <div className="text-sm text-gray-300">{t.meals.weight}</div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">{t.meals.ingredients}</h2>
          <ul className="space-y-2">
            {meal.ingredients.map((ingredient, index) => (
              <li key={`${ingredient.name[lang]}-${index}`} className="fit-surface bg-gray-800 p-4 rounded-2xl flex justify-between items-center gap-4 transition hover:border-green-400/25">
                <div>
                  <span className="text-green-400 font-bold">{ingredient.name[lang]}</span>
                  {detail?.ingredients[index]?.substitute && (
                    <span className="text-gray-400 text-sm block">{t.meals.substitute}: {detail.ingredients[index].substitute[lang]}</span>
                  )}
                </div>
                <span className="text-gray-200 whitespace-nowrap font-semibold">{ingredient.amount} {ingredient.unit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">{t.meals.method}</h2>
          <ol className="list-decimal list-inside space-y-3 text-lg text-gray-200 leading-relaxed">
            {(detail?.recipeSteps[lang] || baseMeal.recipeSteps?.[lang] || generatedMealRecipeSteps[slug]?.[lang] || [baseMeal.recipe[lang]]).map((step, index) => <li key={index}>{step}</li>)}
          </ol>
        </div>
      </section>
    </main>
  );
}


