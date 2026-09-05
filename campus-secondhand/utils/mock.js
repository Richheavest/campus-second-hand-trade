// Mock 数据生成器

// ===== 模拟用户 =====
const mockUsers = [
  {
    id: 'user_001',
    nickName: '小明同学',
    avatarUrl: '/images/avatar/avatar1.png',
    creditScore: 95,
    productCount: 12
  },
  {
    id: 'user_002',
    nickName: '小红学姐',
    avatarUrl: '/images/avatar/avatar2.png',
    creditScore: 88,
    productCount: 8
  },
  {
    id: 'user_003',
    nickName: '阿杰',
    avatarUrl: '/images/avatar/avatar3.png',
    creditScore: 92,
    productCount: 5
  },
  {
    id: 'user_004',
    nickName: '图书馆常客',
    avatarUrl: '/images/avatar/avatar4.png',
    creditScore: 100,
    productCount: 20
  }
]

// 当前用户（买家）
const currentUser = mockUsers[0]

// ===== 模拟商品 =====
const mockProducts = [
  {
    id: 'prod_001',
    title: 'iPhone 14 Pro 256G 深空黑 99新',
    description: '去年12月买的，一直带壳贴膜使用，没有任何划痕和磕碰。因为换了新手机所以出掉。包装盒、充电线都在，送一个官方硅胶壳。优先校内面交，当场验货。',
    price: 5699,
    originalPrice: 8999,
    images: [
      '/images/products/prod1_1.png',
      '/images/products/prod1_2.png',
      '/images/products/prod1_3.png'
    ],
    category: 'digital',
    condition: 'like_new',
    tradeType: 'both',
    seller: mockUsers[1],
    status: 'on_sale',
    viewCount: 328,
    favoriteCount: 15,
    createTime: '2026-07-10 14:30:00'
  },
  {
    id: 'prod_002',
    title: '高等数学第七版（同济大学）九成新',
    description: '上学期买的，只用了一学期，里面有些笔记但很整洁。适合大一新生，比学校书店便宜一半。',
    price: 25,
    originalPrice: 56,
    images: ['/images/products/prod2_1.png'],
    category: 'book',
    condition: 'slightly_used',
    tradeType: 'self_pickup',
    seller: mockUsers[3],
    status: 'on_sale',
    viewCount: 156,
    favoriteCount: 8,
    createTime: '2026-07-09 10:00:00'
  },
  {
    id: 'prod_003',
    title: '雷蛇蝰蛇V3专业版 无线鼠标 游戏鼠标',
    description: '买来打游戏用了三个月，手感很好但是想换GPW所以出掉。箱说全，无拆无修，轻微使用痕迹。',
    price: 399,
    originalPrice: 699,
    images: [
      '/images/products/prod3_1.png',
      '/images/products/prod3_2.png'
    ],
    category: 'digital',
    condition: 'slightly_used',
    tradeType: 'both',
    seller: mockUsers[2],
    status: 'on_sale',
    viewCount: 210,
    favoriteCount: 12,
    createTime: '2026-07-08 16:45:00'
  },
  {
    id: 'prod_004',
    title: '宿舍用小冰箱 迷你制冷 15L',
    description: '宿舍用的小冰箱，制冷效果不错，夏天冰饮料很方便。毕业了带不走，便宜出给学弟学妹。功率小宿管阿姨不会说。',
    price: 120,
    originalPrice: 299,
    images: [
      '/images/products/prod4_1.png',
      '/images/products/prod4_2.png'
    ],
    category: 'life',
    condition: 'normally_used',
    tradeType: 'self_pickup',
    seller: mockUsers[3],
    status: 'on_sale',
    viewCount: 89,
    favoriteCount: 5,
    createTime: '2026-07-11 09:20:00'
  },
  {
    id: 'prod_005',
    title: 'Nike Air Force 1 空军一号 白 42码',
    description: '正品Nike AF1，穿了大概十次，鞋底轻微磨损。码数买小了所以出，42码。支持专柜验货。',
    price: 380,
    originalPrice: 799,
    images: [
      '/images/products/prod5_1.png',
      '/images/products/prod5_2.png'
    ],
    category: 'clothing',
    condition: 'slightly_used',
    tradeType: 'both',
    seller: mockUsers[0],
    status: 'on_sale',
    viewCount: 445,
    favoriteCount: 22,
    createTime: '2026-07-12 08:00:00'
  },
  {
    id: 'prod_006',
    title: 'iPad Air 5 + Apple Pencil 2代 套装',
    description: 'iPad Air 5 64G WiFi版星空色，搭配Apple Pencil 2代，考研期间买的，现在上岸了出掉。无磕碰无划痕，电池健康92%。',
    price: 3200,
    originalPrice: 4999,
    images: [
      '/images/products/prod6_1.png',
      '/images/products/prod6_2.png',
      '/images/products/prod6_3.png'
    ],
    category: 'digital',
    condition: 'like_new',
    tradeType: 'both',
    seller: mockUsers[0],
    status: 'on_sale',
    viewCount: 567,
    favoriteCount: 34,
    createTime: '2026-07-11 20:30:00'
  },
  {
    id: 'prod_007',
    title: '英语四六级真题汇编2026版（全新未拆）',
    description: '买回来发现买重了，全新未拆封。包含近5年真题+听力光盘+词汇手册。',
    price: 18,
    originalPrice: 39.9,
    images: ['/images/products/prod7_1.png'],
    category: 'book',
    condition: 'brand_new',
    tradeType: 'self_pickup',
    seller: mockUsers[2],
    status: 'on_sale',
    viewCount: 78,
    favoriteCount: 3,
    createTime: '2026-07-07 11:15:00'
  },
  {
    id: 'prod_008',
    title: 'SK-II 神仙水 230ml 全新未拆封',
    description: '朋友送的礼物，家里还有没用完的所以出掉。全新未拆，保质期到2027年。专柜正品可查防伪。',
    price: 680,
    originalPrice: 1370,
    images: [
      '/images/products/prod8_1.png',
      '/images/products/prod8_2.png'
    ],
    category: 'beauty',
    condition: 'brand_new',
    tradeType: 'both',
    seller: mockUsers[1],
    status: 'on_sale',
    viewCount: 234,
    favoriteCount: 19,
    createTime: '2026-07-06 15:00:00'
  },
  {
    id: 'prod_009',
    title: '尤尼克斯羽毛球拍 天斧100ZZ',
    description: '打了半年，拍框有一处小磕碰不影响使用。换了新拍所以出掉。送一个拍套和手胶。',
    price: 550,
    originalPrice: 1080,
    images: [
      '/images/products/prod9_1.png',
      '/images/products/prod9_2.png'
    ],
    category: 'sports',
    condition: 'normally_used',
    tradeType: 'both',
    seller: mockUsers[2],
    status: 'on_sale',
    viewCount: 189,
    favoriteCount: 11,
    createTime: '2026-07-05 17:30:00'
  },
  {
    id: 'prod_010',
    title: '床上桌 折叠桌 懒人电脑桌',
    description: '宿舍床上用的折叠桌，很结实，高度可调。毕业了用不上了，九成新。',
    price: 35,
    originalPrice: 89,
    images: ['/images/products/prod10_1.png'],
    category: 'life',
    condition: 'slightly_used',
    tradeType: 'self_pickup',
    seller: mockUsers[3],
    status: 'on_sale',
    viewCount: 45,
    favoriteCount: 2,
    createTime: '2026-07-04 13:00:00'
  },
  {
    id: 'prod_011',
    title: 'UNIQLO 优衣库 羽绒服 男款 M码 黑色',
    description: '去年冬天买的，穿了一季，洗过一次。M码适合170-175cm。暖和轻便，冬天必备。',
    price: 150,
    originalPrice: 499,
    images: [
      '/images/products/prod11_1.png',
      '/images/products/prod11_2.png'
    ],
    category: 'clothing',
    condition: 'slightly_used',
    tradeType: 'both',
    seller: mockUsers[0],
    status: 'on_sale',
    viewCount: 112,
    favoriteCount: 6,
    createTime: '2026-07-03 10:30:00'
  },
  {
    id: 'prod_012',
    title: '机械键盘 IKBC C87 茶轴 87键',
    description: '程序员必备，茶轴打字手感好声音不大。键帽是PBT材质不油不滑。原装线在，箱说全。',
    price: 160,
    originalPrice: 349,
    images: [
      '/images/products/prod12_1.png',
      '/images/products/prod12_2.png'
    ],
    category: 'digital',
    condition: 'normally_used',
    tradeType: 'both',
    seller: mockUsers[1],
    status: 'on_sale',
    viewCount: 267,
    favoriteCount: 14,
    createTime: '2026-07-02 09:45:00'
  }
]

