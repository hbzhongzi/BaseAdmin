<?php

namespace app\admin\controller;

use app\admin\logic\UserLogic;
use think\response\Json;

class UserController extends AdminController
{
    protected $logic;

    public function __construct(\think\App $app)
    {
        parent::__construct($app);
        $this->logic = new UserLogic();
    }

    /**
     * 用户列表
     */
    public function list(): Json
    {
        $params = $this->request->param();

        $res = $this->logic->list($params);

        return $res['res']
            ? $this->success($res['data'])
            : $this->error($res['msg']);
    }

    /**
     * 修改用户状态
     */
    public function status(): Json
    {
        $userId = $this->request->param('user_id');
        $status = $this->request->param('status');

        if (!$userId) {
            return $this->error('用户ID不能为空');
        }

        $res = $this->logic->changeStatus($userId, $status);

        return $res['res']
            ? $this->success()
            : $this->error($res['msg']);
    }

    /**
     * 设置关注
     */
    public function follow(): Json
    {
        $userId = $this->request->param('user_id');

        $res = $this->logic->follow($userId);

        return $res['res']
            ? $this->success()
            : $this->error($res['msg']);
    }

    /**
     * 取消关注
     */
    public function unfollow(): Json
    {
        $userId = $this->request->param('user_id');

        $res = $this->logic->unfollow($userId);

        return $res['res']
            ? $this->success()
            : $this->error($res['msg']);
    }
}