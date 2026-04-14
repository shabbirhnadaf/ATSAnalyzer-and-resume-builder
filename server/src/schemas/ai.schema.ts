import { z } from 'zod';

export const improveSummarySchema = z.object({
  summary: z.string().min(20).max(2000),
  jobTitle: z.string().min(2).max(120).optional(),
  tone: z.enum(['professional', 'confident', 'concise']).optional(),
});

export const improveExperienceSchema = z.object({
  jobTitle: z.string().min(2).max(120),
  company: z.string().min(2).max(120).optional(),
  bullets: z.array(z.string().min(3).max(300)).min(1).max(10),
  targetRole: z.string().min(2).max(120).optional(),
});

export const generateProjectSchema = z.object({
  projectName: z.string().min(2).max(120),
  techStack: z.array(z.string().min(1).max(50)).min(1).max(12),
  projectType: z.string().min(2).max(120).optional(),
  targetRole: z.string().min(2).max(120).optional(),
});

export const tailorResumeSchema = z.object({
  resumeText: z.string().min(50).max(20000),
  jobDescription: z.string().min(50).max(12000),
});

export const buildResumeSchema = z.object({
  title: z.string().min(2).max(160).optional(),
  template: z.string().min(2).max(80).optional(),
  mode: z.enum(['student', 'professional']).optional(),

  personalInfo: z.object({
    fullname: z.string().min(2).max(120),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().min(5).max(30).optional().or(z.literal('')),
    location: z.string().min(2).max(120).optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    portfolio: z.string().url().optional().or(z.literal('')),
  }),

  targetRole: z.string().min(2).max(120),
  yearsOfExperience: z.string().min(1).max(50),
  skills: z.array(z.string().min(1).max(50)).min(1).max(40),
  education: z.array(z.string().min(2).max(500)).max(12).optional().default([]),
  projects: z.array(z.string().min(2).max(700)).max(12).optional().default([]),
  workExperience: z.array(z.string().min(2).max(700)).max(20).optional().default([]),
  certifications: z.array(z.string().min(2).max(200)).max(20).optional().default([]),
  achievements: z.array(z.string().min(2).max(200)).max(20).optional().default([]),
  extracurriculars: z.array(z.string().min(2).max(200)).max(20).optional().default([]),
  coursework: z.array(z.string().min(2).max(200)).max(20).optional().default([]),
  jobDescription: z.string().max(12000).optional(),
});

export const atsAnalysisSchema = z.object({
  resumeText: z.string().min(50).max(20000),
  jobDescription: z.string().min(50).max(12000),
});

export const skillGapSchema = z.object({
  resumeText: z.string().min(50).max(20000),
  targetRole: z.string().min(2).max(120).optional(),
  jobDescription: z.string().min(50).max(12000).optional(),
});

export type ImproveSummaryInput = z.infer<typeof improveSummarySchema>;
export type ImproveExperienceInput = z.infer<typeof improveExperienceSchema>;
export type GenerateProjectInput = z.infer<typeof generateProjectSchema>;
export type TailorResumeInput = z.infer<typeof tailorResumeSchema>;
export type BuildResumeInput = z.infer<typeof buildResumeSchema>;
export type AtsAnalysisInput = z.infer<typeof atsAnalysisSchema>;
export type SkillGapInput = z.infer<typeof skillGapSchema>;