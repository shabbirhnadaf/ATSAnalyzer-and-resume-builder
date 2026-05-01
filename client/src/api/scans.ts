import { api } from './axios';

export type ScanPayload = {
  resumeId?: string;
  resumeText: string;
  jobDescription: string;
  jobTitle?: string;
  companyName?: string;
};

export type ScanResult = {
  _id: string;
  resume?: string;
  jobTitle: string;
  companyName?: string;
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  priorityFixes: string[];
  roleFitSummary: string;
  createdAt?: string;
  updatedAt?: string;
  historyId: string;
};

export type ScanHistoryRecord = {
  _id: string;
  resume?: string;
  jobTitle: string;
  companyName?: string;
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  priorityFixes: string[];
  roleFitSummary: string;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const createScanApi = async (payload: ScanPayload) => {
  const response = await api.post<ApiResponse<ScanResult>>('/scans', payload);
  return response.data;
};

export const getResumeScansApi = async (resumeId: string) => {
  const response = await api.get<ApiResponse<ScanHistoryRecord[]>>(`/scans/resume/${resumeId}`);
  return response.data;
};

export const getScanHistoryApi = async () => {
  const response = await api.get<ApiResponse<ScanHistoryRecord[]>>('/scans/history');
  return response.data;
};
