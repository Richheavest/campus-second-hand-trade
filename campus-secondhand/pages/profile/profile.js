// 个人中心
const api = require('../../utils/api')

Page({
  data: {
    userInfo: {},
    stats: { selling: 0, sold: 0, favorites: 0 },
    cacheSize: '0KB'
  },

  onShow() {
    this.loadUserInfo()
    this.loadStats()
    this.loadCacheSize()
  },

  loadUserInfo() {
    const user = wx.getStorageSync('currentUser')
    if (user && user.id) {
      this.setData({ userInfo: user })
    }
    // 异步更新
    const userId = api.getCurrentUserId()
    api.getUserInfo(userId).then(u => {
      if (u) {
        // 统一字段名：后端返回 nickname，前端各处使用 nickName
        u.nickName = u.nickname || u.nickName
        wx.setStorageSync('currentUser', u)
        this.setData({ userInfo: u })
      }
    }).catch(() => {})
  },

  async loadStats() {
    const userId = api.getCurrentUserId()
    try {
      const [products, favorites] = await Promise.all([
        api.getMyProducts(userId).catch(() => []),
        api.getFavorites(userId).catch(() => [])
      ])
      const list = products || []
      this.setData({
        stats: {
          selling: list.filter(p => p.status === 'on_sale').length,
          sold: list.filter(p => p.status === 'sold').length,
          favorites: (favorites || []).length
        }
      })
    } catch (err) {
      this.loadMockStats()
    }
  },

  loadMockStats() {
    const storage = require('../../utils/storage')
    const products = storage.get(storage.STORAGE_KEYS.PRODUCTS, [])
    const favorites = storage.get(storage.STORAGE_KEYS.FAVORITES, [])
    const user = storage.get(storage.STORAGE_KEYS.CURRENT_USER, {})
    this.setData({
      stats: {
        selling: products.filter(p => p.seller?.id === user.id && p.status === 'on_sale').length,
        sold: products.filter(p => p.seller?.id === user.id && p.status === 'sold').length,
        favorites: favorites.length
      }
    })
  },

  loadCacheSize() {
    try {
      const res = wx.getStorageInfoSync()
      const kb = res.currentSize
      this.setData({ cacheSize: kb < 1024 ? kb + 'KB' : (kb / 1024).toFixed(1) + 'MB' })
    } catch (e) {}
  },

  onChooseAvatar() {
    wx.showToast({ title: '演示模式，暂不支持修改', icon: 'none' })
  },

  onTapMyPublish() { wx.navigateTo({ url: '/pages/my-publish/list' }) },
  onTapMyFavorite() { wx.navigateTo({ url: '/pages/my-favorite/list' }) },

  onTapMyOrders(e) {
    const { type } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/order/list?type=${type}` })
  },

  onTapSold() { wx.navigateTo({ url: '/pages/order/list?type=sell' }) },
  onTapAbout() { wx.navigateTo({ url: '/pages/about/about' }) },

  onClearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '将清除所有本地数据，确定继续？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync()
          this.loadCacheSize()
          this.loadStats()
          wx.showToast({ title: '已清除', icon: 'none' })
        }
      }
    })
  }
})
