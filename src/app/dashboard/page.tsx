import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Calculator, Dumbbell, Heart, KeyRound, Salad, Scale, Sparkles, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { WeightEntryForm } from "./WeightEntryForm";

export default async function DashboardPage() {
  if (!isSupabaseConfigured) return <DashboardShell><p className="text-gray-300">Connect a Supabase project in <code>.env.local</code> to activate accounts.</p></DashboardShell>;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [profileResult, weightsResult, mealPlansResult, workoutPlansResult, favoritesResult, recipesResult] = await Promise.all([
    supabase.from("profiles").select("display_name, goal, unit_system, created_at").maybeSingle(),
    supabase.from("weight_entries").select("weight_kg, recorded_on").order("recorded_on", { ascending: false }).limit(5),
    supabase.from("saved_meal_plans").select("id", { count: "exact", head: true }),
    supabase.from("saved_workout_plans").select("id", { count: "exact", head: true }),
    supabase.from("recipe_preferences").select("recipe_slug", { count: "exact", head: true }).eq("preference", "favorite"),
    supabase.from("custom_recipes").select("id", { count: "exact", head: true }),
  ]);

  const profile = profileResult.data;
  const weights = weightsResult.data || [];
  const latestWeight = weights[0];
  const previousWeight = weights[1];
  const change = latestWeight && previousWeight ? Number(latestWeight.weight_kg) - Number(previousWeight.weight_kg) : null;
  const firstName = profile?.display_name || user.email?.split("@")[0] || "there";

  return (
    <DashboardShell>
      <section className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="fit-eyebrow">Your FitTrack account</p>
          <h1 className="fit-title-gradient mt-3 text-4xl font-black sm:text-5xl">Welcome, {firstName}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">A quick view of your progress, plans, and saved recipes. Your public FitTrack tools continue to work normally while your account keeps personal data synced.</p>
        </div>
        <Link href="/auth/reset-password" className="fit-secondary-button flex min-h-11 items-center gap-2 px-4 py-3 text-sm font-bold text-green-300"><KeyRound className="h-4 w-4" /> Account security</Link>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Latest weight" value={latestWeight ? `${latestWeight.weight_kg} kg` : "Not recorded"} detail={change === null ? "Add your first weigh-in" : `${change > 0 ? "+" : ""}${change.toFixed(1)} kg since last entry`} icon={<Scale />} />
        <Stat label="Meal plans" value={String(mealPlansResult.count || 0)} detail="Saved to your account" icon={<Salad />} />
        <Stat label="Workout plans" value={String(workoutPlansResult.count || 0)} detail="Saved programs" icon={<Dumbbell />} />
        <Stat label="Recipes" value={String((favoritesResult.count || 0) + (recipesResult.count || 0))} detail={`${favoritesResult.count || 0} favorites · ${recipesResult.count || 0} custom`} icon={<Heart />} />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="fit-surface rounded-3xl p-5 sm:p-6">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/10 text-green-300"><Scale className="h-5 w-5" /></span><div><p className="font-bold">Track your weight</p><p className="text-xs text-gray-500">One entry per day</p></div></div>
          <WeightEntryForm userId={user.id} />
          {weights.length > 0 && <div className="mt-5 border-t border-white/10 pt-4"><p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Recent entries</p><div className="mt-3 space-y-2">{weights.slice(0, 3).map((entry) => <div key={entry.recorded_on} className="flex justify-between text-sm"><span className="text-gray-400">{new Date(`${entry.recorded_on}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span><span className="font-bold text-white">{entry.weight_kg} kg</span></div>)}</div></div>}
        </div>

        <div>
          <div className="mb-4 flex items-end justify-between"><div><p className="fit-eyebrow">Quick access</p><h2 className="mt-1 text-2xl font-black">Continue with FitTrack</h2></div></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Tool href="/calculator" title="Calculator" text="Update calories, protein, and body metrics." icon={<Calculator />} />
            <Tool href="/personal-plan" title="Meal plan" text="Open and personalize your current week." icon={<Salad />} />
            <Tool href="/workouts" title="Workouts" text="Find a program that fits your preferences." icon={<Dumbbell />} />
            <Tool href="/meals" title="Recipe library" text="Explore recipes and meal categories." icon={<BookOpen />} />
            <Tool href="/plans" title="Nutrition guides" text="Compare popular dietary approaches." icon={<Sparkles />} />
            <Tool href="/auth/reset-password" title="Account security" text="Reset your password securely by email." icon={<KeyRound />} />
          </div>
        </div>
      </section>

      <section className="fit-surface mt-8 flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300"><UserRound className="h-5 w-5" /></span><div><p className="font-bold">Account details</p><p className="text-xs text-gray-500">{user.email} · {profile?.unit_system || "metric"} units · goal: {profile?.goal || "not selected"}</p></div></div>
        <Link href="/auth/reset-password" className="text-sm font-bold text-green-300">Reset password →</Link>
      </section>
    </DashboardShell>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  return <main className="fit-shell min-h-screen px-4 py-10 text-white sm:px-6"><div className="mx-auto max-w-6xl"><Link href="/" className="text-sm font-bold text-green-400">← FitTrack</Link><div className="mt-8">{children}</div></div></main>;
}

function Stat({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: React.ReactNode }) {
  return <article className="fit-surface rounded-2xl p-5"><div className="flex items-start justify-between"><p className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</p><span className="[&>svg]:h-4 [&>svg]:w-4 text-green-400">{icon}</span></div><p className="mt-3 text-2xl font-black">{value}</p><p className="mt-1 text-xs text-gray-500">{detail}</p></article>;
}

function Tool({ href, title, text, icon }: { href: string; title: string; text: string; icon: React.ReactNode }) {
  return <Link href={href} className="fit-surface fit-card-interactive flex items-start gap-3 rounded-2xl p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-300 [&>svg]:h-4 [&>svg]:w-4">{icon}</span><span><span className="block font-bold">{title}</span><span className="mt-1 block text-xs leading-relaxed text-gray-500">{text}</span></span></Link>;
}
