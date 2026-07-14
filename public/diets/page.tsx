"use client";

import Link from "next/link";
import Image from "next/image";

function Logo() {
  return (
    <div className="flex items-center">
      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl">
        F
      </div>
      <span className="ml-3 text-2xl font-bold text-white">FitTrack</span>
    </div>
  );
}

const meals = [
  {
    name: "Пилешко с киноа и броколи",
    image: "/meals/chicken-quinoa.jpg",
    macros: "550 kcal • 45g протеин • 40g въглехидрати • 20g мазнини",
    recipe: `Съставки:
- Пилешко филе – 150g
- Киноа – 70g (сурова)
- Броколи – 100g
- Зехтин – 1 с.л. (10ml)
- Чесън – 1 скилидка

Начин на приготвяне:
1. Киноата се сварява според указанията.
2. Пилето се запича на тиган с чесън.
3. Броколите се задушават и се добавят към киноата.
4. Всичко се комбинира с 1 с.л. зехтин.`,
  },
  {
    name: "Сьомга с авокадо и салата",
    image: "/meals/salmon-avocado.jpg",
    macros: "600 kcal • 42g протеин • 12g въглехидрати • 38g мазнини",
    recipe: `Съставки:
- Сьомга филе – 180g
- Авокадо – 1/2 (80g)
- Рукола – 50g
- Маслиново масло – 1 с.л. (10ml)
- Лимон – 1/2 бр

Начин на приготвяне:
1. Сьомгата се запича на скара или фурна.
2. Смесете руколата с нарязано авокадо и лимонов сок.
3. Подредете всичко в чиния и полейте с маслиново масло.`,
  },
  // Добави още 8 ястия по същия шаблон...
  {
    name: "Омлет с извара и спанак",
    image: "/meals/omelet-spinach.jpg",
    macros: "350 kcal • 30g протеин • 5g въглехидрати • 22g мазнини",
    recipe: `Съставки:
- Яйца – 3 бр
- Извара – 100g
- Спанак – 50g
- Зехтин – 1 ч.л. (5ml)

Начин на приготвяне:
1. Спанакът се запържва за кратко със зехтина.
2. Яйцата се разбиват и се добавят към спанака.
3. Поръсете с извара и гответе на слаб огън до готовност.`,
  },
  {
    name: "Гръцко кисело мляко с ядки и боровинки",
    image: "/meals/yogurt-berries.jpg",
    macros: "320 kcal • 25g протеин • 18g въглехидрати • 14g мазнини",
    recipe: `Съставки:
- Гръцко кисело мляко 2% – 200g
- Боровинки – 50g
- Орехи – 10g
- Ленено семе – 5g

Начин на приготвяне:
1. Смесете всички съставки в купа.
2. По желание – добавете канела или малко мед.`,
  },
  {
    name: "Телешко с ориз и зеленчуци",
    image: "/meals/beef-rice.jpg",
    macros: "620 kcal • 48g протеин • 50g въглехидрати • 22g мазнини",
    recipe: `Съставки:
- Телешко месо – 150g
- Кафяв ориз – 70g
- Морков – 50g
- Чушки – 50g
- Зехтин – 1 с.л. (10ml)

Начин на приготвяне:
1. Оризът се сварява.
2. Зеленчуците и месото се запържват леко.
3. Всичко се смесва в една порция.`,
  },
  {
    name: "Тофу с зеленчуци и соев сос",
    image: "/meals/tofu-stirfry.jpg",
    macros: "400 kcal • 30g протеин • 20g въглехидрати • 22g мазнини",
    recipe: `Съставки:
- Тофу – 150g
- Броколи – 100g
- Морков – 50g
- Соев сос – 2 с.л. (20ml)
- Кокосово масло – 1 ч.л.

Начин на приготвяне:
1. Зеленчуците се запържват в кокосово масло.
2. Добавете нарязаното тофу и соев сос.
3. Гответе до златисто.`,
  },
  {
    name: "Протеинови палачинки с банан",
    image: "/meals/protein-pancakes.jpg",
    macros: "390 kcal • 35g протеин • 28g въглехидрати • 12g мазнини",
    recipe: `Съставки:
- Яйца – 2 бр
- Банан – 1 бр (120g)
- Протеин (ванилия) – 1 мерителна лъжица (30g)
- Овесено брашно – 30g

Начин на приготвяне:
1. Смесете всички съставки и разбийте добре.
2. Изпечете палачинки на тиган с малко мазнина.`,
  },
  {
    name: "Пъстърва с картофи и лимон",
    image: "/meals/trout-lemon.jpg",
    macros: "500 kcal • 42g протеин • 30g въглехидрати • 24g мазнини",
    recipe: `Съставки:
- Пъстърва – 180g
- Картофи – 100g
- Лимон – 1/2 бр
- Масло – 1 ч.л. (5g)

Начин на приготвяне:
1. Пъстървата се пече с масло и лимонов сок.
2. Картофите се сваряват или пекат.
3. Сервирайте заедно.`,
  },
  {
    name: "Салата с леща и яйце",
    image: "/meals/lentil-salad.jpg",
    macros: "440 kcal • 30g протеин • 35g въглехидрати • 16g мазнини",
    recipe: `Съставки:
- Леща (сварена) – 100g
- Яйце – 2 бр
- Краставица – 50g
- Зехтин – 1 с.л. (10ml)

Начин на приготвяне:
1. Сварете лещата и яйцата.
2. Нарежете зеленчуците и смесете всичко в купа.
3. Полейте със зехтин.`,
  },
];

export default function MealsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Навигация */}
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 py-6 border-b border-gray-700">
        <Logo />
        <div className="space-x-8">
          <Link href="/" className="text-gray-300 hover:text-green-400 font-semibold transition">Начало</Link>
          <Link href="/calculator" className="text-gray-300 hover:text-green-400 font-semibold transition">Калкулатор</Link>
          <Link href="/personal-plan" className="text-gray-300 hover:text-green-400 font-semibold transition">Персонални хранителни режими</Link>
          <Link href="/plans" className="text-gray-300 hover:text-green-400 font-semibold transition">Хранителни режими</Link>
          <Link href="/meals" className="text-gray-300 hover:text-green-400 font-semibold transition">Примерни ястия</Link>
        </div>
      </nav>

      {/* Основна секция */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-green-400 text-center mb-10">Примерни Високопротеинови Ястия</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {meals.map((meal) => (
            <div key={meal.name} className="relative group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
              <Image
                src={meal.image}
                alt={meal.name}
                width={400}
                height={250}
                className="object-cover w-full h-56"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-green-400">{meal.name}</h2>
                <p className="text-gray-300 text-sm mt-1">{meal.macros}</p>
              </div>

              {/* Рецепта при hover */}
              <div className="absolute inset-0 bg-white bg-opacity-95 text-gray-900 p-4 text-sm opacity-0 group-hover:opacity-100 transition duration-300 whitespace-pre-line overflow-y-auto rounded-xl">
                {meal.recipe}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
