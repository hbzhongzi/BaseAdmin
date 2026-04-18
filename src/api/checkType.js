import { request } from './request';
export async function listCheckTypes(params = {}) {
    const res = await request('/admin/CheckTypeController/list', {
        method: 'POST',
        data: params
    });
    return res.data;
}
//# sourceMappingURL=checkType.js.map