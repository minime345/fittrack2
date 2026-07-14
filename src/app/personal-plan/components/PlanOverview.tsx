import Link from "next/link";
import { motion } from "framer-motion";
import type { Diet, ExcludedSource, Goal } from "../types";
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
  dietLabels: Record<Diet, string>;
  dietIcons: Record<Diet, string>;
  excludedSources: ExcludedSource[];
  setExcludedSources: (updater: (current: ExcludedSource[]) => ExcludedSource[]) => void;
  sourceOptions: { source: ExcludedSource; label: string }[];
  showExcludedOptions: boolean;
  setShowExcludedOptions: (updater: (open: boolean) => boolean) => void;
};

export function PlanOverview(props: Props) {
  const { t, lang, baseCalories, proteinMin, proteinMax, goal, setGoal, goalLabels, diet, setDiet, dietLabels,
    dietIcons, excludedSources, setExcludedSources, sourceOptions, showExcludedOptions, setShowExcludedOptions } = props;

  return (
    <div className="mb-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center sm:text-left">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-green-400/80">
          {lang === "bg" ? "Твоят седмичен режим" : "Your weekly nutrition plan"}
        </p>
        <h1 className="fit-title-gradient text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">{t.Main.heading}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-400 sm:mx-0 sm:text-base">
          {lang === "bg" ? "Настрой целта и предпочитанията си. Планът и списъкът за пазаруване се обновяват автоматично." : "Adjust your goal and preferences. Your plan and shopping list update automatically."}
        </p>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.6fr]">
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
              <p className="mt-1 truncate font-semibold text-green-300">{goalLabels[goal]}</p>
            </div>
          </div>
          {baseCalories === 2000 && (
            <Link href="/calculator" className="fit-secondary-button mt-4 flex items-center justify-between border border-yellow-400/20 px-3 py-2 text-xs text-yellow-200">
              <span>{t.Main.warning}</span><span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        <div className="fit-surface rounded-3xl border border-white/10 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <GoalSelector t={t} goal={goal} goalLabels={goalLabels} setGoal={setGoal} />
            <ExclusionFilter t={t} excludedSources={excludedSources} setExcludedSources={setExcludedSources} sourceOptions={sourceOptions} showExcludedOptions={showExcludedOptions} setShowExcludedOptions={setShowExcludedOptions} />
          </div>
          <div className="mt-6 border-t border-white/10 pt-5">
            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">{t.Main.dietLabel}</label>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
              {(Object.entries(dietLabels) as [Diet, string][]).map(([key, label]) => (
                <button key={key} type="button" onClick={() => setDiet(key)} aria-pressed={diet === key}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${diet === key ? "border-green-400/70 bg-green-500/15 text-green-200 shadow-[0_0_20px_rgba(34,197,94,0.08)]" : "border-white/10 bg-black/15 text-gray-300 hover:border-green-400/35 hover:bg-green-500/5"}`}>
                  <span className="text-base">{dietIcons[key]}</span>{label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <details className="group mt-4 rounded-2xl border border-green-500/15 bg-green-500/[0.04] open:bg-gray-900/70">
        <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 marker:content-none">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-300" aria-hidden="true">?</span>
          <span className="flex-1 text-sm font-semibold text-green-300">{t.Main.infoHeading}</span>
          <span className="text-xs text-gray-500 transition group-open:rotate-180" aria-hidden="true">⌄</span>
        </summary>
        <ul className="grid gap-2 border-t border-white/5 px-4 py-4 sm:grid-cols-2">
          {t.Main.infoItems.map((item: string, index: number) => (
            <li key={index} className="flex gap-2 rounded-xl border border-white/5 bg-black/10 p-3 text-xs leading-relaxed text-gray-300">
              <span className="mt-0.5 text-green-400" aria-hidden="true">✓</span><span>{item}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
