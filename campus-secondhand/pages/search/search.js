// 搜索页
const api = require('../../utils/api')
const storage = require('../../utils/storage')

Page({
  data: {
    keyword: '',
    searchHistory: [],
    hotSearches: ['iPhone', '考研', '键盘', '冰箱', '球拍', '神仙水', '羽绒服'],
    searchResults: [],
    showResult: false
  },

  onLoad() {
    const history = storage.get('searchHistory', [])
    this.setData({ searchHistory: history })
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value })
    if (!e.detail.value.trim()) {
      this.setData({ showResult: false, searchResults: [] })
    }
  },

  async onSearch() {
    const keyword = this.data.keyword.trim()
    if (!keyword) return
    this.doSearch()
  },

  async doSearch() {
    const keyword = this.data.keyword.trim()
    if (!keyword) return

    wx.showLoading({ title: '搜索中...' })

    try {
      const result = await api.getProducts({ keyword, pageSize: 20 })
      const products = (result && result.records) || []
      this.setData({ searchResults: products, showResult: true })
    } catch (err) {
      console.error('搜索失败:', err)
      // 本地搜索降级
      this.localSearch(keyword)
    }

    wx.hideLoading()
    // 保存搜索历史
    const history = storage.get('searchHistory', []).filter(h => h !== keyword)
    history.unshift(keyword)
    if (history.length > 10) history.pop()
    storage.set('searchHistory', history)
    this.setData({ searchHistory: history })
  },

  localSearch(keyword) {
    const products = storage.get(storage.STORAGE_KEYS.PRODUCTS, [])
    const results = products.filter(p =>
      p.status === 'on_sale' &&
      (p.title.toLowerCase().includes(keyword.toLowerCase()) ||
       p.description.toLowerCase().includes(keyword.toLowerCase()))
    )
    this.setData({ searchResults: results, showResult: true })
  },

  onClear() {
    this.setData({ keyword: '', showResult: false, searchResults: [] })
  },

  onCancel() { wx.navigateBack() },

  onClearHistory() {
    storage.set('searchHistory', [])
    this.setData({ searchHistory: [] })
    wx.showToast({ title: '已清空', icon: 'none' })
  },

  onTapHistory(e) {
    const { keyword } = e.currentTarget.dataset
    this.setData({ keyword }, () => this.doSearch())
  },

  onTapProduct(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/product/detail?id=${id}` })
  }
})
