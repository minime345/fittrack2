"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { meals } from "@/data/meals";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { translations, type Lang } from "@/lib/translations";
import { useLang } from "@/context/LangContext";
import { Analytics } from "@vercel/analytics/react";

const categories = ["all", "vegan", "keto", "balanced", "high-protein", "high-carb", "carnivore"];
const mealsPerPage = 6;

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

export default function MealsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleMealsCount, setVisibleMealsCount] = useState(mealsPerPage);
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("bg"); // default bg
  const currentYear = new Date().getFullYear();

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

  // Преводи
  const t = translations[lang] || translations.bg;

  const filteredMeals =
    activeCategory === "all"
      ? meals
      : meals.filter(meal => meal.categories.includes(activeCategory));

  const visibleMeals = filteredMeals.slice(0, visibleMealsCount);

  const handleLoadMore = () => {
    setVisibleMealsCount(prev => prev + mealsPerPage);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-sans">
      {/* Навигация */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Logo />

          <div className="flex items-center gap-6">
            {/* Навигация за десктоп */}
            <nav className="hidden md:flex gap-10">
              <NavLink href="/" label={t.nav.home} />
              <NavLink href="/calculator" label={t.nav.calculator} />
              <NavLink href="/personal-plan" label={t.nav.personal} />
              <NavLink href="/plans" label={t.nav.plans} />
              <NavLink href="/meals" label={t.nav.meals} />
            </nav>

            {/* Бутон за смяна на език */}
            <button
              onClick={toggleLang}
              aria-label="Switch language"
              className="px-3 py-1 border border-green-400 text-green-400 rounded-lg hover:bg-green-500 hover:text-black transition text-sm font-medium"
            >
              {lang === "bg" ? "BG" : "EN"}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                <Menu className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
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

      {/* Секция: Ястия */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-green-400 mb-8 text-center"
        >
          {t.meals.hed}
        </motion.h1>

        {/* Категории */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleMealsCount(mealsPerPage);
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeCategory === cat
                  ? "bg-green-500 text-black"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              {cat === "all" ? t.meals.all 
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Карти с ястия */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleMeals.map((meal, i) => (
            <motion.div
              key={meal.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-900/60 hover:bg-gray-800/80 transition rounded-2xl p-6 shadow-xl border border-white/10 backdrop-blur"
            >
              {meal.link ? (
                <Link href={meal.link} className="block h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{meal.icon}</div>
                    <h2 className="text-xl font-bold text-green-400">{meal.name[lang]}</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-2">
                    <div><span className="font-semibold text-white">{t.meals.cal}:</span> {meal.kcal}</div>
                    <div><span className="font-semibold text-white">{t.meals.prot}:</span> {meal.protein} {t.meals.unit}</div>
                    <div><span className="font-semibold text-white">{t.meals.carb}:</span> {meal.carbs} {t.meals.unit}</div>
                    <div><span className="font-semibold text-white">{t.meals.fat}:</span> {meal.fat} {t.meals.unit}</div>
                  </div>
                  <div className="text-xs text-gray-400 italic">
                    {t.meals.category}: {meal.categories.join(", ")}
                  </div>
                </Link>
              ) : (
                <div className="block h-full cursor-default">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{meal.icon}</div>
                    <h2 className="text-xl font-bold text-green-400">{meal.name[lang]}</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-2">
                    <div><span className="font-semibold text-white">{t.meals.cal}:</span> {meal.kcal}</div>
                    <div><span className="font-semibold text-white">{t.meals.prot}:</span> {meal.protein} {t.meals.unit}</div>
                    <div><span className="font-semibold text-white">{t.meals.carb}:</span> {meal.carbs} {t.meals.unit}</div>
                    <div><span className="font-semibold text-white">{t.meals.fat}:</span> {meal.fat} {t.meals.unit}</div>
                  </div>
                  <div className="text-xs text-gray-400 italic mb-2">
                    {t.meals.category}: {meal.categories.join(", ")}
                  </div>
                  <div className="text-sm text-white mt-2 whitespace-pre-wrap">
                    <span className="font-semibold text-green-400">
                      {lang === "bg" ? "Рецепта:" : "Recipe:"}
                    </span>{" "}
                    {meal.recipe[lang]}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Бутон "Зареди още" */}
        {visibleMealsCount < filteredMeals.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-full transition"
            >
              {t.meals.button}
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.footer.contacts}</h3>
            <p>
              Email:{" "}
              <a href="mailto:fittrackwebsite@gmail.com" className="text-green-400 hover:underline">
                fittrackwebsite@gmail.com
              </a>
            </p>
            <p>
              {t.footer.phone}{" "}
              <a href="tel:+359887183887" className="text-green-400 hover:underline">
                +359 887 183 887
              </a>
            </p>
            <p>{t.footer.address}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.footer.quick}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/calculator" className="hover:text-green-400">
                  {t.nav.calculator}
                </Link>
              </li>
              <li>
                <Link href="/plans" className="hover:text-green-400">
                  {t.nav.plans}
                </Link>
              </li>
              <li>
                <Link href="/meals" className="hover:text-green-400">
                  {t.nav.meals}
                </Link>
              </li>
              <li>
                <Link href="/personal-plan" className="hover:text-green-400">
                  {t.nav.personal}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.footer.follow}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.facebook.com/share/1GT8Ey98Re/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/semetoitsmaname"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/yourchannel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-10 text-sm text-gray-500">
          © {currentYear} FitTrack. {t.footer.rights}
        </div>
      </footer>

      {/* Vercel Analytics */}
      <Analytics />
    </main>
  );
}
