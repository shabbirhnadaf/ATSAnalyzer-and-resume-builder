import { defaultTemplateId, resumeTemplates, type ResumeTemplateId } from '../constants/templates';
import type { ResumeRecord } from '../api/resumes';
import type { ResumeFormValues } from '../types/resume';

const supportedTemplates = new Set<ResumeTemplateId>(resumeTemplates.map((template) => template.id));

export function cleanText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function cleanTextList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => cleanText(item)).filter(Boolean) : [];
}

export function normalizeTemplateId(value: unknown): ResumeTemplateId {
  const template = cleanText(value).toLowerCase();

  if (template === 'professional') return 'executive';
  if (supportedTemplates.has(template as ResumeTemplateId)) return template as ResumeTemplateId;

  return defaultTemplateId;
}

export function normalizeResumeRecordToFormValues(resume: ResumeRecord): ResumeFormValues {
  return {
    title: cleanText(resume.title),
    template: normalizeTemplateId(resume.template),
    mode:
      resume.mode === 'professional' ||
      resume.mode === 'student' ||
      resume.mode === 'fresher' ||
      resume.mode === 'experienced' ||
      resume.mode === 'career-switch'
        ? resume.mode
        : 'student',
    personalInfo: {
      fullname: cleanText(resume.personalInfo?.fullname),
      email: cleanText(resume.personalInfo?.email),
      phone: cleanText(resume.personalInfo?.phone),
      location: cleanText(resume.personalInfo?.location),
      linkedin: cleanText(resume.personalInfo?.linkedin),
      github: cleanText(resume.personalInfo?.github),
      portfolio: cleanText(resume.personalInfo?.portfolio),
    },
    summary: cleanText(resume.summary),
    skills: cleanTextList(resume.skills),
    experience: Array.isArray(resume.experience)
      ? resume.experience.map((item) => ({
          company: cleanText(item?.company),
          role: cleanText(item?.role),
          startDate: cleanText(item?.startDate),
          endDate: cleanText(item?.endDate),
          description: cleanTextList(item?.description),
        }))
      : [],
    education: Array.isArray(resume.education)
      ? resume.education.map((item) => ({
          institution: cleanText(item?.institution),
          degree: cleanText(item?.degree),
          startDate: cleanText(item?.startDate),
          endDate: cleanText(item?.endDate),
          score: cleanText(item?.score),
        }))
      : [],
    projects: Array.isArray(resume.projects)
      ? resume.projects.map((item) => ({
          title: cleanText(item?.title),
          description: cleanTextList(item?.description),
          link: cleanText(item?.link),
        }))
      : [],
    certifications: cleanTextList(resume.certifications),
    achievements: cleanTextList(resume.achievements),
    extracurriculars: cleanTextList(resume.extracurriculars),
    coursework: cleanTextList(resume.coursework),
  };
}

export function buildResumePlainText(resume: Pick<
  ResumeRecord,
  'title' | 'summary' | 'skills' | 'certifications' | 'achievements' | 'extracurriculars' | 'coursework' | 'personalInfo' | 'education' | 'experience' | 'projects'
>): string {
  const parts: string[] = [
    cleanText(resume.title),
    cleanText(resume.personalInfo?.fullname),
    cleanText(resume.personalInfo?.email),
    cleanText(resume.personalInfo?.phone),
    cleanText(resume.personalInfo?.location),
    cleanText(resume.personalInfo?.linkedin),
    cleanText(resume.personalInfo?.github),
    cleanText(resume.personalInfo?.portfolio),
    cleanText(resume.summary),
    ...cleanTextList(resume.skills),
    ...cleanTextList(resume.certifications),
    ...cleanTextList(resume.achievements),
    ...cleanTextList(resume.extracurriculars),
    ...cleanTextList(resume.coursework),
  ];

  for (const item of Array.isArray(resume.education) ? resume.education : []) {
    parts.push(
      cleanText(item?.institution),
      cleanText(item?.degree),
      cleanText(item?.score),
      cleanText(item?.startDate),
      cleanText(item?.endDate)
    );
  }

  for (const item of Array.isArray(resume.experience) ? resume.experience : []) {
    parts.push(
      cleanText(item?.company),
      cleanText(item?.role),
      cleanText(item?.startDate),
      cleanText(item?.endDate),
      ...cleanTextList(item?.description)
    );
  }

  for (const item of Array.isArray(resume.projects) ? resume.projects : []) {
    parts.push(
      cleanText(item?.title),
      cleanText(item?.link),
      ...cleanTextList(item?.description)
    );
  }

  return parts.filter(Boolean).join(' ');
}
