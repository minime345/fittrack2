import type { Equipment, LocalText, Program, TrainingPreferences } from "./types";
import { text } from "./types";

export const defaults: TrainingPreferences = {
  goal: "maintain",
  experience: "beginner",
  days: 3,
  minutes: 45,
  equipment: "gym",
};
export const weekDays: Record<number, LocalText[]> = {
  2: [text("Понеделник", "Monday"), text("Четвъртък", "Thursday")],
  3: [
    text("Понеделник", "Monday"),
    text("Сряда", "Wednesday"),
    text("Петък", "Friday"),
  ],
  4: [
    text("Понеделник", "Monday"),
    text("Вторник", "Tuesday"),
    text("Четвъртък", "Thursday"),
    text("Събота", "Saturday"),
  ],
  5: [
    text("Понеделник", "Monday"),
    text("Вторник", "Tuesday"),
    text("Сряда", "Wednesday"),
    text("Петък", "Friday"),
    text("Събота", "Saturday"),
  ],
  6: [
    text("Понеделник", "Monday"),
    text("Вторник", "Tuesday"),
    text("Сряда", "Wednesday"),
    text("Четвъртък", "Thursday"),
    text("Петък", "Friday"),
    text("Събота", "Saturday"),
  ],
};

export const labels = {
  goal: {
    maintain: text("Поддържане и здраве", "Maintenance & health"),
    lose: text("Отслабване и форма", "Fat loss & fitness"),
    gain: text("Сила и мускули", "Strength & muscle"),
  },
  experience: {
    beginner: text("Начинаещ", "Beginner"),
    intermediate: text("Средно ниво", "Intermediate"),
    advanced: text("Напреднал", "Advanced"),
  },
  equipment: {
    gym: text("Фитнес зала", "Full gym"),
    dumbbells: text("Само дъмбели", "Dumbbells"),
    home: text("Домашно оборудване", "Home equipment"),
    bodyweight: text("Без оборудване", "Bodyweight"),
    streetWorkout: text("Лостове и успоредка", "Street workout park"),
    rings: text("Гимнастически халки", "Gymnastic rings"),
    kettlebell: text("Пудовки", "Kettlebells"),
    trx: text("TRX / окачване", "TRX / suspension trainer"),
    resistanceBands: text("Ластици", "Resistance bands"),
  },
};

export const equipmentOptions: Equipment[] = [
  "gym",
  "dumbbells",
  "home",
  "bodyweight",
  "streetWorkout",
];

export function scoreProgram(
  program: Program,
  prefs: TrainingPreferences,
  activity?: number,
) {
  const nearestDays = Math.min(
    ...program.days.map((days) => Math.abs(days - prefs.days)),
  );
  let score = program.days.includes(prefs.days) ? 9 : -nearestDays * 2;
  if (program.goals.includes(prefs.goal)) score += 6;
  if (program.experience.includes(prefs.experience)) score += 4;
  if (program.equipment.includes(prefs.equipment)) score += 5;
  if (
    prefs.minutes >= program.duration[0] &&
    prefs.minutes <= program.duration[1]
  )
    score += 3;
  if ((activity ?? 1.2) <= 1.375 && program.id === "full-body") score += 3;
  return score;
}
