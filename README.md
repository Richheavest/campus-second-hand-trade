# 校园二手交易平台

面向高校师生的 **C2C 闲置物品交易平台**，覆盖「发布 → 浏览 → 沟通 → 下单 → 履约」的完整二手交易闭环。

项目采用**前后端分离 + 三段式架构**：微信小程序（用户端）+ Spring Boot（服务端）+ Vue 3 管理后台（运营端），一套 RESTful API 同时服务两端。

## 技术栈

| 端 | 技术 | 说明 |
|----|------|------|
| 用户端 | 微信小程序原生（WXML / WXSS / JS） | 12 个页面，商品交易 + 私信 + 订单 |
| 服务端 | Java 8 · Spring Boot 2.7.18 · MyBatis-Plus 3.5.3.1 · MySQL 8.0 | 业务核心，统一 `Result<T>` 返回 |
| 管理端 | Vue 3.3 · Vite 4 · Element Plus · Vue Router · Axios · ECharts | 数据看板 + 各业务管理 |

## 功能特性

- **首页浏览**：双列瀑布流、分类宫格、最新/价格排序、关键词搜索、分页下拉刷新
- **商品发布**：最多 9 图上传（首图封面）、表单校验、图片上传 + 静态资源映射
- **商品详情**：图片轮播、卖家卡片（信用分）、相关商品推荐
- **收藏**：收藏/取消，联合唯一键防重复收藏，同步维护收藏数
- **即时通讯**：会话列表（最后消息 + 未读红点）、一对一聊天（文字/图片气泡）、消息已读/未读回执
- **订单履约**：订单状态机（待付款 → 待发货 → 待收货 → 已完成 / 已取消）+ 状态流转日志
- **管理后台**：仪表盘统计、商品/订单/用户/分类管理

## 项目架构

```
┌─────────────┐      ┌──────────────────────┐      ┌─────────────┐
│  微信小程序   │ HTTP │   Spring Boot 服务端   │ JDBC │    MySQL 8   │
│  (原生)      │─────▶│   /api/**  RESTful    │─────▶│  campus_     │
│  12 个页面   │      │   统一 Result<T> 返回   │      │  secondhand │
└─────────────┘      └──────────┬───────────┘      └─────────────┘
                                │ /api 代理
                         ┌──────▼───────┐
                         │  Vue 3 管理后台 │
                         │ Element Plus │
                         └──────────────┘
```

## 目录结构

```
campus-second-hand-trade/
├── campus-secondhand/             # 微信小程序（用户端）
│   ├── pages/                     # 12 个页面
│   │   ├── index/                 # 首页（瀑布流 + 分类 + 排序）
│   │   ├── publish/               # 发布商品
│   │   ├── product/detail/        # 商品详情
│   │   ├── search/                # 搜索
│   │   ├── chat-list/  chat/detail/   # 会话列表 / 聊天
│   │   ├── order/list/  order/detail/ # 订单列表 / 订单详情
│   │   ├── my-publish/  my-favorite/  # 我发布的 / 我的收藏
│   │   ├── profile/               # 我的
│   │   └── about/                 # 关于
│   ├── utils/                     # api / mock / storage / util 封装
│   ├── images/                    # 图标、头像等静态资源
│   └── app.js / app.json / app.wxss
├── campus-secondhand-server/      # Spring Boot 服务端
│   ├── src/main/java/com/campus/secondhand/
│   │   ├── controller/            # 8 个接口控制器
│   │   ├── service/  service/impl/
│   │   ├── mapper/  entity/       # MyBatis-Plus
│   │   └── config/                # CORS / 静态资源映射
│   └── src/main/resources/
│       ├── db/schema.sql          # 建表脚本
│       ├── db/seed.sql            # 种子数据
│       └── application.yml.example# 配置示例（脱敏）
├── campus-secondhand-admin/       # Vue 3 管理后台
│   ├── src/views/                 # 登录 / 仪表盘 / 各管理页
│   ├── src/utils/api.js           # axios 封装（baseURL /api）
│   └── vite.config.js             # /api 代理到 8080
├── design.md / plan.md            # 设计与实现文档
└── README.md
```

## 数据库设计（8 张表）

| 表 | 说明 |
|----|------|
| `user` | 用户（昵称、头像、信用分、学校） |
| `category` | 商品分类 |
| `product` | 商品（价格、新旧、交易方式、状态） |
| `product_image` | 商品图片（一对多） |
| `order_info` | 订单 |
| `order_status_log` | 订单状态流转日志 |
| `message` | 消息（会话） |
| `favorite` | 收藏（用户-商品多对多，联合唯一键） |

## 快速开始

### 环境要求

- JDK 8+、Maven 3.6+
- MySQL 8.0
- Node.js 16+（仅管理后台需要）
- 微信开发者工具

### 1. 初始化数据库

```sql
CREATE DATABASE IF NOT EXISTS campus_secondhand DEFAULT CHARACTER SET utf8mb4;
```

依次执行（用 MySQL 客户端或 Navicat 等工具）：

1. `campus-secondhand-server/src/main/resources/db/schema.sql` —— 建表
2. `campus-secondhand-server/src/main/resources/db/seed.sql` —— 种子数据（分类 / 用户 / 商品 / 订单 / 消息等）

### 2. 启动后端

```bash
cd campus-secondhand-server
# 复制配置示例并填入你的 MySQL 密码
cp src/main/resources/application.yml.example src/main/resources/application.yml   # Windows 用 copy
# 编辑 application.yml，将 password 改为你的 MySQL 密码
mvn spring-boot:run
```

服务默认运行在 `http://localhost:8080`，接口统一前缀 `/api`，上传图片静态映射在 `/uploads/**`。

> `application.yml` 已被 `.gitignore` 忽略（内含数据库密码），仓库只保留脱敏的 `application.yml.example`。

### 3. 运行小程序

1. 微信开发者工具「导入项目」，选择 `campus-secondhand` 目录。
2. 后端接口地址在 `campus-secondhand/utils/api.js` 的 `BASE_URL`，默认 `http://localhost:8080`。
3. 开发阶段在「详情 → 本地设置」勾选 **不校验合法域名、TLS 版本及 HTTPS 证书**。

### 4. 运行管理后台

```bash
cd campus-secondhand-admin
npm install
npm run dev
```

Vite 已配置 `/api` 代理到 `http://localhost:8080`（见 `vite.config.js`）。访问终端输出的地址（默认 `http://localhost:5173`）。

## 默认账号

| 端 | 账号 | 说明 |
|----|------|------|
| 管理后台 | `admin` / `admin123` | 前端硬编码，便于演示 |
| 小程序 | 测试用户（默认用户 id=1） | 登录为本地 mock，可后续接入微信 `wx.login` |

## 项目文档

- [`design.md`](design.md) —— 产品设计（页面、功能、配色体系）
- [`plan.md`](plan.md) —— 实现计划（分阶段拆解）

## 说明

- 项目当前**未使用 Redis**，缓存为可选扩展点。
- 小程序登录暂为本地测试用户，微信登录（`wx.login` + `code2session`）与支付为后续扩展方向。
- 图片上传路径默认解析到用户主目录下（避免相对路径漂移），可在 `application.yml` 的 `upload.path` 调整。
