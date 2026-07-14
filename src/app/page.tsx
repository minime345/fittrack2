"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

import { MotionH1 } from "@/components/motion/MotionH1";
import { MotionP } from "@/components/motion/MotionP";
import { MotionDiv } from "@/components/motion/MotionDiv";

import { translations, type Lang } from "@/lib/translations";
import { useLang } from "@/context/LangContext";

import { Analytics } from "@vercel/analytics/react";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="fit-logo-mark w-10 h-10 bg-gradient-to-tr from-green-400 to-lime-500 rounded-xl flex items-center justify-center text-black font-bold text-lg shadow-md">
        F
      </div>
      <span className="text-xl md:text-2xl font-bold tracking-wide text-white">FitAppTrack</span>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="fit-nav-link text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm font-medium"
    >
      {label}
    </Link>
  );
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useLang();
  const currentYear = new Date().getFullYear();

  // Ð—Ð°Ð´Ð°Ð²Ð°Ð¼Ðµ fallback, Ð·Ð° Ð´Ð° Ð½Ðµ ÑÑ‡ÑƒÐ¿Ð¸ Ñ€ÐµÐ½Ð´ÐµÑ€Ð°
  const t = translations[lang] || translations.bg;

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "bg") {
      setLang(saved);
    }
  }, [setLang]);

  const toggleLang = () => {
    const newLang = lang === "bg" ? "en" : "bg";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <main className="fit-shell min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-sans">
      <header className="fit-header sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Logo />

          <div className="flex items-center gap-6">
            {/* ÐÐ°Ð²Ð¸Ð³Ð°Ñ†Ð¸Ñ Ð·Ð° Ð´ÐµÑÐºÑ‚Ð¾Ð¿ */}
            <nav className="hidden md:flex gap-5 lg:gap-7">
              <NavLink href="/" label={t.nav.home} />
              <NavLink href="/calculator" label={t.nav.calculator} />
              <NavLink href="/personal-plan" label={t.nav.personal} />
              <NavLink href="/plans" label={t.nav.plans} />
              <NavLink href="/workouts" label={t.nav.workouts} />
              <NavLink href="/meals" label={t.nav.meals} />
            </nav>

            {/* Ð‘ÑƒÑ‚Ð¾Ð½ Ð·Ð° ÑÐ¼ÑÐ½Ð° Ð½Ð° ÐµÐ·Ð¸Ðº â€“ Ð¾ÑÑ‚Ð°Ð²Ð° ÑÐ°Ð¼Ð¾ ÐµÐ´Ð¸Ð½ Ð¿ÑŠÑ‚ */}
            <button
              onClick={toggleLang}
              aria-label="Switch language"
              className="fit-language px-3 py-1.5 border border-green-400/70 text-green-400 hover:bg-green-500 hover:text-black transition text-sm font-medium"
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

        {/* Mobile menu â€“ Ð±ÐµÐ· Ð±ÑƒÑ‚Ð¾Ð½ Ð·Ð° ÐµÐ·Ð¸Ðº Ð²ÑŠÑ‚Ñ€Ðµ */}
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

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center px-6 py-20 sm:py-28">
        <MotionH1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="fit-title-gradient text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
        >
          {t.homepage.Title}
        </MotionH1>

        <MotionP
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10"
        >
          {t.homepage.Text}
        </MotionP>

        {/* Buttons */}
        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
        >
          <Link
            href="/calculator"
            className="fit-primary-button bg-green-500 hover:bg-green-400 text-black font-semibold px-7 py-3.5 rounded-lg shadow-lg transition"
          >
            {t.homepage.btnCalc}
          </Link>
          <Link
            href="/personal-plan"
            className="fit-secondary-button border border-green-500/70 text-green-400 hover:bg-green-500 hover:text-black font-semibold px-7 py-3.5 rounded-lg shadow-lg transition"
          >
            {t.homepage.btnPersonal}
          </Link>
        </MotionDiv>

        {/* Image */}
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Image
            src="/homepage-fitness.jpg"
            alt="Fit Lifestyle"
            width={720}
            height={480}
            className="mx-auto rounded-[2rem] shadow-2xl border border-white/10 ring-1 ring-green-400/10"
          />
        </MotionDiv>
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
          Â© {currentYear} FitTrack. {t.footer.rights}
        </div>
      </footer>

      {/* Vercel Analytics */}
      <Analytics />
    </main>
  );
}


