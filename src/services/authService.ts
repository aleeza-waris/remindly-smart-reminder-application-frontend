import apiClient from '../lib/axios';
import type { LoginFormValues, RegisterFormValues } from '../schemas/authSchema';
import type { ApiResponse, AuthenticationData } from '../types/api';
import type { DashboardUser } from '../types/dashboard';
import { getBrowserTimeZone } from '../lib/timeZone';

export const login = async (values: LoginFormValues) => {
  const response = await apiClient.post<ApiResponse<AuthenticationData>>('/auth/login', {
    email: values.email,
    password: values.password,
    timezone: getBrowserTimeZone(),
  });

  return response.data.data;
};

export const register = async (values: RegisterFormValues) => {
  const response = await apiClient.post<ApiResponse<AuthenticationData>>('/auth/register', {
    name: values.name,
    email: values.email,
    password: values.password,
    timezone: getBrowserTimeZone(),
  });

  return response.data.data;
};

export const signInWithGoogle = async (credential: string) => {
  const response = await apiClient.post<ApiResponse<AuthenticationData>>('/auth/google', {
    credential,
    timezone: getBrowserTimeZone(),
  });

  return response.data.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get<ApiResponse<{ user: DashboardUser }>>('/auth/me');
  return response.data.data.user;
};

export const logout = async () => {
  await apiClient.post<ApiResponse<null>>('/auth/logout');
};
