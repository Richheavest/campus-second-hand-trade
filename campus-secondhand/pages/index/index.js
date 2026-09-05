// 首页
const { CATEGORIES, SORT_TYPES } = require('../../utils/constants')
const api = require('../../utils/api')

Page({
  data: {
    categories: CATEGORIES,
    sortTypes: SORT_TYPES,
    currentCategory: 'all',
    currentSort: 'latest',
    allProducts: [],
    filteredProducts: [],
    leftList: [],
    rightList: [],
    loading: true,
    refreshing: false,
    noMore: false,
    pageSize: 10,
    currentPage: 1
  },

  onLoad() {
    this.loadProducts()
  },

  onShow() {
    this.loadProducts(false)
  },

  onPullDownRefresh() {
    this.setData({ refreshing: true })
    this.loadProducts(false).finally(() => {
      wx.stopPullDownRefresh()
      this.setData({ refreshing: false })
    })
  },

  onReachBottom() {
    if (this.data.noMore || this.data.loading) return
    this.loadMore()
  },

  async loadProducts(reset = true) {
    if (reset) {
      this.setData({ loading: true, currentPage: 1, noMore: false })
    }

    try {
      const { currentCategory, currentSort, pageSize } = this.data
      const params = {
        pageNum: 1,
        pageSize: reset ? pageSize : pageSize * 2,
        sort: currentSort
      }
      if (currentCategory !== 'all') params.categoryId = this.getCategoryId(currentCategory)

      const result = await api.getProducts(params)
      const products = (result && result.records) || []

      // 转换后端数据为小程序格式
      const formatted = products.map(p => this.formatProduct(p))

      this.setData({
        allProducts: formatted,
        filteredProducts: formatted,
        loading: false,
        noMore: !result || formatted.length < pageSize
      }, () => {
        this.splitToColumns(formatted)
      })
    } catch (err) {
      console.error('加载商品失败:', err)
      this.setData({ loading: false })
      // 降级到本地Mock
      this.loadFromMock()
    }
  },

  async loadMore() {
    const { currentPage, pageSize } = this.data
    this.setData({ loading: true })

    try {
      const params = { pageNum: currentPage + 1, pageSize, sort: this.data.currentSort }
      if (this.data.currentCategory !== 'all') params.categoryId = this.getCategoryId(this.data.currentCategory)

      const result = await api.getProducts(params)
      const products = (result && result.records) || []
      const formatted = products.map(p => this.formatProduct(p))

      const allProducts = [...this.data.allProducts, ...formatted]
      this.setData({
        allProducts,
        filteredProducts: allProducts,
        currentPage: currentPage + 1,
        loading: false,
        noMore: formatted.length < pageSize
      }, () => {
        this.splitToColumns(allProducts)
      })
    } catch (err) {
      this.setData({ loading: false, noMore: true })
    }
  },

  // 本地Mock降级
  loadFromMock() {
    const storage = require('../../utils/storage')
    const products = storage.get(storage.STORAGE_KEYS.PRODUCTS, [])
    const onSale = products.filter(p => p.status === 'on_sale')
    this.setData({ allProducts: onSale, loading: false }, () => {
      this.applyFilter()
    })
  },

  getCategoryId(categoryValue) {
    const cat = CATEGORIES.find(c => c.id === categoryValue)
    return cat ? cat.backendId || cat.id : null
  },

  formatProduct(p) {
    return {
      ...p,
      images: (p.images && p.images.length > 0) ? p.images : [p.imageUrl || '/images/placeholder.png'],
      seller: p.seller || { nickName: '未知用户', avatarUrl: '/images/avatar/avatar1.png', creditScore: 100 },
      price: Number(p.price || 0),
      originalPrice: Number(p.originalPrice || 0),
      createTime: p.createTime || new Date().toISOString()
    }
  },

  applyFilter() {
    let list = [...this.data.allProducts]
    const { currentCategory, currentSort } = this.data

    if (currentCategory !== 'all') {
      list = list.filter(p => p.category === currentCategory || p.categoryId === currentCategory)
    }

    if (currentSort === 'price_asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (currentSort === 'price_desc') {
      list.sort((a, b) => b.price - a.price)
    } else {
      list.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    }

    this.splitToColumns(list)
  },

  splitToColumns(products) {
    const leftList = [], rightList = []
    products.forEach((item, index) => {
      if (index % 2 === 0) leftList.push(item)
      else rightList.push(item)
    })
    this.setData({ leftList, rightList })
  },

  onCategoryChange(e) {
    const category = e.currentTarget.dataset.id
    if (category === this.data.currentCategory) return
    this.setData({ currentCategory: category }, () => this.loadProducts())
  },

  onSortChange(e) {
    const sort = e.currentTarget.dataset.value
    if (sort === this.data.currentSort) return
    this.setData({ currentSort: sort }, () => this.loadProducts())
  },

  onSearchTap() {
    wx.navigateTo({ url: '/pages/search/search' })
  }
})
