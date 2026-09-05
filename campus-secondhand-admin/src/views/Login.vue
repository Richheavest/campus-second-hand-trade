<template>
  <div class="login-page">
    <el-card class="login-card">
      <h2 class="login-title">🔄 校园二手管理后台</h2>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" size="large" show-password @keyup.enter="login" />
        </el-form-item>
        <el-form-item>
          <el-button type="warning" size="large" style="width:100%" @click="login" :loading="loading">登 录</el-button>
        </el-form-item>
      </el-form>
      <p class="login-hint">默认账号: admin / admin123</p>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()
const loading = ref(false)
const form = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

function login() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    // 简单本地认证
    await new Promise(r => setTimeout(r, 500))
    if (form.username === 'admin' && form.password === 'admin123') {
      localStorage.setItem('adminToken', 'admin_token_' + Date.now())
      ElMessage.success('登录成功')
      router.push('/layout/dashboard')
    } else {
      ElMessage.error('用户名或密码错误')
    }
    loading.value = false
  })
}
</script>

<style scoped>
.login-page { display: flex; align-items: center; justify-content: center; height: 100vh; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); }
.login-card { width: 420px; border-radius: 16px; }
.login-title { text-align: center; margin-bottom: 32px; font-size: 24px; color: #1a1a2e; }
.login-hint { text-align: center; font-size: 12px; color: #999; margin-top: 12px; }
</style>
