"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { HeaderNav } from "@/app/personal-plan/components/HeaderNav";
import { SiteFooter } from "@/app/personal-plan/components/SiteFooter";
import { scoreProgram } from "./config";
import { programs } from "./data/programs";
import { InfoBlock } from "./components/InfoBlock";
import { PreferencesPanel } from "./components/PreferencesPanel";
import { ProgramCard } from "./components/ProgramCard";
import { useTrainingPreferences } from "./useTrainingPreferences";

export default function WorkoutsPage() {
  const router = useRouter();
  const {
    lang,
    t,
    isOpen,
    setIsOpen,
    toggleLang,
    profile,
    prefs,
    updatePrefs,
    selectedPlanId,
    selectPlan,
  } = useTrainingPreferences();
  const [previewPlanId, setPreviewPlanId] = useState<string | null>(null);

  const recommended = useMemo(
    () =>
      [...programs].sort(
        (a, b) =>
          scoreProgram(b, prefs, profile?.activity) -
          scoreProgram(a, prefs, profile?.activity),
      )[0],
    [prefs, profile],
  );

  const openPlan = (planId: string) => {
    selectPlan(planId);
    router.push(`/workouts/${planId}`);
  };

  return (
    <main className="fit-shell min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 font-sans text-white">
      <HeaderNav
        t={t}
        lang={lang}
        toggleLang={toggleLang}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
        <div className="grid items-start gap-7 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-green-400">
              {lang === "bg"
                ? "Персонална тренировъчна седмица"
                : "Your personal training week"}
            </p>
            <h1 className="fit-title-gradient mt-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              {lang === "bg"
                ? "План, който пасва на живота ти"
                : "A plan that fits your life"}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
              {lang === "bg"
                ? "Избери цел, свободни дни и оборудване. Ще подберем подходяща програма и ще я подредим в реалистичен график."
                : "Choose your goal, available days, and equipment. We will match a proven program format and place it into a realistic schedule."}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-gray-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                {programs.length}{" "}
                {lang === "bg" ? "тренировъчни формата" : "training formats"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                {lang === "bg" ? "Автоматично запазване" : "Saved automatically"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                {lang === "bg" ? "Адаптивни упражнения" : "Adaptive exercises"}
              </span>
            </div>
          </div>

          <PreferencesPanel
            lang={lang}
            prefs={prefs}
            updatePrefs={updatePrefs}
            recommendedName={recommended.name[lang]}
            hasActivityProfile={Boolean(profile?.activity)}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-green-400">
              {lang === "bg" ? "Най-популярни програми" : "Most popular programs"}
            </p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
              {lang === "bg" ? "Избери тренировъчен формат" : "Choose a training format"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => openPlan(recommended.id)}
            className="min-h-11 rounded-xl border border-green-500/30 px-4 text-sm font-semibold text-green-300 hover:bg-green-500/10"
          >
            {lang === "bg" ? "Избери препоръката" : "Select recommendation"}
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              lang={lang}
              selected={selectedPlanId === program.id}
              isPreviewed={previewPlanId === program.id}
              isRecommended={recommended.id === program.id}
              onTogglePreview={() =>
                setPreviewPlanId(
                  previewPlanId === program.id ? null : program.id,
                )
              }
              onSelect={() => openPlan(program.id)}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <InfoBlock
            number="01"
            title={
              lang === "bg" ? "Започни с резерв" : "Start with reps in reserve"
            }
            text={
              lang === "bg"
                ? "През първите седмици завършвай сериите с усещане, че можеш да направиш още 2-3 чисти повторения."
                : "For the first weeks, finish sets feeling that you could complete another 2-3 clean repetitions."
            }
          />
          <InfoBlock
            number="02"
            title={
              lang === "bg" ? "Прогресирай постепенно" : "Progress gradually"
            }
            text={
              lang === "bg"
                ? "Когато покриеш горната граница повторения с добра техника, добави малко тежест или едно повторение."
                : "When you reach the top of the rep range with good form, add a small amount of load or one repetition."
            }
          />
          <InfoBlock
            number="03"
            title={lang === "bg" ? "Пази възстановяването" : "Protect recovery"}
            text={
              lang === "bg"
                ? "Оставяй поне ден между тежки тренировки за едни и същи мускули и намали обема при натрупана умора."
                : "Leave at least a day between hard sessions for the same muscles and reduce volume when fatigue accumulates."
            }
          />
        </div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-gray-400">
          {lang === "bg"
            ? "За общо здраве добавяй умерено движение през седмицата и тренирай основните мускулни групи поне два дни. Започни с малко и увеличавай постепенно. При травма, заболяване, бременност, остра болка или замайване потърси подходящ медицински съвет."
            : "For general health, include moderate activity through the week and train the major muscle groups on at least two days. Start small and build gradually. Seek appropriate medical advice for injury, illness, pregnancy, sharp pain, or dizziness."}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-green-500/25 bg-gradient-to-r from-green-500/10 to-teal-500/5 p-6 text-center sm:p-8">
          <h2 className="text-2xl font-bold">
            {lang === "bg"
              ? "Свържи тренировките с храненето"
              : "Connect training and nutrition"}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400">
            {lang === "bg"
              ? "Запази актуални данните си в калкулатора и използвай персоналния хранителен план според същата цел."
              : "Keep your calculator profile current and use the personal nutrition plan with the same goal."}
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/calculator"
              className="fit-secondary-button min-h-11 rounded-xl border border-green-500/30 px-5 py-3 text-sm font-semibold text-green-200"
            >
              {lang === "bg" ? "Калкулатор" : "Calculator"}
            </Link>
            <Link
              href="/personal-plan"
              className="fit-primary-button min-h-11 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-black"
            >
              {lang === "bg" ? "Персонален хранителен план" : "Personal nutrition plan"}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter t={t} currentYear={new Date().getFullYear()} />
      <Analytics />
    </main>
  );
}
