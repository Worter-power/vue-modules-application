<template>
    <div class="sy-app-container">
        <div class="sy-home-body-left" :class="{'is-expended': isRotate}">
            <el-nav :theme="$store.state.theme" :data="navList" :defaultActive="currentPage" @style-change="isRotate = !isRotate"></el-nav>
        </div>
        <div class="sy-home-body-right" :class="{'is-expended': !isRotate}">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
    </div>
</template>


<script>
import "./scss/index.scss";
import lang from "./lang/index";
export default {
	data() {
		return {
            getUnitLogo: window.ShiYue.base + '/api/storage/show/unit/' + this.$store.state.unitId,
			versionList: [],
			isRotate: false,
			currentPage: '',
            userName: ''
		}
	},
    computed: {
        navList(){
            let arr = [];
            this.$store.state.permission.dyMenu.forEach((_a, a)=>{
                if(_a.resourceType == 2){
                    _a.name = this.$store.state.lang.base[_a.code] || _a.name;
                    _a.children.forEach((_d, d)=>{
                        if(_d.resourceType == 2){
                            _d.name = this.$store.state.lang.base[_d.code] || _d.name;
                        }
                    })
                }
                arr.push(_a)
            })
            return arr
        }
    },
	created() {
        this.$store.commit("CHANGE_LANG", lang);
        // BUS.$on('title-click', (title)=>{
        //     this.$notify({
        //         title: '信息',
        //         message: '标题点击事件触发',
        //         type: "info"
        //     });
        // })
        /**
         * params : {
         *      icons: function,
         *      center: function,
         *      title: string,
         *      logo: url,
         *      userName: string,
         *      showUserName: Boolean,
         *      lang: string, // default 'zh-CN'
         *      langList: Array,
         *      showMainMenu: false,
         *      versions: []
         * }
         */
		// BUS.$emit('set-header-options', {
        //     showMainMenu: true,
        //     title: title,
        //     versions: versionList
        // })
        
        this.init();
	},
	methods: {
		init(){
            this.$on('currentPage', (msg)=> {
                this.currentPage = msg;
            });
		}
	}
}
</script>