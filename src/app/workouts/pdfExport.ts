import jsPDF from "jspdf";
import "@/fonts/Roboto-Regular.js";
import { getExerciseName } from "./data/exercises";
import type { Equipment, LocalText, Program, SessionTemplate } from "./types";

type DownloadWorkoutPdfParams = {
  lang: "bg" | "en";
  plan: Program;
  schedule: SessionTemplate[];
  scheduleDays: LocalText[];
  goalLabel: string;
  equipmentLabel: string;
  equipment: Equipment;
  minutes: number;
  exerciseLimit: number;
  theme?: "light" | "dark";
};

type ExerciseRow = {
  lines: string[];
  height: number;
};

type SessionCard = {
  session: SessionTemplate;
  dayLabel: string;
  rows: ExerciseRow[];
  height: number;
};

type CardRow = {
  cards: SessionCard[];
  height: number;
};

type Layout = {
  rows: CardRow[];
  totalHeight: number;
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
  },
};

let COLORS: (typeof PDF_PALETTES)[keyof typeof PDF_PALETTES] = PDF_PALETTES.light;

const PAGE_MARGIN = 8;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;
const COLUMNS = 2;
const CARD_GAP_X = 4;
const COLUMN_WIDTH = (CONTENT_WIDTH - CARD_GAP_X * (COLUMNS - 1)) / COLUMNS;
const FOOTER_Y = 287;

// Largest scale is tried first; the first one whose content fits the page
// is used, so plans with few sessions stay at full size and plans with
// many sessions shrink just enough to stay on a single page.
const SCALE_STEPS = [1, 0.94, 0.88, 0.82, 0.76, 0.7, 0.64, 0.58, 0.52];

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

const drawFooter = (doc: jsPDF) => {
  setFillColor(doc, COLORS.surfaceAlt);
  doc.rect(PAGE_MARGIN, FOOTER_Y, CONTENT_WIDTH, 0.3, "F");
  setTextColor(doc, COLORS.faint);
  doc.setFontSize(6.5);
  doc.text("fittrack2-pi.vercel.app", PAGE_MARGIN, FOOTER_Y + 5);
  doc.text("1 / 1", PAGE_WIDTH - PAGE_MARGIN, FOOTER_Y + 5, {
    align: "right",
  });
};

const drawPill = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
  accent: readonly [number, number, number],
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

const buildExerciseRows = (
  doc: jsPDF,
  session: SessionTemplate,
  exerciseLimit: number,
  equipment: Equipment,
  lang: "bg" | "en",
  scale: number,
): ExerciseRow[] => {
  doc.setFontSize(7.4 * scale);
  const lineHeight = 3.15 * scale;
  return session.exercises.slice(0, exerciseLimit).map((exercise) => {
    const name = getExerciseName(exercise.id, equipment, lang);
    const label = `${name} - ${exercise.prescription}`;
    const lines = doc.splitTextToSize(label, COLUMN_WIDTH - 9) as string[];
    return {
      lines,
      height: Math.max(5.6 * scale, 2 * scale + lines.length * lineHeight),
    };
  });
};

const HEADER_HEIGHT = 12.5;

const sessionCardHeight = (rows: ExerciseRow[], scale: number) =>
  HEADER_HEIGHT * scale +
  rows.reduce((sum, row) => sum + row.height, 0) +
  2.5 * scale;

const buildLayout = (
  doc: jsPDF,
  params: DownloadWorkoutPdfParams,
  scale: number,
): Layout => {
  const { schedule, scheduleDays, exerciseLimit, equipment, lang } = params;
  const cards: SessionCard[] = schedule.map((session, index) => {
    const dayLabel =
      scheduleDays[index]?.[lang] ||
      `${lang === "bg" ? "Ден" : "Day"} ${index + 1}`;
    const rows = buildExerciseRows(
      doc,
      session,
      exerciseLimit,
      equipment,
      lang,
      scale,
    );
    return { session, dayLabel, rows, height: sessionCardHeight(rows, scale) };
  });

  const rows: CardRow[] = [];
  for (let i = 0; i < cards.length; i += COLUMNS) {
    const group = cards.slice(i, i + COLUMNS);
    rows.push({
      cards: group,
      height: Math.max(...group.map((card) => card.height)),
    });
  }

  const gap = 4 * scale;
  const totalHeight =
    rows.reduce((sum, row) => sum + row.height, 0) +
    gap * Math.max(0, rows.length - 1);

  return { rows, totalHeight };
};

