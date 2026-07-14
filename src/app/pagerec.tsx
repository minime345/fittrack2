"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-tr from-green-400 to-lime-500 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-md">
        F
      </div>
      <span className="text-xl md:text-2xl font-bold tracking-wide text-white">FitTrack</span>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm font-medium"
    >
      {label}
    </Link>
  );
}

// ÐŸÑ€Ð¸Ð¼ÐµÑ€ÐµÐ½ Ñ€ÐµÐºÐ»Ð°Ð¼ÐµÐ½ ÐºÐ¾Ð¼Ð¿Ð¾Ð½ÐµÐ½Ñ‚ (mock ad) Ñ Ñ„Ð¸ÐºÑÐ¸Ñ€Ð°Ð½ Ñ€Ð°Ð·Ð¼ÐµÑ€ 300x250
function SideMockAd({ text }: { text: string }) {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center w-[200px] h-[500px] m-4 border-4 border-dashed border-green-400 rounded-lg bg-green-900 bg-opacity-30 text-center text-green-300 font-semibold">
      {text}
    </div>
  );
}

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <title>FitTrack â€“ ÐšÐ°Ð»ÐºÑƒÐ»Ð°Ñ‚Ð¾Ñ€Ð¸ Ð¸ Ñ€ÐµÐ¶Ð¸Ð¼Ð¸</title>
        <meta name="description" content="FitTrack â€“ Ð¢Ð²Ð¾ÑÑ‚ Ð»Ð¸Ñ‡ÐµÐ½ Ð°ÑÐ¸ÑÑ‚ÐµÐ½Ñ‚ Ð·Ð° Ð·Ð´Ñ€Ð°Ð²Ð¾ÑÐ»Ð¾Ð²ÐµÐ½ Ð¶Ð¸Ð²Ð¾Ñ‚" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-sans">
        {/* Ð¥ÐµÐ´ÑŠÑ€ */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Logo />
            <nav className="hidden md:flex gap-5 lg:gap-7">
              <NavLink href="/" label="ÐÐ°Ñ‡Ð°Ð»Ð¾" />
              <NavLink href="/calculator" label="ÐšÐ°Ð»ÐºÑƒÐ»Ð°Ñ‚Ð¾Ñ€" />
              <NavLink href="/personal-plan" label="ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»Ð½Ð¸ Ñ€ÐµÐ¶Ð¸Ð¼Ð¸" />
              <NavLink href="/plans" label="Ð ÐµÐ¶Ð¸Ð¼Ð¸" />
              <NavLink href="/meals" label="Ð¯ÑÑ‚Ð¸Ñ" />
            </nav>
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)}>
                <Menu className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden bg-black/80 px-6 pb-4">
              <div className="flex flex-col gap-4">
                <NavLink href="/" label="ÐÐ°Ñ‡Ð°Ð»Ð¾" />
                <NavLink href="/calculator" label="ÐšÐ°Ð»ÐºÑƒÐ»Ð°Ñ‚Ð¾Ñ€" />
                <NavLink href="/personal-plan" label="ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»Ð½Ð¸ Ñ€ÐµÐ¶Ð¸Ð¼Ð¸" />
                <NavLink href="/plans" label="Ð ÐµÐ¶Ð¸Ð¼Ð¸" />
                <NavLink href="/meals" label="Ð¯ÑÑ‚Ð¸Ñ" />
              </div>
            </div>
          )}
        </header>

        {/* ÐžÑÐ½Ð¾Ð²Ð½Ð¾ ÑÑŠÐ´ÑŠÑ€Ð¶Ð°Ð½Ð¸Ðµ Ñ Ñ€ÐµÐºÐ»Ð°Ð¼Ð¸ Ð¾Ñ‚ÑÑ‚Ñ€Ð°Ð½Ð¸ */}
        <section className="max-w-7xl mx-auto px-6 py-24 flex justify-center gap-6">
          {/* Ð›ÑÐ²Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ‡Ð½Ð° Ñ€ÐµÐºÐ»Ð°Ð¼Ð° */}
          <SideMockAd text="Ð ÐµÐºÐ»Ð°Ð¼Ð° Ð»ÑÐ²Ð¾ 300x250" />

          {/* Ð¦ÐµÐ½Ñ‚Ñ€Ð°Ð»Ð½Ð° ÐºÐ¾Ð»Ð¾Ð½Ð° Ñ Ð¾ÑÐ½Ð¾Ð²Ð½Ð¾Ñ‚Ð¾ */}
          <div className="max-w-3xl flex-grow text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold text-green-400 mb-6"
            >
              Ð”Ð¾Ð±Ñ€Ðµ Ð´Ð¾ÑˆÑŠÐ» Ð²ÑŠÐ² FitTrack
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10"
            >
              Ð¢Ð²Ð¾ÑÑ‚ Ð»Ð¸Ñ‡ÐµÐ½ Ð°ÑÐ¸ÑÑ‚ÐµÐ½Ñ‚ Ð·Ð° ÐºÐ°Ð»Ð¾Ñ€Ð¸Ð¸, Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÐµÐ»Ð½Ð¸ Ñ€ÐµÐ¶Ð¸Ð¼Ð¸ Ð¸ Ð·Ð´Ñ€Ð°Ð²Ð¾ÑÐ»Ð¾Ð²ÐµÐ½ Ð½Ð°Ñ‡Ð¸Ð½ Ð½Ð° Ð¶Ð¸Ð²Ð¾Ñ‚.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
            >
              <Link
                href="/calculator"
                className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-lg shadow-lg transition"
              >
                Ð˜Ð·Ñ‡Ð¸ÑÐ»Ð¸ ÐºÐ°Ð»Ð¾Ñ€Ð¸Ð¸
              </Link>
              <Link
                href="/personal-plan"
                className="border border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-semibold px-6 py-3 rounded-lg shadow-lg transition"
              >
                ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»ÐµÐ½ Ñ€ÐµÐ¶Ð¸Ð¼
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Image
                src="/homepage-fitness.jpg"
                alt="Fit Lifestyle"
                width={720}
                height={480}
                className="mx-auto rounded-3xl shadow-2xl border border-white/10"
              />
            </motion.div>
          </div>

          {/* Ð”ÑÑÐ½Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ‡Ð½Ð° Ñ€ÐµÐºÐ»Ð°Ð¼Ð° */}
          <SideMockAd text="Ð ÐµÐºÐ»Ð°Ð¼Ð° Ð´ÑÑÐ½Ð¾ 300x250" />
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12 mt-12 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">ÐšÐ¾Ð½Ñ‚Ð°ÐºÑ‚Ð¸</h3>
              <p>
                Email:{" "}
                <a href="mailto:info@fittrack.bg" className="text-green-400 hover:underline">
                  info@fittrack.bg
                </a>
              </p>
              <p>
                Ð¢ÐµÐ»ÐµÑ„Ð¾Ð½:{" "}
                <a href="tel:+359888123456" className="text-green-400 hover:underline">
                  +359 888 123 456
                </a>
              </p>
              <p>ÐÐ´Ñ€ÐµÑ: Ð¡Ð¾Ñ„Ð¸Ñ, Ð‘ÑŠÐ»Ð³Ð°Ñ€Ð¸Ñ</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Ð‘ÑŠÑ€Ð·Ð¸ Ð²Ñ€ÑŠÐ·ÐºÐ¸</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/calculator" className="hover:text-green-400">
                    ÐšÐ°Ð»ÐºÑƒÐ»Ð°Ñ‚Ð¾Ñ€
                  </Link>
                </li>
                <li>
                  <Link href="/plans" className="hover:text-green-400">
                    Ð ÐµÐ¶Ð¸Ð¼Ð¸
                  </Link>
                </li>
                <li>
                  <Link href="/meals" className="hover:text-green-400">
                    Ð¯ÑÑ‚Ð¸Ñ
                  </Link>
                </li>
                <li>
                  <Link href="/personal-plan" className="hover:text-green-400">
                    ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»Ð½Ð¸ Ñ€ÐµÐ¶Ð¸Ð¼Ð¸
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">ÐŸÐ¾ÑÐ»ÐµÐ´Ð²Ð°Ð¹ Ð½Ð¸</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.facebook.com/" className="hover:text-green-400">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-10 text-sm text-gray-500">
            Â© {currentYear} FitTrack. Ð’ÑÐ¸Ñ‡ÐºÐ¸ Ð¿Ñ€Ð°Ð²Ð° Ð·Ð°Ð¿Ð°Ð·ÐµÐ½Ð¸.
          </div>
        </footer>
      </main>
    </>
  );
}

