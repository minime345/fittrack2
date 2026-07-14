// src/lib/translations.ts
export const translations = {
  bg: {
    home: "Начало",
    calculator: "Калкулатор",
    personalPlan: "Персонални режими",
    plans: "Режими",
    meals: "Ястия",
    heroTitle: "Добре дошъл във FitTrack",
    heroText:
      "Твоят личен асистент за калории, хранителни режими и здравословен начин на живот. Изчисли своя дневен калориен прием, открий полезни режими и вдъхновяващи рецепти.",
    btnCalc: "Изчисли калории",
    btnPersonal: "Персонален режим",
    contacts: "Контакти",
    quickLinks: "Бързи връзки",
    followUs: "Последвай ни",
    phone: "Телефон",
    address: "Адрес: София, България",
    rights: "Всички права запазени.",
  },
  en: {
    home: "Home",
    calculator: "Calculator",
    personalPlan: "Personal Plans",
    plans: "Plans",
    meals: "Meals",
    heroTitle: "Welcome to FitTrack",
    heroText:
      "Your personal assistant for calories, meal plans and a healthy lifestyle. Calculate your daily calorie intake, explore useful plans and inspiring recipes.",
    btnCalc: "Calculate Calories",
    btnPersonal: "Personal Plan",
    contacts: "Contacts",
    quickLinks: "Quick Links",
    followUs: "Follow us",
    phone: "Phone",
    address: "Address: Sofia, Bulgaria",
    rights: "All rights reserved.",
  },
} as const;

export type Lang = keyof typeof translations;
