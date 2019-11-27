/**
 * harry 2019-11-25
 */
import App from './App';
import router from './router';
import store from "@/vuex/index.js"; // vuex

try {
    window.addEventListener('popstate', function (e) {
        router.isBack = true
    },false)
} catch (error) {
    
}

// 标识符 GET_PRE_PATH
store.commit("GET_PRE_PATH");
// 滚动条宽度 GET_SCROLL_BAR_WIDTH
store.commit("GET_SCROLL_BAR_WIDTH");
// 同步用户信息 GET_USER_MSG
store.commit("GET_USER_MSG");
// 更新vuex中的语言信息 CHANGE_LANG_TYPE
store.commit("CHANGE_LANG_TYPE");
// 更新vuex中的主题 CHANGE_THEME
store.commit("CHANGE_THEME");
// 获取浏览器信息
store.commit("CHECK_IS_MOBILE");
store.commit("GET_BROSER_ABOUT");
new Vue({
    el: '#app',
    router,
    store,
    render: (c) => {return c(App)}
});