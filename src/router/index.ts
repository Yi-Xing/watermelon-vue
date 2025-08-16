import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import UserManagement from '../views/admin/UserManagement.vue'
import Roles from '../views/admin/Roles.vue'
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
          component: Roles,
        },
        {
          path: 'resources',
          name: 'admin-resources',
          component: ResourceManagement,
        },
      ],
    },
  ],
})

export default router
