type Props = {
  title: string;
  content: string;
  onApply?: () => void;
};

export default function AISuggestionCard({ title, content, onApply }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
      <h3 className="text-sm font-semibold text-cyan-300">{title}</h3>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-200">{content}</p>
      {onApply && (
        <button
          type="button"
          onClick={onApply}
          className="mt-4 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950"
        >
          Apply
        </button>
      )}
    </div>
  );
}