<template>
  <el-header class="header">
    <div class="header-content">
      <div class="logo-section">
        <RouterLink to="/admin/dashboard" class="logo-link">
          <img src="@/assets/logo.webp" alt="Watermelon Logo" class="logo-icon" />
          <h1 class="logo">Watermelon</h1>
        </RouterLink>
      </div>
      <div class="user-info">
        <el-dropdown>
          <span class="user-dropdown">
            <el-avatar :size="32" :src="avatarSrc" />
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
  <el-dialog v-model="profileDialogVisible" title="个人资料" width="600px">
    <div class="profile-content">
      <div class="profile-grid">
        <div class="profile-item">
          <label class="profile-label">用户ID</label>
          <span class="profile-value">{{ currentUser.id }}</span>
        </div>
        <div class="profile-item">
          <label class="profile-label">用户名</label>
          <span class="profile-value">{{ currentUser.name }}</span>
        </div>
        <div class="profile-item">
          <label class="profile-label">邮箱</label>
          <span class="profile-value">{{ currentUser.email || '未设置' }}</span>
        </div>
        <div class="profile-item">
          <label class="profile-label">手机号</label>
          <span class="profile-value">{{ currentUser.phone || '未设置' }}</span>
        </div>
        <div class="profile-item full-width">
          <label class="profile-label">备注</label>
          <span class="profile-value">{{ currentUser.remark || '无备注信息' }}</span>
        </div>
        <div class="profile-item">
          <label class="profile-label">创建时间</label>
          <span class="profile-value">{{ currentUser.createdTime }}</span>
        </div>
        <div class="profile-item">
          <label class="profile-label">更新时间</label>
          <span class="profile-value">{{ currentUser.updatedTime }}</span>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="profileDialogVisible = false" type="primary">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, logout } from '@/api/admin/user'
import type { CurrentUser } from '@/types/user'
import DefaultAvatar from '@/assets/DefaultAvatar.png'

const router = useRouter()

// 头像图片路径
const avatarSrc = DefaultAvatar

// 当前用户信息
const currentUser = reactive<CurrentUser>({
  id: 0,
  name: '加载中...',
  email: '',
  phone: '',
  remark: '',
  createdTime: '',
  updatedTime: '',
})

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

const handleLogout = async () => {
  try {
    await logout()
    ElMessage.success('退出登录成功')
    // 退出登录后跳转到登录页面
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '退出登录失败')
  }
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

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.profile-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-item.full-width {
  grid-column: 1 / -1;
}

.profile-label {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin: 0;
}

.profile-value {
  font-size: 14px;
  color: #303133;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  min-height: 20px;
  display: flex;
  align-items: center;
}

.profile-value:empty::before {
  content: '暂无数据';
  color: #c0c4cc;
  font-style: italic;
}

/* 移除蓝色框和焦点样式 */
.el-dropdown:focus,
.el-dropdown:focus-visible,
.el-dropdown:focus-within {
  outline: none !important;
  box-shadow: none !important;
}

.el-dropdown .el-dropdown-link:focus,
.el-dropdown .el-dropdown-link:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

.user-dropdown:focus,
.user-dropdown:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* 移除Element Plus组件的默认焦点样式 */
.el-avatar:focus,
.el-avatar:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* 移除链接的默认焦点样式 */
.logo-link:focus,
.logo-link:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* 移除图片的默认焦点样式 */
.logo-icon:focus,
.logo-icon:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}
</style>
