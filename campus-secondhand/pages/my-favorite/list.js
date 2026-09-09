// 我的收藏
const api = require('../../utils/api')

Page({
  data: { favorites: [] },

  onShow() { this.loadFavorites() },

  async loadFavorites() {
    try {
      const list = await api.getFavorites()
      const products = (list || []).map(p => ({
        ...p,
        images: (p.images && p.images.length > 0) ? p.images : [p.imageUrl || '/images/placeholder.png'],
        price: Number(p.price || 0)
      }))
      this.setData({ favorites: products })
    } catch (err) {
      console.error('加载收藏失败:', err)
      this.loadFromMock()
    }
  },

  loadFromMock() {
    const storage = require('../../utils/storage')
    const favs = storage.get(storage.STORAGE_KEYS.FAVORITES, [])
    this.setData({ favorites: favs })
  },

  onTap(e) {
    wx.navigateTo({ url: `/pages/product/detail?id=${e.currentTarget.dataset.id}` })
  },

  async onRemove(e) {
    const { id } = e.currentTarget.dataset
    try {
      await api.toggleFavorite(id)
    } catch (err) {
      const storage = require('../../utils/storage')
      storage.removeItem(storage.STORAGE_KEYS.FAVORITES, f => f.id === id)
    }
    this.loadFavorites()
    wx.showToast({ title: '已取消收藏', icon: 'none' })
  }
})
