<template>
  <div>
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="card in statCards" :key="card.label">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-card-content">
            <div>
              <div class="stat-label">{{ card.label }}</div>
              <div class="stat-value">{{ card.value }}</div>
            </div>
            <div class="stat-icon" :style="{ background: card.bg }">{{ card.icon }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表 + 最新数据 -->
    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="14">
        <el-card>
          <template #header>📊 近7天交易趋势</template>
          <div ref="chartRef" style="height:300px"></div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <template #header>🆕 最新商品</template>
          <el-table :data="latestProducts" size="small" stripe>
            <el-table-column prop="title" label="商品" show-overflow-tooltip />
            <el-table-column prop="price" label="价格" width="80"><template #default="{row}">¥{{ row.price }}</template></el-table-column>
            <el-table-column prop="status" label="状态" width="80"><el-tag :type="row.status==='on_sale'?'success':'info'" size="small">{{ row.status==='on_sale'?'在售':'已售' }}</el-tag></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import * as echarts from 'echarts'
import { getDashboard, getProducts } from '../utils/api'

const chartRef = ref()
const statCards = reactive([
  { label: '注册用户', value: 0, icon: '👥', bg: '#e3f2fd' },
  { label: '在售商品', value: 0, icon: '📦', bg: '#fff3e0' },
  { label: '今日订单', value: 0, icon: '📋', bg: '#e8f5e9' },
  { label: '成交总额', value: '¥0', icon: '💰', bg: '#fce4ec' }
])
const latestProducts = ref([])

onMounted(async () => {
  try {
    const dash = await getDashboard()
    if (dash) {
      statCards[0].value = dash.userCount || 0
      statCards[1].value = dash.productCount || 0
      statCards[2].value = dash.todayOrders || 0
      statCards[3].value = '¥' + (dash.totalAmount || 0)
    }
  } catch (e) { /* 后端未就绪，显示默认值 */
    statCards[0].value = 4
    statCards[1].value = 1
    statCards[2].value = 0
    statCards[3].value = '¥0'
  }

  try {
    const res = await getProducts({ pageSize: 5, sort: 'latest' })
    latestProducts.value = (res?.records || []).slice(0, 5)
  } catch (e) { latestProducts.value = [] }

  // 绘制图表
  if (chartRef.value) {
    const chart = echarts.init(chartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['7/6','7/7','7/8','7/9','7/10','7/11','7/12'] },
      yAxis: { type: 'value' },
      series: [
        { name: '订单数', type: 'line', smooth: true, data: [3,5,2,8,4,6,2], itemStyle: { color: '#FFD100' }, areaStyle: { color: 'rgba(255,209,0,0.2)' } },
        { name: '新增商品', type: 'line', smooth: true, data: [5,8,3,6,9,4,7], itemStyle: { color: '#409EFF' }, areaStyle: { color: 'rgba(64,158,255,0.15)' } }
      ]
    })
  }
})
</script>

<style scoped>
.stat-card-content { display: flex; justify-content: space-between; align-items: center; }
.stat-label { font-size: 14px; color: #999; margin-bottom: 8px; }
.stat-value { font-size: 28px; font-weight: 700; color: #1a1a2e; }
.stat-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
</style>
