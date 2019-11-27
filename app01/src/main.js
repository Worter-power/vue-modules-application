/**
 * harry 2019-08-25
 */
import App from './App';
import router from './router';
import store from "@/vuex/index.js"; // vuex
// 引入自定义指令
import directive from'./utils/directive.js';
directive(Vue);

if (isDev) {
    Vue.config.errorHandler = function (err, vm, info) {
        console.error(err)
    }
}

// 1. 不需要登陆
// 1.1 无页头页脚 业务逻辑 挂在跟标签
/**
 *  new Vue({
        el: '#app',
        router,
        store,
        render: (c) => {return c(App)}
    });
    */

// 2. 需要登陆 
// 2.1 如果有页头页脚 则直接掉如下方法
InitProject().then(res=>{
    // console.log('初始化完成：',res)
    // 登陆
    if(res.isLogined){
        // 标识符 GET_PRE_PATH
        store.commit("GET_PRE_PATH");
        // 滚动条宽度 GET_SCROLL_BAR_WIDTH
        store.commit("GET_SCROLL_BAR_WIDTH");
        // 同步用户信息 GET_USER_MSG
        store.commit("GET_USER_MSG");
        // 更新vuex中的语言信息 CHANGE_LANG_TYPE
        store.commit("CHANGE_LANG_TYPE", res.lang);
        // 更新vuex中的主题 CHANGE_THEME
        store.commit("CHANGE_THEME", res.color);
        
        new Vue({
            el: '#app-container',
            router,
            store,
            render: (c) => {return c(App)}
        });
    }
})
// 2.2 如果没有页头页脚 调用 isLogined
/** 该全局方法会判断用户是否登陆，并跳转登陆页面
 * isLogined().then(res=>{
 *  
 * })
 */

