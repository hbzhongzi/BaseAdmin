import { request } from './request';
export async function listUsers(params = {}) {
    const res = await request('/admin/UserController/list', {
        method: 'POST',
        data: params
    });
    return res.data;
}
//# sourceMappingURL=user.js.map