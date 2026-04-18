import { request } from './request';

export interface CheckTypeItem {
  id: number;
  check_type_name: string;
  check_image: string;
  default_rule_id: number;
  type_source: number;
  user_id: number;
  status: number;
  create_time: string;
  update_time: string;
}

export interface CheckTypeListResponse {
  list: CheckTypeItem[];
  total: number;
  page: number;
  page_size: number;
}

export async function listCheckTypes(params: Record<string, unknown> = {}): Promise<CheckTypeListResponse> {
  const res = await request<{ code: number; msg: string; data: CheckTypeListResponse }>('/admin/CheckTypeController/list', {
    method: 'POST',
    data: params
  });
  return res.data;
}
