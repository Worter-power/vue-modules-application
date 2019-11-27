<template>
  <div id="ph-theme-bg-canvas" class="el-global-background" :class="[theme]">
    <canvas id="canvas" class="canvas"></canvas>
    <div class="backgrount-lotus-img" v-if="theme == 'lotus'">
        <div class="border-left-top"></div>
        <div class="border-left-bottom"></div>
        <div class="border-right-top"></div>
        <div class="border-right-bottom"></div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'ElBackground',
        props: {
            theme: {
                type: String,
                default: 'ink'
            },
            origin: {
                type: String,
                default: ''
            }
        },
        watch: {
            theme(newVal,oldVal){
                this.drawBgImg();
            }
        },
        data(){
            return{
                canvas: {
                    x: null,
                    w: null,
                    h: null
                },
                imageCanvas: {
                    x: null,
                    w: null,
                    h: null
                }
            }
        },
        methods: {
            init(){
                let c = document.getElementById('canvas'),
                    x = c.getContext('2d'),
                    // pr = window.devicePixelRatio || 1,
                    pr = 1,
                    w = window.innerWidth,
                    h = window.innerHeight
                c.width = w * pr;
                c.height = h * pr;
                this.canvas.x = x;
                this.canvas.w = w;
                this.canvas.h = h;  
                this.drawBgImg();
            },
            drawBgImg(){
                if(!this.canvas.x){return}
                let me = this;
                if(this.theme == 'ink'){
                    me.canvas.x.clearRect(0, 0, me.canvas.w, me.canvas.h);
                    let header = new Image();
                    let footerImg = new Image();
                    let center = new Image();
                    header.src = this.origin+'/common/images/theme/ink/ink-header.jpg';
                    footerImg.src = this.origin+'/common/images/theme/ink/ink-footer.jpg';
                    center.src = this.origin+'/common/images/theme/ink/ink-center.jpg';
                    let numbers = 0;
                    let drawImg = () => {
                        // 绘制背景
                        let n = 1;
                        let funs =  () => {
                            this.canvas.x.drawImage(center, 0, this.canvas.h-n*center.height, this.canvas.w, center.height);
                            if(n*center.height < this.canvas.h){
                                n++;
                                funs();
                            }
                        }
                        funs();
                        // 绘制头部
                        this.canvas.x.drawImage(header, 0, 0, this.canvas.w, header.height);
                        // 绘制页脚
                        this.canvas.x.drawImage(footerImg, 0, this.canvas.h-footerImg.height, this.canvas.w, footerImg.height)
                    }
                    // 图片进度控制
                    center.onload = function(){
                        numbers++;
                        if(numbers === 3){
                            drawImg();
                        }
                    }
                    footerImg.onload = function(params) {
                        numbers++;
                        if(numbers === 3){
                            drawImg();
                        }
                    }
                    header.onload = function(){
                        numbers++;
                        if(numbers === 3){
                            drawImg();
                        }
                    }

                }else if(this.theme == 'lotus'){
                    me.canvas.x.clearRect(0, 0, me.canvas.w, me.canvas.h);
                    let bgimg = new Image();
                    let dy = new Image();
                    bgimg.src = this.origin+'/common/images/theme/lotus/bg.png';
                    dy.src = this.origin+'/common/images/theme/lotus/dy.png';
                    bgimg.onload = function() {
                        me.canvas.x.drawImage(this, 0, me.canvas.h-this.height, me.canvas.w, this.height)
                    }
                    dy.onload = function() {
                        me.canvas.x.drawImage(this, me.canvas.w*0.6, 0)
                    }
                } else {
                    me.canvas.x.clearRect(0, 0, me.canvas.w, me.canvas.h);
                }
            },
            drawImg(){
                if(!this.imageCanvas.x){return}
                let me = this;
                if(this.theme == 'ink'){
                    let img1 = new Image();
                    img1.src = this.origin+'/common/images/theme/ink/ink-img-left.png';
                    img1.onload = function(){
                        me.imageCanvas.x.drawImage(img1, 0, 0, this.width, this.height);
                    }
                }else{
                    me.imageCanvas.x.clearRect(0, 0, me.imageCanvas.w, me.imageCanvas.h);
                }
            }
        },
        mounted () {
            this.init();
        }
    }
</script>

<style lang="scss" scoped>
.el-global-background {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    &.lotus {
        background-color: #F2FEF0;
    }
    .backgrount-lotus-img {
        position: absolute;
        top: 80px;
        left: 20px;
        right: 20px;
        bottom: 40px;
        border: 1px solid #A4A587;
        background-color: rgba(255, 255, 255, .6);
    }

    .backgrount-lotus-img .border-left-top,
    .backgrount-lotus-img .border-left-bottom,
    .backgrount-lotus-img .border-right-top,
    .backgrount-lotus-img .border-right-bottom {
        position: absolute;
        width: 50px;
        height: 50px;
    }

    .backgrount-lotus-img .border-left-top {
        background: url('/common/images/theme/lotus/border-left-top.png') no-repeat left top;
    }

    .backgrount-lotus-img .border-left-bottom {
        bottom: 0;
        background: url('/common/images/theme/lotus/border-left-bottom.png') no-repeat left bottom;
    }

    .backgrount-lotus-img .border-right-top {
        right: 0;
        background: url('/common/images/theme/lotus/border-right-top.png') no-repeat right top;
    }

    .backgrount-lotus-img .border-right-bottom {
        right: 0;
        bottom: 0;
        background: url('/common/images/theme/lotus/border-right-bottom.png') no-repeat right bottom;
    }

    #canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}

</style>