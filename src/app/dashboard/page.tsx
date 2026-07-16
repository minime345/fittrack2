import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function DashboardPage() {
  if (!isSupabaseConfigured) {
    return <DashboardShell><p className="text-gray-300">Connect a Supabase project in <code>.env.local</code> to activate accounts.</p></DashboardShell>;
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: profile }, { data: weights }] = await Promise.all([
    supabase.from("profiles").select("display_name, goal").single(),
    supabase.from("weight_entries").select("weight_kg, recorded_on").order("recorded_on", { ascending: false }).limit(1),
  ]);

  return (
    <DashboardShell>
      <p className="fit-eyebrow">Your FitTrack account</p>
      <h1 className="fit-title-gradient mt-3 text-4xl font-black">Welcome, {profile?.display_name || user.email}</h1>
      <p className="mt-3 max-w-2xl text-gray-400">Your progress, saved plans, recipe favorites, hidden recipes, and custom recipes will live here.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <DashboardCard label="Latest weight" value={weights?.[0] ? `${weights[0].weight_kg} kg` : "Not recorded"} />
        <DashboardCard label="Goal" value={profile?.goal || "Not selected"} />
        <DashboardCard label="Account" value={user.email || "Active"} />
      </div>
      <div className="mt-8 flex flex-wrap gap-3"><Link href="/calculator" className="fit-primary-button px-5 py-3 font-bold">Update calculator</Link><Link href="/personal-plan" className="fit-secondary-button px-5 py-3 font-bold text-green-300">Open meal plan</Link></div>
    </DashboardShell>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  return <main className="fit-shell min-h-screen px-4 py-12 text-white"><div className="mx-auto max-w-5xl"><Link href="/" className="text-sm font-bold text-green-400">← FitTrack</Link><div className="mt-8">{children}</div></div></main>;
}

function DashboardCard({ label, value }: { label: string; value: string }) {
  return <div className="fit-surface rounded-2xl p-5"><p className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</p><p className="mt-2 text-xl font-black text-white">{value}</p></div>;
}
