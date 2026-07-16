import { Menu } from "lucide-react";
import { Logo, NavLink } from "./NavBits";
import { AuthButton } from "./AuthButton";

type HeaderNavProps = {
  t: any;
  lang: "bg" | "en";
  toggleLang: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function HeaderNav({ t, lang, toggleLang, isOpen, setIsOpen }: HeaderNavProps) {
  return (
    <header className="fit-header sticky top-0 z-[100] border-b border-white/10 bg-white/5 shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Logo />

        <div className="flex items-center gap-6">
          {/* ÐÐ°Ð²Ð¸Ð³Ð°Ñ†Ð¸Ñ Ð·Ð° Ð´ÐµÑÐºÑ‚Ð¾Ð¿ */}
          <nav className="hidden md:flex gap-5 lg:gap-7">
            <NavLink href="/" label={t.nav.home} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/calculator" label={t.nav.calculator} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/personal-plan" label={t.nav.personal} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/plans" label={t.nav.plans} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/workouts" label={t.nav.workouts} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/meals" label={t.nav.meals} onNavigate={() => setIsOpen(false)} />
          </nav>

          {/* Ð‘ÑƒÑ‚Ð¾Ð½ Ð·Ð° ÑÐ¼ÑÐ½Ð° Ð½Ð° ÐµÐ·Ð¸Ðº â€“ Ð¾ÑÑ‚Ð°Ð²Ð° ÑÐ°Ð¼Ð¾ ÐµÐ´Ð¸Ð½ Ð¿ÑŠÑ‚ */}
          <button
            type="button"
            onClick={toggleLang}
            aria-label="Switch language"
            className="fit-language px-3 py-1.5 border border-green-400/70 text-green-400 rounded-lg hover:bg-green-500 hover:text-black transition text-sm font-medium"
          >
            {lang === "bg" ? "BG" : "EN"}
          </button>
          <div className="hidden md:block"><AuthButton lang={lang} /></div>

          {/* Mobile menu button */}
          <div className="md:hidden">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/10 bg-gray-950/60"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
          </div>
        </div>
      </div>

      {/* Mobile menu â€“ Ð±ÐµÐ· Ð±ÑƒÑ‚Ð¾Ð½ Ð·Ð° ÐµÐ·Ð¸Ðº Ð²ÑŠÑ‚Ñ€Ðµ */}
      {isOpen && (
        <div id="mobile-navigation" className="absolute left-0 right-0 top-full z-[110] border-t border-white/10 bg-gray-950 px-4 py-4 shadow-2xl md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            <NavLink href="/" label={t.nav.home} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/calculator" label={t.nav.calculator} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/personal-plan" label={t.nav.personal} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/plans" label={t.nav.plans} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/workouts" label={t.nav.workouts} onNavigate={() => setIsOpen(false)} />
            <NavLink href="/meals" label={t.nav.meals} onNavigate={() => setIsOpen(false)} />
            <AuthButton lang={lang} mobile onNavigate={() => setIsOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
}

