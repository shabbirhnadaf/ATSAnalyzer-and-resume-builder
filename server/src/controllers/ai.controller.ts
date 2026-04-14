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
  const data = await buildResumeAI(req.body);
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