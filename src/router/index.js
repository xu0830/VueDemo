const routers = [
    { path: '*', name: 'error', component: () => import('../views/error/404.vue') },
    { path: '/', name: 'login', component: () => import('../views/login/login.vue') },
    { path: '/home', name: 'home', component: () => import('../views/home/home.vue') }
];

export default routers;