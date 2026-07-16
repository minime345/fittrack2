"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function WeightEntryForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const value = Number(weight);
    if (!Number.isFinite(value) || value <= 20 || value >= 500) {
      setMessage("Enter a valid weight between 20 and 500 kg.");
      return;
    }
    setLoading(true);
    setMessage("");
    const { error } = await createClient().from("weight_entries").upsert(
      { user_id: userId, weight_kg: value, recorded_on: new Date().toISOString().slice(0, 10) },
      { onConflict: "user_id,recorded_on" },
    );
    setLoading(false);
    if (error) return setMessage(error.message);
    setWeight("");
    setMessage("Today's weight has been saved.");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="mt-4">
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="dashboard-weight">Weight in kilograms</label>
        <div className="flex min-h-11 flex-1 items-center rounded-xl border border-white/10 bg-black/20 px-3 focus-within:border-green-400">
          <input id="dashboard-weight" type="number" min="20" max="500" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="Weight" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600" />
          <span className="text-xs font-semibold text-gray-500">kg</span>
        </div>
        <button disabled={loading} className="fit-primary-button min-h-11 px-4 text-sm font-black disabled:opacity-60">{loading ? "Saving…" : "Save"}</button>
      </div>
      {message && <p role="status" className="mt-2 text-xs text-green-300">{message}</p>}
    </form>
  );
}
