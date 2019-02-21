<template>
    <div class="pic-validate-block" @mouseover="picBlockActive" @mouseout="picBlockBlur">
        <transition name="fade">
            <div class="pic-validate-box" v-show="picShow">
                <span></span>
                <canvas id="canvas_bot" class="pic-bottom" width="240" height="140"></canvas>
                <canvas id="canvas_move" class="pic-move" width="240" height="140"></canvas>
            </div>
        </transition>
        <div class="pic-clear-box"></div>
        <div class="slider-block">
            <div v-show="sliderTipShow" :style="{width: sliderDragDistance + 'px'}" class="slider-distance-box"
                 :class="[sliderDistanceBoxStatus]"></div>
            <span v-show="!sliderTipShow">向右拖动滑块填充拼图</span>
            <div class="slider-box" :class="[SliderStatus]" :style="{left: dragDistance + 'px'}"
                 @mouseover="sliderActive" @mouseout="sliderBlur"
                 @mousedown.stop.prevent="sliderClick">
                <span class="slider-box-ctrl"></span>
            </div>
            <span></span>
        </div>
    </div>
</template>

<script>
    import imgs from "../../config/imgsBatchImport.js";
    export default {
        name: "picValidation",
        data: function(){
            return {
                picShow: false,
                IsSliderFocus: false,
                randomX: 0,
                randomY: 0,
                imgData: {},
                showTimer: {},
                hiddenTimer: {}
            }
        },
        props:['dragDistance'],
        created(){
            this.picDraw();
        },
        computed: {
            SliderStatus: function(){
                if(this.$store.state.sliderValidation == 1){
                    return "slider-box-correct";
                }
                else if(this.$store.state.sliderValidation == 2){
                    return "slider-box-error";
                }else if(this.$store.state.sliderDragable || this.IsSliderFocus){
                    return "slider-box-active";
                }
                else{
                    return "";
                }
            },
            sliderTipShow: function(){
                return this.$store.state.sliderDragDistance > 0
            },
            sliderDragDistance: function(){
                return this.$store.state.sliderDragDistance
            },
            sliderDistanceBoxStatus: function(){
                if(this.$store.state.sliderValidation == 0){
                    return "slider-distance-box-show";
                }else if(this.$store.state.sliderValidation == 1){
                    return "slider-distance-box-correct";
                }else if(this.$store.state.sliderValidation == 2){
                    return "slider-distance-box-error";
                }
            }
        },
        methods: {
            picBlockActive(){
                let _this = this;
                clearTimeout(_this.hiddenTimer);
                this.showTimer = setTimeout(function(){
                    _this.picShow = true;
                },300);
            },
            picBlockBlur(){
                if(this.$store.state.sliderDragable){
                    return;
                }
                let _this = this;

                clearTimeout(_this.showTimer);
                _this.hiddenTimer = setTimeout(function(){
                    _this.picShow = false;
                }, 300);
            },
            sliderActive(){
                this.IsSliderFocus = true;
            },
            sliderBlur(){
                this.IsSliderFocus = false;
            },
            sliderClick(event){
                this.$store.commit('sliderDragable', true);
                this.$store.commit('sliderInitX', event.pageX);
                this.$emit("child-event", event.pageX);
            },
            picDraw() {
                var side = 14;
                var radius = 7;
                var sideLength = 2 * side + 0.5 * radius * (4 + 1.8);

                var maxX = 250 - sideLength;
                var minX = 2 * sideLength;

                var maxY = 140 - sideLength;
                var minY = radius + 0.5 * 1.8 * radius;

                //拼图补全位置
                this.randomX = 50;
                this.randomY = 50;

                let _this = this;
                let img = new Image();
                img.onload = function () {
                    var canvas_bot = document.getElementById('canvas_bot').getContext('2d');
                    canvas_bot.drawImage(img, 0, 0, 240, 140);
                    canvas_bot.save();
                    _this.drawJigsaw(canvas_bot, _this.randomX, _this.randomY, side, radius);
                    canvas_bot.stroke();
                    canvas_bot.clip();
                    _this.imgData = canvas_bot.getImageData(_this.randomX, _this.randomY - radius * (1 + 0.5 * 1.8),
                        2 * side + radius * (2 + 0.5 * 1.8),
                        2 * side + radius * (2 + 0.5 * 1.8));
                    canvas_bot.fillStyle = 'rgba(1, 1, 1, 0.92)';
                    canvas_bot.fillRect(0, 0, 240, 140);

                    canvas_bot.restore();

                    var canvas_move = document.getElementById('canvas_move').getContext('2d');

                    canvas_move.clearRect(0, 0, 240, 140);

                    canvas_move.putImageData(_this.imgData, 1, _this.randomY - radius * (1 + 0.5 * 1.8));
                    canvas_move.globalCompositeOperation = "destination-in";
                    canvas_move.save();

                    _this.drawJigsaw(canvas_move, 0, _this.randomY, side, radius);
                    canvas_move.fill();
                    canvas_move.clip();
                    canvas_move.restore();
                },
                img.onerror = function(){
                    console.log("load image error!");
                }
                let pic_index = Math.floor(Math.random() * 10);
                img.src = imgs[pic_index];
            },
            drawJigsaw(canvasObj, randomX, randomY, side, radius) {
                canvasObj.strokeStyle = "rgba(220, 220, 220, 0.97)";
                canvasObj.lineWidth = 2;
                canvasObj.beginPath();
                canvasObj.moveTo(randomX, randomY);
                canvasObj.lineTo(randomX + side, randomY);
                canvasObj.arc(randomX + side + 0.5 * radius, randomY - radius * 0.5 * 1.8, radius, 2 / 3 * Math.PI, 1 / 3 * Math.PI, false);
                canvasObj.lineTo(randomX + 2 * side + radius, randomY);
                canvasObj.lineTo(randomX + 2 * side + radius, randomY + side);
                canvasObj.arc(randomX + 2 * side + radius + radius * 0.5 * 1.8, randomY + side + 0.5 * radius, radius, 7 / 6 * Math.PI, 5 / 6 * Math.PI, false);
                canvasObj.lineTo(randomX + 2 * side + radius, randomY + 2 * side + radius);
                canvasObj.lineTo(randomX, randomY + 2 * side + radius);
                canvasObj.lineTo(randomX, randomY + side + radius);
                canvasObj.arc(randomX + radius * 0.5 * 1.8, randomY + side + 0.5 * radius, radius, 5 / 6 * Math.PI, 7 / 6 * Math.PI, true);
                canvasObj.lineTo(randomX, randomY);
            },
            moveJigsaw(dragX) {
                var ctx_move = document.getElementById('canvas_move').getContext('2d');
                ctx_move.clearRect(0, 0, 240, 140);
                ctx_move.putImageData(this.imgData, dragX, this.randomY - 7 * (1 + 0.5 * 1.8)+1);
                ctx_move.globalCompositeOperation = "destination-in";
                ctx_move.save();
                this.drawJigsaw(ctx_move, dragX, this.randomY, 14, 7);
                ctx_move.closePath();
                ctx_move.fillStyle = 'green';
                ctx_move.fill();
                ctx_move.clip();
                ctx_move.restore();
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
        border-radius: 6px;
        position: absolute;
        bottom: 38px;
        left: 0px;
        z-index: 999;
        overflow: hidden;
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
        text-align: center;
        position: relative;
    }
    .slider-distance-box{
        height: 32px;
        border-right: 0px;

        position: absolute;
    }
    .slider-distance-box-show{
        background: #d1e9fe;
        border: 1px solid #1991fa;
    }
    .slider-distance-box-correct{
        background: #d2f4ef;
        border: 1px solid #52ccba;
    }
    .slider-distance-box-error{
        background: #fce1e1;
        border: 1px solid #f57a7a;
    }
    .slider-box{
        width: 32px;
        height: 32px;
        border: 1px solid #dcdee2;
        position: absolute;
        top: 0px;
        left: 0px;
    }

    .slider-box span.slider-box-ctrl{
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
        border: 1px solid #1991fa;
    }

    .slider-box-correct{
        background: #52ccba;
        border: 1px solid #52ccba;
    }
    .slider-box-error{
        background: #f57a7a;
        border: 1px solid #f57a7a;
    }

    .slider-box-active span.slider-box-ctrl {
        background: url('../../assets/icons.png') 0px 0px no-repeat;
    }

    .slider-box-correct span.slider-box-ctrl {
        background: url('../../assets/icons.png') 0px -26px no-repeat;
    }

    .slider-box-error span.slider-box-ctrl {
        background: url('../../assets/icons.png') 0px -68px no-repeat;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .1s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        display: none;
    }
</style>