"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Mode = "login" | "signup" | "reset" | "update";
type RecoveryStep = "email" | "code" | "password";

export function AuthCard({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>("email");
  const [recoveryCode, setRecoveryCode] = useState("");
  const recoveryCodeInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode !== "reset") return;
    const savedEmail = new URLSearchParams(window.location.search).get("email");
    if (savedEmail) setEmail(savedEmail);
  }, [mode]);

  const copy: Record<Mode, { title: string; text: string; button: string }> = {
    login: { title: "Welcome back", text: "Sign in to sync your plans and progress.", button: "Sign in" },
    signup: { title: "Create your FitTrack account", text: "The rest of FitTrack stays available without an account.", button: "Create account" },
    reset: { title: "Reset your password", text: "Receive a secure code by email and enter it here.", button: "Send recovery code" },
    update: { title: "Choose a new password", text: "Use at least 8 characters for your new password.", button: "Update password" },
  };
  const activeCopy = mode === "reset" && recoveryStep === "code"
    ? { ...copy.reset, title: "Enter your recovery code", text: `We sent a code to ${email}.` }
    : mode === "reset" && recoveryStep === "password"
      ? { ...copy.reset, title: "Choose a new password", text: "Your code is verified. Use at least 8 characters." }
      : copy[mode];

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    if (!isSupabaseConfigured) return setMessage("Supabase is not configured yet. Add the project URL and publishable key to .env.local.");
    const changingPassword = mode === "update" || (mode === "reset" && recoveryStep === "password");
    if ((mode === "signup" || changingPassword) && password !== confirmPassword)
      return setMessage("Passwords do not match.");
    if ((mode === "signup" || changingPassword) && password.length < 8)
      return setMessage("Password must contain at least 8 characters.");

    setLoading(true);
    const supabase = createClient();
    let error: Error | null = null;
    if (mode === "login") {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
      if (!error) window.location.href = "/dashboard";
    } else if (mode === "signup") {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
      });
      error = result.error;
      if (!error && result.data.session) window.location.href = "/dashboard";
      else if (!error) setMessage("Your account was created. Check your email only if confirmation is enabled in Supabase.");
    } else if (mode === "reset") {
      if (recoveryStep === "email") {
        ({ error } = await supabase.auth.resetPasswordForEmail(email));
        if (!error) {
          setRecoveryStep("code");
          setMessage("A recovery code was sent. Check your inbox and spam folder.");
        }
      } else if (recoveryStep === "code") {
        const result = await supabase.auth.verifyOtp({ email, token: recoveryCode.trim(), type: "recovery" });
        error = result.error;
        if (!error) {
          setRecoveryStep("password");
          setMessage("Code verified. Choose your new password.");
        }
      } else {
        ({ error } = await supabase.auth.updateUser({ password }));
        if (!error) {
          setMessage("Password updated. Opening your account…");
          window.setTimeout(() => (window.location.href = "/dashboard"), 700);
        }
      }
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

  const fields: ReactNode = mode === "update" || (mode === "reset" && recoveryStep !== "email") ? null : (
    <label className="block text-sm font-semibold text-gray-300">
      Email
      <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-gray-950 px-3 text-white outline-none focus:border-green-400" />
    </label>
  );

  return (
    <main className="fit-shell flex min-h-screen items-center justify-center px-4 py-12 text-white">
      <div className="fit-surface w-full max-w-md rounded-3xl p-6 sm:p-8">
        <Link href="/" className="text-xs font-bold text-green-400">← Back to FitTrack</Link>
        <h1 className="fit-title-gradient mt-6 text-3xl font-black">{activeCopy.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">{activeCopy.text}</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {fields}
          {(mode !== "reset" || recoveryStep === "password") && (
            <label className="block text-sm font-semibold text-gray-300">
              Password
              <input type="password" required minLength={mode === "login" ? 1 : 8} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-gray-950 px-3 text-white outline-none focus:border-green-400" />
            </label>
          )}
          {(mode === "signup" || mode === "update" || (mode === "reset" && recoveryStep === "password")) && (
            <label className="block text-sm font-semibold text-gray-300">
              Confirm password
              <input type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-gray-950 px-3 text-white outline-none focus:border-green-400" />
            </label>
          )}
          {mode === "reset" && recoveryStep === "code" && (
            <div className="block text-sm font-semibold text-gray-300">
              <label htmlFor="recovery-code">Recovery code</label>
              <div role="presentation" onClick={() => recoveryCodeInput.current?.focus()} className="relative mt-3 grid grid-cols-6 gap-2">
                <input id="recovery-code" ref={recoveryCodeInput} type="text" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" value={recoveryCode} onChange={(event) => setRecoveryCode(event.target.value.replace(/\D/g, "").slice(0, 6))} aria-label="Six-digit recovery code" className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0" />
                {Array.from({ length: 6 }, (_, index) => (
                  <span key={index} aria-hidden="true" className={`flex aspect-square min-w-0 items-center justify-center rounded-xl border text-xl font-black shadow-sm transition sm:text-2xl ${recoveryCode[index] ? "border-green-500/45 bg-green-500/10" : index === recoveryCode.length ? "border-green-500/55 bg-white/5 ring-2 ring-green-500/10" : "border-white/10 bg-black/10"}`}>
                    {recoveryCode[index] || ""}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs font-normal text-gray-500">Paste the code or enter all six digits.</p>
            </div>
          )}
          {message && <p role="status" className="rounded-xl border border-green-500/15 bg-green-500/5 p-3 text-xs text-green-200">{message}</p>}
          <button disabled={loading} className="fit-primary-button min-h-12 w-full px-5 py-3 font-black disabled:opacity-60">{loading ? "Please wait…" : mode === "reset" ? recoveryStep === "email" ? "Send recovery code" : recoveryStep === "code" ? "Verify code" : "Save new password" : copy[mode].button}</button>
        </form>
        {mode === "reset" && recoveryStep !== "email" && recoveryStep !== "password" && <button type="button" onClick={() => { setRecoveryStep("email"); setRecoveryCode(""); setMessage(""); }} className="mt-4 text-xs font-bold text-green-300">Use a different email or resend code</button>}
        <div className="mt-5 flex flex-wrap justify-between gap-3 text-xs text-gray-400">
          {mode === "login" && <><Link href="/auth/signup" className="text-green-300">Create account</Link><Link href={email ? `/auth/reset-password?email=${encodeURIComponent(email)}` : "/auth/reset-password"}>Forgot password?</Link></>}
          {mode === "signup" && <Link href="/auth/login" className="text-green-300">Already have an account?</Link>}
          {(mode === "reset" || mode === "update") && <Link href="/auth/login" className="text-green-300">Return to sign in</Link>}
        </div>
      </div>
    </main>
  );
}
