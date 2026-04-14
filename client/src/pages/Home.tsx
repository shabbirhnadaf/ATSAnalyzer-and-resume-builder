import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">AI-Powered Resume Builder</p>
          <h1 className="text-5xl font-semibold leading-tight md:text-7xl">
            Build ATS-ready resumes with a sharper workflow.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Create resumes, switch templates, scan job descriptions, and improve keyword relevance
            through a polished workspace for students, freshers, and experienced professionals.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register" className="rounded-xl bg-cyan-400 px-6 py-3 font-medium text-slate-950">
              Get started
            </Link>
            <Link to="/templates" className="rounded-xl border border-white/15 px-6 py-3 font-medium">
              Explore templates
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}