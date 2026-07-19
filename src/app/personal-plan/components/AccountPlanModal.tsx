"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Cloud, Heart, TrendingUp, UserRound, X } from "lucide-react";
import Link from "next/link";

type AccountPlanModalProps = {
  lang: "bg" | "en";
  open: boolean;
  onClose: () => void;
};

export function AccountPlanModal({ lang, open, onClose }: AccountPlanModalProps) {
  const copy = lang === "bg" ? {
    eyebrow: "Планът ти е готов",
    title: "Запази го и го направи още по-личен",
    text: "Безплатният акаунт пази плана ти на всички устройства и ти дава повече контрол, когато целите ти се променят.",
    benefits: [
      { icon: Cloud, title: "Планът е винаги с теб", text: "Отвори същия план от телефон, таблет или компютър." },
      { icon: Heart, title: "Ястия, които харесваш", text: "Избирай любими ястия и ги поставяй с приоритет в следващия план." },
      { icon: TrendingUp, title: "План, който се адаптира", text: "Следи теглото си и обновявай порциите според новата цел." },
    ],
    create: "Създай безплатен акаунт",
    signIn: "Вече имам акаунт",
    continue: "Продължи без акаунт",
  } : {
    eyebrow: "Your plan is ready",
    title: "Save it and make it even more personal",
    text: "A free account keeps your plan available across devices and gives you more control as your goals change.",
    benefits: [
      { icon: Cloud, title: "Your plan stays with you", text: "Open the same plan from your phone, tablet, or computer." },
      { icon: Heart, title: "Meals you actually like", text: "Choose favorites and prioritize them in your next plan." },
      { icon: TrendingUp, title: "A plan that adapts", text: "Track your weight and update portions for your new target." },
    ],
    create: "Create a free account",
    signIn: "I already have an account",
    continue: "Continue without an account",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-[#07110d]/70 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          role="presentation"
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-plan-title"
            className="fit-surface relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border p-5 shadow-2xl sm:p-8"
            initial={{ y: 28, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 22, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="fit-secondary-button absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full"
              aria-label={lang === "bg" ? "Затвори" : "Close"}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pr-12">
              <div className="fit-logo-mark mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
                <UserRound className="h-6 w-6 text-white" />
              </div>
              <p className="fit-eyebrow">{copy.eyebrow}</p>
              <h2 id="account-plan-title" className="fit-section-title mt-2 max-w-xl text-2xl font-black leading-tight sm:text-3xl">
                {copy.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">{copy.text}</p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {copy.benefits.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Icon className="h-5 w-5 text-green-400" />
                  <h3 className="mt-3 text-sm font-bold text-white">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-400">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link href="/auth/signup" className="fit-primary-button inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black" onClick={onClose}>
                <Check className="h-4 w-4" />
                {copy.create}
              </Link>
              <Link href="/auth/login" className="fit-secondary-button inline-flex min-h-12 items-center justify-center rounded-xl px-5 text-sm font-bold" onClick={onClose}>
                {copy.signIn}
              </Link>
            </div>
            <button type="button" onClick={onClose} className="mt-3 w-full py-2 text-center text-xs font-semibold text-gray-400 transition hover:text-white">
              {copy.continue}
            </button>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
