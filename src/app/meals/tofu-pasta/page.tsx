"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { translations } from "@/lib/translations";
import { useLang } from "@/context/LangContext";
import { mealDetails } from "@/data/meal-details";

const meal = mealDetails["tofu-pasta"];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-tr from-green-400 to-lime-500 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-md">
        F
      </div>
      <span className="text-xl md:text-2xl font-bold tracking-wide text-white">FitTrack</span>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm font-medium"
    >
      {label}
    </Link>
  );
}

export default function TofuPastaPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useLang();

  const t = translations[lang] || translations.bg;

  const toggleLang = () => {
    const newLang = lang === "bg" ? "en" : "bg";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Logo />

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-10">
              <NavLink href="/" label={t.nav.home} />
              <NavLink href="/calculator" label={t.nav.calculator} />
              <NavLink href="/personal-plan" label={t.nav.personal} />
              <NavLink href="/plans" label={t.nav.plans} />
              <NavLink href="/meals" label={t.nav.meals} />
            </nav>

            <button
              onClick={toggleLang}
              aria-label="Switch language"
              className="px-3 py-1 border border-green-400 text-green-400 rounded-lg hover:bg-green-500 hover:text-black transition text-sm font-medium"
            >
              {lang === "bg" ? "BG" : "EN"}
            </button>

            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                <Menu className="w-6 h-6 text-white" />
              </button>
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
              <NavLink href="/meals" label={t.nav.meals} />
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-6xl">{meal.icon}</span>
          <h1 className="text-4xl font-bold text-green-400">{meal.name[lang]}</h1>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-gray-800 p-6 rounded-xl mb-10 text-center">
          <div>
            <div className="text-3xl font-bold text-green-400">{meal.kcal}</div>
            <div className="text-sm text-gray-300">{t.meals.cal}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">{meal.protein} {t.meals.unit}</div>
            <div className="text-sm text-gray-300">{t.meals.prot}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">{meal.carbs} {t.meals.unit}</div>
            <div className="text-sm text-gray-300">{t.meals.carb}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">{meal.fat} {t.meals.unit}</div>
            <div className="text-sm text-gray-300">{t.meals.fat}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">{meal.weight} {t.meals.unit}</div>
            <div className="text-sm text-gray-300">{t.meals.weight}</div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">{t.meals.ingredients}</h2>
          <ul className="space-y-2">
            {meal.ingredients.map((item, idx) => (
              <li key={idx} className="bg-gray-800 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-green-400 font-bold">{item.name[lang]}</span>
                  <span className="text-gray-400 text-sm block">{t.meals.substitute}: {item.substitute[lang]}</span>
                </div>
                <span className="text-gray-200 font-semibold">{item.amount[lang]}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">{t.meals.method}</h2>
          <ol className="list-decimal list-inside space-y-3 text-lg text-gray-200 leading-relaxed">
            {meal.recipeSteps[lang].map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
