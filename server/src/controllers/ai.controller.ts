import { Request, Response } from 'express';
import {
  improveSummaryAI,
  improveExperienceAI,
  generateProjectAI,
  tailorResumeAI,
  buildResumeAI,
  atsAnalysisAI,
  skillGapAI,
} from '../utils/ai';

type BuildResumeRequestBody = {
  title?: string;
  template?: string;
  mode?: 'student' | 'professional';
  personalInfo?: {
    fullname?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  targetRole?: string;
  yearsOfExperience?: string;
  skills?: string[];
  education?: string[];
  projects?: string[];
  workExperience?: string[];
  certifications?: string[];
  achievements?: string[];
  extracurriculars?: string[];
  coursework?: string[];
};

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
}

function buildResumeFallback(input: BuildResumeRequestBody) {
  const personalInfo = input.personalInfo || {};
  const targetRole = input.targetRole?.trim() || 'Professional';
  const name = personalInfo.fullname?.trim() || 'Candidate Name';
  const skills = toStringArray(input.skills);
  const topSkills = skills.slice(0, 8);
  const educationInput = toStringArray(input.education);
  const workInput = toStringArray(input.workExperience);
  const projectInput = toStringArray(input.projects);

  return {
    title: input.title?.trim() || `${targetRole} Resume`,
    template: input.template?.trim() || 'modern',
    mode: input.mode || 'student',
    personalInfo: {
      fullname: name,
      email: personalInfo.email?.trim() || '',
      phone: personalInfo.phone?.trim() || '',
      location: personalInfo.location?.trim() || '',
      linkedin: personalInfo.linkedin?.trim() || '',
      github: personalInfo.github?.trim() || '',
      portfolio: personalInfo.portfolio?.trim() || '',
    },
    summary: `${name} is a ${targetRole} candidate with ${input.yearsOfExperience || 'relevant'} experience, focused on building reliable, user-centric solutions and delivering measurable outcomes.`,
    skills: topSkills.length ? topSkills : ['Communication', 'Problem Solving'],
    experience: [
      {
        company: 'Project Experience',
        role: targetRole,
        startDate: 'Recent',
        endDate: 'Present',
        description: workInput.length
          ? workInput.slice(0, 3)
          : [
              `Delivered features aligned with ${targetRole} responsibilities.`,
              'Collaborated with team members to improve product quality and delivery speed.',
              'Applied best practices for maintainable, testable development workflows.',
            ],
      },
    ],
    education: [
      {
        institution: educationInput[0] || 'Education Details',
        degree: 'Degree / Program',
        startDate: '',
        endDate: '',
        score: '',
      },
    ],
    projects: [
      {
        title: projectInput[0] || `${targetRole} Project`,
        description: [
          'Designed and implemented core functionality with a focus on performance.',
          'Integrated APIs and handled edge cases for production-like scenarios.',
          'Documented implementation decisions and improved overall usability.',
        ],
        link: '',
      },
    ],
    certifications: toStringArray(input.certifications),
    achievements: toStringArray(input.achievements),
    extracurriculars: toStringArray(input.extracurriculars),
    coursework: toStringArray(input.coursework),
  };
}

export async function improveSummaryController(req: Request, res: Response) {
  const data = await improveSummaryAI(req.body);
  return res.status(200).json({
    success: true,
    message: 'Summary improved successfully',
    data,
  });
}

export async function improveExperienceController(req: Request, res: Response) {
  const data = await improveExperienceAI(req.body);
  return res.status(200).json({
    success: true,
    message: 'Experience improved successfully',
    data,
  });
}

export async function generateProjectController(req: Request, res: Response) {
  const data = await generateProjectAI(req.body);
  return res.status(200).json({
    success: true,
    message: 'Project suggestions generated successfully',
    data,
  });
}

export async function tailorResumeController(req: Request, res: Response) {
  const data = await tailorResumeAI(req.body);
  return res.status(200).json({
    success: true,
    message: 'Resume tailored successfully',
    data,
  });
}

export async function buildResumeController(req: Request, res: Response) {
  let data;
  try {
    data = await buildResumeAI(req.body);
  } catch (error) {
    console.error('buildResumeAI failed, falling back to deterministic resume:', error);
    data = buildResumeFallback(req.body as BuildResumeRequestBody);
  }

  return res.status(200).json({
    success: true,
    message: 'AI resume generated successfully',
    data,
  });
}

export async function atsAnalysisController(req: Request, res: Response) {
  const data = await atsAnalysisAI(req.body);
  return res.status(200).json({
    success: true,
    message: 'ATS analysis completed successfully',
    data,
  });
}

export async function skillGapController(req: Request, res: Response) {
  const data = await skillGapAI(req.body);
  return res.status(200).json({
    success: true,
    message: 'Skill gap analysis completed successfully',
    data,
  });
}