import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DayPlan, Diet, ExcludedSource, Goal, PlanStyle } from "@/app/personal-plan/types";
import { AccountDashboardClient } from "./AccountDashboardClient";

export default async function DashboardPage() {
  if (!isSupabaseConfigured) return <main className="fit-shell min-h-screen px-6 py-12 text-white"><p>Connect a Supabase project to activate accounts.</p></main>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [profileResult, weightsResult, planResult] = await Promise.all([
    supabase.from("profiles").select("display_name, goal, calculator_profile").maybeSingle(),
    supabase.from("weight_entries").select("weight_kg, recorded_on").order("recorded_on", { ascending: false }).limit(5),
    supabase.from("saved_meal_plans").select("settings, plan_data").eq("user_id", user.id).eq("is_active", true).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  const profile = profileResult.data;
  const planSettings = planResult.data?.settings as { baseCalories?: number; goal?: Goal; diet?: Diet; excludedSources?: ExcludedSource[]; planStyle?: PlanStyle; swapHistory?: Record<string, string[]> } | null;
  const planData = planResult.data?.plan_data as DayPlan[] | null;
  const initialPlan = planSettings?.baseCalories && planSettings.goal && planSettings.diet && Array.isArray(planData)
    ? { baseCalories: planSettings.baseCalories, goal: planSettings.goal, diet: planSettings.diet, excludedSources: planSettings.excludedSources || [], planStyle: planSettings.planStyle || "diverse" as PlanStyle, weeklyPlan: planData, swapHistory: planSettings.swapHistory || {} }
    : null;

  return <AccountDashboardClient
    userId={user.id}
    firstName={profile?.display_name || user.email?.split("@")[0] || "there"}
    profileGoal={(profile?.goal as Goal | null) || null}
    weights={(weightsResult.data || []).map((entry) => ({ weight_kg: entry.weight_kg, recorded_on: entry.recorded_on }))}
    initialCalculator={(profile?.calculator_profile as Parameters<typeof AccountDashboardClient>[0]["initialCalculator"]) || null}
    initialPlan={initialPlan}
  />;
}
