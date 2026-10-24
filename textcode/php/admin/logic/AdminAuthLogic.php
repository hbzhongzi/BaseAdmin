<?php

namespace app\admin\logic;

use app\admin\model\AdminUserModel;
use think\Request;

class AdminAuthLogic
{
    /**
     * 获取当前登录的管理员模型
     * @return AdminUserModel|null
     */
    public static function user(Request $request): ?AdminUserModel
    {
        return $request->admin_user ?? null;
    }

    /**
     * 获取当前管理员 ID
     */
    public static function id(Request $request): int
    {
        return isset($request->admin_user)
            ? (int)$request->admin_user->id
            : 0;
    }

    /**
     * 获取当前管理员用户名
     */
    public static function username(Request $request): string
    {
        return isset($request->admin_user)
            ? (string)$request->admin_user->username
            : '';
    }

    /**
     * 是否已登录
     */
    public static function check(Request $request): bool
    {
        return isset($request->admin_user);
    }

    public static function permissions(Request $request): array
    {
        return is_array($request->admin_permissions ?? null) ? $request->admin_permissions : [];
    }

    public static function can(Request $request, string $permission): bool
    {
        return in_array('*', self::permissions($request), true)
            || in_array($permission, self::permissions($request), true);
    }
}
