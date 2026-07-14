import Link from "next/link";

type PlanGuideProps = {
  lang: "bg" | "en";
  hasCalculatedTarget: boolean;
};

const guideContent = {
  bg: {
    eyebrow: "Кратко ръководство",
    title: "Направи плана подходящ за теб",
    intro: "Следвай стъпките по ред. Настройките се прилагат само когато генерираш нов план, а текущият остава запазен.",
    calculator: "Отвори калкулатора",
    calculated: "Калориите са взети от калкулатора",
    steps: [
      ["Задай точни калории", "Използвай калкулатора за дневна цел според твоите данни и активност."],
      ["Избери цел", "Поддържане, отслабване или покачване задава новата дневна калорийна цел."],
      ["Настрой храненето", "Избери режим и изключи нежелани храни, после натисни „Генерирай нов план“."],
      ["Прегледай седмицата", "Следи калориите и макросите за всеки ден. Малка разлика от целта е нормална за реалистични порции."],
      ["Промени ястие или порция", "Натисни името за рецепта и грамаж. Използвай ↻ за подобно ястие, без голям калориен скок."],
      ["Подготви седмицата", "Отвори списъка за пазаруване или изтегли PDF. Те използват текущите ястия и порции."],
    ],
    tip: "Съвет: планът се пази, когато отвориш рецепта и се върнеш назад.",
  },
  en: {
    eyebrow: "Quick guide",
    title: "Make the plan work for you",
    intro: "Follow these steps in order. Settings apply only when you regenerate, while the current plan stays saved.",
    calculator: "Open calculator",
    calculated: "Calories imported from the calculator",
    steps: [
      ["Set an accurate target", "Use the calculator to set daily calories from your measurements and activity level."],
      ["Choose your goal", "Maintain, lose, or gain sets the new daily calorie target."],
      ["Set food preferences", "Choose a diet and exclusions, then select “Regenerate plan” to apply them."],
      ["Review the week", "Check each day's calories and macros. A small difference from the target keeps portions practical."],
      ["Change a meal or portion", "Select a meal name for its recipe and weight. Use ↻ for a similar calorie-aware replacement."],
      ["Prepare your week", "Open the shopping list or download the PDF. Both use your current meals and portions."],
    ],
    tip: "Tip: your plan stays saved when you open a recipe and return to this page.",
  },
} as const;

const stepIcons = ["◎", "↗", "◫", "▦", "↻", "✓"];

export function PlanGuide({ lang, hasCalculatedTarget }: PlanGuideProps) {
  const copy = guideContent[lang];

  return (
    <details open className="group mb-6 overflow-hidden rounded-3xl border border-green-500/20 bg-gray-900/65 shadow-lg">
      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 marker:content-none sm:px-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-500/15 text-xl text-green-300">?</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-green-400/80">{copy.eyebrow}</span>
          <span className="mt-0.5 block text-base font-bold text-white sm:text-lg">{copy.title}</span>
        </span>
        <span className="text-gray-400 transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
      </summary>

      <div className="border-t border-white/5 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-gray-400">{copy.intro}</p>
          {hasCalculatedTarget ? (
            <span className="shrink-0 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-300">
              ✓ {copy.calculated}
            </span>
          ) : (
            <Link href="/calculator" className="fit-secondary-button shrink-0 px-4 py-2 text-center text-xs font-semibold text-green-300">
              {copy.calculator} →
            </Link>
          )}
        </div>

        <ol className="mt-5 grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
          {copy.steps.map(([title, description], index) => (
            <li key={title} className="flex gap-3 rounded-2xl border border-white/5 bg-black/15 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-sm font-bold text-green-300">
                {stepIcons[index]}
              </span>
              <span>
                <span className="block text-sm font-semibold text-gray-100">{index + 1}. {title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-gray-400">{description}</span>
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-4 rounded-xl border border-blue-400/10 bg-blue-400/5 px-3 py-2 text-xs text-blue-200/80">{copy.tip}</p>
      </div>
    </details>
  );
}
