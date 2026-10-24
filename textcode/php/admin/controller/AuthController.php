<?php

namespace app\admin\controller;

use app\admin\logic\AdminAuthLogic;
use app\admin\logic\AdminUserLogic;
use think\response\Json;

class AuthController extends AdminController
{
    public function login(): Json
    {
        $result = AdminUserLogic::login(
            (string)$this->request->param('username', ''),
            (string)$this->request->param('password', '')
        );

        return $result['res']
            ? $this->success($result['data'])
            : $this->error($result['msg']);
    }

    public function refresh(): Json
    {
        $result = AdminUserLogic::refreshToken($this->request->admin_token);

        return $result['res']
            ? $this->success($result['data'])
            : $this->error($result['msg'], 401);
    }

    public function logout(): Json
    {
        AdminUserLogic::logout($this->request->admin_token);
        return $this->success();
    }

    public function me(): Json
    {
        return $this->success([
            'id' => AdminAuthLogic::id($this->request),
            'username' => AdminAuthLogic::username($this->request),
            'permissions' => AdminAuthLogic::permissions($this->request),
        ]);
    }
}
