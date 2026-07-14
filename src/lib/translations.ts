import PersonalPlanPage from "@/app/personal-plan/PersonalPlanClient";

// src/lib/translations.ts
export const translations = {
  bg: {
    nav: {
      home: "Начало",
      calculator: "Калкулатор",
      personal: "Персонални режими",
      plans: "Режими",
      meals: "Ястия",
    },
    footer: {
      contacts: "Контакти",
      quick: "Бързи връзки",
      follow: "Последвай ни",
      rights: "Всички права запазени.",
      address: "София, България",
      phone: "Телефон:",
    },
    plansPage: {
      header: {
        title: "Примерни Хранителни Режими",
        subtitle:
          "Разгледай най-популярните режими. Всеки има своя подход – избери това, което пасва на твоите цели.",
      },
      cta: {
        question: "Искаш нещо, съобразено изцяло с теб?",
        button: "Вземи персонален хранителен план",
      },
      diets: [
        {
          name: "Кето",
          description: "Високомазнинен и нисковъглехидратен режим.",
          image: "/diets/keto.jpg",
          href: "/plans/keto",
        },
        {
          name: "Веган",
          description: "Без животински продукти – само растения.",
          image: "/diets/vegan.jpg",
          href: "/plans/vegan",
        },
        {
          name: "Средиземноморски",
          description: "Балансиран режим с много зеленчуци и зехтин.",
          image: "/diets/mediterranean.jpeg",
          href: "/plans/mediterranean",
        },
        {
          name: "Нисковъглехидратен",
          description: "Ограничени въглехидрати за по-добро горене на мазнини.",
          image: "/diets/lowcarb.jpeg",
          href: "/plans/low-carb",
        },
        {
          name: "Палео",
          description: "Хранене като нашите предци – натурално и чисто.",
          image: "/diets/paleo.jpeg",
          href: "/plans/paleo",
        },
        {
          name: "Високо протеинова",
          description:
            "Повишен прием на белтъчини – идеален за мускулен растеж и ситост.",
          image: "/diets/high-protein.jpeg",
          href: "/plans/high-protein",
        },
      ],
    },
    homepage: {
      btnCalc: "Изчисли калорий",
      btnPersonal: "Персонален режим",
      Title: "Добре дошли в FitTack",
      Text:
        " Твоят личен асистент за калории, хранителни режими и здравословен начин на живот. Изчисли своя дневен калориен прием, открий полезни режими и вдъхновяващи рецепти.",
    },
    calculator: {
      title: "Калориен калкулатор",
      age: "Години",
      weight: "Тегло (кг)",
      height: "Височина (см)",
      gender: "Пол",
      activity: "Ниво на активност",
      bodyFat: "Подкожни мазнини (%)",
      option: "По избор",
      male: "Мъж",
      female: "Жена",
      activityOptions: [
        "Седящ начин на живот — малко или никаква физическа активност",
        "Лека активност — леки упражнения 1-3 дни седмично",
        "Умерена активност — умерени упражнения 3-5 дни седмично",
        "Висока активност — интензивни упражнения 6-7 дни седмично",
        "Много висока активност — много тежки упражнения или физическа работа",
      ],
      calculate: "Изчисли",
      resultCalories: "Дневен калориен прием",
      proteinRange: "Препоръчителен дневен прием на протеин за вас",
      formulaKatch: "Формула: Katch-McArdle (на база чиста телесна маса)",
      formulaMifflin: "Формула: Mifflin-St Jeor",
      alertFill: "Моля, попълнете всички задължителни полета",
      alertRange: "Моля, въведете реалистични стойности (възраст 10-100, тегло 30-300 кг, ръст 100-230 см)",
      planButton: "Направи персонален хранителен режим",
      prot: "г/ден",
      quickCard: [
        "Бързо отслабване",
        "Бавно отслабване",
        "Поддържане",
        "Качване",
      ],
    },
    meals:{
      all:"Всички",
      hed:"Всички Ястия",
      cal:"Калорий",
      prot:"Пеотеин",
      carb:"Въглехидрати",
      fat:"Мазнини",
      category:"Категории",
      button:"Зареди още",
       unit: "г",
      weight: "Грамаж",
      ingredients: "Съставки",
      method: "Начин на приготвяне",
      substitute: "Заместител",
    },
    dietPages: {
      backToPlans: "← Назад към всички режими",
      keto: {
        emoji: "🥓",
        title: "Кето диета",
        sections: [
          {
            title: "🥓 Какво е Кето диета?",
            body: "Кето диетата е нисковъглехидратен, високомаслен режим на хранене, който цели да постави тялото в състояние на кетоза – използване на мазнини като основен източник на енергия вместо въглехидрати.",
          },
          {
            title: "⚡ Как работи кетозата?",
            body: "При намален прием на въглехидрати, черният дроб превръща мазнините в кетонни тела, които служат като алтернативен източник на енергия за мозъка и мускулите.",
          },
          {
            title: "🥩 Какво може да ядеш?",
            list: [
              " Мазнини: авокадо, зехтин, кокосово масло, масло, сметана",
              " Месо и риба: говеждо, свинско, пиле, сьомга, скумрия",
              " Яйца",
              " Зеленчуци с ниско съдържание на въглехидрати: спанак, броколи, карфиол",
              " Ядки и семена",
              " Сирена с високо съдържание на мазнини",
            ],
          },
          {
            title: "🚫 Какво да избягваш?",
            list: [
              " Захари и захарни изделия",
              " Зърнени храни и тестени продукти",
              " Повечето плодове (освен малки количества горски плодове)",
              " Бобови растения",
              " Преработени храни и безалкохолни напитки",
            ],
          },
          {
            title: "💡 Ползи от кето диетата",
            list: [
              " Намаляване на телесното тегло и мазнини",
              " Подобряване на нивата на кръвна захар и инсулин",
              " Повишена умствена концентрация и енергия",
              " Намаляване на апетита",
            ],
          },
          {
            title: "⚠️ Рискове и внимание",
            body: "В началото може да се усети „кето грип“ – умора, главоболие, гадене. Важно е да се пият достатъчно вода и електролити. Консултация с лекар при хронични заболявания е препоръчителна.",
          },
          {
            title: "📅 Примерно еднодневно меню",
            list: [
              " Закуска: Яйца с авокадо и бекон",
              " Обяд: Салата с пиле, зехтин и авокадо",
              " Вечеря: Печено месо с броколи на пара и масло",
              " Закуски: Сирене, ядки, маслини",
            ],
          },
          {
            title: "🛠️ Съвети за успешен старт",
            list: [
              " Започни с понижаване на въглехидратите до 20-50 г на ден",
              " Пий много вода и приемай електролити",
              " Избягвай скритите захари и въглехидрати",
              " Следи напредъка и адаптирай приема на макронутриенти",
            ],
          },
          {
            title: "💊 Добавки при кето диета",
            list: [
              " Магнезий и калий",
              " Омега-3 мастни киселини",
              " Витамини от група B",
              " Мултивитамини при нужда",
            ],
          },
          {
            title: "❌ Чести грешки при кето",
            list: [
              " Прекаляване с протеин вместо мазнини",
              " Недостатъчен прием на мазнини",
              " Липса на разнообразие в храната",
              " Пренебрегване на хидратация и електролити",
            ],
          },
        ],
      },
      vegan: {
        emoji: "🥦",
        title: "Веган диета",
        sections: [
          {
            title: "🥦 Какво е Веган диета?",
            body: "Веган диетата изключва всички животински продукти – месо, млечни, яйца и мед. Основава се изцяло на растителни храни: плодове, зеленчуци, зърнени култури, ядки, бобови и семена.",
          },
          {
            title: "🌱 Защо хората избират веганство?",
            list: [
              " Етични причини – грижа за животните",
              " Опазване на околната среда",
              " Здравословни ползи (по-нисък холестерол, намален риск от хронични болести)",
            ],
          },
          {
            title: "🥗 Какво може да ядеш?",
            list: [
              " Зеленчуци и плодове",
              " Бобови: леща, нахут, боб, соя",
              " Пълнозърнести храни: овес, киноа, кафяв ориз",
              " Ядки и семена",
              " Растителни масла (зехтин, кокосово масло)",
              " Веган заместители: мляко от овес, соя или бадеми; тофу, темпе",
            ],
          },
          {
            title: "⛔ Какво да избягваш?",
            list: [
              " Месо, риба, морски дарове",
              " Мляко, сирене, масло, яйца",
              " Желатин, мед и други животински продукти",
            ],
          },
          {
            title: "💚 Ползи",
            list: [
              "❤️ Намален риск от сърдечносъдови заболявания",
              "⬇ По-нисък холестерол и кръвно налягане",
              " По-добро храносмилане (повече фибри)",
              " Може да подпомогне загуба на тегло",
            ],
          },
          {
            title: "⚠️ Рискове и внимание",
            body: "При веган режим е важно да се следи за прием на витамин B12, желязо, омега-3 и протеин. Препоръчват се хранителни добавки или обогатени храни.",
          },
          {
            title: "📅 Примерно еднодневно меню",
            list: [
              " Закуска: Овесена каша с бадемово мляко и плодове",
              " Обяд: Киноа със зеленчуци и хумус",
              " Вечеря: Лещена супа с пълнозърнест хляб",
              " Закуски: Ядки, фурми, смути",
            ],
          },
          {
            title: "🚀 Съвети за успешен старт",
            list: [
              " Започни постепенно – замени 1-2 хранения седмично",
              " Проучвай съставките на продуктите внимателно",
              " Готви у дома, за да контролираш храната си",
              " Използвай приложения за следене на хранителния прием",
            ],
          },
          {
            title: "💊 Необходими добавки",
            list: [
              " Витамин B12 – най-важната добавка при веган диета",
              " Витамин D – особено зимата",
              " Омега-3 (ALA, EPA, DHA) от водорасли",
              " Желязо и цинк (при нужда)",
            ],
          },
          {
            title: "⚡ Чести грешки при веган диета",
            list: [
              " Прекалена консумация на въглехидрати (тестени изделия)",
              " Липса на разнообразие – еднообразно меню",
              " Недостатъчен прием на протеин",
              " Пренебрегване на добавки",
            ],
          },
          {
            title: "🌿 Веган протеинови източници",
            list: [
              " Тофу, темпе, едамаме",
              " Соя и соеви продукти",
              " Леща, нахут, боб",
              " Киноа, овес, амарант",
              " Конопени и чиа семена",
              " Протеинови пудри (на растителна основа)",
            ],
          },
        ],
      },
      mediterranean: {
        emoji: "🌊",
        title: "Средиземноморска диета",
        sections: [
          {
            title: "🌊 Какво е Средиземноморска диета?",
            body: "Средиземноморската диета се базира на храненето на народите около Средиземно море, включва изобилие от плодове, зеленчуци, зехтин, пълнозърнести, ядки, риба и умерени количества месо и млечни продукти.",
          },
          {
            title: "🍅 Основни компоненти",
            list: [
              " Зеленчуци и плодове - основа на всяко хранене",
              " Зехтин - основен източник на мазнини",
              " Риба и морски дарове - поне два пъти седмично",
              " Пълнозърнести храни",
              " Ядки и семена",
              " Умерени количества бяло месо и млечни продукти (особено сирене и кисело мляко)",
            ],
          },
          {
            title: "🚫 Какво да избягваш?",
            list: [
              " Преработени храни и захари",
              " Червено месо и преработени меса в големи количества",
              " Наситени и трансмазнини",
              " Излишък от рафинирани въглехидрати",
            ],
          },
          {
            title: "💚 Ползи за здравето",
            list: [
              " Намален риск от сърдечносъдови заболявания",
              " Подобрено мозъчно здраве и памет",
              " Контрол на теглото и намален риск от диабет тип 2",
              " Подобрена храносмилателна функция",
            ],
          },
          {
            title: "📅 Примерно меню за деня",
            list: [
              " Закуска: Кисело мляко с мед, орехи и плодове",
              " Обяд: Салата с риба, маслини, зеленчуци и зехтин",
              " Вечеря: Печено пиле със зеленчуци и киноа",
              " Закуски: Пресни плодове, ядки",
            ],
          },
          {
            title: "⚠️ Съвети за успешна средиземноморска диета",
            body: "Използвай качествен зехтин, консумирай сезонни и местни продукти, приготвяй храната си у дома и поддържай активен начин на живот.",
          },
        ],
      },
      lowCarb: {
        emoji: "🥑",
        title: "Нисковъглехидратна диета",
        sections: [
          {
            title: "🥑 Какво е Нисковъглехидратна диета?",
            body: "Нисковъглехидратната диета ограничава приема на въглехидрати, като акцентира върху консумацията на протеини и мазнини с цел контрол на кръвната захар и подпомагане на отслабването.",
          },
          {
            title: "🌟 Ползи от нисковъглехидратна диета",
            list: [
              " Подпомага загубата на тегло и намалява телесните мазнини",
              " Контролира нивата на кръвната захар и инсулина",
              " Подобрява енергията и умствената яснота",
              " Намалява апетита и чувството за глад",
            ],
          },
          {
            title: "🥓 Какво може да ядеш?",
            list: [
              " Месо и птици",
              " Риба и морски дарове",
              " Яйца",
              " Зеленчуци с ниско съдържание на въглехидрати (зеленолистни, броколи, карфиол)",
              " Здравословни мазнини: авокадо, зехтин, кокосово масло, ядки и семена",
              " Млечни продукти с високо съдържание на мазнини (кашкавал, сирена, сметана)",
            ],
          },
          {
            title: "🚫 Какво да избягваш?",
            list: [
              " Хляб, паста, ориз, картофи",
              " Захар и сладкиши",
              " Зърнени култури и бобови",
              " Повечето плодове с високо съдържание на захар",
              " Газирани напитки и преработени храни",
            ],
          },
          {
            title: "📅 Примерно еднодневно меню",
            list: [
              " Закуска: Омлет с авокадо и спанак",
              " Обяд: Салата с пиле, зехтин и ядки",
              " Вечеря: Печена риба с броколи и масло",
              " Закуски: Сирене, ядки, маслини",
            ],
          },
          {
            title: "⚠️ Важни съвети",
            body: "Пий много вода, следи електролитите (натрий, магнезий, калий) и избягвай прекомерния прием на въглехидрати за по-добри резултати.",
          },
          {
            title: "🛠️ Добавки при нисковъглехидратна диета",
            list: [
              " Магнезий и калий – за поддържане на електролитния баланс",
              " Омега-3 мастни киселини",
              " Витамин D",
              " Пробиотици за доброто храносмилане",
            ],
          },
          {
            title: "❌ Чести грешки",
            list: [
              " Недостатъчен прием на вода и електролити",
              " Прекаляване с протеин на място на мазнини",
              " Липса на разнообразие в менюто",
              " Игнориране на физическата активност",
            ],
          },
        ],
      },
      paleo: {
        emoji: "🥩",
        title: "Палео диета",
        sections: [
          {
            title: "🥩 Какво е Палео диета?",
            body: "Палео диетата се основава на храненето на праисторическите хора – с акцент върху естествени, непреработени храни като месо, риба, зеленчуци, плодове, ядки и семена, като се избягват зърнени храни, млечни и преработени продукти.",
          },
          {
            title: "🌟 Ползи от Палео диетата",
            list: [
              " Подобрено храносмилане и енергия",
              " Намаляване на възпаленията",
              " Подпомага отслабване и мускулна маса",
              " Подобрено здраве на сърцето",
            ],
          },
          {
            title: "🥦 Какво може да ядеш?",
            list: [
              " Месо и птици (предимно от свободен отглеждане)",
              " Риба и морски дарове",
              " Зеленчуци и плодове",
              " Ядки и семена (без фъстъци)",
              " Здравословни мазнини – авокадо, кокос, зехтин",
            ],
          },
          {
            title: "🚫 Какво да избягваш?",
            list: [
              " Зърнени култури (хляб, ориз, паста)",
              " Млечни продукти",
              " Захар и преработени храни",
              " Бобови растения (боб, леща, нахут)",
              " Преработени масла и рафинирани мазнини",
            ],
          },
          {
            title: "📅 Примерно еднодневно меню",
            list: [
              " Закуска: Омлет с гъби и спанак",
              " Обяд: Салата с пиле, авокадо и орехи",
              " Вечеря: Печено месо с печени зеленчуци",
              " Закуски: Ядки, плодове",
            ],
          },
          {
            title: "⚠️ Важни съвети",
            body: "Избирай качествени, органични и пресни продукти, за да се възползваш максимално от ползите на палео диетата.",
          },
          {
            title: "🛠️ Добавки при Палео диетата",
            list: [
              " Омега-3 мастни киселини",
              " Витамин D",
              " Магнезий",
              " Пробиотици за добра чревна флора",
            ],
          },
          {
            title: "❌ Чести грешки",
            list: [
              " Използване на преработени „палео“ продукти",
              " Недостатъчен прием на мазнини",
              " Липса на разнообразие в храната",
              " Прекаляване с месо без балансиране с растителни храни",
            ],
          },
        ],
      },
      highProtein: {
        emoji: "🍗",
        title: "Високо протеинова диета",
        sections: [
          {
            title: "🍗 Какво е Високо протеинова диета?",
            body: "Високопротеиновата диета акцентира върху увеличения прием на протеин с цел подкрепа на мускулния растеж, възстановяване и намаляване на телесните мазнини.",
          },
          {
            title: "💪 Ползи от високо протеинова диета",
            list: [
              " Подпомага изграждането и възстановяването на мускулите",
              " Подобрява чувството за ситост и контролира апетита",
              " Ускорява метаболизма и подпомага отслабването",
              " Поддържа здравословни кости и стави",
            ],
          },
          {
            title: "🥩 Какво може да ядеш?",
            list: [
              " Месо: пилешко, пуешко, говеждо, свинско",
              " Риба и морски дарове",
              " Яйца и млечни продукти с ниско съдържание на мазнини",
              " Бобови: леща, нахут, боб (умерено)",
              " Ядки и семена",
              " Протеинови пудри и добавки",
              " Зеленчуци, особено зелени листни",
            ],
          },
          {
            title: "🚫 Какво да избягваш?",
            list: [
              " Преработени храни с много захар и мазнини",
              " Газирани и захарни напитки",
              " Прекалено много въглехидрати и бързи храни",
              " Излишна мазнина и пържени ястия",
            ],
          },
          {
            title: "📅 Примерно еднодневно меню",
            list: [
              " Закуска: Омлет с гъби и спанак",
              " Обяд: Пилешко месо на скара с киноа и зеленчуци",
              " Вечеря: Риба със задушени броколи и салата",
              " Закуски: Гръцко кисело мляко с ядки, протеинов шейк",
            ],
          },
          {
            title: "⚠️ Важни съвети",
            body: "Пий достатъчно вода, разпределяй протеина равномерно през деня и комбинирай с физическа активност за максимален ефект.",
          },
          {
            title: "🛠️ Добавки при високо протеинова диета",
            list: [
              " Протеинови пудри (суроватъчен, растителен протеин)",
              " BCAA (аминокиселини с разклонена верига)",
              " Омега-3 мастни киселини",
              " Витамини и минерали според нуждите",
            ],
          },
          {
            title: "❌ Чести грешки",
            list: [
              " Недостатъчен прием на течности",
              " Прекаляване с протеин без баланс с други макронутриенти",
              " Липса на разнообразие в храната",
              " Игнориране на физическа активност",
            ],
          },
        ],
      },
    },
  },




  en: {
    nav: {
      home: "Home",
      calculator: "Calculator",
      personal: "Personal Plans",
      plans: "Plans",
      meals: "Meals",
    },
    footer: {
      contacts: "Contacts",
      quick: "Quick Links",
      follow: "Follow us",
      rights: "All rights reserved.",
      address: "Sofia, Bulgaria",
      phone: "Phone:",
    },
    plansPage: {
      header: {
        title: "Sample Meal Plans",
        subtitle:
          "Explore the most popular diets. Each has its own approach – choose the one that fits your goals.",
      },
      cta: {
        question: "Want something tailored just for you?",
        button: "Get a personalized meal plan",
      },
      diets: [
        {
          name: "Keto",
          description: "High-fat and low-carb diet.",
          image: "/diets/keto.jpg",
          href: "/plans/keto",
        },
        {
          name: "Vegan",
          description: "No animal products – plants only.",
          image: "/diets/vegan.jpg",
          href: "/plans/vegan",
        },
        {
          name: "Mediterranean",
          description: "Balanced diet rich in vegetables and olive oil.",
          image: "/diets/mediterranean.jpeg",
          href: "/plans/mediterranean",
        },
        {
          name: "Low-Carb",
          description: "Reduced carbs for better fat burning.",
          image: "/diets/lowcarb.jpeg",
          href: "/plans/low-carb",
        },
        {
          name: "Paleo",
          description: "Eating like our ancestors – natural and clean.",
          image: "/diets/paleo.jpeg",
          href: "/plans/paleo",
        },
        {
          name: "High-Protein",
          description:
            "Increased protein intake – perfect for muscle growth and satiety.",
          image: "/diets/high-protein.jpeg",
          href: "/plans/high-protein",
        },
      ],
    },
    homepage: {
      btnCalc: "Calculate calories",
      btnPersonal: "Get personal plan",
      Title: "Welcome to FitTrack",
      Text:
        "Your personal assistant for calories, meal plans and a healthy lifestyle. Calculate your daily calorie intake, explore useful plans and inspiring recipes.",
    },
    calculator: {
      title: "Calorie Calculator",
      age: "Age",
      weight: "Weight (kg)",
      height: "Height (cm)",
      gender: "Gender",
      activity: "Activity Level",
      bodyFat: "Body Fat (%)",
      option: "Optional",
      male: "Male",
      female: "Female",
      activityOptions: [
        "Sedentary — little or no exercise",
        "Light — light exercise 1-3 days/week",
        "Moderate — moderate exercise 3-5 days/week",
        "High — intense exercise 6-7 days/week",
        "Very high — very hard exercise or physical job",
      ],
      calculate: "Calculate",
      resultCalories: "Daily Calorie Intake",
      proteinRange: "Recommended daily protein intake for you",
      formulaKatch: "Formula: Katch-McArdle (based on lean body mass)",
      formulaMifflin: "Formula: Mifflin-St Jeor",
      alertFill: "Please fill all required fields",
      alertRange: "Please enter realistic values (age 10-100, weight 30-300 kg, height 100-230 cm)",
      planButton: "Create Personal Nutrition Plan",
       prot: "g/day",
      quickCard: ["Fast Weight Loss", "Slow Weight Loss", "Maintenance", "Gain"],
    },
    meals: {
      all:"All meals",
  hed: "All Meals",
  cal: "Calories",
  prot: "Protein",
  carb: "Carbohydrates",
  fat: "Fat",
  category:"Category",
  button:"Load more",
   unit: "g",
  weight: "Weight",
  ingredients: "Ingredients",
  method: "Method",
  substitute: "Substitute",
},
    dietPages: {
      backToPlans: "← Back to all plans",
      keto: {
        emoji: "🥓",
        title: "Keto Diet",
        sections: [
          {
            title: "🥓 What is the Keto Diet?",
            body: "The keto diet is a low-carb, high-fat way of eating that aims to put the body into a state of ketosis – using fat as the main energy source instead of carbohydrates.",
          },
          {
            title: "⚡ How does ketosis work?",
            body: "With reduced carbohydrate intake, the liver converts fats into ketone bodies, which serve as an alternative energy source for the brain and muscles.",
          },
          {
            title: "🥩 What can you eat?",
            list: [
              " Fats: avocado, olive oil, coconut oil, butter, cream",
              " Meat and fish: beef, pork, chicken, salmon, mackerel",
              " Eggs",
              " Low-carb vegetables: spinach, broccoli, cauliflower",
              " Nuts and seeds",
              " High-fat cheeses",
            ],
          },
          {
            title: "🚫 What to avoid?",
            list: [
              " Sugar and sweets",
              " Grains and pasta products",
              " Most fruits (except small amounts of berries)",
              " Legumes",
              " Processed foods and soft drinks",
            ],
          },
          {
            title: "💡 Benefits of the keto diet",
            list: [
              " Reduced body weight and fat",
              " Improved blood sugar and insulin levels",
              " Increased mental focus and energy",
              " Reduced appetite",
            ],
          },
          {
            title: "⚠️ Risks and precautions",
            body: "In the beginning you may feel the \"keto flu\" – fatigue, headache, nausea. It's important to drink enough water and electrolytes. Consult a doctor if you have chronic conditions.",
          },
          {
            title: "📅 Sample one-day menu",
            list: [
              " Breakfast: Eggs with avocado and bacon",
              " Lunch: Chicken salad with olive oil and avocado",
              " Dinner: Roast meat with steamed broccoli and butter",
              " Snacks: Cheese, nuts, olives",
            ],
          },
          {
            title: "🛠️ Tips for a successful start",
            list: [
              " Start by lowering carbs to 20-50g per day",
              " Drink plenty of water and take electrolytes",
              " Avoid hidden sugars and carbs",
              " Track progress and adjust macronutrient intake",
            ],
          },
          {
            title: "💊 Keto diet supplements",
            list: [
              " Magnesium and potassium",
              " Omega-3 fatty acids",
              " B-vitamins",
              " Multivitamins if needed",
            ],
          },
          {
            title: "❌ Common keto mistakes",
            list: [
              " Overdoing protein instead of fat",
              " Insufficient fat intake",
              " Lack of variety in food",
              " Neglecting hydration and electrolytes",
            ],
          },
        ],
      },
      vegan: {
        emoji: "🥦",
        title: "Vegan Diet",
        sections: [
          {
            title: "🥦 What is the Vegan Diet?",
            body: "The vegan diet excludes all animal products – meat, dairy, eggs, and honey. It's based entirely on plant foods: fruits, vegetables, grains, nuts, legumes, and seeds.",
          },
          {
            title: "🌱 Why do people choose veganism?",
            list: [
              " Ethical reasons – caring for animals",
              " Environmental protection",
              " Health benefits (lower cholesterol, reduced risk of chronic diseases)",
            ],
          },
          {
            title: "🥗 What can you eat?",
            list: [
              " Vegetables and fruits",
              " Legumes: lentils, chickpeas, beans, soy",
              " Whole grains: oats, quinoa, brown rice",
              " Nuts and seeds",
              " Plant oils (olive oil, coconut oil)",
              " Vegan substitutes: oat, soy, or almond milk; tofu, tempeh",
            ],
          },
          {
            title: "⛔ What to avoid?",
            list: [
              " Meat, fish, seafood",
              " Milk, cheese, butter, eggs",
              " Gelatin, honey, and other animal products",
            ],
          },
          {
            title: "💚 Benefits",
            list: [
              "❤️ Reduced risk of cardiovascular disease",
              "⬇ Lower cholesterol and blood pressure",
              " Better digestion (more fiber)",
              " May support weight loss",
            ],
          },
          {
            title: "⚠️ Risks and precautions",
            body: "On a vegan diet it's important to watch your intake of vitamin B12, iron, omega-3, and protein. Supplements or fortified foods are recommended.",
          },
          {
            title: "📅 Sample one-day menu",
            list: [
              " Breakfast: Oatmeal with almond milk and fruit",
              " Lunch: Quinoa with vegetables and hummus",
              " Dinner: Lentil soup with whole-grain bread",
              " Snacks: Nuts, dates, smoothies",
            ],
          },
          {
            title: "🚀 Tips for a successful start",
            list: [
              " Start gradually – replace 1-2 meals a week",
              " Study product ingredients carefully",
              " Cook at home to control your food",
              " Use apps to track your food intake",
            ],
          },
          {
            title: "💊 Necessary supplements",
            list: [
              " Vitamin B12 – the most important supplement on a vegan diet",
              " Vitamin D – especially in winter",
              " Omega-3 (ALA, EPA, DHA) from algae",
              " Iron and zinc (if needed)",
            ],
          },
          {
            title: "⚡ Common vegan diet mistakes",
            list: [
              " Excessive consumption of carbs (pasta products)",
              " Lack of variety – repetitive menu",
              " Insufficient protein intake",
              " Neglecting supplements",
            ],
          },
          {
            title: "🌿 Vegan protein sources",
            list: [
              " Tofu, tempeh, edamame",
              " Soy and soy products",
              " Lentils, chickpeas, beans",
              " Quinoa, oats, amaranth",
              " Hemp and chia seeds",
              " Protein powders (plant-based)",
            ],
          },
        ],
      },
      mediterranean: {
        emoji: "🌊",
        title: "Mediterranean Diet",
        sections: [
          {
            title: "🌊 What is the Mediterranean Diet?",
            body: "The Mediterranean diet is based on the eating habits of people around the Mediterranean Sea, and includes an abundance of fruits, vegetables, olive oil, whole grains, nuts, fish, and moderate amounts of meat and dairy.",
          },
          {
            title: "🍅 Main components",
            list: [
              " Vegetables and fruits – the basis of every meal",
              " Olive oil – the main source of fat",
              " Fish and seafood – at least twice a week",
              " Whole grains",
              " Nuts and seeds",
              " Moderate amounts of white meat and dairy (especially cheese and yogurt)",
            ],
          },
          {
            title: "🚫 What to avoid?",
            list: [
              " Processed foods and sugars",
              " Red meat and processed meats in large amounts",
              " Saturated and trans fats",
              " Excess refined carbohydrates",
            ],
          },
          {
            title: "💚 Health benefits",
            list: [
              " Reduced risk of cardiovascular disease",
              " Improved brain health and memory",
              " Weight control and reduced risk of type 2 diabetes",
              " Improved digestive function",
            ],
          },
          {
            title: "📅 Sample daily menu",
            list: [
              " Breakfast: Yogurt with honey, walnuts, and fruit",
              " Lunch: Fish salad with olives, vegetables, and olive oil",
              " Dinner: Roast chicken with vegetables and quinoa",
              " Snacks: Fresh fruit, nuts",
            ],
          },
          {
            title: "⚠️ Tips for a successful Mediterranean diet",
            body: "Use quality olive oil, eat seasonal and local produce, cook at home, and maintain an active lifestyle.",
          },
        ],
      },
      lowCarb: {
        emoji: "🥑",
        title: "Low-Carb Diet",
        sections: [
          {
            title: "🥑 What is the Low-Carb Diet?",
            body: "The low-carb diet limits carbohydrate intake, emphasizing protein and fat consumption to help control blood sugar and support weight loss.",
          },
          {
            title: "🌟 Benefits of a low-carb diet",
            list: [
              " Supports weight loss and reduces body fat",
              " Controls blood sugar and insulin levels",
              " Improves energy and mental clarity",
              " Reduces appetite and feelings of hunger",
            ],
          },
          {
            title: "🥓 What can you eat?",
            list: [
              " Meat and poultry",
              " Fish and seafood",
              " Eggs",
              " Low-carb vegetables (leafy greens, broccoli, cauliflower)",
              " Healthy fats: avocado, olive oil, coconut oil, nuts, and seeds",
              " High-fat dairy products (cheese, cream)",
            ],
          },
          {
            title: "🚫 What to avoid?",
            list: [
              " Bread, pasta, rice, potatoes",
              " Sugar and sweets",
              " Grains and legumes",
              " Most high-sugar fruits",
              " Soft drinks and processed foods",
            ],
          },
          {
            title: "📅 Sample one-day menu",
            list: [
              " Breakfast: Omelet with avocado and spinach",
              " Lunch: Chicken salad with olive oil and nuts",
              " Dinner: Baked fish with broccoli and butter",
              " Snacks: Cheese, nuts, olives",
            ],
          },
          {
            title: "⚠️ Important tips",
            body: "Drink plenty of water, watch your electrolytes (sodium, magnesium, potassium), and avoid excessive carb intake for better results.",
          },
          {
            title: "🛠️ Low-carb diet supplements",
            list: [
              " Magnesium and potassium – to maintain electrolyte balance",
              " Omega-3 fatty acids",
              " Vitamin D",
              " Probiotics for good digestion",
            ],
          },
          {
            title: "❌ Common mistakes",
            list: [
              " Insufficient water and electrolyte intake",
              " Overdoing protein instead of fat",
              " Lack of variety in the menu",
              " Ignoring physical activity",
            ],
          },
        ],
      },
      paleo: {
        emoji: "🥩",
        title: "Paleo Diet",
        sections: [
          {
            title: "🥩 What is the Paleo Diet?",
            body: "The Paleo diet is based on the eating habits of prehistoric humans – focusing on natural, unprocessed foods such as meat, fish, vegetables, fruit, nuts, and seeds, while avoiding grains, dairy, and processed products.",
          },
          {
            title: "🌟 Benefits of the Paleo diet",
            list: [
              " Improved digestion and energy",
              " Reduced inflammation",
              " Supports weight loss and muscle mass",
              " Improved heart health",
            ],
          },
          {
            title: "🥦 What can you eat?",
            list: [
              " Meat and poultry (preferably free-range)",
              " Fish and seafood",
              " Vegetables and fruit",
              " Nuts and seeds (no peanuts)",
              " Healthy fats – avocado, coconut, olive oil",
            ],
          },
          {
            title: "🚫 What to avoid?",
            list: [
              " Grains (bread, rice, pasta)",
              " Dairy products",
              " Sugar and processed foods",
              " Legumes (beans, lentils, chickpeas)",
              " Processed oils and refined fats",
            ],
          },
          {
            title: "📅 Sample one-day menu",
            list: [
              " Breakfast: Omelet with mushrooms and spinach",
              " Lunch: Chicken salad with avocado and walnuts",
              " Dinner: Roast meat with roasted vegetables",
              " Snacks: Nuts, fruit",
            ],
          },
          {
            title: "⚠️ Important tips",
            body: "Choose quality, organic, and fresh produce to get the most out of the Paleo diet's benefits.",
          },
          {
            title: "🛠️ Paleo diet supplements",
            list: [
              " Omega-3 fatty acids",
              " Vitamin D",
              " Magnesium",
              " Probiotics for healthy gut flora",
            ],
          },
          {
            title: "❌ Common mistakes",
            list: [
              " Using processed \"paleo\" products",
              " Insufficient fat intake",
              " Lack of variety in food",
              " Overdoing meat without balancing with plant foods",
            ],
          },
        ],
      },
      highProtein: {
        emoji: "🍗",
        title: "High-Protein Diet",
        sections: [
          {
            title: "🍗 What is the High-Protein Diet?",
            body: "The high-protein diet emphasizes an increased protein intake to support muscle growth, recovery, and body fat reduction.",
          },
          {
            title: "💪 Benefits of a high-protein diet",
            list: [
              " Supports building and repairing muscle",
              " Improves satiety and controls appetite",
              " Boosts metabolism and supports weight loss",
              " Maintains healthy bones and joints",
            ],
          },
          {
            title: "🥩 What can you eat?",
            list: [
              " Meat: chicken, turkey, beef, pork",
              " Fish and seafood",
              " Eggs and low-fat dairy products",
              " Legumes: lentils, chickpeas, beans (in moderation)",
              " Nuts and seeds",
              " Protein powders and supplements",
              " Vegetables, especially leafy greens",
            ],
          },
          {
            title: "🚫 What to avoid?",
            list: [
              " Processed foods high in sugar and fat",
              " Sugary and carbonated drinks",
              " Excessive carbs and fast food",
              " Excess fat and fried dishes",
            ],
          },
          {
            title: "📅 Sample one-day menu",
            list: [
              " Breakfast: Omelet with mushrooms and spinach",
              " Lunch: Grilled chicken with quinoa and vegetables",
              " Dinner: Fish with steamed broccoli and salad",
              " Snacks: Greek yogurt with nuts, protein shake",
            ],
          },
          {
            title: "⚠️ Important tips",
            body: "Drink enough water, spread your protein intake evenly through the day, and combine with physical activity for maximum effect.",
          },
          {
            title: "🛠️ High-protein diet supplements",
            list: [
              " Protein powders (whey, plant-based)",
              " BCAA (branched-chain amino acids)",
              " Omega-3 fatty acids",
              " Vitamins and minerals as needed",
            ],
          },
          {
            title: "❌ Common mistakes",
            list: [
              " Insufficient fluid intake",
              " Overdoing protein without balancing other macronutrients",
              " Lack of variety in food",
              " Ignoring physical activity",
            ],
          },
        ],
      },
    },
  },
} as const;

export type Lang = keyof typeof translations;
