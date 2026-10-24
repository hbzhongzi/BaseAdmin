import { request } from './request';

export interface AdminPermission {
  id: number;
  code: string;
  name: string;
  type: string;
  path: string;
  status: number;
  create_time: number;
}

interface PermissionListResult {
  code: number;
  msg: string;
  data: { items: AdminPermission[] };
}

export async function listPermissions(): Promise<AdminPermission[]> {
  const result = await request<PermissionListResult>('/api/admin/permissions');
  return result.data?.items ?? [];
}
