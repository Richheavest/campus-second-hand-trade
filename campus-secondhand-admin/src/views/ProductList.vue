<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span>📦 商品管理</span>
        <div>
          <el-input v-model="keyword" placeholder="搜索商品..." style="width:220px" clearable @clear="loadProducts" @keyup.enter="loadProducts" />
          <el-select v-model="statusFilter" placeholder="状态" style="width:120px;margin-left:10px" clearable @change="loadProducts">
            <el-option label="在售" value="on_sale" /><el-option label="已售" value="sold" /><el-option label="已下架" value="off_shelf" />
          </el-select>
          <el-button type="primary" style="margin-left:10px" @click="loadProducts">查询</el-button>
        </div>
      </div>
    </template>
    <el-table :data="products" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column label="商品" min-width="250">
        <template #default="{row}">
          <div style="display:flex;align-items:center;gap:10px">
            <el-image :src="row.images?.[0]||row.imageUrl" style="width:50px;height:50px;border-radius:6px" fit="cover" />
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100"><template #default="{row}">¥{{ row.price }}</template></el-table-column>
      <el-table-column prop="seller?.nickname" label="卖家" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="{row}">
          <el-tag :type="row.status==='on_sale'?'success':row.status==='sold'?'info':'danger'" size="small">{{ statusMap[row.status] || row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{row}">
          <el-button size="small" v-if="row.status==='on_sale'" @click="handleStatus(row,'off_shelf')">下架</el-button>
          <el-button size="small" v-if="row.status==='off_shelf'" type="success" @click="handleStatus(row,'on_sale')">上架</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNum" :total="total" :page-size="10" layout="total, prev, pager, next" @current-change="loadProducts" style="margin-top:16px;justify-content:flex-end" />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProducts, updateProductStatus, deleteProduct } from '../utils/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const products = ref([]), loading = ref(false), pageNum = ref(1), total = ref(0)
const keyword = ref(''), statusFilter = ref('')
const statusMap = { on_sale: '在售', sold: '已售', off_shelf: '已下架' }

async function loadProducts() {
  loading.value = true
  try {
    const res = await getProducts({ pageNum: pageNum.value, pageSize: 10, keyword: keyword.value, status: statusFilter.value })
    products.value = res?.records || []
    total.value = res?.total || 0
  } catch (e) { ElMessage.warning('后端未启动') }
  loading.value = false
}

async function handleStatus(row, status) {
  try { await updateProductStatus(row.id, status); ElMessage.success('已更新'); loadProducts() } catch (e) { ElMessage.error('操作失败') }
}

function handleDelete(row) {
  ElMessageBox.confirm('确定删除该商品？', '提示', { type: 'warning' }).then(async () => {
    try { await deleteProduct(row.id); ElMessage.success('已删除'); loadProducts() } catch (e) { ElMessage.error('删除失败') }
  }).catch(() => {})
}

onMounted(() => loadProducts())
</script>
