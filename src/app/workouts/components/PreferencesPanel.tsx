import { equipmentOptions, labels } from "../config";
import type { Equipment, Experience, Goal, TrainingPreferences } from "../types";
import { SelectField } from "./SelectField";

export function PreferencesPanel({
  lang,
  prefs,
  updatePrefs,
  recommendedName,
  hasActivityProfile,
}: {
  lang: "bg" | "en";
  prefs: TrainingPreferences;
  updatePrefs: <K extends keyof TrainingPreferences>(
    key: K,
    value: TrainingPreferences[K],
  ) => void;
  recommendedName: string;
  hasActivityProfile: boolean;
}) {
  return (
    <div className="fit-surface rounded-3xl border border-green-500/25 p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-green-400">
            {lang === "bg" ? "Настрой препоръката" : "Tailor your recommendation"}
          </p>
          <h2 className="mt-1 text-xl font-bold">
            {lang === "bg" ? "Твоят график" : "Your schedule"}
          </h2>
        </div>
        <span className="rounded-xl bg-green-500/10 px-3 py-2 text-xs font-bold text-green-300">
          {recommendedName}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          testId="training-goal"
          label={lang === "bg" ? "Цел" : "Goal"}
          value={prefs.goal}
          onChange={(value) => updatePrefs("goal", value as Goal)}
          options={(Object.keys(labels.goal) as Goal[]).map((value) => ({
            value,
            label: labels.goal[value][lang],
          }))}
        />
        <SelectField
          testId="training-experience"
          label={lang === "bg" ? "Опит" : "Experience"}
          value={prefs.experience}
          onChange={(value) => updatePrefs("experience", value as Experience)}
          options={(Object.keys(labels.experience) as Experience[]).map((value) => ({
            value,
            label: labels.experience[value][lang],
          }))}
        />
        <SelectField
          testId="training-days"
          label={lang === "bg" ? "Дни седмично" : "Days per week"}
          value={String(prefs.days)}
          onChange={(value) => updatePrefs("days", Number(value))}
          options={[2, 3, 4, 5, 6].map((value) => ({
            value: String(value),
            label: `${value} ${lang === "bg" ? "дни" : "days"}`,
          }))}
        />
        <SelectField
          testId="training-minutes"
          label={lang === "bg" ? "Време за тренировка" : "Session length"}
          value={String(prefs.minutes)}
          onChange={(value) => updatePrefs("minutes", Number(value))}
          options={[30, 45, 60, 75, 90].map((value) => ({
            value: String(value),
            label: `${value} min`,
          }))}
        />
        <SelectField
          testId="training-equipment"
          label={lang === "bg" ? "Оборудване" : "Equipment"}
          value={prefs.equipment}
          onChange={(value) => updatePrefs("equipment", value as Equipment)}
          options={equipmentOptions.map((value) => ({
            value,
            label: labels.equipment[value][lang],
          }))}
        />
      </div>
      <p className="mt-4 text-xs leading-relaxed text-gray-400">
        {hasActivityProfile
          ? lang === "bg"
            ? "Включихме и запазеното ти ниво на активност от калкулатора."
            : "We also included your saved calculator activity level."
          : lang === "bg"
            ? "Попълни калкулатора, за да добавим и текущото ти ниво на активност."
            : "Complete the calculator to include your current activity level too."}
      </p>
    </div>
  );
}
