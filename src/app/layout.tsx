import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LangProvider } from "@/context/LangContext"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitTrack — Personal Nutrition & Meal Plans",
  description: "Calculate your calorie needs and build a practical personalized meal plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script id="fittrack-theme" strategy="beforeInteractive">
          {`(function(){try{var saved=localStorage.getItem('fittrack-theme');var dark=saved==='dark'||(saved!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('theme-dark',dark)}catch(e){}})();`}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
