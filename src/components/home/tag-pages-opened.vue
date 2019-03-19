<template>
    <div class="tag-opended-container">
        <!--<Tag type="dot" color="blue"  >首页</Tag>-->
        <transition-group name="taglist-moving-animation">
            <Tag v-for="item in pageOpenedList" type="dot"
                 :name="item" :key="item"
                 :closable="item==='index'?false:true"
                 @on-close="closePage" @click.native="tagClick(item)" :color="item === currentPage? 'blue' : 'default'">
                {{item}}
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
        computed: {
            pageOpenedList(){
                console.log(this.$store.state.home.pageOpenedList);
                return this.$store.state.home.pageOpenedList
            },
            currentPage(){
                return this.$store.state.home.currentPage
            }
        },
        methods: {
            closePage(event, name){
                var index = this.$store.state.home.pageOpenedList.indexOf(name);
                console.log("closePage index: " + index);
                let pageNum = this.$store.state.home.pageOpenedList.length;
                console.log("closePage pageNum: " + pageNum);

                console.log("closePage: " + name);
                this.$store.commit("home/closePage", name);
                if(this.currentPage === name){
                    if(index === pageNum-1){
                        console.log("close the last one");
                        console.log(this.$store.state.home.pageOpenedList[pageNum-2]);
                        this.$router.push({
                            name: this.$store.state.home.pageOpenedList[pageNum-2]
                        });
                        this.$store.commit("home/setCurrentPageName", this.$store.state.home.pageOpenedList[pageNum-2]);
                    }else{
                        this.$router.push({
                            name: this.$store.state.home.pageOpenedList[index]
                        });
                        this.$store.commit("home/setCurrentPageName", this.$store.state.home.pageOpenedList[index]);
                    }
                }
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
    .tag-opended-container{
        background: #f0f2f5;
        box-sizing:border-box;
        padding: 0px 20px;
        border-bottom: 1px solid #e3e3e3;
        box-shadow: 2px 2px 5px rgba(0,0,0,.1), -2px -2px 5px rgba(0,0,0,.1);
    }

    .taglist-moving-animation-move{
        transition: transform 0.3s;
    }
</style>