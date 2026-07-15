"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { Analytics } from "@vercel/analytics/react";
import { HeaderNav } from "@/app/personal-plan/components/HeaderNav";
import { SiteFooter } from "@/app/personal-plan/components/SiteFooter";
import { labels, weekDays } from "../config";
import { programs } from "../data/programs";
import { DownloadPlanButton } from "../components/DownloadPlanButton";
import { ScheduleGrid } from "../components/ScheduleGrid";
import { Stat } from "../components/Stat";
import { downloadWorkoutPlanPDF } from "../pdfExport";
import { useTrainingPreferences } from "../useTrainingPreferences";

export function PlanDetailClient({ id }: { id: string }) {
  const {
    lang,
    t,
    isOpen,
    setIsOpen,
    toggleLang,
    prefs,
    selectedPlanId,
    setSelectedPlanId,
    storageReady,
  } = useTrainingPreferences();

  const plan = useMemo(
    () => programs.find((program) => program.id === id) || null,
    [id],
  );

  useEffect(() => {
    if (storageReady && plan && selectedPlanId !== plan.id) {
      setSelectedPlanId(plan.id);
    }
  }, [storageReady, plan, selectedPlanId, setSelectedPlanId]);

  if (!plan) return null;

  const sessionCount = Math.min(
    plan.sessions.length,
    plan.days.includes(prefs.days)
      ? prefs.days
      : plan.days.reduce((best, value) =>
          Math.abs(value - prefs.days) < Math.abs(best - prefs.days)
            ? value
            : best,
        ),
  );
  const schedule = plan.sessions.slice(0, sessionCount);
  const scheduleDays = weekDays[sessionCount] || weekDays[3];
  const exerciseLimit = prefs.minutes <= 30 ? 4 : prefs.minutes <= 45 ? 5 : 6;

  const handleDownloadPdf = () => {
    downloadWorkoutPlanPDF({
      lang,
      plan,
      schedule,
      scheduleDays,
      goalLabel: labels.goal[prefs.goal][lang],
      equipmentLabel: labels.equipment[prefs.equipment][lang],
      equipment: prefs.equipment,
      minutes: prefs.minutes,
      exerciseLimit,
    });
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

      <section className="mx-auto max-w-6xl px-4 pb-4 pt-8 sm:px-6 sm:pt-12">
        <Link
          href="/workouts"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 transition hover:text-green-300"
        >
          ← {lang === "bg" ? "Всички програми" : "All programs"}
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="fit-surface overflow-hidden rounded-3xl border border-green-500/20">
          <div className="border-b border-white/10 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-400">
                  {lang === "bg" ? "Тренировъчна програма" : "Training program"}
                </p>
                <h1 className="fit-title-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                  {plan.name[lang]}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-gray-400">
                  {plan.summary[lang]}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Stat
                  value={String(sessionCount)}
                  label={lang === "bg" ? "дни" : "days"}
                />
                <Stat value={`${prefs.minutes}`} label="min" />
                <Stat
                  value={labels.equipment[prefs.equipment][lang]}
                  label={lang === "bg" ? "уреди" : "equipment"}
                />
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-green-500/15 bg-green-500/[0.06] p-3 text-xs leading-relaxed text-green-100/80">
              {lang === "bg"
                ? `Подбрано за цел „${labels.goal[prefs.goal].bg}", ${prefs.days} свободни дни и ${prefs.minutes} минути. Упражненията са адаптирани за: ${labels.equipment[prefs.equipment].bg}.`
                : `Matched to your ${labels.goal[prefs.goal].en.toLowerCase()} goal, ${prefs.days} available days, and ${prefs.minutes}-minute sessions. Exercises are adapted for: ${labels.equipment[prefs.equipment].en}.`}
            </div>
          </div>

          <ScheduleGrid
            planId={plan.id}
            schedule={schedule}
            scheduleDays={scheduleDays}
            minutes={prefs.minutes}
            exerciseLimit={exerciseLimit}
            equipment={prefs.equipment}
            lang={lang}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <DownloadPlanButton lang={lang} onClick={handleDownloadPdf} />
          <Link
            href="/workouts"
            className="fit-secondary-button flex w-full flex-col justify-center rounded-xl border border-green-500/30 px-6 py-3 text-white transition-colors"
          >
            <span className="block font-semibold">
              {lang === "bg" ? "Смени програмата" : "Change program"}
            </span>
            <span className="mt-0.5 block text-xs font-normal text-gray-400">
              {lang === "bg"
                ? "Върни се към всички формати"
                : "Go back to all formats"}
            </span>
          </Link>
        </div>
      </section>

      <SiteFooter t={t} currentYear={new Date().getFullYear()} />
      <Analytics />
    </main>
  );
}
