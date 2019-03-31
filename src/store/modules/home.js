import {homeRouter, appRouter, manageMenuRouter} from '../../router/router.js';
const home = {
    namespaced: true,
    state: {
        cachePage: [],
        pageOpenedList:[
        {
            meta: {
                title: '主页'
            },
            name: "index",
            path: '/*'
        }],
        currentPage: "index",
        currentPath: [
        {
            meta: {
                title: '首页'
            },
            name: "home",
            path: '/home'
        },
        {
            meta: {
                title: '主页'
            },
            name: "index",
            path: '/index'
        }],
        routes: [
            homeRouter,
            ...appRouter,
            ...manageMenuRouter
        ],
        passenger:{
            name: ''
        }
    },
    mutations: {
        logout(){
            localStorage.clear();
        },
        initPage(state){
            state.pageOpenedList = JSON.parse(localStorage.pageOpenedList);
            state.currentPage = localStorage.currentPage;
        },
        setCurrentPageName(state, name){
            state.currentPage = name;
            localStorage.currentPage = name;
            state.currentPath.length = 1;
            state.routes.map(function(item){
                item.children.map(function(route){
                    if(route.name === name){
                        if(route.name != "index"){
                            let pathObj = {
                                meta: {
                                    title: ''
                                },
                                name: "",
                                path: ''
                            };
                            pathObj.meta.title = item.meta.title;
                            pathObj.name = item.name;
                            pathObj.path = item.path;
                            state.currentPath.push(pathObj);
                        }
                        let childPathObj = {
                            meta: {
                                title: ''
                            },
                            name: "",
                            path: ''
                        };
                        childPathObj.meta.title = route.meta.title;
                        childPathObj.name = route.name;
                        childPathObj.path = route.path;
                        state.currentPath.push(childPathObj);
                    }
                });
            });
        },
        pageOpenedList(state, name){
            let isExist = false;
            state.pageOpenedList.map((item) => {
                if (item.name === name) {
                    isExist = true;
                }
            });
            if(!isExist){
                state.routes.map(function(route){
                    route.children.map(function(child){
                        if(child.name === name){
                            state.pageOpenedList.push(child);
                        }
                    });
                });
            }
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        closePage(state, name){
            state.pageOpenedList.map(function(route, index){
                if(route.name === name){
                    state.pageOpenedList.splice(index, 1);
                    return;
                }
            });
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
            // state.currentPage = state.pageOpenedList;

        },
        setPassenger(state, passenger){
            state.passenger = passenger;
        }
    },
    actions: {
    }
};

export default home;