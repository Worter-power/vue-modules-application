<template>
    <div class="sy-home-body sy-qn">
        <div class="sy-home-body-left" :class="{'is-expended': isRotate}">
            <el-nav :theme="$store.state.theme" :data="navList" :defaultActive="currentPage" @style-change="isRotate = !isRotate"></el-nav>
        </div>
        <div class="sy-home-body-right sy-qn" :class="{'is-expended': !isRotate}">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { getCodeMenuList } from '../request.js';
export default {
    data() {
        return {
            isRotate: false,
            navList: [],
            currentPage: ''
        }
    },
    created(){
        this.init();
        let _this = this;
		this.$on('currentPage', function(msg) {
			_this.currentPage = msg;
		});
		this.$on('change-user-name', function(name) {
			_this.userName = name;
		})
    },
    methods: {
        init(){
            getCodeMenuList('category_qn_manager').then((data) => {
				this.navListData(data)
			}).catch(err=>{});
        },
        navListData(data){
			data.forEach((_a,a)=>{
				if(_a.resourceType == 2){
					_a.name = this.$store.state.lang.qn[_a.code] || _a.name;
					_a.children.forEach((_d,d)=>{
						if(_d.resourceType == 2){
							_d.name = this.$store.state.lang.qn[_d.code] || _d.name;
						}
					})
				}
			})
            this.navList = data;
		},
    }
}
</script>