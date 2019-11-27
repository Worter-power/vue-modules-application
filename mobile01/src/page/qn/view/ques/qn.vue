<template>
    <div class="qn-page-qn">
        <div class="laptop anim">
            <div class="laptop-t"></div>
            <div class="laptop-b"></div>
            <div class="hook">
                <div class="paper">
                    <span class="paper-line l1"></span>
                    <span class="paper-line l2"></span>
                    <span class="paper-line l3"></span>
                    <span class="paper-line l4"></span>
                    <span class="paper-line l5"></span>
                    <span class="paper-line l6"></span>
                    <span class="paper-line l7"></span>
                    <span class="paper-block"></span>
                </div>
                <div class="pen">
                    <div class="pen-t"></div>
                    <div class="pen-m"></div>
                    <div class="pen-b sy-theme-background"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.qn-page-qn{
    .laptop{
        position: relative;
        width: 232px;
        height: 150px;
        margin: 0 auto;
        $border-radius: 10px;
        .laptop-t{
            position: absolute;
            left: 50%;
            bottom: 8px;
            margin-left: -94px;
            width: 188px;
            height: 127px;
            border-top-left-radius: $border-radius;
            border-top-right-radius: $border-radius;
            background-color: #242d3b;
            transform-origin: 50% 100%;
            &:after{
                content: '';
                position: absolute;
                left: 8px;
                top: 8px;
                bottom: 8px;
                right: 8px;
                background-color: #ced8e3;
            }
        }
        .laptop-b{
            position: absolute;
            left: 0;
            bottom: 0;
            width: 232px;
            height: 8px;
            border-bottom-left-radius: $border-radius;
            border-bottom-right-radius: $border-radius;
            background-color: #c4ccd9;
            &:after{
                content: '';
                position: absolute;
                left: 100px;
                width: 32px;
                height: 4px;
                top: 0;
                background-color: #99a2b3;
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
            }
        }
        .hook{
            position: absolute;
            left: 30px;
            bottom: 16px;
            width: 172px;
            height: 134px;
            overflow: hidden;
            .paper{
                position: absolute;
                left: 29px;
                bottom: 0px;
                width: 118px;
                height: 134px;
                overflow: hidden;
                &:before{
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 50%;
                    margin-left: -57px;
                    width: 114px;
                    height: 134px;
                    border-top-left-radius: 5px;
                    border-top-right-radius: 5px;
                    background-color: #ffffff;
                    -webkit-box-shadow: 0 2px 2px 0 #ced8e3;
                    box-shadow: 0 2px 2px 0 #ced8e3;
                }
                .paper-line{
                    position: absolute;
                    left: 19px;
                    top: 28px;
                    width: 80px;
                    height: 5px;
                    background: #d8e0ea;
                    &.l2{
                        top: 42px;
                    }
                    &.l3{
                        top: 56px;
                        left: 50px;
                        width: 49px;
                    }
                    &.l4{
                        top: 70px;
                        left: 50px;
                        width: 49px;
                    }
                    &.l5{
                        top: 84px;
                    }
                    &.l6{
                        top: 98px;
                    }
                    &.l7{
                        top: 112px;
                    }
                }
                .paper-block {
                    position: absolute;
                    left: 19px;
                    top: 56px;
                    width: 23px;
                    height: 19px;
                    background: #d8e0ea;
                }
            }
            .pen{
                position: absolute;
                right: 44px;
                bottom: 0;
                width: 16px;
                height: 93px;
                .pen-t{
                    position: absolute;
                    left: 4px;
                    top: 0;
                    width: 0;
                    height: 0;
                    border-left: 4px solid transparent;
                    border-right: 4px solid transparent;
                    border-bottom: 8px solid #242d3b;
                    z-index: 1;
                }
                .pen-m{
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 0;
                    height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-bottom: 16px solid #dfe6f0;
                }
                .pen-b{
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 16px;
                    height: 77px;
                    background: $--color-primary;
                }
            }
        }

    }
}
</style>