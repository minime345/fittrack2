import type { Equipment, ExerciseId, LocalText } from "../types";
import { text } from "../types";

const exerciseNames: Record<
  ExerciseId,
  Partial<Record<Equipment, LocalText>>
> = {
  squat: {
    gym: text("Клек с щанга", "Barbell squat"),
    dumbbells: text("Гоблет клек", "Goblet squat"),
    home: text("Клек с ластик или дъмбел", "Band or dumbbell squat"),
    bodyweight: text(
      "Бавен клек със собствено тегло",
      "Tempo bodyweight squat",
    ),
  },
  hinge: {
    gym: text("Румънска тяга", "Romanian deadlift"),
    dumbbells: text("Румънска тяга с дъмбели", "Dumbbell Romanian deadlift"),
    home: text("Тяга с дъмбели или ластик", "Band or dumbbell deadlift"),
    bodyweight: text("Едностранно навеждане", "Single-leg hip hinge"),
  },
  push: {
    gym: text("Лежанка", "Bench press"),
    dumbbells: text("Лежанка с дъмбели", "Dumbbell bench press"),
    home: text("Лицеви опори или преса на пода", "Push-up or floor press"),
    bodyweight: text("Лицеви опори", "Push-ups"),
  },
  pull: {
    gym: text("Гребане на скрипец", "Cable row"),
    dumbbells: text("Гребане с дъмбел", "Dumbbell row"),
    home: text("Гребане с ластик", "Band row"),
    bodyweight: text("Обратно гребане", "Inverted row"),
  },
  verticalPush: {
    gym: text("Раменна преса", "Overhead press"),
    dumbbells: text("Раменна преса с дъмбели", "Dumbbell overhead press"),
    home: text("Раменна преса с ластик", "Band overhead press"),
    bodyweight: text("Пайк лицеви опори", "Pike push-ups"),
  },
  verticalPull: {
    gym: text("Скрипец пред гърди", "Lat pulldown"),
    dumbbells: text("Пулоувър с дъмбел", "Dumbbell pullover"),
    home: text("Вертикално дърпане с ластик", "Band pulldown"),
    bodyweight: text("Набирания с помощ", "Assisted pull-ups"),
  },
  lunge: {
    gym: text("Български клек", "Bulgarian split squat"),
    dumbbells: text("Напади с дъмбели", "Dumbbell lunges"),
    home: text("Обратни напади", "Reverse lunges"),
    bodyweight: text("Обратни напади", "Reverse lunges"),
  },
  glutes: {
    gym: text("Хип тръст", "Hip thrust"),
    dumbbells: text("Глутеус мост с дъмбел", "Dumbbell glute bridge"),
    home: text("Глутеус мост с ластик", "Band glute bridge"),
    bodyweight: text("Едностранен глутеус мост", "Single-leg glute bridge"),
  },
  core: {
    gym: text("Коремна преса на скрипец", "Cable crunch"),
    dumbbells: text("Фермерски планк", "Dumbbell plank drag"),
    home: text("Dead bug", "Dead bug"),
    bodyweight: text("Планк", "Plank"),
  },
  carry: {
    gym: text("Фермерска разходка", "Farmer carry"),
    dumbbells: text("Фермерска разходка", "Farmer carry"),
    home: text("Носене на тежести", "Loaded carry"),
    bodyweight: text("Мечешко ходене", "Bear crawl"),
  },
  arms: {
    gym: text("Бицепс и трицепс на скрипец", "Cable curl and pressdown"),
    dumbbells: text(
      "Бицепс и трицепс с дъмбели",
      "Dumbbell curl and extension",
    ),
    home: text("Бицепс и трицепс с ластик", "Band curl and extension"),
    bodyweight: text("Тесни лицеви опори", "Close-grip push-ups"),
  },
  shoulders: {
    gym: text("Странично рамо на скрипец", "Cable lateral raise"),
    dumbbells: text("Странично рамо с дъмбели", "Dumbbell lateral raise"),
    home: text("Странично рамо с ластик", "Band lateral raise"),
    bodyweight: text("Задържане в стойка до стена", "Wall handstand hold"),
  },
  calves: {
    gym: text("Повдигане за прасец", "Calf raise"),
    dumbbells: text("Прасец с дъмбели", "Dumbbell calf raise"),
    home: text("Едностранен прасец", "Single-leg calf raise"),
    bodyweight: text("Едностранен прасец", "Single-leg calf raise"),
  },
  cardio: {
    gym: text("Кардио в разговорно темпо", "Conversational-pace cardio"),
    dumbbells: text("Бързо ходене", "Brisk walk"),
    home: text("Бързо ходене или колело", "Brisk walk or cycling"),
    bodyweight: text("Бързо ходене", "Brisk walk"),
  },
  intervals: {
    gym: text("Интервали на пътека или колело", "Treadmill or bike intervals"),
    dumbbells: text("Интервали с въже или ходене", "Rope or walking intervals"),
    home: text("Интервали ходене/тичане", "Walk/run intervals"),
    bodyweight: text("Интервали ходене/тичане", "Walk/run intervals"),
  },
  mobility: {
    gym: text("Мобилност за таз и рамене", "Hip and shoulder mobility"),
    dumbbells: text("Мобилност за цяло тяло", "Full-body mobility"),
    home: text("Мобилност за цяло тяло", "Full-body mobility"),
    bodyweight: text("Мобилност за цяло тяло", "Full-body mobility"),
  },
  pullUp: {
    bodyweight: text("Набирания", "Pull-ups"),
    streetWorkout: text("Набирания на лост", "Bar pull-ups"),
    rings: text("Набирания на халки", "Ring pull-ups"),
    gym: text("Набирания или скрипец", "Pull-ups or pulldown"),
  },
  dip: {
    bodyweight: text("Кофички", "Dips"),
    streetWorkout: text("Кофички на успоредка", "Parallel-bar dips"),
    rings: text("Кофички на халки", "Ring dips"),
    gym: text("Кофички с помощ", "Assisted dips"),
  },
  muscleUp: {
    streetWorkout: text("Мъсъл-ъп прогресия", "Muscle-up progression"),
    rings: text("Мъсъл-ъп на халки", "Ring muscle-up progression"),
    bodyweight: text("Преход за мъсъл-ъп", "Muscle-up transition drill"),
  },
  handstand: {
    bodyweight: text("Стойка на ръце до стена", "Wall handstand"),
    streetWorkout: text("Стойка на ръце", "Handstand practice"),
    rings: text("Стойка и стабилизация", "Handstand and stability"),
  },
  lSit: {
    bodyweight: text("L-sit прогресия", "L-sit progression"),
    streetWorkout: text("L-sit на успоредка", "Parallel-bar L-sit"),
    rings: text("L-sit на халки", "Ring L-sit"),
  },
  pistolSquat: {
    bodyweight: text("Пистолет клек прогресия", "Pistol squat progression"),
    streetWorkout: text("Пистолет клек", "Pistol squat"),
    home: text("Пистолет клек с опора", "Supported pistol squat"),
  },
  burpee: {
    bodyweight: text("Бърпи", "Burpees"),
    home: text("Бърпи", "Burpees"),
    gym: text("Бърпи", "Burpees"),
  },
  boxJump: {
    gym: text("Скок върху кутия", "Box jumps"),
    streetWorkout: text("Скок върху платформа", "Platform jumps"),
    bodyweight: text("Скок от място", "Standing broad jumps"),
  },
  kettlebellSwing: {
    kettlebell: text("Суинг с пудовка", "Kettlebell swings"),
    gym: text("Суинг с пудовка", "Kettlebell swings"),
    home: text("Суинг с дъмбел", "Dumbbell swings"),
  },
  turkishGetUp: {
    kettlebell: text("Турско изправяне", "Turkish get-up"),
    dumbbells: text("Турско изправяне с дъмбел", "Dumbbell Turkish get-up"),
    home: text("Турско изправяне", "Turkish get-up"),
  },
  sledPush: {
    gym: text("Бутане на шейна", "Sled push"),
    bodyweight: text("Мечешко ходене с ускорение", "Fast bear crawl"),
  },
  shadowBoxing: {
    bodyweight: text("Бой със сянка", "Shadow boxing"),
    home: text("Бой със сянка", "Shadow boxing"),
    gym: text("Боксова техника", "Boxing technique"),
  },
  jumpRope: {
    bodyweight: text("Скачане на въже", "Jump rope"),
    home: text("Скачане на въже", "Jump rope"),
    gym: text("Скачане на въже", "Jump rope"),
  },
  running: {
    bodyweight: text("Бягане", "Running"),
    home: text("Бягане или бързо ходене", "Running or brisk walking"),
    gym: text("Бягане на пътека", "Treadmill running"),
  },
  cycling: {
    gym: text("Колоездене", "Cycling"),
    home: text("Колоездене", "Cycling"),
    bodyweight: text("Колоездене навън", "Outdoor cycling"),
  },
};

export function getExerciseName(
  id: ExerciseId,
  equipment: Equipment,
  lang: "bg" | "en",
) {
  const names = exerciseNames[id];
  return (names[equipment] ||
    names.bodyweight ||
    names.home ||
    names.gym ||
    Object.values(names)[0] ||
    text(id, id))[lang];
}
