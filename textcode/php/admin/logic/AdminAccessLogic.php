<?php

namespace app\admin\logic;

use think\facade\Db;

class AdminAccessLogic
{
    /**
     * 返回管理员当前启用的权限编码。
     * 权限表尚未安装时返回空集合，默认拒绝业务权限。
     */
    public static function permissions(int $adminId): array
    {
        if ($adminId <= 0) {
            return [];
        }

        try {
            return array_values(array_unique(Db::name('admin_permission')
                ->alias('p')
                ->join('admin_user_permission up', 'up.permission_id = p.id')
                ->where('up.user_id', $adminId)
                ->where('p.status', 1)
                ->column('p.code')));
        } catch (\Throwable $e) {
            return [];
        }
    }

    public static function can(int $adminId, string $permission): bool
    {
        if ($permission === '') {
            return true;
        }

        $permissions = self::permissions($adminId);
        return in_array('*', $permissions, true) || in_array($permission, $permissions, true);
    }
}
