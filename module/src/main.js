import checkVersion from '@/utils/check-version';
// import win from '@/utils/winnotice';
// win();
/**
 * 检测登陆情况
 */
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import router from './router';
import storeOptions from "./vuex/store.js"; // vuex


import commonUi from '@/tools/index';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(commonUi);


if (checkVersion) {
    const store = new Vuex.Store(storeOptions);
    window.Vue = Vue
    window.Vuex = Vuex;
    window.VueRouter = VueRouter;
    window.addEventListener('popstate', function (e) {
        router.isBack = true
    }, false)
    isLogined().then(res => {
        if (res) {
            THEME().then(res => {
                new Vue({
                    el: '#app',
                    store,
                    router,
                    render: (c) => { return c(App) }
                });
            })
        } else {
            THEME().then(res => {
                new Vue({
                    el: '#app',
                    store,
                    router,
                    render: (c) => { return c(App) }
                });
            })
        }
    })
}
