// 本地存储封装

const STORAGE_KEYS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  FAVORITES: 'favorites',
  CHAT_LIST: 'chatList',
  CHAT_MESSAGES: 'chatMessages',
  SEARCH_HISTORY: 'searchHistory',
  CURRENT_USER: 'currentUser',
  PUBLISH_DRAFT: 'publishDraft'
}

// 获取
function get(key, defaultValue = null) {
  try {
    const value = wx.getStorageSync(key)
    // wx.getStorageSync 在 key 不存在时可能返回 ''、undefined 或 null
    if (value === '' || value === undefined || value === null) {
      return defaultValue
    }
    return value
  } catch (e) {
    console.error(`Storage get [${key}] error:`, e)
    return defaultValue
  }
}

// 设置
function set(key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (e) {
    console.error(`Storage set [${key}] error:`, e)
  }
}

// 删除
function remove(key) {
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    console.error(`Storage remove [${key}] error:`, e)
  }
}

// 获取数组并追加
function push(key, item) {
  const arr = get(key, [])
  arr.push(item)
  set(key, arr)
  return arr
}

// 获取数组并更新某项
function updateItem(key, predicate, updater) {
  const arr = get(key, [])
  const index = arr.findIndex(predicate)
  if (index !== -1) {
    arr[index] = updater(arr[index])
    set(key, arr)
  }
  return arr
}

// 获取数组并删除某项
function removeItem(key, predicate) {
  const arr = get(key, [])
  const filtered = arr.filter(item => !predicate(item))
  set(key, filtered)
  return filtered
}

module.exports = {
  STORAGE_KEYS,
  get,
  set,
  remove,
  push,
  updateItem,
  removeItem
}
