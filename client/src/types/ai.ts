export type ImproveSummaryPayload = {
  summary: string;
  jobTitle?: string;
  tone?: 'professional' | 'confident' | 'concise';
};

export type ImproveSummaryResponse = {
  suggestion: string;
};

export type ImproveExperiencePayload = {
  jobTitle: string;
  company?: string;
  bullets: string[];
  targetRole?: string;
};

export type ImproveExperienceResponse = {
  suggestions: string[];
};

export type GenerateProjectPayload = {
  projectName: string;
  techStack: string[];
  projectType?: string;
  targetRole?: string;
};

export type GenerateProjectResponse = {
  suggestions: string[];
};

export type TailorResumePayload = {
  resumeText: string;
  jobDescription: string;
};

export type TailorResumeResponse = {
  improvedSummary: string;
  keywordSuggestions: string[];
  missingSkills: string[];
  improvedBullets: string[];
};

export type BuildResumePayload = {
  title?: string;
  template?: string;
  mode?: 'student' | 'professional';
  personalInfo: {
    fullname: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  targetRole: string;
  yearsOfExperience: string;
  skills: string[];
  education?: string[];
  projects?: string[];
  workExperience?: string[];
  certifications?: string[];
  achievements?: string[];
  extracurriculars?: string[];
  coursework?: string[];
  jobDescription?: string;
};

export type BuildResumeResponse = {
  title: string;
  template?: string;
  mode?: 'student' | 'professional';
  personalInfo: {
    fullname: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  skills: string[];
  experience: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;
  projects: Array<{
    title: string;
    description: string[];
    link: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    score: string;
  }>;
  certifications: string[];
  achievements: string[];
  extracurriculars: string[];
  coursework: string[];
};

export type AtsAnalysisPayload = {
  resumeText: string;
  jobDescription: string;
};

export type AtsAnalysisResponse = {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  priorityFixes: string[];
  roleFitSummary: string;
};

export type SkillGapPayload = {
  resumeText: string;
  targetRole?: string;
  jobDescription?: string;
};

export type SkillGapResponse = {
  missingHardSkills: string[];
  missingSoftSkills: string[];
  suggestedKeywords: string[];
  learningPriority: string[];
};
