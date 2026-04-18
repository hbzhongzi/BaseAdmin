import { request } from './request';

export interface EventItem {
  id: number;
  event_name: string;
  event_image: string;
  event_time: string;
  reminder_config?: number[];
  is_top: number;
  user_id: number;
  is_admin?: boolean;
  create_time: string;
}

export interface EventDetail extends EventItem {
  event_time_text?: string;
  is_deuplicate?: number;
  deuplicate_date?: number;
  next_time_text?: string;
  reminder_list?: Array<{ type_code: number; name: string; description: string }>;
  creat_user_id?: number;
  update_time?: number;
}

export interface EventListResponse {
  list: EventItem[];
  total: number;
  page?: number;
  page_size?: number;
}

export interface ApiResult<T = any> {
  code: number;
  msg: string;
  data: T;
}

export async function listEvents(params: Record<string, unknown> = {}): Promise<EventListResponse> {
  const res = await request<ApiResult<EventListResponse>>('/admin/EventController/list', {
    method: 'POST',
    data: params
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '获取事件列表失败');
  }

  return res.data;
}

export async function addEvent(data: Partial<EventItem>): Promise<void> {
  const res = await request<ApiResult>('/admin/EventController/add', {
    method: 'POST',
    data
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '新增事件失败');
  }
}

export async function editEvent(id: number, data: Partial<EventItem>): Promise<void> {
  const res = await request<ApiResult>('/admin/EventController/edit', {
    method: 'POST',
    data: { id, ...data }
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '编辑事件失败');
  }
}

export async function detailEvent(id: number): Promise<EventDetail> {
  const res = await request<ApiResult<EventDetail>>('/admin/EventController/detail', {
    method: 'POST',
    data: { id }
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '获取事件详情失败');
  }

  return res.data;
}

export async function deleteEvent(id: number): Promise<void> {
  const res = await request<ApiResult>('/admin/EventController/delete', {
    method: 'POST',
    data: { id }
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '删除事件失败');
  }
}

export interface UploadResponse {
  id: number;
  url: string;
}

export async function uploadImage(file: File, options: { type?: number; name?: string; sort?: number } = {}): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', String(options.type ?? 1));
  formData.append('name', String(options.name ?? ''));
  formData.append('sort', String(options.sort ?? 0));

  const res = await request<ApiResult<UploadResponse>>('/admin/UploadController/image', {
    method: 'POST',
    data: formData,
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '上传图片失败');
  }

  return res.data;
}
