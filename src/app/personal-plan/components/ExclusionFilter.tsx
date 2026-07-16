import { AnimatePresence, motion } from "framer-motion";
import type { ExcludedSource } from "../types";

const excludeIcons: Record<ExcludedSource, string> = {
  chicken: "🐔",
  beef: "🐄",
  pork: "🐖",
  lamb: "🐑",
  fish: "🐟",
  supplement: "💊",
  vegan: "🌱",
  egg: "🥚",
  dairy: "🥛",
};

type ExclusionFilterProps = {
  t: any;
  excludedSources: ExcludedSource[];
  setExcludedSources: (updater: (current: ExcludedSource[]) => ExcludedSource[]) => void;
  sourceOptions: { source: ExcludedSource; label: string }[];
  showExcludedOptions: boolean;
  setShowExcludedOptions: (updater: (open: boolean) => boolean) => void;
};

export function ExclusionFilter({
  t,
  excludedSources,
  setExcludedSources,
  sourceOptions,
  showExcludedOptions,
  setShowExcludedOptions,
}: ExclusionFilterProps) {
  return (
    <div className="relative min-w-0">
      <span className="mb-2 block text-sm font-medium text-gray-200">{t.Main.meatFilterLabel}</span>
      <button
        type="button"
        onClick={() => setShowExcludedOptions((open) => !open)}
        aria-expanded={showExcludedOptions}
        className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm shadow-sm transition ${
          excludedSources.length
            ? "border-green-400 bg-green-500/10 text-green-200"
            : "border-green-500/30 bg-gray-900/60 text-gray-300 hover:border-green-400/60 hover:bg-gray-800"
        }`}
      >
        {excludedSources.length ? (
          <span className="flex flex-wrap items-center gap-1">
            {excludedSources.slice(0, 4).map((source) => (
              <span
                key={source}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-xs"
                title={sourceOptions.find((option) => option.source === source)?.label}
              >
                {excludeIcons[source]}
              </span>
            ))}
            {excludedSources.length > 4 && (
              <span className="text-xs font-semibold text-green-300">+{excludedSources.length - 4}</span>
            )}
          </span>
        ) : (
          <span>{t.Main.meatOptions.all}</span>
        )}
        <span className={`shrink-0 text-green-400 transition-transform ${showExcludedOptions ? "rotate-180" : ""}`}>⌄</span>
      </button>

      <AnimatePresence>
        {showExcludedOptions && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="relative z-30 mt-2 grid w-full grid-cols-1 gap-1.5 rounded-xl border border-green-500/30 bg-gray-950/95 p-3 shadow-xl backdrop-blur sm:absolute sm:right-0 sm:w-[300px] sm:grid-cols-2"
          >
            {sourceOptions.map(({ source, label }) => {
              const active = excludedSources.includes(source);
              return (
                <button
                  key={source}
                  type="button"
                  onClick={() =>
                    setExcludedSources((current) =>
                      current.includes(source) ? current.filter((item) => item !== source) : [...current, source]
                    )
                  }
                  aria-pressed={active}
                  className={`flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${
                    active
                      ? "border-green-400 bg-green-500/15 text-green-300"
                      : "border-white/10 bg-gray-800/60 text-gray-300 hover:border-green-400/40 hover:text-green-200"
                  }`}
                >
                  <span aria-hidden="true">{excludeIcons[source]}</span>
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

