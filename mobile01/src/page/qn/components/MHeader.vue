<template>
	<div class="mobile-header">
		<div class="left" @click="goBack()">
			<i v-show="showBack" class="iconfont icon-back"></i>
		</div>
		<div class="title">{{title}}</div>
		<div class="right" @click="more()" v-if="showMoreBtn">
			<i v-show="showMore" class="iconfont icon-more"></i>
		</div>
		<van-action-sheet v-model="showDownItem" :actions="actions" cancel-text="取消" :round="false" @select="handlerSelect"/>
	</div>
</template>

<script>
export default {
    name: "mheader",
    props: {
		title: {
			type: String,
			required: true
		},
		showBack: {
			type: Boolean,
			default: true
		},
		showMore: {
			type: Boolean,
			default: false
		},
		actions: {
			type: Array,
			default: ()=>{
				return []
			}
		}
	},
	data(){
		return {
			showDownItem: false,
			showMoreBtn: true
		}
	},
	created(){
		this.showMoreBtn = this.$route.path.indexOf('about') === -1;
	},
    watch: {
        $route(to,from){
			this.showMoreBtn = to.path.indexOf('about') === -1;
        }
    },
    methods: {
		goBack() {
			if (this.showBack) {
				let path = this.$route.path;
				// 路由判断
				if (path === '/qn/list') {
					console.log("NativeJsUtils.closeWebView()");
					//调用原生方法关闭WebView
					NativeJsUtils.closeWebView();
				} else {
					console.log("path: " + path);
					this.$router.go(-1)
				}
			}
		},
		more(){
			if(this.actions.length){
				this.showDownItem = true;
			}else{
				this.$emit('more', true)
			}
		},
		handlerSelect(item){
			console.log(item)
			if(item.router){
				if(item.path){
					this.$router.push({path: item.path, query: item.query || {}})
				}
			}
			this.showDownItem = false;
		}
    }
}
</script>
