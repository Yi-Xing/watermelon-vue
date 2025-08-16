import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import LoginView from '../views/LoginView.vue'
import NotFound from '../views/NotFound.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import UserManagement from '../views/admin/UserManagement.vue'
import RoleManagement from '../views/admin/RoleManagement.vue'
import ResourceManagement from '../views/admin/ResourceManagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
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
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: AdminDashboard,
        },
        {
          path: 'users',
          name: 'admin-users',
          component: UserManagement,
        },
        {
          path: 'roles',
          name: 'admin-roles',
          component: RoleManagement,
        },
        {
          path: 'resources',
          name: 'admin-resources',
          component: ResourceManagement,
        },
      ],
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
router.beforeEach((to, from, next) => {
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
  }

  // 其他情况正常放行
  next()
})

export default router