const drawSessionCard = (
  doc: jsPDF,
  card: SessionCard,
  minutes: number,
  x: number,
  y: number,
  width: number,
  height: number,
  scale: number,
  lang: "bg" | "en",
) => {
  const radius = 3.2 * scale;
  const headerHeight = HEADER_HEIGHT * scale;

  setFillColor(doc, COLORS.surface);
  doc.roundedRect(x, y, width, height, radius, radius, "F");
  setFillColor(doc, COLORS.surfaceAlt);
  doc.roundedRect(x, y, width, headerHeight, radius, radius, "F");
  doc.rect(x, y + headerHeight - 4 * scale, width, 4 * scale, "F");

  setTextColor(doc, COLORS.green);
  doc.setFontSize(6.2 * scale);
  doc.text(card.dayLabel.toUpperCase(), x + 4 * scale, y + 4.6 * scale);
  setTextColor(doc, COLORS.white);
  doc.setFontSize(10 * scale);
  const focusLines = doc.splitTextToSize(
    card.session.focus[lang],
    width - 8 * scale,
  ) as string[];
  doc.text(focusLines[0], x + 4 * scale, y + 10.2 * scale);
  setTextColor(doc, COLORS.muted);
  doc.setFontSize(6.4 * scale);
  doc.text(`~${minutes} min`, x + width - 4 * scale, y + 7.2 * scale, {
    align: "right",
  });

  let rowY = y + headerHeight + 2.2 * scale;
  card.rows.forEach((row) => {
    setTextColor(doc, COLORS.green);
    doc.setFontSize(7.2 * scale);
    doc.text("v", x + 4 * scale, rowY + 3 * scale);
    setTextColor(doc, COLORS.white);
    doc.setFontSize(7.2 * scale);
    row.lines.forEach((line, lineIndex) =>
      doc.text(line, x + 8 * scale, rowY + 3 * scale + lineIndex * 3.15 * scale),
    );
    rowY += row.height;
  });
};

export const buildWorkoutPlanPDF = (params: DownloadWorkoutPdfParams) => {
  const { lang, plan, goalLabel, equipmentLabel, minutes, schedule, theme = "light" } = params;
  COLORS = PDF_PALETTES[theme];
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  doc.setFont("Roboto", "normal");
  doc.setProperties({
    title: plan.name[lang],
    subject: "Personal training plan",
    creator: "FitTrack",
  });
  paintPage(doc);

  setTextColor(doc, COLORS.green);
  doc.setFontSize(8.5);
  doc.text("FITTRACK", PAGE_MARGIN, 10);
  setTextColor(doc, COLORS.muted);
  doc.setFontSize(7);
  doc.text(
    lang === "bg" ? "ПЕРСОНАЛЕН ТРЕНИРОВЪЧЕН ПЛАН" : "PERSONAL TRAINING PLAN",
    PAGE_WIDTH - PAGE_MARGIN,
    10,
    { align: "right" },
  );
  setTextColor(doc, COLORS.white);
  doc.setFontSize(17);
  doc.text(plan.name[lang], PAGE_MARGIN, 20);
  setTextColor(doc, COLORS.muted);
  doc.setFontSize(7.5);
  const summaryLines = doc.splitTextToSize(
    plan.summary[lang],
    CONTENT_WIDTH,
  ) as string[];
  summaryLines.slice(0, 2).forEach((line, index) => {
    doc.text(line, PAGE_MARGIN, 26 + index * 4);
  });

  const pillY = summaryLines.length > 1 ? 34 : 30;
  drawPill(doc, PAGE_MARGIN, pillY, 46, goalLabel ? (lang === "bg" ? "Цел" : "Goal") : "", goalLabel, COLORS.green);
  drawPill(
    doc,
    PAGE_MARGIN + 50,
    pillY,
    46,
    lang === "bg" ? "Дни седмично" : "Days / week",
    `${schedule.length}`,
    COLORS.teal,
  );
  drawPill(
    doc,
    PAGE_MARGIN + 100,
    pillY,
    46,
    lang === "bg" ? "Времетраене" : "Session length",
    `${minutes} min`,
    COLORS.white,
  );
  drawPill(
    doc,
    PAGE_MARGIN + 150,
    pillY,
    46,
    lang === "bg" ? "Оборудване" : "Equipment",
    equipmentLabel,
    COLORS.white,
  );

  const startY = pillY + 17;
  const availableHeight = FOOTER_Y - 3 - startY;

  // Find the largest scale whose layout still fits in the space available
  // below the header, so the whole plan always renders on a single page.
  let layout = buildLayout(doc, params, SCALE_STEPS[SCALE_STEPS.length - 1]);
  let scale = SCALE_STEPS[SCALE_STEPS.length - 1];
  for (const step of SCALE_STEPS) {
    const candidate = buildLayout(doc, params, step);
    layout = candidate;
    scale = step;
    if (candidate.totalHeight <= availableHeight) break;
  }

  const gap = 4 * scale;
  let y = startY;
  layout.rows.forEach((row) => {
    row.cards.forEach((card, columnIndex) => {
      const x = PAGE_MARGIN + columnIndex * (COLUMN_WIDTH + CARD_GAP_X);
      drawSessionCard(doc, card, minutes, x, y, COLUMN_WIDTH, row.height, scale, lang);
    });
    y += row.height + gap;
  });

  drawFooter(doc);
  return doc;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "training-plan";

export const downloadWorkoutPlanPDF = (params: DownloadWorkoutPdfParams) => {
  const filename = `${slugify(params.plan.id)}-training-plan.pdf`;
  buildWorkoutPlanPDF(params).save(filename);
};
