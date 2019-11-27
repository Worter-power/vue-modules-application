import checkVersion from '@/utils/check-version';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import commonUi from '@/tools/index';
import PageHeader from '@/components/page-header/main.vue';
import PageFooter from '@/components/page-footer/main.vue';

if (checkVersion) {
    Vue.use(commonUi);
    Vue.use(VueRouter);
    Vue.use(Vuex);
    window.Vue = Vue
    window.Vuex = Vuex;
    window.VueRouter = VueRouter;
    window.InitProject = (login) => {
        return new Promise((resove, reject) => {
            let _lang = window.localStorage.getItem("lange_");
            let lang = _lang;
            if(['zh-CN', 'en'].indexOf(lang) === -1){
                lang = 'zh-CN';
            }
            window.localStorage.setItem("lange_", lang);
            if (document.getElementById('page-header')) {
                isLogined().then(res => {
                    if (res) {
                        THEME(true).then(data => {
                            new Vue({
                                el: '#page-header',
                                render: (c) => { return c(PageHeader) }
                            });
                            if (document.getElementById('page-footer')) {
                                new Vue({
                                    el: '#page-footer',
                                    render: (c) => { return c(PageFooter) }
                                });
                            } else {
                                console.log('提示', '如果要渲染公共页脚组件，页脚需要提供一个id为page-footer的空元素，用来渲染页头！')
                            }
                            resove({ color: data, isLogined: true, lang })
                        })
                    } else {
                        LoginBox.show().then(_r => {
                            THEME(true).then(data => {
                                new Vue({
                                    el: '#page-header',
                                    render: (c) => { return c(PageHeader) }
                                });
                                if (document.getElementById('page-footer')) {
                                    new Vue({
                                        el: '#page-footer',
                                        render: (c) => { return c(PageFooter) }
                                    });
                                } else {
                                    console.log('提示', '如果要渲染公共页脚组件，页脚需要提供一个id为page-footer的空元素，用来渲染页头！')
                                }
                                resove({ color: data, isLogined: true, lang })
                            })
                        });
                    }
                })
            } else {
                if (document.getElementById('page-footer')) {
                    new Vue({
                        el: '#page-footer',
                        render: (c) => { return c(PageFooter) }
                    });
                } else {
                    console.log('提示', '如果要渲染公共页脚组件，页脚需要提供一个id为page-footer的空元素，用来渲染页头！')
                }
                console.log('提示', '如果要渲染公共页头组件，页头需要提供一个id为page-header的空元素，用来渲染页头！')
                resove({ color: '#457CD6', isLogined: false, lang })
            }
        })
    }
}