import type { Directive } from 'vue';
import { hasPermission } from '../auth/session';

/**
 * v-permission="'user:delete'"
 * 权限在当前管理员上下文中不存在时移除节点。
 * 服务端仍必须执行同名权限校验，该指令只负责前端体验。
 */
export const permissionDirective: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    const permission = String(binding.value || '');
    if (permission && !hasPermission(permission)) {
      el.remove();
    }
  },
};
