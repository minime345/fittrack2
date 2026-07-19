import jsPDF from "jspdf";
import "@/fonts/Roboto-Regular.js";
import type { Diet, DayPlan, Goal, Meal, PlanMealType } from "./types";
import { generateShoppingList, groupMealPortions } from "./planLogic";

type DownloadPdfParams = {
  t: any;
  weeklyPlan: DayPlan[];
  goal: Goal;
  goalLabels: Record<Goal, string>;
  diet: Diet;
  dietLabels: Record<Diet, string>;
  lang: "bg" | "en";
  theme?: "light" | "dark";
};

type DayRow = {
  type: PlanMealType;
  meal: Meal;
  servings: number;
  nameLines: string[];
  ingredientLines: string[];
  height: number;
};

const PDF_PALETTES = {
  light: {
    background: [244, 231, 212] as const,
    surface: [255, 249, 238] as const,
    surfaceAlt: [226, 237, 223] as const,
    green: [239, 95, 80] as const,
    teal: [20, 125, 120] as const,
    white: [23, 42, 42] as const,
    muted: [82, 107, 104] as const,
    faint: [146, 139, 126] as const,
    blue: [69, 111, 130] as const,
    yellow: [197, 139, 52] as const,
    pink: [207, 92, 69] as const,
  },
  dark: {
    background: [10, 16, 11] as const,
    surface: [18, 28, 21] as const,
    surfaceAlt: [27, 39, 29] as const,
    green: [212, 168, 83] as const,
    teal: [169, 188, 114] as const,
    white: [242, 234, 220] as const,
    muted: [170, 159, 142] as const,
    faint: [91, 91, 80] as const,
    blue: [137, 180, 167] as const,
    yellow: [212, 168, 83] as const,
    pink: [201, 111, 79] as const,
  },
};

let COLORS: (typeof PDF_PALETTES)[keyof typeof PDF_PALETTES] = PDF_PALETTES.light;

const PAGE_MARGIN = 8;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;

const setTextColor = (doc: jsPDF, color: readonly [number, number, number]) =>
  doc.setTextColor(color[0], color[1], color[2]);

const setFillColor = (doc: jsPDF, color: readonly [number, number, number]) =>
  doc.setFillColor(color[0], color[1], color[2]);

const paintPage = (doc: jsPDF) => {
  setFillColor(doc, COLORS.background);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");
  setFillColor(doc, COLORS.green);
  doc.rect(0, 0, PAGE_WIDTH * 0.56, 1.2, "F");
  setFillColor(doc, COLORS.teal);
  doc.rect(PAGE_WIDTH * 0.56, 0, PAGE_WIDTH * 0.44, 1.2, "F");
};

const addPage = (doc: jsPDF, section: string) => {
  doc.addPage("a4", "portrait");
  doc.setFont("Roboto", "normal");
  paintPage(doc);
  setTextColor(doc, COLORS.muted);
  doc.setFontSize(7.2);
  doc.text(section, PAGE_WIDTH - PAGE_MARGIN, 9.5, { align: "right" });
};

const drawFooter = (doc: jsPDF, page: number, pageCount: number) => {
  setFillColor(doc, COLORS.surfaceAlt);
  doc.rect(PAGE_MARGIN, 287, CONTENT_WIDTH, 0.3, "F");
  setTextColor(doc, COLORS.faint);
  doc.setFontSize(6.5);
  doc.text("fittrack2-pi.vercel.app", PAGE_MARGIN, 292);
  doc.text(`${page} / ${pageCount}`, PAGE_WIDTH - PAGE_MARGIN, 292, { align: "right" });
};

const drawPill = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
  accent: readonly [number, number, number]
) => {
  setFillColor(doc, COLORS.surfaceAlt);
  doc.roundedRect(x, y, width, 11, 2.2, 2.2, "F");
  setTextColor(doc, COLORS.muted);
  doc.setFontSize(5.8);
  doc.text(label.toUpperCase(), x + 2.5, y + 3.8);
  setTextColor(doc, accent);
  doc.setFontSize(8.2);
  doc.text(value, x + 2.5, y + 8.8);
};

const mealTypeLabel = (t: any, type: PlanMealType) => ({
  breakfast: t.Main.breakfast,
  lunch: t.Main.lunch,
  dinner: t.Main.dinner,
  snack: t.Main.snack,
}[type]);

const formatAmount = (amount: number) => {
  const rounded = Math.round(amount * 10) / 10;
  return Number.isInteger(rounded) ? String(Math.round(rounded)) : String(rounded);
};

const ingredientText = (meal: Meal, servings: number, lang: "bg" | "en") =>
  meal.ingredients.map((ingredient) =>
    `${ingredient.name[lang]} ${formatAmount(ingredient.amount * servings)}${ingredient.unit ? ` ${ingredient.unit}` : ""}`
  ).join(", ");

