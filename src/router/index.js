import Vue from 'vue';
import VueRouter from 'vue-router';
import {routes} from './router.js';

Vue.use(VueRouter);
const RouterConfig = {
    mode: 'history',
    routes: routes
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