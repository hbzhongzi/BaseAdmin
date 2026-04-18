import { request } from './request';

export interface ImageResourceItem {
  id: number;
  url: string;
  name: string;
  type: number;
  size: number;
  user_id: number;
  create_time: string;
}

export interface ImageResourceListResponse {
  list: ImageResourceItem[];
  total: number;
  page: number;
  page_size: number;
}

export async function listImageResources(params: Record<string, unknown> = {}): Promise<ImageResourceListResponse> {
  const res = await request<{ code: number; msg: string; data: ImageResourceListResponse }>('/admin/UploadController/list', {
    method: 'POST',
    data: params
  });
  return res.data;
}
