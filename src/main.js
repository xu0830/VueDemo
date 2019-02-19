import Vue from 'vue';
import App from './app.vue';
import VueRouter from 'vue-router';
import routes from "./router";
import store from "./store";
import './style/common.less'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(iView);
const router = new VueRouter({
    mode: 'history',
    routes: routes
})

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app');

