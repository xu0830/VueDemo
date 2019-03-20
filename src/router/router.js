export const loginRouter = {
    path: '/',
    name: 'login',
    meta: {
        title: '登录'
    },
    component: () => import('../views/login/login.vue')
};

export const homeRouter = {
    path: '/home',
    name: 'home',
    meta: { title: '首页' },
    component: () => import('../views/home/home.vue'),
    children: [
         {
             meta: {
                 title: '主页'
             },
             name: 'index',
             path: 'index',
             component: () => import('../components/home/index.vue')
         }
     ]
};

export const appRouter = {
    path: '/app',
    name: 'app',
    meta: { title: '应用' },
    component: () => import('../views/home/home.vue'),
    children: [
        {
            meta: {
                title: '高铁抢票'
            },
            name: 'station',
            path: 'station',
            component: () => import('../components/app/station.vue')
        },
        {
            meta: {
                title: '其他'
            },
            name: 'others',
            path: 'others',
            component: () => import('../components/app/others.vue')
        }
    ]
};

export const manageMenuRouter = {
    path: '/manageMenu',
    name: 'manageMenu',
    meta: { title: '管理' },
    component: () => import('../views/home/home.vue'),
    children: [
        {
            meta: {
                title: '用户'
            },
            name: 'users',
            path: 'users',
            component: () => import('../components/manageMenu/users.vue')
        },
        {
            meta: {
                title: '权限'
            },
            name: 'roles',
            path: 'roles',
            component: () => import('../components/manageMenu/roles.vue')
        }
    ]
};

export const routes = [
    loginRouter,
    homeRouter,
    appRouter,
    manageMenuRouter
];

