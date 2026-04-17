import { request } from './request';

export interface EventItem {
  id: number;
  event_name: string;
  event_image: string;
  event_time: string;
  is_top: number;
  user_id: number;
  is_admin?: boolean;
  create_time: string;
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

export async function deleteEvent(id: number): Promise<void> {
  const res = await request<ApiResult>('/admin/EventController/delete', {
    method: 'POST',
    data: { id }
  });

  if (res.code !== 1) {
    throw new Error(res.msg || '删除事件失败');
  }
}
