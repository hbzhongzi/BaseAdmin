<?php

namespace app\admin\controller;

use think\facade\Db;
use think\response\Json;

/**
 * 权限字典示例接口。
 * 业务项目可在此基础上增加权限的增删改和管理员绑定接口。
 */
class PermissionController extends AdminController
{
    public function index(): Json
    {
        try {
            $items = Db::name('admin_permission')
                ->field('id,code,name,type,path,status,create_time')
                ->where('status', 1)
                ->order('id', 'asc')
                ->select()
                ->toArray();
        } catch (\Throwable $e) {
            return $this->error('权限表尚未初始化');
        }

        return $this->success(['items' => $items]);
    }
}
