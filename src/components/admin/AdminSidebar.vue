<template>
  <el-aside class="sidebar" :width="isCollapsed ? '64px' : '250px'">
    <!-- 缩放按钮 -->
    <div class="collapse-btn" @click="toggleCollapse">
      <el-icon>
        <ArrowRightBold v-if="isCollapsed" />
        <ArrowLeftBold v-else />
      </el-icon>
    </div>

    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      @select="handleMenuSelect"
      router
      :collapse="isCollapsed"
    >
      <el-menu-item index="/admin/dashboard">
        <el-icon><DataBoard /></el-icon>
        <span>仪表盘</span>
      </el-menu-item>
      <el-menu-item index="/admin/users">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/roles">
        <el-icon><UserFilled /></el-icon>
        <span>角色管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/resources">
        <el-icon><Files /></el-icon>
        <span>资源管理</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { User, UserFilled, Files, DataBoard, ArrowRightBold, ArrowLeftBold } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 侧边栏折叠状态
const isCollapsed = ref(false)

// 根据当前路由计算激活的菜单项
const activeMenu = computed(() => route.path)

// 菜单选择处理
const handleMenuSelect = (index: string) => {
  ElMessage.info(`切换到${index}页面`)
}

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
/* 侧边栏样式 */
.sidebar {
  background: #fff;
  border-right: 1px solid #e4e7ed;
  position: relative;
  transition: width 0.3s ease;
  overflow: hidden; /* 防止出现滚动条 */
}

.sidebar-menu {
  border-right: none;
  height: 100%; /* 确保菜单占满整个侧边栏高度 */
}

/* 防止菜单内容溢出 */
.sidebar-menu .el-menu-item {
  white-space: nowrap;
  overflow: hidden;
}

/* 缩放按钮样式 */
.collapse-btn {
  position: absolute;
  top: 20px;
  right: -12px;
  width: 30px;
  height: 30px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.collapse-btn:hover {
  background: #f5f7fa;
  border-color: #c0c4cc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.collapse-btn .el-icon {
  font-size: 14px;
  color: #606266;
}

/* 折叠时的样式调整 */
.sidebar:has(.el-menu--collapse) .collapse-btn {
  right: -12px;
}
</style>
