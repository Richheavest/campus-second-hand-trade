// 我发布的
const api = require('../../utils/api')
const { timeAgo } = require('../../utils/util')

Page({
  data: { products: [] },

  onShow() { this.loadProducts() },

  async loadProducts() {
    try {
      const list = await api.getMyProducts()
      const products = (list || []).map(p => ({
        ...p,
        statusText: p.status === 'on_sale' ? '在售' : p.status === 'sold' ? '已售' : '已下架',
        timeText: timeAgo(p.createTime),
        images: (p.images && p.images.length > 0) ? p.images : [p.imageUrl || '/images/placeholder.png'],
        price: Number(p.price || 0)
      })).sort((a, b) => new Date(b.createTime || 0) - new Date(a.createTime || 0))
      this.setData({ products })
    } catch (err) {
      console.error('加载我的发布失败:', err)
      this.loadFromMock()
    }
  },

  loadFromMock() {
    const storage = require('../../utils/storage')
    const all = storage.get(storage.STORAGE_KEYS.PRODUCTS, [])
    const user = storage.get(storage.STORAGE_KEYS.CURRENT_USER, {})
    const products = all.filter(p => p.seller?.id === user.id || p.sellerId === user.id)
      .map(p => ({
        ...p,
        statusText: p.status === 'on_sale' ? '在售' : '已售',
        timeText: timeAgo(p.createTime)
      }))
      .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    this.setData({ products })
  },

  onTapProduct(e) {
    wx.navigateTo({ url: `/pages/product/detail?id=${e.currentTarget.dataset.id}` })
  },

  async onToggleStatus(e) {
    const { id } = e.currentTarget.dataset
    const product = this.data.products.find(p => p.id === id)
    const newStatus = product.status === 'on_sale' ? 'off_shelf' : 'on_sale'
    try {
      await api.updateProductStatus(id, newStatus)
      wx.showToast({ title: '已更新', icon: 'none' })
    } catch (err) {
      // 降级本地
      const storage = require('../../utils/storage')
      storage.updateItem(storage.STORAGE_KEYS.PRODUCTS, p => p.id === id, p => ({ ...p, status: newStatus }))
      wx.showToast({ title: '已更新(离线)', icon: 'none' })
    }
    this.loadProducts()
  },

  onDelete(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '删除商品', content: '确定删除该商品吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.updateProductStatus(id, 'deleted')
          } catch (err) {
            const storage = require('../../utils/storage')
            storage.removeItem(storage.STORAGE_KEYS.PRODUCTS, p => p.id === id)
          }
          this.loadProducts()
          wx.showToast({ title: '已删除', icon: 'none' })
        }
      }
    })
  }
})
