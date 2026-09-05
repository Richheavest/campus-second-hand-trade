<template>
  <el-card>
    <template #header><span>👥 用户管理</span></template>
    <el-table :data="users" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column label="头像" width="70"><template #default="{row}"><el-avatar :src="row.avatarUrl" :size="36" /></template></el-table-column>
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="openid" label="OpenID" show-overflow-tooltip />
      <el-table-column prop="creditScore" label="信用分" width="80" align="center" />
      <el-table-column prop="createTime" label="注册时间" width="170" />
      <el-table-column label="状态" width="100">
        <template #default="{row}">
          <el-switch :model-value="row.status===1" active-text="正常" inactive-text="禁用" @change="(val) => toggleStatus(row, val)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNum" :total="total" :page-size="10" layout="total, prev, pager, next" @current-change="loadUsers" style="margin-top:16px;justify-content:flex-end" />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsers, updateUserStatus } from '../utils/api'
import { ElMessage } from 'element-plus'

const users = ref([]), loading = ref(false), pageNum = ref(1), total = ref(0)

async function loadUsers() {
  loading.value = true
  try {
    const res = await getUsers({ pageNum: pageNum.value, pageSize: 10 })
    users.value = res?.records || []
    total.value = res?.total || 0
  } catch (e) { ElMessage.warning('后端未启动，显示演示数据') }
  loading.value = false
}

async function toggleStatus(row, val) {
  try {
    await updateUserStatus(row.id, val ? 1 : 0)
    ElMessage.success(val ? '已启用' : '已禁用')
    loadUsers()
  } catch (e) { ElMessage.error('操作失败') }
}

onMounted(() => loadUsers())
</script>
