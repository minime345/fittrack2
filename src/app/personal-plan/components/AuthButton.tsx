"use client";

import Link from "next/link";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function AuthButton({ lang, mobile = false, onNavigate }: { lang: "bg" | "en"; mobile?: boolean; onNavigate?: () => void }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null),
    );
    return () => data.subscription.unsubscribe();
  }, []);

  if (!user) {
    return (
      <Link href="/auth/login" onClick={onNavigate} className={mobile ? "fit-nav-link flex items-center gap-2" : "fit-secondary-button flex min-h-10 items-center gap-2 px-3 py-2 text-xs font-bold text-green-300"}>
        <LogIn className="h-4 w-4" /> {lang === "bg" ? "Вход" : "Sign in"}
      </Link>
    );
  }

  const signOut = async () => {
    await createClient().auth.signOut();
    onNavigate?.();
    window.location.href = "/";
  };

  return (
    <div className={mobile ? "flex flex-col gap-1" : "flex items-center gap-2"}>
      <Link href="/dashboard" onClick={onNavigate} className={mobile ? "fit-nav-link flex items-center gap-2" : "flex h-10 w-10 items-center justify-center rounded-xl border border-green-500/25 bg-green-500/10 text-green-300"} title={user.email}>
        <UserRound className="h-4 w-4" />{mobile && <span>{lang === "bg" ? "Профил" : "Profile"}</span>}
      </Link>
      <button type="button" onClick={signOut} className={mobile ? "fit-nav-link flex items-center gap-2 text-left" : "flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-gray-400 hover:text-white"} title={lang === "bg" ? "Изход" : "Sign out"}>
        <LogOut className="h-4 w-4" />{mobile && <span>{lang === "bg" ? "Изход" : "Sign out"}</span>}
      </button>
    </div>
  );
}
