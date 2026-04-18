import { request } from './request';

export interface CheckRuleItem {
  id: number;
  name: string;
  type: number;
  type_text: string;
  frequency: number;
  week_days: string;
  week_days_arr: number[];
  creat_user_id: number;
  start_time: string;
  end_time: string;
  create_time: string;
}

export interface CheckRuleListResponse {
  list: CheckRuleItem[];
  total: number;
  page: number;
  page_size: number;
}

export async function listCheckRules(params: Record<string, unknown> = {}): Promise<CheckRuleListResponse> {
  const res = await request<{ code: number; msg: string; data: CheckRuleListResponse }>('/admin/CheckRuleController/list', {
    method: 'POST',
    data: params
  });
  return res.data;
}