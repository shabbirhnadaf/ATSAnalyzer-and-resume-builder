import { api } from './axios';

export type ResumePayload = {
  title: string;
  template: string;
  mode: 'student' | 'professional' | 'fresher' | 'experienced' | 'career-switch';
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
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    score?: string;
  }[];
  projects: {
    title: string;
    description: string[];
    link?: string;
  }[];
  certifications: string[];
  achievements: string[];
  extracurriculars: string[];
  coursework: string[];
};

export interface ResumeRecord extends ResumePayload {
  _id: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getResumesApi = async () => {
  const { data } = await api.get<ApiResponse<ResumeRecord[]>>('/resumes');
  return data;
};

export const getResumeByIdApi = async (id: string) => {
  const { data } = await api.get<ApiResponse<ResumeRecord>>(`/resumes/${id}`);
  return data;
};

export const createResumeApi = async (payload: ResumePayload) => {
  const { data } = await api.post<ApiResponse<ResumeRecord>>('/resumes', payload);
  return data;
};

export const updateResumeApi = async (id: string, payload: ResumePayload) => {
  const { data } = await api.put<ApiResponse<ResumeRecord>>(`/resumes/${id}`, payload);
  return data;
};

export const deleteResumeApi = async (id: string) => {
  const { data } = await api.delete<ApiResponse<null>>(`/resumes/${id}`);
  return data;
};

export const duplicateResumeApi = async (id: string) => {
  const { data } = await api.post<ApiResponse<ResumeRecord>>(`/resumes/${id}/duplicate`);
  return data;
};
