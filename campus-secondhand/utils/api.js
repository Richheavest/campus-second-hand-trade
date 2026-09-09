// API 接口封装
const BASE_URL = 'http://localhost:8080'

// 当前登录用户ID（Mock模式默认1）
let currentUserId = 1

function setCurrentUserId(id) {
  currentUserId = id
}

function getCurrentUserId() {
  return currentUserId
}

// 通用请求
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    const header = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
      ...options.header
    }

    const fullUrl = BASE_URL + url
    console.log('🔄 API请求:', options.method || 'GET', fullUrl)

    wx.request({
      url: fullUrl,
      method: options.method || 'GET',
      data: options.data || {},
      header,
      success(res) {
        console.log('✅ API响应:', res.statusCode, fullUrl)
        if (res.statusCode === 200) {
          const body = res.data
          if (body.code === 200) {
            console.log('📦 数据条数:', Array.isArray(body.data) ? body.data.length : (body.data?.records?.length || body.data?.total || 'ok'))
            resolve(body.data)
          } else {
            console.warn('⚠️ 业务错误:', body.message)
            reject(new Error(body.message || '请求失败'))
          }
        } else {
          console.error('❌ HTTP错误:', res.statusCode)
          reject(new Error('网络错误 ' + res.statusCode))
        }
      },
      fail(err) {
        console.error('❌ API请求失败:', fullUrl, err)
        reject(new Error('网络连接失败，请检查网络'))
      }
    })
  })
}

// ===== 用户 =====
// 后端返回 { token, user }
function login(code, nickname, avatarUrl) {
  return request('/api/user/login', {
    method: 'POST',
    data: { code, nickname, avatarUrl }
  })
}

function getUserInfo(userId) {
  return request('/api/user/' + userId)
}

// ===== 分类 =====
function getCategories() {
  return request('/api/category/list')
}

// ===== 商品 =====
function getProducts(params = {}) {
  const { pageNum = 1, pageSize = 10, categoryId, sort = 'latest', keyword } = params
  let url = `/api/product/list?pageNum=${pageNum}&pageSize=${pageSize}&sort=${sort}`
  if (categoryId) url += '&categoryId=' + categoryId
  if (keyword) url += '&keyword=' + encodeURIComponent(keyword)
  return request(url)
}

function getProductDetail(productId) {
  return request('/api/product/' + productId)
}

function publishProduct(data) {
  return request('/api/product/publish', {
    method: 'POST',
    data
  })
}

function getSellerProducts(sellerId, excludeId, limit = 5) {
  let url = `/api/product/seller/${sellerId}?limit=${limit}`
  if (excludeId) url += '&excludeId=' + excludeId
  return request(url)
}

function getMyProducts() {
  return request('/api/product/my')
}

function updateProductStatus(productId, status) {
  return request(`/api/product/${productId}/status`, {
    method: 'PUT',
    data: { status }
  })
}

// ===== 订单 =====
function createOrder(productId) {
  return request('/api/order/create', {
    method: 'POST',
    data: { productId }
  })
}

function getOrders(role = 'buy', status) {
  let url = `/api/order/list?role=${role}`
  if (status && status !== 'all') url += '&status=' + status
  return request(url)
}

function getOrderDetail(orderId) {
  return request('/api/order/' + orderId)
}

function updateOrderStatus(orderId, status) {
  return request(`/api/order/${orderId}/status`, {
    method: 'PUT',
    data: { status }
  })
}

// ===== 消息 =====
function sendMessage(toUserId, type, content) {
  return request('/api/message/send', {
    method: 'POST',
    data: { toUserId, type, content }
  })
}

function getMessages(conversationId) {
  return request('/api/message/conversation/' + conversationId)
}

function getConversations() {
  return request('/api/message/conversations')
}

function markRead(conversationId) {
  return request(`/api/message/read/${conversationId}`, {
    method: 'PUT',
    data: {}
  })
}

// ===== 收藏 =====
function toggleFavorite(productId) {
  return request('/api/favorite/toggle', {
    method: 'POST',
    data: { productId }
  })
}

function checkFavorite(productId) {
  return request(`/api/favorite/check?productId=${productId}`)
}

function getFavorites() {
  return request('/api/favorite/list')
}

// ===== 文件上传 =====
function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    wx.uploadFile({
      url: BASE_URL + '/api/upload',
      filePath,
      name: 'file',
      header: token ? { 'Authorization': 'Bearer ' + token } : {},
      success(res) {
        if (res.statusCode === 200) {
          try {
            const body = JSON.parse(res.data)
            if (body.code === 200 && body.data && body.data.url) {
              resolve(BASE_URL + body.data.url)
            } else {
              reject(new Error(body.message || '上传失败'))
            }
          } catch (e) {
            reject(new Error('上传响应解析失败'))
          }
        } else {
          reject(new Error('上传失败 ' + res.statusCode))
        }
      },
      fail() {
        reject(new Error('图片上传失败'))
      }
    })
  })
}

module.exports = {
  BASE_URL,
  setCurrentUserId,
  getCurrentUserId,
  login,
  getUserInfo,
  getCategories,
  getProducts,
  getProductDetail,
  publishProduct,
  getSellerProducts,
  getMyProducts,
  updateProductStatus,
  createOrder,
  getOrders,
  getOrderDetail,
  updateOrderStatus,
  sendMessage,
  getMessages,
  getConversations,
  markRead,
  toggleFavorite,
  checkFavorite,
  getFavorites,
  uploadImage
}
