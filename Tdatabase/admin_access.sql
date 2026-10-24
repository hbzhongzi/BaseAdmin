/*
  MemoryAdmin 单管理员权限扩展表
  当前版本暂不引入多角色，权限直接绑定 admin_user。
  该脚本不会删除已有表，适合在 admin_user 已存在的环境中增量执行。
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `admin_permission` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` varchar(100) NOT NULL COMMENT '权限编码，例如 user:list',
  `name` varchar(100) NOT NULL COMMENT '权限名称',
  `type` varchar(20) NOT NULL DEFAULT 'api' COMMENT '权限类型：page/api/action',
  `path` varchar(255) NOT NULL DEFAULT '' COMMENT '关联路由或接口路径',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1正常 0禁用',
  `create_time` int NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_admin_permission_code` (`code`),
  KEY `idx_admin_permission_status` (`status`),
  KEY `idx_admin_permission_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='后台权限表';

CREATE TABLE IF NOT EXISTS `admin_user_permission` (
  `user_id` int UNSIGNED NOT NULL COMMENT '管理员 ID',
  `permission_id` int UNSIGNED NOT NULL COMMENT '权限 ID',
  PRIMARY KEY (`user_id`, `permission_id`),
  KEY `idx_admin_user_permission_permission` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员权限关联表';

SET FOREIGN_KEY_CHECKS = 1;
