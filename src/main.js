import Vue from 'vue';
import App from './app.vue';
import VueRouter from 'vue-router';
import routes from "./router";
import './style/common.less'

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: routes
})

new Vue({
    render: h => h(App),
    router: router
}).$mount('#app');

