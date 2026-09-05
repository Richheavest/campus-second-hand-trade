<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span>📂 分类管理</span>
        <el-button type="primary" @click="openDialog()">+ 新增分类</el-button>
      </div>
    </template>
    <el-table :data="categories" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="icon" label="图标" width="80" align="center"><template #default="{row}"><span style="font-size:24px">{{ row.icon }}</span></template></el-table-column>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="sortOrder" label="排序" width="80" align="center" />
      <el-table-column label="状态" width="100">
        <template #default="{row}"><el-tag :type="row.status===1?'success':'info'" size="small">{{ row.status===1?'启用':'禁用' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{row}">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 新增/编辑弹窗 -->
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="420px">
    <el-form :model="form" label-width="80px">
      <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
      <el-form-item label="图标"><el-input v-model="form.icon" placeholder="emoji图标，如 📱" /></el-form-item>
      <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" /></el-form-item>
      <el-form-item label="状态"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="saveCategory">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getCategories, getAdminCategories, createCategory, updateCategory, deleteCategory } from '../utils/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const categories = ref([]), loading = ref(false), dialogVisible = ref(false), editId = ref(null)
const form = reactive({ name: '', icon: '', sortOrder: 0, status: 1 })
const dialogTitle = computed(() => editId.value ? '编辑分类' : '新增分类')

async function loadCategories() {
  loading.value = true
  try { const res = await getCategories(); categories.value = res || [] } catch (e) { ElMessage.warning('后端未启动') }
  loading.value = false
}

function openDialog(row) {
  if (row) {
    editId.value = row.id
    Object.assign(form, { name: row.name, icon: row.icon, sortOrder: row.sortOrder, status: row.status })
  } else {
    editId.value = null
    Object.assign(form, { name: '', icon: '', sortOrder: 0, status: 1 })
  }
  dialogVisible.value = true
}

async function saveCategory() {
  try {
    if (editId.value) {
      await updateCategory(editId.value, { ...form })
    } else {
      await createCategory({ ...form })
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    loadCategories()
  } catch (e) { ElMessage.error('保存失败') }
}

function handleDelete(row) {
  ElMessageBox.confirm('确定删除该分类？', '提示', { type: 'warning' }).then(async () => {
    try { await deleteCategory(row.id); ElMessage.success('已删除'); loadCategories() } catch (e) { ElMessage.error('删除失败') }
  }).catch(() => {})
}

onMounted(() => loadCategories())
</script>
