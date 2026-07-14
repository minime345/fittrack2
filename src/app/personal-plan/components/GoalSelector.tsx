import { motion } from "framer-motion";
import type { Goal } from "../types";

const goalIcons: Record<Goal, string> = {
  maintain: "⚖️",
  lose: "🔥",
  gain: "💪",
};

type GoalSelectorProps = {
  t: any;
  goal: Goal;
  goalLabels: Record<Goal, string>;
  setGoal: (goal: Goal) => void;
};

export function GoalSelector({ t, goal, goalLabels, setGoal }: GoalSelectorProps) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-medium text-gray-200">{t.Main.goalLabel}</label>
      <div className="grid w-full grid-cols-3 gap-1 rounded-xl border border-green-500/30 bg-gray-950/60 p-1 shadow-inner">
        {(Object.entries(goalLabels) as [Goal, string][]).map(([key, label]) => {
          const active = goal === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setGoal(key)}
              aria-pressed={active}
              className="relative min-w-0 rounded-lg px-1.5 py-2 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-green-400 sm:px-3 sm:text-sm"
            >
              {active && (
                <motion.span
                  layoutId="goal-pill-bg"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400 to-teal-400"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className={`relative z-10 flex min-w-0 items-center justify-center gap-1 ${active ? "text-black" : "text-gray-300 hover:text-green-300"}`}>
                <span className="hidden sm:inline" aria-hidden="true">{goalIcons[key]}</span>
                <span className="truncate">{label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
