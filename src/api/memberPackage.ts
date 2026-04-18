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

export async function listMemberPackages(params: Record<string, unknown> = {}): Promise<MemberPackageListResponse> {
  const res = await request<{ code: number; msg: string; data: MemberPackageListResponse }>('/admin/MemberPackageController/list', {
    method: 'POST',
    data: params
  });
  return res.data;
}