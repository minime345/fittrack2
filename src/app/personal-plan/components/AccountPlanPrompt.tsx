"use client";

import Link from "next/link";
import { Check, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AccountPlanPrompt({ lang }: { lang: "bg" | "en" }) {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    void createClient().auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
  }, []);
  const copy = lang === "bg" ? {
    eyebrow: "Запази напредъка си", title: "Направи плана наистина твой", text: "С акаунт можеш да избереш любимите си ястия и да създадеш нов хранителен план, който ги поставя на първо място. Запази плана, следи теглото си и актуализирай порциите, когато целта ти се промени.", benefits: ["План с предпочитаните от теб ястия", "Запазен режим и любими ястия", "История на теглото и обновени порции"], action: signedIn ? "Отвори акаунта" : "Създай безплатен акаунт",
  } : {
    eyebrow: "Keep your progress", title: "Make this plan truly yours", text: "With an account, you can choose your favorite meals and generate a new meal plan that prioritizes them. Save the plan, track your weight, and update portions whenever your goal changes.", benefits: ["A plan built around meals you like", "Saved plan and favorite meals", "Weight history and updated portions"], action: signedIn ? "Open my account" : "Create a free account",
  };
  return <section className="mx-auto max-w-5xl px-4 pb-4 pt-3 sm:px-6"><div className="rounded-3xl border border-green-500/25 bg-gradient-to-r from-green-500/10 to-teal-500/5 p-6 sm:p-8"><div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]"><div><p className="fit-eyebrow">{copy.eyebrow}</p><h2 className="mt-2 text-2xl font-black text-white">{copy.title}</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">{copy.text}</p><ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">{copy.benefits.map((benefit) => <li key={benefit} className="flex items-center gap-1.5 text-xs text-gray-300"><Check className="h-3.5 w-3.5 text-green-400" />{benefit}</li>)}</ul></div><Link href={signedIn ? "/dashboard" : "/auth/signup"} className="fit-primary-button inline-flex min-h-12 items-center justify-center gap-2 px-5 text-sm font-black"><UserRound className="h-4 w-4" />{copy.action}</Link></div></div></section>;
}
