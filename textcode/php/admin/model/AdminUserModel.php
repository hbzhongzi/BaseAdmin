<?php

namespace app\admin\model;

use think\Model;

class AdminUserModel extends Model
{
    protected $name = 'admin_user';

    protected $pk = 'id';

    protected $autoWriteTimestamp = false;

    /** 防止模型序列化时意外暴露凭据字段。 */
    protected $hidden = ['password', 'api_token'];

    /**
     * 校验密码
     */
    public static function verifyPassword(string $password, string $hash): bool
    {
                //dump(password_hash($password , PASSWORD_BCRYPT)); die;
        return password_verify($password, $hash);
    }

    /**
     * 设置密码（bcrypt）
     */
    public static function makePassword(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT);
    }
}
