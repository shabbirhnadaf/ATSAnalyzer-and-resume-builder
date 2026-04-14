type Props = {
  score: number;
  title: string;
  items?: string[];
  content?: string;
};

export default function ATSAnalysisCard({ score, title, items = [], content }: Props) {
  const scoreTone =
    score >= 80
      ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
      : score >= 60
      ? 'border-amber-400/30 bg-amber-500/10 text-amber-300'
      : 'border-rose-400/30 bg-rose-500/10 text-rose-300';

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 text-white shadow-[0_18px_40px_rgba(2,8,23,0.16)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
        </div>

        <span className={`rounded-full border px-3 py-1 text-sm font-medium ${scoreTone}`}>
          Score {score}/100
        </span>
      </div>

      {content ? (
        <p className="mt-4 text-sm leading-7 text-slate-300">{content}</p>
      ) : null}

      {items.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm leading-6 text-slate-300"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}