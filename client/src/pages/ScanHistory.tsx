import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getResumesApi, type ResumeRecord } from '../api/resumes';
import { getScanHistoryApi, getResumeScansApi, type ScanHistoryRecord } from '../api/scans';
import ScanComparisonDrawer from '../components/scans/ScanComparisonDrawer';
import ScanHistoryCard from '../components/scans/ScanHistoryCard';

type ScanArrayRecord = ScanHistoryRecord & {
  matchedKeywords?: string[];
  mathKeywords?: string[];
  missingKeywords?: string[];
  warnings?: string[];
  suggestions?: string[];
  company?: string;
  companyName?: string;
};

export default function ScanHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState(searchParams.get('resumeId') || 'all');
  const [scans, setScans] = useState<ScanArrayRecord[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanArrayRecord | null>(null);
  const [compareScan, setCompareScan] = useState<ScanArrayRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const response = await getResumesApi();
        setResumes(response.data || []);
      } catch {
        setResumes([]);
      }
    };

    void loadResumes();
  }, []);

  useEffect(() => {
    const loadScans = async () => {
      try {
        setLoading(true);
        setError('');

        const response =
          selectedResumeId === 'all'
            ? await getScanHistoryApi()
            : await getResumeScansApi(selectedResumeId);

        const items: ScanArrayRecord[] = (response.data || []).map((scan: ScanHistoryRecord) => ({
          ...scan,
          matchedKeywords: Array.isArray(scan.matchedKeywords)
            ? scan.matchedKeywords
            : Array.isArray(scan.mathKeywords)
              ? scan.mathKeywords
              : [],
          mathKeywords: Array.isArray(scan.mathKeywords)
            ? scan.mathKeywords
            : Array.isArray(scan.matchedKeywords)
              ? scan.matchedKeywords
              : [],
          missingKeywords: Array.isArray(scan.missingKeywords) ? scan.missingKeywords : [],
          warnings: Array.isArray(scan.warnings) ? scan.warnings : [],
          suggestions: Array.isArray(scan.suggestions) ? scan.suggestions : [],
          company: scan.company || scan.companyName || '',
          companyName: scan.companyName || scan.company || '',
        }));

        setScans(items);
        setSelectedScan(items[0] || null);
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : undefined;

        setError(message || 'Failed to load scan history.');
        setScans([]);
        setSelectedScan(null);
      } finally {
        setLoading(false);
      }
    };

    void loadScans();
  }, [selectedResumeId]);

  const avgScore = useMemo(() => {
    if (!scans.length) return 0;
    return Math.round(scans.reduce((acc: number, item: ScanArrayRecord) => acc + item.score, 0) / scans.length);
  }, [scans]);

  const bestScore = useMemo(() => {
    if (!scans.length) return 0;
    return Math.max(...scans.map((item: ScanArrayRecord) => item.score));
  }, [scans]);

  const totalWarnings = useMemo(() => {
    return scans.reduce((acc: number, item: ScanArrayRecord) => acc + (item.warnings?.length || 0), 0);
  }, [scans]);

  const handleFilterChange = (value: string) => {
    setSelectedResumeId(value);
    setSearchParams(value === 'all' ? {} : { resumeId: value });
    setCompareScan(null);
  };

  const getCompanyLabel = (scan: ScanArrayRecord) => scan.company || scan.companyName || '';

  return (
    <section className="space-y-8">
      <div className="rounded-4xl border border-white/10 bg-linear-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-6 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Scan History</p>
        <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Track ATS improvements</h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Review scan attempts over time, compare score changes, and identify which missing keywords
          were resolved between resume iterations.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Total scans" value={scans.length} />
          <StatCard label="Average score" value={`${avgScore}%`} />
          <StatCard label="Best score" value={`${bestScore}%`} />
        </div>
      </div>

      {!!error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="rounded-4xl border border-white/10 bg-white/5 p-6">
        <label className="mb-2 block text-sm font-medium text-slate-200">Filter by Resume</label>
        <select
          value={selectedResumeId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
        >
          <option value="all">All resumes</option>
          {resumes.map((resume: ResumeRecord) => (
            <option key={resume._id} value={resume._id}>
              {resume.title || 'Untitled Resume'} — {resume.personalInfo?.fullname || 'No name'}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-4xl border border-white/10 bg-white/5 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">All scans</h2>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {totalWarnings} warnings
            </span>
          </div>

          {loading ? (
            <div className="mt-5 space-y-3">
              {Array.from({ length: 4 }).map((_: unknown, index: number) => (
                <div key={index} className="h-24 animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : scans.length === 0 ? (
            <p className="mt-5 text-slate-400">No scan history found.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {scans.map((scan: ScanArrayRecord) => (
                <div key={scan._id} className="space-y-2">
                  <ScanHistoryCard scan={scan} onSelect={setSelectedScan} />
                  <button
                    type="button"
                    onClick={() => setCompareScan(scan)}
                    className="w-full rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200"
                  >
                    Compare with selected
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-4xl border border-white/10 bg-white/5 p-6 text-white">
          {!selectedScan ? (
            <p className="text-slate-400">Select a scan to inspect details.</p>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Selected Scan</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {selectedScan.jobTitle || 'Target role'}
                    {getCompanyLabel(selectedScan) ? ` • ${getCompanyLabel(selectedScan)}` : ''}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {new Date(selectedScan.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-2xl bg-cyan-400 px-4 py-2 text-2xl font-semibold text-slate-950">
                  {selectedScan.score}%
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <TagPanel title="Matched Keywords" items={selectedScan.matchedKeywords || selectedScan.mathKeywords || []} tone="green" />
                <TagPanel title="Missing Keywords" items={selectedScan.missingKeywords || []} tone="amber" />
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <ListPanel title="Warnings" items={selectedScan.warnings || []} />
                <ListPanel title="Suggestions" items={selectedScan.suggestions || []} />
              </div>
            </>
          )}
        </div>
      </div>

      <ScanComparisonDrawer
        current={selectedScan}
        compareWith={compareScan}
        onClose={() => setCompareScan(null)}
      />
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">{value}</h2>
    </div>
  );
}

function TagPanel({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'green' | 'amber';
}) {
  const safeItems: string[] = Array.isArray(items) ? items : [];
  const toneClass =
    tone === 'green'
      ? 'bg-emerald-500/15 text-emerald-300'
      : 'bg-amber-500/15 text-amber-300';

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {safeItems.length === 0 ? (
        <p className="mt-3 text-slate-400">No items available.</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {safeItems.map((item: string) => (
            <span key={item} className={`rounded-full px-3 py-1 text-xs font-medium ${toneClass}`}>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  const safeItems: string[] = Array.isArray(items) ? items : [];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {safeItems.length === 0 ? (
        <p className="mt-3 text-slate-400">No items available.</p>
      ) : (
        <ul className="mt-4 space-y-3 text-sm text-slate-200">
          {safeItems.map((item: string, index: number) => (
            <li key={`${item}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}