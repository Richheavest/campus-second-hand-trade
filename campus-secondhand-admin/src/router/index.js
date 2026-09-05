import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('../views/Login.vue'), meta: { title: '登录' } },
  {
    path: '/layout', component: () => import('../layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', component: () => import('../views/Dashboard.vue'), meta: { title: '数据概览' } },
      { path: 'users', component: () => import('../views/UserList.vue'), meta: { title: '用户管理' } },
      { path: 'products', component: () => import('../views/ProductList.vue'), meta: { title: '商品管理' } },
      { path: 'orders', component: () => import('../views/OrderList.vue'), meta: { title: '订单管理' } },
      { path: 'orders/:id', component: () => import('../views/OrderDetail.vue'), meta: { title: '订单详情' } },
      { path: 'categories', component: () => import('../views/CategoryManage.vue'), meta: { title: '分类管理' } },
      { path: 'reports', component: () => import('../views/ReportList.vue'), meta: { title: '举报管理' } }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 登录守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('adminToken')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
