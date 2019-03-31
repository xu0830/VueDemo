<template>
    <div class="layout">
        <Layout>
            <Sider hide-trigger :style="{background: '#001529', height: '100%'}">
                <div class="sider-header">
                    <h2><router-link to="/home/index">我的网站</router-link></h2>
                </div>
                <Menu theme="dark" width="auto" :accordion="true" @on-select="menuSelect">

                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-navigate"></Icon>
                            应用
                        </template>
                        <MenuItem name="station">高铁订票</MenuItem>
                        <MenuItem name="other">其他</MenuItem>
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
                            <Col span="24">
                                <Breadcrumb>
                                    <BreadcrumbItem v-for="item in currentPath" :key="item.name">{{item.meta.title}}</BreadcrumbItem>
                                </Breadcrumb>
                            </Col>
                        </Row>
                    </Header>
                <tag-pages-opened class="tag-pages-opened"></tag-pages-opened>
                <Content class="page-content">
                    <div class="page-content-container">
                        <keep-alive>
                            <router-view></router-view>
                        </keep-alive>
                    </div>
                </Content>
                <Footer class="layout-footer-center">2019-2020 &copy; xucanjie</Footer>
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
            }
        },
        created(){
            this.$store.commit('home/initPage');
        },
        computed: {
            currentPath(){
                return this.$store.state.home.currentPath;
            }
        },
        // watch:{
        //     $route(to, from){
        //         console.log(to);
        //         console.log(from);
        //         this.$router.push({
        //             name: to.name
        //         });
        //         this.$store.commit("home/setCurrentPageName", to.name);
        //         this.$store.commit("home/pageOpenedList", to.name);
        //     }
        // },

        methods: {
            menuSelect(name){
                this.$router.push({
                    name:name
                });
                this.$store.commit("home/setCurrentPageName", name);
                this.$store.commit("home/pageOpenedList", name);
            }
        }
    }
</script>

<style scoped>
    .layout{
        width: 100%;
        height: 100%;
        min-width: 1200px;
        min-height: 900px;
    }

    .ivu-layout{
        width: 100%;
        height: 100%;
    }

    .sider-header{
        height: 64px;
        line-height: 64px;
        min-height: 64px;
        background: #002140;
        padding-left: 35px;
    }

    .sider-header a{
        color: #fff!important;
    }

    .ivu-layout-header{
        background: #fff;
        padding: 0 30px 0 40px;
        /*border-bottom: 1px solid #2d374b;*/
        /*box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);*/
        height: 60px;
        line-height: 60px;
    }

    .tag-pages-opened{
        padding: 0 20px;
        height: 4%;
        min-height: 36px;
        box-shadow: 2px 2px 5px rgba(0,0,0,.12), -2px -2px 5px rgba(0,0,0,.12);
        min-width: 1200px;
    }

    .page-content{
        padding: 20px;
        height: 82%;
    }

    .page-content-container{
        background: #fff;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border: 1px solid #rgba(100, 100, 100, 0.1);
        box-shadow: 2px 2px 5px rgba(0,0,0,.1), -2px -2px 5px rgba(0,0,0,.1);
    }

    .ivu-layout-footer{
        background: #fff;
        border: 1px solid rgba(100, 100, 100, 0.1);
        box-shadow: 2px 2px 5px rgba(0,0,0,.1), -2px -2px 5px rgba(0,0,0,.1);
        text-align: center;
        height: 5%;
        padding: 10px 0 10px 0px;
    }
</style>