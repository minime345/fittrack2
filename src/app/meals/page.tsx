"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { meals } from "@/data/meals";
import { translations } from "@/lib/translations";
import { useLang } from "@/context/LangContext";
import { HeaderNav } from "@/app/personal-plan/components/HeaderNav";
import { SiteFooter } from "@/app/personal-plan/components/SiteFooter";
import { mealImageFor } from "@/lib/visual-assets";

const categories = ["all", "vegan", "keto", "balanced", "high-protein", "high-carb", "carnivore"];
const mealsPerPage = 6;
const mealsReturnStateKey = "fittrack-meals-return-v1";

type MealsReturnState = {
  slug: string;
  category: string;
  query: string;
  visibleMealsCount: number;
};

export default function MealsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleMealsCount, setVisibleMealsCount] = useState(mealsPerPage);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [returnMealSlug, setReturnMealSlug] = useState<string | null>(null);
  const { lang, setLang } = useLang();
  const t = translations[lang] || translations.bg;

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "bg") setLang(saved);

    try {
      const returnState = JSON.parse(sessionStorage.getItem(mealsReturnStateKey) || "null") as MealsReturnState | null;
      if (returnState?.slug) {
        setActiveCategory(categories.includes(returnState.category) ? returnState.category : "all");
        setQuery(returnState.query || "");
        setVisibleMealsCount(Math.max(mealsPerPage, returnState.visibleMealsCount || mealsPerPage));
        setReturnMealSlug(returnState.slug);
      }
    } catch {
      sessionStorage.removeItem(mealsReturnStateKey);
    }
  }, [setLang]);

  const toggleLang = () => {
    const next = lang === "bg" ? "en" : "bg";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  const filteredMeals = useMemo(() => meals.filter((meal) => {
    const categoryMatch = activeCategory === "all" || meal.categories.includes(activeCategory);
    const text = `${meal.name.bg} ${meal.name.en} ${meal.categories.join(" ")}`.toLowerCase();
    return categoryMatch && text.includes(query.trim().toLowerCase());
  }), [activeCategory, query]);
  const visibleMeals = filteredMeals.slice(0, visibleMealsCount);

  useEffect(() => {
    if (!returnMealSlug || !visibleMeals.some((meal) => meal.slug === returnMealSlug)) return;
    const timeout = window.setTimeout(() => {
      document.getElementById(`meal-${returnMealSlug}`)?.scrollIntoView({ block: "center", behavior: "auto" });
      sessionStorage.removeItem(mealsReturnStateKey);
      setReturnMealSlug(null);
    }, 100);
    return () => window.clearTimeout(timeout);
  }, [returnMealSlug, visibleMeals]);

  const rememberMealPosition = (slug: string) => {
    const returnState: MealsReturnState = {
      slug,
      category: activeCategory,
      query,
      visibleMealsCount,
    };
    sessionStorage.setItem(mealsReturnStateKey, JSON.stringify(returnState));
  };

  return (
    <main className="fit-shell min-h-screen text-white">
      <HeaderNav t={t} lang={lang} toggleLang={toggleLang} isOpen={isOpen} setIsOpen={setIsOpen} />

      <section className="fit-page-hero pb-8">
        <div className="grid items-end gap-7 lg:grid-cols-[1fr_0.72fr]">
          <div>
            <p className="fit-eyebrow">{lang === "bg" ? "Библиотека с готови ястия" : "Ready-to-use meal library"}</p>
            <h1 className="fit-title-gradient mt-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">{t.meals.hed}</h1>
          </div>
          <div className="fit-surface overflow-hidden rounded-2xl">
            <div className="relative h-44 sm:h-52 lg:h-48">
              <Image src="/brand/meals-hero.webp" alt="" fill priority sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
            <div className="p-4">
            <label htmlFor="meal-search" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">{lang === "bg" ? "Търси ястие" : "Find a meal"}</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3">
              <Search className="h-4 w-4 text-green-400" />
              <input id="meal-search" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleMealsCount(mealsPerPage); }} placeholder={lang === "bg" ? "Име или категория…" : "Name or category…"} className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-600" />
            </div>
            </div>
          </div>
        </div>
      </section>

      <section className="fit-page-section pt-2">
        <div className="mb-7 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button key={category} onClick={() => { setActiveCategory(category); setVisibleMealsCount(mealsPerPage); }} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${activeCategory === category ? "border-green-400 bg-green-500 text-black" : "border-white/10 bg-gray-900/60 text-gray-300 hover:border-green-400/30 hover:text-green-300"}`}>
              {category === "all" ? t.meals.all : category.replace("-", " ")}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleMeals.map((meal, index) => (
            <motion.div id={`meal-${meal.slug}`} className="scroll-mt-24" key={meal.slug} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }}>
              <Link href={meal.link || `/meals/${meal.slug}`} onClick={() => rememberMealPosition(meal.slug)} className="fit-surface fit-card-interactive group flex h-full flex-col overflow-hidden rounded-3xl">
                <div className="relative h-40 overflow-hidden">
                  <Image src={mealImageFor(meal)} alt={meal.name[lang]} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-3xl">{meal.icon}</span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-green-400">{meal.categories[0]?.replace("-", " ")}</p>
                      <h2 className="mt-1 text-lg font-bold leading-tight text-white">{meal.name[lang]}</h2>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-green-400 transition group-hover:translate-x-1" />
                </div>
                <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                  <Macro value={meal.kcal} label="kcal" highlight />
                  <Macro value={meal.protein} label="P" />
                  <Macro value={meal.carbs} label="C" />
                  <Macro value={meal.fat} label="F" />
                </div>
                <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-gray-500">{meal.recipe[lang]}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {visibleMeals.length === 0 && <div className="fit-surface rounded-3xl p-10 text-center"><p className="text-lg font-bold">{lang === "bg" ? "Няма намерени ястия" : "No meals found"}</p><p className="mt-2 text-sm text-gray-400">{lang === "bg" ? "Опитай с друга дума или категория." : "Try another word or category."}</p></div>}

        {visibleMealsCount < filteredMeals.length && <div className="mt-10 text-center"><button onClick={() => setVisibleMealsCount((count) => count + mealsPerPage)} className="fit-secondary-button px-6 py-3 text-sm font-bold text-green-300">{t.meals.button}</button></div>}
      </section>

      <section className="fit-page-section pb-14">
        <div className="rounded-3xl border border-green-500/25 bg-gradient-to-r from-green-500/10 to-teal-500/5 p-7 text-center sm:p-9">
          <Sparkles className="mx-auto h-7 w-7 text-green-400" />
          <h2 className="mt-3 text-2xl font-bold">{lang === "bg" ? "Превърни рецептите в цяла седмица" : "Turn recipes into a complete week"}</h2>
          <Link href="/personal-plan" className="fit-primary-button mt-5 inline-flex items-center gap-2 px-5 py-3 text-sm font-bold"><Flame className="h-4 w-4" />{t.nav.personal}</Link>
        </div>
      </section>

      <SiteFooter t={t} currentYear={new Date().getFullYear()} />
      <Analytics />
    </main>
  );
}

function Macro({ value, label, highlight = false }: { value: number; label: string; highlight?: boolean }) {
  return <div className="rounded-xl border border-white/5 bg-black/15 p-2"><p className={`text-sm font-black ${highlight ? "text-green-300" : "text-white"}`}>{value}</p><p className="text-[9px] uppercase tracking-wide text-gray-600">{label}</p></div>;
}
