export function DownloadPlanButton({
  lang,
  onClick,
}: {
  lang: "bg" | "en";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fit-primary-button w-full rounded-xl bg-green-600 px-6 py-3 text-left text-white shadow transition-colors hover:bg-green-700"
    >
      <span className="block font-semibold">
        {lang === "bg" ? "📄 Изтегли PDF" : "📄 Download PDF"}
      </span>
      <span className="mt-0.5 block text-xs font-normal text-green-100/75">
        {lang === "bg"
          ? "Запази текущия тренировъчен план"
          : "Save the current training plan"}
      </span>
    </button>
  );
}
