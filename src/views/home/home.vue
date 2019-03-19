<template>
    <div class="layout">
        <Layout>
                <!--<Breadcrumb :style="{margin: '16px 0'}">-->
                    <!--<BreadcrumbItem>Home</BreadcrumbItem>-->
                    <!--<BreadcrumbItem>Components</BreadcrumbItem>-->
                    <!--<BreadcrumbItem>Layout</BreadcrumbItem>-->
                <!--</Breadcrumb>--><Sider hide-trigger :style="{background: '#001529', height: '100vh'}">
            <div style="height: 64px; line-height: 64px; color: #fff; background: #002140; padding-left: 35px;">
                <h2>我的应用</h2>
            </div>
            <Menu theme="dark" width="auto" :accordion="true" @on-select="menuSelect">
                <Submenu name="1">
                    <template slot="title">
                        <Icon type="ios-navigate"></Icon>
                        一级菜单
                    </template>
                    <MenuItem name="1-1">选项 1</MenuItem>
                    <MenuItem name="1-2">选项 2</MenuItem>
                    <MenuItem name="1-3">选项 3</MenuItem>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-keypad"></Icon>
                        一级菜单 2
                    </template>
                    <MenuItem name="2-1">选项 1</MenuItem>
                    <MenuItem name="2-2">选项 2</MenuItem>
                </Submenu>
            </Menu>
        </Sider>
            <Layout>
                    <Header>
                        <Row type="flex" justify="end"  class="code-row-bg">
                            <Col span="21">
                                <Breadcrumb>
                                    <BreadcrumbItem to="/">Home</BreadcrumbItem>
                                    <BreadcrumbItem to="/components/breadcrumb">Components</BreadcrumbItem>
                                    <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
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
                tab2: true
            }
        },
        methods: {
            menuSelect(name){
                console.log("menuSelect" + name);
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