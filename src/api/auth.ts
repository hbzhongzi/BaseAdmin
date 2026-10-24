import { request, removeAuthToken } from './request';
import { setCurrentAdmin, type CurrentAdmin } from '../auth/session';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  code: number;
  msg: string;
  data?: {
    token?: string;
    expire_time?: number;
  };
}

export interface CurrentAdminResult {
  code: number;
  msg: string;
  data: CurrentAdmin;
}

export async function login(params: LoginParams): Promise<LoginResult> {
  return request<LoginResult>('/api/admin/auth/login', {
    method: 'POST',
    data: params
  });
}

export async function logout(): Promise<void> {
  try {
    await request('/api/admin/auth/logout', { method: 'POST', skipRefresh: true });
  } finally {
    removeAuthToken();
  }
}

export async function getCurrentAdmin(): Promise<CurrentAdmin> {
  const result = await request<CurrentAdminResult>('/api/admin/auth/me');
  setCurrentAdmin(result.data);
  return result.data;
}
