import Vue from 'vue';
import VueRouter from 'vue-router';
import {routes} from './router.js';
import Util from '../lib/Util.js';

Vue.use(VueRouter);
const RouterConfig = {
    mode: 'history',
    routes: routes
}
export const router = new VueRouter(RouterConfig);

//  注册全局前置守卫
router.beforeEach((to, from, next) => {
    console.log(Util.session);
    if(Util.session.userId == 0 && to.name !== 'login'){
        next({
            name: 'login'
        });
    }else if(Util.session.userId != 0 && to.name === 'login'){
        next({
            name: 'index'
        });
    }
    next();
});