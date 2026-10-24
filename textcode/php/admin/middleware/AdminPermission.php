<?php

namespace app\admin\middleware;

use app\admin\logic\AdminAccessLogic;

/**
 * 路由/控制器权限中间件。
 * ThinkPHP 路由中可将权限编码作为中间件参数传入。
 */
class AdminPermission
{
    public function handle($request, \Closure $next, ...$permissions)
    {
        $admin = $request->admin_user ?? null;
        $permission = (string)($permissions[0] ?? '');

        if (!$admin) {
            return json(['code' => 401, 'msg' => '请先登录', 'data' => []], 401);
        }

        if ($permission === '') {
            return json(['code' => 403, 'msg' => '无权访问', 'data' => []], 403);
        }

        if (!AdminAccessLogic::can((int)$admin->id, $permission)) {
            return json(['code' => 403, 'msg' => '无权访问', 'data' => []], 403);
        }

        return $next($request);
    }
}
