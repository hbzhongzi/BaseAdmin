import { request } from './request';

export interface UserItem {
  id: number;
  user_name: string;
  user_image: string;
  is_follow: number;
  status: number;
  is_vip: number;
  create_time: string;
}

export interface UserListResponse {
  list: UserItem[];
  total: number;
  page: number;
  page_size: number;
}

export async function listUsers(params: Record<string, unknown> = {}): Promise<UserListResponse> {
  const res = await request<{ code: number; msg: string; data: UserListResponse }>('/admin/UserController/list', {
    method: 'POST',
    data: params
  });
  return res.data;
}
