import { useMemo, useState } from 'react';

type ImproveSummaryPayload = {
  summary: string;
  jobTitle?: string;
  tone?: 'professional' | 'confident' | 'concise';
};

type ImproveExperiencePayload = {
  jobTitle: string;
  company?: string;
  bullets: string[];
  targetRole?: string;
};

type GenerateProjectPayload = {
  projectName: string;
  techStack: string[];
  projectType?: string;
  targetRole?: string;
};

type TailorResumePayload = {
  resumeText: string;
  jobDescription: string;
};

type Props = {
  onImproveSummary: (payload: ImproveSummaryPayload) => Promise<void>;
  onImproveExperience: (payload: ImproveExperiencePayload) => Promise<void>;
  onGenerateProject: (payload: GenerateProjectPayload) => Promise<void>;
  onTailorResume: (payload: TailorResumePayload) => Promise<void>;
  loading: boolean;
};

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitCommaValues(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AIPromptPanel({
  onImproveSummary,
  onImproveExperience,
  onGenerateProject,
  onTailorResume,
  loading,
}: Props) {
  const [summary, setSummary] = useState('');
  const [summaryJobTitle, setSummaryJobTitle] = useState('');
  const [summaryTone, setSummaryTone] = useState<'professional' | 'confident' | 'concise'>(
    'professional'
  );

  const [experienceJobTitle, setExperienceJobTitle] = useState('');
  const [experienceCompany, setExperienceCompany] = useState('');
  const [experienceTargetRole, setExperienceTargetRole] = useState('');
  const [experienceBullets, setExperienceBullets] = useState('');

  const [projectName, setProjectName] = useState('');
  const [projectTechStack, setProjectTechStack] = useState('');
  const [projectType, setProjectType] = useState('');
  const [projectTargetRole, setProjectTargetRole] = useState('');

  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const [localError, setLocalError] = useState('');

  const experienceBulletList = useMemo(() => splitLines(experienceBullets), [experienceBullets]);
  const techStackList = useMemo(() => splitCommaValues(projectTechStack), [projectTechStack]);

  const handleImproveSummary = async () => {
    setLocalError('');

    if (summary.trim().length < 20) {
      setLocalError('Summary must be at least 20 characters.');
      return;
    }

    await onImproveSummary({
      summary: summary.trim(),
      jobTitle: summaryJobTitle.trim() || undefined,
      tone: summaryTone,
    });
  };

  const handleImproveExperience = async () => {
    setLocalError('');

    if (experienceJobTitle.trim().length < 2) {
      setLocalError('Experience job title is required.');
      return;
    }

    if (experienceBulletList.length === 0) {
      setLocalError('Add at least one experience bullet, one per line.');
      return;
    }

    await onImproveExperience({
      jobTitle: experienceJobTitle.trim(),
      company: experienceCompany.trim() || undefined,
      targetRole: experienceTargetRole.trim() || undefined,
      bullets: experienceBulletList,
    });
  };

  const handleGenerateProject = async () => {
    setLocalError('');

    if (projectName.trim().length < 2) {
      setLocalError('Project name is required.');
      return;
    }

    if (techStackList.length === 0) {
      setLocalError('Add at least one technology in tech stack.');
      return;
    }

    await onGenerateProject({
      projectName: projectName.trim(),
      techStack: techStackList,
      projectType: projectType.trim() || undefined,
      targetRole: projectTargetRole.trim() || undefined,
    });
  };

  const handleTailorResume = async () => {
    setLocalError('');

    if (resumeText.trim().length < 50) {
      setLocalError('Resume text must be at least 50 characters.');
      return;
    }

    if (jobDescription.trim().length < 50) {
      setLocalError('Job description must be at least 50 characters.');
      return;
    }

    await onTailorResume({
      resumeText: resumeText.trim(),
      jobDescription: jobDescription.trim(),
    });
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 text-white">
      <div>
        <h2 className="text-2xl font-semibold">AI Assistant</h2>
        <p className="mt-2 text-sm text-slate-400">
          Generate resume-ready suggestions from your existing content.
        </p>
      </div>

      {localError && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
          {localError}
        </div>
      )}

      <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
        <h3 className="font-medium text-cyan-300">Improve Summary</h3>

        <input
          value={summaryJobTitle}
          onChange={(e) => setSummaryJobTitle(e.target.value)}
          placeholder="Target job title"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />

        <select
          value={summaryTone}
          onChange={(e) =>
            setSummaryTone(e.target.value as 'professional' | 'confident' | 'concise')
          }
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        >
          <option value="professional">Professional</option>
          <option value="confident">Confident</option>
          <option value="concise">Concise</option>
        </select>

        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Paste summary"
          rows={5}
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />

        <button
          type="button"
          disabled={loading}
          onClick={handleImproveSummary}
          className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-60"
        >
          {loading ? 'Working...' : 'Improve summary'}
        </button>
      </div>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
        <h3 className="font-medium text-cyan-300">Improve Experience</h3>

        <input
          value={experienceJobTitle}
          onChange={(e) => setExperienceJobTitle(e.target.value)}
          placeholder="Current job title"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />

        <input
          value={experienceCompany}
          onChange={(e) => setExperienceCompany(e.target.value)}
          placeholder="Company (optional)"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />

        <input
          value={experienceTargetRole}
          onChange={(e) => setExperienceTargetRole(e.target.value)}
          placeholder="Target role (optional)"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />

        <textarea
          value={experienceBullets}
          onChange={(e) => setExperienceBullets(e.target.value)}
          placeholder={`One bullet per line
Built reusable UI components for admin dashboard
Improved page load performance by optimizing API calls
Collaborated with backend team on secure authentication flow`}
          rows={6}
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />

        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
          Parsed bullets: {experienceBulletList.length}
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleImproveExperience}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-100 disabled:opacity-60"
        >
          {loading ? 'Working...' : 'Improve experience'}
        </button>
      </div>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
        <h3 className="font-medium text-cyan-300">Generate Project</h3>

        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />

        <input
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          placeholder="Project type (optional)"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />

        <input
          value={projectTargetRole}
          onChange={(e) => setProjectTargetRole(e.target.value)}
          placeholder="Target role (optional)"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />

        <input
          value={projectTechStack}
          onChange={(e) => setProjectTechStack(e.target.value)}
          placeholder="React, Node.js, MongoDB"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />

        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
          Parsed technologies: {techStackList.length}
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleGenerateProject}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-100 disabled:opacity-60"
        >
          {loading ? 'Working...' : 'Generate project bullets'}
        </button>
      </div>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
        <h3 className="font-medium text-cyan-300">Tailor Resume</h3>

        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste full resume text"
          rows={6}
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description"
          rows={6}
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />

        <button
          type="button"
          disabled={loading}
          onClick={handleTailorResume}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-100 disabled:opacity-60"
        >
          {loading ? 'Working...' : 'Tailor resume'}
        </button>
      </div>
    </div>
  );
}