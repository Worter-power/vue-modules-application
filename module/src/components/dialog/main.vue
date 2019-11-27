<template>
    <transition :name="'dialog-slide-'+slide">
        <div
            :class="[{'sy-dialog-box': !modalAppendToBody},{'sy-dialog-full-box': modalAppendToBody}, themeClassName, changeTheme]"
            v-show="visible"
            @click.self="handleWrapperClick">
            <div class="sy-dialog"
                :class="{'sy-dialog-img': showImg}"
                :style="sySialog"
                ref="dialog">
                <div v-if="!showImg" ref="header" class="sy-dialog__header" :class="[ bgcolor ? 'sy-theme-background' : 'sy-dialog__header-white']"
                    @mousedown="mousedown">
                    <slot name="title" >
                        <span class="sy-dialog__title" :style="titleStyle">{{title}}</span>
                    </slot>
                    <button type="button"
                        class="sy-dialog__headerbtn"
                        aria-label="Close" 
                        v-if="showClose" 
                        @click="handleClose">
                        <i class="el-dialog__close el-icon el-icon-close"></i>
                    </button>
                </div>
                <div v-if="showImg" class="sy-dialog__header_img">
                    <i class="el-dialog__close el-icon el-icon-close" @click="handleClose"></i>
                </div>

                <div class="sy-dialog__body"
                    :class="{'bg-white': !showImg}"
                    :style="sySialogBody">
                    <slot></slot>
                </div>

                <div class="sy-dialog__footer" v-if="$slots.footer && !showImg"
                    :style="{height: footHeight,'line-height': footHeight, borderTopWidth: bgcolor ? '1px' : '0'}">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import popup from "@/utils/popup.js";
    import emitter from "@/utils/emitter.js";

    export default {
        name: "PhDialog",
        mixins: [popup, emitter],
        props: {
            dragged: {
                type: Boolean,
                default: true
            },
            bgcolor: {
                type: Boolean,
                default: true
            },
            showImg: {
                type: Boolean,
                default: false
            },
            slide: {
                type: String,
                default: "fade"
            },
            position: {
                type: [String, Array],
                default: "middle"
            },
            width: {
                type: String,
                default: "60%"
            },
            footHeight: {
                type: String,
                default: "40px"
            },
            height: {
                type: String,
                default: "auto"
            },
            boxHeight: {
                type: String,
                default: "auto"
            },
            title: {
                type: String,
                default: ""
            },
            modal: {
                type: Boolean,
                default: true
            },

            modalAppendToBody: {
                type: Boolean,
                default: true
            },

            appendToBody: {
                type: Boolean,
                default: false
            },

            lockScroll: {
                type: Boolean,
                default: true
            },

            closeOnClickModal: {
                type: Boolean,
                default: false
            },

            closeOnPressEscape: {
                type: Boolean,
                default: true
            },

            showClose: {
                type: Boolean,
                default: true
            },

            size: {
                type: String,
                default: "small"
            },

            customClass: {
                type: String,
                default: ""
            },

            top: {
                type: String,
                default: "15%"
            },
            beforeClose: Function,
            themes: {
                type: Object
            },
            titleStyle: {
                type: Object,
                default: ()=>{
                    return {}
                }
            }
        },
        data() {
            return {
                selectElement: null,
                changeTheme: ''
            };
        },
        watch: {
            visible(val) {
                this.$emit("update:visible", val);
                if (val) {
                    this.$emit("open");
                    this.$el.addEventListener("scroll", this.updatePopper);
                    this.$nextTick(() => {
                        this.$refs.dialog.scrollTop = 0;
                        let dom = document.getElementById('app');
                        let className = dom ? dom.className : '';
                        this.changeTheme = className;
                    });
                    if (this.appendToBody) {
                        document.body.appendChild(this.$el);
                    }
                } else {
                    this.$el.removeEventListener("scroll", this.updatePopper);
                    this.$emit("close");
                }
            }
        },

        computed: {
            themeClassName(){
                let dom = document.getElementById('app');
                let className = dom ? dom.className : null;
                return className || 'd-f-t';
            },
            sySialogBody(){
                let winWidth = 0;
                if (window.innerHeight)
                    winWidth = window.innerHeight;
                else if ((document.body) && (document.body.clientHeight))
                    winWidth = document.body.clientHeight;
                return {
                    height: this.height,
                    maxHeight: winWidth-180+'px',
                    'border-bottom-left-radius': this.$slots.footer ? '0' : '5px',
                    'border-bottom-right-radius': this.$slots.footer ? '0' : '5px'
                }
            },
            sySialog() {
                let obj = {
                    position: this.modalAppendToBody ? 'fixed' : 'absolute',
                    height: this.boxHeight,
                    width: this.width
                };
                if(typeof this.position == 'string'){
                    if(this.position == 'right'){
                        obj.right = 0;
                        obj.left = 'auto';
                        obj.transform = "translate(0,-50%)"
                    }else if(this.position == 'left'){
                        obj.left = 0;
                        obj.transform = "translate(0,-50%)"
                    }else if(this.position == 'top'){
                        obj.top = 0;
                        obj.transform = "translate(-50%,0)"
                    }else if(this.position == 'bottom'){
                        obj.top = 'auto';
                        obj.bottom = 0;
                        obj.transform = "translate(-50%,0)"
                    }else if(this.position == 'tr'){
                        obj.top = 0;
                        obj.right = 0;
                        obj.left = 'auto';
                        obj.transform = "translate(0,0)"
                    }
                }else{
                    obj.top = this.position[0] || 0;
                    obj.right = this.position[1] || 0;
                    obj.bottom = this.position[2] || 0;
                    obj.left = this.position[3] || 0;
                    obj.transform = "translate(0,0)"
                }
               
                return obj;
            },
            sizeClass() {
                return `el-dialog--${this.size}`;
            },
            style() {
                return this.size === "full" ? {} : {top: this.top};
            }
        },

        methods: {
            fixedHeight() {
                let $dialog = this.$refs.dialog;
                if (!$dialog) {
                    return false;
                }
                let $body = $dialog.querySelector('.sy-dialog__body_auto,.sy-dialog__body');
                $body.style.paddingBottom = '';
                $body.style.paddingBottom = ($dialog.offsetHeight % 2) + 'px';
            },
            handleWrapperClick() {
                if (!this.closeOnClickModal) return;
                this.handleClose();
            },
            handleClose() {
                if (typeof this.beforeClose === "function") {
                    this.beforeClose(this.hide);
                } else {
                    this.hide();
                }
            },
            hide(cancel) {
                if (cancel !== false) {
                    this.$emit("update:visible", false);
                    this.$emit("visible-change", false);
                }
            },
            updatePopper() {
                this.broadcast("ElSelectDropdown", "updatePopper");
                this.broadcast("ElDropdownMenu", "updatePopper");
            },
            mousedown(event){
                if(!this.dragged){
                    return
                }
                this.selectElement = this.$refs.dialog;
                
                var div1 = this.selectElement
                var divWidth = div1.offsetWidth;
                var divHeight = div1.offsetHeight;
                
                this.selectElement.style.cursor = 'move'
                var startX = event.clientX;
                var startY = event.clientY;
                var distanceX = startX - this.selectElement.offsetLeft
                var distanceY = startY - this.selectElement.offsetTop
                document.onmousemove = function (ev) {
                    var oevent = ev || event
                    var lefts = oevent.clientX - distanceX;
                    var tops = oevent.clientY - distanceY;

                    if (lefts < divWidth / 2) {
                        lefts = divWidth / 2;
                    } else if (lefts > document.body.offsetWidth - divWidth / 2) {
                        lefts = document.body.offsetWidth - divWidth / 2;
                    }

                    if (tops < divHeight / 2) {
                        tops = divHeight / 2;
                    } else if (tops > document.body.offsetHeight - divHeight / 2) {
                        tops = document.body.offsetHeight - divHeight / 2;
                    }

                    div1.style.left = lefts + 'px'
                    div1.style.top = tops + 'px'
                    startY = oevent.clientY;
                }
                document.onmouseup = function () {
                    document.onmousemove = null
                    document.onmouseup = null
                    div1.style.cursor = 'default'
                }
            }
        },
        updated() {
            this.fixedHeight();
        },
        mounted() {
            if (this.visible) {
                this.open();
                if (this.appendToBody) {
                    document.body.appendChild(this.$el);
                }
            }
            this.fixedHeight();
        },
        destroyed() {
            // if appendToBody is true, remove DOM node after destroy
            if (this.appendToBody && this.$el && this.$el.parentNode) {
                this.$el.parentNode.removeChild(this.$el);
            }
        }
    };
