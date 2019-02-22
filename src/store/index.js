import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
Vue.use(Vuex);

const state = {
    sliderDragable: false,
    sliderInitX: 0,
    sliderDragDistance: 0,
    sliderValidation: 0,
    randomPoint: {
        x: 0,
        y: 0
    },
    token: ""
};

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
