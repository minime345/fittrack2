import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Goal } from "@/app/personal-plan/types";
import { AccountDashboardClient } from "./AccountDashboardClient";

export default async function DashboardPage() {
  if (!isSupabaseConfigured) return <main className="fit-shell min-h-screen px-6 py-12 text-white"><p>Connect a Supabase project to activate accounts.</p></main>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [profileResult, weightsResult, mealPlansResult, workoutPlansResult, favoritesResult, recipesResult] = await Promise.all([
    supabase.from("profiles").select("display_name, goal, unit_system").maybeSingle(),
    supabase.from("weight_entries").select("weight_kg, recorded_on").order("recorded_on", { ascending: false }).limit(5),
    supabase.from("saved_meal_plans").select("id", { count: "exact", head: true }),
    supabase.from("saved_workout_plans").select("id", { count: "exact", head: true }),
    supabase.from("recipe_preferences").select("recipe_slug", { count: "exact", head: true }).eq("preference", "favorite"),
    supabase.from("custom_recipes").select("id", { count: "exact", head: true }),
  ]);
  const profile = profileResult.data;

  return <AccountDashboardClient
    userId={user.id}
    email={user.email || ""}
    firstName={profile?.display_name || user.email?.split("@")[0] || "there"}
    profileGoal={(profile?.goal as Goal | null) || null}
    unitSystem={profile?.unit_system || "metric"}
    weights={(weightsResult.data || []).map((entry) => ({ weight_kg: entry.weight_kg, recorded_on: entry.recorded_on }))}
    counts={{ mealPlans: mealPlansResult.count || 0, workoutPlans: workoutPlansResult.count || 0, favorites: favoritesResult.count || 0, recipes: recipesResult.count || 0 }}
  />;
}
