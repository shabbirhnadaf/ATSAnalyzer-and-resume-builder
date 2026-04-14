import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  deleteResumeApi,
  duplicateResumeApi,
  getResumesApi,
  type ResumeRecord,
} from '../api/resumes';

export default function Dashboard() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const navigate = useNavigate();

  const stats = useMemo(() => {
    const total = resumes.length;
    const withProjects = resumes.filter((item) => (item.projects?.length || 0) > 0).length;
    const withExperience = resumes.filter((item) => (item.experience?.length || 0) > 0).length;
    return { total, withProjects, withExperience };
  }, [resumes]);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getResumesApi();
      setResumes(response.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load resumes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this resume?');
    if (!confirmed) return;

    try {
      setActionLoadingId(id);
      setStatus('');
      setError('');
      await deleteResumeApi(id);
      setResumes((prev) => prev.filter((item) => item._id !== id));
      setStatus('Resume deleted successfully.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete resume.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      setActionLoadingId(id);
      setStatus('');
      setError('');
      const response = await duplicateResumeApi(id);
      const duplicated = response.data;
      setResumes((prev) => [duplicated, ...prev]);
      setStatus('Resume duplicated successfully.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to duplicate resume.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-6 shadow-2xl">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Resume Workspace</p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Manage your resume library</h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Create role-specific resumes, polish them for ATS readability, preview before export, and keep multiple versions ready for different applications.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/ai-resume-builder')}
                className="rounded-2xl bg-cyan-400 px-6 py-3 font-medium text-slate-950"
              >
                Create Resume
              </button>

              <Link
                to="/scan-history"
                className="rounded-2xl border border-white/10 px-6 py-3 font-medium text-white"
              >
                Scan History
              </Link>

              <Link
                to="/ai-resume-builder"
                className="rounded-2xl border border-white/10 px-6 py-3 font-medium text-white"
              >
                AI Resume Builder
              </Link>

              <Link
                to="/ai-ats-analysis"
                className="rounded-2xl border border-white/10 px-6 py-3 font-medium text-white"
              >
                AI ATS Analysis
              </Link>
            </div>

            <Link
              to="/settings"
              className="rounded-2xl border border-white/10 px-6 py-3 font-medium text-white"
            >
              Profile / Settings
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Total resumes" value={stats.total} />
          <StatCard label="With projects" value={stats.withProjects} />
          <StatCard label="With experience" value={stats.withExperience} />
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

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              loading={actionLoadingId === resume._id}
              onDelete={() => handleDelete(resume._id)}
              onDuplicate={() => handleDuplicate(resume._id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <p className="text-sm text-slate-400">{label}</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">{value}</h2>
    </div>
  );
}

function ResumeCard({
  resume,
  loading,
  onDelete,
  onDuplicate,
}: {
  resume: ResumeRecord;
  loading: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const updatedAt = new Date(resume.updatedAt).toLocaleDateString();
  const educationCount = resume.education?.length || 0;
  const experienceCount = resume.experience?.length || 0;
  const projectCount = resume.projects?.length || 0;
  const skillsCount = resume.skills?.length || 0;

  return (
    <article className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-5 text-white transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            {resume.template || 'modern'}
          </p>
          <h2 className="mt-2 line-clamp-2 text-2xl font-semibold">
            {resume.title || 'Untitled Resume'}
          </h2>
        </div>

        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
          Updated {updatedAt}
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
        <p className="font-medium text-white">
          {resume.personalInfo?.fullname || 'No name added'}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          {resume.personalInfo?.email || 'No email added'}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MiniMetric label="Education" value={educationCount} />
        <MiniMetric label="Experience" value={experienceCount} />
        <MiniMetric label="Projects" value={projectCount} />
        <MiniMetric label="Skills" value={skillsCount} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/builder?id=${resume._id}`}
          className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950"
        >
          Edit
        </Link>

        <Link
          to={`/resume-preview/${resume._id}`}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-100"
        >
          Preview
        </Link>

        <Link
          to={`/ats-scanner?resumeId=${resume._id}`}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-100"
        >
          ATS Scan
        </Link>

        <button
          type="button"
          onClick={onDuplicate}
          disabled={loading}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 disabled:opacity-60"
        >
          {loading ? 'Working...' : 'Duplicate'}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={loading}
          className="rounded-xl border border-rose-500/20 px-4 py-2 text-sm text-rose-200 disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-4xl border border-dashed border-white/15 bg-white/5 px-6 py-16 text-center text-white">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-400/10 text-4xl">
        📄
      </div>
      <h2 className="mt-6 text-3xl font-semibold">No resumes yet</h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-400">
        Build your first resume, preview the final version, and export it as a polished ATS-friendly PDF.
      </p>
      <Link
        to="/builder"
        className="mt-7 inline-flex rounded-2xl bg-cyan-400 px-6 py-3 font-medium text-slate-950"
      >
        Create your first resume
      </Link>
    </div>
  );
}