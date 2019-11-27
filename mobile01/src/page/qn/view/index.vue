<template>
	<div id="app" :class="[$store.state.theme]">
        <div class="sy-home-header">
            <div id="page-header"></div>
        </div>
        <router-view></router-view>
        <div class="sy-home-footer">
            <div id="page-footer"></div>
        </div>
        <!--模块到期提示-->
        <el-dialog :title="license[$store.state.langType].dialogTitle" :visible.sync="dialogVisible" size="tiny" :close-on-click-modal="false" width="400px" :close-on-press-escape="false" :show-close="false" :before-close="handleClose">
            <div class="sy-about-top sy-lf">
                <img class="sy-about-logo" src="/common/images/aboutLogo.png">
            </div>
            <div class="sy-about-cont">
                <div style="line-height:28px;">
                    {{license[$store.state.langType].info}}
                </div>
            </div>
            <div class="sy-about-foot">
                <div>{{license[$store.state.langType].copyright}}</div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { saveUserAccessDetail, getUnitLicense } from "@/service";
import version from 'root/version.json';
export default {
	data() {
		return {
            dialogVisible: false,
            license: {
                'zh-CN': {
                    dialogTitle: '提示',//
                    info: '该模块已到期，请联系管理员！',// 
                    copyright: '版权所有2017 Shiyue Inc. 保留所有权利。',//
                },
                'en': {
                    dialogTitle: 'Tips',//提示
                    info: 'The module has expired, please contact the administrator!',// 该模块已到期，请联系管理员！
                    copyright: 'Copyright 2017 Shiyue Inc. All rights reserved.',//版权所有2017 Shiyue Inc. 保留所有权利。
                }
            },
            isPre: ''
		}
	},
	created() {
        BUS.$on('title-click', (title)=>{
            this.$router.push('/qn/home/pre')
        })
    },
    
    watch: {
        $route(val,oldval){
            this.init();
        }
    },
	methods: {
		init(){
            let isPre = this.$route.path.indexOf('/qn/home') !== -1;
            if(this.isPre !== isPre){
                this.isPre = isPre;
                // 查询 初始化语言
                this.$store.dispatch("getLanguages", {code: this.$store.state.prePath, unitId: this.$store.state.unitId});
                let title =  version[this.$store.state.langType][0].model;
                document.title = title;
                BUS.$emit('set-header-options', {
                    showUserName: true,
                    title: title,
                    versions: version[this.$store.state.langType],
                    icons: ()=>{
                        if(isPre){
                            return ( 
                                <span on-click={() => this.$router.push('/qn/manager')}>
                                    <i class="fa fa-bars" style="font-size: 16px;"></i>
                                </span>
                            )
                        }else{
                            return ( 
                                <span on-click={() => this.$router.push('/qn/home')}>
                                    <i class="fa fa-home" style="font-size: 16px;"></i>
                                </span>
                            )
                        }
                    }
                });
                this.connons();
            }
        },
        connons(){
            if (process.env.NODE_ENV == 'production') {
                // 使用统计次数
                saveUserAccessDetail({
                    userId: this.$store.state.userId,
                    userType: this.$store.state.userType,
                    unitId: this.$store.state.unitId,
                    resId: version['zh-CN'][0].code,
                    resName: version['zh-CN'][0].model,
                    type: 1
                }).then(res=>{}).catch(err=>{});
                // 查询到期时间
                let path = this.$route.path && this.$route.path != '/' ? this.$route.path.match(/\/(\S*)\//)[1] : version['zh-CN'][0].code
                getUnitLicense(path, this.$store.state.unitId).then(res => {
                    this.dialogVisible = !res;
                }).catch(err => {
                    this.dialogVisible = false;
                });
            }
		}
    },
    mounted(){
        // 初始化页头页脚
        InitProject().then(res=>{
            // 登陆
            if(res.isLogined){
                // 标识符 GET_PRE_PATH
                this.$store.commit("GET_PRE_PATH");
                // 滚动条宽度 GET_SCROLL_BAR_WIDTH
                this.$store.commit("GET_SCROLL_BAR_WIDTH");
                // 同步用户信息 GET_USER_MSG
                this.$store.commit("GET_USER_MSG");
                // 更新vuex中的语言信息 CHANGE_LANG_TYPE
                this.$store.commit("CHANGE_LANG_TYPE", res.lang);
                // 更新vuex中的主题 CHANGE_THEME
                this.$store.commit("CHANGE_THEME", res.color);
                this.init();
            }
        })
    }
}
</script>

<style>
    .sy-qn .el-tree {
        background: transparent;
    }
</style>