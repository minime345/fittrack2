"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Lang = "bg" | "en";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LangContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("bg");

  // Четем езика от localStorage при първо зареждане
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved) setLang(saved);
  }, []);

  // Записваме в localStorage всеки път когато езикът се сменя
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook за удобен достъп
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
