import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Meal } from "../types";

type MealModalProps = {
  t: any;
  lang: "bg" | "en";
  showModal: boolean;
  selectedMeal: Meal | null;
  setShowModal: (show: boolean) => void;
  onWeightChange: (weight: number) => void;
};

export function MealModal({ t, lang, showModal, selectedMeal, setShowModal, onWeightChange }: MealModalProps) {
  return (
    <AnimatePresence>
      {showModal && selectedMeal && (
        <motion.div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fit-surface bg-gray-900 text-white rounded-3xl w-[92%] max-w-md shadow-2xl border border-green-500/50 flex flex-col overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900 sticky top-0 z-10">
              <h2 className="text-green-400 text-xl font-semibold flex items-center gap-2">
                {selectedMeal.icon} {selectedMeal.name[lang]}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
              {selectedMeal.recipe && (
                <p className="text-sm mb-3 text-gray-300">{selectedMeal.recipe[lang]}</p>
              )}
              <div className="text-sm text-gray-400 space-y-1 font-mono">
                <div>{t.Main.calories} <span className="text-white">{selectedMeal.kcal}</span> kcal</div>
                <div>{t.Main.proteinLabel} <span className="text-white">{selectedMeal.protein}</span> g</div>
                <div>{t.Main.carb}<span className="text-white">{selectedMeal.carbs}</span> g</div>
                <div>{t.Main.fat} <span className="text-white">{selectedMeal.fat}</span> g</div>
                <label className="mt-3 block text-gray-300">
                  {lang === "bg" ? "Тегло на порцията" : "Portion weight"}
                  {selectedMeal.fixedPortion ? (
                    <div className="mt-1 text-white">
                      {selectedMeal.weight} g <span className="text-xs text-gray-400">({lang === "bg" ? "готова опаковка" : "packaged serving"})</span>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="number"
                        min="50"
                        max="2000"
                        step="50"
                        value={selectedMeal.weight}
                        onChange={(event) => onWeightChange(Number(event.target.value))}
                        className="w-28 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-white"
                      />
                      <span>g</span>
                    </div>
                  )}
                </label>
              </div>
              <div className="mt-5">
                <h3 className="mb-2 font-semibold text-green-400">
                  {lang === "bg" ? "Съставки за тази порция" : "Ingredients for this portion"}
                </h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  {selectedMeal.ingredients.map((ingredient, index) => (
                    <li key={`${ingredient.name[lang]}-${index}`} className="flex justify-between gap-4">
                      <span>{ingredient.name[lang]}</span>
                      <span className="whitespace-nowrap text-white">{ingredient.amount} {ingredient.unit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {selectedMeal && (
                <Link
                  href={`${selectedMeal.link || `/meals/${selectedMeal.slug}`}?portion=${selectedMeal.weight}`}
                  className="mt-5 block rounded-lg bg-green-500 px-4 py-2 text-center font-semibold text-black hover:bg-green-400"
                >
                  {lang === "bg" ? "Отвори рецептата за тази порция" : "Open recipe for this portion"}
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
