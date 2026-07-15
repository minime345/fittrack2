export function InfoBlock({
  number,
  title,
  text: body,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="fit-surface rounded-2xl border border-white/10 p-5">
      <span className="text-xs font-black text-green-400">{number}</span>
      <h3 className="mt-2 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-400">{body}</p>
    </article>
  );
}
