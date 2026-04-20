import { request } from './request';
export async function listCheckTypes(params = {}) {
    const res = await request('/admin/CheckTypeController/list', {
        method: 'POST',
        data: params
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '获取打卡类型列表失败');
    }
    return res.data;
}
export async function addCheckType(data) {
    const res = await request('/admin/CheckTypeController/create', {
        method: 'POST',
        data
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '新增打卡类型失败');
    }
}
export async function editCheckType(id, data) {
    const res = await request('/admin/CheckTypeController/update', {
        method: 'POST',
        data: { id, ...data }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '编辑打卡类型失败');
    }
}
export async function detailCheckType(id) {
    const res = await request('/admin/CheckTypeController/detail', {
        method: 'POST',
        data: { id }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '获取打卡类型详情失败');
    }
    return res.data;
}
export async function deleteCheckType(id) {
    const res = await request('/admin/CheckTypeController/delete', {
        method: 'POST',
        data: { id }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '删除打卡类型失败');
    }
}
export async function changeCheckTypeStatus(id, status) {
    const res = await request('/admin/CheckTypeController/changeStatus', {
        method: 'POST',
        data: { id, status }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '修改状态失败');
    }
}
//# sourceMappingURL=checkType.js.map