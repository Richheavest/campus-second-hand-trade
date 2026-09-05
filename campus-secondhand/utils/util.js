// 工具函数

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 相对时间（几分钟前、几小时前、几天前）
const timeAgo = (dateStr) => {
  const now = new Date()
  // 兼容后端 Jackson 序列化的 ISO 格式（"yyyy-MM-dd HH:mm:ss" 或 "yyyy-MM-ddTHH:mm:ss"）
  // iOS Safari 不支持带 '-' 的日期字符串，统一替换为 '/' 并移除 'T'
  const normalized = dateStr.replace(/-/g, '/').replace('T', ' ')
  const date = new Date(normalized)
  const diff = now - date
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '刚刚'
  if (diff < hour) return Math.floor(diff / minute) + '分钟前'
  if (diff < day) return Math.floor(diff / hour) + '小时前'
  if (diff < 3 * day) return Math.floor(diff / day) + '天前'
  // 超过3天显示具体日期
  const m = date.getMonth() + 1
  const d = date.getDate()
  return m + '-' + d
}

// 生成唯一ID
const generateId = () => {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// 防抖
const debounce = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

module.exports = {
  formatTime,
  formatNumber,
  timeAgo,
  generateId,
  debounce
}
