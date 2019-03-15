import Vue from 'vue';
import VueRouter from 'vue-router';
// const routers = [
//     { path: '*', name: 'error', component: () => import('../views/error/404.vue') },
//     { path: '/', name: 'login', component: () => import('../views/login/login.vue') },
//     { path: '/home', name: 'home', component: () => import('../views/home/home.vue') }
// ];

const routers = [
    { path: '*', name: 'error', component: () => import('../views/error/404.vue') },
    { path: '/', name: 'login', component: () => import('../views/login/login.vue') },
    { path: '/home', name: 'home',
        component: () => import('../views/home/home.vue'),
        children: [
            {
                name: 'index',
                path: 'index',
                component: () => import('../views/home/main.vue')
            }
        ]
    }
];

Vue.use(VueRouter);
const RouterConfig = {
    mode: 'history',
    routes: routers
}
export const router = new VueRouter(RouterConfig);

//  注册全局前置守卫
router.beforeEach((to, from, next) => {
    console.log("beforeEach");
    console.log(to.name);
    if(to.name === 'login'){
        next({
            name: 'index'
        });
    }
    next();
});
