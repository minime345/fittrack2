export type LocalizedString = {
  bg: string;
  en: string;
};

export type Ingredient = {
  name: LocalizedString;
  amount: number;
  unit: string;
};

export type Meal = {
  slug: string;
  icon: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  weight: number;
  categories: string[];
  name: LocalizedString;
  recipe: LocalizedString;
  recipeSteps?: { bg: string[]; en: string[] };
  ingredients: Ingredient[];
  link: string;
  mealType: string[];
  proteinSource: string;
  fixedPortion?: boolean;
};


export const meals = [
 
  {
    slug: "oatmeal-banana-pb",
    icon: "🥣",
    kcal: 400,
    protein: 14,
    carbs: 45,
    fat: 18,
    weight: 350,
    categories: ["vegan", "vegetarian", "balanced", "high-carb"],
    name: {
      bg: "Овесена каша с банан и фъстъчено масло",
      en: "Oatmeal with Banana and Peanut Butter"
    },
    recipe: {
      bg: "Смеси овес, вода/ядково мляко, нарязан банан и 1 с.л. фъстъчено масло.",
      en: "Mix oats, water/plant milk, sliced banana and 1 tbsp peanut butter."
    },
    ingredients: [
      { name: { bg: "овесени ядки", en: "oats" }, amount: 60, unit: "g" },
      { name: { bg: "банан", en: "banana" }, amount: 1, unit: "" },
      { name: { bg: "фъстъчено масло", en: "peanut butter" }, amount: 15, unit: "g" },
      { name: { bg: "растително мляко", en: "plant milk" }, amount: 200, unit: "ml" }
    ],
    link: "/meals/oatmeal-banana-pb",
    mealType: ["breakfast"],
    proteinSource: "vegan"
  },
  {
    slug: "keto-salad-egg-avocado",
    icon: "🥗",
    kcal: 540,
    protein: 28,
    carbs: 6,
    fat: 45,
    weight: 350,
    categories: ["keto", "carnivore"],
    name: {
      bg: "Кето салата с яйце, авокадо и бекон",
      en: "Keto Salad with Egg, Avocado and Bacon"
    },
    recipe: {
      bg: "Салата с маруля, варено яйце, авокадо, бекон и зехтин.",
      en: "Salad with lettuce, boiled egg, avocado, bacon and olive oil."
    },
    ingredients: [
      { name: { bg: "маруля", en: "lettuce" }, amount: 50, unit: "g" },
      { name: { bg: "яйца", en: "eggs" }, amount: 1, unit: "" },
      { name: { bg: "авокадо", en: "avocado" }, amount: 0.5, unit: "" },
      { name: { bg: "бекон", en: "bacon" }, amount: 40, unit: "g" },
      { name: { bg: "зехтин", en: "olive oil" }, amount: 10, unit: "ml" }
    ],
    link: "/meals/keto-salad-egg-avocado",
    mealType: ["lunch"],
    proteinSource: "pork"
  },
  {
    slug: "vegan-protein-shake",
    icon: "🥤",
    kcal: 320,
    protein: 27,
    carbs: 30,
    fat: 7,
    weight: 400,
    categories: ["vegan", "vegetarian", "balanced", "high-protein"],
    name: {
      bg: "Протеинов шейк с банан и веган протеин",
      en: "Vegan Protein Shake with Banana"
    },
    recipe: {
      bg: "Блендирай банан, веган протеин, ядково мляко и лед.",
      en: "Blend banana, vegan protein, plant milk and ice."
    },
    ingredients: [
      { name: { bg: "банан", en: "banana" }, amount: 1, unit: "" },
      { name: { bg: "веган протеин", en: "vegan protein" }, amount: 30, unit: "g" },
      { name: { bg: "растително мляко", en: "plant milk" }, amount: 200, unit: "ml" }
    ],
    link: "/meals/vegan-protein-shake",
    mealType: ["snack", "breakfast"],
    proteinSource: "vegan"
  },
  {
    slug: "beef-egg-cheese",
    icon: "🥩",
    kcal: 540,
    protein: 45,
    carbs: 3,
    fat: 38,
    weight: 350,
    categories: ["carnivore", "keto", "high-protein"],
    name: {
      bg: "Говеждо месо с яйца и сирене",
      en: "Beef with Eggs and Cheese"
    },
    recipe: {
      bg: "Запържи говеждо с яйца и малко настъргано сирене.",
      en: "Fry beef with eggs and a little grated cheese."
    },
    ingredients: [
      { name: { bg: "говеждо месо", en: "beef" }, amount: 150, unit: "g" },
      { name: { bg: "яйца", en: "eggs" }, amount: 2, unit: "" },
      { name: { bg: "сирене", en: "cheese" }, amount: 30, unit: "g" }
    ],
    link: "/meals/beef-egg-cheese",
    mealType: ["dinner", "lunch"],
    proteinSource: "beef"
  },
  {
    slug: "lentil-stew",
    icon: "🍲",
    kcal: 420,
    protein: 23,
    carbs: 45,
    fat: 12,
    weight: 450,
    categories: ["vegan", "vegetarian", "balanced", "high-carb"],
    name: {
      bg: "Леща яхния с моркови и домат",
      en: "Lentil Stew with Carrots and Tomato"
    },
    recipe: {
      bg: "Свари леща с лук, моркови, домат и подправки.",
      en: "Cook lentils with onion, carrots, tomato and spices."
    },
    ingredients: [
      { name: { bg: "леща", en: "lentils" }, amount: 80, unit: "g" },
      { name: { bg: "морков", en: "carrot" }, amount: 1, unit: "" },
      { name: { bg: "домати", en: "tomatoes" }, amount: 100, unit: "g" },
      { name: { bg: "лук", en: "onion" }, amount: 0.5, unit: "" }
    ],
    link: "/meals/lentil-stew",
    mealType: ["lunch"],
    proteinSource: "vegan"
  },{
  slug: "omelet-mushrooms-spinach",
  icon: "🍳",
  kcal: 350,
  protein: 26,
  carbs: 5,
  fat: 24,
  weight: 250,
  categories: ["keto", "vegetarian", "balanced", "high-protein"],
  name: {
    bg: "Омлет с гъби и спанак",
    en: "Omelet with Mushrooms and Spinach"
  },
  recipe: {
    bg: "Приготви омлет от яйца с гъби и спанак.",
    en: "Cook an omelet with eggs, mushrooms and spinach."
  },
  ingredients: [
    { name: { bg: "яйца", en: "eggs" }, amount: 2, unit: "" },
    { name: { bg: "гъби", en: "mushrooms" }, amount: 50, unit: "g" },
    { name: { bg: "спанак", en: "spinach" }, amount: 50, unit: "g" }
  ],
  link: "/meals/omelet-mushrooms-spinach",
  mealType: ["breakfast"],
  proteinSource: "egg"
},
{
  slug: "salmon-veggies",
  icon: "🐟",
  kcal: 520,
  protein: 35,
  carbs: 10,
  fat: 38,
  weight: 400,
  categories: ["keto", "balanced", "high-protein"],
  name: {
    bg: "Печена сьомга със задушени зеленчуци",
    en: "Baked Salmon with Steamed Vegetables"
  },
  recipe: {
    bg: "Печена сьомга, сервирана със задушени броколи и моркови.",
    en: "Bake salmon and serve with steamed broccoli and carrots."
  },
  ingredients: [
    { name: { bg: "сьомга", en: "salmon" }, amount: 150, unit: "g" },
    { name: { bg: "броколи", en: "broccoli" }, amount: 100, unit: "g" },
    { name: { bg: "морков", en: "carrot" }, amount: 1, unit: "" }
  ],
  link: "/meals/salmon-veggies",
  mealType: ["dinner", "lunch"],
  proteinSource: "fish"
},
{
  slug: "tofu-pasta",
  icon: "🍝",
  kcal: 470,
  protein: 22,
  carbs: 55,
  fat: 16,
  weight: 400,
  categories: ["vegan", "vegetarian", "balanced"],
  name: {
    bg: "Паста с тофу и доматен сос",
    en: "Pasta with Tofu and Tomato Sauce"
  },
  recipe: {
    bg: "Цели зърна паста с тофу и доматен сос.",
    en: "Cook whole grain pasta with tofu and tomato sauce."
  },
  ingredients: [
    { name: { bg: "паста", en: "pasta" }, amount: 80, unit: "g" },
    { name: { bg: "тофу", en: "tofu" }, amount: 100, unit: "g" },
    { name: { bg: "доматен сос", en: "tomato sauce" }, amount: 100, unit: "ml" }
  ],
  link: "/meals/tofu-pasta",
  mealType: ["lunch"],
  proteinSource: "tofu"
},
{
  slug: "beef-steak-salad",
  icon: "🥩",
  kcal: 580,
  protein: 48,
  carbs: 6,
  fat: 40,
  weight: 350,
  categories: ["carnivore", "keto", "high-protein"],
  name: {
    bg: "Телешки стек със зелена салата",
    en: "Beef Steak with Green Salad"
  },
  recipe: {
    bg: "Грилован телешки стек със зелена салата и зехтин.",
    en: "Grill a beef steak and serve with green salad and olive oil."
  },
  ingredients: [
    { name: { bg: "телешко месо", en: "beef" }, amount: 180, unit: "g" },
    { name: { bg: "зелена салата", en: "green salad" }, amount: 50, unit: "g" }
  ],
  link: "/meals/beef-steak-salad",
  mealType: ["dinner", "lunch"],
  proteinSource: "beef"
},
{
  slug: "chicken",
  icon: "🍗",
  kcal: 520,
  protein: 42,
  carbs: 45,
  fat: 18,
  weight: 450,
  categories: ["balanced", "high-protein"],
  name: {
    bg: "Гриловано пилешко с ориз и броколи",
    en: "Grilled Chicken with Rice and Broccoli"
  },
  recipe: {
    bg: "Гриловано пилешко филе, варен ориз и задушени броколи.",
    en: "Grill chicken fillet and serve with boiled rice and steamed broccoli."
  },
  ingredients: [
    { name: { bg: "пилешко филе", en: "chicken fillet" }, amount: 150, unit: "g" },
    { name: { bg: "ориз", en: "rice" }, amount: 60, unit: "g" },
    { name: { bg: "броколи", en: "broccoli" }, amount: 100, unit: "g" }
  ],
  link: "/meals/chicken",
  mealType: ["lunch", "dinner"],
  proteinSource: "chicken"
},
{
  slug: "mixed-nuts",
  icon: "🥜",
  kcal: 180,
  protein: 5,
  carbs: 6,
  fat: 16,
  weight: 30,
  categories: ["vegan", "vegetarian", "keto", "snack"],
  name: {
    bg: "Микс от сурови ядки (30g)",
    en: "Mixed Nuts (30g)"
  },
  recipe: {
    bg: "Шепа сурови ядки – орехи, бадеми, лешници.",
    en: "A handful of raw nuts – walnuts, almonds, hazelnuts."
  },
  ingredients: [
    { name: { bg: "ядки", en: "nuts" }, amount: 30, unit: "g" }
  ],
  link: "",
  mealType: ["snack"],
  proteinSource: "vegan"
},
{
  slug: "protein-bar-choco",
  fixedPortion: true,
  icon: "🍫",
  kcal: 220,
  protein: 20,
  carbs: 15,
  fat: 10,
  weight: 60,
  categories: ["high-protein", "balanced", "snack"],
  name: {
    bg: "Протеинов бар с шоколад и фъстъци",
    en: "Protein Bar with Chocolate and Peanuts"
  },
  recipe: {
    bg: "Готов протеинов бар с шоколадов вкус и ядки.",
    en: "Ready-made protein bar with chocolate flavor and nuts."
  },
  ingredients: [
    { name: { bg: "протеинов бар", en: "protein bar" }, amount: 60, unit: "g" }
  ],
  link: "",
  mealType: ["snack"],
  proteinSource: "supplement"
},
{
  slug: "rice-cakes-pb",
  icon: "🍘",
  kcal: 190,
  protein: 6,
  carbs: 24,
  fat: 8,
  weight: 50,
  categories: ["vegan", "vegetarian", "balanced", "snack"],
  name: {
    bg: "Оризовки с фъстъчено масло (2 бр.)",
    en: "Rice Cakes with Peanut Butter (2 pcs)"
  },
  recipe: {
    bg: "Намажи 2 оризовки с фъстъчено масло.",
    en: "Spread peanut butter on 2 rice cakes."
  },
  ingredients: [
    { name: { bg: "оризовки", en: "rice cakes" }, amount: 2, unit: "" },
    { name: { bg: "фъстъчено масло", en: "peanut butter" }, amount: 15, unit: "g" }
  ],
  link: "",
  mealType: ["snack"],
  proteinSource: "vegan"
},
  {
    slug: "yogurt-honey-walnuts",
    icon: "🥣",
    kcal: 250,
    protein: 12,
    carbs: 20,
    fat: 14,
    weight: 200,
    categories: ["vegetarian", "balanced", "snack"],
    name: {
      bg: "Кисело мляко с мед и орехи",
      en: "Yogurt with Honey and Walnuts"
    },
    recipe: {
      bg: "Смеси кисело мляко, 1 ч.л. мед и счукани орехи.",
      en: "Mix yogurt with 1 tsp honey and crushed walnuts."
    },
    ingredients: [
      { name: { bg: "кисело мляко", en: "yogurt" }, amount: 150, unit: "g" },
      { name: { bg: "мед", en: "honey" }, amount: 5, unit: "g" },
      { name: { bg: "орехи", en: "walnuts" }, amount: 15, unit: "g" }
    ],
    link: "",
    mealType: ["snack", "breakfast"],
    proteinSource: "dairy"
  },
  {
    slug: "boiled-egg-avocado",
    icon: "🥚",
    kcal: 160,
    protein: 8,
    carbs: 2,
    fat: 13,
    weight: 100,
    categories: ["keto", "carnivore", "snack"],
    name: {
      bg: "Варено яйце с резен авокадо",
      en: "Boiled Egg with Avocado Slice"
    },
    recipe: {
      bg: "Сервирай 1 варено яйце с 1/4 авокадо.",
      en: "Serve 1 boiled egg with 1/4 avocado."
    },
    ingredients: [
      { name: { bg: "яйца", en: "eggs" }, amount: 1, unit: "" },
      { name: { bg: "авокадо", en: "avocado" }, amount: 0.5, unit: "" }
    ],
    link: "",
    mealType: ["snack", "breakfast"],
    proteinSource: "egg"
  },
  {
    slug: "vegan-protein-bar",
    fixedPortion: true,
    icon: "🌰",
    kcal: 210,
    protein: 12,
    carbs: 18,
    fat: 10,
    weight: 50,
    categories: ["vegan", "vegetarian", "high-protein", "snack"],
    name: {
      bg: "Веган протеинов бар с фурми и ядки",
      en: "Vegan Protein Bar with Dates and Nuts"
    },
    recipe: {
      bg: "Бар от фурми, ядки и растителен протеин.",
      en: "Bar made of dates, nuts and plant protein."
    },
    ingredients: [
      { name: { bg: "фурми", en: "dates" }, amount: 20, unit: "g" },
      { name: { bg: "ядки", en: "nuts" }, amount: 20, unit: "g" },
      { name: { bg: "веган протеин", en: "vegan protein" }, amount: 10, unit: "g" }
    ],
    link: "",
    mealType: ["snack"],
    proteinSource: "vegan"
  },
  {
    slug: "fresh-veggies-hummus",
    icon: "🥕",
    kcal: 150,
    protein: 5,
    carbs: 18,
    fat: 7,
    weight: 200,
    categories: ["vegan", "vegetarian", "balanced", "snack"],
    name: {
      bg: "Пресни зеленчуци с хумус",
      en: "Fresh Vegetables with Hummus"
    },
    recipe: {
      bg: "Нарежи краставици, чушки и моркови, сервирай с хумус.",
      en: "Slice cucumbers, peppers and carrots, serve with hummus."
    },
    ingredients: [
      { name: { bg: "краставици", en: "cucumbers" }, amount: 70, unit: "g" },
      { name: { bg: "чушки", en: "peppers" }, amount: 70, unit: "g" },
      { name: { bg: "морков", en: "carrot" }, amount: 1, unit: "" },
      { name: { bg: "хумус", en: "hummus" }, amount: 30, unit: "g" }
    ],
    link: "",
    mealType: ["snack"],
    proteinSource: "vegan"
  },
  {
    slug: "wholegrain-toast-avocado-egg",
    icon: "🥑",
    kcal: 350,
    protein: 20,
    carbs: 30,
    fat: 18,
    weight: 200,
    categories: ["vegetarian", "balanced", "high-protein", "breakfast"],
    name: {
      bg: "Пълнозърнест тост с авокадо и яйце",
      en: "Wholegrain Toast with Avocado and Egg"
    },
    recipe: {
      bg: "Пълнозърнест тост с намачкано авокадо и пържено яйце.",
      en: "Wholegrain toast with mashed avocado and fried egg."
    },
    ingredients: [
      { name: { bg: "пълнозърнест хляб", en: "wholegrain bread" }, amount: 100, unit: "g" },
      { name: { bg: "авокадо", en: "avocado" }, amount: 1, unit: ""},
      { name: { bg: "яйца", en: "eggs" }, amount: 1, unit: "" }
    ],
    link: "",
    mealType: ["breakfast"],
    proteinSource: "egg",
  },
  {
    slug: "chia-pudding-coconut-strawberries",
    icon: "🥥",
    kcal: 280,
    protein: 10,
    carbs: 30,
    fat: 15,
    weight: 250,
    categories: ["vegan", "vegetarian", "balanced", "high-fat"],
    name: {
      bg: "Чиа пудинг с растително мляко и ягоди",
      en: "Chia Pudding with Plant Milk and Strawberries"
    },
    recipe: {
      bg: "Накисни чиа семена в растително мляко и добави пресни ягоди.",
      en: "Soak chia seeds in plant milk and add fresh strawberries."
    },
    ingredients: [
      { name: { bg: "чиа семена", en: "chia seeds" }, amount: 30, unit: "g" },
      { name: { bg: "растително мляко", en: "plant milk" }, amount: 150, unit: "ml" },
      { name: { bg: "ягоди", en: "strawberries" }, amount: 70, unit: "g" }
    ],
    link: "",
    mealType: ["breakfast"],
    proteinSource: "vegan"
  },
  {
    slug: "vegan-protein-shake-plant-milk",
    icon: "🥤",
    kcal: 150,
    protein: 25,
    carbs: 3,
    fat: 2,
    weight: 300,
    categories: ["vegan", "vegetarian", "high-protein", "snack"],
    name: {
      bg: "Веган протеинов шейк с растително мляко",
      en: "Vegan Protein Shake with Plant Milk"
    },
    recipe: {
      bg: "Смеси веган протеин на прах с растително мляко и лед.",
      en: "Mix vegan protein powder with plant milk and ice."
    },
    ingredients: [
      { name: { bg: "веган протеин", en: "vegan protein" }, amount: 30, unit: "g" },
      { name: { bg: "растително мляко", en: "plant milk" }, amount: 250, unit: "ml" }
    ],
    link: "",
    mealType: ["snack"],
    proteinSource: "supplement"
  },
  {
    slug: "vegan-zucchini-quinoa",
    icon: "🥒",
    kcal: 450,
    protein: 18,
    carbs: 50,
    fat: 12,
    weight: 400,
    categories: ["vegan", "vegetarian", "balanced", "dinner"],
    name: {
      bg: "Веган тиквички с киноа и зеленчуци",
      en: "Vegan Zucchini with Quinoa and Vegetables"
    },
    recipe: {
      bg: "Запечи тиквички с киноа, чушки, домати и подправки.",
      en: "Bake zucchini with quinoa, peppers, tomatoes and spices."
    },
    ingredients: [
      { name: { bg: "тиквички", en: "zucchini" }, amount: 150, unit: "g" },
      { name: { bg: "киноа", en: "quinoa" }, amount: 70, unit: "g" },
      { name: { bg: "чушки", en: "peppers" }, amount: 80, unit: "g" },
      { name: { bg: "домати", en: "tomatoes" }, amount: 100, unit: "g" },
      { name: { bg: "подправки(сол, пипер и др.)", en: "spices(salt, pepper and others...)" }, amount: 20, unit: "g" }
    ],
    link: "",
    mealType: ["dinner"],
    proteinSource: "vegan"
  },
  {
    slug: "vegetarian-lasagna-spinach-ricotta",
    icon: "🥘",
    kcal: 520,
    protein: 30,
    carbs: 45,
    fat: 20,
    weight: 450,
    categories: ["vegetarian", "balanced", "dinner"],
    name: {
      bg: "Вегетарианска лазаня със спанак и рикота",
      en: "Vegetarian Lasagna with Spinach and Ricotta"
    },
    recipe: {
      bg: "Лазаня с домашна паста, спанак, рикота и доматен сос.",
      en: "Lasagna with homemade pasta, spinach, ricotta and tomato sauce."
    },
    ingredients: [
      { name: { bg: "домашна лазаня паста", en: "homemade lasagna pasta" }, amount: 150, unit: "g" },
      { name: { bg: "спанак", en: "spinach" }, amount: 100, unit: "g" },
      { name: { bg: "рикота", en: "ricotta" }, amount: 100, unit: "g" },
      { name: { bg: "доматен сос", en: "tomato sauce" }, amount: 100, unit: "ml" }
    ],
    link: "",
    mealType: ["dinner"],
    proteinSource: "dairy"
  },
    {
    slug: "vegan-chickpea-curry",
    icon: "🍛",
    kcal: 480,
    protein: 22,
    carbs: 55,
    fat: 15,
    weight: 400,
    categories: ["vegan", "vegetarian", "balanced", "dinner"],
    name: {
      bg: "Веганско къри с нахут и растително мляко",
      en: "Vegan Chickpea Curry with Plant Milk"
    },
    recipe: {
      bg: "Къри с нахут, зеленчуци и растително мляко, поднесено с ориз.",
      en: "Curry with chickpeas, vegetables and plant milk, served with rice."
    },
    ingredients: [
      { name: { bg: "нахут", en: "chickpeas" }, amount: 150, unit: "g" },
      { name: { bg: "растително мляко", en: "plant milk" }, amount: 100, unit: "ml" },
      { name: { bg: "ориз", en: "rice" }, amount: 50, unit: "g" }
    ],
    link: "",
    mealType: ["dinner"],
    proteinSource: "vegan"
  },
  {
    slug: "vegetarian-moussaka",
    icon: "🍆",
    kcal: 530,
    protein: 28,
    carbs: 40,
    fat: 22,
    weight: 450,
    categories: ["vegetarian", "balanced", "dinner"],
    name: {
      bg: "Вегетарианска мусака с патладжан и картофи",
      en: "Vegetarian Moussaka with Eggplant and Potatoes"
    },
    recipe: {
      bg: "Мусака с патладжан, картофи и млечен сос.",
      en: "Moussaka with eggplant, potatoes and milk sauce."
    },
    ingredients: [
      { name: { bg: "патладжан", en: "eggplant" }, amount: 150, unit: "g" },
      { name: { bg: "картофи", en: "potatoes" }, amount: 150, unit: "g" },
      { name: { bg: "млечен сос", en: "milk sauce" }, amount: 150, unit: "g" }
    ],
    link: "",
    mealType: ["dinner"],
    proteinSource: "dairy"
  },
  {
    slug: "vegan-spaghetti-chickpea-balls",
    icon: "🍝",
    kcal: 500,
    protein: 25,
    carbs: 60,
    fat: 14,
    weight: 400,
    categories: ["vegan", "vegetarian", "balanced", "dinner"],
    name: {
      bg: "Вегански спагети с доматен сос и нахутени кюфтета",
      en: "Vegan Spaghetti with Tomato Sauce and Chickpea Balls"
    },
    recipe: {
      bg: "Спагети с доматен сос и кюфтета от нахут и подправки.",
      en: "Spaghetti with tomato sauce and chickpea balls with spices."
    },
    ingredients: [
      { name: { bg: "паста", en: "pasta" }, amount: 150, unit: "g" },
      { name: { bg: "домати", en: "tomatoes" }, amount: 100, unit: "g" },
      { name: { bg: "нахут", en: "chickpes" }, amount: 120, unit: "g" }
    ],
    link: "",
    mealType: ["dinner"],
    proteinSource: "vegan"
  },
  {
    slug: "grilled-lamb-chops",
    icon: "🍖",
    kcal: 560,
    protein: 42,
    carbs: 0,
    fat: 44,
    weight: 300,
    categories: ["carnivore", "keto", "high-protein"],
    name: {
      bg: "Агнешки котлети на скара",
      en: "Grilled Lamb Chops"
    },
    recipe: {
      bg: "Овкуси агнешките котлети със сол и черен пипер, след което ги изпечи на скара до желаната готовност.",
      en: "Season lamb chops with salt and black pepper, then grill to desired doneness."
    },
    ingredients: [
      { name: { bg: "агнешки котлети", en: "lamb chops" }, amount: 250, unit: "g" }
    ],
    link: "",
    mealType: ["dinner"],
    proteinSource: "lamb"
  },
  {
    slug: "oven-pork-ribs",
    icon: "🍖",
    kcal: 700,
    protein: 50,
    carbs: 1,
    fat: 55,
    weight: 400,
    categories: ["carnivore", "keto", "high-fat"],
    name: {
      bg: "Свински ребра на фурна",
      en: "Oven-Baked Pork Ribs"
    },
    recipe: {
      bg: "Овкуси ребрата със сол и подправки, покрий с фолио и печи бавно на фурна до пълна готовност.",
      en: "Season the ribs with salt and spices, cover with foil and bake slowly in the oven until fully cooked."
    },
    ingredients: [
      { name: { bg: "свински ребра", en: "pork ribs" }, amount: 350, unit: "g" }
    ],
    link: "",
    mealType: ["dinner"],
    proteinSource: "pork"
  },
  {
    slug: "beef-burger-no-bun",
    icon: "🍔",
    kcal: 550,
    protein: 40,
    carbs: 2,
    fat: 42,
    weight: 300,
    categories: ["carnivore", "keto", "high-protein"],
    name: {
      bg: "Телешки бургер с айзберг завивка",
      en: "Beef Burger with lettuce wrap"
    },
    recipe: {
      bg: "Изпечи телешко кюфте и сервирай с резен кашкавал, яйце и завий със салата Айзберг.",
      en: "Grill a beef patty and serve with a slice of cheese, egg and wrap it in lettuce instead of a bun."
    },
    ingredients: [
      { name: { bg: "телешко кюфте", en: "beef patty" }, amount: 200, unit: "g" },
      { name: { bg: "кашкавал", en: "cheese" }, amount: 50, unit: "g" },
      { name: { bg: "яйца", en: "eggs" }, amount: 1, unit: "" },
      { name: { bg: "айзберг", en: "lettuce" }, amount: 20, unit: "g" },
    ],
    link: "",
    mealType: ["lunch"],
    proteinSource: "beef"
  },
  {
    slug: "cottage-cheese-berries",
    icon: "🫐",
    kcal: 300,
    protein: 28,
    carbs: 28,
    fat: 8,
    weight: 320,
    categories: ["vegetarian", "balanced", "high-protein"],
    name: { bg: "Извара с горски плодове и овес", en: "Cottage Cheese with Berries and Oats" },
    recipe: { bg: "Смеси изварата с овеса, горските плодове и малко мед.", en: "Combine cottage cheese with oats, berries, and a little honey." },
    recipeSteps: {
      bg: ["Сложи изварата в купа.", "Добави овеса и горските плодове.", "Полей с мед и разбъркай."],
      en: ["Add the cottage cheese to a bowl.", "Top with oats and berries.", "Drizzle with honey and mix."],
    },
    ingredients: [
      { name: { bg: "извара", en: "cottage cheese" }, amount: 200, unit: "g" },
      { name: { bg: "горски плодове", en: "mixed berries" }, amount: 80, unit: "g" },
      { name: { bg: "овесени ядки", en: "oats" }, amount: 30, unit: "g" },
      { name: { bg: "мед", en: "honey" }, amount: 10, unit: "g" },
    ],
    link: "",
    mealType: ["breakfast", "snack"],
    proteinSource: "dairy",
  },
  {
    slug: "roasted-chickpeas",
    icon: "🫘",
    kcal: 230,
    protein: 11,
    carbs: 34,
    fat: 6,
    weight: 160,
    categories: ["vegan", "vegetarian", "balanced", "snack"],
    name: { bg: "Хрупкав печен нахут", en: "Crispy Roasted Chickpeas" },
    recipe: { bg: "Изпечи нахута със зехтин, пушен пипер и сол до хрупкавост.", en: "Roast chickpeas with olive oil, smoked paprika, and salt until crisp." },
    recipeSteps: {
      bg: ["Подсуши добре сварения нахут.", "Смеси го със зехтина и подправките.", "Печи 25–30 минути на 200°C, като разбъркаш веднъж."],
      en: ["Pat the cooked chickpeas dry.", "Toss with olive oil and spices.", "Roast at 200°C for 25–30 minutes, stirring once."],
    },
    ingredients: [
      { name: { bg: "нахут", en: "chickpeas" }, amount: 150, unit: "g" },
      { name: { bg: "зехтин", en: "olive oil" }, amount: 5, unit: "ml" },
      { name: { bg: "пушен пипер и сол", en: "smoked paprika and salt" }, amount: 2, unit: "g" },
    ],
    link: "",
    mealType: ["snack"],
    proteinSource: "vegan",
  },
  {
    slug: "edamame-sea-salt",
    icon: "🫛",
    kcal: 190,
    protein: 18,
    carbs: 14,
    fat: 8,
    weight: 160,
    categories: ["vegan", "vegetarian", "high-protein", "snack"],
    name: { bg: "Едамаме с морска сол и лимон", en: "Edamame with Sea Salt and Lemon" },
    recipe: { bg: "Свари едамамето и го овкуси с морска сол и лимон.", en: "Boil the edamame and season with sea salt and lemon." },
    recipeSteps: {
      bg: ["Свари едамамето за 4–5 минути.", "Отцеди го добре.", "Добави морска сол и лимонов сок."],
      en: ["Boil the edamame for 4–5 minutes.", "Drain well.", "Finish with sea salt and lemon juice."],
    },
    ingredients: [
      { name: { bg: "едамаме", en: "edamame" }, amount: 150, unit: "g" },
      { name: { bg: "лимон", en: "lemon" }, amount: 0.5, unit: "" },
      { name: { bg: "морска сол", en: "sea salt" }, amount: 1, unit: "g" },
    ],
    link: "",
    mealType: ["snack"],
    proteinSource: "vegan",
  },
  {
    slug: "turkey-sweet-potato-bowl",
    icon: "🍠",
    kcal: 560,
    protein: 46,
    carbs: 58,
    fat: 16,
    weight: 500,
    categories: ["balanced", "high-protein"],
    name: { bg: "Пуешко със сладък картоф и зеленчуци", en: "Turkey and Sweet Potato Bowl" },
    recipe: { bg: "Изпечи сладкия картоф и сервирай с пуешко и пресни зеленчуци.", en: "Roast the sweet potato and serve with turkey and fresh vegetables." },
    recipeSteps: {
      bg: ["Нарежи и изпечи сладкия картоф на 200°C.", "Запечи пуешкото с подправки.", "Подреди със зеленчуците и добави соса от кисело мляко."],
      en: ["Cube and roast the sweet potato at 200°C.", "Cook the seasoned turkey until done.", "Assemble with vegetables and yogurt sauce."],
    },
    ingredients: [
      { name: { bg: "пуешко филе", en: "turkey breast" }, amount: 180, unit: "g" },
      { name: { bg: "сладък картоф", en: "sweet potato" }, amount: 220, unit: "g" },
      { name: { bg: "зелени зеленчуци", en: "green vegetables" }, amount: 100, unit: "g" },
      { name: { bg: "кисело мляко", en: "yogurt" }, amount: 40, unit: "g" },
    ],
    link: "",
    mealType: ["lunch", "dinner"],
    proteinSource: "chicken",
  },
  {
    slug: "tuna-white-bean-salad",
    icon: "🥗",
    kcal: 480,
    protein: 42,
    carbs: 45,
    fat: 14,
    weight: 450,
    categories: ["balanced", "high-protein", "mediterranean"],
    name: { bg: "Салата с риба тон и бял боб", en: "Tuna and White Bean Salad" },
    recipe: { bg: "Смеси риба тон, бял боб, домати, краставица и лимонов дресинг.", en: "Combine tuna, white beans, tomatoes, cucumber, and lemon dressing." },
    recipeSteps: {
      bg: ["Изплакни и отцеди боба.", "Нарежи зеленчуците и добави рибата тон.", "Овкуси със зехтин, лимон и магданоз."],
      en: ["Rinse and drain the beans.", "Chop the vegetables and add the tuna.", "Dress with olive oil, lemon, and parsley."],
    },
    ingredients: [
      { name: { bg: "риба тон", en: "tuna" }, amount: 150, unit: "g" },
      { name: { bg: "бял боб", en: "white beans" }, amount: 150, unit: "g" },
      { name: { bg: "домати и краставица", en: "tomatoes and cucumber" }, amount: 140, unit: "g" },
      { name: { bg: "зехтин", en: "olive oil" }, amount: 10, unit: "ml" },
    ],
    link: "",
    mealType: ["lunch", "dinner"],
    proteinSource: "fish",
  },
  {
    slug: "shrimp-quinoa-vegetables",
    icon: "🍤",
    kcal: 510,
    protein: 44,
    carbs: 52,
    fat: 14,
    weight: 480,
    categories: ["balanced", "high-protein", "mediterranean"],
    name: { bg: "Скариди с киноа и зеленчуци", en: "Shrimp with Quinoa and Vegetables" },
    recipe: { bg: "Запечи скаридите и ги сервирай с киноа и задушени зеленчуци.", en: "Sauté the shrimp and serve with quinoa and vegetables." },
    recipeSteps: {
      bg: ["Свари киноата според указанията.", "Задуши зеленчуците до леко омекване.", "Запечи скаридите за 3–4 минути и смеси всичко."],
      en: ["Cook the quinoa according to its instructions.", "Sauté the vegetables until just tender.", "Cook the shrimp for 3–4 minutes and combine."],
    },
    ingredients: [
      { name: { bg: "скариди", en: "shrimp" }, amount: 180, unit: "g" },
      { name: { bg: "киноа", en: "quinoa" }, amount: 80, unit: "g" },
      { name: { bg: "тиквички и чушки", en: "zucchini and peppers" }, amount: 200, unit: "g" },
      { name: { bg: "зехтин", en: "olive oil" }, amount: 10, unit: "ml" },
    ],
    link: "",
    mealType: ["lunch", "dinner"],
    proteinSource: "fish",
  }

].filter((meal) => ![
  "boiled-egg-avocado",
  "vegan-protein-bar",
  "vegan-protein-shake-plant-milk",
].includes(meal.slug));



