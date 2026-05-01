import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIResumeForm from '../components/ai/AIResumeForm';
import { buildResumeApi } from '../api/ai';
import { createResumeApi } from '../api/resumes';
import type { BuildResumePayload, BuildResumeResponse } from '../types/ai';
import type { ResumePayload } from '../api/resumes';
import { getAccessToken } from '../lib/token';
import { useAuth } from '../hooks/useAuth';
import { getApiErrorMessage } from '../lib/apiError';
import { cleanText, cleanTextList, normalizeTemplateId } from '../lib/resume';

function normalizeBullets(items: string[] = []) {
  return cleanTextList(items);
}

function normalizeResult(result: BuildResumeResponse): BuildResumeResponse {
  return {
    ...result,
    template: normalizeTemplateId(result.template),
    personalInfo: {
      fullname: cleanText(result.personalInfo?.fullname),
      email: cleanText(result.personalInfo?.email),
      phone: cleanText(result.personalInfo?.phone),
      location: cleanText(result.personalInfo?.location),
      linkedin: cleanText(result.personalInfo?.linkedin),
      github: cleanText(result.personalInfo?.github),
      portfolio: cleanText(result.personalInfo?.portfolio),
    },
    summary: cleanText(result.summary),
    skills: cleanTextList(result.skills),
    experience: Array.isArray(result.experience)
      ? result.experience.map((item) => ({
          company: cleanText(item.company),
          role: cleanText(item.role),
          startDate: cleanText(item.startDate),
          endDate: cleanText(item.endDate),
          description: normalizeBullets(item.description),
        }))
      : [],
    projects: Array.isArray(result.projects)
      ? result.projects.map((item) => ({
          title: cleanText(item.title),
          description: normalizeBullets(item.description),
          link: cleanText(item.link),
        }))
      : [],
    education: Array.isArray(result.education)
      ? result.education.map((item) => ({
          institution: cleanText(item.institution),
          degree: cleanText(item.degree),
          startDate: cleanText(item.startDate),
          endDate: cleanText(item.endDate),
          score: cleanText(item.score),
        }))
      : [],
    certifications: cleanTextList(result.certifications),
    achievements: cleanTextList(result.achievements),
    extracurriculars: cleanTextList(result.extracurriculars),
    coursework: cleanTextList(result.coursework),
  };
}

