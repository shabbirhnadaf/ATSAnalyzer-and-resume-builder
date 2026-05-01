import { api } from './axios';
import type {
  AtsAnalysisPayload,
  AtsAnalysisResponse,
  BuildResumePayload,
  BuildResumeResponse,
  GenerateProjectPayload,
  GenerateProjectResponse,
  ImproveExperiencePayload,
  ImproveExperienceResponse,
  ImproveSummaryPayload,
  ImproveSummaryResponse,
  TailorResumePayload,
  TailorResumeResponse,
} from '../types/ai';

export async function improveSummaryApi(payload: ImproveSummaryPayload) {
  const res = await api.post<{ success: boolean; message: string; data: ImproveSummaryResponse }>(
    '/ai/improve-summary',
    payload
  );
  return res.data;
}

export async function improveExperienceApi(payload: ImproveExperiencePayload) {
  const res = await api.post<{ success: boolean; message: string; data: ImproveExperienceResponse }>(
    '/ai/improve-experience',
    payload
  );
  return res.data;
}

export async function generateProjectApi(payload: GenerateProjectPayload) {
  const res = await api.post<{ success: boolean; message: string; data: GenerateProjectResponse }>(
    '/ai/generate-project',
    payload
  );
  return res.data;
}

export async function tailorResumeApi(payload: TailorResumePayload) {
  const res = await api.post<{ success: boolean; message: string; data: TailorResumeResponse }>(
    '/ai/tailor-resume',
    payload
  );
  return res.data;
}

export async function buildResumeApi(payload: BuildResumePayload) {
  const res = await api.post<{ success: boolean; message: string; data: BuildResumeResponse }>(
    '/ai/build-resume',
    payload
  );
  return res.data;
}

export async function atsAnalysisApi(payload: AtsAnalysisPayload) {
  const res = await api.post<{ success: boolean; message: string; data: AtsAnalysisResponse }>(
    '/ai/ats-analysis',
    payload
  );
  return res.data;
}
