import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 响应拦截
http.interceptors.response.use(
  res => {
    if (res.data.code === 200) return res.data.data
    throw new Error(res.data.message || '请求失败')
  },
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken')
      window.location.hash = '#/login'
    }
    throw err
  }
)

// ===== 仪表盘 =====
export const getDashboard = () => http.get('/admin/dashboard')

// ===== 用户 =====
export const getUsers = (params) => http.get('/admin/users', { params })
export const updateUserStatus = (id, status) => http.put(`/admin/users/${id}/status`, { status })

// ===== 商品 =====
export const getProducts = (params) => http.get('/admin/products', { params })
export const updateProductStatus = (id, status) => http.put(`/admin/products/${id}/status`, { status })
export const deleteProduct = (id) => http.delete(`/admin/products/${id}`)

// ===== 订单 =====
export const getOrders = (params) => http.get('/admin/orders', { params })

// ===== 分类 =====
export const getCategories = () => http.get('/category/list')
export const getAdminCategories = () => http.get('/admin/categories')
export const createCategory = (data) => http.post('/admin/categories', data)
export const updateCategory = (id, data) => http.put(`/admin/categories/${id}`, data)
export const deleteCategory = (id) => http.delete(`/admin/categories/${id}`)

// ===== 举报 =====
export const getReports = (params) => http.get('/admin/reports', { params })
export const handleReport = (id, data) => http.put(`/admin/reports/${id}`, data)

export default http
