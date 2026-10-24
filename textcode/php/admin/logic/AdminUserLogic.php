<?php

namespace app\admin\logic;

use app\admin\model\AdminUserModel;
use think\facade\Cache;
use think\facade\Request;

class AdminUserLogic extends AdminLogic
{
    /**
     * 管理员登录
     */
    public static function login(string $username, string $password): array
    {
        try {
            if ($username === '' || $password === '') {
                return self::fail('账号或密码不能为空');
            }

            $limitKey = self::loginLimitKey($username);
            $failedAttempts = (int)Cache::get($limitKey, 0);
            if ($failedAttempts >= 5) {
                return self::fail('登录失败次数过多，请 15 分钟后再试');
            }

            $admin = AdminUserModel::where('username', $username)
                                   ->where('status', 1)
                                   ->find();

            if (!$admin) {
                self::recordLoginFailure($limitKey);
                return self::fail('账号不存在或被禁用');
            }

            if (!AdminUserModel::verifyPassword($password, $admin->password)) {
                self::recordLoginFailure($limitKey);
                return self::fail('密码错误');
            }

            Cache::delete($limitKey);

            return self::issueToken($admin);

        } catch (\Throwable $e) {
            return self::exception('admin_login', $e, [
                'username' => $username,
            ]);
        }
    }

    /**
     * 刷新 token（基于当前 token）
     */
    public static function refreshToken(string $oldToken): array
    {
        try {
            $admin = AdminUserModel::where('api_token', $oldToken)
                                   ->where('status', 1)
                                   ->find();

            if (!$admin || (int)$admin->token_expire_time <= time()) {
                return self::fail('登录已失效');
            }

            // 签发新 token
            return self::issueToken($admin);

        } catch (\Throwable $e) {
            return self::exception('admin_refresh_token', $e);
        }
    }

    /**
     * 退出登录
     */
    public static function logout(string $token): array
    {
        AdminUserModel::where('api_token', $token)->update([
            'api_token' => '',
            'token_expire_time' => 0,
        ]);
        return self::success([]);
    }

    /**
     * ================== 内部方法 ==================
     */

    /**
     * 统一签发 token（登录 / 刷新唯一出口）
     */
    protected static function issueToken(AdminUserModel $admin): array
    {
        $token = self::generateToken();
        $ttl   = 86400; // 24 小时
        $now   = time();

        // token 与过期时间按基础管理员表字段持久化（同一账号仅保留一个有效 token）。
        $admin->save([
            'api_token' => $token,
            'token_expire_time' => $now + $ttl,
            'last_login_ip'   => Request::ip(),
            'last_login_time' => $now,
        ]);

        return self::success([
            'token'       => $token,
            'expire_time' => $now + $ttl,
        ]);
    }


    /**
     * 基于 token 退出登录
     */
    public static function logoutByToken(string $token): void
    {
        self::logout($token);
    }


    /**
     * 生成安全 token
     */
    protected static function generateToken(): string
    {
        return bin2hex(random_bytes(32));
    }

    protected static function loginLimitKey(string $username): string
    {
        return 'admin:login:fail:' . sha1(Request::ip() . '|' . strtolower($username));
    }

    protected static function recordLoginFailure(string $key): void
    {
        $attempts = (int)Cache::get($key, 0) + 1;
        Cache::set($key, $attempts, 900);
    }
}
