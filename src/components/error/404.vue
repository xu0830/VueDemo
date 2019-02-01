<template>
    <div class="container">
        <img src="../../assets/404.png"/>
        <h1>
            <router-link to="/">返回首页</router-link>
        </h1>
    </div>
</template>

<script>
    export default {
        name: "404"
    }
</script>

<style scoped>
    .container{
        height: 100%;
        background: rgb(236, 236, 236);
        text-align: center;
    }
    .container img{
        margin-top: 200px;
    }
    .container a{
        color: lightslategray;
    }
</style>