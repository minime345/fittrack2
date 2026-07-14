import jsPDF from "jspdf";
import "@/fonts/Roboto-Regular.js";
import type { Diet, DayPlan, Goal } from "./types";
import { generateShoppingList } from "./planLogic";

type DownloadPdfParams = {
  t: any;
  weeklyPlan: DayPlan[];
  goal: Goal;
  goalLabels: Record<Goal, string>;
  diet: Diet;
  dietLabels: Record<Diet, string>;
  lang: "bg" | "en";
};

export const downloadPDF = ({ t, weeklyPlan, goal, goalLabels, diet, dietLabels, lang }: DownloadPdfParams) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Поддържаме кирилица с Roboto
  doc.setFont("Roboto", "normal");

  // Title Section
  doc.setFillColor(230, 247, 230); // светло зелено
  doc.roundedRect(8, y - 8, pageWidth - 16, 20, 3, 3, "F");
  doc.setFontSize(18);
  doc.setTextColor(0, 128, 0);
  doc.text(t.Main.pdfTitle, pageWidth / 2, y + 4, { align: "center" });
  y += 20;

  // Goal & Diet
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text(`${t.Main.goalLabel}: ${goalLabels[goal]} / ${t.Main.dietLabel}: ${dietLabels[diet]}`, 12, y);
  y += 12;

  // Weekly Plan
  weeklyPlan.forEach((day, i) => {
    // Day Header Card
    doc.setFillColor(240, 255, 240);
    doc.roundedRect(8, y - 6, pageWidth - 16, 8, 2, 2, "F");
    doc.setFontSize(14);
    doc.setTextColor(0, 128, 0);
    doc.text(`${t.Main.day} ${i + 1}`, 12, y);
    y += 8;

    doc.setTextColor(0, 0, 0);

    const sections = [
      { key: "breakfast", label: t.Main.breakfast },
      { key: "lunch", label: t.Main.lunch },
      { key: "dinner", label: t.Main.dinner },
      { key: "snack", label: t.Main.snack },
    ] as const;

    sections.forEach((section) => {
      const mealsArr = day.meals[section.key];
      if (mealsArr.length === 0) return;

      // Section Name
      doc.setFontSize(12);
      doc.setTextColor(0, 102, 204);
      doc.text(section.label, 14, y);
      y += 6;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);

      mealsArr.forEach((meal) => {
        if (y > 270) {
          doc.addPage();
          y = 15;
          doc.setFont("Roboto", "normal");
        }
        const text = `• ${meal.name[lang]} – ${meal.kcal} kcal, P: ${meal.protein}g, C: ${meal.carbs}g, F: ${meal.fat}g`;
        doc.textWithLink(text, 16, y, {
          url: meal.link ? `https://yourdomain.com${meal.link}` : undefined,
        });
        y += 6;
      });

      y += 4;
    });

    // Day Summary
    const summary = `${t.Main.total}: ${day.total.kcal} kcal / P: ${day.total.protein}g / C: ${day.total.carbs}g / F: ${day.total.fat}g`;
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(summary, 14, y);
    y += 12;
  });

  // Shopping List Title
  if (y > 260) {
    doc.addPage();
    y = 15;
  }
  doc.setFillColor(230, 247, 230);
  doc.roundedRect(8, y - 6, pageWidth - 16, 10, 3, 3, "F");
  doc.setFontSize(14);
  doc.setTextColor(0, 128, 0);
  doc.text(t.Main.shoppingTitle, 12, y);
  y += 12;

  // Shopping List Items
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  const shoppingList = generateShoppingList(weeklyPlan, lang);
  shoppingList.forEach(({ name, amount, unit }) => {
    if (y > 270) {
      doc.addPage();
      y = 15;
    }
    doc.text(`• ${name} - ${amount} ${unit}`, 14, y);
    y += 6;
  });

  doc.save("hranitelen-rezhim.pdf");
};
