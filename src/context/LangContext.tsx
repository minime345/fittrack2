"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type Lang } from "@/lib/translations";

interface LangContextProps {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextProps>({
  lang: "bg",
  setLang: () => {},
});

export const LangProvider = ({ children }: { children: ReactNode }) => {
  // Keep the server and the first client render identical. The saved
  // preference is applied immediately after hydration.
  const [lang, setLang] = useState<Lang>("bg");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lang") || localStorage.getItem("fittrack_lang");
    if (saved === "en" || saved === "bg") setLang(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("lang", lang);
    localStorage.setItem("fittrack_lang", lang);
    document.documentElement.lang = lang;
  }, [hydrated, lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
