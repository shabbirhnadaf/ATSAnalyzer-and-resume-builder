import { useMemo, useState } from 'react';
import type { BuildResumePayload } from '../../types/ai';

type Props = {
  loading: boolean;
  onSubmit: (payload: BuildResumePayload) => Promise<void>;
};

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitComma(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AIResumeForm({ loading, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState('modern');
  const [mode, setMode] = useState<'student' | 'professional'>('student');

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');

  const [targetRole, setTargetRole] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [projects, setProjects] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [certifications, setCertifications] = useState('');
  const [achievements, setAchievements] = useState('');
  const [extracurriculars, setExtracurriculars] = useState('');
  const [coursework, setCoursework] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');

  const parsedSkills = useMemo(() => splitComma(skills), [skills]);
  const parsedEducation = useMemo(() => splitLines(education), [education]);
  const parsedProjects = useMemo(() => splitLines(projects), [projects]);
  const parsedWorkExperience = useMemo(() => splitLines(workExperience), [workExperience]);
  const parsedCertifications = useMemo(() => splitComma(certifications), [certifications]);
  const parsedAchievements = useMemo(() => splitComma(achievements), [achievements]);
  const parsedExtracurriculars = useMemo(() => splitComma(extracurriculars), [extracurriculars]);
  const parsedCoursework = useMemo(() => splitComma(coursework), [coursework]);

  const handleSubmit = async () => {
    setError('');

    if (fullname.trim().length < 2) {
      setError('Full name is required.');
      return;
    }

    if (targetRole.trim().length < 2) {
      setError('Target role is required.');
      return;
    }

    if (yearsOfExperience.trim().length < 1) {
      setError('Years of experience is required.');
      return;
    }

    if (email.trim().length < 5 || phone.trim().length < 5 || location.trim().length < 2) {
      setError('Email, phone, and location are required for a complete resume.');
      return;
    }

    if (parsedSkills.length === 0) {
      setError('Add at least one skill.');
      return;
    }

    await onSubmit({
      title: title.trim() || undefined,
      template,
      mode,
      personalInfo: {
        fullname: fullname.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        github: github.trim() || undefined,
        portfolio: portfolio.trim() || undefined,
      },
      targetRole: targetRole.trim(),
      yearsOfExperience: yearsOfExperience.trim(),
      skills: parsedSkills,
      education: parsedEducation,
      projects: parsedProjects,
      workExperience: parsedWorkExperience,
      certifications: parsedCertifications,
      achievements: parsedAchievements,
      extracurriculars: parsedExtracurriculars,
      coursework: parsedCoursework,
      jobDescription: jobDescription.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 text-white">
      <div>
        <h2 className="text-2xl font-semibold">AI Resume Builder</h2>
        <p className="mt-2 text-sm text-slate-400">
          Generate a full, ATS-friendly resume with complete sections and job-focused content.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Resume title (optional)"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
        />
        <input
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="Target role"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
        />

        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
        >
          <option value="modern">modern</option>
          <option value="minimal">minimal</option>
          <option value="executive">executive</option>
          <option value="graduate">graduate</option>
        </select>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as 'student' | 'professional')}
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
        >
          <option value="student">student</option>
          <option value="professional">professional</option>
        </select>

        <input
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="Full name"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
        />
        <input
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          placeholder="Years of experience"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
        />
        <input
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="LinkedIn URL"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
        />

        <input
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          placeholder="GitHub URL"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
        />
        <input
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
          placeholder="Portfolio URL"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
        />
      </div>

      <textarea
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        rows={4}
        placeholder="Skills comma separated: React, TypeScript, Tailwind CSS, Node.js, MongoDB"
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
      />

      <textarea
        value={education}
        onChange={(e) => setEducation(e.target.value)}
        rows={4}
        placeholder="Education, one item per line"
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
      />

      <textarea
        value={workExperience}
        onChange={(e) => setWorkExperience(e.target.value)}
        rows={5}
        placeholder="Work experience or internships, one item per line"
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
      />

      <textarea
        value={projects}
        onChange={(e) => setProjects(e.target.value)}
        rows={5}
        placeholder="Projects, one item per line"
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
      />

      <textarea
        value={certifications}
        onChange={(e) => setCertifications(e.target.value)}
        rows={3}
        placeholder="Certifications comma separated"
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
      />

      <textarea
        value={achievements}
        onChange={(e) => setAchievements(e.target.value)}
        rows={3}
        placeholder="Achievements comma separated"
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
      />

      <textarea
        value={extracurriculars}
        onChange={(e) => setExtracurriculars(e.target.value)}
        rows={3}
        placeholder="Extracurriculars comma separated"
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
      />

      <textarea
        value={coursework}
        onChange={(e) => setCoursework(e.target.value)}
        rows={3}
        placeholder="Relevant coursework comma separated"
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
      />

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={8}
        placeholder="Paste target job description for better ATS alignment"
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
      />

      <button
        type="button"
        disabled={loading}
        onClick={handleSubmit}
        className="rounded-xl bg-cyan-400 px-5 py-3 font-medium text-slate-950 disabled:opacity-60"
      >
        {loading ? 'Generating full resume...' : 'Generate Full AI Resume'}
      </button>
    </div>
  );
}
