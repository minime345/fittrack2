import Link from "next/link";

type SiteFooterProps = {
  t: any;
  currentYear: number;
};

export function SiteFooter({ t, currentYear }: SiteFooterProps) {
  return (
    <footer className="mt-16 border-t border-white/10 bg-gray-950/55 py-12 text-gray-300 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-3">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <div className="fit-logo-mark flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-green-400 to-lime-500 font-black text-black">F</div>
            <span className="text-lg font-bold text-white">FitTrack</span>
          </div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-green-400">{t.footer.contacts}</h3>
          <p className="text-sm leading-7">
            Email:{" "}
            <a href="mailto:fittrackwebsite@gmail.com" className="text-green-400 hover:underline">fittrackwebsite@gmail.com</a>
          </p>
          <p className="text-sm leading-7">
            {t.footer.phone}{" "}
            <a href="tel:+359887183887" className="text-green-400 hover:underline">+359 887 183 887</a>
          </p>
          <p className="text-sm leading-7">{t.footer.address}</p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-green-400">{t.footer.quick}</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <li><Link href="/calculator" className="hover:text-green-400">{t.nav.calculator}</Link></li>
            <li><Link href="/personal-plan" className="hover:text-green-400">{t.nav.personal}</Link></li>
            <li><Link href="/plans" className="hover:text-green-400">{t.nav.plans}</Link></li>
            <li><Link href="/workouts" className="hover:text-green-400">{t.nav.workouts}</Link></li>
            <li><Link href="/meals" className="hover:text-green-400">{t.nav.meals}</Link></li>
            <li><Link href="/dashboard" className="hover:text-green-400">{t.nav.account || "Account"}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-green-400">{t.footer.follow}</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="https://www.facebook.com/share/1GT8Ey98Re/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">Facebook</a></li>
            <li><a href="https://www.instagram.com/semetoitsmaname" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">Instagram</a></li>
            <li><a href="https://www.youtube.com/yourchannel" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">YouTube</a></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/5 px-6 pt-6 text-center text-xs text-gray-500">
        © {currentYear} FitTrack. {t.footer.rights}
      </div>
    </footer>
  );
}