</script>

<style lang="scss">
.sy-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1500;
    box-shadow: $--box-shadow-dark;
    transform: translate(-50%, -50%);
    max-height: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    &.sy-dialog-img {
        box-shadow: none;
    }
}

.sy-dialog__body {
    overflow: auto;
    font-size: $--font-size-base;
    box-sizing: border-box;
    width: 100%;
    min-height: 60px;
    position: relative;
    &.bg-white {
        background-color: #fff;
    }
    >div {
        height: 100%;
        box-sizing: border-box;
    }
}
.sy-dialog-box {
    position: absolute;
    background-color: rgba(0, 0, 0, 0);
    top: 0;
    left: 0;
    height: 100%;
    z-index: 1500;
    width: 100%;
}

.sy-dialog-full-box {
    position: fixed;
    background-color: rgba(0, 0, 0, 0);
    top: 0;
    height: 100%;
    z-index: 1500;
    left: 0;
    width: 100%;
}

.sy-dialog__header {
    padding: 0 20px;
    background: $--color-primary;
    top: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    z-index: 1500;
    box-sizing: border-box;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    color: #fff;
    &.sy-dialog__header-white{
        background-color: #ffffff;
        color: $--color-text-regular;
        .sy-dialog__title {
            color: $--color-text-regular;
        }
        .sy-dialog__headerbtn {
            color: $--color-text-regular;
        }
    }
    .sy-dialog__title {
        line-height: 1;
        font-size: 14px;
        font-weight: 700;
        color: #fff;
    }
    .sy-dialog__headerbtn {
        float: right;
        background: transparent;
        border: none;
        outline: 0;
        padding: 0;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
        width: 40px;
        line-height: 40px;
        position: relative;
        left: 10px;
    }
}

