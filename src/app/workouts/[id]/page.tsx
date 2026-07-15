import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { programs } from "../data/programs";
import { PlanDetailClient } from "./PlanDetailClient";

export function generateStaticParams() {
  return programs.map((program) => ({ id: program.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const program = programs.find((item) => item.id === id);
  if (!program) return {};
  return {
    title: `${program.name.en} | FitTrack Workouts`,
    description: program.summary.en,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!programs.some((program) => program.id === id)) notFound();
  return <PlanDetailClient id={id} />;
}
