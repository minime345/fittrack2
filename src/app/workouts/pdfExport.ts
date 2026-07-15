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
};

type ExerciseRow = {
  lines: string[];
  height: number;
};

const COLORS = {
  background: [7, 17, 31] as const,
  surface: [17, 29, 45] as const,
  surfaceAlt: [22, 38, 55] as const,
  green: [74, 222, 128] as const,
  teal: [45, 212, 191] as const,
  white: [241, 245, 249] as const,
  muted: [148, 163, 184] as const,
  faint: [71, 85, 105] as const,
};

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
  doc.text(`${page} / ${pageCount}`, PAGE_WIDTH - PAGE_MARGIN, 292, {
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
): ExerciseRow[] =>
  session.exercises.slice(0, exerciseLimit).map((exercise) => {
    const name = getExerciseName(exercise.id, equipment, lang);
    const label = `${name} - ${exercise.prescription}`;
    const lines = doc.splitTextToSize(label, CONTENT_WIDTH - 14) as string[];
    return { lines, height: Math.max(6.4, 2.6 + lines.length * 3.4) };
  });

const sessionCardHeight = (rows: ExerciseRow[]) =>
  15 + rows.reduce((sum, row) => sum + row.height, 0) + 2;

const drawSessionCard = (
  doc: jsPDF,
  session: SessionTemplate,
  dayLabel: string,
  minutes: number,
  rows: ExerciseRow[],
  y: number,
  height: number,
  lang: "bg" | "en",
) => {
  const x = PAGE_MARGIN;
  setFillColor(doc, COLORS.surface);
  doc.roundedRect(x, y, CONTENT_WIDTH, height, 3.2, 3.2, "F");
  setFillColor(doc, COLORS.surfaceAlt);
  doc.roundedRect(x, y, CONTENT_WIDTH, 12.5, 3.2, 3.2, "F");
  doc.rect(x, y + 8.5, CONTENT_WIDTH, 4, "F");

  setTextColor(doc, COLORS.green);
  doc.setFontSize(6.2);
  doc.text(dayLabel.toUpperCase(), x + 4, y + 4.6);
  setTextColor(doc, COLORS.white);
  doc.setFontSize(10.5);
  doc.text(session.focus[lang], x + 4, y + 10.2);
  setTextColor(doc, COLORS.muted);
  doc.setFontSize(6.8);
  doc.text(`~${minutes} min`, PAGE_WIDTH - PAGE_MARGIN - 4, y + 7.2, {
    align: "right",
  });

  let rowY = y + 15;
  rows.forEach((row) => {
    setTextColor(doc, COLORS.green);
    doc.setFontSize(7.5);
    doc.text("v", x + 4, rowY + 3.6);
    setTextColor(doc, COLORS.white);
    doc.setFontSize(7.4);
    row.lines.forEach((line, lineIndex) =>
      doc.text(line, x + 8.5, rowY + 3.6 + lineIndex * 3.4),
    );
    rowY += row.height;
  });
};

const drawSessionGroup = (
  doc: jsPDF,
  params: DownloadWorkoutPdfParams,
  startIndex: number,
  startY: number,
  maxY: number,
) => {
  const { schedule, scheduleDays, minutes, exerciseLimit, equipment, lang } =
    params;
  let y = startY;
  let index = startIndex;
  while (index < schedule.length) {
    const session = schedule[index];
    const dayLabel =
      scheduleDays[index]?.[lang] ||
      `${lang === "bg" ? "Ден" : "Day"} ${index + 1}`;
    const rows = buildExerciseRows(doc, session, exerciseLimit, equipment, lang);
    const height = sessionCardHeight(rows);
    if (y + height > maxY && y > startY) break;
    drawSessionCard(doc, session, dayLabel, minutes, rows, y, height, lang);
    y += height + 4;
    index += 1;
  }
  return index;
};

export const buildWorkoutPlanPDF = (params: DownloadWorkoutPdfParams) => {
  const { lang, plan, goalLabel, equipmentLabel, minutes, schedule } = params;
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

  let sessionIndex = 0;
  let startY = pillY + 17;
  let section = plan.name[lang];
  while (sessionIndex < schedule.length) {
    const nextIndex = drawSessionGroup(doc, params, sessionIndex, startY, 280);
    if (nextIndex === sessionIndex) break;
    sessionIndex = nextIndex;
    if (sessionIndex < schedule.length) {
      addPage(doc, section);
      startY = 15;
    }
  }

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    drawFooter(doc, page, pageCount);
  }
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
