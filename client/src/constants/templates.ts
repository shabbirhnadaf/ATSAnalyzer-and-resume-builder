export type ResumeTemplateId = 'modern' | 'minimal' | 'executive' | 'graduate';

export type ResumeTemplateConfig = {
  id: ResumeTemplateId;
  name: string;
  description: string;
  badge: string;
  accent: string;
  surface: string;
};

export const defaultTemplateId: ResumeTemplateId = 'modern';

export const resumeTemplates: ResumeTemplateConfig[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Balanced ATS-friendly layout for most roles',
    badge: 'Popular',
    accent: 'from-cyan-500 to-sky-500',
    surface: 'border-cyan-400/30 bg-cyan-500/10',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and recruiter-friendly single-column design',
    badge: 'ATS Safe',
    accent: 'from-slate-700 to-slate-900',
    surface: 'border-slate-400/20 bg-white/5',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Stronger hierarchy for experienced professionals',
    badge: 'Pro',
    accent: 'from-violet-500 to-fuchsia-500',
    surface: 'border-violet-400/30 bg-violet-500/10',
  },
  {
    id: 'graduate',
    name: 'Graduate',
    description: 'Great for students, freshers, and project-heavy resumes',
    badge: 'Fresher',
    accent: 'from-emerald-500 to-teal-500',
    surface: 'border-emerald-400/30 bg-emerald-500/10',
  },
];