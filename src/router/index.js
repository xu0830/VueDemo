const routes = [
    { path: '*', component: () => import('../views/error/404.vue') },
    { path: '/', component: () => import('../views/login/login.vue') },
    { path: '/home', component: () => import('../views/home/home.vue') }
];

export default routes;