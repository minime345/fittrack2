import { meals } from "@/data/meals";
import { notFound } from "next/navigation";
import { MealDetailPage } from "../MealDetailPage";

export function generateStaticParams() {
  return meals.map((meal) => ({ slug: meal.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!meals.some((meal) => meal.slug === slug)) notFound();
  return <MealDetailPage slug={slug} />;
}
