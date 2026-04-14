import { api } from './axios';

export type ScanPayload = {
  resumeId?: string;
  resumeText: string;
  jobDescription: string;
  jobTitle?: string;
  companyName?: string;
};

export type ScanResult = {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  historyId: string;
};

export type ScanHistoryRecord = {
  _id: string;
  user: string;
  resume?: string;
  jobTitle: string;
  company?: string;
  companyName?: string;
  jobDescription: string;
  score: number;
  matchedKeywords?: string[];
  mathKeywords?: string[];
  missingKeywords?: string[];
  suggestions?: string[];
  warnings?: string[];
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