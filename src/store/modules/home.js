import {router} from '../../router/index.js';
console.log(router);
const home = {
    namespaced: true,
    state: {
        cachePage: [],
        pageOpenedList:["index"],
        currentPage: "index",
        currentPath: [{
            meta: 'index',
            title: "首页"
        }],
        routes: router.options
    },
    mutations: {
        initCachePage(state){

        },
        setCurrentPageName(state, name){
            console.log("setCurrentPageName: " + name);
            state.currentPage = name;
        },
        pageOpenedList(state, name){
            let isExist = true;
            state.pageOpenedList.map((item, index) => {
                console.log("pageOpenedList: " + name);
                if (item === name) {
                    isExist = false;
                }
            });
            console.log(state.pageOpenedList);
            if(isExist){
                state.pageOpenedList.push(name);
            }
        },
        closePage(state, name){
            var index = state.pageOpenedList.indexOf(name);
            state.pageOpenedList.splice(index, 1);
            // state.currentPage = state.pageOpenedList;

        }
    },
    actions: {
    }
};

export default home;