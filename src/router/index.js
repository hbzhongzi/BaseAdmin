import { createRouter, createWebHistory } from 'vue-router';
import TheLayout from '../layout/TheLayout.vue';
import { AUTH_TOKEN_KEY } from '../api/request';
const routes = [
    {
        path: '/',
        component: TheLayout,
        children: [
            {
                path: '',
                redirect: '/events'
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
            },
            {
                path: 'member-packages',
                name: 'MemberPackageList',
                component: () => import('../views/MemberPackageList.vue')
            },
            {
                path: 'check-rules',
                name: 'CheckRuleList',
                component: () => import('../views/CheckRuleList.vue')
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
    history: createWebHistory('/admin/'), // ⚠️ 添加 base 参数
    routes
});
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token && to.path !== '/login') {
        next('/login');
        return;
    }
    if (token && to.path === '/login') {
        next('/');
        return;
    }
    next();
});
export default router;
//# sourceMappingURL=index.js.map