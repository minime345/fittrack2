import Link from "next/link";

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

export function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="fit-nav-link text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm font-medium"
    >
      {label}
    </Link>
  );
}
