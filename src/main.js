import Vue from 'vue';
import App from './app.vue';
import {router} from "./router";
import store from "./store";
import './style/common.less'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.config.productionTip = false;

console.log(router);

Vue.use(iView);

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app');