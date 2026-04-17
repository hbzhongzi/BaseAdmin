import { request } from './request';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  code?: number;
  success?: boolean;
  data?: {
    authadmintoken?: string;
    accessToken?: string;
    token?: string;
    [key: string]: unknown;
  };
  token?: string;
  message?: string;
}

export async function login(params: LoginParams): Promise<LoginResult> {
  return request<LoginResult>('/admin/AuthController/login', {
    method: 'POST',
    data: params
  });
}
