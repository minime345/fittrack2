"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { translations, type Lang } from "@/lib/translations";
import { SiteNavLink } from "@/components/SiteNavLink";
import { useLang } from "@/context/LangContext";
import { Analytics } from "@vercel/analytics/react";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="fit-logo-mark w-10 h-10 bg-gradient-to-tr from-green-400 to-lime-500 rounded-xl flex items-center justify-center text-black font-bold text-lg shadow-md">
        F
      </div>
      <span className="text-xl md:text-2xl font-bold tracking-wide text-white">FitTrack</span>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return <SiteNavLink href={href} label={label} />;
}

const proteinFactorsByActivity: Record<number, [number, number]> = {
  1.2: [1.2, 1.6],
  1.375: [1.4, 1.8],
  1.55: [1.6, 2.0],
  1.725: [1.8, 2.2],
  1.9: [2.0, 2.4],
};

const getProteinRange = (weight: number, activity: number): [number, number] => {
  const [minimum, maximum] = proteinFactorsByActivity[activity] ?? [1.6, 2.2];
  return [Math.round(weight * minimum), Math.round(weight * maximum)];
};

export default function Calculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("bg"); // default bg
  const [age, setAge] = useState<number | "">(25);
  const [weight, setWeight] = useState<number | "">(70);
  const [height, setHeight] = useState<number | "">(175);
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState(1.2);
  const [bodyFat, setBodyFat] = useState<number | "" | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [usedFormula, setUsedFormula] = useState<string>("");
  const [proteinRange, setProteinRange] = useState<[number, number] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [profileReady, setProfileReady] = useState(false);

  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement>(null);

  // Client-side effect Ð·Ð° ÐµÐ·Ð¸Ðº
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "bg") {
      setLang(saved);
    }
  }, []);

  const toggleLang = () => {
    const newLang = lang === "bg" ? "en" : "bg";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  // ÐŸÑ€ÐµÐ²Ð¾Ð´Ð¸
  const t = translations[lang] || translations.bg;

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fittrack-calculator-profile-v1");
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        age?: number;
        weight?: number;
        height?: number;
        gender?: string;
        activity?: number;
        bodyFat?: number | null;
        calories?: number | null;
      };
      if (Number.isFinite(saved.age)) setAge(saved.age!);
      if (Number.isFinite(saved.weight)) setWeight(saved.weight!);
      if (Number.isFinite(saved.height)) setHeight(saved.height!);
      if (saved.gender === "male" || saved.gender === "female") setGender(saved.gender);
      if (Number.isFinite(saved.activity)) setActivity(saved.activity!);
      setBodyFat(saved.bodyFat ?? null);
      if (Number.isFinite(saved.calories)) {
        setResult(saved.calories!);
        setShowResult(true);
      }
      if (Number.isFinite(saved.weight) && Number.isFinite(saved.activity)) {
        setProteinRange(getProteinRange(saved.weight!, saved.activity!));
      }
    } catch {
      localStorage.removeItem("fittrack-calculator-profile-v1");
    } finally {
      setProfileReady(true);
    }
  }, []);

  useEffect(() => {
    if (!profileReady) return;
    localStorage.setItem("fittrack-calculator-profile-v1", JSON.stringify({
      age: age === "" ? null : Number(age),
      weight: weight === "" ? null : Number(weight),
      height: height === "" ? null : Number(height),
      gender,
      activity,
      bodyFat: bodyFat === "" || bodyFat === null ? null : Number(bodyFat),
      calories: result,
      updatedAt: Date.now(),
    }));
  }, [profileReady, age, weight, height, gender, activity, bodyFat, result]);

  useEffect(() => {
    if (!result) return;
    setUsedFormula(bodyFat !== null && bodyFat !== "" && bodyFat > 0 && bodyFat < 100
      ? t.calculator.formulaKatch
      : t.calculator.formulaMifflin);
  }, [lang, result, bodyFat, t.calculator.formulaKatch, t.calculator.formulaMifflin]);

  const handleNumberChange =
    (setter: (val: number | "") => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value === "" ? "" : Number(value));
    };

  const calculateCalories = () => {
    if (age === "" || weight === "" || height === "") {
      alert(t.calculator.alertFill);
      return;
    }

    if (
      Number(age) < 10 || Number(age) > 100 ||
      Number(weight) < 30 || Number(weight) > 300 ||
      Number(height) < 100 || Number(height) > 230
    ) {
      alert(t.calculator.alertRange);
      return;
    }

    let bmr;
    if (bodyFat !== null && bodyFat !== "" && bodyFat > 0 && bodyFat < 100) {
      const leanMass = Number(weight) * (1 - Number(bodyFat) / 100);
      bmr = 370 + 21.6 * leanMass;
      setUsedFormula(t.calculator.formulaKatch);
    } else {
      bmr =
        gender === "male"
          ? 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) + 5
          : 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) - 161;
      setUsedFormula(t.calculator.formulaMifflin);
    }

    const calories = bmr * activity;
    const roundedCalories = Math.round(calories);
    setResult(roundedCalories);
    // Protein needs rise with training intensity/volume (ISSN guidance: ~1.2-2.4 g/kg).
    setProteinRange(getProteinRange(Number(weight), activity));

    setShowResult(false);
    setTimeout(() => setShowResult(true), 50);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  return (
    <main className="fit-shell min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-sans">
      <header className="fit-header sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Logo />
      
          <div className="flex items-center gap-6">
            {/* ÐÐ°Ð²Ð¸Ð³Ð°Ñ†Ð¸Ñ Ð·Ð° Ð´ÐµÑÐºÑ‚Ð¾Ð¿ */}
            <nav className="hidden md:flex gap-5 lg:gap-7">
              <NavLink href="/" label={t.nav.home} />
              <NavLink href="/calculator" label={t.nav.calculator} />
              <NavLink href="/personal-plan" label={t.nav.personal} />
              <NavLink href="/plans" label={t.nav.plans} />
              <NavLink href="/workouts" label={t.nav.workouts} />
              <NavLink href="/meals" label={t.nav.meals} />
            </nav>
      
            {/* Ð‘ÑƒÑ‚Ð¾Ð½ Ð·Ð° ÑÐ¼ÑÐ½Ð° Ð½Ð° ÐµÐ·Ð¸Ðº â€“ Ð¾ÑÑ‚Ð°Ð²Ð° ÑÐ°Ð¼Ð¾ ÐµÐ´Ð¸Ð½ Ð¿ÑŠÑ‚ */}
            <button
              onClick={toggleLang}
              aria-label="Switch language"
              className="fit-language px-3 py-1.5 border border-green-400/70 text-green-400 hover:bg-green-500 hover:text-black transition text-sm font-medium"
            >
              {lang === "bg" ? "BG" : "EN"}
            </button>
      
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                <Menu className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      
        {/* Mobile menu â€“ Ð±ÐµÐ· Ð±ÑƒÑ‚Ð¾Ð½ Ð·Ð° ÐµÐ·Ð¸Ðº Ð²ÑŠÑ‚Ñ€Ðµ */}
        {isOpen && (
          <div className="md:hidden bg-black/80 px-6 pb-4">
            <div className="flex flex-col gap-4">
              <NavLink href="/" label={t.nav.home} />
              <NavLink href="/calculator" label={t.nav.calculator} />
              <NavLink href="/personal-plan" label={t.nav.personal} />
              <NavLink href="/plans" label={t.nav.plans} />
              <NavLink href="/workouts" label={t.nav.workouts} />
              <NavLink href="/meals" label={t.nav.meals} />
            </div>
          </div>
        )}
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="fit-surface bg-gray-900/90 rounded-3xl shadow-2xl backdrop-blur-md border border-green-500/20 p-4 sm:p-7">
          <h1 className="fit-title-gradient text-2xl sm:text-4xl font-extrabold mb-5 text-center">{t.calculator.title}</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              calculateCalories();
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
          >
            <fieldset disabled={!profileReady} className="contents">
            <InputField label={t.calculator.age} value={age} onChange={handleNumberChange(setAge)} min={10} max={100} step={1} />
            <InputField label={t.calculator.weight} value={weight} onChange={handleNumberChange(setWeight)} min={30} max={300} step={0.1} />
            <InputField label={t.calculator.height} value={height} onChange={handleNumberChange(setHeight)} min={100} max={230} step={0.1} />

            <div>
              <label className="block mb-1.5 text-sm font-semibold text-gray-100">{t.calculator.gender}</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-gray-950/60 p-3 text-white outline-none transition focus:border-green-400/70 focus:ring-4 focus:ring-green-500/10"
              >
                <option value="male">{t.calculator.male}</option>
                <option value="female">{t.calculator.female}</option>
              </select>
            </div>

            <div className="sm:col-span-2">
  <label className="block mb-2 text-sm font-semibold text-gray-100">{t.calculator.activity}</label>
  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
    {t.calculator.activityOptions.map((label, idx) => {
      const values = [1.2, 1.375, 1.55, 1.725, 1.9]; // ÑÑŠÐ¾Ñ‚Ð²ÐµÑ‚Ð½Ð¸Ñ‚Ðµ ÐºÐ¾ÐµÑ„Ð¸Ñ†Ð¸ÐµÐ½Ñ‚Ð¸
      const icons = ["🛋️", "🚶", "🏃", "💪", "🔥"];
      const [title, description] = label.split(" — ");
      const isSelected = activity === values[idx];
      return (
        <button
          key={idx}
          type="button"
          onClick={() => setActivity(values[idx])}
          aria-pressed={isSelected}
          className={`relative flex min-h-28 w-full flex-col items-center justify-center gap-1.5 rounded-xl border px-2.5 py-3 text-center transition lg:min-h-40 ${
            isSelected
              ? "border-green-400 bg-green-500/10"
              : "border-white/15 bg-gray-950/50 hover:border-green-400/50 hover:bg-gray-800"
          }`}
        >
          <span className="shrink-0 text-xl">{icons[idx]}</span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold leading-tight text-white sm:text-sm">{title}</span>
            {description && (
              <span className="mt-1 block text-[10px] leading-snug text-gray-400 sm:text-[11px]">{description}</span>
            )}
          </span>
          <span
            className={`absolute right-2 top-2 text-green-400 transition-opacity ${
              isSelected ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          >
            ✓
          </span>
        </button>
      );
    })}
  </div>
</div>

            <InputField
              label={t.calculator.bodyFat}
              value={bodyFat ?? ""}
              onChange={(e) =>
                setBodyFat(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder={t.calculator.option}
              min={3}
              max={60}
              step={0.1}
            />

            <button
              type="submit"
              className="fit-primary-button w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-xl transition sm:self-end"
            >
              {t.calculator.calculate}
            </button>
            </fieldset>
          </form>

          {result && (
            <div
              ref={resultRef}
              className={`mt-6 border border-green-500/15 bg-gray-950/60 px-4 sm:px-6 py-5 rounded-2xl shadow-inner text-center space-y-3
                transition-all duration-500 ease-out
                ${showResult ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}
            >
              <p className="text-xl font-semibold">{t.calculator.resultCalories}</p>
              <p className="text-4xl font-bold text-green-400">{result} kcal</p>
              <p className="italic text-gray-400">{usedFormula}</p>

              {proteinRange && (
                <div className="mt-6 text-center">
                  <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-green-400 to-lime-500 bg-clip-text text-transparent">
                    {t.calculator.proteinRange}: <br className="sm:hidden" />
                    {proteinRange[0]} - {proteinRange[1]} {t.calculator.prot}
                  </p>
                </div>
              )}
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
  <InfoCard title={t.calculator.quickCard[0]} value={result - 500} />
  <InfoCard title={t.calculator.quickCard[1]} value={result - 250} />
  <InfoCard title={t.calculator.quickCard[2]} value={result} />
  <InfoCard title={t.calculator.quickCard[3]} value={result + 300} />
</div>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    router.push(
                      `/personal-plan?calories=${result}&age=${age}&weight=${weight}&height=${height}&gender=${gender}&activity=${activity}&bodyFat=${bodyFat ?? ''}&proteinMin=${proteinRange?.[0]}&proteinMax=${proteinRange?.[1]}`
                    );
                  }}
                  className="fit-primary-button w-full rounded-lg bg-green-500 px-6 py-3 font-semibold text-black transition hover:bg-green-600 sm:w-auto"
                >
                  {t.calculator.planButton}
                </button>
                <Link href="/workouts" className="fit-secondary-button w-full rounded-lg border border-green-500/30 px-6 py-3 text-center font-semibold text-green-200 sm:w-auto">
                  {lang === "bg" ? "Препоръчана тренировка" : "Recommended workout"}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.footer.contacts}</h3>
            <p>
              Email:{" "}
              <a href="mailto:fittrackwebsite@gmail.com" className="text-green-400 hover:underline">
                fittrackwebsite@gmail.com
              </a>
            </p>
            <p>
              {t.footer.phone}{" "}
              <a href="tel:+359887183887" className="text-green-400 hover:underline">
                +359 887 183 887
              </a>
            </p>
            <p>{t.footer.address}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.footer.quick}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/calculator" className="hover:text-green-400">
                  {t.nav.calculator}
                </Link>
              </li>
              <li>
                <Link href="/plans" className="hover:text-green-400">
                  {t.nav.plans}
                </Link>
              </li>
              <li>
                <Link href="/meals" className="hover:text-green-400">
                  {t.nav.meals}
                </Link>
              </li>
              <li>
                <Link href="/personal-plan" className="hover:text-green-400">
                  {t.nav.personal}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.footer.follow}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.facebook.com/share/1GT8Ey98Re/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/semetoitsmaname"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/yourchannel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-10 text-sm text-gray-500">
          © {currentYear} FitTrack. {t.footer.rights}
        </div>
      </footer>

      {/* Vercel Analytics */}
      <Analytics />
    </main>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
}: {
  label: string;
  value: number | "";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="block mb-1.5 text-sm font-semibold text-gray-100">{label}</label>
      <input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step ?? "any"}
        className="w-full rounded-xl border border-white/10 bg-gray-950/60 p-3 text-white outline-none transition focus:border-green-400/70 focus:ring-4 focus:ring-green-500/10"
      />
    </div>
  );
}
function InfoCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="fit-surface bg-gray-800 rounded-xl p-4 shadow text-center">
      <h3 className="text-green-300 font-semibold text-sm mb-1">{title}</h3>
      <p className="text-white font-bold text-lg">{value} kcal</p>
    </div>
  );
}


