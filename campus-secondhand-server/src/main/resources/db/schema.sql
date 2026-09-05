-- ==========================================
-- 校园二手交易平台 数据库初始化脚本
-- ==========================================

CREATE DATABASE IF NOT EXISTS campus_secondhand
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE campus_secondhand;

-- ===== 用户表 =====
CREATE TABLE IF NOT EXISTS `user` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `openid` VARCHAR(64) UNIQUE COMMENT '微信OpenID',
  `nickname` VARCHAR(64) NOT NULL COMMENT '昵称',
  `avatar_url` VARCHAR(512) COMMENT '头像URL',
  `phone` VARCHAR(20) COMMENT '手机号',
  `credit_score` INT DEFAULT 100 COMMENT '信用分',
  `status` TINYINT DEFAULT 1 COMMENT '状态:0禁用 1正常',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ===== 商品分类表 =====
CREATE TABLE IF NOT EXISTS `category` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(32) NOT NULL COMMENT '分类名称',
  `icon` VARCHAR(16) COMMENT '图标emoji',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '0禁用 1启用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类';

-- ===== 商品表 =====
CREATE TABLE IF NOT EXISTS `product` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL COMMENT '标题',
  `description` TEXT COMMENT '描述',
  `price` DECIMAL(10,2) NOT NULL COMMENT '售价',
  `original_price` DECIMAL(10,2) COMMENT '原价',
  `category_id` INT COMMENT '分类ID',
  `condition_level` VARCHAR(32) COMMENT '新旧程度',
  `trade_type` VARCHAR(32) COMMENT '交易方式',
  `seller_id` BIGINT NOT NULL COMMENT '卖家ID',
  `status` VARCHAR(32) DEFAULT 'on_sale' COMMENT '商品状态',
  `view_count` INT DEFAULT 0 COMMENT '浏览量',
  `favorite_count` INT DEFAULT 0 COMMENT '收藏数',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_seller` (`seller_id`),
  INDEX `idx_category` (`category_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- ===== 商品图片表 =====
CREATE TABLE IF NOT EXISTS `product_image` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `product_id` BIGINT NOT NULL COMMENT '商品ID',
  `url` VARCHAR(512) NOT NULL COMMENT '图片地址',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品图片';

-- ===== 订单表 =====
CREATE TABLE IF NOT EXISTS `order_info` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `order_no` VARCHAR(32) UNIQUE NOT NULL COMMENT '订单号',
  `product_id` BIGINT NOT NULL COMMENT '商品ID',
  `product_title` VARCHAR(100) COMMENT '商品标题快照',
  `product_image` VARCHAR(512) COMMENT '商品图片快照',
  `buyer_id` BIGINT NOT NULL COMMENT '买家ID',
  `seller_id` BIGINT NOT NULL COMMENT '卖家ID',
  `price` DECIMAL(10,2) NOT NULL COMMENT '商品金额',
  `freight` DECIMAL(10,2) DEFAULT 0 COMMENT '运费',
  `total_price` DECIMAL(10,2) NOT NULL COMMENT '实付金额',
  `status` VARCHAR(32) DEFAULT 'pending' COMMENT '订单状态',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_buyer` (`buyer_id`),
  INDEX `idx_seller` (`seller_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- ===== 订单状态日志 =====
CREATE TABLE IF NOT EXISTS `order_status_log` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `status` VARCHAR(32) NOT NULL COMMENT '状态',
  `remark` VARCHAR(255) COMMENT '备注',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单状态日志';

-- ===== 消息表 =====
CREATE TABLE IF NOT EXISTS `message` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` VARCHAR(64) NOT NULL COMMENT '会话ID',
  `from_user_id` BIGINT NOT NULL COMMENT '发送者',
  `to_user_id` BIGINT NOT NULL COMMENT '接收者',
  `type` VARCHAR(16) DEFAULT 'text' COMMENT '消息类型:text/image',
  `content` TEXT COMMENT '消息内容',
  `is_read` TINYINT DEFAULT 0 COMMENT '是否已读',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_conversation` (`conversation_id`),
  INDEX `idx_from_user` (`from_user_id`),
  INDEX `idx_to_user` (`to_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';

-- ===== 收藏表 =====
CREATE TABLE IF NOT EXISTS `favorite` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `product_id` BIGINT NOT NULL COMMENT '商品ID',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_product` (`user_id`, `product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- ===== 初始化分类数据 =====
INSERT INTO `category` (`name`, `icon`, `sort_order`) VALUES
('数码', '📱', 1),
('书籍', '📚', 2),
('生活', '🏠', 3),
('服饰', '👗', 4),
('美妆', '💄', 5),
('运动', '⚽', 6),
('其他', '📌', 7);

-- ===== 初始化测试用户 =====
INSERT INTO `user` (`openid`, `nickname`, `avatar_url`, `credit_score`) VALUES
('test_openid_001', '小明同学', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', 95),
('test_openid_002', '小红学姐', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', 88),
('test_openid_003', '阿杰', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', 92),
('test_openid_004', '图书馆常客', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', 100);