.sy-dialog__footer {
    width: 100%;
    box-sizing: border-box;
    text-align: right;
    z-index: 1500;
    box-sizing: border-box;
    padding: 0 10px;
    background-color: #fff;
    border-top: 1px solid #dfe6ec;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.sy-dialog__header_img {
    position: relative;
    >i {
        position: absolute;
        background: rgba(0, 0, 0, .4);
        outline: 0;
        padding: 0;
        border: none;
        cursor: pointer;
        color: #fff;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        top: -30px;
        right: -30px;
        font-size: 22px;
        box-sizing: border-box;
        line-height: 40px;
        border: 2px solid #fff;
        vertical-align: middle;
        text-align: center;
        z-index: 1;
    }
}


/*fade*/

.dialog-slide-fade-enter-active,
.dialog-slide-fade-leave-active {
    transition: opacity .3s;
}

.dialog-slide-fade-enter,
.dialog-slide-fade-leave-to {
    opacity: 0
}


/*/*右进右出*/

.dialog-slide-right-enter-active {
    animation: dialog-slide-right-in .5s;
}

.dialog-slide-right-leave-active {
    animation: dialog-slide-right-out .5s;
}


/*左进左出*/

.dialog-slide-left-enter-active {
    animation: dialog-slide-left-in .5s;
}

.dialog-slide-left-leave-active {
    animation: dialog-slide-left-out .5s;
}