const buildDayRows = (doc: jsPDF, day: DayPlan, lang: "bg" | "en"): DayRow[] => {
  const rows: DayRow[] = [];
  (["breakfast", "lunch", "dinner", "snack"] as PlanMealType[]).forEach((type) => {
    groupMealPortions(day.meals[type]).forEach(({ meal, servings }) => {
      const nameLines = doc.splitTextToSize(meal.name[lang], 56) as string[];
      const ingredientLines = doc.splitTextToSize(ingredientText(meal, servings, lang), 94) as string[];
      const nameHeight = nameLines.length * 3.4 + 3.2;
      const ingredientHeight = ingredientLines.length * 3.05;
      rows.push({
        type,
        meal,
        servings,
        nameLines,
        ingredientLines,
        height: Math.max(9.4, 3.5 + Math.max(nameHeight, ingredientHeight)),
      });
    });
  });
  return rows;
};

const dayCardHeight = (rows: DayRow[]) => 19 + rows.reduce((sum, row) => sum + row.height, 0) + 2;

const drawMiniMacro = (
  doc: jsPDF,
  x: number,
  y: number,
  label: string,
  value: number,
  color: readonly [number, number, number]
) => {
  setTextColor(doc, COLORS.muted);
  doc.setFontSize(5.6);
  doc.text(label, x, y);
  setTextColor(doc, color);
  doc.setFontSize(8);
  doc.text(`${value} g`, x, y + 4.4);
};

const drawDayCard = (
  doc: jsPDF,
  day: DayPlan,
  dayIndex: number,
  rows: DayRow[],
  y: number,
  height: number,
  t: any,
  lang: "bg" | "en"
) => {
  const x = PAGE_MARGIN;
  setFillColor(doc, COLORS.surface);
  doc.roundedRect(x, y, CONTENT_WIDTH, height, 3.2, 3.2, "F");
  setFillColor(doc, COLORS.surfaceAlt);
  doc.roundedRect(x, y, CONTENT_WIDTH, 13.5, 3.2, 3.2, "F");
  doc.rect(x, y + 9.5, CONTENT_WIDTH, 4, "F");

  setTextColor(doc, COLORS.green);
  doc.setFontSize(10.5);
  doc.text(`${t.Main.day} ${dayIndex + 1}`, x + 4, y + 5.8);
  setTextColor(doc, COLORS.white);
  doc.setFontSize(7.2);
  doc.text(`${day.total.kcal} kcal`, x + 4, y + 11.1);
  drawMiniMacro(doc, x + 105, y + 4.6, "P", day.total.protein, COLORS.blue);
  drawMiniMacro(doc, x + 133, y + 4.6, "C", day.total.carbs, COLORS.yellow);
  drawMiniMacro(doc, x + 161, y + 4.6, "F", day.total.fat, COLORS.pink);

  setTextColor(doc, COLORS.faint);
  doc.setFontSize(5.8);
  doc.text(lang === "bg" ? "ХРАНЕНЕ И ПОРЦИЯ" : "MEAL AND PORTION", x + 30, y + 17.3);
  doc.text(lang === "bg" ? "СЪСТАВКИ" : "INGREDIENTS", x + 96, y + 17.3);

  let rowY = y + 19;
  rows.forEach((row) => {
    setFillColor(doc, COLORS.surfaceAlt);
    doc.roundedRect(x + 3, rowY, CONTENT_WIDTH - 6, row.height - 0.9, 1.8, 1.8, "F");
    setTextColor(doc, row.type === "snack" ? COLORS.teal : COLORS.green);
    doc.setFontSize(5.8);
    doc.text(mealTypeLabel(t, row.type).toUpperCase(), x + 5, rowY + 4.2);

    const mealX = x + 30;
    setTextColor(doc, COLORS.white);
    doc.setFontSize(7.2);
    const recipePath = row.meal.link || `/meals/${row.meal.slug}`;
    row.nameLines.forEach((line, lineIndex) => {
      const renderedLine = lineIndex === 0 && row.servings > 1 ? `${line} x${row.servings}` : line;
      if (lineIndex === 0) {
        doc.textWithLink(renderedLine, mealX, rowY + 4.1, {
          url: `https://fittrack2-pi.vercel.app${recipePath}?portion=${row.meal.weight * row.servings}`,
        });
      } else {
        doc.text(renderedLine, mealX, rowY + 4.1 + lineIndex * 3.4);
      }
    });
    setTextColor(doc, COLORS.muted);
    doc.setFontSize(6.1);
    doc.text(
      `${row.meal.weight * row.servings} g | ${row.meal.kcal * row.servings} kcal`,
      mealX,
      rowY + row.nameLines.length * 3.4 + 3.6
    );

    setTextColor(doc, COLORS.muted);
    doc.setFontSize(6.5);
    row.ingredientLines.forEach((line, lineIndex) => doc.text(line, x + 96, rowY + 4.1 + lineIndex * 3.05));
    rowY += row.height;
  });
};

