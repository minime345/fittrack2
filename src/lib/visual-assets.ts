import type { Meal } from "@/data/meals";

export function mealImageFor(
  meal: Pick<Meal, "slug" | "mealType" | "categories" | "proteinSource">,
) {
  const { slug } = meal;

  if (["keto-salad-egg-avocado", "boiled-egg-avocado", "wholegrain-toast-avocado-egg"].includes(slug)) return "/brand/meals/eggs-avocado.webp";
  if (slug === "chia-pudding-coconut-strawberries") return "/brand/meals/pexels-chia-strawberry.webp";
  if (["oatmeal-banana-pb", "berry-baked-oats"].includes(slug)) return "/brand/meals/breakfast.webp";
  if (["yogurt-honey-walnuts", "cottage-cheese-berries", "yogurt-cheesecake-bowl"].includes(slug)) return "/brand/meals/yogurt-berries.webp";
  if (["vegan-protein-shake", "vegan-protein-shake-plant-milk"].includes(slug)) return "/brand/meals/pexels-protein-shake.webp";
  if (["protein-bar-choco", "vegan-protein-bar"].includes(slug)) return "/brand/meals/protein-bars-peanut.webp";
  if (slug === "mixed-nuts") return "/brand/meals/mixed-nuts.webp";
  if (slug === "rice-cakes-pb") return "/brand/meals/rice-cakes-peanut-butter.webp";
  if (slug === "edamame-sea-salt") return "/brand/meals/pexels-edamame.webp";
  if (slug === "fresh-veggies-hummus") return "/brand/meals/veggies-hummus.webp";
  if (slug === "roasted-chickpeas") return "/brand/meals/plant-based.webp";
  if (slug === "chicken-shawarma-rice-bowl") return "/brand/meals/pexels-chicken-rice.webp";
  if (slug === "pesto-chicken-mozzarella") return "/brand/meals/pesto-chicken-mozzarella.webp";
  if (slug === "turkey-sweet-potato-bowl") return "/brand/meals/chicken-rice.webp";
  if (slug === "butter-salmon-asparagus") return "/brand/meals/salmon.webp";
  if (slug === "lentil-stew") return "/brand/meals/pexels-lentil-stew.webp";
  if (slug === "omelet-mushrooms-spinach") return "/brand/meals/pexels-mushroom-spinach.webp";
  if (slug === "creamy-mushroom-risotto") return "/brand/meals/pexels-mushroom-spinach.webp";
  if (slug === "tofu-pasta") return "/brand/meals/tofu-tomato-pasta.webp";
  if (slug === "thai-peanut-tofu-noodles") return "/brand/meals/thai-peanut-tofu-noodles.webp";
  if (slug === "chicken") return "/brand/meals/pexels-chicken-rice.webp";
  if (slug === "salmon-veggies") return "/brand/meals/salmon.webp";
  if (slug === "beef-steak-salad") return "/brand/meals/steak.webp";
  if (slug === "beef-egg-cheese") return "/brand/meals/beef-eggs.webp";
  if (slug === "lamb-kofta-yogurt") return "/brand/meals/pexels-lamb-kofta.webp";
  if (slug === "beef-bulgogi-bowl") return "/brand/meals/beef-bulgogi-bowl.webp";
  if (slug === "grilled-lamb-chops") return "/brand/meals/pexels-grilled-lamb-chops.webp";
  if (slug === "beef-burger-no-bun") return "/brand/meals/pexels-bunless-burger.webp";
  if (slug === "oven-pork-ribs") return "/brand/meals/steak.webp";
  if (["vegetarian-lasagna-spinach-ricotta", "vegetarian-moussaka", "vegan-spaghetti-chickpea-balls"].includes(slug)) return "/brand/meals/lasagna.webp";
  if (["vegan-zucchini-quinoa", "vegan-chickpea-curry"].includes(slug)) return "/brand/meals/chickpea-curry.webp";
  if (slug === "shrimp-quinoa-vegetables") return "/brand/meals/shrimp-quinoa.webp";
  if (slug === "tuna-white-bean-salad") return "/brand/meals/tuna-white-bean-salad.webp";

  if (meal.mealType.includes("breakfast")) return "/brand/meals/breakfast.webp";

  if (
    meal.categories.includes("vegan") ||
    meal.proteinSource === "vegan" ||
    meal.proteinSource === "vegetarian"
  ) {
    return "/brand/meals/plant-based.webp";
  }

  if (
    meal.categories.includes("high-protein") ||
    meal.categories.includes("keto") ||
    meal.categories.includes("carnivore")
  ) {
    return "/brand/meals/high-protein.webp";
  }

  return "/brand/meals/balanced.webp";
}

export function workoutImageFor(programId: string) {
  if (programId === "home") return "/brand/workouts/garage-gym.webp";
  if (programId === "street-fitness") return "/brand/workouts/pexels-street-fitness.webp";
  if (programId === "calisthenics-skills") return "/brand/workouts/pexels-handstand.webp";
  if (programId === "hyrox") return "/brand/workouts/pexels-airbike.webp";
  if (["hybrid", "functional"].includes(programId)) return "/brand/workouts/pexels-gym-equipment.webp";
  if (programId === "boxing-conditioning") return "/brand/workouts/boxing.webp";
  if (programId === "hiit-circuit") return "/brand/workouts/pexels-airbike.webp";
  if (["beginner-5k", "endurance"].includes(programId)) return "/brand/workouts/pexels-treadmills.webp";
  if (programId === "mobility") return "/brand/workouts/mobility-gym.webp";
  if (["upper-lower", "push-pull-legs", "bodybuilding"].includes(programId)) return "/brand/workouts/dumbbell-press.webp";
  return "/brand/workouts/strength-squat.webp";
}
