<?php

namespace app\admin\middleware;

use app\admin\model\AdminUserModel;
use app\admin\logic\AdminAccessLogic;
class AdminAuth
{
    public function handle($request, \Closure $next)
    {
        $auth = $request->header('authorization');

        if (!$auth) {
            $rawToken = $request->header('authadmintoken');
            if ($rawToken) {
                $auth = 'Bearer ' . $rawToken;
            }
        }

        if (!$auth || stripos($auth, 'Bearer ') !== 0) {
            return json(['code' => 401, 'msg' => '请先登录', 'data' => []], 401);
        }
        $token = trim(substr($auth, 7));

        if ($token === '' || strlen($token) > 128) {
            return json(['code' => 401, 'msg' => '登录已失效', 'data' => []], 401);
        }

        $admin = AdminUserModel::where('api_token', $token)
                               ->where('token_expire_time', '>', time())
                               ->where('status', 1)
                               ->find();

        if (!$admin) {
            return json(['code' => 401, 'msg' => '登录已失效或账号已禁用', 'data' => []], 401);
        }

        // 注入当前登录管理员
        $request->admin_user = $admin;
        $request->admin_token = $token;
        $request->admin_permissions = AdminAccessLogic::permissions((int)$admin->id);

        return $next($request);
    }
}
