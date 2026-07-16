"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Mode = "login" | "signup" | "reset" | "update";

export function AuthCard({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const copy: Record<Mode, { title: string; text: string; button: string }> = {
    login: { title: "Welcome back", text: "Sign in to sync your plans and progress.", button: "Sign in" },
    signup: { title: "Create your FitTrack account", text: "The rest of FitTrack stays available without an account.", button: "Create account" },
    reset: { title: "Reset your password", text: "We will email you a secure password-reset link.", button: "Send reset link" },
    update: { title: "Choose a new password", text: "Use at least 8 characters for your new password.", button: "Update password" },
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    if (!isSupabaseConfigured) return setMessage("Supabase is not configured yet. Add the project URL and publishable key to .env.local.");
    if ((mode === "signup" || mode === "update") && password !== confirmPassword)
      return setMessage("Passwords do not match.");
    if ((mode === "signup" || mode === "update") && password.length < 8)
      return setMessage("Password must contain at least 8 characters.");

    setLoading(true);
    const supabase = createClient();
    let error: Error | null = null;
    if (mode === "login") {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
      if (!error) window.location.href = "/dashboard";
    } else if (mode === "signup") {
      ({ error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
      }));
      if (!error) setMessage("Check your email to confirm your account.");
    } else if (mode === "reset") {
      ({ error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
      }));
      if (!error) setMessage("If an account exists for that email, a reset link has been sent.");
    } else {
      ({ error } = await supabase.auth.updateUser({ password }));
      if (!error) {
        setMessage("Password updated. Redirecting to your dashboard…");
        window.setTimeout(() => (window.location.href = "/dashboard"), 900);
      }
    }
    if (error) setMessage(error.message);
    setLoading(false);
  };

  const fields: ReactNode = mode === "update" ? null : (
    <label className="block text-sm font-semibold text-gray-300">
      Email
      <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-gray-950 px-3 text-white outline-none focus:border-green-400" />
    </label>
  );

  return (
    <main className="fit-shell flex min-h-screen items-center justify-center px-4 py-12 text-white">
      <div className="fit-surface w-full max-w-md rounded-3xl p-6 sm:p-8">
        <Link href="/" className="text-xs font-bold text-green-400">← Back to FitTrack</Link>
        <h1 className="fit-title-gradient mt-6 text-3xl font-black">{copy[mode].title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">{copy[mode].text}</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {fields}
          {mode !== "reset" && (
            <label className="block text-sm font-semibold text-gray-300">
              Password
              <input type="password" required minLength={mode === "login" ? 1 : 8} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-gray-950 px-3 text-white outline-none focus:border-green-400" />
            </label>
          )}
          {(mode === "signup" || mode === "update") && (
            <label className="block text-sm font-semibold text-gray-300">
              Confirm password
              <input type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-gray-950 px-3 text-white outline-none focus:border-green-400" />
            </label>
          )}
          {message && <p role="status" className="rounded-xl border border-green-500/15 bg-green-500/5 p-3 text-xs text-green-200">{message}</p>}
          <button disabled={loading} className="fit-primary-button min-h-12 w-full px-5 py-3 font-black disabled:opacity-60">{loading ? "Please wait…" : copy[mode].button}</button>
        </form>
        <div className="mt-5 flex flex-wrap justify-between gap-3 text-xs text-gray-400">
          {mode === "login" && <><Link href="/auth/signup" className="text-green-300">Create account</Link><Link href="/auth/reset-password">Forgot password?</Link></>}
          {mode === "signup" && <Link href="/auth/login" className="text-green-300">Already have an account?</Link>}
          {(mode === "reset" || mode === "update") && <Link href="/auth/login" className="text-green-300">Return to sign in</Link>}
        </div>
      </div>
    </main>
  );
}
