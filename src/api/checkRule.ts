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

export interface ApiResult<T = any> {
  code: number;
  msg: string;
  data: T;
}

export async function listCheckRules(params: Record<string, unknown> = {}): Promise<CheckRuleListResponse> {
  const res = await request<ApiResult<CheckRuleListResponse>>('/admin/CheckRuleController/list', {
    method: 'POST',
    data: params
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '获取打卡规则列表失败');
  }

  return res.data;
}

export async function addCheckRule(data: Partial<CheckRuleItem>): Promise<void> {
  const res = await request<ApiResult>('/admin/CheckRuleController/create', {
    method: 'POST',
    data
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '新增打卡规则失败');
  }
}

export async function editCheckRule(id: number, data: Partial<CheckRuleItem>): Promise<void> {
  const res = await request<ApiResult>('/admin/CheckRuleController/update', {
    method: 'POST',
    data: { id, ...data }
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '编辑打卡规则失败');
  }
}


export async function deleteCheckRule(id: number): Promise<void> {
  const res = await request<ApiResult>('/admin/CheckRuleController/delete', {
    method: 'POST',
    data: { id }
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '删除打卡规则失败');
  }
}