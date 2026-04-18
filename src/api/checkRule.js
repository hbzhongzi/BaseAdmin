import { request } from './request';
export async function listCheckRules(params = {}) {
    const res = await request('/admin/CheckRuleController/list', {
        method: 'POST',
        data: params
    });
    return res.data;
}
//# sourceMappingURL=checkRule.js.map