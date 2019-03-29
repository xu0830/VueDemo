<template>
    <div>
        <Button @click="clickEvent">点击</Button>
    </div>
</template>

<script>
    export default {
        name: "others",
        data(){
            return {

            }
        },
        methods:{
            clickEvent(){
                console.log("clickEvent");
            }
        }
    }
</script>

<style scoped>

</style>