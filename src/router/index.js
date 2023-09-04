import {createRouter, createWebHistory} from 'vue-router'
import MainView from '../views/MainView.vue'
import store from '@/store';
import {message} from "ant-design-vue";

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

// 添加全局路由守卫，没登录不能去其他页面，先这样做后续待优化
router.beforeEach(async (to, from) => {
    if (JSON.stringify(store.state.user) === "{}") {
        if (to.path !== '/login' && to.path !== '/registry') {
            message.warn("请先完成登录")
            return {path: '/login'}
        }
    }
    // 登录了之后防止返回啥的操作还会进入到登录界面
    if (JSON.stringify(store.state.user) !== "{}" && to.path === '/login') {
        return {path: '/'}
    }
})

export default router
