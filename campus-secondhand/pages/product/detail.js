// 商品详情页
const { CONDITIONS, TRADE_TYPES, CATEGORIES, PRODUCT_STATUS } = require('../../utils/constants')
const api = require('../../utils/api')

Page({
  data: {
    product: null,
    images: [],
    priceInt: '',
    priceDecimal: '',
    statusText: '',
    isFavorited: false,
    sellerProducts: []
  },

  onLoad(options) {
    const { id } = options
    if (id) this.loadProduct(id)
  },

  onShow() {
    if (this.data.product) this.checkFavorite()
  },

  async loadProduct(id) {
    try {
      wx.showLoading({ title: '加载中...' })
      const product = await api.getProductDetail(id)
      if (!product) throw new Error('商品不存在')

      const condItem = CONDITIONS.find(c => c.value === product.conditionLevel)
      const tradeItem = TRADE_TYPES.find(t => t.value === product.tradeType)
      const statusItem = PRODUCT_STATUS[product.status]

      const priceStr = Number(product.price || 0).toFixed(2)
      const parts = priceStr.split('.')

      this.setData({
        product,
        images: (product.images && product.images.length > 0) ? product.images : [product.imageUrl || '/images/placeholder.png'],
        priceInt: parts[0],
        priceDecimal: parts[1],
        statusText: statusItem ? statusItem.label : '在售',
        conditionText: condItem ? condItem.label : product.conditionLevel,
        tradeTypeText: tradeItem ? tradeItem.label : product.tradeType,
        categoryName: product.categoryName || (CATEGORIES.find(c => c.backendId === product.categoryId) || {}).name || ''
      })

      // 加载卖家的其他商品
      this.loadSellerProducts(product.sellerId || product.seller?.id, id)
      // 检查收藏
      this.checkFavorite()

      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      console.error('加载商品失败:', err)
      // 降级Mock
      this.loadFromMock(id)
    }
  },

  async loadSellerProducts(sellerId, excludeId) {
    try {
      const products = await api.getSellerProducts(sellerId, excludeId, 5)
      this.setData({ sellerProducts: products || [] })
    } catch (e) { /* ignore */ }
  },

  async checkFavorite() {
    try {
      const result = await api.checkFavorite(this.data.product.id)
      this.setData({ isFavorited: result && result.isFavorited })
    } catch (e) { /* ignore */ }
  },

  // 降级Mock
  loadFromMock(id) {
    const storage = require('../../utils/storage')
    const products = storage.get(storage.STORAGE_KEYS.PRODUCTS, [])
    const product = products.find(p => p.id === id)
    if (!product) {
      wx.showToast({ title: '商品不存在', icon: 'none' })
      return
    }
    const condItem = CONDITIONS.find(c => c.value === product.condition)
    const tradeItem = TRADE_TYPES.find(t => t.value === product.tradeType)
    const priceStr = (Number(product.price) || 0).toFixed(2)
    const parts = priceStr.split('.')
    this.setData({
      product,
      images: (product.images && product.images.length > 0) ? product.images : ['/images/placeholder.png'],
      priceInt: parts[0],
      priceDecimal: parts[1],
      statusText: '在售',
      conditionText: condItem ? condItem.label : (product.condition || ''),
      tradeTypeText: tradeItem ? tradeItem.label : (product.tradeType || ''),
      categoryName: product.category || '',
      isFavorited: false
    })
    this.checkFavorite()
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset
    wx.previewImage({ urls: this.data.images, current: this.data.images[index] })
  },

  async onToggleFavorite() {
    const { product, isFavorited } = this.data
    try {
      const result = await api.toggleFavorite(product.id)
      this.setData({ isFavorited: result && result.isFavorited })
      wx.showToast({ title: result.isFavorited ? '已收藏' : '已取消收藏', icon: 'none' })
    } catch (err) {
      // 降级本地
      const storage = require('../../utils/storage')
      if (isFavorited) {
        storage.removeItem(storage.STORAGE_KEYS.FAVORITES, f => f.id === product.id)
      } else {
        storage.push(storage.STORAGE_KEYS.FAVORITES, { id: product.id, title: product.title, price: product.price, images: product.images, createTime: new Date().toISOString() })
      }
      this.setData({ isFavorited: !isFavorited })
      wx.showToast({ title: isFavorited ? '已取消收藏' : '已收藏', icon: 'none' })
    }
  },

  onContactSeller() {
    const { product } = this.data
    const sellerId = product.sellerId || product.seller?.id
    const conversationId = [api.getCurrentUserId(), sellerId].sort().join('_')
    wx.navigateTo({ url: `/pages/chat/detail?conversationId=${conversationId}` })
  },

  async onBuyNow() {
    const { product } = this.data
    if (product.status !== undefined && product.status !== 'on_sale') {
      wx.showToast({ title: '该商品已下架', icon: 'none' })
      return
    }
    try {
      wx.showLoading({ title: '下单中...' })
      const order = await api.createOrder(product.id)
      wx.hideLoading()
      wx.showToast({ title: '下单成功', icon: 'success' })
      setTimeout(() => {
        wx.redirectTo({ url: `/pages/order/detail?id=${order.id}` })
      }, 1000)
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '下单失败', icon: 'none' })
    }
  },

  onTapProduct(e) {
    const { id } = e.currentTarget.dataset
    wx.redirectTo({ url: `/pages/product/detail?id=${id}` })
  }
})
