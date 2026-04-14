import type { ScanHistoryRecord } from '../../api/scans';

type Props = {
  current: ScanHistoryRecord | null;
  compareWith: ScanHistoryRecord | null;
  onClose: () => void;
};

export default function ScanComparisonDrawer({ current, compareWith, onClose }: Props) {
  if (!current || !compareWith) return null;

  const currentMissing: string[] = Array.isArray(current.missingKeywords) ? current.missingKeywords : [];
  const compareMissing: string[] = Array.isArray(compareWith.missingKeywords) ? compareWith.missingKeywords : [];

  const currentMatched: string[] = Array.isArray(current.matchedKeywords)
    ? current.matchedKeywords
    : Array.isArray(current.mathKeywords)
      ? current.mathKeywords
      : [];

  const compareMatched: string[] = Array.isArray(compareWith.matchedKeywords)
    ? compareWith.matchedKeywords
    : Array.isArray(compareWith.mathKeywords)
      ? compareWith.mathKeywords
      : [];

  const scoreDiff = current.score - compareWith.score;

  const uniqueCurrentMissing = currentMissing.filter((item: string) => !compareMissing.includes(item));
  const improvedKeywords = currentMatched.filter((item: string) => !compareMatched.includes(item));

  const currentCompany = current.company || current.companyName || '';
  const compareCompany = compareWith.company || compareWith.companyName || '';

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
          <Panel title="Current Scan" scan={current} companyLabel={currentCompany} />
          <Panel title="Compared Scan" scan={compareWith} companyLabel={compareCompany} />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">Score Difference</h3>
          <p className={`mt-3 text-3xl font-semibold ${scoreDiff >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
            {scoreDiff >= 0 ? '+' : ''}{scoreDiff}%
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white">Improved keywords</h3>
            {improvedKeywords.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No improvements detected yet.</p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {improvedKeywords.map((item: string) => (
                  <span
                    key={item}
                    className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white">Still missing now</h3>
            {uniqueCurrentMissing.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No remaining exclusive gaps.</p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {uniqueCurrentMissing.map((item: string) => (
                  <span
                    key={item}
                    className="rounded-full bg-amber-500/15 px-3 py-1 text-xs text-amber-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  scan,
  companyLabel,
}: {
  title: string;
  scan: ScanHistoryRecord;
  companyLabel: string;
}) {
  const matched = Array.isArray(scan.matchedKeywords)
    ? scan.matchedKeywords
    : Array.isArray(scan.mathKeywords)
      ? scan.mathKeywords
      : [];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm uppercase tracking-[0.15em] text-cyan-300">{title}</p>
      <h3 className="mt-2 text-xl font-semibold text-white">
        {scan.jobTitle || 'Untitled role'}
        {companyLabel ? ` • ${companyLabel}` : ''}
      </h3>
      <p className="mt-2 text-sm text-slate-400">
        {new Date(scan.createdAt).toLocaleString()}
      </p>
      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
        <span className="text-sm text-slate-400">Score</span>
        <p className="mt-1 text-3xl font-semibold text-white">{scan.score}%</p>
      </div>

      <div className="mt-4">
        <p className="text-sm text-slate-400">Matched keywords</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {matched.slice(0, 8).map((item) => (
            <span key={item} className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
              {item}
            </span>
          ))}
          {matched.length === 0 && <span className="text-sm text-slate-500">None</span>}
        </div>
      </div>
    </div>
  );
}