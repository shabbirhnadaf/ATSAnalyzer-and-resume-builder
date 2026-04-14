import { Request, Response } from 'express';
import Resume from '../models/Resume';
import { success, fail } from '../utils/api';
import mongoose from 'mongoose';

const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const cleanStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.map((item) => clean(item)).filter(Boolean) : [];

const normalizeResumePayload = (body: any) => ({
  title: clean(body.title),
  template: clean(body.template) || 'modern',
  personalInfo: {
    fullname: clean(body.personalInfo?.fullname),
    email: clean(body.personalInfo?.email),
    phone: clean(body.personalInfo?.phone),
    location: clean(body.personalInfo?.location),
    linkedin: clean(body.personalInfo?.linkedin),
    github: clean(body.personalInfo?.github),
    portfolio: clean(body.personalInfo?.portfolio),
  },
  summary: clean(body.summary),
  skills: cleanStringArray(body.skills),
  experience: Array.isArray(body.experience)
    ? body.experience.map((item: any) => ({
        company: clean(item?.company),
        role: clean(item?.role),
        startDate: clean(item?.startDate),
        endDate: clean(item?.endDate) || 'Present',
        description: cleanStringArray(item?.description),
      }))
    : [],
  education: Array.isArray(body.education)
    ? body.education.map((item: any) => ({
        institution: clean(item?.institution),
        degree: clean(item?.degree),
        startDate: clean(item?.startDate),
        endDate: clean(item?.endDate),
        score: clean(item?.score),
      }))
    : [],
  projects: Array.isArray(body.projects)
    ? body.projects.map((item: any) => ({
        title: clean(item?.title),
        description: cleanStringArray(item?.description),
        link: clean(item?.link),
      }))
    : [],
  certifications: cleanStringArray(body.certifications),
});

export const createResume = async (req: Request, res: Response) => {
  try {
    const resume = await Resume.create({
      ...normalizeResumePayload(req.body),
      user: req.user?.id,
    });

    res.status(201).json(success(resume, 'Resume created successfully'));
  } catch (error: any) {
    console.error('CREATE RESUME ERROR:', error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json(
        fail(
          Object.values(error.errors)
            .map((e) => e.message)
            .join(', ') || 'Validation failed'
        )
      );
    }
    
    return res.status(500).json(fail('Failed to create resume'));
  }
};

export const getResumes = async (req: Request, res: Response) => {
  const resumes = await Resume.find({ user: req.user?.id }).sort({ updatedAt: -1 });
  res.json(success(resumes, 'Resumes fetched successfully'));
};

export const getResumeById = async (req: Request, res: Response) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user?.id });
  if (!resume) return res.status(404).json(fail('Resume not found!'));
  res.json(success(resume, 'Resume fetched successfully'));
};

export const updateResume = async (req: Request, res: Response) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.id },
      { $set: normalizeResumePayload(req.body) },
      { new: true, runValidators: true }
    );

    if (!resume) return res.status(404).json(fail('Resume not found!'));
    res.json(success(resume, 'Resume updated successfully'));
  } catch (error: any) {
    console.error('UPDATE RESUME ERROR:', error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json(
        fail(
          Object.values(error.errors)
            .map((e) => e.message)
            .join(', ') || 'Validation failed'
        )
      );
    }

    return res.status(500).json(fail('Failed to update resume'));
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user?.id });

  if (!resume) return res.status(404).json(fail('Resume not found!'));
  res.json(success(resume, 'Resume Deleted successfully'));
};

export const duplicateResume = async (req: Request, res: Response) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user?.id });

  if (!resume) return res.status(404).json(fail('Resume not found!'));

  const original = resume.toObject();

  const cloned = await Resume.create({
    ...normalizeResumePayload(original),
    title: `${resume.title} copy`,
    user: req.user?.id,
  });

  res.status(201).json(success(cloned, 'Resume Duplicated successfully'));
};