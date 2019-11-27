const defaults = {
    title: 'login',
    message: '',
    type: '',
    langType: 'zh-CN',
    showOthers: false,
    showClose: false,
    beforeClose: null,
    modelIndex: 2500,
    focus: false,
    remenberPassWord: false,
    otherList: [],
    action: '',
    visiblebox: true,
    errormsg1: '',
    errormsg2: '',
    confirmButtonLoading: false,
    loginForm: {
        username: '',
        password: '',
        noIntercept: true
    },
    logintext: {
        'zh-CN': {
            l1: "用户登陆",
            l2: "请输入账号",
            l3: "请输入密码",
            l4: "记住密码",
            l5: "忘记密码？",
            l6: "登录",
            l7: "用户名不能为空！",
            l8: "密码不能为空！"
        },
        'en': {
            l1: "User login",
            l2: "Please enter account number",
            l3: "Please input a password",
            l4: "Remember password",
            l5: "Forget the password?",
            l6: "Sign in",
            l7: "User name cannot be empty!",
            l8: "Password cannot be empty!"
        }
    },
    clickWeixin: false,
    api: '/api/uaa/oauth/login',
    socialApi: '/api/uaa/social/info',
    baseApi: '',
};

import Vue from 'vue';
import loginboxVue from './main.vue';
import merge from '@/utils/merge';

const LoginBoxConstructor = Vue.extend(loginboxVue);
let instance;

const defaultCallback = action => {
    
};
const initInstance = (options, callback) => {
    console.log(options)
    instance = new LoginBoxConstructor({
        el: document.createElement('div'),
        data() {
            return options;
        }
    });
    console.log(instance)
    instance.callback = callback || defaultCallback;
    document.body.appendChild(instance.$el);

};

const LoginBox = function (options, callback) {
    if (Vue.prototype.$isServer) return;
    if(document.getElementById('el-page-login')){
        return
    }
    if ((typeof options) == "object" && options.callback && !callback) {
        callback = options.callback;
    } else if ((typeof options) == "object" && !options.callback && !callback) {
        callback = defaultCallback;
    }
    options = merge({}, defaults, options);
    let _lang = window.localStorage.getItem("lange_");
    if(_lang && _lang != 'null' && _lang != 'undfined'){
        options.langType = _lang;
    }
    initInstance(options, callback)
};

export default LoginBox