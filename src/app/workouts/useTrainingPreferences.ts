import { useEffect, useState } from "react";
import { useLang } from "@/context/LangContext";
import { translations } from "@/lib/translations";
import { defaults, equipmentOptions } from "./config";
import type {
  CalculatorProfile,
  Equipment,
  Goal,
  TrainingPreferences,
} from "./types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function useTrainingPreferences() {
  const { lang, setLang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<CalculatorProfile | null>(null);
  const [prefs, setPrefs] = useState<TrainingPreferences>(defaults);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [cloudReady, setCloudReady] = useState(false);
  const t = translations[lang] || translations.bg;

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang === "bg" || savedLang === "en") setLang(savedLang);
    try {
      const calculator = localStorage.getItem("fittrack-calculator-profile-v1");
      if (calculator) setProfile(JSON.parse(calculator));
      const savedTraining = localStorage.getItem(
        "fittrack-training-preferences-v1",
      );
      const savedPlan = localStorage.getItem("fittrack-active-plan-v2");
      const training = savedTraining
        ? (JSON.parse(savedTraining) as Partial<TrainingPreferences> & {
            selectedPlanId?: string | null;
          })
        : null;
      const nutrition = savedPlan
        ? (JSON.parse(savedPlan) as { goal?: Goal })
        : null;
      const merged = {
        ...defaults,
        ...(training || {}),
        goal: training?.goal || nutrition?.goal || defaults.goal,
      };
      const equipmentMigration: Partial<Record<Equipment, Equipment>> = {
        rings: "streetWorkout",
        kettlebell: "home",
        trx: "home",
        resistanceBands: "home",
      };
      const migratedEquipment =
        equipmentMigration[merged.equipment as Equipment] || merged.equipment;
      const validEquipment = equipmentOptions.includes(
        migratedEquipment as Equipment,
      )
        ? migratedEquipment
        : defaults.equipment;
      setPrefs({
        ...merged,
        equipment: validEquipment as Equipment,
      });
      if (training?.selectedPlanId) setSelectedPlanId(training.selectedPlanId);
    } catch {
      localStorage.removeItem("fittrack-training-preferences-v1");
    } finally {
      setStorageReady(true);
    }
  }, [setLang]);

  useEffect(() => {
    const loadCloud = async () => {
      if (!isSupabaseConfigured) return setCloudReady(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from("profiles").select("calculator_profile, training_preferences").eq("id", user.id).maybeSingle();
        const cloudProfile = data?.calculator_profile as CalculatorProfile | undefined;
        if (cloudProfile && Object.keys(cloudProfile).length) {
          setProfile(cloudProfile);
          localStorage.setItem("fittrack-calculator-profile-v1", JSON.stringify(cloudProfile));
        }
        const cloudTraining = data?.training_preferences as (Partial<TrainingPreferences> & { selectedPlanId?: string | null }) | undefined;
        if (cloudTraining && Object.keys(cloudTraining).length) {
          setPrefs((current) => ({ ...current, ...cloudTraining }));
          setSelectedPlanId(cloudTraining.selectedPlanId || null);
          localStorage.setItem("fittrack-training-preferences-v1", JSON.stringify(cloudTraining));
        }
      } finally {
        setCloudReady(true);
      }
    };
    void loadCloud();
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(
      "fittrack-training-preferences-v1",
      JSON.stringify({ ...prefs, selectedPlanId }),
    );
  }, [prefs, selectedPlanId, storageReady]);

  useEffect(() => {
    if (!storageReady || !cloudReady || !isSupabaseConfigured) return;
    const timeout = window.setTimeout(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await supabase.from("profiles").update({ training_preferences: { ...prefs, selectedPlanId }, updated_at: new Date().toISOString() }).eq("id", user.id);
    }, 600);
    return () => window.clearTimeout(timeout);
  }, [prefs, selectedPlanId, storageReady, cloudReady]);

  const updatePrefs = <K extends keyof TrainingPreferences>(
    key: K,
    value: TrainingPreferences[K],
  ) => {
    setPrefs((current) => ({ ...current, [key]: value }));
    setSelectedPlanId(null);
  };

  const toggleLang = () => {
    const next = lang === "bg" ? "en" : "bg";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  const selectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    // Persist immediately so the detail page sees the choice right away,
    // without waiting for the effect above to run before navigation.
    try {
      localStorage.setItem(
        "fittrack-training-preferences-v1",
        JSON.stringify({ ...prefs, selectedPlanId: planId }),
      );
    } catch {
      // ignore storage failures (e.g. private browsing)
    }
  };

  return {
    lang,
    t,
    isOpen,
    setIsOpen,
    profile,
    prefs,
    setPrefs,
    selectedPlanId,
    setSelectedPlanId,
    storageReady,
    updatePrefs,
    toggleLang,
    selectPlan,
  };
}
