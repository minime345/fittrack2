"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Search } from "lucide-react";
import { meals } from "@/data/meals";
import { createClient } from "@/lib/supabase/client";
import { dashboardCopy, type DashboardLanguage } from "./dashboard-copy";

const storageKey = "fittrack-liked-meals-v1";
type MealTypeFilter = "all" | "breakfast" | "lunch" | "dinner" | "snack";

export function MealPreferencePicker({ userId, lang, compact = false }: { userId: string; lang: DashboardLanguage; compact?: boolean }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [mealType, setMealType] = useState<MealTypeFilter>("all");
  const [diet, setDiet] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const copy = dashboardCopy[lang].preferences;

  useEffect(() => {
    let local: string[] = [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) local = JSON.parse(raw) as string[];
    } catch { localStorage.removeItem(storageKey); }
    setSelected(local);
    const load = async () => {
      const { data } = await createClient().from("recipe_preferences").select("recipe_slug").eq("user_id", userId).eq("preference", "favorite");
      if (!data) return;
      const account = data.map((item) => item.recipe_slug).filter((slug) => meals.some((meal) => meal.slug === slug));
      setSelected(account);
      localStorage.setItem(storageKey, JSON.stringify(account));
    };
    void load();
  }, [userId]);

  const diets = useMemo(() => Array.from(new Set(meals.flatMap((meal) => meal.categories)))
    .filter((category) => ["balanced", "high-protein", "keto", "vegan", "vegetarian"].includes(category)), []);
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return meals.filter((meal) =>
      (!query || meal.name[lang].toLowerCase().includes(query) || meal.ingredients.some((ingredient) => ingredient.name[lang].toLowerCase().includes(query))) &&
      (mealType === "all" || meal.mealType.includes(mealType)) &&
      (diet === "all" || meal.categories.includes(diet))
    );
  }, [search, mealType, diet, lang]);

  const toggle = (slug: string) => setSelected((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);

  const generate = async () => {
    if (!selected.length) return setMessage(copy.chooseOne);
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("recipe_preferences").delete().eq("user_id", userId).eq("preference", "favorite");
    const { error: insertError } = deleteError ? { error: deleteError } : await supabase.from("recipe_preferences").upsert(selected.map((slug) => ({ user_id: userId, recipe_slug: slug, preference: "favorite", updated_at: new Date().toISOString() })), { onConflict: "user_id,recipe_slug" });
    setSaving(false);
    if (insertError) return setMessage(insertError.message);
    localStorage.setItem(storageKey, JSON.stringify(selected));
    localStorage.removeItem("fittrack-active-plan-v2");
    window.location.href = "/personal-plan?preferred=1";
  };

  return (
    <section id={compact ? undefined : "meal-preferences"} className="scroll-mt-24">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div className="min-w-0">
          <p className="fit-eyebrow">{copy.eyebrow}</p>
          <h2 className={`${compact ? "text-xl" : "text-2xl"} mt-1 font-black`}>{copy.title}</h2>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-gray-400">{selected.length ? copy.selectedText(selected.length) : copy.emptyText}</p>
        </div>
        <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className="fit-secondary-button inline-flex min-h-10 w-full shrink-0 items-center justify-center rounded-xl px-3 text-xs font-bold text-green-300 sm:w-auto">{expanded ? copy.close : copy.choose}</button>
      </div>
      {expanded && <>
      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_120px_130px]">
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-gray-950 px-3 focus-within:border-green-400"><Search className="h-4 w-4 text-gray-500" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={copy.search} className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
        <select value={mealType} onChange={(event) => setMealType(event.target.value as MealTypeFilter)} className="min-h-11 rounded-xl border border-white/10 bg-gray-950 px-3 text-sm outline-none"><option value="all">{copy.allMeals}</option><option value="breakfast">{copy.breakfast}</option><option value="lunch">{copy.lunch}</option><option value="dinner">{copy.dinner}</option><option value="snack">{copy.snack}</option></select>
        <select value={diet} onChange={(event) => setDiet(event.target.value)} className="min-h-11 rounded-xl border border-white/10 bg-gray-950 px-3 text-sm outline-none"><option value="all">{copy.allDiets}</option>{diets.map((value) => <option key={value} value={value}>{lang === "bg" ? ({ balanced: "балансирана", "high-protein": "високопротеинова", keto: "кето", vegan: "веган", vegetarian: "вегетарианска" } as Record<string, string>)[value] : value.replace("-", " ")}</option>)}</select>
      </div>
      <div className="mt-3 grid max-h-[320px] min-w-0 gap-2 overflow-y-auto overscroll-contain pr-1 sm:grid-cols-2">
        {visible.map((meal) => {
          const liked = selected.includes(meal.slug);
          return <button key={meal.slug} type="button" onClick={() => toggle(meal.slug)} aria-pressed={liked} className={`flex w-full flex-col items-start rounded-xl border p-3 text-left transition ${liked ? "border-green-400/50 bg-green-500/10" : "border-white/5 bg-black/15 hover:border-white/15"}`}><span className="flex w-full items-start justify-between gap-2"><span className="text-lg">{meal.icon}</span><Heart className={`h-3.5 w-3.5 shrink-0 ${liked ? "fill-green-400 text-green-400" : "text-gray-600"}`} /></span><span className="mt-2 line-clamp-2 min-h-8 text-xs font-bold leading-4 text-white">{meal.name[lang]}</span><span className="mt-1 text-[9px] text-gray-500">{meal.kcal} kcal · {meal.protein}g {copy.protein}</span></button>;
        })}
        {!visible.length && <p className="w-full py-6 text-center text-sm text-gray-500">{copy.noMatches}</p>}
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-gray-500">{selected.length} {copy.selected}</p><button type="button" onClick={generate} disabled={saving || !selected.length} className="fit-primary-button min-h-11 w-full px-4 text-xs font-black disabled:opacity-50 sm:w-auto sm:text-sm">{saving ? copy.saving : copy.create}</button></div>
      {message && <p role="status" className="mt-3 text-xs text-green-300">{message}</p>}
      </>}
    </section>
  );
}
