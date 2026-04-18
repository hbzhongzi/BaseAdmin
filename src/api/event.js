import { request } from './request';
export async function listEvents(params = {}) {
    const res = await request('/admin/EventController/list', {
        method: 'POST',
        data: params
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '获取事件列表失败');
    }
    return res.data;
}
export async function addEvent(data) {
    const res = await request('/admin/EventController/add', {
        method: 'POST',
        data
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '新增事件失败');
    }
}
export async function editEvent(id, data) {
    const res = await request('/admin/EventController/edit', {
        method: 'POST',
        data: { id, ...data }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '编辑事件失败');
    }
}
export async function detailEvent(id) {
    const res = await request('/admin/EventController/detail', {
        method: 'POST',
        data: { id }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '获取事件详情失败');
    }
    return res.data;
}
export async function deleteEvent(id) {
    const res = await request('/admin/EventController/delete', {
        method: 'POST',
        data: { id }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '删除事件失败');
    }
}
export async function uploadImage(file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', String(options.type ?? 1));
    formData.append('name', String(options.name ?? ''));
    formData.append('sort', String(options.sort ?? 0));
    const res = await request('/admin/UploadController/image', {
        method: 'POST',
        data: formData,
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '上传图片失败');
    }
    return res.data;
}
//# sourceMappingURL=event.js.map