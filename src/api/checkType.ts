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

export interface ApiResult<T = any> {
  code: number;
  msg: string;
  data: T;
}

export async function listCheckTypes(params: Record<string, unknown> = {}): Promise<CheckTypeListResponse> {
  const res = await request<ApiResult<CheckTypeListResponse>>('/admin/CheckTypeController/list', {
    method: 'POST',
    data: params
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '获取打卡类型列表失败');
  }

  return res.data;
}

export async function addCheckType(data: Partial<CheckTypeItem>): Promise<void> {
  const res = await request<ApiResult>('/admin/CheckTypeController/create', {
    method: 'POST',
    data
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '新增打卡类型失败');
  }
}

export async function editCheckType(id: number, data: Partial<CheckTypeItem>): Promise<void> {
  const res = await request<ApiResult>('/admin/CheckTypeController/update', {
    method: 'POST',
    data: { id, ...data }
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '编辑打卡类型失败');
  }
}

export async function detailCheckType(id: number): Promise<CheckTypeItem> {
  const res = await request<ApiResult<CheckTypeItem>>('/admin/CheckTypeController/detail', {
    method: 'POST',
    data: { id }
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '获取打卡类型详情失败');
  }

  return res.data;
}

export async function deleteCheckType(id: number): Promise<void> {
  const res = await request<ApiResult>('/admin/CheckTypeController/delete', {
    method: 'POST',
    data: { id }
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '删除打卡类型失败');
  }
}

export async function changeCheckTypeStatus(id: number, status: number): Promise<void> {
  const res = await request<ApiResult>('/admin/CheckTypeController/changeStatus', {
    method: 'POST',
    data: { id, status }
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '修改状态失败');
  }
}
