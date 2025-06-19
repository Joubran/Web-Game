import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/components/MainMenu.vue'),
        meta: { transition: 'fade' }
    },
    {
        path: '/authors',
        name: 'Authors',
        component: () => import('@/components/AuthorsPage.vue'),
        meta: { transition: 'fade' }
    },
    {
        path: '/play',
        name: 'PlayArea',
        component: () => import('@/components/PlayArea.vue'),
        meta: { transition: 'fade' }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL || '/'), // Важно!
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

// Глобальный логгер навигации
router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.path} to ${to.path}`)
    next()
})

export default router