/*左进右出*/

.dialog-slide-lr-enter-active {
    animation: dialog-slide-left-in .5s;
}

.dialog-slide-lr-leave-active {
    animation: dialog-slide-right-out .5s;
}


/*右进左出*/

.dialog-slide-rl-enter-active {
    animation: dialog-slide-right-in .5s;
}

.dialog-slide-rl-leave-active {
    animation: dialog-slide-left-out .5s;
}


/*上进上出*/

.dialog-slide-top-enter-active {
    animation: dialog-slide-top-in .5s;
}

.dialog-slide-top-leave-active {
    animation: dialog-slide-top-out .5s;
}


/*上进下出*/

.dialog-slide-tb-enter-active {
    animation: dialog-slide-top-in .5s;
}

.dialog-slide-tb-leave-active {
    animation: dialog-slide-bottom-out .5s;
}


/*下进下出*/

.dialog-slide-bottom-enter-active {
    animation: dialog-slide-bottom-in .5s;
}

.dialog-slide-bottom-leave-active {
    animation: dialog-slide-bottom-out .5s;
}


/*下进上出*/

.dialog-slide-bt-enter-active {
    animation: dialog-slide-bottom-in .5s;
}

.dialog-slide-bt-leave-active {
    animation: dialog-slide-top-out .5s;
}

@keyframes dialog-slide-right-in {
    0% {
        transform: translate3d(100%, 0, 0);
        opacity: 0;
    }
    100% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
}

@keyframes dialog-slide-left-in {
    0% {
        transform: translate3d(-100%, 0, 0);
        opacity: 0;
    }
    100% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
}

@keyframes dialog-slide-right-out {
    0% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
    100% {
        transform: translate3d(100%, 0, 0);
        opacity: 0;
    }
}

@keyframes dialog-slide-left-out {
    0% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
    100% {
        transform: translate3d(-100%, 0, 0);
        opacity: 0;
    }
}

@keyframes dialog-slide-top-in {
    0% {
        transform: translate3d(0, -100%, 0);
        opacity: 0;
    }
    100% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
}

@keyframes dialog-slide-top-out {
    0% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
    100% {
        transform: translate3d(0, -100%, 0);
        opacity: 0;
    }
}

@keyframes dialog-slide-bottom-in {
    0% {
        transform: translate3d(0, 100%, 0);
        opacity: 0;
    }
    100% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
}

@keyframes dialog-slide-bottom-out {
    0% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
    100% {
        transform: translate3d(0, 100%, 0);
        opacity: 0;
    }
}

.sy-full-model {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000
}

.sy-model {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000
}

.sy-modal-enter {
    animation: v-modal-in .2s ease
}

.sy-modal-leave {
    animation: v-modal-out .2s ease forwards
}

@keyframes v-modal-in {
    0% {
        opacity: 0
    }
}

@keyframes v-modal-out {
    100% {
        opacity: 0
    }
}

.dialog-slide-fold-enter-active {
    animation-name: fold-in;
    animation-duration: .5s;
}

.dialog-slide-fold-leave-active {
    animation-name: fold-out;
    animation-duration: .5s;
}

@keyframes fold-in {
    0% {
        transform: translate3d(0, 100%, 0);
    }
    50% {
        transform: translate3d(0, 50%, 0);
    }
    100% {
        transform: translate3d(0, 0, 0);
    }
}

@keyframes fold-out {
    0% {
        transform: translate3d(0, 0, 0);
    }
    50% {
        transform: translate3d(0, 50%, 0);
    }
    100% {
        transform: translate3d(0, 100%, 0);
    }
}

.v-modal-enter {
    animation: v-modal-in .2s ease;
}

.v-modal-leave {
    animation: v-modal-out .2s ease forwards;
}

@keyframes v-modal-in {
    0% {
        opacity: 0;
    }
    100% {}
}

@keyframes v-modal-out {
    0% {}
    100% {
        opacity: 0;
    }
}

.v-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
}
</style>