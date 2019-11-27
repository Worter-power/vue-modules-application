<template>
    <div class="el-page-login" id="el-page-login" :style="{'z-index': modelIndex}" v-if="visiblebox">
        <div class="el-page-login-box">
            <h3>{{logintext[langType].l1}}</h3>
            <ul class="el-page-login-box-form">
                <li>
                    <span class="sy-theme-text">
                        <i class="fa fa-user-circle-o"></i>
                    </span>
                    <div class="el-page-login-input">
                        <input ref="username" type="text" :placeholder="logintext[langType].l2" v-model.trim="loginForm.username"
                            @change="handleInputChagne('name')" @blur="handleInputChagne('name')">
                    </div>
                    <div v-if="errormsg1" :style="{opacity: errormsg1 ? 1 : 0}">{{errormsg1}}</div>
                </li>
                <li>
                    <span class="sy-theme-text">
                        <i class="fa fa-lock"></i>
                    </span>
                    <div class="el-page-login-input">
                        <input ref="password" type="password" :placeholder="logintext[langType].l3" v-model.trim="loginForm.password"
                            @change="handleInputChagne('password')" @blur="handleInputChagne('password')">
                    </div>
                    <div v-if="errormsg2" :style="{opacity: errormsg2 ? 1 : 0}">{{errormsg2}}</div>
                </li>
            </ul>
            <div class="el-page-login-box-ctr">
                <label for="remenberPassWord" :class="{focus: focus, 'sy-theme-text': focus}" >
                    <span class="el-page-login-checkbox sy-theme-border-hover" :class="{'is-checked': remenberPassWord, 'sy-theme-background': remenberPassWord}"></span>
                    <input type="checkbox" aria-hidden="true"
                        name="name"
                        id="remenberPassWord"
                        v-model="remenberPassWord"
                        @change="handleChange"
                        @focus="focus = true"
                        @blur="focus = false">
                    <span class="el-page-login-checkbox-label" :class="{'sy-theme-text': remenberPassWord}">{{logintext[langType].l4}}</span>
                </label>
                <a @click="handleJumpfogot" class="sy-theme-text">{{logintext[langType].l5}}</a>
            </div>
            <div>
                <button class="sy-theme-background" @click.stop="handleSubmitlogin">{{logintext[langType].l6}}</button>
            </div>
                
            <ul class="el-page-login-box-others" v-if="showOthers && otherList.length > 0">
                <li v-for="item in otherList" :key="item.id" @click="handleJumpOtherPlatform(item)">
                    <img :src="item.logo" alt="">
                </li>
            </ul>
            <div class="weixin-box" v-if="showOthers && clickWeixin">
                <i class="fa fa-times-circle" @click="clickWeixin = false"></i>
                <div id="login_container_weixin"></div>
            </div>
        </div>
    </div>
</template>

<script>
import {getStyle} from '@/utils/dom';
import {getQueryString, generateMixed} from '@/utils/href.js';
export default {
    created(){
        try {
            let lconfig = JSON.parse(localStorage.getItem("rempass"));
            if (lconfig) {
                if (lconfig.rempass) {
                    this.remenberPassWord = true;
                    this.loginForm.username = lconfig._;
                    this.loginForm.password = this.uncompileStr(lconfig.__);
                } else {
                    localStorage.removeItem("rempass");
                }
            }
        } catch (error) {
            
        }
        if(this.showOthers){
            this.getOrthers();
        }
    },
    data(){
        return {
            msg: ''
        }
    },
    methods: {
        getQueryString, 
        generateMixed,
        // 查询第三方登录
        getOrthers(){
            // ----
        },
        // 第三方登录
        handleJumpOtherPlatform(d){
            //----
        },
        handleJumpfogot(){
            // -----
        },
        handleChange(e){
            if(this.remenberPassWord){
                localStorage.setItem("rempass", JSON.stringify({
                    "rempass": this.remenberPassWord,
                    "_": this.loginForm.username,
                    "__": this.compileStr(this.loginForm.password)
                }))
            }else{
                localStorage.removeItem("rempass");
            }
        },
        _validata(t){
            if(!this.loginForm.username || !this.loginForm.password){
                this.errormsg1 = t == 'password' ? '' : (this.loginForm.username ? '' : this.logintext[langType].l7);
                this.errormsg2 = t == 'name'? '' : (this.loginForm.password ? '' : this.logintext[langType].l8);
                return false
            }else{
                return true
            }
        },
        handleInputChagne(t){
            this._validata(t);
        },
        handleSubmitlogin() {
            if(!this._validata()){return}
            if(!this.confirmButtonLoading){
                this.confirmButtonLoading = true;
                // --
            }
        },
        handleAction(action) {
            this.action = action;
            if (typeof this.beforeClose === 'function') {
                this.beforeClose(action, this, this.doClose);
            } else {
                this.doClose();
            }
        },
        doClose() {
            this.visiblebox = false;
            setTimeout(() => {
                if (this.action) this.callback(this.action, this);
            });
        },
        // 加密
        compileStr(code){
            var c=String.fromCharCode(code.charCodeAt(0)+code.length);  
            for(var i=1;i<code.length;i++){        
                c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));  
            }     
            return escape(c);
        },
        // 解密
        uncompileStr(code){
            code = unescape(code);        
            var c=String.fromCharCode(code.charCodeAt(0)-code.length);        
            for(var i=1;i<code.length;i++){        
                c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));        
            }        
            return c;
        },
        // 回车事件
        moveBackFocus(){
            /**
             * loginForm: {
                username: '',
                password: '',
                noIntercept: true
            }
                this.errormsg1 = '';
                this.errormsg2
            */
            if(this.loginForm.username && this.loginForm.password && !this.errormsg1 && !this.errormsg2){
                this.handleSubmitlogin();
            } else {
                if(!this.loginForm.username){
                    this.$refs.username.focus();
                }else{
                    this.$refs.password.focus();
                }
            }
        }
    },
    mounted(){
        let _this = this;
        document.onkeyup = function (event) {
            let e = event || window.event;
            let keyCode = e.keyCode || e.which;
            switch (keyCode) {
                case 13:
                    _this.moveBackFocus();
                    break;
                default:
                    break;
            }
        }
    }

}
</script>

