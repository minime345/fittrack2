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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Logo />

        <div className="flex items-center gap-6">
          {/* Навигация за десктоп */}
          <nav className="hidden md:flex gap-10">
            <NavLink href="/" label={t.nav.home} />
            <NavLink href="/calculator" label={t.nav.calculator} />
            <NavLink href="/personal-plan" label={t.nav.personal} />
            <NavLink href="/plans" label={t.nav.plans} />
            <NavLink href="/meals" label={t.nav.meals} />
          </nav>

          {/* Бутон за смяна на език – остава само един път */}
          <button
            onClick={toggleLang}
            aria-label="Switch language"
            className="px-3 py-1 border border-green-400 text-green-400 rounded-lg hover:bg-green-500 hover:text-black transition text-sm font-medium"
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

      {/* Mobile menu – без бутон за език вътре */}
      {isOpen && (
        <div className="md:hidden bg-black/80 px-6 pb-4">
          <div className="flex flex-col gap-4">
            <NavLink href="/" label={t.nav.home} />
            <NavLink href="/calculator" label={t.nav.calculator} />
            <NavLink href="/personal-plan" label={t.nav.personal} />
            <NavLink href="/plans" label={t.nav.plans} />
            <NavLink href="/meals" label={t.nav.meals} />
          </div>
        </div>
      )}
    </header>
  );
}
