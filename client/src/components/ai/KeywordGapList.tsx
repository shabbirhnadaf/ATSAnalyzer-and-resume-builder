type Props = {
  title: string;
  items: string[];
};

export default function KeywordGapList({ title, items }: Props) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-white shadow-[0_16px_36px_rgba(2,8,23,0.12)]">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
        {title}
      </h3>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">No items found.</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}