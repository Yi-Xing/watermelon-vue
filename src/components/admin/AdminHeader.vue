<template>
  <el-header class="header">
    <div class="header-content">
      <div class="logo-section">
        <RouterLink to="/admin/dashboard" class="logo-link">
          <img src="/logo.webp" alt="Watermelon Logo" class="logo-icon" />
          <h1 class="logo">Watermelon</h1>
        </RouterLink>
      </div>
      <div class="user-info">
        <el-dropdown>
          <span class="user-dropdown">
            <el-avatar :size="32" :src="userAvatar" />
            <span class="username">{{ currentUser.name }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleProfile">个人资料</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>

  <!-- 个人资料对话框 -->
  <el-dialog v-model="profileDialogVisible" title="个人资料" width="500px">
    <div class="profile-content">
      <div class="profile-item">
        <label>用户ID：</label>
        <span>{{ currentUser.id }}</span>
      </div>
      <div class="profile-item">
        <label>用户名：</label>
        <span>{{ currentUser.name }}</span>
      </div>
      <div class="profile-item">
        <label>邮箱：</label>
        <span>{{ currentUser.email }}</span>
      </div>
      <div class="profile-item">
        <label>手机号：</label>
        <span>{{ currentUser.phone }}</span>
      </div>
      <div class="profile-item">
        <label>备注：</label>
        <span>{{ currentUser.remark || '无' }}</span>
      </div>
      <div class="profile-item">
        <label>创建时间：</label>
        <span>{{ currentUser.createdTime }}</span>
      </div>
    </div>
    <template #footer>
      <el-button @click="profileDialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getCurrentUser } from '@/api/user'
import type { CurrentUser } from '@/types/user'

const router = useRouter()

// 当前用户信息
const currentUser = reactive<CurrentUser>({
  id: 0,
  name: '加载中...',
  email: '',
  phone: '',
  remark: '',
  createdTime: '',
})

const userAvatar = ref('/DefaultAvatar.png')
const profileDialogVisible = ref(false)

// 获取当前用户信息
const loadCurrentUser = async () => {
  try {
    const userData = await getCurrentUser()
    Object.assign(currentUser, userData)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  }
}

// 用户操作处理
const handleProfile = () => {
  profileDialogVisible.value = true
}

const handleLogout = () => {
  ElMessage.success('退出登录成功')
  // 退出登录后跳转到登录页面
  router.push('/login')
}

// 组件挂载时获取用户信息
onMounted(() => {
  loadCurrentUser()
})
</script>

<style scoped>
/* 头部样式 */
.header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.logo-section:hover {
  background-color: #e6f3ff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.logo-section:hover .logo {
  color: #409eff;
}

.logo-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
  margin: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #606266;
}

/* 个人资料对话框样式 */
.profile-content {
  padding: 20px 0;
}

.profile-item {
  display: flex;
  margin-bottom: 16px;
  align-items: center;
}

.profile-item label {
  width: 100px;
  font-weight: 600;
  color: #606266;
  margin-right: 16px;
}

.profile-item span {
  color: #303133;
  flex: 1;
}
</style>
