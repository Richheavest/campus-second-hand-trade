<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span>📋 订单管理</span>
        <div>
          <el-select v-model="statusFilter" placeholder="状态" style="width:130px" clearable @change="loadOrders">
            <el-option label="待付款" value="pending" /><el-option label="待发货" value="paid" />
            <el-option label="待收货" value="shipped" /><el-option label="已完成" value="received" />
          </el-select>
          <el-button type="primary" style="margin-left:10px" @click="loadOrders">查询</el-button>
        </div>
      </div>
    </template>
    <el-table :data="orders" stripe v-loading="loading">
      <el-table-column prop="orderNo" label="订单号" width="180" />
      <el-table-column prop="productTitle" label="商品" show-overflow-tooltip />
      <el-table-column prop="totalPrice" label="金额" width="100"><template #default="{row}">¥{{ row.totalPrice || row.price }}</template></el-table-column>
      <el-table-column prop="buyer?.nickname" label="买家" width="100" />
      <el-table-column prop="seller?.nickname" label="卖家" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="{row}">
          <el-tag :type="statusType(row.status)" size="small">{{ statusMap[row.status] || row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="时间" width="160" />
      <el-table-column label="操作" width="100">
        <template #default="{row}">
          <el-button size="small" @click="$router.push(`/layout/orders/${row.id}`)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNum" :total="total" :page-size="10" layout="total, prev, pager, next" @current-change="loadOrders" style="margin-top:16px;justify-content:flex-end" />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrders } from '../utils/api'
import { ElMessage } from 'element-plus'

const orders = ref([]), loading = ref(false), pageNum = ref(1), total = ref(0), statusFilter = ref('')
const statusMap = { pending:'待付款', paid:'待发货', shipped:'待收货', received:'已完成', cancelled:'已取消' }

function statusType(s) {
  return s==='pending'?'warning':s==='paid'?'':s==='shipped'?'primary':s==='received'?'success':'info'
}

async function loadOrders() {
  loading.value = true
  try {
    const res = await getOrders({ pageNum: pageNum.value, pageSize: 10, status: statusFilter.value })
    orders.value = res?.records || []
    total.value = res?.total || 0
  } catch (e) { ElMessage.warning('后端未启动') }
  loading.value = false
}

onMounted(() => loadOrders())
</script>
