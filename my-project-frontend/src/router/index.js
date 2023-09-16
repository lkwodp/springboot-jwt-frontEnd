import {createRouter, createWebHistory} from "vue-router";
import {unauthorized} from "@/net";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [{
        path: '/',
        name: 'welcome',
        component: () => import('@/views/WelcomeView.vue'),
        children: [
            {
                path: '',
                name: 'welcome-login',
                component:()=>import('@/views/welcome/LoginPage.vue')
            },
            {
                path:'register',
                name: 'welcome-register',
                component:()=>import('@/views/welcome/RegisterPage.vue')
            },
            {
                path:'reset',
                name: 'welcome-reset',
                component:()=>import('@/views/welcome/ResetPage.vue')
            }
        ]
    },{
        path: '/index',
        name: 'index',
        component:()=>import('@/views/indexView.vue')
    }]
})

//路由守卫
router.beforeEach((to,from,next)=>{
    const isUnauthorized = unauthorized()
    if(to.name.startsWith('welcome-') && !isUnauthorized){
        //在已经登录的情况下，去welcome-的界面则会重定向到主页index
        next('/index')
    }else if (to.fullPath.startsWith('/index') && isUnauthorized){
        //如果在没有登录的情况下，访问主页index，则会重定向到登录界面
        next('/')
    }else {
        //其他情况正常访问
        next()
    }
})

export default router