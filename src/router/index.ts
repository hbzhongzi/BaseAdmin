import { createRouter, createWebHistory } from 'vue-router';
import TheLayout from '../layout/TheLayout.vue';
import { currentUser, hasPermission, isAuthenticated } from '../auth/session';
import { getCurrentAdmin } from '../api/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: TheLayout,
      children: [
        { path: '', name: 'Home', component: () => import('../views/Home.vue') },
        {
          path: 'permissions',
          name: 'Permissions',
          component: () => import('../views/PermissionList.vue'),
          meta: { permission: 'permission:list' },
        },
      ]
    },
    { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
    { path: '/403', name: 'Forbidden', component: () => import('../views/Forbidden.vue') },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') },
  ]
});

declare module 'vue-router' {
  interface RouteMeta {
    permission?: string;
  }
}

router.beforeEach(async (to) => {
  if (!isAuthenticated.value && to.name !== 'Login') return { name: 'Login' };
  if (isAuthenticated.value && !currentUser.value && to.name !== 'Login') {
    try {
      await getCurrentAdmin();
    } catch {
      return { name: 'Login' };
    }
  }
  if (to.meta.permission && !hasPermission(to.meta.permission)) {
    return { name: 'Forbidden' };
  }
  if (isAuthenticated.value && to.name === 'Login') return { name: 'Home' };
});

export default router;
