import { SiteNavLink } from "@/components/SiteNavLink";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="fit-logo-mark w-10 h-10 bg-gradient-to-tr from-green-400 to-lime-500 rounded-xl flex items-center justify-center text-black font-bold text-lg shadow-md">
        F
      </div>
      <span className="text-xl md:text-2xl font-bold tracking-wide text-white">FitTrack</span>
    </div>
  );
}

export function NavLink({ href, label, onNavigate }: { href: string; label: string; onNavigate?: () => void }) {
  return <SiteNavLink href={href} label={label} onNavigate={onNavigate} />;
}
