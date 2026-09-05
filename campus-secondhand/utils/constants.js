// 常量定义

// 商品分类
const CATEGORIES = [
  { id: 'all', name: '全部', icon: '📦', backendId: null },
  { id: 'digital', name: '数码', icon: '📱', backendId: 1 },
  { id: 'book', name: '书籍', icon: '📚', backendId: 2 },
  { id: 'life', name: '生活', icon: '🏠', backendId: 3 },
  { id: 'clothing', name: '服饰', icon: '👗', backendId: 4 },
  { id: 'beauty', name: '美妆', icon: '💄', backendId: 5 },
  { id: 'sports', name: '运动', icon: '⚽', backendId: 6 },
  { id: 'other', name: '其他', icon: '📌', backendId: 7 }
]

// 新旧程度
const CONDITIONS = [
  { value: 'brand_new', label: '全新未拆' },
  { value: 'like_new', label: '几乎全新' },
  { value: 'slightly_used', label: '轻微使用痕迹' },
  { value: 'normally_used', label: '正常使用痕迹' }
]

// 交易方式
const TRADE_TYPES = [
  { value: 'self_pickup', label: '校内自提' },
  { value: 'express', label: '快递邮寄' },
  { value: 'both', label: '都可以' }
]

// 订单状态
const ORDER_STATUS = {
  pending: { label: '待付款', color: '#FF9800' },
  paid: { label: '待发货', color: '#1890FF' },
  shipped: { label: '待收货', color: '#722ED1' },
  received: { label: '已完成', color: '#52C41A' },
  cancelled: { label: '已取消', color: '#999999' }
}

// 商品状态
const PRODUCT_STATUS = {
  on_sale: { label: '在售', color: '#52C41A' },
  sold: { label: '已售', color: '#999999' },
  off_shelf: { label: '已下架', color: '#FF4D4F' }
}

// 排序方式
const SORT_TYPES = [
  { value: 'latest', label: '最新发布' },
  { value: 'price_asc', label: '价格最低' },
  { value: 'price_desc', label: '价格最高' }
]

module.exports = {
  CATEGORIES,
  CONDITIONS,
  TRADE_TYPES,
  ORDER_STATUS,
  PRODUCT_STATUS,
  SORT_TYPES
}
