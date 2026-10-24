<?php

namespace app\admin\logic;

use think\facade\Log;

abstract class AdminLogic
{
    protected static function success(array $data = []): array
    {
        return [
            'res'  => true,
            'data' => $data,
        ];
    }

    protected static function fail(string $msg): array
    {
        return [
            'res' => false,
            'msg' => $msg,
        ];
    }

    protected static function exception(string $scene, \Throwable $e, array $extra = []): array
    {
        $err_data =  [
            'msg'   => $e->getMessage(),
            'file'  => $e->getFile(),
            'line'  => $e->getLine(),
            // trace 只留前 5 行
            'trace' => array_slice($e->getTrace(), 0, 5),
            // extra 做 size 限制
            'extra' => is_array($extra)
                ? array_slice($extra, 0, 10)
                : $extra,
        ];
        try {
             Log::error('[AdminLogic:' . $scene . ']'. var_export($err_data, true));
        } catch (\Throwable $logError) {
            // 日志写失败兜底（避免二次异常）
            Log::error($logError->getMessage());
        }

        return self::fail('系统繁忙，请稍后再试');
    }

    protected static function formatTime($time): string
    {
        $time = (int)$time;
        return $time > 0 ? date('Y-m-d H:i:s', $time) : '';
    }

    protected static function formatAmount($amount): string
    {
        return number_format((float)$amount, 2, '.', '');
    }

    /**
     * 通用分页查询
     */
    protected static function paginate($query, array $params)
    {
        // =============================
        // 1. 分页参数
        // =============================
        $page     = max(1, (int)($params['page'] ?? 1));
        $pageSize = min(50, max(1, (int)($params['page_size'] ?? 10)));

        // =============================
        // 2. 执行分页
        // =============================
        $list = $query->paginate([
            'page'      => $page,
            'list_rows' => $pageSize
        ]);

        return [
            'list'      => $list->items(),
            'total'     => $list->total(),
            'page'      => $page,
            'page_size' => $pageSize,
        ];
    }

}
