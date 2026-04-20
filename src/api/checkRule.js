import { request } from './request';
export async function listCheckRules(params = {}) {
    const res = await request('/admin/CheckRuleController/list', {
        method: 'POST',
        data: params
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '获取打卡规则列表失败');
    }
    return res.data;
}
export async function addCheckRule(data) {
    const res = await request('/admin/CheckRuleController/create', {
        method: 'POST',
        data
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '新增打卡规则失败');
    }
}
export async function editCheckRule(id, data) {
    const res = await request('/admin/CheckRuleController/update', {
        method: 'POST',
        data: { id, ...data }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '编辑打卡规则失败');
    }
}
export async function detailCheckRule(id) {
    const res = await request('/admin/CheckRuleController/detail', {
        method: 'GET',
        data: { id }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '获取打卡规则详情失败');
    }
    return res.data;
}
export async function deleteCheckRule(id) {
    const res = await request('/admin/CheckRuleController/delete', {
        method: 'POST',
        data: { id }
    });
    if (res.code !== 1) {
        throw new Error(res.msg || '删除打卡规则失败');
    }
}
//# sourceMappingURL=checkRule.js.map