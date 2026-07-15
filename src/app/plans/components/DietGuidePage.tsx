"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { translations } from "@/lib/translations";
import { HeaderNav } from "@/app/personal-plan/components/HeaderNav";
import { SiteFooter } from "@/app/personal-plan/components/SiteFooter";

type DietKey = "keto" | "vegan" | "paleo" | "mediterranean" | "lowCarb" | "highProtein";

export function DietGuidePage({ dietKey }: { dietKey: DietKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useLang();
  const t = translations[lang] || translations.bg;
  const diet = (t.dietPages as any)[dietKey];
  const toggleLang = () => {
    const next = lang === "bg" ? "en" : "bg";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  return (
    <main className="fit-shell min-h-screen text-white">
      <HeaderNav t={t} lang={lang} toggleLang={toggleLang} isOpen={isOpen} setIsOpen={setIsOpen} />

      <section className="fit-page-hero pb-8 text-center">
        <Link href="/plans" className="fit-chip mb-6 gap-2 hover:border-green-400/30 hover:text-green-300"><ArrowLeft className="h-3.5 w-3.5" />{t.dietPages.backToPlans}</Link>
        <p className="fit-eyebrow">{lang === "bg" ? "Ръководство за хранене" : "Nutrition guide"}</p>
        <h1 className="fit-title-gradient mt-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
          <span className="mr-3" aria-hidden="true">{diet.emoji}</span>{diet.title}
        </h1>
      </section>

      <article className="fit-page-section max-w-4xl pt-4">
        <div className="space-y-4">
          {diet.sections.map((section: { title: string; body?: string; list?: string[] }, index: number) => (
            <section key={`${section.title}-${index}`} className="fit-surface rounded-2xl p-5 sm:p-6">
              <div className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-xs font-black text-green-300">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">{section.title}</h2>
                  {section.body && <p className="mt-3 text-sm leading-7 text-gray-300">{section.body}</p>}
                  {section.list && (
                    <ul className="mt-3 space-y-2 text-sm text-gray-300">
                      {section.list.map((item: string) => <li key={item} className="flex gap-2"><span className="mt-1 text-green-400">✓</span><span className="leading-6">{item}</span></li>)}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-green-500/25 bg-gradient-to-r from-green-500/10 to-teal-500/5 p-6 text-center sm:p-8">
          <Sparkles className="mx-auto h-7 w-7 text-green-400" />
          <h2 className="mt-3 text-2xl font-bold">{lang === "bg" ? "Приложи режима към собствената си цел" : "Apply the approach to your own goal"}</h2>
          <Link href="/personal-plan" className="fit-primary-button mt-5 inline-flex items-center gap-2 px-5 py-3 text-sm font-bold">{t.nav.personal}<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </article>

      <SiteFooter t={t} currentYear={new Date().getFullYear()} />
    </main>
  );
}
