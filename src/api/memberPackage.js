import { request } from './request';
export async function listMemberPackages(params = {}) {
    const res = await request('/admin/MemberPackageController/list', {
        method: 'POST',
        data: params
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '获取会员套餐列表失败');
    }
    return res.data;
}
export async function addMemberPackage(data) {
    const res = await request('/admin/MemberPackageController/create', {
        method: 'POST',
        data
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '新增会员套餐失败');
    }
}
export async function editMemberPackage(id, data) {
    const res = await request('/admin/MemberPackageController/update', {
        method: 'POST',
        data: { id, ...data }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '编辑会员套餐失败');
    }
}
export async function detailMemberPackage(id) {
    const res = await request('/admin/MemberPackageController/detail', {
        method: 'GET',
        data: { id }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '获取会员套餐详情失败');
    }
    return res.data;
}
export async function deleteMemberPackage(id) {
    const res = await request('/admin/MemberPackageController/delete', {
        method: 'POST',
        data: { id }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '删除会员套餐失败');
    }
}
export async function changeMemberPackageStatus(id, status) {
    const res = await request('/admin/MemberPackageController/changeStatus', {
        method: 'POST',
        data: { id, status }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '修改状态失败');
    }
}
//# sourceMappingURL=memberPackage.js.map