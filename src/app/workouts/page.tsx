"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { useLang } from "@/context/LangContext";
import { translations } from "@/lib/translations";
import { HeaderNav } from "@/app/personal-plan/components/HeaderNav";
import { SiteFooter } from "@/app/personal-plan/components/SiteFooter";

type Goal = "maintain" | "lose" | "gain";
type LocalText = { bg: string; en: string };
type WorkoutDay = { day: LocalText; focus: LocalText; exercises: LocalText[] };
type WorkoutPlan = {
  id: string;
  icon: string;
  name: LocalText;
  summary: LocalText;
  daysPerWeek: number;
  duration: string;
  level: LocalText;
  schedule: WorkoutDay[];
};

type CalculatorProfile = {
  age: number;
  weight: number;
  height: number;
  activity: number;
  calories: number;
};

const plans: WorkoutPlan[] = [
  {
    id: "foundation",
    icon: "🌱",
    name: { bg: "Силна основа", en: "Strong Foundation" },
    summary: { bg: "Три тренировки за цялото тяло с лесна прогресия.", en: "Three full-body sessions with simple progression." },
    daysPerWeek: 3,
    duration: "45–60 min",
    level: { bg: "Начинаещ", en: "Beginner" },
    schedule: [
      {
        day: { bg: "Ден 1", en: "Day 1" }, focus: { bg: "Цяло тяло A", en: "Full body A" },
        exercises: [
          { bg: "Гоблет клек — 3 × 8–12", en: "Goblet squat — 3 × 8–12" },
          { bg: "Лицеви опори или лежанка — 3 × 8–12", en: "Push-up or bench press — 3 × 8–12" },
          { bg: "Гребане — 3 × 10–12", en: "Row — 3 × 10–12" },
          { bg: "Румънска тяга — 2 × 8–10", en: "Romanian deadlift — 2 × 8–10" },
          { bg: "Планк — 3 × 30–45 сек", en: "Plank — 3 × 30–45 sec" },
        ],
      },
      {
        day: { bg: "Ден 2", en: "Day 2" }, focus: { bg: "Цяло тяло B", en: "Full body B" },
        exercises: [
          { bg: "Напади — 3 × 8 на крак", en: "Lunges — 3 × 8 each leg" },
          { bg: "Раменна преса — 3 × 8–12", en: "Overhead press — 3 × 8–12" },
          { bg: "Скрипец пред гърди — 3 × 8–12", en: "Lat pulldown — 3 × 8–12" },
          { bg: "Глутеус мост — 3 × 10–15", en: "Glute bridge — 3 × 10–15" },
          { bg: "Dead bug — 3 × 8 на страна", en: "Dead bug — 3 × 8 each side" },
        ],
      },
      {
        day: { bg: "Ден 3", en: "Day 3" }, focus: { bg: "Цяло тяло C", en: "Full body C" },
        exercises: [
          { bg: "Лег преса — 3 × 10–12", en: "Leg press — 3 × 10–12" },
          { bg: "Полулег с дъмбели — 3 × 8–12", en: "Incline dumbbell press — 3 × 8–12" },
          { bg: "Гребане с дъмбел — 3 × 10 на страна", en: "One-arm row — 3 × 10 each side" },
          { bg: "Сгъване за задно бедро — 2 × 10–15", en: "Leg curl — 2 × 10–15" },
          { bg: "Страничен планк — 2 × 30 сек", en: "Side plank — 2 × 30 sec" },
        ],
      },
    ],
  },
  {
    id: "balanced",
    icon: "⚖️",
    name: { bg: "Балансирана форма", en: "Balanced Fitness" },
    summary: { bg: "Сила, кондиция и мобилност в четири умерени дни.", en: "Strength, conditioning, and mobility across four moderate days." },
    daysPerWeek: 4,
    duration: "45–65 min",
    level: { bg: "Средно ниво", en: "Intermediate" },
    schedule: [
      { day: { bg: "Понеделник", en: "Monday" }, focus: { bg: "Горна част", en: "Upper body" }, exercises: [
        { bg: "Лежанка — 3 × 6–10", en: "Bench press — 3 × 6–10" }, { bg: "Гребане — 3 × 8–12", en: "Row — 3 × 8–12" },
        { bg: "Раменна преса — 3 × 8–10", en: "Overhead press — 3 × 8–10" }, { bg: "Скрипец пред гърди — 3 × 8–12", en: "Lat pulldown — 3 × 8–12" },
      ] },
      { day: { bg: "Вторник", en: "Tuesday" }, focus: { bg: "Долна част", en: "Lower body" }, exercises: [
        { bg: "Клек — 3 × 6–10", en: "Squat — 3 × 6–10" }, { bg: "Румънска тяга — 3 × 8–10", en: "Romanian deadlift — 3 × 8–10" },
        { bg: "Български клек — 2 × 8 на крак", en: "Split squat — 2 × 8 each leg" }, { bg: "Прасец — 3 × 12–15", en: "Calf raise — 3 × 12–15" },
      ] },
      { day: { bg: "Четвъртък", en: "Thursday" }, focus: { bg: "Цяло тяло", en: "Full body" }, exercises: [
        { bg: "Тяга с трап бар — 3 × 5–8", en: "Trap-bar deadlift — 3 × 5–8" }, { bg: "Полулег с дъмбели — 3 × 8–12", en: "Incline dumbbell press — 3 × 8–12" },
        { bg: "Набиране или скрипец — 3 × 8–12", en: "Pull-up or pulldown — 3 × 8–12" }, { bg: "Фермерска разходка — 3 серии", en: "Farmer carry — 3 rounds" },
      ] },
      { day: { bg: "Събота", en: "Saturday" }, focus: { bg: "Кондиция и мобилност", en: "Conditioning & mobility" }, exercises: [
        { bg: "Кардио в леко темпо — 25–35 мин", en: "Easy-paced cardio — 25–35 min" }, { bg: "Мобилност за таз и рамене — 10 мин", en: "Hip and shoulder mobility — 10 min" },
      ] },
    ],
  },
  {
    id: "muscle",
    icon: "💪",
    name: { bg: "Сила и мускули", en: "Strength & Muscle" },
    summary: { bg: "Четиридневна горна/долна част за сила и хипертрофия.", en: "A four-day upper/lower split for strength and hypertrophy." },
    daysPerWeek: 4,
    duration: "60–75 min",
    level: { bg: "Средно ниво", en: "Intermediate" },
    schedule: [
      { day: { bg: "Ден 1", en: "Day 1" }, focus: { bg: "Горна част — сила", en: "Upper — strength" }, exercises: [
        { bg: "Лежанка — 4 × 5–8", en: "Bench press — 4 × 5–8" }, { bg: "Гребане с щанга — 4 × 6–10", en: "Barbell row — 4 × 6–10" },
        { bg: "Раменна преса — 3 × 6–10", en: "Overhead press — 3 × 6–10" }, { bg: "Набирания — 3 × 6–10", en: "Pull-ups — 3 × 6–10" },
      ] },
      { day: { bg: "Ден 2", en: "Day 2" }, focus: { bg: "Долна част — сила", en: "Lower — strength" }, exercises: [
        { bg: "Клек — 4 × 5–8", en: "Squat — 4 × 5–8" }, { bg: "Румънска тяга — 3 × 6–10", en: "Romanian deadlift — 3 × 6–10" },
        { bg: "Лег преса — 3 × 10–12", en: "Leg press — 3 × 10–12" }, { bg: "Корем — 3 серии", en: "Core — 3 rounds" },
      ] },
      { day: { bg: "Ден 3", en: "Day 3" }, focus: { bg: "Горна част — обем", en: "Upper — volume" }, exercises: [
        { bg: "Полулег с дъмбели — 3 × 8–12", en: "Incline dumbbell press — 3 × 8–12" }, { bg: "Скрипец пред гърди — 3 × 8–12", en: "Lat pulldown — 3 × 8–12" },
        { bg: "Странично рамо — 3 × 12–15", en: "Lateral raise — 3 × 12–15" }, { bg: "Бицепс + трицепс — 3 × 10–15", en: "Biceps + triceps — 3 × 10–15" },
      ] },
      { day: { bg: "Ден 4", en: "Day 4" }, focus: { bg: "Долна част — обем", en: "Lower — volume" }, exercises: [
        { bg: "Преден клек — 3 × 8–10", en: "Front squat — 3 × 8–10" }, { bg: "Хип тръст — 3 × 8–12", en: "Hip thrust — 3 × 8–12" },
        { bg: "Напади — 3 × 10 на крак", en: "Lunges — 3 × 10 each leg" }, { bg: "Задно бедро + прасец — 3 × 12–15", en: "Leg curl + calves — 3 × 12–15" },
      ] },
    ],
  },
  {
    id: "conditioning",
    icon: "🔥",
    name: { bg: "Форма и кондиция", en: "Lean & Conditioned" },
    summary: { bg: "Силови тренировки плюс контролирано кардио за добра форма.", en: "Strength work plus controlled cardio for overall conditioning." },
    daysPerWeek: 4,
    duration: "40–60 min",
    level: { bg: "Всички нива", en: "All levels" },
    schedule: [
      { day: { bg: "Ден 1", en: "Day 1" }, focus: { bg: "Цяло тяло", en: "Full body" }, exercises: [
        { bg: "Клек, лицеви опори, гребане — 3 × 10", en: "Squat, push-up, row — 3 × 10" }, { bg: "Бързо ходене — 15 мин", en: "Brisk walk — 15 min" },
      ] },
      { day: { bg: "Ден 2", en: "Day 2" }, focus: { bg: "Леко кардио", en: "Easy cardio" }, exercises: [
        { bg: "Ходене, колело или плуване — 30–45 мин", en: "Walk, bike, or swim — 30–45 min" },
      ] },
      { day: { bg: "Ден 3", en: "Day 3" }, focus: { bg: "Цяло тяло", en: "Full body" }, exercises: [
        { bg: "Тяга, раменна преса, напади — 3 × 8–12", en: "Deadlift, overhead press, lunges — 3 × 8–12" }, { bg: "Планк — 3 серии", en: "Plank — 3 rounds" },
      ] },
      { day: { bg: "Ден 4", en: "Day 4" }, focus: { bg: "Интервали", en: "Intervals" }, exercises: [
        { bg: "6 × 1 мин бързо / 2 мин леко", en: "6 × 1 min brisk / 2 min easy" }, { bg: "Разтягане — 10 мин", en: "Mobility — 10 min" },
      ] },
    ],
  },
];

