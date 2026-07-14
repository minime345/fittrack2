"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { Menu } from "lucide-react";
import { translations } from "@/lib/translations";
import { useLang } from "@/context/LangContext";

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

export default function KetoPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useLang();
  const currentYear = new Date().getFullYear();

  const t = translations[lang] || translations.bg;
  const diet = t.dietPages.keto;

  const toggleLang = () => {
    const newLang = lang === "bg" ? "en" : "bg";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-md">
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

            <button
              onClick={toggleLang}
              aria-label="Switch language"
              className="px-3 py-1 border border-green-400 text-green-400 rounded-lg hover:bg-green-500 hover:text-black transition text-sm font-medium"
            >
              {lang === "bg" ? "BG" : "EN"}
            </button>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                className="focus:outline-none"
              >
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
              <NavLink href="/workouts" label={t.nav.workouts} />
              <NavLink href="/meals" label={t.nav.meals} />
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-green-400 mb-10 text-center"
        >
          {diet.emoji} {diet.title}
        </motion.h1>

        {diet.sections.map((section, index) => (
          <section key={index} className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
            {"body" in section && section.body && (
              <p className="text-gray-300">{section.body}</p>
            )}
            {"list" in section && section.list && (
              <ul className="text-gray-300 list-disc list-inside space-y-1">
                {section.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <div className="mt-12 text-center">
          <Link href="/plans" className="text-green-400 hover:underline">
            {t.dietPages.backToPlans}
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.footer.contacts}</h3>
            <p>
              Email:{" "}
              <a
                href="mailto:fittrackwebsite@gmail.com"
                className="text-green-400 hover:underline"
              >
                fittrackwebsite@gmail.com
              </a>
            </p>
            <p>
              {t.footer.phone}{" "}
              <a
                href="tel:+359887183887"
                className="text-green-400 hover:underline"
              >
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
          <div className="text-center md:text-right">
            <p>Â© {currentYear} FitTrack. {t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}


