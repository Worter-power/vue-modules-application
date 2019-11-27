<template>
    <div id="app" :class="[currentColor]">
        <div class="sy-app-container">
            <div class="sy-home-header">
                <page-header showMenu title="测试模块" showName></page-header>
            </div>
            <div class="sy-home-body">
                <div class="sy-home-body-left">
                    <ul class="el-demo-nav">
                        <li v-for="item in menuList" :key="item.id" :class="{selected: selectedId === item.id}" @click="selectedId = item.id">
                            <router-link :to="item.path">{{item.name}}</router-link>
                        </li>
                    </ul>
                </div>
                <div class="sy-home-body-right is-expended" style="overflow: hidden;">
                    <transition :name="transitionName">
                        <keep-alive :include="keepAlive">
                            <router-view class="Router" ></router-view>
                        </keep-alive>
                    </transition>
                </div>
            </div>
            <div class="sy-home-footer">
                <page-footer></page-footer>
            </div>
        </div>
    </div>  
</template>

<script>
import PageHeader from './components/page-header/main';
import PageFooter from './components/page-footer/main';
import { setTimeout } from 'timers';
import versions from './version';
export default {
    name: "app",
    components: {
        PageHeader,
        PageFooter
    },
    watch: {
      $route(to, from) {
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
    data() {
        return {
            currentColor: window.localStorage.getItem('themeColor') || '#457cd6',
            transitionName: '',
            keepAlive: 'home',
            title: 'Hello World!',
            selectedId: 'id',
            menuList: [
                {id: 'index', name: 'Index', path: '/ph/index'},
                {id: 'home', name: '主页', path: '/ph/home'},
                {id: 'my', name: '我的', path: '/ph/my'},
                {id: 'viewport', name: 'viewport', path: '/ph/viewport?app=base&fileId=desktop-setting-msg'}
            ]
        }
    },
    created(){
        BUS.$on('title-click', (title)=>{
            this.$notify({
                title: '信息',
                message: '标题点击事件触发',
                type: "info"
            });
        })
    },
    methods: {
        renderContent(){
            return (<span ><i class="fa fa-home"></i>  </span>)
        }
    },
    mounted(){
        BUS.$emit('set-header-options', {
            icons: this.renderContent, 
            // center: () => {return ( <span>123456</span> )},
            title: '测试模块',
            showMainMenu: true,
            // userName: 'Harry',
            // logo: '/common/images/shiyuelogo.png',
            // langList: [{value: 'zh-CN', name: '中文'},{value: 'en', name: 'English'}],
            versions: versions
        })
        // setTimeout(()=>{
        //     BUS.$emit('set-header-options', this.renderContent)
        // }, 5000)
        // this.$request('get', '/api/uaa/oauth/me')
    }
}
</script>
<style lang="scss">
#app {
    .Router {
        position: absolute;
        height: 100%;
        transition: all .377s ease;
        will-change: transform;
        top: 0;
        backface-visibility: hidden;
        perspective: 1000;
        left: 0;
        right: 0;
    }
    .slide-left-enter,
    .slide-right-leave-active {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }

    .slide-left-leave-active,
    .slide-right-enter {
        opacity: 0;
        transform: translate3d(100%, 0,0);
    }
}
.el-demo-nav{
    >li{
        line-height: 38px;
        border-bottom: 1px solid $--border-color-base;
        cursor: pointer;
        a{
            font-size: 15px;
            text-decoration: none;
            color: $--color-text-primary;
            display: block;
            width: 100%;
            padding: 0 10px;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:hover,
            &:active{
                color: $--color-white;
            }
        }
        &:hover,
        &.selected{
            background-color: $--color-primary;
            a{
                color: $--color-white;
            }
        }
    }
}
</style>