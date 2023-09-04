import {createRouter, createWebHistory} from 'vue-router'
import MainView from '../views/MainView.vue'

const routes = [
    {
        path: '/',
        name: 'main',
        component: MainView
    },
    // 懒加载
    {
        path: '/registry',
        name: 'registry',
        component: () => import('../views/RegisterView.vue')
    }, {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
