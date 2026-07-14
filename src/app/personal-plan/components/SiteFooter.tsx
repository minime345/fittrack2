import Link from "next/link";

type SiteFooterProps = {
  t: any;
  currentYear: number;
};

export function SiteFooter({ t, currentYear }: SiteFooterProps) {
  return (
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
              <Link href="/workouts" className="hover:text-green-400">
                {t.nav.workouts}
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
  );
}
