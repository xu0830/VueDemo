<template>
    <div class="pic-validate-block" @mouseover="picBlockActive" @mouseout="picBlockBlur">
        <transition name="fade">
            <div class="pic-validate-box" v-show="picShow">
                <span></span>
                <canvas class="pic-bottom" width="240" height="140"></canvas>
                <canvas class="pic-move" width="240" height="140"></canvas>
            </div>
        </transition>
        <div class="pic-clear-box"></div>
        <div class="slider-block">
            <div class="slider-box" :class="{'slider-box-active': IsSliderActive}" :style="{left: dragDistance + 'px'}"
                 @mouseover="sliderActive" @mouseout="sliderBlur" @mousedown.stop.prevent="sliderClick">
                <span></span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "picValidation",
        data: function(){
            return {
                picShow: false,
                picHidden: true,
                IsSliderActive: false,
            }
        },
        props:['dragDistance'],
        methods: {
            picBlockActive(){
                let _this = this;
                _this.picHidden = false;
                let timer =  setTimeout(function(){
                    _this.picShow = true;
                },300);
                setTimeout(function(){
                    if(_this.picHidden){
                        clearTimeout(timer);
                    }
                }, 100);
            },
            picBlockBlur(){
                if(this.$store.state.sliderDragable){
                    return;
                }
                let _this = this;
                _this.picHidden = true;
                let timer = setTimeout(function(){
                    _this.picShow = false;
                }, 300);
                setTimeout(function(){
                    if(!_this.picHidden){
                        clearTimeout(timer);
                    }
                }, 100);
            },
            sliderActive(){
                this.IsSliderActive = true;
            },
            sliderBlur(){
                if(!this.$store.state.sliderDragable){
                    this.IsSliderActive = false;
                }
            },
            sliderClick(event){
                this.$store.commit('sliderDragable',true);
                this.$store.commit('sliderDragDistance', event.pageX);
            }
        }
    }
</script>

<style scoped>
    .pic-validate-block{
        position: relative;
    }
    .pic-validate-box{
        width: 240px;
        height: 140px;
        border-radius: 8px;
        position: absolute;
        bottom: 38px;
        left: 0px;
        z-index: 999;
        border: 1px solid black;
    }
    .pic-bottom{
        position: absolute;
        z-index: 2;
    }
    .pic-move{
        position: absolute;
        z-index: 3;
    }
    .pic-clear-box{
        width: 100%;
        height: 6px;
    }
    .slider-block{
        width: 240px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #dcdee2;
    }
    .slider-box{
        width: 32px;
        height: 32px;
        border: 1px solid #dcdee2;
        /*background: #1991fa;*/
        position: relative;
    }
    .slider-box span{
        width: 16px;
        height: 12px;
        background: url('../../assets/icons.png') 0px -13px no-repeat;
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -6px;
        margin-left: -8px;
    }
    .slider-box-active{
        background: #1991fa;
    }

    .slider-box-active span{
        background: url('../../assets/icons.png') 0px 0px no-repeat;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .6s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        display: none;
    }
</style>