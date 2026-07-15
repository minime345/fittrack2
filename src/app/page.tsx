"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  Dumbbell,
  FileDown,
  RefreshCw,
  ShoppingBasket,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { useLang } from "@/context/LangContext";
import { translations } from "@/lib/translations";
import { HeaderNav } from "@/app/personal-plan/components/HeaderNav";
import { SiteFooter } from "@/app/personal-plan/components/SiteFooter";

const pageCopy = {
  bg: {
    eyebrow: "Твоят режим на едно място",
    title: "Хранене и тренировки, съобразени с теб",
    intro: "Въведи целта си и получи седмичен план с подходящи ястия, практични порции, рецепти, списък за пазаруване и тренировки.",
    primary: "Създай своя план",
    secondary: "Изчисли нуждите си",
    featuresEyebrow: "Всичко необходимо",
    featuresTitle: "Всичко за твоя режим",
    featuresText: "От първото изчисление до списъка за пазаруване.",
    featureCards: [
      ["Калориен калкулатор", "Дневни калории и ориентировъчен прием на протеин.", "/calculator"],
      ["Персонален план", "Седмично меню според целта и предпочитанията ти.", "/personal-plan"],
      ["Рецепти и порции", "Продукти, стъпки и порции, нагласени към плана.", "/meals"],
      ["Тренировъчни програми", "Подходящ ритъм според опита и активността ти.", "/workouts"],
      ["Хранителни режими", "Ясно сравнение на популярни режими.", "/plans"],
      ["Списък и PDF", "Всичко необходимо за седмицата в удобен формат.", "/personal-plan"],
    ],
    howEyebrow: "Как работи",
    howTitle: "Започни за минути",
    howSteps: [
      ["01", "Въведи данните си", "Изчисли дневните си нужди и ги запази за следващото посещение."],
      ["02", "Избери какво предпочиташ", "Задай цел, режим, нежелани храни и желаното разнообразие."],
      ["03", "Получи своята седмица", "Сменяй ястия, следвай рецептите и пазарувай по готов списък."],
    ],
    plannerEyebrow: "Създаден за реалното ежедневие",
    plannerTitle: "План, който се наглася спрямо теб",
    plannerText: "Сменяй ястия и порции. Планът остава запазен, докато не решиш да го обновиш.",
    plannerPoints: ["Нормални и практични порции", "Смяна на отделно ястие", "Лесен, балансиран или разнообразен режим", "Филтриране на нежелани продукти", "Общ списък за пазаруване", "PDF за телефон или печат"],
    exploreEyebrow: "Разгледай и научи",
    exploreTitle: "Рецепти, режими и тренировки",
    exploreText: "Разглеждай ги и отделно, когато ти потрябват.",
    finalTitle: "Готов ли си да започнеш?",
    finalText: "Започни с калкулатора или направо създай своя план.",
  },
  en: {
    eyebrow: "Nutrition and training in one place",
    title: "A plan built around your life",
    intro: "Calculate your needs, choose a goal, and get a practical weekly nutrition plan with recipes, portions, a shopping list, and suitable workouts.",
    primary: "Create my personal plan",
    secondary: "Calculate my calories",
    featuresEyebrow: "Everything you need",
    featuresTitle: "One clear path from your goal to a daily plan",
    featuresText: "Every part of the site works with the others, so you do not need to piece together information from several apps.",
    featureCards: [
      ["Calorie calculator", "Save age, measurements, activity, calories, and an estimated protein range.", "/calculator"],
      ["Personal plan", "Generate a week around your goal, diet, exclusions, and preferred level of variety.", "/personal-plan"],
      ["Recipes and portions", "Open every meal, follow its ingredients and instructions, and adapt the portion to your plan.", "/meals"],
      ["Workout programs", "Choose a realistic program based on activity, experience, and your goal.", "/workouts"],
      ["Diet guides", "Compare popular approaches and understand who they may suit.", "/plans"],
      ["Shopping list and PDF", "Combine the week's ingredients and keep the complete plan in a convenient format.", "/personal-plan"],
    ],
    howEyebrow: "How it works",
    howTitle: "A ready plan in three short steps",
    howSteps: [
      ["01", "Add your details", "The calculator estimates daily needs and saves your information for your next visit."],
      ["02", "Configure the plan", "Choose your goal, diet, excluded foods, and whether the week should be easier or more varied."],
      ["03", "Follow and adjust", "Swap individual meals, use the recipes, shop from the list, and regenerate only when you decide."],
    ],
    plannerEyebrow: "Designed for real life",
    plannerTitle: "More than an automatic menu",
    plannerText: "Your plan stays saved until you change the inputs or request a new one. Adjust the week without losing everything else.",
    plannerPoints: ["Normal, practical portions", "Individual meal swaps", "Simple, balanced, or diverse modes", "Ingredient exclusions", "Combined shopping list", "Phone- and print-friendly PDF"],
    exploreEyebrow: "Explore and learn",
    exploreTitle: "Use every library on its own",
    exploreText: "Even without a generated plan, you can browse recipes, diet guides, and workout programs.",
    finalTitle: "Start with your real needs",
    finalText: "Complete the calculator once, then build nutrition and training you can realistically follow.",
  },
} as const;

