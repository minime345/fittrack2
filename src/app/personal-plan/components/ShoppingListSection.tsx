import type { ShoppingIngredient } from "../planLogic";

type ShoppingListSectionProps = {
  t: any;
  show: boolean;
  items: ShoppingIngredient[];
};

export function ShoppingListSection({ t, show, items }: ShoppingListSectionProps) {
  if (!show) return null;
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-gray-800 p-4 rounded-xl shadow-md border border-green-500 text-white">
        <h2 className="text-green-400 text-lg font-semibold mb-4"> 🛒 {t.Main.shoppingTitle} </h2>
        <ul className="space-y-2 list-disc list-inside">
          {items.map((item, idx) => (
            <li key={idx} className="text-gray-300">
              <span className="text-white font-medium">{item.name}</span> – {item.amount} {item.unit}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
