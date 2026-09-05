-- ==========================================
-- 校园二手交易平台 示例数据
-- ==========================================

USE campus_secondhand;

-- ===== 补充用户 =====
-- 已存在4个用户(id 1-4)，再补充几个
INSERT INTO `user` (`openid`, `nickname`, `avatar_url`, `credit_score`) VALUES
('test_openid_005', '计算机学院小李', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', 85),
('test_openid_006', '考研上岸学姐', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6', 97),
('test_openid_007', '摄影爱好者', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user7', 90)
ON DUPLICATE KEY UPDATE `nickname` = VALUES(`nickname`);

-- ===== 插入商品 =====
INSERT INTO `product` (`title`, `description`, `price`, `original_price`, `category_id`, `condition_level`, `trade_type`, `seller_id`, `status`, `view_count`, `favorite_count`, `create_time`) VALUES
('iPhone 14 Pro 256G 深空黑 99新', '去年12月买的，一直带壳贴膜使用，没有任何划痕和磕碰。因为换了新手机所以出掉。包装盒、充电线都在，送一个官方硅胶壳。优先校内面交，当场验货。', 5699.00, 8999.00, 8, 'like_new', 'both', 1, 'on_sale', 328, 15, '2026-07-10 14:30:00'),
('高等数学第七版（同济大学）九成新', '上学期买的，只用了一学期，里面有些笔记但很整洁。适合大一新生，比学校书店便宜一半。', 25.00, 56.00, 9, 'slightly_used', 'self_pickup', 4, 'on_sale', 156, 8, '2026-07-09 10:00:00'),
('雷蛇蝰蛇V3专业版 无线鼠标', '买来打游戏用了三个月，手感很好但是想换GPW所以出掉。箱说全，无拆无修，轻微使用痕迹。', 399.00, 699.00, 8, 'slightly_used', 'both', 3, 'on_sale', 210, 12, '2026-07-08 16:45:00'),
('宿舍用小冰箱 迷你制冷 15L', '宿舍用的小冰箱，制冷效果不错，夏天冰饮料很方便。毕业了带不走，便宜出给学弟学妹。功率小宿管阿姨不会说。', 120.00, 299.00, 10, 'normally_used', 'self_pickup', 4, 'on_sale', 89, 5, '2026-07-11 09:20:00'),
('Nike Air Force 1 空军一号 白 42码', '正品Nike AF1，穿了大概十次，鞋底轻微磨损。码数买小了所以出，42码。支持专柜验货。', 380.00, 799.00, 11, 'slightly_used', 'both', 5, 'on_sale', 445, 22, '2026-07-12 08:00:00'),
('iPad Air 5 + Apple Pencil 2代 套装', 'iPad Air 5 64G WiFi版星空色，搭配Apple Pencil 2代，考研期间买的，现在上岸了出掉。无磕碰无划痕，电池健康92%。', 3200.00, 4999.00, 8, 'like_new', 'both', 1, 'on_sale', 567, 34, '2026-07-11 20:30:00'),
('英语四六级真题汇编2026版（全新未拆）', '买回来发现买重了，全新未拆封。包含近5年真题+听力光盘+词汇手册。', 18.00, 39.90, 9, 'brand_new', 'self_pickup', 3, 'on_sale', 78, 3, '2026-07-07 11:15:00'),
('SK-II 神仙水 230ml 全新未拆封', '朋友送的礼物，家里还有没用完的所以出掉。全新未拆，保质期到2027年。专柜正品可查防伪。', 680.00, 1370.00, 12, 'brand_new', 'both', 2, 'on_sale', 234, 19, '2026-07-06 15:00:00'),
('尤尼克斯羽毛球拍 天斧100ZZ', '打了半年，拍框有一处小磕碰不影响使用。换了新拍所以出掉。送一个拍套和手胶。', 550.00, 1080.00, 13, 'normally_used', 'both', 3, 'on_sale', 189, 11, '2026-07-05 17:30:00'),
('床上桌 折叠桌 懒人电脑桌', '宿舍床上用的折叠桌，很结实，高度可调。毕业了用不上了，九成新。', 35.00, 89.00, 10, 'slightly_used', 'self_pickup', 4, 'on_sale', 45, 2, '2026-07-04 13:00:00'),
('UNIQLO 优衣库 羽绒服 男款 M码 黑色', '去年冬天买的，穿了一季，洗过一次。M码适合170-175cm。暖和轻便，冬天必备。', 150.00, 499.00, 11, 'slightly_used', 'both', 5, 'on_sale', 112, 6, '2026-07-03 10:30:00'),
('机械键盘 IKBC C87 茶轴 87键', '程序员必备，茶轴打字手感好声音不大。键帽是PBT材质不油不滑。原装线在，箱说全。', 160.00, 349.00, 8, 'normally_used', 'both', 2, 'on_sale', 267, 14, '2026-07-02 09:45:00'),
('戴尔27寸4K显示器 U2723QE', '设计专业必备，4K分辨率色彩超准。买了半年，因换Studio Display出掉。无坏点无漏光，箱说全。', 2200.00, 3999.00, 8, 'like_new', 'self_pickup', 6, 'on_sale', 412, 28, '2026-07-09 13:00:00'),
('考研数学一全套资料（李永乐+张宇+汤家凤）', '去年考研买的，基本都看过一遍。包含复习全书+660题+真题解析+模拟卷，一共12本。', 88.00, 280.00, 9, 'slightly_used', 'self_pickup', 7, 'on_sale', 198, 13, '2026-07-08 11:00:00'),
('Switch OLED 塞尔达限定版 + 5款游戏', '买来几乎没怎么玩，吃灰了半年。包含主机+底座+5款游戏卡带（王国之泪、旷野之息、马车8、奥德赛、健身环）。', 1800.00, 3200.00, 8, 'like_new', 'both', 6, 'on_sale', 678, 45, '2026-07-11 22:00:00'),
('吉他 Yamaha F310 民谣吉他 入门神器', '大一买了学了一个月就放弃了...琴弦已换新，送调音器、变调夹、琴包。', 320.00, 699.00, 14, 'slightly_used', 'self_pickup', 7, 'on_sale', 89, 7, '2026-07-01 16:00:00');

-- ===== 商品图片 =====
INSERT INTO `product_image` (`product_id`, `url`, `sort_order`) VALUES
(2, 'https://picsum.photos/seed/prod1/400/400', 0),
(2, 'https://picsum.photos/seed/prod1b/400/400', 1),
(2, 'https://picsum.photos/seed/prod1c/400/400', 2),
(3, 'https://picsum.photos/seed/prod2/400/400', 0),
(4, 'https://picsum.photos/seed/prod3/400/400', 0),
(4, 'https://picsum.photos/seed/prod3b/400/400', 1),
(5, 'https://picsum.photos/seed/prod4/400/400', 0),
(5, 'https://picsum.photos/seed/prod4b/400/400', 1),
(6, 'https://picsum.photos/seed/prod5/400/400', 0),
(6, 'https://picsum.photos/seed/prod5b/400/400', 1),
(7, 'https://picsum.photos/seed/prod6/400/400', 0),
(7, 'https://picsum.photos/seed/prod6b/400/400', 1),
(7, 'https://picsum.photos/seed/prod6c/400/400', 2),
(8, 'https://picsum.photos/seed/prod7/400/400', 0),
(9, 'https://picsum.photos/seed/prod8/400/400', 0),
(9, 'https://picsum.photos/seed/prod8b/400/400', 1),
(10, 'https://picsum.photos/seed/prod9/400/400', 0),
(10, 'https://picsum.photos/seed/prod9b/400/400', 1),
(11, 'https://picsum.photos/seed/prod10/400/400', 0),
(12, 'https://picsum.photos/seed/prod11/400/400', 0),
(12, 'https://picsum.photos/seed/prod11b/400/400', 1),
(13, 'https://picsum.photos/seed/prod12/400/400', 0),
(13, 'https://picsum.photos/seed/prod12b/400/400', 1),
(14, 'https://picsum.photos/seed/prod13/400/400', 0),
(14, 'https://picsum.photos/seed/prod13b/400/400', 1),
(15, 'https://picsum.photos/seed/prod14/400/400', 0),
(16, 'https://picsum.photos/seed/prod15/400/400', 0),
(16, 'https://picsum.photos/seed/prod15b/400/400', 1),
(17, 'https://picsum.photos/seed/prod16/400/400', 0),
(17, 'https://picsum.photos/seed/prod16b/400/400', 1);

-- ===== 订单 =====
INSERT INTO `order_info` (`order_no`, `product_id`, `product_title`, `product_image`, `buyer_id`, `seller_id`, `price`, `freight`, `total_price`, `status`, `create_time`) VALUES
('20260701120000001', 5, 'Nike Air Force 1 空军一号 白 42码', 'https://picsum.photos/seed/prod5/400/400', 2, 5, 380.00, 0, 380.00, 'shipped', '2026-07-01 12:00:00'),
('20260701120500002', 5, 'Nike Air Force 1 空军一号 白 42码', 'https://picsum.photos/seed/prod5/400/400', 2, 5, 380.00, 0, 380.00, 'received', '2026-07-01 12:05:00'), -- wait, duplicate. Let me fix
('20260702100000003', 3, '高等数学第七版（同济大学）九成新', 'https://picsum.photos/seed/prod2/400/400', 1, 4, 25.00, 0, 25.00, 'received', '2026-06-28 15:00:00'),
('20260705090000004', 13, '机械键盘 IKBC C87 茶轴 87键', 'https://picsum.photos/seed/prod12/400/400', 1, 2, 160.00, 0, 160.00, 'paid', '2026-07-05 09:00:00'),
('20260710160000005', 9, 'SK-II 神仙水 230ml 全新未拆封', 'https://picsum.photos/seed/prod8/400/400', 5, 2, 680.00, 0, 680.00, 'pending', '2026-07-10 16:00:00');

-- 修正第2条（避免重复）
UPDATE `order_info` SET `order_no` = '20260701151000001', `product_id` = 6, `product_title` = 'Nike Air Force 1 空军一号 白 42码', `product_image` = 'https://picsum.photos/seed/prod5/400/400', `buyer_id` = 4, `seller_id` = 5, `price` = 380.00, `total_price` = 380.00, `status` = 'received', `create_time` = '2026-06-20 14:30:00' WHERE `id` = 2;

-- ===== 订单状态日志 =====
INSERT INTO `order_status_log` (`order_id`, `status`, `remark`, `create_time`) VALUES
(1, 'pending', '订单创建', '2026-07-01 12:00:00'),
(1, 'paid', '买家已付款', '2026-07-01 12:05:00'),
(1, 'shipped', '卖家已发货，顺丰快递 SF1234567890', '2026-07-02 10:00:00'),
(2, 'pending', '订单创建', '2026-06-20 14:30:00'),
(2, 'paid', '买家已付款', '2026-06-20 14:35:00'),
(2, 'shipped', '卖家已发货', '2026-06-21 09:00:00'),
(2, 'received', '买家已收货，交易完成', '2026-06-23 16:00:00'),
(3, 'pending', '订单创建', '2026-06-28 15:00:00'),
(3, 'paid', '买家已付款', '2026-06-28 15:10:00'),
(3, 'shipped', '卖家已发货', '2026-06-28 17:00:00'),
(3, 'received', '买家已收货，交易完成', '2026-06-30 14:00:00'),
(4, 'pending', '订单创建', '2026-07-05 09:00:00'),
(4, 'paid', '买家已付款', '2026-07-05 09:05:00'),
(5, 'pending', '订单创建', '2026-07-10 16:00:00');

-- ===== 聊天消息 =====
INSERT INTO `message` (`conversation_id`, `from_user_id`, `to_user_id`, `type`, `content`, `is_read`, `create_time`) VALUES
-- 小明(1) 和 小红学姐(2) 关于神仙水的对话
('1_2', 1, 2, 'text', '你好学姐，我对SK-II神仙水感兴趣，想问下是正品吗？', 1, '2026-07-12 09:00:00'),
('1_2', 2, 1, 'text', '是的，专柜买的，有小票可以给你看~', 1, '2026-07-12 09:05:00'),
('1_2', 1, 2, 'text', '好的，能便宜一点吗？学生党预算有限😂', 1, '2026-07-12 09:10:00'),
('1_2', 2, 1, 'text', '最低650哦，已经比专柜便宜一半了，而且全新未拆', 1, '2026-07-12 09:15:00'),
('1_2', 1, 2, 'text', '好的我考虑一下，明天给你答复', 1, '2026-07-12 10:00:00'),
('1_2', 2, 1, 'text', '好的，明天下午三点图书馆门口见~', 0, '2026-07-12 10:30:00'),
-- 小明(1) 和 阿杰(3) 关于鼠标的对话
('1_3', 1, 3, 'text', '鼠标还在吗？用了多久了？', 1, '2026-07-11 17:00:00'),
('1_3', 3, 1, 'text', '在的，用了三个月，无拆无修，箱说全', 1, '2026-07-11 17:30:00'),
('1_3', 1, 3, 'text', '350出吗？诚心要', 1, '2026-07-11 18:30:00'),
('1_3', 3, 1, 'text', '可以小刀，最低380出，再低就亏了', 0, '2026-07-11 18:45:00'),
-- 小明(1) 和 图书馆常客(4) 关于书的对话
('1_4', 1, 4, 'text', '书还在吗？', 1, '2026-07-10 09:00:00');

-- ===== 收藏 =====
INSERT INTO `favorite` (`user_id`, `product_id`, `create_time`) VALUES
(1, 8, '2026-07-06 16:00:00'),   -- 小明收藏神仙水
(1, 16, '2026-07-12 08:00:00'),  -- 小明收藏Switch
(2, 7, '2026-07-11 21:00:00'),   -- 小红收藏iPad
(2, 15, '2026-07-09 14:00:00'),  -- 小红收藏显示器
(3, 6, '2026-07-12 09:00:00'),   -- 阿杰收藏AF1
(3, 10, '2026-07-06 10:00:00'),  -- 阿杰收藏羽毛球拍
(4, 2, '2026-07-11 10:00:00'),   -- 常客收藏iPhone
(5, 17, '2026-07-03 12:00:00'),  -- 小李收藏吉他
(6, 16, '2026-07-12 07:00:00'),  -- 考研学姐收藏Switch
(7, 14, '2026-07-09 15:00:00');  -- 摄影收藏考研资料
