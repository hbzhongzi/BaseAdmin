import { createRouter, createWebHistory } from 'vue-router';
import TheLayout from '../layout/TheLayout.vue';

const routes = [
  {
    path: '/',
    component: TheLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'events',
        name: 'EventList',
        component: () => import('../views/EventList.vue')
      },
      {
        path: 'users',
        name: 'UserList',
        component: () => import('../views/UserList.vue')
      },
      {
        path: 'check-types',
        name: 'CheckTypeList',
        component: () => import('../views/CheckTypeList.vue')
      },
      {
        path: 'image-resources',
        name: 'ImageResourceList',
        component: () => import('../views/ImageResourceList.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authadmintoken');
  if (to.path !== '/login' && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
