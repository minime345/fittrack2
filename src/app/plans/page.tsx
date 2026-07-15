"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { translations } from "@/lib/translations";
import { useLang } from "@/context/LangContext";
import { HeaderNav } from "@/app/personal-plan/components/HeaderNav";
import { SiteFooter } from "@/app/personal-plan/components/SiteFooter";

export default function Plans() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useLang();
  const t = translations[lang] || translations.bg;

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

      <section className="fit-page-hero pb-10 text-center">
        <p className="fit-eyebrow">{lang === "bg" ? "Подходи към храненето" : "Nutrition approaches"}</p>
        <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="fit-title-gradient mt-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
          {t.plansPage.header.title}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
          {t.plansPage.header.subtitle}
        </motion.p>
      </section>

      <section className="fit-page-section pt-2">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.plansPage.diets.map((plan, index) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <Link href={plan.href} className="fit-surface fit-card-interactive group block h-full overflow-hidden rounded-3xl">
                <div className="relative h-52 overflow-hidden">
                  <Image src={plan.image} alt={plan.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/15 to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-400">{lang === "bg" ? "Ръководство" : "Guide"}</p>
                      <h2 className="mt-1 text-xl font-bold text-white">{plan.name}</h2>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 text-green-400 transition group-hover:translate-x-1" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{plan.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="fit-page-section pb-14">
        <div className="rounded-3xl border border-green-500/25 bg-gradient-to-r from-green-500/10 to-teal-500/5 p-7 text-center sm:p-9">
          <Sparkles className="mx-auto h-7 w-7 text-green-400" />
          <h2 className="mt-3 text-2xl font-bold">{t.plansPage.cta.question}</h2>
          <Link href="/personal-plan" className="fit-primary-button mt-5 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold">{t.plansPage.cta.button}<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <SiteFooter t={t} currentYear={new Date().getFullYear()} />
      <Analytics />
    </main>
  );
}
