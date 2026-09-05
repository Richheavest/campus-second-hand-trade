// app.js
const api = require('./utils/api')
const { mockUsers, mockProducts, mockOrders, mockChatList, mockMessages } = require('./utils/mock')
const storage = require('./utils/storage')

// ============================================================
// 【测试专用】固定测试用户 openid
// 用固定 openid 登录，保证每次启动小程序都是同一个用户，
// 对应数据库 db/schema.sql 的种子用户 id=1「小明同学」。
// ⚠️ 正式上线前请删除本常量，并恢复 wx.login 用 code 换真实 openid 的逻辑。
// ============================================================
const TEST_OPENID = 'test_openid_001'

App({
  onLaunch() {
    // 确保有一个本地用户
    let currentUser = wx.getStorageSync('currentUser')
    if (!currentUser) {
      currentUser = mockUsers[0]
      wx.setStorageSync('currentUser', currentUser)
    }
    api.setCurrentUserId(currentUser.id || 1)

    // 初始化本地Mock数据（仅在存储为空时）
    this.seedMockData()

    // ============================================================
    // 【测试专用】固定测试用户登录（非微信真实登录）
    // 生产环境请改回：wx.login 获取 code → 后端 code2session 换 openid
    // ============================================================
    api.login(TEST_OPENID, null, null).then(user => {
      // 统一字段名：后端返回 nickname，前端各处使用 nickName
      user.nickName = user.nickname || user.nickName
      wx.setStorageSync('currentUser', user)
      api.setCurrentUserId(user.id)
      console.log('✅ 固定测试用户登录成功:', user.nickName, '(id=' + user.id + ')')
    }).catch(err => {
      console.warn('后端未连接，使用本地用户:', err.message)
    })
  },

  // 将Mock数据写入本地存储，确保离线/无后端时能正常展示内容
  seedMockData() {
    try {
      // 商品数据
      const existingProducts = storage.get(storage.STORAGE_KEYS.PRODUCTS)
      if (!existingProducts || existingProducts.length === 0) {
        storage.set(storage.STORAGE_KEYS.PRODUCTS, mockProducts)
        console.log('✅ 已初始化Mock商品数据:', mockProducts.length, '条')
      }

      // 订单数据
      const existingOrders = storage.get(storage.STORAGE_KEYS.ORDERS)
      if (!existingOrders || existingOrders.length === 0) {
        storage.set(storage.STORAGE_KEYS.ORDERS, mockOrders)
      }

      // 聊天列表
      const existingChats = storage.get('chatList')
      if (!existingChats || existingChats.length === 0) {
        storage.set('chatList', mockChatList)
      }

      // 聊天消息
      const existingMsgs = storage.get('chatMessages')
      if (!existingMsgs || Object.keys(existingMsgs).length === 0) {
        storage.set('chatMessages', mockMessages)
      }
    } catch (e) {
      console.warn('Mock数据初始化失败:', e)
    }
  },

  globalData: {
    userInfo: null,
    currentUser: null
  }
})
