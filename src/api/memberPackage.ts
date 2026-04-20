import { request } from './request';

export interface MemberPackageItem {
  id: number;
  original_price: number;
  now_price: number;
  discount: number;
  combo: number;
  combo_text: string;
  status: number;
  status_text: string;
  sort: number;
  create_time: string;
}

export interface MemberPackageListResponse {
  list: MemberPackageItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface ApiResult<T = any> {
  code: number;
  msg: string;
  data: T;
}

export async function listMemberPackages(params: Record<string, unknown> = {}): Promise<MemberPackageListResponse> {
  const res = await request<ApiResult<MemberPackageListResponse>>('/admin/MemberPackageController/list', {
    method: 'POST',
    data: params
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '获取会员套餐列表失败');
  }

  return res.data;
}

export async function addMemberPackage(data: Partial<MemberPackageItem>): Promise<void> {
  const res = await request<ApiResult>('/admin/MemberPackageController/create', {
    method: 'POST',
    data
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '新增会员套餐失败');
  }
}

export async function editMemberPackage(id: number, data: Partial<MemberPackageItem>): Promise<void> {
  const res = await request<ApiResult>('/admin/MemberPackageController/update', {
    method: 'POST',
    data: { id, ...data }
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '编辑会员套餐失败');
  }
}


export async function deleteMemberPackage(id: number): Promise<void> {
  const res = await request<ApiResult>('/admin/MemberPackageController/delete', {
    method: 'POST',
    data: { id }
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '删除会员套餐失败');
  }
}

export async function changeMemberPackageStatus(id: number, status: number): Promise<void> {
  const res = await request<ApiResult>('/admin/MemberPackageController/changeStatus', {
    method: 'POST',
    data: { id, status }
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '修改状态失败');
  }
}