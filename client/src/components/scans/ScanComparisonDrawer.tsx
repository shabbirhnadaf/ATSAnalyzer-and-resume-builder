import type { ScanHistoryRecord } from '../../api/scans';

type Props = {
  current: ScanHistoryRecord | null;
  compareWith: ScanHistoryRecord | null;
  onClose: () => void;
};

export default function ScanComparisonDrawer({ current, compareWith, onClose }: Props) {
  if (!current || !compareWith) return null;

  const scoreDiff = current.score - compareWith.score;
  const uniqueCurrentMissing = current.missingKeywords.filter((item) => !compareWith.missingKeywords.includes(item));
  const improvedKeywords = current.matchedKeywords.filter((item) => !compareWith.matchedKeywords.includes(item));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm">
      <div className="ml-auto h-full w-full max-w-3xl overflow-y-auto border-l border-white/10 bg-slate-950 p-6 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Compare Scans</p>
            <h2 className="mt-2 text-3xl font-semibold">Scan comparison</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Panel title="Current Scan" scan={current} />
          <Panel title="Compared Scan" scan={compareWith} />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">Score Difference</h3>
          <p className={`mt-3 text-3xl font-semibold ${scoreDiff >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
            {scoreDiff >= 0 ? '+' : ''}
            {scoreDiff}%
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <TagPanel
            title="Improved keywords"
            items={improvedKeywords}
            emptyText="No new keyword wins yet."
            tone="emerald"
          />
          <TagPanel
            title="Remaining gaps"
            items={uniqueCurrentMissing}
            emptyText="No exclusive remaining gaps."
            tone="amber"
          />
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  scan,
}: {
  title: string;
  scan: ScanHistoryRecord;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm uppercase tracking-[0.15em] text-cyan-300">{title}</p>
      <h3 className="mt-2 text-xl font-semibold text-white">
        {scan.jobTitle || 'Untitled role'}
        {scan.companyName ? ` · ${scan.companyName}` : ''}
      </h3>
      <p className="mt-2 text-sm text-slate-400">{new Date(scan.createdAt).toLocaleString()}</p>
      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
        <span className="text-sm text-slate-400">Score</span>
        <p className="mt-1 text-3xl font-semibold text-white">{scan.score}%</p>
      </div>

      <div className="mt-4">
        <p className="text-sm text-slate-400">Priority fixes</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-200">
          {scan.priorityFixes.slice(0, 3).map((item, index) => (
            <li key={`${item}-${index}`} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              {item}
            </li>
          ))}
          {scan.priorityFixes.length === 0 && <li className="text-sm text-slate-500">None</li>}
        </ul>
      </div>
    </div>
  );
}

function TagPanel({
  title,
  items,
  emptyText,
  tone,
}: {
  title: string;
  items: string[];
  emptyText: string;
  tone: 'emerald' | 'amber';
}) {
  const toneClass =
    tone === 'emerald'
      ? 'rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300'
      : 'rounded-full bg-amber-500/15 px-3 py-1 text-xs text-amber-300';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">{emptyText}</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item} className={toneClass}>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