export default function AIResumeBuilder() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<BuildResumeResponse | null>(null);
  const navigate = useNavigate();
  const { loading: authLoading, isAuthenticated } = useAuth();

  const handleGenerate = async (payload: BuildResumePayload) => {
    try {
      setLoading(true);
      setStatus('');
      setError('');
      const res = await buildResumeApi(payload);
      setResult(normalizeResult(res.data));
      setStatus('Complete AI resume generated successfully.');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to generate full AI resume.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDashboard = async () => {
    if (!result) return;

    if (authLoading) {
      setError('Authentication is still loading. Please wait a moment and try again.');
      return;
    }

    if (!isAuthenticated || !getAccessToken()) {
      setError('Your session is missing or expired. Please log in again.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setStatus('');

      const payload: ResumePayload = {
        title: cleanText(result.title) || 'AI Generated Resume',
        template: normalizeTemplateId(result.template),
        mode: result.mode === 'professional' ? 'professional' : 'student',
        personalInfo: {
          fullname: cleanText(result.personalInfo?.fullname),
          email: cleanText(result.personalInfo?.email),
          phone: cleanText(result.personalInfo?.phone),
          location: cleanText(result.personalInfo?.location),
          linkedin: cleanText(result.personalInfo?.linkedin),
          github: cleanText(result.personalInfo?.github),
          portfolio: cleanText(result.personalInfo?.portfolio),
        },
        summary: cleanText(result.summary),
        skills: cleanTextList(result.skills || []),
        experience: Array.isArray(result.experience)
          ? result.experience
              .map((item) => ({
                company: cleanText(item.company),
                role: cleanText(item.role),
                startDate: cleanText(item.startDate),
                endDate: cleanText(item.endDate) || 'Present',
                description: normalizeBullets(item.description || []),
              }))
              .filter(
                (item) =>
                  item.company ||
                  item.role ||
                  item.startDate ||
                  item.endDate ||
                  item.description.length
              )
          : [],
        education: Array.isArray(result.education)
          ? result.education
              .map((item) => ({
                institution: cleanText(item.institution),
                degree: cleanText(item.degree),
                startDate: cleanText(item.startDate),
                endDate: cleanText(item.endDate),
                score: cleanText(item.score),
              }))
              .filter(
                (item) =>
                  item.institution ||
                  item.degree ||
                  item.startDate ||
                  item.endDate ||
                  item.score
              )
          : [],
        projects: Array.isArray(result.projects)
          ? result.projects
              .map((item) => ({
                title: cleanText(item.title),
                description: normalizeBullets(item.description || []),
                link: cleanText(item.link),
              }))
              .filter((item) => item.title || item.link || item.description.length)
          : [],
        certifications: cleanTextList(result.certifications || []),
        achievements: cleanTextList(result.achievements || []),
        extracurriculars: cleanTextList(result.extracurriculars || []),
        coursework: cleanTextList(result.coursework || []),
      };

      if (
        !payload.title ||
        !payload.personalInfo.fullname ||
        !payload.personalInfo.email ||
        !payload.personalInfo.phone ||
        !payload.personalInfo.location
      ) {
        setError('Missing required resume fields before saving.');
        return;
      }

      const created = await createResumeApi(payload);
      setStatus(created.message || 'AI resume saved to dashboard successfully.');

      const createdId = created?.data?._id;
      if (createdId) {
        navigate(`/builder?id=${createdId}`);
        return;
      }

      navigate('/resumes');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to save AI resume.'));
      console.error('AI RESUME SAVE ERROR:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-7 text-white shadow-[0_24px_80px_rgba(2,8,23,0.28)]">
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">AI Resume Builder</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Generate Full Job-Ready Resume</h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-300">
          Build a complete resume with recruiter-friendly summary, ATS-ready skills, dynamic work
          experience, projects, education, and certifications.
        </p>
      </div>

      {!!status && (
        <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          {status}
        </div>
      )}

      {!!error && (
        <div className="mb-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <AIResumeForm loading={loading} onSubmit={handleGenerate} />

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-white">
          <h2 className="text-2xl font-semibold">Generated Resume Preview</h2>

          {!result ? (
            <p className="mt-4 text-sm text-slate-400">
              Fill in your details and generate a full AI resume preview.
            </p>
          ) : (
            <div className="mt-5 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Title</p>
                <h3 className="mt-2 text-2xl font-semibold">{result.title}</h3>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Personal Info</p>
                <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-300">
                  <p>{result.personalInfo?.fullname}</p>
                  {result.personalInfo?.email ? <p>{result.personalInfo.email}</p> : null}
                  {result.personalInfo?.phone ? <p>{result.personalInfo.phone}</p> : null}
                  {result.personalInfo?.location ? <p>{result.personalInfo.location}</p> : null}
                  {result.personalInfo?.linkedin ? <p>{result.personalInfo.linkedin}</p> : null}
                  {result.personalInfo?.github ? <p>{result.personalInfo.github}</p> : null}
                  {result.personalInfo?.portfolio ? <p>{result.personalInfo.portfolio}</p> : null}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Summary</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">{result.summary}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Skills</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(result.skills || []).map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs text-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Experience</p>
                <div className="mt-3 space-y-3">
                  {(result.experience || []).map((item, index) => (
                    <div
                      key={`${item.company}-${index}`}
                      className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                    >
                      <h4 className="font-semibold text-white">
                        {item.role || 'Role'} · {item.company || 'Company'}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.startDate || 'Start'} - {item.endDate || 'End'}
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        {normalizeBullets(item.description).map((bullet, bulletIndex) => (
                          <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Projects</p>
                <div className="mt-3 space-y-3">
                  {(result.projects || []).map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                    >
                      <h4 className="font-semibold text-white">{item.title || 'Project'}</h4>
                      {item.link ? <p className="mt-1 text-xs text-cyan-300">{item.link}</p> : null}
                      <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        {normalizeBullets(item.description).map((bullet, bulletIndex) => (
                          <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Education</p>
                <div className="mt-3 space-y-3">
                  {(result.education || []).map((item, index) => (
                    <div
                      key={`${item.institution}-${index}`}
                      className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                    >
                      <h4 className="font-semibold text-white">{item.degree}</h4>
                      <p className="mt-1 text-sm text-slate-300">{item.institution}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.startDate} - {item.endDate}
                      </p>
                      {item.score ? <p className="mt-1 text-xs text-slate-400">{item.score}</p> : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <MiniList title="Certifications" items={result.certifications || []} />
                <MiniList title="Achievements" items={result.achievements || []} />
                <MiniList title="Coursework" items={result.coursework || []} />
                <MiniList title="Extracurriculars" items={result.extracurriculars || []} />
              </div>

              <button
                type="button"
                disabled={saving || authLoading}
                onClick={handleSaveToDashboard}
                className="rounded-xl bg-cyan-400 px-5 py-3 font-medium text-slate-950 disabled:opacity-60"
              >
                {saving ? 'Saving to dashboard...' : 'Save Full Resume to Dashboard'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{title}</p>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">No items.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
