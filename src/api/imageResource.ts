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

export interface UploadImageParams {
  file: File;
  type?: number;
  name?: string;
  sort?: number;
}

export interface UploadImageResponse {
  url: string;
  [key: string]: any;
}

export async function uploadImage(params: UploadImageParams): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append('file', params.file);
  if (params.type !== undefined) formData.append('type', params.type.toString());
  if (params.name) formData.append('name', params.name);
  if (params.sort !== undefined) formData.append('sort', params.sort.toString());

  const res = await request<{ code: number; msg: string; data: UploadImageResponse }>('/admin/UploadController/image', {
    method: 'POST',
    data: formData
  });
  return res.data;
}

export async function deleteImageResource(id: number): Promise<void> {
  const res = await request<{ code: number; msg: string }>('/admin/UploadController/delete', {
    method: 'POST',
    data: { id }
  });
  if (res.code !== 1) {
    throw new Error(res.msg || '删除失败');
  }
}
