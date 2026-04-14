import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Pencil, Plus, Trash2 } from 'lucide-react';
import { deleteResumeApi, duplicateResumeApi, getResumesApi } from '../api/resumes';
import type { ResumeRecord } from '../api/resumes';

export default function Resumes() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const res = await getResumesApi();
      setResumes(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteResumeApi(id);
    setResumes((prev) => prev.filter((item) => item._id !== id));
  };

  const handleDuplicate = async (id: string) => {
    await duplicateResumeApi(id);
    loadResumes();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Documents</p>
          <h1 className="mt-2 text-4xl font-semibold">My Resumes</h1>
          <p className="mt-2 text-slate-400">Create multiple resumes for internships, fresher roles, and experienced positions.</p>
        </div>

        <Link
          to="/builder"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-medium text-slate-950"
        >
          <Plus size={18} />
          Create Resume
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">Loading resumes...</div>
      ) : resumes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-2xl font-semibold">No resumes yet</h2>
          <p className="mt-3 text-slate-400">Start with a student, internship, fresher, or professional resume template.</p>
          <Link
            to="/builder"
            className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-medium text-slate-950"
          >
            Build your first resume
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {resumes.map((resume) => (
            <article key={resume._id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{resume.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Template: {resume.template} · Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                  <p className="mt-3 text-sm text-slate-300">
                    {resume.personalInfo.fullName} · {resume.personalInfo.email}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/builder?id=${resume._id}`}
                    className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => handleDuplicate(resume._id)}
                    className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="rounded-lg border border-white/10 p-2 text-rose-300 hover:bg-rose-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {resume.skills.slice(0, 6).map((skill) => (
                  <span key={skill} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}