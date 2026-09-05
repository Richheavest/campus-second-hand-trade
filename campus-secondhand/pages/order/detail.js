// 订单详情
const api = require('../../utils/api')
const { ORDER_STATUS } = require('../../utils/constants')

const STATUS_ICONS = {
  pending: '⏳', paid: '✅', shipped: '🚚', received: '🎉', cancelled: '❌'
}

Page({
  data: { order: null, orderId: '', statusTimeline: [] },

  onLoad(options) {
    if (options.id) {
      this.setData({ orderId: options.id })
      this.loadOrder()
    }
  },

  onShow() { if (this.data.orderId) this.loadOrder() },

  async loadOrder() {
    try {
      const result = await api.getOrderDetail(this.data.orderId)
      const order = result.order || result
      const timeline = result.statusTimeline || order.statusTimeline || []
      const si = ORDER_STATUS[order.status] || {}

      this.setData({
        order: {
          ...order,
          statusLabel: si.label || order.status,
          statusColor: si.color || '#999',
          statusIcon: STATUS_ICONS[order.status] || '📋',
          product: {
            images: [order.productImage || '/images/placeholder.png'],
            title: order.productTitle || '商品',
            price: order.price
          },
          seller: order.seller || { nickName: '卖家', avatarUrl: '/images/avatar/avatar1.png' },
          buyer: order.buyer || { nickName: '买家', avatarUrl: '/images/avatar/avatar1.png' },
          totalPrice: order.totalPrice || order.price
        },
        statusTimeline: timeline
      })
    } catch (err) {
      console.error('加载订单详情失败:', err)
      this.loadFromMock()
    }
  },

  loadFromMock() {
    const storage = require('../../utils/storage')
    const orders = storage.get(storage.STORAGE_KEYS.ORDERS, [])
    const order = orders.find(o => o.id === this.data.orderId)
    if (!order) return
    const si = ORDER_STATUS[order.status] || {}
    this.setData({
      order: {
        ...order,
        statusLabel: si.label || order.status,
        statusColor: si.color || '#999',
        statusIcon: STATUS_ICONS[order.status] || '📋'
      }
    })
  },

  timelineLabel(status) {
    const info = ORDER_STATUS[status]
    return info ? info.label : status
  },

  onTapProduct(e) {
    wx.navigateTo({ url: `/pages/product/detail?id=${e.currentTarget.dataset.id}` })
  },

  onCancel() {
    wx.showModal({
      title: '取消订单', content: '确定取消该订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try { await api.updateOrderStatus(this.data.orderId, 'cancelled') } catch (e) {}
          this.loadOrder()
        }
      }
    })
  },

  onPay() {
    wx.showLoading({ title: '支付中...' })
    setTimeout(async () => {
      try { await api.updateOrderStatus(this.data.orderId, 'paid') } catch (e) {}
      wx.hideLoading()
      wx.showToast({ title: '支付成功', icon: 'success' })
      this.loadOrder()
    }, 1000)
  },

  onConfirm() {
    wx.showModal({
      title: '确认收货', content: '确定已收到商品吗？确认后钱款将打给卖家。',
      success: async (res) => {
        if (res.confirm) {
          try { await api.updateOrderStatus(this.data.orderId, 'received') } catch (e) {}
          wx.showToast({ title: '收货成功', icon: 'success' })
          this.loadOrder()
        }
      }
    })
  }
})