// ===== 模拟订单 =====
const mockOrders = [
  {
    id: 'order_001',
    product: { ...mockProducts[4], status: 'sold' },
    buyer: mockUsers[0],
    seller: mockUsers[0], // 自己卖的（我卖出的示例）
    status: 'shipped',
    price: 380,
    freight: 0,
    totalPrice: 380,
    createTime: '2026-07-01 12:00:00',
    statusTimeline: [
      { status: 'pending', time: '2026-07-01 12:00:00' },
      { status: 'paid', time: '2026-07-01 12:05:00' },
      { status: 'shipped', time: '2026-07-02 10:00:00' }
    ]
  },
  {
    id: 'order_002',
    product: { ...mockProducts[1], status: 'sold' },
    buyer: mockUsers[0],
    seller: mockUsers[3],
    status: 'received',
    price: 25,
    freight: 0,
    totalPrice: 25,
    createTime: '2026-06-28 15:00:00',
    statusTimeline: [
      { status: 'pending', time: '2026-06-28 15:00:00' },
      { status: 'paid', time: '2026-06-28 15:10:00' },
      { status: 'shipped', time: '2026-06-29 09:00:00' },
      { status: 'received', time: '2026-06-30 14:00:00' }
    ]
  }
]

// ===== 模拟聊天 =====
const mockChatList = [
  {
    conversationId: 'conv_user_001_user_002',
    otherUser: mockUsers[1],
    lastMessage: '好的，明天下午三点图书馆门口见~',
    lastTime: '2026-07-12 10:30:00',
    unreadCount: 2
  },
  {
    conversationId: 'conv_user_001_user_003',
    otherUser: mockUsers[2],
    lastMessage: '可以小刀，最低350出',
    lastTime: '2026-07-11 18:45:00',
    unreadCount: 0
  },
  {
    conversationId: 'conv_user_001_user_004',
    otherUser: mockUsers[3],
    lastMessage: '书还在吗？',
    lastTime: '2026-07-10 09:00:00',
    unreadCount: 0
  }
]