const trainingTypes = [
  { icon: "🏋️", title: { bg: "Цяло тяло", en: "Full body" }, text: { bg: "Тренира основните движения във всяка сесия. Подходящо за 2–3 дни седмично.", en: "Trains the main movement patterns each session. Ideal for 2–3 days per week." } },
  { icon: "↕️", title: { bg: "Горна/долна част", en: "Upper/lower" }, text: { bg: "Разделя тялото в четири дни и дава повече обем за сила и мускули.", en: "Splits the body across four days and supports more strength and muscle volume." } },
  { icon: "❤️", title: { bg: "Кардио и кондиция", en: "Cardio & conditioning" }, text: { bg: "Подобрява издръжливостта. Лекото темпо подпомага възстановяването, интервалите са по-натоварващи.", en: "Builds endurance. Easy work supports recovery, while intervals are more demanding." } },
  { icon: "🧘", title: { bg: "Мобилност", en: "Mobility" }, text: { bg: "Поддържа удобен обхват на движение. Добавяй 5–10 минути според нуждите си.", en: "Maintains a comfortable range of motion. Add 5–10 minutes based on your needs." } },
];

export default function WorkoutsPage() {
  const { lang, setLang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<CalculatorProfile | null>(null);
  const [goal, setGoal] = useState<Goal>("maintain");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const t = translations[lang] || translations.bg;

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang === "bg" || savedLang === "en") setLang(savedLang);
    try {
      const savedProfile = localStorage.getItem("fittrack-calculator-profile-v1");
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      const savedPlan = localStorage.getItem("fittrack-active-plan-v2");
      if (savedPlan) {
        const parsed = JSON.parse(savedPlan) as { goal?: Goal };
        if (parsed.goal) setGoal(parsed.goal);
      }
    } catch {
      // Invalid browser data should not prevent the general plans from loading.
    }
  }, [setLang]);

  const toggleLang = () => {
    const next = lang === "bg" ? "en" : "bg";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  const recommendedId = useMemo(() => {
    if (!profile || profile.activity <= 1.375) return "foundation";
    if (goal === "gain") return "muscle";
    if (goal === "lose") return "conditioning";
    return "balanced";
  }, [profile, goal]);
  const activePlan = plans.find((plan) => plan.id === (selectedPlanId || recommendedId)) || plans[0];
  const goalLabel = goal === "lose"
    ? (lang === "bg" ? "отслабване" : "fat loss")
    : goal === "gain"
      ? (lang === "bg" ? "покачване" : "muscle gain")
      : (lang === "bg" ? "поддържане" : "maintenance");

  return (
    <main className="fit-shell min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 font-sans text-white">
      <HeaderNav t={t} lang={lang} toggleLang={toggleLang} isOpen={isOpen} setIsOpen={setIsOpen} />

      <section className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-green-400">
              {lang === "bg" ? "Тренировки според твоята цел" : "Training for your goal"}
            </p>
            <h1 className="fit-title-gradient text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              {lang === "bg" ? "Твоята по-силна седмица" : "Your stronger week"}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
              {lang === "bg"
                ? "Избери план, който можеш да следваш постоянно. Препоръката използва данните от калкулатора и целта на хранителния ти план."
                : "Choose a plan you can follow consistently. Your recommendation uses calculator data and your nutrition-plan goal."}
            </p>
          </div>

          <div className="fit-surface rounded-3xl border border-green-500/25 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{lang === "bg" ? "Твоята препоръка" : "Your recommendation"}</p>
                <p className="mt-1 text-xl font-bold text-green-300">{activePlan.name[lang]}</p>
              </div>
              <span className="text-3xl">{activePlan.icon}</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Stat value={`${activePlan.daysPerWeek}`} label={lang === "bg" ? "дни" : "days"} />
              <Stat value={activePlan.duration.replace(" min", "")} label="min" />
              <Stat value={profile ? `${profile.activity}` : "—"} label={lang === "bg" ? "активност" : "activity"} />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-gray-400">
              {profile
                ? (lang === "bg" ? `На база на активността ти и цел за ${goalLabel}.` : `Based on your activity and ${goalLabel} goal.`)
                : (lang === "bg" ? "Попълни калкулатора за по-подходяща препоръка." : "Complete the calculator for a more tailored recommendation.")}
            </p>
            {!profile && <Link href="/calculator" className="fit-primary-button mt-4 block rounded-xl bg-green-500 px-4 py-2.5 text-center text-sm font-bold text-black">{lang === "bg" ? "Отвори калкулатора" : "Open calculator"}</Link>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-green-400">{lang === "bg" ? "Готови програми" : "Ready-made programs"}</p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{lang === "bg" ? "Избери своя ритъм" : "Choose your rhythm"}</h2>
          </div>
          <p className="max-w-md text-sm text-gray-400">{lang === "bg" ? "Започни с по-малко дни и добавяй натоварване постепенно." : "Start with fewer days and build your training load gradually."}</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const selected = activePlan.id === plan.id;
            const recommended = recommendedId === plan.id;
            return (
              <button key={plan.id} type="button" onClick={() => setSelectedPlanId(plan.id)} className={`relative rounded-2xl border p-4 text-left transition ${selected ? "border-green-400 bg-green-500/10 shadow-lg shadow-green-950/20" : "border-white/10 bg-gray-900/70 hover:border-green-400/35"}`}>
                {recommended && <span className="absolute right-3 top-3 rounded-full bg-green-500 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-black">{lang === "bg" ? "За теб" : "For you"}</span>}
                <span className="text-2xl">{plan.icon}</span>
                <span className="mt-3 block pr-12 text-base font-bold text-white">{plan.name[lang]}</span>
                <span className="mt-1 block text-xs leading-relaxed text-gray-400">{plan.summary[lang]}</span>
                <span className="mt-3 flex gap-2 text-[10px] font-semibold uppercase tracking-wide text-green-300">
                  <span>{plan.daysPerWeek} {lang === "bg" ? "дни" : "days"}</span><span>•</span><span>{plan.level[lang]}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="fit-surface overflow-hidden rounded-3xl border border-green-500/20">
          <div className="border-b border-white/10 p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-400">{activePlan.level[lang]} • {activePlan.duration}</p>
                <h2 className="mt-1 text-2xl font-black">{activePlan.icon} {activePlan.name[lang]}</h2>
                <p className="mt-2 text-sm text-gray-400">{activePlan.summary[lang]}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-black/15 px-3 py-2 text-xs text-gray-300">{activePlan.daysPerWeek} {lang === "bg" ? "тренировки седмично" : "workouts per week"}</span>
            </div>
          </div>
          <div className="grid gap-px bg-white/5 md:grid-cols-2">
            {activePlan.schedule.map((workout) => (
              <article key={`${activePlan.id}-${workout.day.en}`} className="bg-gray-900/95 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-green-400">{workout.day[lang]}</p>
                <h3 className="mt-1 text-lg font-bold text-white">{workout.focus[lang]}</h3>
                <ul className="mt-4 space-y-2">
                  {workout.exercises.map((exercise) => <li key={exercise.en} className="flex gap-2 text-sm text-gray-300"><span className="text-green-400">✓</span><span>{exercise[lang]}</span></li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-wider text-green-400">{lang === "bg" ? "Основни методи" : "Training methods"}</p>
        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{lang === "bg" ? "Как работят различните планове" : "How different plans work"}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trainingTypes.map((type) => <article key={type.title.en} className="fit-surface rounded-2xl border border-white/10 p-4"><span className="text-2xl">{type.icon}</span><h3 className="mt-3 font-bold text-white">{type.title[lang]}</h3><p className="mt-2 text-xs leading-relaxed text-gray-400">{type.text[lang]}</p></article>)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <InfoBlock number="01" title={lang === "bg" ? "Загрявай" : "Warm up"} text={lang === "bg" ? "5–10 минути леко движение и 2–3 подготвителни серии преди тежко упражнение." : "Use 5–10 minutes of easy movement and 2–3 preparation sets before a heavy exercise."} />
          <InfoBlock number="02" title={lang === "bg" ? "Прогресирай постепенно" : "Progress gradually"} text={lang === "bg" ? "Когато изпълниш горната граница повторения с добра техника, добави малко тежест." : "When you reach the top of the rep range with good form, add a small amount of weight."} />
          <InfoBlock number="03" title={lang === "bg" ? "Възстановявай се" : "Recover"} text={lang === "bg" ? "Оставяй поне ден между тежки тренировки за същите мускули и пази 2–3 повторения в резерв." : "Leave at least a day between hard sessions for the same muscles and keep 2–3 reps in reserve."} />
        </div>
        <div className="mt-5 rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] p-4 text-xs leading-relaxed text-amber-100/75">
          {lang === "bg" ? "Спри при остра болка, замайване или необичайно неразположение. При травма, заболяване, бременност или медицинско ограничение потърси подходящ съвет преди нова тренировъчна програма." : "Stop for sharp pain, dizziness, or unusual discomfort. If you have an injury, health condition, pregnancy, or medical restriction, seek appropriate guidance before starting a new program."}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-green-500/25 bg-gradient-to-r from-green-500/10 to-teal-500/5 p-6 text-center sm:p-8">
          <h2 className="text-2xl font-bold">{lang === "bg" ? "Събери тренировките и храненето" : "Bring training and nutrition together"}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400">{lang === "bg" ? "Използвай калкулатора за актуални данни и персоналния план за хранене според целта си." : "Use the calculator for current body data and the personal nutrition plan for your goal."}</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/calculator" className="fit-secondary-button rounded-xl border border-green-500/30 px-5 py-3 text-sm font-semibold text-green-200">{lang === "bg" ? "Калкулатор" : "Calculator"}</Link>
            <Link href="/personal-plan" className="fit-primary-button rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-black">{lang === "bg" ? "Персонален хранителен план" : "Personal nutrition plan"}</Link>
          </div>
        </div>
      </section>

      <SiteFooter t={t} currentYear={new Date().getFullYear()} />
      <Analytics />
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="rounded-xl border border-white/5 bg-black/15 p-2"><p className="text-sm font-black text-white">{value}</p><p className="text-[9px] uppercase tracking-wide text-gray-500">{label}</p></div>;
}

function InfoBlock({ number, title, text }: { number: string; title: string; text: string }) {
  return <article className="fit-surface rounded-2xl border border-white/10 p-5"><span className="text-xs font-black text-green-400">{number}</span><h3 className="mt-2 text-lg font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-gray-400">{text}</p></article>;
}
