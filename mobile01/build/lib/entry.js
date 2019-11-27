module.exports = `
import Index from '{{path}}';
import store from "@/vuex/index.js";
const router = new VueRouter({
    mode: 'history',
    history: true,
    hashbang: false, //将路径格式化为#!开头
    transitionOnLoad: true, //初次加载是否启用场景切换
    saveScrollPosition: false, //在启用html5 history模式的时候生效，用于后退操作的时候记住之前的滚动条位置
});
isLogined().then(()=>{
    THEME().then(res => {
        // 标识符 GET_PRE_PATH
        store.commit("GET_PRE_PATH");
        // 滚动条宽度 GET_SCROLL_BAR_WIDTH
        store.commit("GET_SCROLL_BAR_WIDTH");
        // 同步用户信息 GET_USER_MSG
        store.commit("GET_USER_MSG");
        // 更新vuex中的语言信息 CHANGE_LANG
        store.commit("CHANGE_LANG", 'zh-CN');
        // 更新vuex中的主题 CHANGE_THEME
        store.commit("CHANGE_THEME", res);
        // 初始化 element 语言
        // if (res.lang == 'en' && ELEMENT) {
        //     ELEMENT.locale(ELEMENT.lang.en)
        // }
        new Vue({
            el: '#{{id}}',
            router,
            store,
            render: (c) => {return c(Index)}
        });
    })
})
`