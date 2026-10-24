<?php

use think\facade\Route;

// 管理员认证 API；所有业务 API 必须在 SPA 回退路由之前声明。
Route::post('api/admin/auth/login', 'AuthController/login');
Route::post('api/admin/auth/refresh', 'AuthController/refresh');
Route::post('api/admin/auth/logout', 'AuthController/logout');
Route::get('api/admin/auth/me', 'AuthController/me');

// 权限字典示例：认证之外的业务接口必须同时接入权限中间件。
Route::get('api/admin/permissions', 'PermissionController/index')
    ->middleware(\app\admin\middleware\AdminPermission::class, 'permission:list');

// 后台前端使用 Vue history 路由，刷新页面时回退到 SPA 入口。
Route::get('', 'Index/index');
Route::get('<spa_path>', 'Index/index')
    ->pattern([
        'spa_path' => '.*',
    ]);