const drawDayGroup = (
  doc: jsPDF,
  params: DownloadPdfParams,
  dayIndexes: number[],
  startY: number
) => {
  const { weeklyPlan, t, lang } = params;
  const prepared = dayIndexes.map((dayIndex) => {
    const rows = buildDayRows(doc, weeklyPlan[dayIndex], lang);
    return { dayIndex, rows, height: dayCardHeight(rows) };
  });
  let y = startY;
  prepared.forEach(({ dayIndex, rows, height }) => {
    drawDayCard(doc, weeklyPlan[dayIndex], dayIndex, rows, y, height, t, lang);
    y += height + 3;
  });
  return y;
};

const drawShoppingList = (doc: jsPDF, params: DownloadPdfParams, startY: number) => {
  const { t, weeklyPlan, lang } = params;
  const shoppingList = generateShoppingList(weeklyPlan, lang).filter((item) => item.amount > 0);
  const titleY = startY + 3;
  const listY = titleY + 13;
  setTextColor(doc, COLORS.green);
  doc.setFontSize(13);
  doc.text(t.Main.shoppingTitle.replace(/:\s*$/, ""), PAGE_MARGIN, titleY);
  setTextColor(doc, COLORS.muted);
  doc.setFontSize(7.5);
  doc.text(
    lang === "bg" ? "Маркирай продуктите или копирай една колона наведнъж." : "Check products or copy one column at a time.",
    PAGE_MARGIN,
    titleY + 6
  );

  const columnGap = 4;
  const columnWidth = (CONTENT_WIDTH - columnGap * 2) / 3;
  const rowsPerColumn = Math.ceil(shoppingList.length / 3);
  for (let column = 0; column < 3; column += 1) {
    const items = shoppingList.slice(column * rowsPerColumn, (column + 1) * rowsPerColumn);
    const x = PAGE_MARGIN + column * (columnWidth + columnGap);
    let y = listY;
    items.forEach((item) => {
      const text = `${item.name} - ${item.amount} ${item.unit}`.trim();
      const lines = doc.splitTextToSize(text, columnWidth - 9) as string[];
      const rowHeight = Math.max(8.2, 4.2 + lines.length * 3.5);
      setFillColor(doc, COLORS.surface);
      doc.roundedRect(x, y, columnWidth, rowHeight - 1, 1.5, 1.5, "F");
      doc.setDrawColor(COLORS.faint[0], COLORS.faint[1], COLORS.faint[2]);
      doc.rect(x + 2, y + 2.2, 2.6, 2.6);
      setTextColor(doc, COLORS.white);
      doc.setFontSize(7.1);
      lines.forEach((line, lineIndex) => doc.text(line, x + 7, y + 4.5 + lineIndex * 3.5));
      y += rowHeight;
    });
  }
};

export const buildPlanPDF = (params: DownloadPdfParams) => {
  const { t, weeklyPlan, goal, goalLabels, diet, dietLabels, lang, theme = "light" } = params;
  COLORS = PDF_PALETTES[theme];
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  doc.setFont("Roboto", "normal");
  doc.setProperties({ title: t.Main.pdfTitle, subject: "Personal nutrition plan", creator: "FitTrack" });
  paintPage(doc);

  setTextColor(doc, COLORS.green);
  doc.setFontSize(8.5);
  doc.text("FITTRACK", PAGE_MARGIN, 10);
  setTextColor(doc, COLORS.muted);
  doc.setFontSize(7);
  doc.text(lang === "bg" ? "ПЕРСОНАЛЕН СЕДМИЧЕН РЕЖИМ" : "PERSONAL WEEKLY PLAN", PAGE_WIDTH - PAGE_MARGIN, 10, { align: "right" });
  setTextColor(doc, COLORS.white);
  doc.setFontSize(17);
  doc.text(t.Main.pdfTitle, PAGE_MARGIN, 20);
  setTextColor(doc, COLORS.muted);
  doc.setFontSize(7.5);
  doc.text(
    lang === "bg" ? "Ястия, съставки, практични порции и седмично пазаруване." : "Meals, ingredients, practical portions, and weekly shopping.",
    PAGE_MARGIN,
    26
  );

  drawPill(doc, PAGE_MARGIN, 30, 52, t.Main.goalLabel, goalLabels[goal], COLORS.green);
  drawPill(doc, PAGE_MARGIN + 56, 30, 66, t.Main.dietLabel, dietLabels[diet], COLORS.teal);
  const averageCalories = Math.round(weeklyPlan.reduce((sum, day) => sum + day.total.kcal, 0) / Math.max(1, weeklyPlan.length));
  drawPill(doc, PAGE_MARGIN + 126, 30, 48, lang === "bg" ? "Средно" : "Average", `${averageCalories} kcal`, COLORS.white);

  drawDayGroup(doc, params, [0, 1, 2], 45);
  addPage(doc, t.Main.pdfTitle);
  drawDayGroup(doc, params, [3, 4, 5], 15);
  addPage(doc, t.Main.pdfTitle);
  const daySevenEndY = drawDayGroup(doc, params, [6], 15);
  drawShoppingList(doc, params, daySevenEndY);

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    drawFooter(doc, page, pageCount);
  }
  return doc;
};

export const downloadPDF = (params: DownloadPdfParams) => {
  buildPlanPDF(params).save("hranitelen-rezhim.pdf");
};
