<template>
    <div id="app" :class="[$store.state.theme]" class="mobile">
        <!-- 页头 -->
        <m-header :title="currentData" show-back show-more :actions="actions"></m-header>
        <!-- 中间 -->
        <transition :name="transitionName">
            <router-view></router-view>
        </transition>
        <!-- 页脚 -->
        <!-- <div class="mobile-footer"></div> -->
    </div>
</template>

<script>
import MHeader from '../components/MHeader';
import '../scss/mobile/common.scss';
import '../scss/mobile/qn.scss';
import inits from '../js/mobile-init.js';
export default {
    name: "home",
    components: {
        "m-header": MHeader
    },
    data() {
        return {
            keepAlive: '',
            transitionName: 'slide-right', //初始过渡动画方向
            currentData: "问卷调查", // '问卷调查'
            names: {
                '/qn-mobile/list': "问卷列表",
                '/qn-mobile/desc': "问卷说明",
                '/qn-mobile/main': "问卷详情",
                '/qn-mobile/details': "问卷结果",
                '/qn-mobile/about': "关于"
            },
            actions: [
                {name: '关于', router: true, path: '/qn-mobile/about'}
            ]
        }
    },
    watch: {
        $route(to,from){
            this.currentData = this.names[to.path] || "问卷调查";
            // 切换动画
            let isBack = this.$router.isBack // 监听路由变化时的状态为前进还是后退
            if (isBack) {
                this.transitionName = 'slide-left'
            } else {
                this.transitionName = 'slide-right'
            }
            this.$router.isBack = false
        }
    },
    created(){
        // 初始化
        inits(this);
    },
    mounted(){
        this.currentData = this.names[this.$route.path] || "问卷调查";
    }
};
</script>