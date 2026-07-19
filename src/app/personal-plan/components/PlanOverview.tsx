import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Diet, ExcludedSource, Goal, PlanStyle } from "../types";
import { getTargetCalories } from "../planLogic";
import { GoalSelector } from "./GoalSelector";
import { ExclusionFilter } from "./ExclusionFilter";

type Props = {
  t: any;
  lang: "bg" | "en";
  baseCalories: number;
  proteinMin: number;
  proteinMax: number;
  goal: Goal;
  setGoal: (goal: Goal) => void;
  goalLabels: Record<Goal, string>;
  diet: Diet;
  setDiet: (diet: Diet) => void;
  planStyle: PlanStyle;
  setPlanStyle: (style: PlanStyle) => void;
  dietLabels: Record<Diet, string>;
  dietIcons: Record<Diet, string>;
  excludedSources: ExcludedSource[];
  setExcludedSources: (updater: (current: ExcludedSource[]) => ExcludedSource[]) => void;
  sourceOptions: { source: ExcludedSource; label: string }[];
  showExcludedOptions: boolean;
  setShowExcludedOptions: (updater: (open: boolean) => boolean) => void;
  hasCalculatedTarget: boolean;
};

export function PlanOverview(props: Props) {
  const { t, lang, baseCalories, proteinMin, proteinMax, goal, setGoal, goalLabels, diet, setDiet, planStyle, setPlanStyle, dietLabels,
    dietIcons, excludedSources, setExcludedSources, sourceOptions, showExcludedOptions, setShowExcludedOptions, hasCalculatedTarget } = props;

  return (
    <div className="mb-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="fit-surface mb-5 grid overflow-hidden rounded-3xl border border-white/10 md:grid-cols-[1.08fr_0.92fr]">
        <div className="flex flex-col justify-center p-5 text-center sm:p-7 sm:text-left">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-green-400/80">
            {lang === "bg" ? "Твоят седмичен режим" : "Your weekly nutrition plan"}
          </p>
          <h1 className="fit-title-gradient text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">{t.Main.heading}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-400 sm:mx-0 sm:text-base">
            {lang === "bg" ? "Настрой целта и предпочитанията си. Планът се обновява само при промяна и остава запазен при навигация." : "Adjust your goal and preferences. The plan updates only when they change and stays saved during navigation."}
          </p>
        </div>
        <div className="relative min-h-40 overflow-hidden border-t border-white/10 md:min-h-52 md:border-l md:border-t-0">
          <Image src="/brand/personal-plan-meal-prep.webp" alt={lang === "bg" ? "Подготвени балансирани ястия и седмичен планер" : "Prepared balanced meals beside a weekly planner"} fill priority sizes="(max-width: 768px) 100vw, 44vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent md:bg-gradient-to-r" aria-hidden="true" />
        </div>
      </motion.div>

      <div className="grid items-start gap-4 lg:grid-cols-[0.72fr_1.6fr]">
        <div className="fit-surface relative overflow-hidden rounded-3xl border border-green-500/25 p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-green-400/10 blur-3xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{lang === "bg" ? "Дневна цел" : "Daily target"}</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-5xl font-black tracking-tight text-white sm:text-6xl">{getTargetCalories(goal, baseCalories)}</span>
            <span className="mb-2 text-sm font-semibold text-green-400">kcal</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
              <p className="text-[10px] uppercase tracking-wider text-gray-500">{t.Main.proteinLabel}</p>
              <p className="mt-1 font-semibold text-blue-200">{proteinMin}–{proteinMax} g</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
              <p className="text-[10px] uppercase tracking-wider text-gray-500">{t.Main.goalLabel}</p>
              <p className="mt-1 whitespace-normal break-words font-semibold leading-snug text-green-300">
                {goalLabels[goal]}
              </p>
            </div>
          </div>
          {!hasCalculatedTarget && (
            <Link href="/calculator" className="fit-secondary-button mt-4 flex items-center justify-between border border-yellow-400/20 px-3 py-2 text-xs text-yellow-200">
              <span>{t.Main.warning}</span><span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        <details open className="fit-surface group rounded-3xl border border-white/10 p-5 sm:p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 marker:content-none">
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-green-400">
                {lang === "bg" ? "Настройки" : "Preferences"}
              </span>
              <span className="mt-1 block text-lg font-bold text-white">
                {lang === "bg" ? "Персонализирай плана" : "Customize your plan"}
              </span>
              <span className="mt-1 block text-xs text-gray-400">
                {goalLabels[goal]} · {dietLabels[diet]}
              </span>
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-300 transition group-open:rotate-180" aria-hidden="true">⌄</span>
          </summary>
          <div className="mt-5 grid gap-5 border-t border-white/10 pt-5 xl:grid-cols-2">
            <GoalSelector t={t} goal={goal} goalLabels={goalLabels} setGoal={setGoal} />
            <ExclusionFilter t={t} excludedSources={excludedSources} setExcludedSources={setExcludedSources} sourceOptions={sourceOptions} showExcludedOptions={showExcludedOptions} setShowExcludedOptions={setShowExcludedOptions} />
          </div>
          <div className="mt-6 border-t border-white/10 pt-5">
            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">{t.Main.dietLabel}</label>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {(Object.entries(dietLabels) as [Diet, string][]).map(([key, label]) => (
                <button key={key} type="button" onClick={() => setDiet(key)} aria-pressed={diet === key}
                  className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-medium transition sm:px-3 sm:py-2 sm:text-sm ${diet === key ? "border-green-400/70 bg-green-500/15 text-green-200 shadow-[0_0_20px_rgba(34,197,94,0.08)]" : "border-white/10 bg-black/15 text-gray-300 hover:border-green-400/35 hover:bg-green-500/5"}`}>
                  <span className="text-base">{dietIcons[key]}</span><span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 border-t border-white/10 pt-5">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
              {lang === "bg" ? "Разнообразие през седмицата" : "Weekly variety"}
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {(["very-simple", "simple", "diverse"] as PlanStyle[]).map((style) => {
                const selected = planStyle === style;
                const simple = style === "simple";
                const verySimple = style === "very-simple";
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setPlanStyle(style)}
                    aria-pressed={selected}
                    className={`rounded-xl border px-3 py-2.5 text-left transition ${selected ? "border-green-400/70 bg-green-500/15" : "border-white/10 bg-black/15 hover:border-green-400/35"}`}
                  >
                    <span className={`block text-sm font-semibold ${selected ? "text-green-200" : "text-gray-200"}`}>
                      {verySimple ? "▣ " : simple ? "◫ " : "✦ "}
                      {verySimple
                        ? (lang === "bg" ? "Лесна подготовка" : "Easy prep")
                        : simple
                          ? (lang === "bg" ? "Балансирана седмица" : "Balanced week")
                          : (lang === "bg" ? "Нови рецепти" : "Recipe explorer")}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-gray-500">
                      {verySimple
                        ? (lang === "bg" ? "Най-много общи продукти" : "Most ingredient reuse")
                        : simple
                          ? (lang === "bg" ? "Разнообразие с общи продукти" : "Variety with shared groceries")
                          : (lang === "bg" ? "Най-широк избор от ястия" : "The widest meal selection")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </details>
      </div>

    </div>
  );
}
