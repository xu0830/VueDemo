<template>
    <div class="tag-opended-container">
        <Tag type="dot" color="blue"  >首页</Tag>
        <Tag type="dot" :closable="true"
             @on-close="closePage" @click.native="tagClick">页面一</Tag>
    </div>
</template>

<script>
    export default {
        name: "tag-pages-opened",
        data(){
            return {}
        },
        methods: {
            closePage(){
                console.log("closePage");
            },
            tagClick(){
                console.log("tagClick");
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
</style>