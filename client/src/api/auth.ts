import { api } from "./axios";
import type { AuthResponse, meResponse } from "../types/auth";

export const registerApi = async( payload: {
    name: string,
    email: string,
    password: string
}) => {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
}

export const loginApi = async( payload: {
    email: string,
    password: string
}) => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
}

export const logoutApi = async() => {
    const { data } = await api.post('/auth/logout');
    return data;
}

export const meApi = async () => {
    const { data } = await api.get<meResponse>('/auth/me');
    return data;
}

export const refreshApi = async () => {
    const { data } = await api.post<AuthResponse>('/auth/refresh');
    return data;
}