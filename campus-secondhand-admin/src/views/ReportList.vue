<template>
  <el-card>
    <template #header><span>⚠️ 举报管理</span></template>
    <el-table :data="reports" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="product?.title" label="被举报商品" show-overflow-tooltip />
      <el-table-column prop="reporter?.nickname" label="举报人" width="100" />
      <el-table-column prop="reason" label="举报原因" width="120"><template #default="{row}"><el-tag size="small">{{ row.reason }}</el-tag></template></el-table-column>
      <el-table-column prop="description" label="详细说明" show-overflow-tooltip />
      <el-table-column label="状态" width="100">
        <template #default="{row}">
          <el-tag :type="row.status==='pending'?'warning':row.status==='resolved'?'success':'info'" size="small">{{ statusMap[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{row}">
          <el-button size="small" type="danger" v-if="row.status==='pending'" @click="handleReport(row, 'resolved')">下架商品</el-button>
          <el-button size="small" v-if="row.status==='pending'" @click="handleReport(row, 'dismissed')">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getReports, handleReport } from '../utils/api'
import { ElMessage } from 'element-plus'

const reports = ref([]), loading = ref(false)
const statusMap = { pending: '待处理', resolved: '已处理', dismissed: '已驳回' }

async function loadReports() {
  loading.value = true
  try { const res = await getReports({ pageSize: 20 }); reports.value = res?.records || [] } catch (e) { ElMessage.warning('后端未启动') }
  loading.value = false
}

async function handleReportFn(row, status) {
  try {
    await handleReport(row.id, { status, remark: status === 'resolved' ? '已下架商品' : '举报不成立' })
    ElMessage.success('处理成功')
    loadReports()
  } catch (e) { ElMessage.error('操作失败') }
}

onMounted(() => loadReports())
</script>
