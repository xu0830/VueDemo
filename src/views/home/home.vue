<template>
    <div class="layout">
        <Layout>
                <!--<Breadcrumb :style="{margin: '16px 0'}">-->
                    <!--<BreadcrumbItem>Home</BreadcrumbItem>-->
                    <!--<BreadcrumbItem>Components</BreadcrumbItem>-->
                    <!--<BreadcrumbItem>Layout</BreadcrumbItem>-->
                <!--</Breadcrumb>-->
            <Sider hide-trigger :style="{background: '#515a6e', height: '100vh'}">
                <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']">
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-navigate"></Icon>
                            Item 1
                        </template>
                        <MenuItem name="1-1">Option 1</MenuItem>
                        <MenuItem name="1-2">Option 2</MenuItem>
                        <MenuItem name="1-3">Option 3</MenuItem>
                    </Submenu>
                    <Submenu name="2">
                        <template slot="title">
                            <Icon type="ios-keypad"></Icon>
                            Item 2
                        </template>
                        <MenuItem name="2-1">Option 1</MenuItem>
                        <MenuItem name="2-2">Option 2</MenuItem>
                    </Submenu>
                </Menu>
            </Sider>
            <Layout>
                <Header></Header>
                <Content>
                    <Tabs type="card" closable @on-tab-remove="handleTabRemove">
                        <TabPane label="标签一" v-if="tab0">标签一的内容</TabPane>
                        <TabPane label="标签二" v-if="tab1">标签二的内容</TabPane>
                        <TabPane label="标签三" v-if="tab2">标签三的内容</TabPane>
                    </Tabs>
                    <router-view></router-view>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                tab0: true,
                tab1: true,
                tab2: true
            }
        },
         methods: {
         handleTabRemove (name) {
             this['tab' + name] = false;
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
        border-bottom: 1px solid #e3e3e3;
        /*box-shadow: 1px 1px 3px rgba(0,0,0,.1);*/
        box-shadow: 2px 2px 5px rgba(0,0,0,.1), -2px -2px 5px rgba(0,0,0,.1);
        height: 50px;
    }
</style>