import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getResumesApi, type ResumeRecord } from '../api/resumes';
import { createScanApi, getResumeScansApi, type ScanHistoryRecord } from '../api/scans';

type ResumeSectionItem = {
  institution?: string;
  degree?: string;
  score?: string;
  startDate?: string;
  endDate?: string;
  company?: string;
  role?: string;
  title?: string;
  link?: string;
  description?: string[];
};

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
        const items: ResumeRecord[] = response.data || [];
        setResumes(items);

        if (!selectedResumeId && items.length > 0) {
          const firstId = items[0]._id;
          setSelectedResumeId(firstId);
          setSearchParams({ resumeId: firstId });
        }
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : undefined;

        setError(message || 'Failed to load resumes.');
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
        const items: ScanHistoryRecord[] = (response.data || []).map((scan: ScanHistoryRecord) => ({
          ...scan,
          mathKeywords: Array.isArray(scan.mathKeywords) ? scan.mathKeywords : [],
          missingKeywords: Array.isArray(scan.missingKeywords) ? scan.missingKeywords : [],
          warnings: Array.isArray(scan.warnings) ? scan.warnings : [],
          suggestions: Array.isArray(scan.suggestions) ? scan.suggestions : [],
        }));

        setScanHistory(items);
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : undefined;

        setError(message || 'Failed to load scan history.');
      } finally {
        setLoadingHistory(false);
      }
    };

    void loadHistory();
  }, [selectedResumeId]);

  const selectedResume = useMemo(
    () => resumes.find((resume: ResumeRecord) => resume._id === selectedResumeId) || null,
    [resumes, selectedResumeId]
  );

  const buildResumeText = (resume: ResumeRecord | null): string => {
    if (!resume) return '';

    const parts: string[] = [];

    parts.push(resume.title || '');
    parts.push(resume.personalInfo?.fullname || '');
    parts.push(resume.personalInfo?.email || '');
    parts.push(resume.personalInfo?.phone || '');
    parts.push(resume.personalInfo?.location || '');
    parts.push(resume.summary || '');
    parts.push(...(Array.isArray(resume.skills) ? resume.skills : []));
    parts.push(...(Array.isArray(resume.certifications) ? resume.certifications : []));

    (Array.isArray(resume.education) ? resume.education : []).forEach((item: ResumeSectionItem) => {
      parts.push(item.institution || '');
      parts.push(item.degree || '');
      parts.push(item.score || '');
      parts.push(item.startDate || '');
      parts.push(item.endDate || '');
    });

    (Array.isArray(resume.experience) ? resume.experience : []).forEach((item: ResumeSectionItem) => {
      parts.push(item.company || '');
      parts.push(item.role || '');
      parts.push(item.startDate || '');
      parts.push(item.endDate || '');
      parts.push(...(Array.isArray(item.description) ? item.description : []));
    });

    (Array.isArray(resume.projects) ? resume.projects : []).forEach((item: ResumeSectionItem) => {
      parts.push(item.title || '');
      parts.push(item.link || '');
      parts.push(...(Array.isArray(item.description) ? item.description : []));
    });

    return parts.filter((part: string) => Boolean(part)).join(' ');
  };

  const handleResumeChange = (value: string) => {
    setSelectedResumeId(value);
    setSearchParams({ resumeId: value });
    setCurrentScan(null);
    setStatus('');
    setError('');
  };

  const handleScan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    const resumeText = buildResumeText(selectedResume);

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
        user: '',
        resume: selectedResumeId,
        jobTitle,
        companyName,
        score: response.data.score,
        mathKeywords: Array.isArray(response.data.mathKeywords) ? response.data.mathKeywords : [],
        missingKeywords: Array.isArray(response.data.missingKeywords) ? response.data.missingKeywords : [],
        warnings: Array.isArray(response.data.warnings) ? response.data.warnings : [],
        suggestions: Array.isArray(response.data.suggestions) ? response.data.suggestions : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCurrentScan(optimisticScan);
      setScanHistory((prev: ScanHistoryRecord[]) => [optimisticScan, ...prev]);
      setStatus('ATS scan completed successfully.');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;

      setError(message || 'Failed to scan resume.');
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
              Match your resume to the role
            </h1>
            <p className="mt-4 max-w-3xl text-slate-300">
              Compare a saved resume against a job description, inspect matched keywords, review missing terms,
              and track scan history for each tailored resume.
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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleResumeChange(e.target.value)}
                disabled={loadingResumes}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
              >
                <option value="">Choose a saved resume</option>
                {resumes.map((resume: ResumeRecord) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.title || 'Untitled Resume'} — {resume.personalInfo?.fullname || 'No name'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Job Title</label>
              <input
                value={jobTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobTitle(e.target.value)}
                placeholder="Frontend Developer"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Company</label>
              <input
                value={companyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
                placeholder="Acme Inc"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-200">Job Description</label>
              <textarea
                rows={14}
                value={jobDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
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
                {Array.from({ length: 3 }).map((_: unknown, index: number) => (
                  <div key={index} className="h-24 animate-pulse rounded-2xl bg-white/5" />
                ))}
              </div>
            ) : scanHistory.length === 0 ? (
              <p className="mt-5 text-slate-400">No scans yet for this resume.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {scanHistory.map((scan: ScanHistoryRecord) => (
                  <button
                    type="button"
                    key={scan._id}
                    onClick={() => setCurrentScan({
                      ...scan,
                      mathKeywords: Array.isArray(scan.mathKeywords) ? scan.mathKeywords : [],
                      missingKeywords: Array.isArray(scan.missingKeywords) ? scan.missingKeywords : [],
                      warnings: Array.isArray(scan.warnings) ? scan.warnings : [],
                      suggestions: Array.isArray(scan.suggestions) ? scan.suggestions : [],
                    })}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-white">
                          {scan.jobTitle || 'Untitled role'}
                          {scan.companyName ? ` • ${scan.companyName}` : ''}
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

  const mathKeywords: string[] = Array.isArray(scan.mathKeywords) ? scan.mathKeywords : [];
  const missingKeywords: string[] = Array.isArray(scan.missingKeywords) ? scan.missingKeywords : [];
  const warnings: string[] = Array.isArray(scan.warnings) ? scan.warnings : [];
  const suggestions: string[] = Array.isArray(scan.suggestions) ? scan.suggestions : [];

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-white">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Current Result</p>
          <h2 className="mt-2 text-2xl font-semibold">
            {scan.jobTitle || 'Target role'}
            {scan.companyName ? ` • ${scan.companyName}` : ''}
          </h2>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-400">Match Score</p>
          <div className={`mt-2 inline-flex rounded-2xl px-4 py-2 text-2xl font-semibold ${scoreBadgeClass(scan.score)}`}>
            {scan.score}%
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <KeywordBox title="Matched Keywords" items={mathKeywords} tone="green" />
        <KeywordBox title="Missing Keywords" items={missingKeywords} tone="amber" />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-5">
        <h3 className="text-lg font-semibold text-white">Warnings</h3>
        {warnings.length === 0 ? (
          <p className="mt-3 text-slate-400">No warnings generated.</p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            {warnings.map((warning: string, index: number) => (
              <li key={`${warning}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {warning}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-5">
        <h3 className="text-lg font-semibold text-white">Suggestions</h3>
        {suggestions.length === 0 ? (
          <p className="mt-3 text-slate-400">No suggestions generated.</p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            {suggestions.map((suggestion: string, index: number) => (
              <li key={`${suggestion}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {suggestion}
              </li>
            ))}
          </ul>
        )}
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
          {items.map((item: string) => (
            <span key={item} className={`rounded-full px-3 py-1 text-xs font-medium ${toneClass}`}>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function scoreBadgeClass(score: number) {
  if (score >= 75) return 'bg-emerald-500/15 text-emerald-300';
  if (score >= 50) return 'bg-amber-500/15 text-amber-300';
  return 'bg-rose-500/15 text-rose-300';
}