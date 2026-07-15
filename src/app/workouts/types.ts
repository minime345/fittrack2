export type LocalText = { bg: string; en: string };

export type Goal = "maintain" | "lose" | "gain";
export type Experience = "beginner" | "intermediate" | "advanced";
export type Equipment =
  | "gym"
  | "dumbbells"
  | "home"
  | "bodyweight"
  | "streetWorkout"
  | "rings"
  | "kettlebell"
  | "trx"
  | "resistanceBands";

export type ExerciseId =
  | "squat"
  | "hinge"
  | "push"
  | "pull"
  | "verticalPush"
  | "verticalPull"
  | "lunge"
  | "glutes"
  | "core"
  | "carry"
  | "arms"
  | "shoulders"
  | "calves"
  | "cardio"
  | "intervals"
  | "mobility"
  | "pullUp"
  | "dip"
  | "muscleUp"
  | "handstand"
  | "lSit"
  | "pistolSquat"
  | "burpee"
  | "boxJump"
  | "kettlebellSwing"
  | "turkishGetUp"
  | "sledPush"
  | "shadowBoxing"
  | "jumpRope"
  | "running"
  | "cycling";

export type ExerciseTemplate = { id: ExerciseId; prescription: string };
export type SessionTemplate = { focus: LocalText; exercises: ExerciseTemplate[] };
export type Program = {
  id: string;
  icon: string;
  name: LocalText;
  summary: LocalText;
  level: LocalText;
  days: number[];
  duration: [number, number];
  goals: Goal[];
  experience: Experience[];
  equipment: Equipment[];
  sessions: SessionTemplate[];
};

export type TrainingPreferences = {
  goal: Goal;
  experience: Experience;
  days: number;
  minutes: number;
  equipment: Equipment;
};

export type CalculatorProfile = { activity?: number; age?: number; calories?: number };

export const text = (bg: string, en: string): LocalText => ({ bg, en });
export const ex = (id: ExerciseId, prescription: string): ExerciseTemplate => ({
  id,
  prescription,
});
