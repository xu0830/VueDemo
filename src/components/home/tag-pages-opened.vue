<template>
    <div class="tag-opended-container">
        <!--<Tag type="dot" color="blue"  >首页</Tag>-->
        <transition-group name="taglist-moving-animation">
            <Tag v-for="(item, index) in pageOpenedList" type="dot"
                 :name="item.name" :key="item.name"
                 :closable="item.name === 'index'?false:true"
                 @on-close="closePage" @click.native="tagClick(item.name)" :color="item.name === currentPage? 'blue' : 'default'"
            :class="item.name === currentPage ? 'tag-current' : ''">
                {{item.meta.title}}
            </Tag>
        </transition-group>
    </div>
</template>

<script>
    export default {
        name: "tag-pages-opened",
        data(){
            return {
            }
        },
        created(){
        },
        computed: {
            pageOpenedList(){
                return this.$store.state.home.pageOpenedList
            },
            currentPage(){
                return this.$store.state.home.currentPage
            }
        },
        methods: {
            itemTitle(name){
                // return this.localize(name);
            },

            closePage(event, name){
                let _this = this;
                let pageNum = _this.$store.state.home.pageOpenedList.length;
                _this.$store.state.home.pageOpenedList.map(function(item, index){
                    if(item.name === name){
                        _this.$store.commit("home/closePage", name);
                        let currentPageName = "";
                        if(index === pageNum-1){
                            currentPageName = _this.$store.state.home.pageOpenedList[pageNum-2].name;
                        }else{
                            currentPageName = _this.$store.state.home.pageOpenedList[index].name;
                        }
                        _this.$router.push({ name: currentPageName });
                        _this.$store.commit("home/setCurrentPageName", currentPageName);
                    }
                });
            },

            tagClick(name){
                console.log(name);
                this.$store.commit("home/setCurrentPageName", name);
                this.$router.push({
                    name: name
                });
            }
        }
    }
</script>

<style scoped>
    /*.tag-opended-container{*/
        /*position: relative;*/
        /*width: 100%;*/
        /*background: #f0f2f5;*/
        /*box-sizing:border-box;*/
        /*padding: 0px 20px;*/
        /*border-bottom: 1px solid #e3e3e3;*/
    /*}*/

    .ivu-tag-dot{
        border-width: 2px!important;

    }

    .tag-current{
        border-color: #91d5ff!important;

    }

    .taglist-moving-animation-move{
        transition: transform 0.3s;
    }
</style>