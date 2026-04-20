import { request } from './request';
export async function listImageResources(params = {}) {
    const res = await request('/admin/UploadController/list', {
        method: 'POST',
        data: params
    });
    return res.data;
}
export async function uploadImage(params) {
    const formData = new FormData();
    formData.append('file', params.file);
    if (params.type !== undefined)
        formData.append('type', params.type.toString());
    if (params.name)
        formData.append('name', params.name);
    if (params.sort !== undefined)
        formData.append('sort', params.sort.toString());
    const res = await request('/admin/UploadController/image', {
        method: 'POST',
        data: formData
    });
    return res.data;
}
export async function deleteImageResource(id) {
    const res = await request('/admin/UploadController/delete', {
        method: 'POST',
        data: { id }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '删除失败');
    }
}
//# sourceMappingURL=imageResource.js.map