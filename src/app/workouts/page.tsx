"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { useLang } from "@/context/LangContext";
import { translations } from "@/lib/translations";
import { HeaderNav } from "@/app/personal-plan/components/HeaderNav";
import { SiteFooter } from "@/app/personal-plan/components/SiteFooter";

type LocalText = { bg: string; en: string };
type Goal = "maintain" | "lose" | "gain";
type Experience = "beginner" | "intermediate" | "advanced";
type Equipment = "gym" | "dumbbells" | "home" | "bodyweight";
type ExerciseId =
  | "squat" | "hinge" | "push" | "pull" | "verticalPush" | "verticalPull"
  | "lunge" | "glutes" | "core" | "carry" | "arms" | "shoulders"
  | "calves" | "cardio" | "intervals" | "mobility";

type ExerciseTemplate = { id: ExerciseId; prescription: string };
type SessionTemplate = { focus: LocalText; exercises: ExerciseTemplate[] };
type Program = {
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

type TrainingPreferences = {
  goal: Goal;
  experience: Experience;
  days: number;
  minutes: number;
  equipment: Equipment;
};

type CalculatorProfile = { activity?: number; age?: number; calories?: number };

const text = (bg: string, en: string): LocalText => ({ bg, en });
const ex = (id: ExerciseId, prescription: string): ExerciseTemplate => ({ id, prescription });

const exerciseNames: Record<ExerciseId, Record<Equipment, LocalText>> = {
  squat: {
    gym: text("Клек с щанга", "Barbell squat"), dumbbells: text("Гоблет клек", "Goblet squat"),
    home: text("Клек с ластик или дъмбел", "Band or dumbbell squat"), bodyweight: text("Бавен клек със собствено тегло", "Tempo bodyweight squat"),
  },
  hinge: {
    gym: text("Румънска тяга", "Romanian deadlift"), dumbbells: text("Румънска тяга с дъмбели", "Dumbbell Romanian deadlift"),
    home: text("Тяга с дъмбели или ластик", "Band or dumbbell deadlift"), bodyweight: text("Едностранно навеждане", "Single-leg hip hinge"),
  },
  push: {
    gym: text("Лежанка", "Bench press"), dumbbells: text("Лежанка с дъмбели", "Dumbbell bench press"),
    home: text("Лицеви опори или преса на пода", "Push-up or floor press"), bodyweight: text("Лицеви опори", "Push-ups"),
  },
  pull: {
    gym: text("Гребане на скрипец", "Cable row"), dumbbells: text("Гребане с дъмбел", "Dumbbell row"),
    home: text("Гребане с ластик", "Band row"), bodyweight: text("Обратно гребане", "Inverted row"),
  },
  verticalPush: {
    gym: text("Раменна преса", "Overhead press"), dumbbells: text("Раменна преса с дъмбели", "Dumbbell overhead press"),
    home: text("Раменна преса с ластик", "Band overhead press"), bodyweight: text("Пайк лицеви опори", "Pike push-ups"),
  },
  verticalPull: {
    gym: text("Скрипец пред гърди", "Lat pulldown"), dumbbells: text("Пулоувър с дъмбел", "Dumbbell pullover"),
    home: text("Вертикално дърпане с ластик", "Band pulldown"), bodyweight: text("Набирания с помощ", "Assisted pull-ups"),
  },
  lunge: {
    gym: text("Български клек", "Bulgarian split squat"), dumbbells: text("Напади с дъмбели", "Dumbbell lunges"),
    home: text("Обратни напади", "Reverse lunges"), bodyweight: text("Обратни напади", "Reverse lunges"),
  },
  glutes: {
    gym: text("Хип тръст", "Hip thrust"), dumbbells: text("Глутеус мост с дъмбел", "Dumbbell glute bridge"),
    home: text("Глутеус мост с ластик", "Band glute bridge"), bodyweight: text("Едностранен глутеус мост", "Single-leg glute bridge"),
  },
  core: {
    gym: text("Коремна преса на скрипец", "Cable crunch"), dumbbells: text("Фермерски планк", "Dumbbell plank drag"),
    home: text("Dead bug", "Dead bug"), bodyweight: text("Планк", "Plank"),
  },
  carry: {
    gym: text("Фермерска разходка", "Farmer carry"), dumbbells: text("Фермерска разходка", "Farmer carry"),
    home: text("Носене на тежести", "Loaded carry"), bodyweight: text("Мечешко ходене", "Bear crawl"),
  },
  arms: {
    gym: text("Бицепс и трицепс на скрипец", "Cable curl and pressdown"), dumbbells: text("Бицепс и трицепс с дъмбели", "Dumbbell curl and extension"),
    home: text("Бицепс и трицепс с ластик", "Band curl and extension"), bodyweight: text("Тесни лицеви опори", "Close-grip push-ups"),
  },
  shoulders: {
    gym: text("Странично рамо на скрипец", "Cable lateral raise"), dumbbells: text("Странично рамо с дъмбели", "Dumbbell lateral raise"),
    home: text("Странично рамо с ластик", "Band lateral raise"), bodyweight: text("Задържане в стойка до стена", "Wall handstand hold"),
  },
  calves: {
    gym: text("Повдигане за прасец", "Calf raise"), dumbbells: text("Прасец с дъмбели", "Dumbbell calf raise"),
    home: text("Едностранен прасец", "Single-leg calf raise"), bodyweight: text("Едностранен прасец", "Single-leg calf raise"),
  },
  cardio: {
    gym: text("Кардио в разговорно темпо", "Conversational-pace cardio"), dumbbells: text("Бързо ходене", "Brisk walk"),
    home: text("Бързо ходене или колело", "Brisk walk or cycling"), bodyweight: text("Бързо ходене", "Brisk walk"),
  },
  intervals: {
    gym: text("Интервали на пътека или колело", "Treadmill or bike intervals"), dumbbells: text("Интервали с въже или ходене", "Rope or walking intervals"),
    home: text("Интервали ходене/тичане", "Walk/run intervals"), bodyweight: text("Интервали ходене/тичане", "Walk/run intervals"),
  },
  mobility: {
    gym: text("Мобилност за таз и рамене", "Hip and shoulder mobility"), dumbbells: text("Мобилност за цяло тяло", "Full-body mobility"),
    home: text("Мобилност за цяло тяло", "Full-body mobility"), bodyweight: text("Мобилност за цяло тяло", "Full-body mobility"),
  },
};

const programs: Program[] = [
  {
    id: "full-body", icon: "◆", name: text("Цяло тяло", "Full Body"),
    summary: text("Най-практичният старт: всички основни движения във всяка тренировка.", "The practical starting point: all major movement patterns in every workout."),
    level: text("Начинаещи и средно ниво", "Beginner to intermediate"), days: [2, 3], duration: [30, 60],
    goals: ["maintain", "lose", "gain"], experience: ["beginner", "intermediate"], equipment: ["gym", "dumbbells", "home", "bodyweight"],
    sessions: [
      { focus: text("Цяло тяло A", "Full Body A"), exercises: [ex("squat", "3 x 8-12"), ex("push", "3 x 8-12"), ex("pull", "3 x 8-12"), ex("hinge", "2 x 8-10"), ex("core", "3 sets")] },
      { focus: text("Цяло тяло B", "Full Body B"), exercises: [ex("lunge", "3 x 8/side"), ex("verticalPush", "3 x 8-12"), ex("verticalPull", "3 x 8-12"), ex("glutes", "3 x 10-15"), ex("carry", "3 rounds")] },
      { focus: text("Цяло тяло C", "Full Body C"), exercises: [ex("hinge", "3 x 6-10"), ex("push", "3 x 8-12"), ex("pull", "3 x 10-12"), ex("squat", "3 x 10-12"), ex("core", "3 sets")] },
    ],
  },
  {
    id: "upper-lower", icon: "↕", name: text("Горна/долна част", "Upper / Lower"),
    summary: text("Популярна четиридневна схема за добър баланс между сила, мускули и възстановяване.", "A popular four-day split balancing strength, muscle, and recovery."),
    level: text("Средно ниво", "Intermediate"), days: [4], duration: [45, 75], goals: ["maintain", "gain"],
    experience: ["intermediate", "advanced"], equipment: ["gym", "dumbbells", "home"],
    sessions: [
      { focus: text("Горна част - сила", "Upper - strength"), exercises: [ex("push", "4 x 5-8"), ex("pull", "4 x 6-10"), ex("verticalPush", "3 x 6-10"), ex("verticalPull", "3 x 8-12"), ex("arms", "2 x 10-15")] },
      { focus: text("Долна част - сила", "Lower - strength"), exercises: [ex("squat", "4 x 5-8"), ex("hinge", "3 x 6-10"), ex("lunge", "3 x 8/side"), ex("calves", "3 x 12-15"), ex("core", "3 sets")] },
      { focus: text("Горна част - обем", "Upper - volume"), exercises: [ex("push", "3 x 8-12"), ex("verticalPull", "3 x 8-12"), ex("pull", "3 x 10-12"), ex("shoulders", "3 x 12-15"), ex("arms", "3 x 10-15")] },
      { focus: text("Долна част - обем", "Lower - volume"), exercises: [ex("hinge", "3 x 8-10"), ex("squat", "3 x 10-12"), ex("glutes", "3 x 8-12"), ex("lunge", "2 x 10/side"), ex("calves", "3 x 12-15")] },
    ],
  },
  {
    id: "push-pull-legs", icon: "PPL", name: text("Бутане/дърпане/крака", "Push / Pull / Legs"),
    summary: text("Класически сплит с ясен фокус; работи в 3 или 6 тренировъчни дни.", "A classic focused split that works across three or six training days."),
    level: text("Средно и напреднало ниво", "Intermediate to advanced"), days: [3, 5, 6], duration: [45, 75], goals: ["gain", "maintain"],
    experience: ["intermediate", "advanced"], equipment: ["gym", "dumbbells"],
    sessions: [
      { focus: text("Бутане A", "Push A"), exercises: [ex("push", "4 x 6-10"), ex("verticalPush", "3 x 8-10"), ex("shoulders", "3 x 12-15"), ex("arms", "3 x 10-15")] },
      { focus: text("Дърпане A", "Pull A"), exercises: [ex("verticalPull", "4 x 6-10"), ex("pull", "4 x 8-12"), ex("hinge", "3 x 6-10"), ex("arms", "3 x 10-15")] },
      { focus: text("Крака A", "Legs A"), exercises: [ex("squat", "4 x 6-10"), ex("hinge", "3 x 8-10"), ex("lunge", "3 x 8/side"), ex("calves", "3 x 12-15"), ex("core", "3 sets")] },
      { focus: text("Бутане B", "Push B"), exercises: [ex("verticalPush", "4 x 6-10"), ex("push", "3 x 8-12"), ex("shoulders", "3 x 12-15"), ex("arms", "3 x 10-15")] },
      { focus: text("Дърпане B", "Pull B"), exercises: [ex("pull", "4 x 6-10"), ex("verticalPull", "3 x 8-12"), ex("carry", "3 rounds"), ex("arms", "3 x 10-15")] },
      { focus: text("Крака B", "Legs B"), exercises: [ex("hinge", "4 x 6-10"), ex("squat", "3 x 8-12"), ex("glutes", "3 x 8-12"), ex("calves", "3 x 12-15"), ex("core", "3 sets")] },
    ],
  },
  {
    id: "five-by-five", icon: "5x5", name: text("Силова 5x5", "Strength 5x5"),
    summary: text("Проста тридневна програма около базови упражнения и постепенно увеличаване на тежестта.", "A simple three-day program built around compound lifts and gradual loading."),
    level: text("Начинаещи и средно ниво", "Beginner to intermediate"), days: [3], duration: [45, 70], goals: ["gain", "maintain"],
    experience: ["beginner", "intermediate"], equipment: ["gym"],
    sessions: [
      { focus: text("Сила A", "Strength A"), exercises: [ex("squat", "5 x 5"), ex("push", "5 x 5"), ex("pull", "5 x 5"), ex("core", "3 sets")] },
      { focus: text("Сила B", "Strength B"), exercises: [ex("squat", "5 x 5"), ex("verticalPush", "5 x 5"), ex("hinge", "3 x 5"), ex("verticalPull", "3 x 6-10")] },
      { focus: text("Сила C", "Strength C"), exercises: [ex("squat", "5 x 5"), ex("push", "5 x 5"), ex("pull", "5 x 5"), ex("carry", "3 rounds")] },
    ],
  },
  {
    id: "hybrid", icon: "◉", name: text("Хибридна форма", "Hybrid Fitness"),
    summary: text("Съчетава силови тренировки, спокойно кардио и контролирани интервали.", "Combines strength sessions, easy cardio, and controlled intervals."),
    level: text("Всички нива", "All levels"), days: [4, 5], duration: [30, 60], goals: ["lose", "maintain"],
    experience: ["beginner", "intermediate", "advanced"], equipment: ["gym", "dumbbells", "home", "bodyweight"],
    sessions: [
      { focus: text("Цяло тяло A", "Full Body A"), exercises: [ex("squat", "3 x 8-12"), ex("push", "3 x 8-12"), ex("pull", "3 x 8-12"), ex("core", "3 sets")] },
      { focus: text("Спокойно кардио", "Easy Cardio"), exercises: [ex("cardio", "30-45 min"), ex("mobility", "8-10 min")] },
      { focus: text("Цяло тяло B", "Full Body B"), exercises: [ex("hinge", "3 x 8-10"), ex("verticalPush", "3 x 8-12"), ex("verticalPull", "3 x 8-12"), ex("lunge", "3 x 8/side"), ex("core", "3 sets")] },
      { focus: text("Интервали", "Intervals"), exercises: [ex("intervals", "6 x 1 min hard / 2 min easy"), ex("mobility", "8-10 min")] },
      { focus: text("Лека обща тренировка", "Light Full Body"), exercises: [ex("glutes", "3 x 12-15"), ex("push", "3 x 10-15"), ex("pull", "3 x 10-15"), ex("carry", "3 rounds")] },
    ],
  },
  {
    id: "home", icon: "⌂", name: text("Домашна програма", "Home Training"),
    summary: text("Минимално оборудване, ясна прогресия и тренировки, които лесно влизат в графика.", "Minimal equipment, clear progression, and sessions that fit a busy schedule."),
    level: text("Начинаещи и средно ниво", "Beginner to intermediate"), days: [3, 4], duration: [25, 50], goals: ["lose", "maintain", "gain"],
    experience: ["beginner", "intermediate"], equipment: ["dumbbells", "home", "bodyweight"],
    sessions: [
      { focus: text("Домашна A", "Home A"), exercises: [ex("squat", "3 x 10-15"), ex("push", "3 x 8-15"), ex("pull", "3 x 10-15"), ex("glutes", "3 x 12-15"), ex("core", "3 sets")] },
      { focus: text("Домашна B", "Home B"), exercises: [ex("lunge", "3 x 8/side"), ex("verticalPush", "3 x 8-12"), ex("hinge", "3 x 10-15"), ex("verticalPull", "3 x 10-15"), ex("core", "3 sets")] },
      { focus: text("Домашна C", "Home C"), exercises: [ex("squat", "3 x 12-15"), ex("push", "3 x 8-15"), ex("pull", "3 x 10-15"), ex("carry", "3 rounds"), ex("mobility", "8 min")] },
      { focus: text("Кондиция у дома", "Home Conditioning"), exercises: [ex("intervals", "8 x 30 sec / 60 sec easy"), ex("glutes", "3 x 15"), ex("core", "3 sets"), ex("mobility", "8 min")] },
    ],
  },
];

const defaults: TrainingPreferences = { goal: "maintain", experience: "beginner", days: 3, minutes: 45, equipment: "gym" };
const weekDays: Record<number, LocalText[]> = {
  2: [text("Понеделник", "Monday"), text("Четвъртък", "Thursday")],
  3: [text("Понеделник", "Monday"), text("Сряда", "Wednesday"), text("Петък", "Friday")],
  4: [text("Понеделник", "Monday"), text("Вторник", "Tuesday"), text("Четвъртък", "Thursday"), text("Събота", "Saturday")],
  5: [text("Понеделник", "Monday"), text("Вторник", "Tuesday"), text("Сряда", "Wednesday"), text("Петък", "Friday"), text("Събота", "Saturday")],
  6: [text("Понеделник", "Monday"), text("Вторник", "Tuesday"), text("Сряда", "Wednesday"), text("Четвъртък", "Thursday"), text("Петък", "Friday"), text("Събота", "Saturday")],
};

const labels = {
  goal: {
    maintain: text("Поддържане и здраве", "Maintenance & health"), lose: text("Отслабване и форма", "Fat loss & fitness"), gain: text("Сила и мускули", "Strength & muscle"),
  },
  experience: {
    beginner: text("Начинаещ", "Beginner"), intermediate: text("Средно ниво", "Intermediate"), advanced: text("Напреднал", "Advanced"),
  },
  equipment: {
    gym: text("Фитнес зала", "Full gym"), dumbbells: text("Само дъмбели", "Dumbbells"), home: text("Домашно оборудване", "Home equipment"), bodyweight: text("Без оборудване", "Bodyweight"),
  },
};

function scoreProgram(program: Program, prefs: TrainingPreferences, activity?: number) {
  const nearestDays = Math.min(...program.days.map((days) => Math.abs(days - prefs.days)));
  let score = program.days.includes(prefs.days) ? 9 : -nearestDays * 2;
  if (program.goals.includes(prefs.goal)) score += 6;
  if (program.experience.includes(prefs.experience)) score += 4;
  if (program.equipment.includes(prefs.equipment)) score += 5;
  if (prefs.minutes >= program.duration[0] && prefs.minutes <= program.duration[1]) score += 3;
  if ((activity ?? 1.2) <= 1.375 && program.id === "full-body") score += 3;
  return score;
}

export default function WorkoutsPage() {
  const { lang, setLang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<CalculatorProfile | null>(null);
  const [prefs, setPrefs] = useState<TrainingPreferences>(defaults);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const t = translations[lang] || translations.bg;

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang === "bg" || savedLang === "en") setLang(savedLang);
    try {
      const calculator = localStorage.getItem("fittrack-calculator-profile-v1");
      if (calculator) setProfile(JSON.parse(calculator));
      const savedTraining = localStorage.getItem("fittrack-training-preferences-v1");
      const savedPlan = localStorage.getItem("fittrack-active-plan-v2");
      const training = savedTraining ? JSON.parse(savedTraining) as Partial<TrainingPreferences> & { selectedPlanId?: string | null } : null;
      const nutrition = savedPlan ? JSON.parse(savedPlan) as { goal?: Goal } : null;
      setPrefs({ ...defaults, ...(training || {}), goal: training?.goal || nutrition?.goal || defaults.goal });
      if (training?.selectedPlanId) setSelectedPlanId(training.selectedPlanId);
    } catch {
      localStorage.removeItem("fittrack-training-preferences-v1");
    } finally {
      setStorageReady(true);
    }
  }, [setLang]);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem("fittrack-training-preferences-v1", JSON.stringify({ ...prefs, selectedPlanId }));
  }, [prefs, selectedPlanId, storageReady]);

  const recommended = useMemo(() => [...programs].sort((a, b) => scoreProgram(b, prefs, profile?.activity) - scoreProgram(a, prefs, profile?.activity))[0], [prefs, profile]);
  const activePlan = programs.find((program) => program.id === selectedPlanId) || recommended;
  const sessionCount = Math.min(activePlan.sessions.length, activePlan.days.includes(prefs.days) ? prefs.days : activePlan.days.reduce((best, value) => Math.abs(value - prefs.days) < Math.abs(best - prefs.days) ? value : best));
  const schedule = activePlan.sessions.slice(0, sessionCount);
  const scheduleDays = weekDays[sessionCount] || weekDays[3];
  const exerciseLimit = prefs.minutes <= 30 ? 4 : prefs.minutes <= 45 ? 5 : 6;

  const updatePrefs = <K extends keyof TrainingPreferences>(key: K, value: TrainingPreferences[K]) => {
    setPrefs((current) => ({ ...current, [key]: value }));
    setSelectedPlanId(null);
  };

  const toggleLang = () => {
    const next = lang === "bg" ? "en" : "bg";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  return (
    <main className="fit-shell min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 font-sans text-white">
      <HeaderNav t={t} lang={lang} toggleLang={toggleLang} isOpen={isOpen} setIsOpen={setIsOpen} />

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
        <div className="grid items-start gap-7 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-green-400">{lang === "bg" ? "Персонална тренировъчна седмица" : "Your personal training week"}</p>
            <h1 className="fit-title-gradient mt-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              {lang === "bg" ? "План, който пасва на живота ти" : "A plan that fits your life"}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
              {lang === "bg" ? "Избери цел, свободни дни и оборудване. Ще подберем подходяща програма и ще я подредим в реалистичен график." : "Choose your goal, available days, and equipment. We will match a proven program format and place it into a realistic schedule."}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-gray-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">6 {lang === "bg" ? "популярни формата" : "popular formats"}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">{lang === "bg" ? "Автоматично запазване" : "Saved automatically"}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">{lang === "bg" ? "Адаптивни упражнения" : "Adaptive exercises"}</span>
            </div>
          </div>

          <div className="fit-surface rounded-3xl border border-green-500/25 p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-wider text-green-400">{lang === "bg" ? "Настрой препоръката" : "Tailor your recommendation"}</p><h2 className="mt-1 text-xl font-bold">{lang === "bg" ? "Твоят график" : "Your schedule"}</h2></div>
              <span className="rounded-xl bg-green-500/10 px-3 py-2 text-xs font-bold text-green-300">{recommended.name[lang]}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField testId="training-goal" label={lang === "bg" ? "Цел" : "Goal"} value={prefs.goal} onChange={(value) => updatePrefs("goal", value as Goal)} options={(Object.keys(labels.goal) as Goal[]).map((value) => ({ value, label: labels.goal[value][lang] }))} />
              <SelectField testId="training-experience" label={lang === "bg" ? "Опит" : "Experience"} value={prefs.experience} onChange={(value) => updatePrefs("experience", value as Experience)} options={(Object.keys(labels.experience) as Experience[]).map((value) => ({ value, label: labels.experience[value][lang] }))} />
              <SelectField testId="training-days" label={lang === "bg" ? "Дни седмично" : "Days per week"} value={String(prefs.days)} onChange={(value) => updatePrefs("days", Number(value))} options={[2, 3, 4, 5, 6].map((value) => ({ value: String(value), label: `${value} ${lang === "bg" ? "дни" : "days"}` }))} />
              <SelectField testId="training-minutes" label={lang === "bg" ? "Време за тренировка" : "Session length"} value={String(prefs.minutes)} onChange={(value) => updatePrefs("minutes", Number(value))} options={[30, 45, 60, 75].map((value) => ({ value: String(value), label: `${value} min` }))} />
              <div className="sm:col-span-2"><SelectField testId="training-equipment" label={lang === "bg" ? "Оборудване" : "Equipment"} value={prefs.equipment} onChange={(value) => updatePrefs("equipment", value as Equipment)} options={(Object.keys(labels.equipment) as Equipment[]).map((value) => ({ value, label: labels.equipment[value][lang] }))} /></div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-gray-400">
              {profile?.activity ? (lang === "bg" ? "Включихме и запазеното ти ниво на активност от калкулатора." : "We also included your saved calculator activity level.") : (lang === "bg" ? "Попълни калкулатора, за да добавим и текущото ти ниво на активност." : "Complete the calculator to include your current activity level too.")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-wider text-green-400">{lang === "bg" ? "Най-популярни програми" : "Most popular programs"}</p><h2 className="mt-1 text-2xl font-bold sm:text-3xl">{lang === "bg" ? "Избери тренировъчен формат" : "Choose a training format"}</h2></div>
          <button type="button" onClick={() => setSelectedPlanId(null)} className="min-h-11 rounded-xl border border-green-500/30 px-4 text-sm font-semibold text-green-300 hover:bg-green-500/10">{lang === "bg" ? "Използвай препоръката" : "Use recommendation"}</button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => {
            const selected = activePlan.id === program.id;
            const isRecommended = recommended.id === program.id;
            return (
              <button key={program.id} type="button" onClick={() => setSelectedPlanId(program.id)} className={`relative min-h-48 rounded-2xl border p-5 text-left transition ${selected ? "border-green-400 bg-green-500/10 shadow-lg shadow-green-950/20" : "border-white/10 bg-gray-900/70 hover:border-green-400/35"}`}>
                {isRecommended && <span className="absolute right-4 top-4 rounded-full bg-green-500 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-black">{lang === "bg" ? "За теб" : "For you"}</span>}
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-sm font-black text-green-300">{program.icon}</span>
                <span className="mt-4 block pr-16 text-lg font-bold">{program.name[lang]}</span>
                <span className="mt-2 block text-sm leading-relaxed text-gray-400">{program.summary[lang]}</span>
                <span className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wide text-green-300"><span>{program.days.join("/")} {lang === "bg" ? "дни" : "days"}</span><span>•</span><span>{program.duration[0]}-{program.duration[1]} min</span></span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="fit-surface overflow-hidden rounded-3xl border border-green-500/20">
          <div className="border-b border-white/10 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-wider text-green-400">{selectedPlanId ? (lang === "bg" ? "Твоят избор" : "Your choice") : (lang === "bg" ? "Най-добро съвпадение" : "Best match")}</p><h2 className="mt-1 text-2xl font-black">{activePlan.name[lang]}</h2><p className="mt-2 max-w-2xl text-sm text-gray-400">{activePlan.summary[lang]}</p></div>
              <div className="grid grid-cols-3 gap-2 text-center"><Stat value={String(sessionCount)} label={lang === "bg" ? "дни" : "days"} /><Stat value={`${prefs.minutes}`} label="min" /><Stat value={labels.equipment[prefs.equipment][lang]} label={lang === "bg" ? "уреди" : "equipment"} /></div>
            </div>
            <div className="mt-4 rounded-xl border border-green-500/15 bg-green-500/[0.06] p-3 text-xs leading-relaxed text-green-100/80">
              {lang === "bg" ? `Подбрано за цел „${labels.goal[prefs.goal].bg}", ${prefs.days} свободни дни и ${prefs.minutes} минути на тренировка. Упражненията са адаптирани за: ${labels.equipment[prefs.equipment].bg}.` : `Matched to your ${labels.goal[prefs.goal].en.toLowerCase()} goal, ${prefs.days} available days, and ${prefs.minutes}-minute sessions. Exercises are adapted for: ${labels.equipment[prefs.equipment].en}.`}
            </div>
          </div>
          <div className="grid gap-px bg-white/5 md:grid-cols-2">
            {schedule.map((session, index) => (
              <article key={`${activePlan.id}-${index}`} className="bg-gray-900/95 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-wider text-green-400">{scheduleDays[index]?.[lang] || `${lang === "bg" ? "Ден" : "Day"} ${index + 1}`}</p><span className="text-[10px] text-gray-500">~{prefs.minutes} min</span></div>
                <h3 className="mt-1 text-lg font-bold">{session.focus[lang]}</h3>
                <ul className="mt-4 space-y-2.5">
                  {session.exercises.slice(0, exerciseLimit).map((exercise) => <li key={`${exercise.id}-${exercise.prescription}`} className="flex gap-2 text-sm text-gray-300"><span className="mt-0.5 text-green-400">✓</span><span>{exerciseNames[exercise.id][prefs.equipment][lang]} <span className="text-gray-500">- {exercise.prescription}</span></span></li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <InfoBlock number="01" title={lang === "bg" ? "Започни с резерв" : "Start with reps in reserve"} text={lang === "bg" ? "През първите седмици завършвай сериите с усещане, че можеш да направиш още 2-3 чисти повторения." : "For the first weeks, finish sets feeling that you could complete another 2-3 clean repetitions."} />
          <InfoBlock number="02" title={lang === "bg" ? "Прогресирай постепенно" : "Progress gradually"} text={lang === "bg" ? "Когато покриеш горната граница повторения с добра техника, добави малко тежест или едно повторение." : "When you reach the top of the rep range with good form, add a small amount of load or one repetition."} />
          <InfoBlock number="03" title={lang === "bg" ? "Пази възстановяването" : "Protect recovery"} text={lang === "bg" ? "Оставяй поне ден между тежки тренировки за едни и същи мускули и намали обема при натрупана умора." : "Leave at least a day between hard sessions for the same muscles and reduce volume when fatigue accumulates."} />
        </div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-gray-400">
          {lang === "bg" ? "За общо здраве добавяй умерено движение през седмицата и тренирай основните мускулни групи поне два дни. Започни с малко и увеличавай постепенно. При травма, заболяване, бременност, остра болка или замайване потърси подходящ медицински съвет." : "For general health, include moderate activity through the week and train the major muscle groups on at least two days. Start small and build gradually. Seek appropriate medical advice for injury, illness, pregnancy, sharp pain, or dizziness."}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-green-500/25 bg-gradient-to-r from-green-500/10 to-teal-500/5 p-6 text-center sm:p-8">
          <h2 className="text-2xl font-bold">{lang === "bg" ? "Свържи тренировките с храненето" : "Connect training and nutrition"}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400">{lang === "bg" ? "Запази актуални данните си в калкулатора и използвай персоналния хранителен план според същата цел." : "Keep your calculator profile current and use the personal nutrition plan with the same goal."}</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/calculator" className="fit-secondary-button min-h-11 rounded-xl border border-green-500/30 px-5 py-3 text-sm font-semibold text-green-200">{lang === "bg" ? "Калкулатор" : "Calculator"}</Link><Link href="/personal-plan" className="fit-primary-button min-h-11 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-black">{lang === "bg" ? "Персонален хранителен план" : "Personal nutrition plan"}</Link></div>
        </div>
      </section>

      <SiteFooter t={t} currentYear={new Date().getFullYear()} />
      <Analytics />
    </main>
  );
}

function SelectField({ testId, label, value, onChange, options }: { testId: string; label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500">{label}</span><select data-testid={testId} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-gray-950 px-3 text-sm font-semibold text-white outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-500/15">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="min-w-20 rounded-xl border border-white/5 bg-black/15 p-2"><p className="truncate text-sm font-black text-white">{value}</p><p className="text-[9px] uppercase tracking-wide text-gray-500">{label}</p></div>;
}

function InfoBlock({ number, title, text: body }: { number: string; title: string; text: string }) {
  return <article className="fit-surface rounded-2xl border border-white/10 p-5"><span className="text-xs font-black text-green-400">{number}</span><h3 className="mt-2 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-gray-400">{body}</p></article>;
}
