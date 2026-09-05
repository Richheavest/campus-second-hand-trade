// 商品卡片组件
const util = require('../../utils/util')

Component({
  properties: {
    product: {
      type: Object,
      value: null
    }
  },

  data: {
    priceInt: '',
    priceDecimal: '',
    timeText: ''
  },

  observers: {
    'product'(product) {
      if (!product) return
      try {
        const priceStr = (Number(product.price) || 0).toFixed(2)
        const parts = priceStr.split('.')
        this.setData({
          priceInt: parts[0],
          priceDecimal: parts[1],
          timeText: util.timeAgo(product.createTime || new Date().toISOString())
        })
      } catch (e) {
        console.error('product-card observer error:', e, product)
      }
    }
  },

  methods: {
    onTap() {
      const { product } = this.properties
      if (!product) return
      wx.navigateTo({
        url: `/pages/product/detail?id=${product.id}`
      })
    },
    onImageError() {
      // 图片加载失败静默处理
    }
  }
})
