import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Events from '../views/UpcomingEvents.vue'
import WelcomePage from '../views/Customer/welcomepage.vue'
import SuperAdminDashboard from '../views/SuperAdmin/DashboardPage.vue'
import AdminDashboard from '../views/Admin/DashboardPage.vue'
import EmployeePage from '../views/Employee/EmployeePage.vue'
import ManageUsers from '../views/SuperAdmin/ManageUsers.vue'
import ManageCategories from '../views/SuperAdmin/FeedbackCategories.vue'
import AdminManageCategories from '../views/Admin/FeedbackCategories.vue'
import ManageFeedback from '../views/SuperAdmin/ManageFeedback.vue'
import AdminManageFeedback from '../views/Admin/ManageFeedback.vue'
import AdminProfile from '../views/Admin/AdminProfile.vue'
import SuperAdminProfile from '../views/SuperAdmin/SuperAdminProfile.vue'

import ForgotPassword from '../views/ForgotPassword.vue'
import PasswordReset from '../views/PasswordReset.vue';
import FeedbackTable from '@/views/Admin/FeedbackTable.vue';









const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/feedback-table/:category',
      name: 'FeedbackTable',
      component: FeedbackTable,
      props: true, // Pass route params as props to the component
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta:{auth:false}
    },

    {
      path: '/password-reset/:token',
      name: 'password-reset',
      component: PasswordReset
    },
    {
      path: '/forgot_password',
      name: 'ForgotPassword',
      component: ForgotPassword,
      meta:{auth:false}
    },
    {
      path: '/employee',
      name: 'EmployeePage ',
      component:EmployeePage ,
      meta: { requiresAuth: true },
    },
    {
      path: '/welcomepage',
      name: 'WelcomePage',
      component: WelcomePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/SuperAdmin_profile',
      name: 'SuperAdminProfile',
      component: SuperAdminProfile,
      meta: { requiresAuth: true },
    },
    {
      path: '/Admin_profile',
      name: 'Profile',
      component: AdminProfile,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'AdminDashboard',
      component:AdminDashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/manage-categories',
      name: 'AdminManageCategories',
      component: AdminManageCategories,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/manage-feedback',
      name: 'AdminManageFeedback',
      component: AdminManageFeedback,
      meta: { requiresAuth: true },
    },
    
    {
      path: '/superadmin',
      name: 'SuperAdminDashboard',
      component: SuperAdminDashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/superadmin/manage-users',
      name: 'ManageUsers',
      component: ManageUsers,
      meta: { requiresAuth: true },
    },
    {
      path: '/superadmin/manage-feedback',
      name: 'ManageFeedback',
      component: ManageFeedback,
      meta: { requiresAuth: true },
    },
    {
      path: '/superadmin/manage-categories',
      name: 'ManageCategories',
      component: ManageCategories,
      meta: { requiresAuth: true },
    },
   
    {
      path: '/events',
      name: 'events',
      component: Events
    },
    {
      path: '/feedback',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router
