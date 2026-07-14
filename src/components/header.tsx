"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="bg-card border-b border-border text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-primary">
          FitTrack
        </Link>
        <nav className="space-x-4">
          <Link href="/calculator" className="hover:underline">Калкулатор</Link>
          <Link href="/plans" className="hover:underline">Режими</Link>
          <Link href="/meals" className="hover:underline">Ястия</Link>
          <Link href="/personal-plan" className="hover:underline">Персонален</Link>
        </nav>
      </div>
    </header>
  );
}