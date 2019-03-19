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
                component: () => import('../components/home/index.vue')
            }
        ]
    },
    { path: '/app', name: 'app',
        component: () => import('../views/home/home.vue'),
        children: [
            {
                name: 'station',
                path: 'station',
                component: () => import('../components/app/station.vue')
            },
            {
                name: 'others',
                path: 'others',
                component: () => import('../components/app/others.vue')
            }
        ]
    },
    { path: '/manageMenu', name: 'manageMenu',
        component: () => import('../views/home/home.vue'),
        children: [
            {
                name: 'users',
                path: 'users',
                component: () => import('../components/manageMenu/users.vue')
            },
            {
                name: 'roles',
                path: 'roles',
                component: () => import('../components/manageMenu/roles.vue')
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
    if(to.name === 'login'){
        next({
            name: 'index'
        });
    }
    next();
});
