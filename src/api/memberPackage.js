import { request } from './request';
export async function listMemberPackages(params = {}) {
    const res = await request('/admin/MemberPackageController/list', {
        method: 'POST',
        data: params
    });
    return res.data;
}
//# sourceMappingURL=memberPackage.js.map