import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getResumesApi, type ResumeRecord } from '../api/resumes';
import { getScanHistoryApi, getResumeScansApi, type ScanHistoryRecord } from '../api/scans';
import ScanComparisonDrawer from '../components/scans/ScanComparisonDrawer';
import ScanHistoryCard from '../components/scans/ScanHistoryCard';
import { getApiErrorMessage } from '../lib/apiError';

export default function ScanHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState(searchParams.get('resumeId') || 'all');
  const [scans, setScans] = useState<ScanHistoryRecord[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanHistoryRecord | null>(null);
  const [compareScan, setCompareScan] = useState<ScanHistoryRecord | null>(null);
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

        const items = response.data || [];
        setScans(items);
        setSelectedScan(items[0] || null);
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, 'Failed to load scan history.'));
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
    return Math.round(scans.reduce((acc, item) => acc + item.score, 0) / scans.length);
  }, [scans]);

  const bestScore = useMemo(() => {
    if (!scans.length) return 0;
    return Math.max(...scans.map((item) => item.score));
  }, [scans]);

  const totalPriorityFixes = useMemo(
    () => scans.reduce((acc, item) => acc + item.priorityFixes.length, 0),
    [scans]
  );

  return (
    <section className="space-y-8">
      <div className="rounded-4xl border border-white/10 bg-linear-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-6 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Scan History</p>
        <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Track ATS improvements</h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Review scan attempts over time, compare score changes, and focus on the gaps and fixes
          that actually move resume quality forward.
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
          onChange={(event) => {
            const value = event.target.value;
            setSelectedResumeId(value);
            setSearchParams(value === 'all' ? {} : { resumeId: value });
            setCompareScan(null);
          }}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
        >
          <option value="all">All resumes</option>
          {resumes.map((resume) => (
            <option key={resume._id} value={resume._id}>
              {resume.title || 'Untitled Resume'} - {resume.personalInfo?.fullname || 'No name'}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-4xl border border-white/10 bg-white/5 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">All scans</h2>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {totalPriorityFixes} fixes tracked
            </span>
          </div>

          {loading ? (
            <div className="mt-5 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : scans.length === 0 ? (
            <p className="mt-5 text-slate-400">No scan history found.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {scans.map((scan) => (
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
                    {selectedScan.companyName ? ` · ${selectedScan.companyName}` : ''}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {new Date(selectedScan.createdAt).toLocaleString()}
                  </p>
                  {!!selectedScan.roleFitSummary && (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                      {selectedScan.roleFitSummary}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-cyan-400 px-4 py-2 text-2xl font-semibold text-slate-950">
                  {selectedScan.score}%
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <TagPanel title="Matched Keywords" items={selectedScan.matchedKeywords} tone="green" />
                <TagPanel title="Missing Keywords" items={selectedScan.missingKeywords} tone="amber" />
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <ListPanel title="Strengths" items={selectedScan.strengths} />
                <ListPanel title="Priority Fixes" items={selectedScan.priorityFixes} />
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
  const toneClass =
    tone === 'green'
      ? 'bg-emerald-500/15 text-emerald-300'
      : 'bg-amber-500/15 text-amber-300';

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-slate-400">No items available.</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
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
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-slate-400">No items available.</p>
      ) : (
        <ul className="mt-4 space-y-3 text-sm text-slate-200">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
