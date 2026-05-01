import { useEffect, useMemo, useState } from 'react';
import ATSAnalysisCard from '../components/ai/ATSAnalysisCard';
import KeywordGapList from '../components/ai/KeywordGapList';
import { atsAnalysisApi } from '../api/ai';
import { createScanApi } from '../api/scans';
import { getResumesApi, type ResumeRecord } from '../api/resumes';
import * as mammoth from 'mammoth';
import {
  GlobalWorkerOptions,
  getDocument,
} from 'pdfjs-dist/legacy/build/pdf.mjs';
import { getApiErrorMessage } from '../lib/apiError';
import { buildResumePlainText } from '../lib/resume';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

function scoreBand(score: number) {
  if (score >= 80) return 'Strong match';
  if (score >= 60) return 'Moderate match';
  return 'Needs improvement';
}

function sanitizeText(value: string) {
  return value.trim();
}

async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => {
        const candidate = item as { str?: string };
        return typeof candidate.str === 'string' ? candidate.str : '';
      })
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (pageText) pages.push(pageText);
  }

  return pages.join('\n\n').trim();
}

async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.replace(/\n{3,}/g, '\n\n').trim();
}

export default function AIATSAnalysis() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [resumeSourceLabel, setResumeSourceLabel] = useState('');
  const [analysis, setAnalysis] = useState<null | {
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    strengths: string[];
    priorityFixes: string[];
    roleFitSummary: string;
  }>(null);

  const scoreLabel = useMemo(() => scoreBand(analysis?.score || 0), [analysis]);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        setLoadingResumes(true);
        const response = await getResumesApi();
        setResumes(response.data || []);
      } catch {
        setResumes([]);
      } finally {
        setLoadingResumes(false);
      }
    };

    void loadResumes();
  }, []);

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    const lowerName = file.name.toLowerCase();

    if (!lowerName.endsWith('.pdf') && !lowerName.endsWith('.docx')) {
      setError('Please upload a PDF or DOCX resume file.');
      return;
    }

    try {
      setExtracting(true);
      setError('');
      setAnalysis(null);

      let extracted = '';

      if (lowerName.endsWith('.pdf')) {
        extracted = await extractTextFromPdf(file);
      } else {
        extracted = await extractTextFromDocx(file);
      }

      const cleaned = sanitizeText(extracted);

      if (cleaned.length < 50) {
        setError('Could not extract enough text from the uploaded file. Try another file or paste resume text manually.');
        return;
      }

      setSelectedResumeId('');
      setResumeSourceLabel(`Uploaded file: ${file.name}`);
      setUploadedFileName(file.name);
      setResumeText(cleaned);
    } catch {
      setError('Failed to extract text from the uploaded file.');
    } finally {
      setExtracting(false);
    }
  };

  const handleSavedResumeChange = (resumeId: string) => {
    setSelectedResumeId(resumeId);
    setAnalysis(null);
    setError('');
    setUploadedFileName('');

    if (!resumeId) {
      setResumeSourceLabel('');
      return;
    }

    const selectedResume = resumes.find((resume) => resume._id === resumeId);
    if (!selectedResume) return;

    setResumeSourceLabel(`Saved resume: ${selectedResume.title || selectedResume.personalInfo?.fullname || 'Selected resume'}`);
    setResumeText(buildResumePlainText(selectedResume));
    if (!targetRole.trim()) {
      setTargetRole(selectedResume.title || '');
    }
  };

  const handleAnalyze = async () => {
    const cleanResume = sanitizeText(resumeText);
    const cleanJobDescription = sanitizeText(jobDescription);
    const cleanTargetRole = sanitizeText(targetRole);

    if (cleanResume.length < 50) {
      setError('Choose a saved resume, upload a file, or paste a longer resume text before running ATS analysis.');
      return;
    }

    if (cleanJobDescription.length < 50) {
      setError('Paste the full job description before running ATS analysis.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const atsRes = await atsAnalysisApi({
        resumeText: cleanResume,
        jobDescription: cleanJobDescription,
      });

      setAnalysis(atsRes.data);

      await createScanApi({
        resumeId: selectedResumeId || undefined,
        resumeText: cleanResume,
        jobDescription: cleanJobDescription,
        jobTitle: cleanTargetRole || 'ATS Analysis',
        companyName: '',
      });
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to analyze resume.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-7 text-white shadow-[0_24px_80px_rgba(2,8,23,0.28)]">
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">AI ATS Analysis</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Analyze Resume Against a Job Description
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-300">
          Use an existing saved resume, upload a PDF or DOCX, or paste resume text manually to get
          a focused ATS analysis with only the most meaningful signals.
        </p>
      </div>

      {!!error && (
        <div className="mb-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-white shadow-[0_20px_60px_rgba(8,15,30,0.10)]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Use Existing Saved Resume
              </label>
              <select
                value={selectedResumeId}
                onChange={(event) => handleSavedResumeChange(event.target.value)}
                disabled={loadingResumes}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              >
                <option value="">Choose a saved resume</option>
                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.title || 'Untitled Resume'} - {resume.personalInfo?.fullname || 'No name'}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/40 p-5">
              <label className="block text-sm font-medium text-slate-200">
                Upload Resume (PDF or DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(event) => handleFileUpload(event.target.files?.[0] || null)}
                className="mt-3 block w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-medium file:text-slate-950 hover:file:bg-cyan-300"
              />
              <p className="mt-3 text-xs text-slate-400">Supported formats: PDF, DOCX.</p>
              {uploadedFileName ? (
                <p className="mt-2 text-sm text-cyan-300">Loaded file: {uploadedFileName}</p>
              ) : null}
              {extracting ? (
                <p className="mt-2 text-sm text-amber-300">Extracting resume text...</p>
              ) : null}
            </div>

            {resumeSourceLabel ? (
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                {resumeSourceLabel}
              </div>
            ) : null}

            <input
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              placeholder="Target role (optional)"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />

            <textarea
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              rows={12}
              placeholder="Saved or uploaded resume text will appear here, or paste resume text manually"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />

            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              rows={12}
              placeholder="Paste job description"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />

            <button
              type="button"
              disabled={loading || extracting}
              onClick={handleAnalyze}
              className="rounded-xl bg-cyan-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
            >
              {loading ? 'Analyzing...' : 'Run ATS Analysis'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {!analysis ? (
            <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-8 text-slate-300">
              Choose a saved resume, upload one, or paste resume text, then run analysis to see
              score, strongest matches, keyword gaps, and the top fixes worth making next.
            </div>
          ) : (
            <>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 text-white shadow-[0_18px_40px_rgba(2,8,23,0.16)]">
                <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">Overall ATS Score</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-5xl font-semibold tracking-tight">{analysis.score}</h2>
                    <p className="mt-2 text-sm text-slate-400">{scoreLabel}</p>
                  </div>
                  <div className="h-3 w-40 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        analysis.score >= 80
                          ? 'bg-emerald-400'
                          : analysis.score >= 60
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, analysis.score))}%` }}
                    />
                  </div>
                </div>
              </div>

              <ATSAnalysisCard
                score={analysis.score}
                title="Role Fit Summary"
                content={analysis.roleFitSummary}
              />

              <ATSAnalysisCard
                score={analysis.score}
                title="Strengths"
                items={analysis.strengths}
              />

              <ATSAnalysisCard
                score={analysis.score}
                title="Priority Fixes"
                items={analysis.priorityFixes}
              />

              <KeywordGapList title="Matched Keywords" items={analysis.matchedKeywords} />
              <KeywordGapList title="Missing Keywords" items={analysis.missingKeywords} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
