import { z } from 'zod';

const experienceSchema = z.object({
  company: z.string().trim().min(1),
  role: z.string().trim().min(1),
  startDate: z.string().trim().min(1),
  endDate: z.string().trim().optional().default('Present'),
  description: z.array(z.string().trim()).default([]),
});

const educationSchema = z.object({
  institution: z.string().trim().min(1),
  degree: z.string().trim().min(1),
  startDate: z.string().trim().min(1),
  endDate: z.string().trim().min(1),
  score: z.string().trim().optional().default(''),
});

const projectSchema = z.object({
  title: z.string().trim().min(1),
  description: z.array(z.string().trim()).default([]),
  link: z.string().trim().optional().default(''),
});

export const resumeSchema = z.object({
  title: z.string().trim().min(2).max(120),
  template: z.string().trim().min(1),
  mode: z.enum(['student', 'professional', 'fresher', 'experienced', 'career-switch']).default('student'),
  personalInfo: z.object({
    fullname: z.string().trim().min(2),
    email: z.string().trim().email({ message: 'Invalid email' }),
    phone: z.string().trim().min(6),
    location: z.string().trim().min(2),
    linkedin: z.string().trim().optional().default(''),
    github: z.string().trim().optional().default(''),
    portfolio: z.string().trim().optional().default(''),
  }),
  summary: z.string().trim().max(1000).default(''),
  skills: z.array(z.string().trim()).default([]),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(z.string().trim()).default([]),
  achievements: z.array(z.string().trim()).default([]),
  extracurriculars: z.array(z.string().trim()).default([]),
  coursework: z.array(z.string().trim()).default([]),
});
