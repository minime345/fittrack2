import type { Program } from "../types";
import { text, ex } from "../types";

export const programs: Program[] = [
  {
    id: "full-body",
    icon: "◆",
    name: text("Цяло тяло", "Full Body"),
    summary: text(
      "Най-практичният старт: всички основни движения във всяка тренировка.",
      "The practical starting point: all major movement patterns in every workout.",
    ),
    level: text("Начинаещи и средно ниво", "Beginner to intermediate"),
    days: [2, 3],
    duration: [30, 60],
    goals: ["maintain", "lose", "gain"],
    experience: ["beginner", "intermediate"],
    equipment: [
      "gym",
      "dumbbells",
      "home",
      "bodyweight",
      "resistanceBands",
      "trx",
    ],
    sessions: [
      {
        focus: text("Цяло тяло A", "Full Body A"),
        exercises: [
          ex("squat", "3 x 8-12"),
          ex("push", "3 x 8-12"),
          ex("pull", "3 x 8-12"),
          ex("hinge", "2 x 8-10"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Цяло тяло B", "Full Body B"),
        exercises: [
          ex("lunge", "3 x 8/side"),
          ex("verticalPush", "3 x 8-12"),
          ex("verticalPull", "3 x 8-12"),
          ex("glutes", "3 x 10-15"),
          ex("carry", "3 rounds"),
        ],
      },
      {
        focus: text("Цяло тяло C", "Full Body C"),
        exercises: [
          ex("hinge", "3 x 6-10"),
          ex("push", "3 x 8-12"),
          ex("pull", "3 x 10-12"),
          ex("squat", "3 x 10-12"),
          ex("core", "3 sets"),
        ],
      },
    ],
  },
  {
    id: "upper-lower",
    icon: "↕",
    name: text("Горна/долна част", "Upper / Lower"),
    summary: text(
      "Популярна четиридневна схема за добър баланс между сила, мускули и възстановяване.",
      "A popular four-day split balancing strength, muscle, and recovery.",
    ),
    level: text("Средно ниво", "Intermediate"),
    days: [4],
    duration: [45, 75],
    goals: ["maintain", "gain"],
    experience: ["intermediate", "advanced"],
    equipment: ["gym", "dumbbells", "home"],
    sessions: [
      {
        focus: text("Горна част - сила", "Upper - strength"),
        exercises: [
          ex("push", "4 x 5-8"),
          ex("pull", "4 x 6-10"),
          ex("verticalPush", "3 x 6-10"),
          ex("verticalPull", "3 x 8-12"),
          ex("arms", "2 x 10-15"),
        ],
      },
      {
        focus: text("Долна част - сила", "Lower - strength"),
        exercises: [
          ex("squat", "4 x 5-8"),
          ex("hinge", "3 x 6-10"),
          ex("lunge", "3 x 8/side"),
          ex("calves", "3 x 12-15"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Горна част - обем", "Upper - volume"),
        exercises: [
          ex("push", "3 x 8-12"),
          ex("verticalPull", "3 x 8-12"),
          ex("pull", "3 x 10-12"),
          ex("shoulders", "3 x 12-15"),
          ex("arms", "3 x 10-15"),
        ],
      },
      {
        focus: text("Долна част - обем", "Lower - volume"),
        exercises: [
          ex("hinge", "3 x 8-10"),
          ex("squat", "3 x 10-12"),
          ex("glutes", "3 x 8-12"),
          ex("lunge", "2 x 10/side"),
          ex("calves", "3 x 12-15"),
        ],
      },
    ],
  },
  {
    id: "push-pull-legs",
    icon: "PPL",
    name: text("Бутане/дърпане/крака", "Push / Pull / Legs"),
    summary: text(
      "Класически сплит с ясен фокус; работи в 3 или 6 тренировъчни дни.",
      "A classic focused split that works across three or six training days.",
    ),
    level: text("Средно и напреднало ниво", "Intermediate to advanced"),
    days: [3, 5, 6],
    duration: [45, 75],
    goals: ["gain", "maintain"],
    experience: ["intermediate", "advanced"],
    equipment: ["gym", "dumbbells"],
    sessions: [
      {
        focus: text("Бутане A", "Push A"),
        exercises: [
          ex("push", "4 x 6-10"),
          ex("verticalPush", "3 x 8-10"),
          ex("shoulders", "3 x 12-15"),
          ex("arms", "3 x 10-15"),
        ],
      },
      {
        focus: text("Дърпане A", "Pull A"),
        exercises: [
          ex("verticalPull", "4 x 6-10"),
          ex("pull", "4 x 8-12"),
          ex("hinge", "3 x 6-10"),
          ex("arms", "3 x 10-15"),
        ],
      },
      {
        focus: text("Крака A", "Legs A"),
        exercises: [
          ex("squat", "4 x 6-10"),
          ex("hinge", "3 x 8-10"),
          ex("lunge", "3 x 8/side"),
          ex("calves", "3 x 12-15"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Бутане B", "Push B"),
        exercises: [
          ex("verticalPush", "4 x 6-10"),
          ex("push", "3 x 8-12"),
          ex("shoulders", "3 x 12-15"),
          ex("arms", "3 x 10-15"),
        ],
      },
      {
        focus: text("Дърпане B", "Pull B"),
        exercises: [
          ex("pull", "4 x 6-10"),
          ex("verticalPull", "3 x 8-12"),
          ex("carry", "3 rounds"),
          ex("arms", "3 x 10-15"),
        ],
      },
      {
        focus: text("Крака B", "Legs B"),
        exercises: [
          ex("hinge", "4 x 6-10"),
          ex("squat", "3 x 8-12"),
          ex("glutes", "3 x 8-12"),
          ex("calves", "3 x 12-15"),
          ex("core", "3 sets"),
        ],
      },
    ],
  },
  {
    id: "five-by-five",
    icon: "5x5",
    name: text("Силова 5x5", "Strength 5x5"),
    summary: text(
      "Проста тридневна програма около базови упражнения и постепенно увеличаване на тежестта.",
      "A simple three-day program built around compound lifts and gradual loading.",
    ),
    level: text("Начинаещи и средно ниво", "Beginner to intermediate"),
    days: [3],
    duration: [45, 70],
    goals: ["gain", "maintain"],
    experience: ["beginner", "intermediate"],
    equipment: ["gym"],
    sessions: [
      {
        focus: text("Сила A", "Strength A"),
        exercises: [
          ex("squat", "5 x 5"),
          ex("push", "5 x 5"),
          ex("pull", "5 x 5"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Сила B", "Strength B"),
        exercises: [
          ex("squat", "5 x 5"),
          ex("verticalPush", "5 x 5"),
          ex("hinge", "3 x 5"),
          ex("verticalPull", "3 x 6-10"),
        ],
      },
      {
        focus: text("Сила C", "Strength C"),
        exercises: [
          ex("squat", "5 x 5"),
          ex("push", "5 x 5"),
          ex("pull", "5 x 5"),
          ex("carry", "3 rounds"),
        ],
      },
    ],
  },
  {
    id: "hybrid",
    icon: "◉",
    name: text("Хибридна форма", "Hybrid Fitness"),
    summary: text(
      "Съчетава силови тренировки, спокойно кардио и контролирани интервали.",
      "Combines strength sessions, easy cardio, and controlled intervals.",
    ),
    level: text("Всички нива", "All levels"),
    days: [4, 5],
    duration: [30, 60],
    goals: ["lose", "maintain"],
    experience: ["beginner", "intermediate", "advanced"],
    equipment: ["gym", "dumbbells", "home", "bodyweight", "kettlebell"],
    sessions: [
      {
        focus: text("Цяло тяло A", "Full Body A"),
        exercises: [
          ex("squat", "3 x 8-12"),
          ex("push", "3 x 8-12"),
          ex("pull", "3 x 8-12"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Спокойно кардио", "Easy Cardio"),
        exercises: [ex("cardio", "30-45 min"), ex("mobility", "8-10 min")],
      },
      {
        focus: text("Цяло тяло B", "Full Body B"),
        exercises: [
          ex("hinge", "3 x 8-10"),
          ex("verticalPush", "3 x 8-12"),
          ex("verticalPull", "3 x 8-12"),
          ex("lunge", "3 x 8/side"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Интервали", "Intervals"),
        exercises: [
          ex("intervals", "6 x 1 min hard / 2 min easy"),
          ex("mobility", "8-10 min"),
        ],
      },
      {
        focus: text("Лека обща тренировка", "Light Full Body"),
        exercises: [
          ex("glutes", "3 x 12-15"),
          ex("push", "3 x 10-15"),
          ex("pull", "3 x 10-15"),
          ex("carry", "3 rounds"),
        ],
      },
    ],
  },
  {
    id: "home",
    icon: "⌂",
    name: text("Домашна програма", "Home Training"),
    summary: text(
      "Минимално оборудване, ясна прогресия и тренировки, които лесно влизат в графика.",
      "Minimal equipment, clear progression, and sessions that fit a busy schedule.",
    ),
    level: text("Начинаещи и средно ниво", "Beginner to intermediate"),
    days: [3, 4],
    duration: [25, 50],
    goals: ["lose", "maintain", "gain"],
    experience: ["beginner", "intermediate"],
    equipment: [
      "dumbbells",
      "home",
      "bodyweight",
      "resistanceBands",
      "trx",
      "kettlebell",
    ],
    sessions: [
      {
        focus: text("Домашна A", "Home A"),
        exercises: [
          ex("squat", "3 x 10-15"),
          ex("push", "3 x 8-15"),
          ex("pull", "3 x 10-15"),
          ex("glutes", "3 x 12-15"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Домашна B", "Home B"),
        exercises: [
          ex("lunge", "3 x 8/side"),
          ex("verticalPush", "3 x 8-12"),
          ex("hinge", "3 x 10-15"),
          ex("verticalPull", "3 x 10-15"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Домашна C", "Home C"),
        exercises: [
          ex("squat", "3 x 12-15"),
          ex("push", "3 x 8-15"),
          ex("pull", "3 x 10-15"),
          ex("carry", "3 rounds"),
          ex("mobility", "8 min"),
        ],
      },
      {
        focus: text("Кондиция у дома", "Home Conditioning"),
        exercises: [
          ex("intervals", "8 x 30 sec / 60 sec easy"),
          ex("glutes", "3 x 15"),
          ex("core", "3 sets"),
          ex("mobility", "8 min"),
        ],
      },
    ],
  },
  {
    id: "street-fitness",
    icon: "SW",
    name: text("Street Fitness", "Street Fitness"),
    summary: text(
      "Сила и атлетичност с набирания, кофички, лицеви опори и прогресии със собствено тегло.",
      "Bodyweight strength and athleticism through pull-ups, dips, push-ups, and progressive skills.",
    ),
    level: text("Всички нива", "All levels"),
    days: [3, 4, 5],
    duration: [30, 60],
    goals: ["maintain", "gain", "lose"],
    experience: ["beginner", "intermediate", "advanced"],
    equipment: ["bodyweight", "streetWorkout", "rings"],
    sessions: [
      {
        focus: text("Бутане", "Push"),
        exercises: [
          ex("dip", "4 x 6-12"),
          ex("push", "4 x 8-20"),
          ex("verticalPush", "3 x 6-12"),
          ex("handstand", "10 min"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Дърпане", "Pull"),
        exercises: [
          ex("pullUp", "4 x 5-12"),
          ex("pull", "4 x 8-15"),
          ex("muscleUp", "10 min technique"),
          ex("arms", "3 x 10-15"),
          ex("lSit", "4 holds"),
        ],
      },
      {
        focus: text("Крака и корем", "Legs & Core"),
        exercises: [
          ex("pistolSquat", "4 x 5-10/side"),
          ex("lunge", "3 x 10/side"),
          ex("glutes", "3 x 12-20"),
          ex("calves", "4 x 15-25"),
          ex("core", "4 sets"),
        ],
      },
      {
        focus: text("Умения", "Skills"),
        exercises: [
          ex("handstand", "15 min"),
          ex("muscleUp", "15 min"),
          ex("lSit", "5 holds"),
          ex("mobility", "10 min"),
        ],
      },
      {
        focus: text("Street кондиция", "Street Conditioning"),
        exercises: [
          ex("burpee", "6 x 10"),
          ex("pullUp", "5 x submax"),
          ex("dip", "5 x submax"),
          ex("running", "15-25 min"),
        ],
      },
    ],
  },
  {
    id: "calisthenics-skills",
    icon: "CS",
    name: text("Калистеника и умения", "Calisthenics Skills"),
    summary: text(
      "Технически прогресии за стойка на ръце, мъсъл-ъп, L-sit и контрол на тялото.",
      "Technical progressions for handstands, muscle-ups, L-sits, and body control.",
    ),
    level: text("Средно и напреднало ниво", "Intermediate to advanced"),
    days: [3, 4],
    duration: [40, 70],
    goals: ["maintain", "gain"],
    experience: ["intermediate", "advanced"],
    equipment: ["bodyweight", "streetWorkout", "rings"],
    sessions: [
      {
        focus: text("Стойка и бутане", "Handstand & Push"),
        exercises: [
          ex("handstand", "15-20 min"),
          ex("verticalPush", "4 x 5-10"),
          ex("dip", "4 x 6-12"),
          ex("push", "3 x 10-20"),
          ex("mobility", "10 min"),
        ],
      },
      {
        focus: text("Мъсъл-ъп и дърпане", "Muscle-up & Pull"),
        exercises: [
          ex("muscleUp", "15-20 min"),
          ex("pullUp", "5 x 4-10"),
          ex("pull", "4 x 8-15"),
          ex("lSit", "4 holds"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Крака и баланс", "Legs & Balance"),
        exercises: [
          ex("pistolSquat", "5 x 4-8/side"),
          ex("lunge", "3 x 10/side"),
          ex("glutes", "3 x 12-15"),
          ex("calves", "4 x 15-20"),
          ex("mobility", "12 min"),
        ],
      },
      {
        focus: text("Техника за цяло тяло", "Full-body Technique"),
        exercises: [
          ex("handstand", "12 min"),
          ex("muscleUp", "12 min"),
          ex("lSit", "5 holds"),
          ex("pullUp", "3 x submax"),
          ex("dip", "3 x submax"),
        ],
      },
    ],
  },
  {
    id: "functional",
    icon: "FX",
    name: text("Функционална форма", "Functional Fitness"),
    summary: text(
      "Движения за сила, баланс, стабилност, мощност и ежедневна физическа готовност.",
      "Strength, balance, stability, power, and conditioning for real-world fitness.",
    ),
    level: text("Всички нива", "All levels"),
    days: [3, 4, 5],
    duration: [30, 60],
    goals: ["lose", "maintain", "gain"],
    experience: ["beginner", "intermediate", "advanced"],
    equipment: [
      "gym",
      "dumbbells",
      "home",
      "bodyweight",
      "kettlebell",
      "trx",
      "resistanceBands",
    ],
    sessions: [
      {
        focus: text("Сила и носене", "Strength & Carry"),
        exercises: [
          ex("squat", "4 x 6-10"),
          ex("push", "3 x 8-12"),
          ex("pull", "3 x 8-12"),
          ex("carry", "4 rounds"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Мощност и кондиция", "Power & Conditioning"),
        exercises: [
          ex("kettlebellSwing", "5 x 15"),
          ex("boxJump", "5 x 5"),
          ex("burpee", "5 x 8"),
          ex("intervals", "8 x 45 sec / 75 sec"),
        ],
      },
      {
        focus: text("Едностранна сила", "Unilateral Strength"),
        exercises: [
          ex("lunge", "4 x 8/side"),
          ex("hinge", "3 x 8-10"),
          ex("verticalPush", "3 x 8-12"),
          ex("pull", "3 x 10-12"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Издръжливост", "Work Capacity"),
        exercises: [
          ex("sledPush", "6 rounds"),
          ex("carry", "5 rounds"),
          ex("jumpRope", "10 min"),
          ex("mobility", "10 min"),
        ],
      },
      {
        focus: text("Леко възстановяване", "Recovery Flow"),
        exercises: [
          ex("cardio", "25-35 min"),
          ex("mobility", "15 min"),
          ex("core", "3 easy sets"),
        ],
      },
    ],
  },
  {
    id: "powerbuilding",
    icon: "PB",
    name: text("Powerbuilding", "Powerbuilding"),
    summary: text(
      "Комбинация от тежки базови движения и обем за мускулна маса.",
      "A blend of heavy compound lifting and hypertrophy-focused accessory work.",
    ),
    level: text("Средно и напреднало ниво", "Intermediate to advanced"),
    days: [4, 5],
    duration: [60, 90],
    goals: ["gain", "maintain"],
    experience: ["intermediate", "advanced"],
    equipment: ["gym", "dumbbells"],
    sessions: [
      {
        focus: text("Клек и крака", "Squat & Legs"),
        exercises: [
          ex("squat", "5 x 3-6"),
          ex("hinge", "3 x 6-10"),
          ex("lunge", "3 x 8/side"),
          ex("calves", "4 x 12-20"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Лежанка и горна част", "Bench & Upper"),
        exercises: [
          ex("push", "5 x 3-6"),
          ex("pull", "4 x 8-12"),
          ex("verticalPush", "3 x 8-10"),
          ex("arms", "4 x 10-15"),
          ex("shoulders", "3 x 12-15"),
        ],
      },
      {
        focus: text("Тяга и гръб", "Deadlift & Back"),
        exercises: [
          ex("hinge", "5 x 3-5"),
          ex("verticalPull", "4 x 6-10"),
          ex("pull", "4 x 8-12"),
          ex("carry", "3 rounds"),
          ex("arms", "3 x 10-15"),
        ],
      },
      {
        focus: text("Обем за цяло тяло", "Full-body Volume"),
        exercises: [
          ex("squat", "3 x 8-12"),
          ex("push", "3 x 8-12"),
          ex("verticalPull", "3 x 8-12"),
          ex("glutes", "3 x 10-15"),
          ex("shoulders", "3 x 12-15"),
        ],
      },
      {
        focus: text("Допълнителен обем", "Accessory Volume"),
        exercises: [
          ex("lunge", "3 x 10/side"),
          ex("pull", "3 x 12"),
          ex("arms", "4 x 12-15"),
          ex("calves", "4 x 15-20"),
          ex("core", "3 sets"),
        ],
      },
    ],
  },
  {
    id: "bodybuilding",
    icon: "BB",
    name: text("Класически бодибилдинг", "Classic Bodybuilding"),
    summary: text(
      "Традиционен сплит по мускулни групи за максимален обем и хипертрофия в 4 или 5 дни.",
      "A traditional muscle-group split for maximum volume and hypertrophy across 4 or 5 days.",
    ),
    level: text("Средно и напреднало ниво", "Intermediate to advanced"),
    days: [4, 5],
    duration: [45, 75],
    goals: ["gain", "maintain"],
    experience: ["intermediate", "advanced"],
    equipment: ["gym", "dumbbells"],
    sessions: [
      {
        focus: text("Гърди и трицепс", "Chest & Triceps"),
        exercises: [
          ex("push", "4 x 8-12"),
          ex("dip", "3 x 8-12"),
          ex("verticalPush", "3 x 10-12"),
          ex("arms", "3 x 12-15"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Гръб и бицепс", "Back & Biceps"),
        exercises: [
          ex("pull", "4 x 8-12"),
          ex("pullUp", "3 x 6-12"),
          ex("verticalPull", "3 x 10-12"),
          ex("arms", "3 x 12-15"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Крака", "Legs"),
        exercises: [
          ex("squat", "4 x 8-12"),
          ex("hinge", "3 x 8-10"),
          ex("lunge", "3 x 10/side"),
          ex("glutes", "3 x 10-15"),
          ex("calves", "4 x 15-20"),
        ],
      },
      {
        focus: text("Рамене и корем", "Shoulders & Abs"),
        exercises: [
          ex("verticalPush", "4 x 8-10"),
          ex("shoulders", "4 x 12-15"),
          ex("pull", "3 x 12-15"),
          ex("core", "4 sets"),
        ],
      },
      {
        focus: text("Ръце и корем", "Arms & Core"),
        exercises: [
          ex("arms", "4 x 12-15"),
          ex("dip", "4 x 10-15"),
          ex("calves", "3 x 15-20"),
          ex("core", "4 sets"),
        ],
      },
    ],
  },
  {
    id: "hyrox",
    icon: "HX",
    name: text("HYROX подготовка", "HYROX Training"),
    summary: text(
      "Бягане, функционални станции и силова издръжливост в състезателен формат.",
      "Running, functional stations, and strength endurance in a race-focused format.",
    ),
    level: text("Средно и напреднало ниво", "Intermediate to advanced"),
    days: [4, 5, 6],
    duration: [45, 80],
    goals: ["lose", "maintain"],
    experience: ["intermediate", "advanced"],
    equipment: ["gym", "kettlebell", "dumbbells", "bodyweight"],
    sessions: [
      {
        focus: text("Бягане и сила", "Run & Strength"),
        exercises: [
          ex("running", "4 x 1 km easy-moderate"),
          ex("squat", "4 x 8"),
          ex("push", "4 x 10"),
          ex("carry", "4 rounds"),
        ],
      },
      {
        focus: text("Станции", "Stations"),
        exercises: [
          ex("sledPush", "6 rounds"),
          ex("kettlebellSwing", "5 x 20"),
          ex("burpee", "5 x 12"),
          ex("lunge", "4 x 20 steps"),
        ],
      },
      {
        focus: text("Леко бягане", "Easy Run"),
        exercises: [ex("running", "35-50 min"), ex("mobility", "12 min")],
      },
      {
        focus: text("Силова издръжливост", "Strength Endurance"),
        exercises: [
          ex("hinge", "4 x 10"),
          ex("verticalPull", "4 x 10"),
          ex("verticalPush", "4 x 10"),
          ex("carry", "5 rounds"),
          ex("core", "4 sets"),
        ],
      },
      {
        focus: text("HYROX симулация", "HYROX Simulation"),
        exercises: [
          ex("running", "6 x 800 m"),
          ex("sledPush", "4 rounds"),
          ex("burpee", "4 x 10"),
          ex("carry", "4 rounds"),
          ex("lunge", "4 x 20 steps"),
        ],
      },
      {
        focus: text("Възстановяване", "Recovery"),
        exercises: [ex("cycling", "30-40 min easy"), ex("mobility", "15 min")],
      },
    ],
  },
  {
    id: "boxing-conditioning",
    icon: "BX",
    name: text("Боксова кондиция", "Boxing Conditioning"),
    summary: text(
      "Боксова техника, работа с крака, интервали и упражнения за цялото тяло.",
      "Boxing technique, footwork, intervals, and full-body conditioning.",
    ),
    level: text("Всички нива", "All levels"),
    days: [3, 4, 5],
    duration: [25, 60],
    goals: ["lose", "maintain"],
    experience: ["beginner", "intermediate", "advanced"],
    equipment: ["bodyweight", "home", "gym"],
    sessions: [
      {
        focus: text("Техника и крака", "Technique & Footwork"),
        exercises: [
          ex("shadowBoxing", "6 x 3 min"),
          ex("jumpRope", "10 min"),
          ex("mobility", "10 min"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Боксова кондиция", "Boxing Conditioning"),
        exercises: [
          ex("shadowBoxing", "8 x 2 min hard"),
          ex("burpee", "5 x 10"),
          ex("push", "4 x 12-20"),
          ex("squat", "4 x 15-20"),
        ],
      },
      {
        focus: text("Сила за боксьори", "Boxer Strength"),
        exercises: [
          ex("lunge", "3 x 10/side"),
          ex("pull", "4 x 10-15"),
          ex("verticalPush", "3 x 8-12"),
          ex("carry", "4 rounds"),
          ex("core", "4 sets"),
        ],
      },
      {
        focus: text("Интервали", "Intervals"),
        exercises: [
          ex("jumpRope", "10 x 1 min"),
          ex("shadowBoxing", "6 x 3 min"),
          ex("intervals", "8 x 30 sec / 60 sec"),
        ],
      },
      {
        focus: text("Лека техника", "Light Technique"),
        exercises: [
          ex("shadowBoxing", "20-30 min easy"),
          ex("mobility", "15 min"),
        ],
      },
    ],
  },
  {
    id: "hiit-circuit",
    icon: "HIIT",
    name: text("HIIT кръгова тренировка", "HIIT Circuit"),
    summary: text(
      "Кратки интервали с висока интензивност, редувани с възстановяване, за ефективна тренировка на цялото тяло.",
      "Short high-intensity intervals alternated with recovery for a time-efficient full-body workout.",
    ),
    level: text("Всички нива", "All levels"),
    days: [2, 3, 4],
    duration: [20, 45],
    goals: ["lose", "maintain"],
    experience: ["beginner", "intermediate", "advanced"],
    equipment: ["bodyweight", "home", "gym", "dumbbells", "kettlebell"],
    sessions: [
      {
        focus: text("Цяло тяло", "Full-body Circuit"),
        exercises: [
          ex("squat", "4 x 40 sec / 20 sec easy"),
          ex("push", "4 x 40 sec / 20 sec easy"),
          ex("pull", "4 x 40 sec / 20 sec easy"),
          ex("burpee", "4 x 30 sec / 30 sec easy"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Долна част и кардио", "Lower Body & Cardio"),
        exercises: [
          ex("lunge", "4 x 40 sec / 20 sec easy"),
          ex("glutes", "4 x 40 sec / 20 sec easy"),
          ex("jumpRope", "6 x 1 min / 30 sec easy"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Сила и кондиция", "Strength & Conditioning"),
        exercises: [
          ex("hinge", "4 x 10-15"),
          ex("verticalPush", "4 x 8-12"),
          ex("carry", "4 rounds"),
          ex("intervals", "8 x 30 sec / 60 sec easy"),
        ],
      },
      {
        focus: text("Кратък кондиционен кръг", "Quick Conditioning Circuit"),
        exercises: [
          ex("kettlebellSwing", "5 x 15"),
          ex("boxJump", "5 x 6"),
          ex("push", "5 x 10"),
          ex("mobility", "10 min"),
        ],
      },
    ],
  },
  {
    id: "beginner-5k",
    icon: "5K",
    name: text("От ходене до 5 км", "Walk to 5K"),
    summary: text(
      "Постепенна тридневна програма за начинаещи, която преминава от редуване на ходене и бягане към 30 минути непрекъснато леко бягане.",
      "A gradual three-day beginner plan that progresses from walk-run intervals toward 30 minutes of continuous easy running.",
    ),
    level: text("Начинаещи", "Beginner"),
    days: [3],
    duration: [25, 40],
    goals: ["lose", "maintain"],
    experience: ["beginner"],
    equipment: ["bodyweight", "home"],
    sessions: [
      {
        focus: text("Кратки интервали", "Short Run-Walk Intervals"),
        exercises: [
          ex("cardio", "5 min brisk walk"),
          ex("running", "8 x 1 min run / 90 sec walk"),
          ex("cardio", "5 min easy walk"),
          ex("mobility", "5-8 min"),
        ],
      },
      {
        focus: text("Изграждане на ритъм", "Build Your Rhythm"),
        exercises: [
          ex("cardio", "5 min brisk walk"),
          ex("running", "6 x 2 min run / 2 min walk"),
          ex("cardio", "5 min easy walk"),
          ex("core", "2 easy sets"),
        ],
      },
      {
        focus: text("По-дълго леко усилие", "Longer Easy Effort"),
        exercises: [
          ex("cardio", "5 min brisk walk"),
          ex("running", "3 x 5 min easy / 3 min walk"),
          ex("cardio", "5 min easy walk"),
          ex("mobility", "8 min"),
        ],
      },
    ],
  },
  {
    id: "mobility",
    icon: "MV",
    name: text("Мобилност и гъвкавост", "Mobility & Flexibility"),
    summary: text(
      "Нискоинтензивни сесии за подвижност, контрол, стойка и активно възстановяване.",
      "Low-intensity sessions for mobility, control, posture, and active recovery.",
    ),
    level: text("Всички нива", "All levels"),
    days: [2, 3, 4, 5, 6],
    duration: [20, 45],
    goals: ["maintain", "lose"],
    experience: ["beginner", "intermediate", "advanced"],
    equipment: ["bodyweight", "home", "resistanceBands"],
    sessions: [
      {
        focus: text("Таз и глезени", "Hips & Ankles"),
        exercises: [
          ex("mobility", "25-35 min"),
          ex("glutes", "3 x 15"),
          ex("calves", "3 x 15"),
        ],
      },
      {
        focus: text("Рамене и гръб", "Shoulders & Spine"),
        exercises: [
          ex("mobility", "25-35 min"),
          ex("pull", "3 x 15"),
          ex("core", "3 easy sets"),
        ],
      },
      {
        focus: text("Цяло тяло", "Full Body"),
        exercises: [
          ex("mobility", "30-40 min"),
          ex("squat", "3 x 10 slow"),
          ex("hinge", "3 x 10 slow"),
        ],
      },
      {
        focus: text("Баланс и контрол", "Balance & Control"),
        exercises: [
          ex("pistolSquat", "3 x 5 assisted"),
          ex("handstand", "10 min supported"),
          ex("core", "3 sets"),
          ex("mobility", "15 min"),
        ],
      },
      {
        focus: text("Активно възстановяване", "Active Recovery"),
        exercises: [ex("cardio", "20-30 min easy"), ex("mobility", "15 min")],
      },
      {
        focus: text("Кратък mobility flow", "Short Mobility Flow"),
        exercises: [ex("mobility", "20-25 min")],
      },
    ],
  },
  {
    id: "endurance",
    icon: "EN",
    name: text("Издръжливост", "Endurance"),
    summary: text(
      "Структурирано бягане или колоездене със силова поддръжка и възстановяване.",
      "Structured running or cycling with supportive strength and recovery work.",
    ),
    level: text("Всички нива", "All levels"),
    days: [3, 4, 5, 6],
    duration: [30, 90],
    goals: ["lose", "maintain"],
    experience: ["beginner", "intermediate", "advanced"],
    equipment: ["bodyweight", "home", "gym", "dumbbells"],
    sessions: [
      {
        focus: text("Леко кардио", "Easy Endurance"),
        exercises: [ex("running", "30-60 min easy"), ex("mobility", "10 min")],
      },
      {
        focus: text("Силова поддръжка", "Support Strength"),
        exercises: [
          ex("squat", "3 x 8-12"),
          ex("hinge", "3 x 8-10"),
          ex("lunge", "3 x 8/side"),
          ex("calves", "4 x 15"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Темпо", "Tempo"),
        exercises: [
          ex("running", "3 x 8 min tempo / 3 min easy"),
          ex("mobility", "10 min"),
        ],
      },
      {
        focus: text("Крос тренировка", "Cross Training"),
        exercises: [
          ex("cycling", "40-60 min easy-moderate"),
          ex("core", "3 sets"),
        ],
      },
      {
        focus: text("Дълга сесия", "Long Session"),
        exercises: [ex("running", "50-90 min easy"), ex("mobility", "12 min")],
      },
      {
        focus: text("Възстановяване", "Recovery"),
        exercises: [
          ex("cardio", "20-30 min very easy"),
          ex("mobility", "15 min"),
        ],
      },
    ],
  },
];
