import { api } from './axios';

export type ProfilePayload = {
  name: string;
  email: string;
  selectedTemplate: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
};

export type PasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export interface ProfileRecord extends ProfilePayload {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getProfileApi = async () => {
  const { data } = await api.get<ApiResponse<ProfileRecord>>('/profile');
  return data;
};

export const updateProfileApi = async (payload: ProfilePayload) => {
  const { data } = await api.put<ApiResponse<ProfileRecord>>('/profile', payload);
  return data;
};

export const changePasswordApi = async (payload: PasswordPayload) => {
  const { data } = await api.put<ApiResponse<null>>('/profile/password', payload);
  return data;
};