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
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "bg";
    const saved = localStorage.getItem("fittrack_lang");
    return saved === "en" || saved === "bg" ? saved : "bg";
  });

  useEffect(() => {
    localStorage.setItem("fittrack_lang", lang);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