<style lang="scss" scoped>
$login-box-width: 360px;
.el-page-login{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .5);
    .weixin-box{
        padding: 0;
        position: absolute;
        height: 400px;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        background-color: #fff;
        >i{
            position: absolute;
            right: 10px;
            top: 10px;
            font-size: 22px;
            color: $--color-primary;
            cursor: pointer;
            &:hover{
                opacity: .8;
            }
        }
        >div{
            height: 100%;
            width: 100%;
            >iframe{
                margin: 0 auto;
            }
        }
    }
    .el-page-login-box{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        box-shadow: $--box-shadow-dark;
        min-height: 308px;
        width: $login-box-width;
        padding: 0;
        box-sizing: border-box;
        background-color: $--color-white;
        border-radius: $--border-radius-base;
        font-size: $--font-size-medium;
        >h3{
            text-align: center;
            margin: 0;
            padding: 0;
            height: 60px;
            line-height: 60px;
        }
        $login-line-height: 40px;
        $login-input-width: 268px;
        >ul{
            padding: 0 20px;
            li{
                padding-bottom: 20px;
                overflow: hidden;
                position: relative;
                >.el-page-login-input+div{
                    position: absolute;
                    width: 100%;
                    box-sizing: border-box;
                    line-height: 20px;
                    font-size: 12px;
                    bottom: 0;
                    padding:  0;
                    color: $--color-danger;
                    transition: all .3s;
                    opacity: 0;
                }
                >span{
                    float: left;
                    width: 50px;
                    height: $login-line-height;
                    text-align: center;
                    box-sizing: border-box;
                    line-height: $login-line-height;
                    background-color: $--border-color-extra-light;
                    color: $--color-primary;
                    border: 1px solid $--border-color-base;
                    border-top-left-radius: $--border-radius-small;
                    border-bottom-left-radius: $--border-radius-small;
                    border-right: none;
                    .focus{
                        border-color: $--color-text-secondary;
                    }
                }
                input{
                    height: $login-line-height;
                    width: $login-input-width;
                    outline: 0;
                    padding: 0 10px;
                    font-size: 12px;
                    box-sizing: border-box;
                    border: 1px solid $--border-color-base;
                    border-top-right-radius: $--border-radius-small;
                    border-bottom-right-radius: $--border-radius-small;
                    &:focus,
                    &:hover{
                        border-color: $--color-text-secondary;
                    }
                    &::placeholder{
                        color: $--color-text-placeholder;
                    }
                }
            }
        }
        >div{
            padding: 10px 20px;
            &.el-page-login-box-ctr{
                line-height: 22px;
                font-size: 12px;
                vertical-align: middle;
                padding-top: 0px;
                overflow: hidden;
                a{
                    float: right;
                    cursor: pointer;
                    &:hover{
                        text-decoration: underline;
                    }
                }
                label{
                    float: left;
                    vertical-align: middle;cursor: pointer;
                    position: relative;
                    color: $--color-text-regular;
                    $check-size: 14px;
                    .el-page-login-checkbox{
                        display: inline-block;
                        border-radius: $--border-radius-small;
                        width: $check-size;
                        height: $check-size;
                        box-sizing: border-box;
                        background-color: $--color-white;
                        vertical-align: middle;
                        border: 1px solid $--border-color-base;
                        transition: all .15s ease;
                        position: relative;
                        &::after{
                            content: '';
                            border: 2px solid $--color-white;
                            border-left: 0;
                            border-top: 0;
                            height: $check-size/2;
                            left: 3px;
                            position: absolute;
                            transition: all .15s ease-in;
                            top: 0px;
                            width: $check-size - 10px;
                            transform-origin: center;
                            transform: rotate(45deg) scaleY(0);
                            z-index: 1;
                        }
                        &.is-checked{
                            border-color: $--color-primary;
                            background-color: $--color-primary;
                            &::after{
                                transform: rotate(45deg) scaleY(1);
                            }
                        }
                    }
                    input{
                        vertical-align: middle;
                        position: absolute;
                        top: -30px;
                    }
                    span{
                        vertical-align: middle;
                    }
                    .el-page-login-checkbox-label{
                        padding-left: 6px;
                    }
                }
            }
            button{
                width: 100%;
                height: $login-line-height - 4px;
                outline: 0;
                margin: 0;
                padding: 0;
                cursor: pointer;
                background-color: $--color-primary;
                color: $--color-white;
                border: none;
                border-radius: $--border-radius-base;
                &:hover,&:active,&:focus{
                    opacity: .8;
                }
            }
        }
    }
}
.el-page-login-box-others{
    padding: 20px;
    text-align: center;
    >li{
        display: inline-block;
        height: 30px;
        width: 30px;
        margin: 0 5px;
        cursor: pointer;
        &:hover{
            opacity: .8;
        }
        >img{
            height: 100%;
            width: 100%;
        }
    }
}
@media screen and (orientation : portrait){
    .el-page-login {
        .el-page-login-box{
            width: 70vw;
            .el-page-login-input{
                display: block;
                margin-left: 51px;
                width: auto;
                input{
                    width: 100%
                }
            }
        }
    }
}
</style>