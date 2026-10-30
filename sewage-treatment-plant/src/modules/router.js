import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(import.meta.env.VITE_MODE === 'production' ? '/sewage/' : '/'),
    routes: [{
        path: '/',
        name: '首页',
        'component': () => import('/@/view/shouye/index.vue')
    }],
    // routes: [{
    //     name: '首页',
    //     'component': () => import('/@/view/test.vue')
    // }],


})

export default router
