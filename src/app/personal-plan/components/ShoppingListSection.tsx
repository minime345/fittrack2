import type { ShoppingIngredient } from "../planLogic";

type ShoppingListSectionProps = {
  t: any;
  lang: "bg" | "en";
  show: boolean;
  items: ShoppingIngredient[];
  onClose: () => void;
};

export function ShoppingListSection({ t, lang, show, items, onClose }: ShoppingListSectionProps) {
  if (!show) return null;
  return (
    <section id="shopping-list" className="mx-auto max-w-5xl scroll-mt-24 px-4 py-6 sm:px-6">
      <div className="fit-surface overflow-hidden rounded-3xl border border-green-500/25 bg-gray-900/90 text-white shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-green-400 sm:text-lg">🛒 {t.Main.shoppingTitle}</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              {items.length} {lang === "bg" ? "продукта за седмицата" : "items for the week"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-gray-300 transition hover:border-green-400/30 hover:text-white"
          >
            {lang === "bg" ? "Затвори" : "Close"} ×
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, idx) => (
            <li key={`${item.name}-${idx}`} className="flex min-w-0 items-center justify-between gap-2 bg-gray-900/95 px-3 py-2.5">
              <span className="min-w-0 break-words text-xs font-medium leading-tight text-gray-200 sm:text-sm">{item.name}</span>
              <span className="shrink-0 rounded-lg bg-green-500/10 px-2 py-1 text-[11px] font-bold text-green-300">
                {item.amount} {item.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
