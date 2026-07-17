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

  const [profileResult, weightsResult] = await Promise.all([
    supabase.from("profiles").select("display_name, goal").maybeSingle(),
    supabase.from("weight_entries").select("weight_kg, recorded_on").order("recorded_on", { ascending: false }).limit(5),
  ]);
  const profile = profileResult.data;

  return <AccountDashboardClient
    userId={user.id}
    firstName={profile?.display_name || user.email?.split("@")[0] || "there"}
    profileGoal={(profile?.goal as Goal | null) || null}
    weights={(weightsResult.data || []).map((entry) => ({ weight_kg: entry.weight_kg, recorded_on: entry.recorded_on }))}
  />;
}
