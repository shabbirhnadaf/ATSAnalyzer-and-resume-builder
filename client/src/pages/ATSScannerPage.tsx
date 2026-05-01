import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getResumesApi, type ResumeRecord } from '../api/resumes';
import { createScanApi, getResumeScansApi, type ScanHistoryRecord } from '../api/scans';
import { getApiErrorMessage } from '../lib/apiError';
import { buildResumePlainText } from '../lib/resume';

export default function ATSScannerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState(searchParams.get('resumeId') || '');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [currentScan, setCurrentScan] = useState<ScanHistoryRecord | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryRecord[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadResumes = async () => {
      try {
        setLoadingResumes(true);
        setError('');
        const response = await getResumesApi();
        const items = response.data || [];
        setResumes(items);

        if (!selectedResumeId && items.length > 0) {
          const firstId = items[0]._id;
          setSelectedResumeId(firstId);
          setSearchParams({ resumeId: firstId });
        }
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, 'Failed to load resumes.'));
      } finally {
        setLoadingResumes(false);
      }
    };

    void loadResumes();
  }, [selectedResumeId, setSearchParams]);

  useEffect(() => {
    if (!selectedResumeId) {
      setScanHistory([]);
      return;
    }

    const loadHistory = async () => {
      try {
        setLoadingHistory(true);
        setError('');
        const response = await getResumeScansApi(selectedResumeId);
        setScanHistory(response.data || []);
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, 'Failed to load scan history.'));
      } finally {
        setLoadingHistory(false);
      }
    };

    void loadHistory();
  }, [selectedResumeId]);

  const selectedResume = useMemo(
    () => resumes.find((resume) => resume._id === selectedResumeId) || null,
    [resumes, selectedResumeId]
  );

  const handleScan = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedResumeId) {
      setError('Please select a resume.');
      return;
    }

    if (!selectedResume) {
      setError('Selected resume not found.');
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      setError('Please paste a longer job description.');
      return;
    }

    const resumeText = buildResumePlainText(selectedResume);
    if (!resumeText || resumeText.length < 50) {
      setError('Resume content is too short to scan.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setStatus('');

      const response = await createScanApi({
        resumeId: selectedResumeId,
        resumeText,
        jobDescription,
        jobTitle,
        companyName,
      });

      const optimisticScan: ScanHistoryRecord = {
        _id: response.data.historyId,
        resume: selectedResumeId,
        jobTitle: response.data.jobTitle || jobTitle,
        companyName: response.data.companyName || companyName,
        score: response.data.score,
        matchedKeywords: response.data.matchedKeywords,
        missingKeywords: response.data.missingKeywords,
        strengths: response.data.strengths,
        priorityFixes: response.data.priorityFixes,
        roleFitSummary: response.data.roleFitSummary,
        createdAt: response.data.createdAt || new Date().toISOString(),
        updatedAt: response.data.updatedAt || new Date().toISOString(),
      };

      setCurrentScan(optimisticScan);
      setScanHistory((prev) => [optimisticScan, ...prev]);
      setStatus('ATS scan completed successfully.');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to scan resume.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-6 shadow-2xl">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">ATS Scanner</p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">
              Match your existing resume to the role
            </h1>
            <p className="mt-4 max-w-3xl text-slate-300">
              Select one of your saved resumes, compare it against a job description, and focus on
              only the signals that matter most: fit summary, strongest matches, gaps, and top fixes.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {selectedResumeId ? (
              <Link
                to={`/resume-preview/${selectedResumeId}`}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-100"
              >
                Preview Resume
              </Link>
            ) : null}

            <Link
              to="/scan-history"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-100"
            >
              Scan History
            </Link>
          </div>
        </div>
      </div>

      {!!status && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          {status}
        </div>
      )}

      {!!error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <form
          onSubmit={handleScan}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-white"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-200">Select Resume</label>
              <select
                value={selectedResumeId}
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedResumeId(value);
                  setSearchParams({ resumeId: value });
                  setCurrentScan(null);
                  setStatus('');
                  setError('');
                }}
                disabled={loadingResumes}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
              >
                <option value="">Choose a saved resume</option>
                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.title || 'Untitled Resume'} - {resume.personalInfo?.fullname || 'No name'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Job Title</label>
              <input
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
                placeholder="Frontend Developer"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Company</label>
              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="Acme Inc"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-200">Job Description</label>
              <textarea
                rows={14}
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || loadingResumes}
            className="mt-6 rounded-2xl bg-cyan-400 px-6 py-3 font-medium text-slate-950 disabled:opacity-60"
          >
            {submitting ? 'Scanning...' : 'Run ATS Scan'}
          </button>
        </form>

        <div className="space-y-6">
          <ScanResultPanel scan={currentScan} />

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Scan History</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Previous scans</h2>
              </div>
            </div>

            {loadingHistory ? (
              <div className="mt-5 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-2xl bg-white/5" />
                ))}
              </div>
            ) : scanHistory.length === 0 ? (
              <p className="mt-5 text-slate-400">No scans yet for this resume.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {scanHistory.map((scan) => (
                  <button
                    type="button"
                    key={scan._id}
                    onClick={() => setCurrentScan(scan)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-white">
                          {scan.jobTitle || 'Untitled role'}
                          {scan.companyName ? ` · ${scan.companyName}` : ''}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {new Date(scan.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${scoreBadgeClass(scan.score)}`}>
                        {scan.score}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScanResultPanel({ scan }: { scan: ScanHistoryRecord | null }) {
  if (!scan) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Current Result</p>
        <h2 className="mt-2 text-2xl font-semibold">No scan selected</h2>
        <p className="mt-3 text-slate-400">Run a scan or choose one from history.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-white">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Current Result</p>
          <h2 className="mt-2 text-2xl font-semibold">
            {scan.jobTitle || 'Target role'}
            {scan.companyName ? ` · ${scan.companyName}` : ''}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {scan.roleFitSummary || 'ATS scan complete.'}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-400">Match Score</p>
          <div className={`mt-2 inline-flex rounded-2xl px-4 py-2 text-2xl font-semibold ${scoreBadgeClass(scan.score)}`}>
            {scan.score}%
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <KeywordBox title="Matched Keywords" items={scan.matchedKeywords} tone="green" />
        <KeywordBox title="Missing Keywords" items={scan.missingKeywords} tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ListBlock title="Strengths" items={scan.strengths} />
        <ListBlock title="Priority Fixes" items={scan.priorityFixes} />
      </div>
    </div>
  );
}

function KeywordBox({
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
        <p className="mt-3 text-sm text-slate-400">No items available.</p>
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

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-slate-400">No items generated.</p>
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

function scoreBadgeClass(score: number) {
  if (score >= 75) return 'bg-emerald-500/15 text-emerald-300';
  if (score >= 50) return 'bg-amber-500/15 text-amber-300';
  return 'bg-rose-500/15 text-rose-300';
}
