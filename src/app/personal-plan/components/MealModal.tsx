import { motion, AnimatePresence } from "framer-motion";
import type { Meal } from "../types";

type MealModalProps = {
  t: any;
  lang: "bg" | "en";
  showModal: boolean;
  selectedMeal: Meal | null;
  setShowModal: (show: boolean) => void;
};

export function MealModal({ t, lang, showModal, selectedMeal, setShowModal }: MealModalProps) {
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
            className="bg-gray-900 text-white rounded-xl w-[90%] max-w-md shadow-lg border border-green-500 flex flex-col overflow-hidden"
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
                <div>Тегло: <span className="text-white">{selectedMeal.weight}</span> g</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
