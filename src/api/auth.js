import { request } from './request';
export async function login(params) {
    return request('/admin/AuthController/login', {
        method: 'POST',
        data: params
    });
}
//# sourceMappingURL=auth.js.map