// ===== 模拟聊天消息 =====
const mockMessages = {
  'conv_user_001_user_002': [
    { id: 'msg_001', conversationId: 'conv_user_001_user_002', fromUserId: 'user_001', toUserId: 'user_002', type: 'text', content: '你好，我对SK-II神仙水感兴趣，想问下是正品吗？', createTime: '2026-07-12 09:00:00', isRead: true },
    { id: 'msg_002', conversationId: 'conv_user_001_user_002', fromUserId: 'user_002', toUserId: 'user_001', type: 'text', content: '是的，专柜买的，有小票可以给你看~', createTime: '2026-07-12 09:05:00', isRead: true },
    { id: 'msg_003', conversationId: 'conv_user_001_user_002', fromUserId: 'user_001', toUserId: 'user_002', type: 'text', content: '好的，能便宜一点吗？学生党预算有限😂', createTime: '2026-07-12 09:10:00', isRead: true },
    { id: 'msg_004', conversationId: 'conv_user_001_user_002', fromUserId: 'user_002', toUserId: 'user_001', type: 'text', content: '最低650哦，已经比专柜便宜一半了，而且全新未拆', createTime: '2026-07-12 09:15:00', isRead: true },
    { id: 'msg_005', conversationId: 'conv_user_001_user_002', fromUserId: 'user_001', toUserId: 'user_002', type: 'text', content: '好的我考虑一下，明天给你答复', createTime: '2026-07-12 10:00:00', isRead: true },
    { id: 'msg_006', conversationId: 'conv_user_001_user_002', fromUserId: 'user_002', toUserId: 'user_001', type: 'text', content: '好的，明天下午三点图书馆门口见~', createTime: '2026-07-12 10:30:00', isRead: false }
  ],
  'conv_user_001_user_003': [
    { id: 'msg_007', conversationId: 'conv_user_001_user_003', fromUserId: 'user_001', toUserId: 'user_003', type: 'text', content: '鼠标还在吗？用了多久了？', createTime: '2026-07-11 17:00:00', isRead: true },
    { id: 'msg_008', conversationId: 'conv_user_001_user_003', fromUserId: 'user_003', toUserId: 'user_001', type: 'text', content: '在的，用了三个月，无拆无修', createTime: '2026-07-11 17:30:00', isRead: true },
    { id: 'msg_009', conversationId: 'conv_user_001_user_003', fromUserId: 'user_001', toUserId: 'user_003', type: 'text', content: '350出吗？', createTime: '2026-07-11 18:30:00', isRead: true },
    { id: 'msg_010', conversationId: 'conv_user_001_user_003', fromUserId: 'user_003', toUserId: 'user_001', type: 'text', content: '可以小刀，最低350出', createTime: '2026-07-11 18:45:00', isRead: true }
  ],
  'conv_user_001_user_004': [
    { id: 'msg_011', conversationId: 'conv_user_001_user_004', fromUserId: 'user_001', toUserId: 'user_004', type: 'text', content: '书还在吗？', createTime: '2026-07-10 09:00:00', isRead: true }
  ]
}

module.exports = {
  mockUsers,
  currentUser,
  mockProducts,
  mockOrders,
  mockChatList,
  mockMessages
}
