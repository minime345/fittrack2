import Link from "next/link";
import { ArrowRight, Dumbbell } from "lucide-react";

export function WorkoutPlanPrompt({ lang }: { lang: "bg" | "en" }) {
  const copy = lang === "bg"
    ? {
        eyebrow: "Следващата стъпка",
        title: "Добави тренировки към своя режим",
        text: "Разгледай тренировъчните планове и избери този, който най-добре отговаря на целта, опита и наличното ти оборудване.",
        action: "Разгледай тренировките",
      }
    : {
        eyebrow: "Your next step",
        title: "Add training to your plan",
        text: "Explore the workout plans and choose one that fits your goal, experience, and available equipment.",
        action: "Explore workouts",
      };

  return (
    <section className="mx-auto max-w-5xl px-4 pb-8 pt-3 sm:px-6">
      <div className="fit-callout rounded-3xl border border-green-500/25 bg-gradient-to-r from-green-500/10 to-teal-500/5 p-6 sm:p-8">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="fit-eyebrow">{copy.eyebrow}</p>
            <h2 className="mt-2 flex items-center gap-3 text-2xl font-black text-white">
              <Dumbbell className="h-6 w-6 text-green-400" />
              {copy.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">{copy.text}</p>
          </div>
          <Link
            href="/workouts"
            className="fit-primary-button inline-flex min-h-12 items-center justify-center gap-2 px-5 text-sm font-black"
          >
            {copy.action}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
