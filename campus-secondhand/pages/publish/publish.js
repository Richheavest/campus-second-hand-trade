// 发布商品页
const { CATEGORIES, CONDITIONS, TRADE_TYPES } = require('../../utils/constants')
const api = require('../../utils/api')

// 真实分类（去掉"全部"）
const REAL_CATEGORIES = CATEGORIES.filter(c => c.id !== 'all')

Page({
  data: {
    images: [],
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    categoryName: '',
    categoryIndex: 0,
    conditionLevel: '',
    conditionText: '',
    tradeType: '',
    tradeTypeText: '',
    categories: REAL_CATEGORIES,
    categoryRange: [{ id: '', name: '请选择分类' }].concat(REAL_CATEGORIES),
    conditions: CONDITIONS,
    tradeTypes: TRADE_TYPES,
    canSubmit: false
  },

  onChooseImage() {
    const remaining = 9 - this.data.images.length
    wx.chooseImage({
      count: remaining,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ images: [...this.data.images, ...res.tempFilePaths] }, () => this.checkCanSubmit())
      }
    })
  },

  onDeleteImage(e) {
    const { index } = e.currentTarget.dataset
    const images = [...this.data.images]
    images.splice(index, 1)
    this.setData({ images }, () => this.checkCanSubmit())
  },

  onFieldChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [field]: e.detail.value }, () => this.checkCanSubmit())
  },

  onCategoryChange(e) {
    const index = Number(e.detail.value)
    const cat = this.data.categoryRange[index]
    if (!cat) return
    this.setData({ categoryIndex: index, categoryId: cat.id || '', categoryName: cat.name }, () => this.checkCanSubmit())
  },

  onShowConditionPicker() {
    const items = this.data.conditions.map(c => c.label)
    wx.showActionSheet({
      itemList: items,
      success: (res) => {
        const cond = this.data.conditions[res.tapIndex]
        this.setData({ conditionLevel: cond.value, conditionText: cond.label }, () => this.checkCanSubmit())
      }
    })
  },

  onShowTradePicker() {
    const items = this.data.tradeTypes.map(t => t.label)
    wx.showActionSheet({
      itemList: items,
      success: (res) => {
        const trade = this.data.tradeTypes[res.tapIndex]
        this.setData({ tradeType: trade.value, tradeTypeText: trade.label }, () => this.checkCanSubmit())
      }
    })
  },

  checkCanSubmit() {
    this.setData({ canSubmit: !this.getMissingFields() })
  },

  // 返回缺失的必填项提示，全部填好则返回空字符串
  getMissingFields() {
    const { images, title, description, price, categoryId, conditionLevel, tradeType } = this.data
    if (images.length === 0) return '请上传商品图片'
    if (title.trim().length < 2) return '标题至少2个字'
    if (description.trim().length < 10) return '描述至少10个字'
    if (!(parseFloat(price) > 0)) return '请填写正确的价格'
    if (!categoryId) return '请选择分类'
    if (!conditionLevel) return '请选择新旧程度'
    if (!tradeType) return '请选择交易方式'
    return ''
  },

  async onSubmit() {
    const missing = this.getMissingFields()
    if (missing) {
      wx.showToast({ title: missing, icon: 'none' })
      return
    }

    wx.showLoading({ title: '发布中...' })

    try {
      const { images, title, description, price, originalPrice, categoryId, conditionLevel, tradeType } = this.data
      const category = this.data.categories.find(c => c.id === categoryId)

      // 先逐个上传本地图片，得到后端可访问的 URL
      const uploadedImages = []
      for (const path of images) {
        const url = await api.uploadImage(path)
        uploadedImages.push(url)
      }

      const data = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : 0,
        categoryId: category ? category.backendId : null,
        conditionLevel,
        tradeType,
        sellerId: api.getCurrentUserId(),
        images: uploadedImages
      }

      await api.publishProduct(data)
      wx.hideLoading()
      wx.showToast({ title: '发布成功', icon: 'success' })

      setTimeout(() => {
        this.resetForm()
        wx.switchTab({ url: '/pages/index/index' })
      }, 1000)
    } catch (err) {
      wx.hideLoading()
      // 降级本地Mock发布
      console.warn('API发布失败，使用本地存储:', err.message)
      this.mockPublish()
    }
  },

  mockPublish() {
    const { images, title, description, price, originalPrice, categoryId, conditionLevel, tradeType } = this.data
    const storage = require('../../utils/storage')
    const { generateId } = require('../../utils/util')
    const currentUser = storage.get(storage.STORAGE_KEYS.CURRENT_USER, {})

    const product = {
      id: 'prod_' + generateId(),
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : 0,
      images,
      category: categoryId,
      condition: conditionLevel,
      tradeType,
      seller: currentUser,
      status: 'on_sale',
      viewCount: 0,
      favoriteCount: 0,
      createTime: new Date().toISOString()
    }

    const products = storage.get(storage.STORAGE_KEYS.PRODUCTS, [])
    products.unshift(product)
    storage.set(storage.STORAGE_KEYS.PRODUCTS, products)

    wx.showToast({ title: '发布成功(离线)', icon: 'success' })
    setTimeout(() => {
      this.resetForm()
      wx.switchTab({ url: '/pages/index/index' })
    }, 1000)
  },

  resetForm() {
    this.setData({
      images: [], title: '', description: '', price: '',
      originalPrice: '', categoryId: '', categoryName: '', categoryIndex: 0,
      conditionLevel: '', conditionText: '', tradeType: '', tradeTypeText: '',
      canSubmit: false
    })
  }
})
