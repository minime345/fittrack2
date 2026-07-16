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
  return getProgramMatch(program, prefs, activity).score;
}

export function getProgramMatch(
  program: Program,
  prefs: TrainingPreferences,
  activity?: number,
) {
  const nearestDays = Math.min(
    ...program.days.map((days) => Math.abs(days - prefs.days)),
  );
  const minuteDistance =
    prefs.minutes < program.duration[0]
      ? program.duration[0] - prefs.minutes
      : prefs.minutes > program.duration[1]
        ? prefs.minutes - program.duration[1]
        : 0;
  const experienceOrder = ["beginner", "intermediate", "advanced"] as const;
  const preferredExperience = experienceOrder.indexOf(prefs.experience);
  const experienceDistance = Math.min(
    ...program.experience.map((level) =>
      Math.abs(experienceOrder.indexOf(level) - preferredExperience),
    ),
  );

  const goalScore = program.goals.includes(prefs.goal) ? 25 : 0;
  const equipmentScore = program.equipment.includes(prefs.equipment) ? 25 : 0;
  const dayScore = Math.max(0, 20 - nearestDays * 8);
  const experienceScore = Math.max(0, 15 - experienceDistance * 8);
  const durationScore = Math.max(0, 10 - Math.ceil(minuteDistance / 5) * 2);
  let activityScore = 3;
  if (activity !== undefined) {
    const isLowerActivity = activity <= 1.375;
    const suitableForCurrentActivity = isLowerActivity
      ? program.experience.includes("beginner") && Math.min(...program.days) <= 3
      : program.experience.includes("intermediate") ||
        program.experience.includes("advanced");
    activityScore = suitableForCurrentActivity ? 5 : 2;
  }

  return {
    score: Math.round(
      goalScore +
        equipmentScore +
        dayScore +
        experienceScore +
        durationScore +
        activityScore,
    ),
    matches: {
      goal: goalScore > 0,
      equipment: equipmentScore > 0,
      days: nearestDays === 0,
      experience: experienceDistance === 0,
      duration: minuteDistance === 0,
      activityProfile: activity !== undefined && activityScore === 5,
    },
  };
}
