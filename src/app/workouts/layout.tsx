import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workout Plans | FitTrack",
  description: "Personalized weekly workout plans for strength, muscle, fitness, and fat loss.",
};

export default function WorkoutsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
