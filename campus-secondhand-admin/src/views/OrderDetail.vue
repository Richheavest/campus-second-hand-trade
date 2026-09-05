<template>
  <el-card>
    <template #header>
      <div style="display:flex;align-items:center;gap:12px">
        <el-button text @click="$router.back()">← 返回</el-button>
        <span>订单详情 - {{ order.orderNo }}</span>
      </div>
    </template>
    <el-descriptions v-if="order.id" :column="2" border>
      <el-descriptions-item label="订单号">{{ order.orderNo }}</el-descriptions-item>
      <el-descriptions-item label="状态"><el-tag :type="statusType(order.status)">{{ statusMap[order.status] }}</el-tag></el-descriptions-item>
      <el-descriptions-item label="商品">{{ order.productTitle }}</el-descriptions-item>
      <el-descriptions-item label="金额">¥{{ order.totalPrice || order.price }}</el-descriptions-item>
      <el-descriptions-item label="买家">{{ order.buyer?.nickname || '-' }}</el-descriptions-item>
      <el-descriptions-item label="卖家">{{ order.seller?.nickname || '-' }}</el-descriptions-item>
      <el-descriptions-item label="运费">¥{{ order.freight || 0 }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ order.createTime }}</el-descriptions-item>
    </el-descriptions>
    <el-timeline v-if="timeline.length" style="margin-top:24px">
      <el-timeline-item v-for="t in timeline" :key="t.id" :timestamp="t.createTime" placement="top">
        {{ statusMap[t.status] || t.status }} - {{ t.remark || '' }}
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const order = ref({})
const timeline = ref([])
const statusMap = { pending:'待付款', paid:'待发货', shipped:'待收货', received:'已完成', cancelled:'已取消' }

function statusType(s) {
  return s==='pending'?'warning':s==='paid'?'':s==='shipped'?'primary':s==='received'?'success':'info'
}

onMounted(async () => {
  try {
    const res = await axios.get(`/api/order/${route.params.id}`)
    if (res.data.code === 200) {
      order.value = res.data.data.order || res.data.data
      timeline.value = res.data.data.statusTimeline || []
    }
  } catch (e) { console.error(e) }
})
</script>
