import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import Users from '../views/admin/Users.vue'
import Roles from '../views/admin/Roles.vue'
import Resources from '../views/admin/Resources.vue'

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
          component: Dashboard,
        },
        {
          path: 'users',
          name: 'admin-users',
          component: Users,
        },
        {
          path: 'roles',
          name: 'admin-roles',
          component: Roles,
        },
        {
          path: 'resources',
          name: 'admin-resources',
          component: Resources,
        },
      ],
    },
  ],
})

export default router
