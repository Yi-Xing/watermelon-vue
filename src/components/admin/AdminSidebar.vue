<template>
  <el-aside class="sidebar" :width="isCollapsed ? '64px' : '250px'">
    <!-- 缩放按钮 -->
    <div class="collapse-btn" @click="toggleCollapse">
      <el-icon>
        <ArrowRightBold v-if="isCollapsed" />
        <ArrowLeftBold v-else />
      </el-icon>
    </div>

    <el-menu :default-active="activeMenu" class="sidebar-menu" router :collapse="isCollapsed">
      <el-menu-item
        index="/admin/dashboard"
        v-permission="BUTTON_PERMISSIONS.ADMIN_DASHBOARD_BUTTON"
      >
        <el-icon><DataBoard /></el-icon>
        <span>仪表盘</span>
      </el-menu-item>
      <el-menu-item index="/admin/users" v-permission="BUTTON_PERMISSIONS.ADMIN_USER_BUTTON">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/roles" v-permission="BUTTON_PERMISSIONS.ADMIN_ROLE_BUTTON">
        <el-icon><UserFilled /></el-icon>
        <span>角色管理</span>
      </el-menu-item>
      <el-menu-item
        index="/admin/resources"
        v-permission="BUTTON_PERMISSIONS.ADMIN_RESOURCE_BUTTON"
      >
        <el-icon><Files /></el-icon>
        <span>资源管理</span>
      </el-menu-item>
      <el-menu-item
        index="/admin/resource-relations"
        v-permission="BUTTON_PERMISSIONS.ADMIN_RESOURCE_RELATION_BUTTON"
      >
        <el-icon><Connection /></el-icon>
        <span>资源关联管理</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  User,
  UserFilled,
  Files,
  DataBoard,
  ArrowRightBold,
  ArrowLeftBold,
  Connection,
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { BUTTON_PERMISSIONS } from '@/constants/permissionCode'

const route = useRoute()

// 侧边栏折叠状态
const isCollapsed = ref(false)

// 根据当前路由计算激活的菜单项
const activeMenu = computed(() => route.path)

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
