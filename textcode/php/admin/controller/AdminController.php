<?php

namespace app\admin\controller;

use think\App;
use think\response\Json;

class AdminController
{
    protected $app;
    protected $request;

    protected $middleware = [
        \app\admin\middleware\AdminAuth::class => ['except' => ['login' , 'index' ]],
    ];

    public function __construct(App $app)
    {
        $this->app     = $app;
        $this->request = $app->request;
    }

    /**
     * 成功返回
     */
    protected function success(array $data = [], string $msg = 'ok'): Json
    {
        return json([
            'code' => 1,
            'msg'  => $msg,
            'data' => $data,
        ]);
    }

    /**
     * 失败返回
     */
    protected function error(string $msg = 'error', int $code = 0): Json
    {
        $status = in_array($code, [401, 403], true) ? $code : 200;

        return json([
            'code' => $code,
            'msg'  => $msg,
            'data' => [],
        ], $status);
    }
}
