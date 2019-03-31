import Vue from 'vue';
import Vuex from 'vuex';

import loginModule from './modules/login.js';
import userModule from './modules/user.js';
import homeModule from './modules/home.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        //
    },
    mutations: {
        //
    },
    actions: {

    },
    modules: {
        login: loginModule,
        home: homeModule,
        user: userModule
    }
});
