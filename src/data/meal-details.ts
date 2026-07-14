export type LocalizedString = {
  bg: string;
  en: string;
};

export type MealIngredient = {
  name: LocalizedString;
  amount: LocalizedString;
  substitute: LocalizedString;
};

export type MealDetail = {
  slug: string;
  icon: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  weight: number;
  image?: string;
  name: LocalizedString;
  ingredients: MealIngredient[];
  recipeSteps: {
    bg: string[];
    en: string[];
  };
};

export const mealDetails: Record<string, MealDetail> = {
  chicken: {
    slug: "chicken",
    icon: "🍗",
    kcal: 520,
    protein: 42,
    carbs: 45,
    fat: 18,
    weight: 450,
    name: {
      bg: "Пилешко с ориз и броколи",
      en: "Chicken with Rice and Broccoli",
    },
    ingredients: [
      {
        name: { bg: "Пилешко филе (без кожа)", en: "Chicken fillet (skinless)" },
        amount: { bg: "150 г", en: "150 g" },
        substitute: { bg: "пуешко филе, тофу", en: "turkey fillet, tofu" },
      },
      {
        name: { bg: "Бял или кафяв ориз", en: "White or brown rice" },
        amount: { bg: "70 г сух", en: "70 g dry" },
        substitute: { bg: "кус-кус, киноа, булгур", en: "couscous, quinoa, bulgur" },
      },
      {
        name: { bg: "Броколи (сурови)", en: "Broccoli (raw)" },
        amount: { bg: "150 г", en: "150 g" },
        substitute: { bg: "тиквички, карфиол, спанак", en: "zucchini, cauliflower, spinach" },
      },
      {
        name: { bg: "Зехтин или масло", en: "Olive oil or butter" },
        amount: { bg: "1 с.л. (10-15 мл)", en: "1 tbsp (10-15 ml)" },
        substitute: { bg: "кокосово масло, масло гхи", en: "coconut oil, ghee" },
      },
      {
        name: { bg: "Чесън/подправки", en: "Garlic/spices" },
        amount: { bg: "на вкус", en: "to taste" },
        substitute: { bg: "лимон, къри, черен пипер", en: "lemon, curry, black pepper" },
      },
    ],
    recipeSteps: {
      bg: [
        "Свари ориза в подсолена вода според инструкциите (обикновено 10-15 минути).",
        "Нарежи пилето на хапки, овкуси с подправки и запечи в тиган със зехтин до златисто (около 8-10 мин).",
        "На пара или сварени леко — сготви броколите (5-6 мин).",
        "Смеси всичко в чиния, гарнирай с още подправки или лимонов сок по желание.",
        "Можеш да добавиш пармезан, тахан или кисело мляко като допълнение.",
      ],
      en: [
        "Cook the rice in salted water according to the instructions (usually 10-15 minutes).",
        "Cut the chicken into bite-sized pieces, season with spices, and pan-fry in olive oil until golden (about 8-10 min).",
        "Steam or lightly boil the broccoli (5-6 min).",
        "Combine everything on a plate, garnish with extra spices or lemon juice if desired.",
        "You can add parmesan, tahini, or yogurt as an extra.",
      ],
    },
  },

  "beef-egg-cheese": {
    slug: "beef-egg-cheese",
    icon: "🥩",
    kcal: 540,
    protein: 45,
    carbs: 3,
    fat: 38,
    weight: 350,
    image: "/meals/beef-eggs.jpeg",
    name: {
      bg: "Говеждо месо с яйца и сирене",
      en: "Beef with Eggs and Cheese",
    },
    ingredients: [
      {
        name: { bg: "Смляно говеждо месо (10% мазнини)", en: "Ground beef (10% fat)" },
        amount: { bg: "200 г", en: "200 g" },
        substitute: { bg: "кайма от телешко, пуешко", en: "veal or turkey mince" },
      },
      {
        name: { bg: "Яйца", en: "Eggs" },
        amount: { bg: "2 бр (100 г)", en: "2 pcs (100 g)" },
        substitute: { bg: "яйчен белтък, тофу", en: "egg whites, tofu" },
      },
      {
        name: { bg: "Кашкавал/сирене (твърдо)", en: "Yellow cheese/hard cheese" },
        amount: { bg: "40 г", en: "40 g" },
        substitute: { bg: "моцарела, веган сирене", en: "mozzarella, vegan cheese" },
      },
      {
        name: { bg: "Краве масло/зехтин", en: "Butter/olive oil" },
        amount: { bg: "1 ч.л. (5 г)", en: "1 tsp (5 g)" },
        substitute: { bg: "гхи, кокосово масло", en: "ghee, coconut oil" },
      },
      {
        name: { bg: "Подправки", en: "Spices" },
        amount: { bg: "на вкус", en: "to taste" },
        substitute: { bg: "сол, черен пипер, чубрица", en: "salt, black pepper, savory" },
      },
    ],
    recipeSteps: {
      bg: [
        "Загрей тиган с малко мазнина.",
        "Запържи говеждото месо до готовност (около 6–8 минути), като го раздробяваш с шпатула.",
        "Добави яйцата и разбъркай, докато се сготвят (около 2–3 мин).",
        "Поръси със сиренето и остави за 1 минута да се разтопи.",
        "Сервирай горещо с подправки по избор.",
      ],
      en: [
        "Heat a pan with a little fat.",
        "Fry the ground beef until cooked through (about 6-8 minutes), breaking it up with a spatula.",
        "Add the eggs and stir until cooked (about 2-3 min).",
        "Sprinkle with cheese and let it melt for 1 minute.",
        "Serve hot with spices of your choice.",
      ],
    },
  },

  "beef-steak-salad": {
    slug: "beef-steak-salad",
    icon: "🥩",
    kcal: 580,
    protein: 48,
    carbs: 6,
    fat: 40,
    weight: 350,
    name: {
      bg: "Телешки стек със зелена салата",
      en: "Beef Steak with Green Salad",
    },
    ingredients: [
      {
        name: { bg: "Телешки стек (рибай, контрафиле)", en: "Beef steak (ribeye, sirloin)" },
        amount: { bg: "200 г", en: "200 g" },
        substitute: { bg: "свински стек, пилешко филе", en: "pork steak, chicken fillet" },
      },
      {
        name: { bg: "Микс зелена салата (айсберг, рукола, спанак)", en: "Mixed greens (iceberg, arugula, spinach)" },
        amount: { bg: "100 г", en: "100 g" },
        substitute: { bg: "само спанак или зелена салата", en: "spinach or lettuce only" },
      },
      {
        name: { bg: "Чери домати", en: "Cherry tomatoes" },
        amount: { bg: "50 г", en: "50 g" },
        substitute: { bg: "обикновени домати, печени чушки", en: "regular tomatoes, roasted peppers" },
      },
      {
        name: { bg: "Зехтин extra virgin", en: "Extra virgin olive oil" },
        amount: { bg: "1 с.л. (10 г)", en: "1 tbsp (10 g)" },
        substitute: { bg: "олио от авокадо, спрей мазнина", en: "avocado oil, cooking spray" },
      },
      {
        name: { bg: "Балсамов оцет и подправки", en: "Balsamic vinegar and spices" },
        amount: { bg: "на вкус", en: "to taste" },
        substitute: { bg: "лимонов сок, ябълков оцет", en: "lemon juice, apple cider vinegar" },
      },
    ],
    recipeSteps: {
      bg: [
        "Извади стекът от хладилника 20 минути преди готвене, за да се темперира.",
        "Подсуши го и овкуси със сол и черен пипер от двете страни.",
        "Загрей тиган с малко мазнина и запечи стека по 3–4 минути на страна за средно изпечен (medium).",
        "Остави го да почине 5 минути преди нарязване.",
        "През това време приготви салата от измитите зелени листа, домати, зехтин и балсамов оцет.",
        "Нарежи стека и сервирай върху салатата.",
      ],
      en: [
        "Take the steak out of the fridge 20 minutes before cooking to let it come to room temperature.",
        "Pat it dry and season both sides with salt and black pepper.",
        "Heat a pan with a little fat and sear the steak for 3-4 minutes per side for medium doneness.",
        "Let it rest for 5 minutes before slicing.",
        "Meanwhile, make the salad from the washed greens, tomatoes, olive oil, and balsamic vinegar.",
        "Slice the steak and serve over the salad.",
      ],
    },
  },

  "keto-salad-egg-avocado": {
    slug: "keto-salad-egg-avocado",
    icon: "🥑",
    kcal: 540,
    protein: 28,
    carbs: 6,
    fat: 45,
    weight: 350,
    name: {
      bg: "Кето салата с яйце, авокадо и бекон",
      en: "Keto Salad with Egg, Avocado, and Bacon",
    },
    ingredients: [
      {
        name: { bg: "Авокадо", en: "Avocado" },
        amount: { bg: "1/2 бр (100 г)", en: "1/2 pc (100 g)" },
        substitute: { bg: "маслини, ядки", en: "olives, nuts" },
      },
      {
        name: { bg: "Яйца (варени)", en: "Eggs (boiled)" },
        amount: { bg: "2 бр", en: "2 pcs" },
        substitute: { bg: "яйца по очи, тофу", en: "fried eggs, tofu" },
      },
      {
        name: { bg: "Бекон (запечен)", en: "Bacon (fried)" },
        amount: { bg: "50 г", en: "50 g" },
        substitute: { bg: "пуешки бекон, веган алтернатива", en: "turkey bacon, vegan alternative" },
      },
      {
        name: { bg: "Маруля / микс зелени", en: "Lettuce / mixed greens" },
        amount: { bg: "80 г", en: "80 g" },
        substitute: { bg: "спанак, рукола", en: "spinach, arugula" },
      },
      {
        name: { bg: "Домати чери", en: "Cherry tomatoes" },
        amount: { bg: "4-5 бр", en: "4-5 pcs" },
        substitute: { bg: "краставица, чушка", en: "cucumber, bell pepper" },
      },
      {
        name: { bg: "Зехтин", en: "Olive oil" },
        amount: { bg: "1 с.л.", en: "1 tbsp" },
        substitute: { bg: "ленено масло, авокадово масло", en: "flaxseed oil, avocado oil" },
      },
      {
        name: { bg: "Лимон + сол", en: "Lemon + salt" },
        amount: { bg: "на вкус", en: "to taste" },
        substitute: { bg: "балсамико, оцет", en: "balsamic, vinegar" },
      },
    ],
    recipeSteps: {
      bg: [
        "Свари яйцата за 8-10 мин и ги обели.",
        "Запечи бекона в сух тиган до златисто (около 4-5 мин).",
        "Нарежи авокадото, доматите и марулята.",
        "В купа комбинирай всичко, нарежи яйцата и бекона.",
        "Полей със зехтин, лимон и овкуси със сол и подправки.",
        "Разбъркай леко и сервирай веднага.",
      ],
      en: [
        "Boil the eggs for 8-10 minutes and peel them.",
        "Fry the bacon in a dry pan until golden (about 4-5 min).",
        "Chop the avocado, tomatoes, and lettuce.",
        "Combine everything in a bowl, slice the eggs and bacon.",
        "Drizzle with olive oil and lemon, and season with salt and spices.",
        "Toss gently and serve immediately.",
      ],
    },
  },

  "lentil-stew": {
    slug: "lentil-stew",
    icon: "🍲",
    kcal: 420,
    protein: 23,
    carbs: 45,
    fat: 12,
    weight: 450,
    name: {
      bg: "Леща яхния с моркови и домат",
      en: "Lentil Stew with Carrots and Tomato",
    },
    ingredients: [
      {
        name: { bg: "Суха леща", en: "Dry lentils" },
        amount: { bg: "100 г", en: "100 g" },
        substitute: { bg: "червена леща, зелена леща", en: "red lentils, green lentils" },
      },
      {
        name: { bg: "Морков", en: "Carrot" },
        amount: { bg: "1 бр (80 г)", en: "1 pc (80 g)" },
        substitute: { bg: "сладки картофи, тиквичка", en: "sweet potato, zucchini" },
      },
      {
        name: { bg: "Доматено пюре", en: "Tomato puree" },
        amount: { bg: "50 г", en: "50 g" },
        substitute: { bg: "пресни домати, пасирани домати", en: "fresh tomatoes, crushed tomatoes" },
      },
      {
        name: { bg: "Лук", en: "Onion" },
        amount: { bg: "1/2 глава (50 г)", en: "1/2 onion (50 g)" },
        substitute: { bg: "сух лук, праз лук", en: "dried onion, leek" },
      },
      {
        name: { bg: "Чесън", en: "Garlic" },
        amount: { bg: "1 скилидка", en: "1 clove" },
        substitute: { bg: "чесън на прах", en: "garlic powder" },
      },
      {
        name: { bg: "Олио/зехтин", en: "Vegetable oil/olive oil" },
        amount: { bg: "1 с.л. (10 г)", en: "1 tbsp (10 g)" },
        substitute: { bg: "кокосово масло, масло", en: "coconut oil, butter" },
      },
      {
        name: { bg: "Подправки", en: "Spices" },
        amount: { bg: "на вкус", en: "to taste" },
        substitute: { bg: "кимион, чубрица, червен пипер, сол", en: "cumin, savory, paprika, salt" },
      },
    ],
    recipeSteps: {
      bg: [
        "Накисни лещата за 1 час (по избор).",
        "Запържи лука, моркова и чесъна в мазнината за 2-3 минути.",
        "Добави лещата, доматеното пюре и 500 мл вода.",
        "Овкуси с подправки и вари на слаб огън около 25–30 минути.",
        "Разбъркай добре и сервирай топло. По желание гарнирай със свеж магданоз.",
      ],
      en: [
        "Soak the lentils for 1 hour (optional).",
        "Sauté the onion, carrot, and garlic in the oil for 2-3 minutes.",
        "Add the lentils, tomato puree, and 500 ml of water.",
        "Season with spices and simmer on low heat for about 25-30 minutes.",
        "Stir well and serve warm. Garnish with fresh parsley if desired.",
      ],
    },
  },

  "oatmeal-banana-pb": {
    slug: "oatmeal-banana-pb",
    icon: "🥣",
    kcal: 400,
    protein: 14,
    carbs: 45,
    fat: 18,
    weight: 350,
    name: {
      bg: "Овесена каша с банан и фъстъчено масло",
      en: "Oatmeal with Banana and Peanut Butter",
    },
    ingredients: [
      {
        name: { bg: "Фини овесени ядки", en: "Fine rolled oats" },
        amount: { bg: "50 г", en: "50 g" },
        substitute: { bg: "елда, киноа", en: "buckwheat, quinoa" },
      },
      {
        name: { bg: "Банан", en: "Banana" },
        amount: { bg: "1 бр (120 г)", en: "1 pc (120 g)" },
        substitute: { bg: "ябълка, круша", en: "apple, pear" },
      },
      {
        name: { bg: "Фъстъчено масло", en: "Peanut butter" },
        amount: { bg: "1 с.л. (15 г)", en: "1 tbsp (15 g)" },
        substitute: { bg: "бадемово масло, тахан", en: "almond butter, tahini" },
      },
      {
        name: { bg: "Ядково мляко (или вода)", en: "Nut milk (or water)" },
        amount: { bg: "200 мл", en: "200 ml" },
        substitute: { bg: "обезмаслено мляко", en: "skim milk" },
      },
      {
        name: { bg: "Канела (по избор)", en: "Cinnamon (optional)" },
        amount: { bg: "½ ч.л.", en: "½ tsp" },
        substitute: { bg: "ванилия, какао", en: "vanilla, cocoa" },
      },
    ],
    recipeSteps: {
      bg: [
        "Сипи ядковото мляко (или вода) в тенджера и го загрей до завиране.",
        "Добави овесените ядки и вари 5-7 минути на слаб огън, като разбъркваш.",
        "Намачкай банана и го добави към кашата.",
        "Разбъркай и добави фъстъченото масло.",
        "Подправи с канела и сервирай топло. Можеш да гарнираш с още банан или ядки по желание.",
      ],
      en: [
        "Pour the nut milk (or water) into a pot and heat until it starts to boil.",
        "Add the oats and cook for 5-7 minutes on low heat, stirring.",
        "Mash the banana and add it to the porridge.",
        "Stir and add the peanut butter.",
        "Season with cinnamon and serve warm. You can garnish with extra banana or nuts if desired.",
      ],
    },
  },

  "omelet-mushrooms-spinach": {
    slug: "omelet-mushrooms-spinach",
    icon: "🍳",
    kcal: 350,
    protein: 26,
    carbs: 5,
    fat: 24,
    weight: 300,
    name: {
      bg: "Омлет с гъби и спанак",
      en: "Omelet with Mushrooms and Spinach",
    },
    ingredients: [
      {
        name: { bg: "Яйца", en: "Eggs" },
        amount: { bg: "3 бр (180 г)", en: "3 pcs (180 g)" },
        substitute: { bg: "яйчни белтъци, веган яйце заместител", en: "egg whites, vegan egg substitute" },
      },
      {
        name: { bg: "Гъби", en: "Mushrooms" },
        amount: { bg: "100 г", en: "100 g" },
        substitute: { bg: "тиквички, чушки", en: "zucchini, bell peppers" },
      },
      {
        name: { bg: "Спанак", en: "Spinach" },
        amount: { bg: "50 г", en: "50 g" },
        substitute: { bg: "кейл, лапад", en: "kale, chard" },
      },
      {
        name: { bg: "Масло или зехтин", en: "Butter or olive oil" },
        amount: { bg: "1 с.л. (10 г)", en: "1 tbsp (10 g)" },
        substitute: { bg: "кокосово масло, спрей мазнина", en: "coconut oil, cooking spray" },
      },
      {
        name: { bg: "Сол и пипер", en: "Salt and pepper" },
        amount: { bg: "на вкус", en: "to taste" },
        substitute: { bg: "соев сос, микс от подправки", en: "soy sauce, spice blend" },
      },
    ],
    recipeSteps: {
      bg: [
        "Нарежи гъбите и ги запържи в мазнина за 3–4 минути до златисто.",
        "Добави спанака и готви още 1–2 минути, докато омекне.",
        "Разбий яйцата с малко сол и черен пипер и ги изсипи в тигана при зеленчуците.",
        "Готви на слаб огън, докато яйцата се стегнат.",
        "По желание обърни омлета внимателно от другата страна за 1 минута или покрий с капак до готовност.",
      ],
      en: [
        "Slice the mushrooms and sauté in fat for 3-4 minutes until golden.",
        "Add the spinach and cook for another 1-2 minutes until wilted.",
        "Beat the eggs with a little salt and black pepper and pour them into the pan with the vegetables.",
        "Cook on low heat until the eggs set.",
        "If you like, carefully flip the omelet for 1 minute, or cover with a lid until done.",
      ],
    },
  },

  "salmon-veggies": {
    slug: "salmon-veggies",
    icon: "🐟",
    kcal: 520,
    protein: 35,
    carbs: 10,
    fat: 38,
    weight: 400,
    name: {
      bg: "Печена сьомга със задушени зеленчуци",
      en: "Baked Salmon with Steamed Vegetables",
    },
    ingredients: [
      {
        name: { bg: "Филе от сьомга", en: "Salmon fillet" },
        amount: { bg: "200 г", en: "200 g" },
        substitute: { bg: "пъстърва, бяла риба", en: "trout, white fish" },
      },
      {
        name: { bg: "Броколи", en: "Broccoli" },
        amount: { bg: "100 г", en: "100 g" },
        substitute: { bg: "зелен фасул, аспержи", en: "green beans, asparagus" },
      },
      {
        name: { bg: "Моркови", en: "Carrots" },
        amount: { bg: "50 г", en: "50 g" },
        substitute: { bg: "цвекло, тиквички", en: "beetroot, zucchini" },
      },
      {
        name: { bg: "Зехтин", en: "Olive oil" },
        amount: { bg: "1 с.л. (10 г)", en: "1 tbsp (10 g)" },
        substitute: { bg: "масло, кокосово масло", en: "butter, coconut oil" },
      },
      {
        name: { bg: "Лимон", en: "Lemon" },
        amount: { bg: "1 резен", en: "1 slice" },
        substitute: { bg: "лайм", en: "lime" },
      },
      {
        name: { bg: "Сол и пипер", en: "Salt and pepper" },
        amount: { bg: "на вкус", en: "to taste" },
        substitute: { bg: "балсамов оцет, подправки", en: "balsamic vinegar, spices" },
      },
    ],
    recipeSteps: {
      bg: [
        "Загрей фурната на 200°C.",
        "Постави филето от сьомга в тава, поръси със сол, пипер и лимонов сок.",
        "Нарежи зеленчуците и ги овкуси със зехтин, сол и пипер.",
        "Постави зеленчуците около сьомгата във фурната.",
        "Печи за около 20-25 минути, докато сьомгата е готова и зеленчуците омекнат.",
        "Сервирай топло, като гарнираш с пресен лимон и зелени подправки по желание.",
      ],
      en: [
        "Preheat the oven to 200°C.",
        "Place the salmon fillet in a baking dish and sprinkle with salt, pepper, and lemon juice.",
        "Chop the vegetables and season with olive oil, salt, and pepper.",
        "Arrange the vegetables around the salmon in the oven.",
        "Bake for about 20-25 minutes, until the salmon is cooked through and the vegetables are tender.",
        "Serve warm, garnished with fresh lemon and herbs if desired.",
      ],
    },
  },

  "tofu-pasta": {
    slug: "tofu-pasta",
    icon: "🍝",
    kcal: 470,
    protein: 22,
    carbs: 55,
    fat: 16,
    weight: 400,
    name: {
      bg: "Паста с тофу и доматен сос",
      en: "Pasta with Tofu and Tomato Sauce",
    },
    ingredients: [
      {
        name: { bg: "Пълнозърнеста паста", en: "Whole-grain pasta" },
        amount: { bg: "80 г (суха)", en: "80 g (dry)" },
        substitute: { bg: "оризова паста, безглутенова паста", en: "rice pasta, gluten-free pasta" },
      },
      {
        name: { bg: "Тофу", en: "Tofu" },
        amount: { bg: "150 г", en: "150 g" },
        substitute: { bg: "темпе, пилешко месо (за не-вегани)", en: "tempeh, chicken (for non-vegans)" },
      },
      {
        name: { bg: "Доматен сос", en: "Tomato sauce" },
        amount: { bg: "100 г", en: "100 g" },
        substitute: { bg: "пасирани домати с подправки", en: "crushed tomatoes with spices" },
      },
      {
        name: { bg: "Зехтин", en: "Olive oil" },
        amount: { bg: "1 с.л. (10 г)", en: "1 tbsp (10 g)" },
        substitute: { bg: "кокосово масло, спрей мазнина", en: "coconut oil, cooking spray" },
      },
      {
        name: { bg: "Чесън, босилек, риган", en: "Garlic, basil, oregano" },
        amount: { bg: "на вкус", en: "to taste" },
        substitute: { bg: "италианска подправка, чесън на прах", en: "Italian seasoning, garlic powder" },
      },
    ],
    recipeSteps: {
      bg: [
        "Свари пастата според инструкциите на опаковката до състояние ал денте.",
        "През това време нарежи тофуто на кубчета и го запържи в зехтин до златисто.",
        "Добави доматения сос и подправките, и остави да къкри 5–7 минути.",
        "Отцеди пастата и я добави към соса с тофу. Разбъркай добре.",
        "Сервирай топло с пресен босилек по желание.",
      ],
      en: [
        "Cook the pasta according to the package instructions until al dente.",
        "Meanwhile, cube the tofu and pan-fry it in olive oil until golden.",
        "Add the tomato sauce and spices, and let simmer for 5-7 minutes.",
        "Drain the pasta and add it to the tofu sauce. Stir well.",
        "Serve warm with fresh basil if desired.",
      ],
    },
  },

  "vegan-protein-shake": {
    slug: "vegan-protein-shake",
    icon: "🥤",
    kcal: 320,
    protein: 27,
    carbs: 30,
    fat: 7,
    weight: 400,
    name: {
      bg: "Протеинов шейк с банан и веган протеин",
      en: "Protein Shake with Banana and Vegan Protein",
    },
    ingredients: [
      {
        name: { bg: "Банан", en: "Banana" },
        amount: { bg: "1 бр (120 г)", en: "1 pc (120 g)" },
        substitute: { bg: "манго, ананас", en: "mango, pineapple" },
      },
      {
        name: { bg: "Веган протеин (ванилия)", en: "Vegan protein (vanilla)" },
        amount: { bg: "30 г", en: "30 g" },
        substitute: { bg: "суроватъчен, конопен", en: "whey, hemp" },
      },
      {
        name: { bg: "Бадемово мляко (без захар)", en: "Almond milk (unsweetened)" },
        amount: { bg: "250 мл", en: "250 ml" },
        substitute: { bg: "кокосово, овесено мляко", en: "coconut milk, oat milk" },
      },
      {
        name: { bg: "Фъстъчено масло", en: "Peanut butter" },
        amount: { bg: "1 ч.л. (8 г)", en: "1 tsp (8 g)" },
        substitute: { bg: "бадемово масло, тахан", en: "almond butter, tahini" },
      },
      {
        name: { bg: "Канела (по избор)", en: "Cinnamon (optional)" },
        amount: { bg: "1 щипка", en: "1 pinch" },
        substitute: { bg: "какао, ванилия", en: "cocoa, vanilla" },
      },
      {
        name: { bg: "Лед", en: "Ice" },
        amount: { bg: "3-4 кубчета", en: "3-4 cubes" },
        substitute: { bg: "замразен банан", en: "frozen banana" },
      },
    ],
    recipeSteps: {
      bg: [
        "Нарежи банана на парчета.",
        "Сложи всички съставки в блендер.",
        "Блендирай до получаване на гладка текстура.",
        "Добави още мляко или лед според желаната гъстота.",
        "Излей в чаша и сервирай веднага.",
      ],
      en: [
        "Cut the banana into pieces.",
        "Put all the ingredients in a blender.",
        "Blend until smooth.",
        "Add more milk or ice depending on the desired thickness.",
        "Pour into a glass and serve immediately.",
      ],
    },
  },
};
