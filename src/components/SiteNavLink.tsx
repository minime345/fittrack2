"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteNavLink({ href, label, onNavigate }: { href: string; label: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`fit-nav-link text-sm font-medium transition-colors duration-200 ${
        active ? "text-green-400" : "text-gray-300 hover:text-green-400"
      }`}
    >
      {label}
    </Link>
  );
}
