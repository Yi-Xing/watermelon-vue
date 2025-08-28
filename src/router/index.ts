import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userToken'
import { useUserAuthStore } from '@/stores/userInfo'
import { PAGE_PERMISSIONS, type PagePermission } from '@/constants/permissionCode'
import { getCurrentUser } from '@/api/auth'
import { ElMessage } from 'element-plus'
import LoginView from '../views/LoginView.vue'
import NotFound from '../views/404.vue'
import ForbiddenView from '../views/403.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import UserManagement from '../views/admin/UserManagement.vue'
import RoleManagement from '../views/admin/RoleManagement.vue'
import ResourceManagement from '../views/admin/ResourceManagement.vue'
import ResourceRelationManagement from '../views/admin/ResourceRelationManagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        const userStore = useUserStore()
        const isLoggedIn = userStore.isLoggedIn

        if (isLoggedIn) {
          return '/admin'
        } else {
          return '/login'
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: '',
          // 可以使用 beforeEnter 跳转到有权限的路由，省事没做
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: AdminDashboard,
          meta: { permission: PAGE_PERMISSIONS.ADMIN_DASHBOARD_PAGE },
        },
        {
          path: 'users',
          name: 'admin-users',
          component: UserManagement,
          meta: { permission: PAGE_PERMISSIONS.ADMIN_USER_PAGE },
        },
        {
          path: 'roles',
          name: 'admin-roles',
          component: RoleManagement,
          meta: { permission: PAGE_PERMISSIONS.ADMIN_ROLE_PAGE },
        },
        {
          path: 'resources',
          name: 'admin-resources',
          component: ResourceManagement,
          meta: { permission: PAGE_PERMISSIONS.ADMIN_RESOURCE_PAGE },
        },
        {
          path: 'resource-relations',
          name: 'admin-resource-relations',
          component: ResourceRelationManagement,
          meta: { permission: PAGE_PERMISSIONS.ADMIN_RESOURCE_RELATION_PAGE },
        },
      ],
    },
    // 403 权限不足页面
    {
      path: '/403',
      name: 'forbidden',
      component: ForbiddenView,
    },
    // 404 页面 - 必须放在最后，作为通配符路由
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
    },
  ],
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 检查是否访问admin路径
  if (to.path.startsWith('/admin')) {
    // 通过store检查用户是否已登录
    const userStore = useUserStore()
    const isLoggedIn = userStore.isLoggedIn

    if (!isLoggedIn) {
      // 未登录，跳转到登录页面
      next('/login')
      return
    }

    const userAuthStore = useUserAuthStore()

    // 如果权限还没有加载过，则先加载权限
    if (!userAuthStore.hasLoadedAuth) {
      try {
        const userData = await getCurrentUser()

        // 将用户信息和权限一起存储到store中
        userAuthStore.setUserInfo(userData)
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // 跳转到登录页面
        ElMessage.error(error instanceof Error ? error.message : '获取用户信息失败')
        next('/login')
        return
      }
    }

    // 权限加载完成后，检查页面权限
    const requiredPermission = to.meta.permission as PagePermission
    if (!userAuthStore.hasPagePermission(requiredPermission)) {
      // 没有权限访问该页面，跳转到403页面
      next('/403')
      return
    }
  }

  // 其他情况正常放行
  next()
})

export default router
