"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Scale, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { meals, type Meal } from "@/data/meals";
import { mealDetails } from "@/data/meal-details";
import { generatedMealRecipeSteps } from "@/data/meal-recipe-steps";
import { translations } from "@/lib/translations";
import { useLang } from "@/context/LangContext";
import { scaleMeal } from "@/app/personal-plan/planLogic";
import { HeaderNav } from "@/app/personal-plan/components/HeaderNav";
import { SiteFooter } from "@/app/personal-plan/components/SiteFooter";
import { mealImageFor } from "@/lib/visual-assets";

export function MealDetailPage({ slug }: { slug: string }) {
  const baseMeal = meals.find((item) => item.slug === slug)! as Meal;
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

  const recipeSteps = detail?.recipeSteps[lang] || baseMeal.recipeSteps?.[lang] || generatedMealRecipeSteps[slug]?.[lang] || [baseMeal.recipe[lang]];

  return (
    <main className="fit-shell min-h-screen text-white">
      <HeaderNav t={t} lang={lang} toggleLang={toggleLang} isOpen={isOpen} setIsOpen={setIsOpen} />

      <section className="fit-page-hero pb-8">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => router.back()} className="fit-chip gap-2 hover:border-green-400/30 hover:text-green-300"><ArrowLeft className="h-3.5 w-3.5" />{lang === "bg" ? "Назад" : "Back"}</button>
          <Link href="/meals" className="fit-chip hover:border-green-400/30 hover:text-green-300">{t.nav.meals}</Link>
        </div>
        <div className="mt-7 grid items-end gap-7 lg:grid-cols-[1fr_auto]">
          <div className="flex items-start gap-4 sm:gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-4xl sm:h-20 sm:w-20 sm:text-5xl">{detail?.icon || baseMeal.icon}</span>
            <div>
              <p className="fit-eyebrow">{lang === "bg" ? "Рецепта с адаптивна порция" : "Recipe with an adaptive portion"}</p>
              <h1 className="fit-title-gradient mt-2 text-3xl font-black tracking-tight sm:text-5xl">{detail?.name[lang] || baseMeal.name[lang]}</h1>
            </div>
          </div>
          {!baseMeal.fixedPortion && <div className="fit-surface rounded-2xl p-4"><label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500"><Scale className="h-4 w-4 text-green-400" />{t.meals.weight}</label><div className="flex items-center gap-2"><input type="number" min="50" max={baseMeal.weight * 3} step="50" value={meal.weight} onChange={(event) => changeWeight(Number(event.target.value))} aria-label={lang === "bg" ? "Тегло на порцията" : "Portion weight"} className="w-28 rounded-xl border border-green-500/30 bg-black/20 px-3 py-2 text-center text-xl font-black text-green-300 outline-none" /><span className="font-bold text-green-300">g</span></div></div>}
        </div>
        <div className="fit-visual-frame relative mt-7 h-56 overflow-hidden rounded-3xl sm:h-72 lg:h-80">
          <Image src={mealImageFor(baseMeal)} alt={detail?.name[lang] || baseMeal.name[lang]} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </section>

      <section className="fit-page-section pt-2">
        <div className="fit-surface grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/5 sm:grid-cols-5">
          <Nutrient value={meal.kcal} label={t.meals.cal} />
          <Nutrient value={`${meal.protein} g`} label={t.meals.prot} />
          <Nutrient value={`${meal.carbs} g`} label={t.meals.carb} />
          <Nutrient value={`${meal.fat} g`} label={t.meals.fat} />
          <Nutrient value={`${meal.weight} g`} label={t.meals.weight} />
        </div>
      </section>

      <section className="fit-page-section grid gap-5 pt-3 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="fit-eyebrow">{lang === "bg" ? "Какво ти трябва" : "What you need"}</p>
          <h2 className="fit-section-title">{t.meals.ingredients}</h2>
          <ul className="mt-5 space-y-2">
            {meal.ingredients.map((ingredient, index) => (
              <li key={`${ingredient.name[lang]}-${index}`} className="fit-surface flex items-center justify-between gap-4 rounded-2xl p-4">
                <div><span className="font-bold text-white">{ingredient.name[lang]}</span>{detail?.ingredients[index]?.substitute && <span className="mt-1 block text-xs text-gray-500">{t.meals.substitute}: {detail.ingredients[index].substitute[lang]}</span>}</div>
                <span className="whitespace-nowrap rounded-lg bg-green-500/10 px-2.5 py-1 text-sm font-bold text-green-300">{ingredient.amount} {ingredient.unit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="fit-eyebrow">{lang === "bg" ? "Стъпка по стъпка" : "Step by step"}</p>
          <h2 className="fit-section-title">{t.meals.method}</h2>
          <ol className="mt-5 space-y-3">
            {recipeSteps.map((step, index) => <li key={`${index}-${step}`} className="fit-surface flex gap-4 rounded-2xl p-4 sm:p-5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-xs font-black text-green-300">{index + 1}</span><p className="text-sm leading-7 text-gray-300">{step}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="fit-page-section pb-12">
        <div className="rounded-3xl border border-green-500/25 bg-gradient-to-r from-green-500/10 to-teal-500/5 p-6 text-center sm:p-8">
          <Sparkles className="mx-auto h-7 w-7 text-green-400" />
          <h2 className="mt-3 text-2xl font-bold">{lang === "bg" ? "Добави ястието към персонална седмица" : "Use this meal in a personal week"}</h2>
          <Link href="/personal-plan" className="fit-primary-button mt-5 inline-flex items-center gap-2 px-5 py-3 text-sm font-bold">{t.nav.personal}<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <SiteFooter t={t} currentYear={new Date().getFullYear()} />
    </main>
  );
}

function Nutrient({ value, label }: { value: string | number; label: string }) {
  return <div className="bg-gray-900/90 p-4 text-center sm:p-5"><p className="text-xl font-black text-green-300 sm:text-2xl">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</p></div>;
}
