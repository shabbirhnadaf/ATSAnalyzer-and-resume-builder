import type { ScanHistoryRecord } from '../../api/scans';

type Props = {
  scan: ScanHistoryRecord;
  onSelect: (scan: ScanHistoryRecord) => void;
};

export default function ScanHistoryCard({ scan, onSelect }: Props) {
  const keywords: string[] = Array.isArray(scan.matchedKeywords)
    ? scan.matchedKeywords
    : Array.isArray(scan.mathKeywords)
      ? scan.mathKeywords
      : [];

  const companyLabel = scan.company || scan.companyName || '';

  return (
    <button
      type="button"
      onClick={() => onSelect(scan)}
      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium text-white">
            {scan.jobTitle || 'Untitled role'}
            {companyLabel ? ` • ${companyLabel}` : ''}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {new Date(scan.createdAt).toLocaleString()}
          </p>
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-medium ${scoreBadgeClass(scan.score)}`}>
          {scan.score}%
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {keywords.slice(0, 6).map((keyword: string) => (
          <span
            key={keyword}
            className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300"
          >
            {keyword}
          </span>
        ))}
      </div>
    </button>
  );
}

function scoreBadgeClass(score: number) {
  if (score >= 75) return 'bg-emerald-500/15 text-emerald-300';
  if (score >= 50) return 'bg-amber-500/15 text-amber-300';
  return 'bg-rose-500/15 text-rose-300';
}