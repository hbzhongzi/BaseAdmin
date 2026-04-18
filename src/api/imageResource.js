import { request } from './request';
export async function listImageResources(params = {}) {
    const res = await request('/admin/UploadController/list', {
        method: 'POST',
        data: params
    });
    return res.data;
}
//# sourceMappingURL=imageResource.js.map