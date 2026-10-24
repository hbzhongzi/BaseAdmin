<?php
namespace app\admin\controller;

class Index
{
    public function index()
    {
        $htmlFile = root_path() . 'public/admin/index.html';
        if (file_exists($htmlFile)) {
            return response(file_get_contents($htmlFile))->contentType('text/html');
        }
        return '前端文件不存在';
    }
}