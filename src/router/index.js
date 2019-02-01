const routes = [
    { path: '*', component: () => import('../components/error/404.vue') },
    { path: '/', component: () => import('../components/login/login.vue') },
    { path: '/home', component: () => import('../components/home/home.vue') }
];

export default routes;