<template>
  <el-container class="layout">
    <el-aside width="220px" class="aside">
      <div class="logo">🔄 校园二手管理后台</div>
      <el-menu :default-active="activeMenu" router background-color="#1a1a2e" text-color="#a0a0b8" active-text-color="#FFD100">
        <el-menu-item index="/layout/dashboard"><el-icon><DataAnalysis /></el-icon>数据概览</el-menu-item>
        <el-menu-item index="/layout/users"><el-icon><User /></el-icon>用户管理</el-menu-item>
        <el-menu-item index="/layout/products"><el-icon><Goods /></el-icon>商品管理</el-menu-item>
        <el-menu-item index="/layout/orders"><el-icon><Document /></el-icon>订单管理</el-menu-item>
        <el-menu-item index="/layout/categories"><el-icon><Menu /></el-icon>分类管理</el-menu-item>
        <el-menu-item index="/layout/reports"><el-icon><Warning /></el-icon>举报管理</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <span class="header-title">{{ pageTitle }}</span>
        <el-button text @click="logout">退出登录</el-button>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const activeMenu = computed(() => route.path)
const pageTitle = computed(() => route.meta?.title || '管理后台')

function logout() {
  localStorage.removeItem('adminToken')
  router.push('/login')
}
</script>

<style>
.layout { height: 100vh; }
.aside { background: #1a1a2e; overflow-y: auto; }
.logo { color: #FFD100; font-size: 18px; font-weight: 700; text-align: center; padding: 20px 10px; border-bottom: 1px solid #2a2a4e; }
.el-menu { border-right: none !important; }
.header { background: #fff; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 4px rgba(0,0,0,0.08); padding: 0 24px; }
.header-title { font-size: 18px; font-weight: 600; }
.main { background: #f5f5f5; padding: 24px; }
</style>
