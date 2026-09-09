// 订单列表
const api = require('../../utils/api')
const { timeAgo } = require('../../utils/util')
const { ORDER_STATUS } = require('../../utils/constants')

Page({
  data: {
    tabs: [
      { value: 'all', label: '全部' },
      { value: 'pending', label: '待付款' },
      { value: 'paid', label: '待发货' },
      { value: 'shipped', label: '待收货' },
      { value: 'completed', label: '已完成' }
    ],
    currentTab: 'all',
    orders: [],
    filteredOrders: [],
    listType: 'buy'
  },

  onLoad(options) {
    const { type } = options
    this.setData({ listType: type || 'buy' })
    if (type === 'sell') wx.setNavigationBarTitle({ title: '我卖出的' })
    this.loadOrders()
  },

  onShow() { this.loadOrders() },

  async loadOrders() {
    try {
      const orders = await api.getOrders(this.data.listType)
      const formatted = (orders || []).map(o => {
        const si = ORDER_STATUS[o.status] || {}
        return {
          ...o,
          statusLabel: si.label || o.status,
          statusColor: si.color || '#999',
          createTimeText: timeAgo(o.createTime),
          seller: o.seller || { nickName: '用户', avatarUrl: '/images/avatar/avatar1.png' },
          product: {
            ...o,
            images: [o.productImage || '/images/placeholder.png'],
            title: o.productTitle || '商品',
            price: o.price
          },
          totalPrice: o.totalPrice || o.price
        }
      })
      this.setData({ orders: formatted }, () => this.applyFilter())
    } catch (err) {
      console.error('加载订单失败:', err)
      this.loadFromMock()
    }
  },

  loadFromMock() {
    const storage = require('../../utils/storage')
    const orders = storage.get(storage.STORAGE_KEYS.ORDERS, [])
    const formatted = orders.map(o => {
      const si = ORDER_STATUS[o.status] || {}
      return { ...o, statusLabel: si.label || o.status, statusColor: si.color || '#999', createTimeText: timeAgo(o.createTime) }
    })
    this.setData({ orders: formatted }, () => this.applyFilter())
  },

  applyFilter() {
    const { currentTab, orders } = this.data
    let filtered = orders
    if (currentTab !== 'all') {
      if (currentTab === 'completed') {
        filtered = orders.filter(o => o.status === 'received' || o.status === 'completed')
      } else {
        filtered = orders.filter(o => o.status === currentTab)
      }
    }
    this.setData({ filteredOrders: filtered })
  },

  onTabChange(e) {
    this.setData({ currentTab: e.currentTarget.dataset.value }, () => this.applyFilter())
  },

  onTapOrder(e) {
    wx.navigateTo({ url: `/pages/order/detail?id=${e.currentTarget.dataset.id}` })
  },

  onCancelOrder(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '取消订单', content: '确定取消该订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.updateOrderStatus(id, 'cancelled')
          } catch (err) { console.error(err) }
          this.loadOrders()
        }
      }
    })
  },

  onPayOrder(e) {
    const { id } = e.currentTarget.dataset
    wx.showLoading({ title: '支付中...' })
    setTimeout(async () => {
      try { await api.updateOrderStatus(id, 'paid') } catch (e) {}
      wx.hideLoading()
      wx.showToast({ title: '支付成功', icon: 'success' })
      this.loadOrders()
    }, 1000)
  },

  onConfirmReceive(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认收货', content: '确定已收到商品吗？',
      success: async (res) => {
        if (res.confirm) {
          try { await api.updateOrderStatus(id, 'received') } catch (e) {}
          wx.showToast({ title: '收货成功', icon: 'success' })
          this.loadOrders()
        }
      }
    })
  }
})
