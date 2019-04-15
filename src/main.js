import Vue from 'vue';
import App from './app.vue';
import {router} from "./router";
import store from "./store";
import './style/common.less'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import ajax from './lib/ajax.js';
import Util from './lib/Util.js';
Vue.config.productionTip = false;

Vue.use(iView);

ajax.post('api/check/getUserSession',{
}).then(function(response){
    Util.session = response.data.data;
    new Vue({
        render: h => h(App),
        router,
        store,
        data:{
            currentPageName: ''
        },
        async mounted(){
            let _this = this;
            _this.$store.commit('user/setUser', response.data.data.userId);
            if(response.data.data.userId == 0){
                localStorage.clear();
            }
        }
    }).$mount('#app');


});

