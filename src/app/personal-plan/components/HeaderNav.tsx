"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Calculator, Dumbbell, Home, Menu, Moon, NotebookTabs, Salad, Sparkles, Sun, X } from "lucide-react";
import { Logo, NavLink } from "./NavBits";
import { AuthButton } from "./AuthButton";

type HeaderNavProps = {
  t: any;
  lang: "bg" | "en";
  toggleLang: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function HeaderNav({ t, lang, toggleLang, isOpen, setIsOpen }: HeaderNavProps) {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const saved = localStorage.getItem("fittrack-theme");
      const dark = saved === "dark" || (saved !== "light" && media.matches);
      setDarkTheme(dark);
      document.documentElement.classList.toggle("theme-dark", dark);
    };
    applyTheme();
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, []);

  const toggleTheme = () => {
    const next = !darkTheme;
    setDarkTheme(next);
    localStorage.setItem("fittrack-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("theme-dark", next);
  };

  const mobileLinks = [
    { href: "/", label: t.nav.home, description: lang === "bg" ? "Начало" : "Start here", icon: Home },
    { href: "/calculator", label: t.nav.calculator, description: lang === "bg" ? "Калории и макроси" : "Calories & macros", icon: Calculator },
    { href: "/personal-plan", label: t.nav.personal, description: lang === "bg" ? "Твоят хранителен режим" : "Your meal plan", icon: Sparkles },
    { href: "/plans", label: t.nav.plans, description: lang === "bg" ? "Хранителни режими" : "Nutrition guides", icon: NotebookTabs },
    { href: "/workouts", label: t.nav.workouts, description: lang === "bg" ? "Намери своята програма" : "Find your program", icon: Dumbbell },
    { href: "/meals", label: t.nav.meals, description: lang === "bg" ? "Разгледай рецептите" : "Browse recipes", icon: Salad },
  ];

  return (
    <header className="fit-header sticky top-0 z-[100] border-b border-white/10 bg-white/5 shadow-md backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-6">
          <nav className="hidden gap-5 md:flex lg:gap-7">
            <NavLink href="/" label={t.nav.home} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/calculator" label={t.nav.calculator} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/personal-plan" label={t.nav.personal} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/plans" label={t.nav.plans} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/workouts" label={t.nav.workouts} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/meals" label={t.nav.meals} onNavigate={() => setIsOpen(false)} />
          </nav>
          <button type="button" onClick={toggleLang} aria-label="Switch language" className="fit-language rounded-lg border border-green-400/70 px-3 py-1.5 text-sm font-medium text-green-400 transition hover:bg-green-500 hover:text-black">
            {lang === "bg" ? "BG" : "EN"}
          </button>
          <button type="button" onClick={toggleTheme} aria-label={darkTheme ? "Use light theme" : "Use dark theme"} title={darkTheme ? "Light theme" : "Dark theme"} className="fit-theme-toggle flex h-10 w-10 items-center justify-center rounded-xl border border-green-400/25 text-green-300 transition hover:border-green-400/50">
            {darkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="hidden md:block"><AuthButton lang={lang} /></div>
          <button type="button" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen} aria-controls="mobile-navigation" className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl border transition md:hidden ${isOpen ? "border-green-400/35 bg-green-500/15 text-green-300" : "border-white/10 bg-gray-950/60 text-white"}`}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="mobile-navigation" className="absolute left-0 right-0 top-full z-[110] border-t border-white/10 bg-gray-950/95 px-4 pb-5 pt-4 shadow-2xl backdrop-blur-2xl md:hidden">
          <div className="mx-auto max-h-[calc(100dvh-6.5rem)] max-w-lg overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900/95 to-gray-950/95 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
            <div className="px-2 pb-3 pt-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400">{lang === "bg" ? "Разгледай FitTrack" : "Explore FitTrack"}</p>
              <p className="mt-1 text-xs text-gray-500">{lang === "bg" ? "Всичко необходимо за твоя план" : "Everything you need for your plan"}</p>
            </div>
            <nav className="grid grid-cols-2 gap-2" aria-label="Mobile navigation">
              {mobileLinks.map((item) => <MobileMenuLink key={item.href} {...item} onNavigate={() => setIsOpen(false)} />)}
            </nav>
            <div className="mt-3 border-t border-white/10 px-1 pt-3">
              <p className="mb-1 px-2 text-[9px] font-black uppercase tracking-[0.18em] text-gray-600">{lang === "bg" ? "Твоят акаунт" : "Your account"}</p>
              <AuthButton lang={lang} mobile onNavigate={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileMenuLink({ href, label, description, icon: Icon, onNavigate }: { href: string; label: string; description: string; icon: typeof Home; onNavigate: () => void }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={`group min-w-0 rounded-2xl border p-3 transition ${active ? "border-green-400/35 bg-green-500/10" : "border-white/5 bg-white/[0.025] hover:border-green-400/20 hover:bg-green-500/[0.06]"}`}>
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-green-400 text-gray-950" : "bg-white/5 text-gray-400 group-hover:text-green-300"}`}><Icon className="h-4 w-4" /></span>
      <span className="mt-3 block truncate text-sm font-bold text-white">{label}</span>
      <span className="mt-0.5 block truncate text-[10px] text-gray-500">{description}</span>
    </Link>
  );
}
