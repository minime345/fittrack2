import { Menu } from "lucide-react";
import { Logo, NavLink } from "./NavBits";

type HeaderNavProps = {
  t: any;
  lang: "bg" | "en";
  toggleLang: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function HeaderNav({ t, lang, toggleLang, isOpen, setIsOpen }: HeaderNavProps) {
  return (
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
            className="fit-language px-3 py-1.5 border border-green-400/70 text-green-400 rounded-lg hover:bg-green-500 hover:text-black transition text-sm font-medium"
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
  );
}