const featureIcons = [Calculator, Sparkles, UtensilsCrossed, Dumbbell, BookOpen, ShoppingBasket];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useLang();
  const t = translations[lang] || translations.bg;
  const c = pageCopy[lang];

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "bg") setLang(saved);
  }, [setLang]);

  const toggleLang = () => {
    const next = lang === "bg" ? "en" : "bg";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  return (
    <main className="fit-shell min-h-screen text-white">
      <HeaderNav t={t} lang={lang} toggleLang={toggleLang} isOpen={isOpen} setIsOpen={setIsOpen} />

      <section className="fit-page-hero">
        <div className="max-w-4xl">
            <p className="fit-eyebrow">{c.eyebrow}</p>
            <h1 className="fit-title-gradient mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">{c.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">{c.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/personal-plan" className="fit-primary-button inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold">
                {c.primary}<ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/calculator" className="fit-secondary-button inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold text-green-200">
                <Calculator className="h-4 w-4" />{c.secondary}
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {[lang === "bg" ? "Запазва плана" : "Saves your plan", lang === "bg" ? "Адаптивни порции" : "Adaptive portions", lang === "bg" ? "BG и EN" : "BG and EN"].map((item) => <span key={item} className="fit-chip"><Check className="mr-1.5 h-3.5 w-3.5 text-green-400" />{item}</span>)}
            </div>
        </div>
      </section>

      <section className="fit-page-section">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="fit-eyebrow">{c.featuresEyebrow}</p>
            <h2 className="fit-section-title max-w-2xl">{c.featuresTitle}</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-gray-400">{c.featuresText}</p>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.featureCards.map(([title, text, href], index) => {
            const Icon = featureIcons[index];
            return (
              <Link key={title} href={href} className="fit-surface fit-card-interactive group rounded-2xl p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-300"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{text}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-green-400">{lang === "bg" ? "Отвори" : "Explore"}<ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="fit-page-section">
        <p className="fit-eyebrow">{c.howEyebrow}</p>
        <h2 className="fit-section-title">{c.howTitle}</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {c.howSteps.map(([number, title, text]) => (
            <article key={number} className="fit-surface rounded-2xl p-5">
              <span className="text-xs font-black text-green-400">{number}</span>
              <h3 className="mt-2 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="fit-page-section">
        <div className="fit-surface overflow-hidden rounded-3xl border-green-500/20">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-gradient-to-br from-green-500/12 to-teal-500/5 p-6 sm:p-8">
              <Sparkles className="h-8 w-8 text-green-400" />
              <p className="fit-eyebrow mt-5">{c.plannerEyebrow}</p>
              <h2 className="fit-section-title">{c.plannerTitle}</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">{c.plannerText}</p>
              <Link href="/personal-plan" className="fit-primary-button mt-6 inline-flex items-center gap-2 px-5 py-3 text-sm font-bold">{c.primary}<ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-px bg-white/5 sm:grid-cols-2">
              {c.plannerPoints.map((point, index) => {
                const icons = [UtensilsCrossed, RefreshCw, Sparkles, Check, ShoppingBasket, FileDown];
                const Icon = icons[index];
                return <div key={point} className="bg-gray-900/90 p-5"><Icon className="h-5 w-5 text-green-400" /><p className="mt-3 text-sm font-semibold text-gray-200">{point}</p></div>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="fit-page-section">
        <div className="text-center">
          <p className="fit-eyebrow">{c.exploreEyebrow}</p>
          <h2 className="fit-section-title">{c.exploreTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400">{c.exploreText}</p>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            [UtensilsCrossed, t.nav.meals, "/meals"],
            [BookOpen, t.nav.plans, "/plans"],
            [Dumbbell, t.nav.workouts, "/workouts"],
          ].map(([Icon, label, href]) => {
            const CardIcon = Icon as typeof Dumbbell;
            return <Link key={href as string} href={href as string} className="fit-surface fit-card-interactive flex items-center justify-between rounded-2xl p-5"><span className="flex items-center gap-3 font-bold"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-300"><CardIcon className="h-5 w-5" /></span>{label as string}</span><ArrowRight className="h-4 w-4 text-green-400" /></Link>;
          })}
        </div>
      </section>

      <section className="fit-page-section pb-14">
        <div className="rounded-3xl border border-green-500/25 bg-gradient-to-r from-green-500/10 to-teal-500/5 p-7 text-center sm:p-10">
          <h2 className="text-2xl font-black sm:text-3xl">{c.finalTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">{c.finalText}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/calculator" className="fit-secondary-button px-5 py-3 text-sm font-semibold text-green-200">{c.secondary}</Link>
            <Link href="/personal-plan" className="fit-primary-button px-5 py-3 text-sm font-bold">{c.primary}</Link>
          </div>
        </div>
      </section>

      <SiteFooter t={t} currentYear={new Date().getFullYear()} />
      <Analytics />
    </main>
  );
}
