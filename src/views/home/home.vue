<template>
    <div class="layout">
        <Layout>
            <Sider hide-trigger :style="{background: '#001529', height: '100vh'}">
            <div style="height: 64px; line-height: 64px; color: #fff; background: #002140; padding-left: 35px;">
                <h2>我的网站</h2>
            </div>
            <Menu theme="dark" width="auto" :accordion="true" @on-select="menuSelect">
                <Submenu name="1">
                    <template slot="title">
                        <Icon type="ios-navigate"></Icon>
                        应用
                    </template>
                    <MenuItem name="station">高铁订票</MenuItem>
                    <MenuItem name="others">无</MenuItem>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-settings" style="font-size: 14px;"></Icon>
                        管理
                    </template>
                    <MenuItem name="roles">权限</MenuItem>
                    <MenuItem name="users">用户</MenuItem>
                </Submenu>
            </Menu>
        </Sider>
            <Layout>
                    <Header>
                        <Row type="flex" justify="end"  class="code-row-bg">
                            <Col span="21">
                                <Breadcrumb>
                                    <BreadcrumbItem v-for="item in currentPathArr" :key="item">{{item}}</BreadcrumbItem>
                                </Breadcrumb>
                            </Col>
                            <Col span="1.5">
                                <Dropdown style="margin-left: 20px">
                                    <a href="javascript:void(0)">
                                        用户名
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem>我的主页</DropdownItem>
                                        <DropdownItem>退出</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Col>
                            <Col span="1.5">
                                <span class="avatar">
                                    <img src="../../assets/avatar.png" />
                                </span>
                            </Col>
                        </Row>
                    </Header>
                    <tag-pages-opened></tag-pages-opened>
                <Content>
                    <router-view></router-view>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>

<script>
    import TagPagesOpened from "../../components/home/tag-pages-opened";
    export default {
        components: {TagPagesOpened},
        data(){
            return{
                tab0: true,
                tab1: true,
                tab2: true,
                currentPath: "home",
            }
        },
        created(){
            // this.$store.commit('home/initCachePage');
        },
        computed: {
            currentPathArr(){
                let _this = this;
                let arr = [];
                console.log(this.currentPath);
                let i = 0;
                this.currentPath.split("/").map(function(item){
                    console.log("item " + item);
                    arr.push(_this.localize(item));
                });
                console.log("i " + i);
                console.log(arr);
                return arr;
            }
        },
        watch:{
            $route(to,from){
                if(to.path.indexOf("home") == -1){
                    this.currentPath = "home" + to.path;
                }else{
                    this.currentPath = "home";
                }
            }
        },
        methods: {
            menuSelect(name){
                this.$router.push({
                    name:name
                });
                console.log(this.$router);
                this.$store.commit("home/setCurrentPageName", name);
                this.$store.commit("home/pageOpenedList", name);
            },
            routeChange(to){
                console.log(to);
            },
            localize(name){
                if(name === "home"){
                    return "首页"
                }else if(name === "app"){
                    return "应用";
                }else if(name === "station"){
                    return "高铁抢票";
                }else if(name === "others"){
                    return "无";
                }else if(name === "manageMenu"){
                    return "管理";
                }else if(name === "roles"){
                    return "权限";
                }else if(name === "users"){
                    return "用户";
                }
            }
        }
    }
</script>

<style scoped>
    .layout{
        width: 100%;
        height: 100%;
    }
    .ivu-layout-header{
        background: #fff;
        padding: 0 30px 0 20px;
        border-bottom: 1px solid #e3e3e3;
    }
    .avatar {
        display: inline-block;
        text-align: center;
        background: #fff;
        color: #fff;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        vertical-align: middle;
        width: 32px;
        height: 32px;
        line-height: 32px;
        border-radius: 16px;
    }
</style>