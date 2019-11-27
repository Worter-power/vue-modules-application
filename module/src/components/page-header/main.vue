<template>
    <div class="el-page-header sy-theme-background" :style="{width: fixedWidth}" :class="[theme]">
        <div class="el-page-header-left" @click="handleTitleClick">
            <img :src="photoImageUrl"/>
            <p> 
                <span v-if="!$slots.title">{{titleName}}</span> 
                <span v-if="$slots.title">
                    <slot name="title"></slot>
                </span>
            </p>
        </div>
        <div v-if="showMainMenu" class="el-page-header-center" id="header-menus">
            <ph-menu></ph-menu>
        </div>
        <div v-else class="el-page-header-center" id="header-menus">
            <center-content v-if="isgetCenterContainer" :renderContentCenter="renderContentCenter"></center-content>
            <slot name="body"></slot>
        </div>
        <div class="el-page-header-right" v-if="!iconsHidden">
            <div class="el-page-header-right-row">
                <span v-if="showUserName" style="cursor: default;">{{ `${langs[langType].welcome}，${userName}`}}</span>
                <span v-if="msgList.length" class="el-page-header-msg" :title="langs[langType].msg" @click="showMsg = !showMsg">
                    <b>{{msgList.length}}</b>
                    <i class="fa fa-bell"></i>
                </span>
                <span v-if="showUserName" :title="langs[langType].desktop" @click="handleIconClick('desktop')">
                    <i class="fa fa-university"></i>
                </span>
                <span v-if="userType === '3' && parentChildList.length > 1" @click="showStudentList = true;positionInfo=[0,'0', 'auto', 'auto']">
                    <i class="fa fa-id-card-o"></i>
                </span>
                <template v-if="$slots.back">
                    <slot name="back"></slot>
                </template>
                <icon-content v-if="resetIcon" :renderContent="renderContent"></icon-content>
                <span :title="langs[langType].skin" v-if="showTheme && showBtns.showTheme" @click="handleIconClick('theme')">
                    <i class="fa fa-television"></i>
                </span>
                <span v-if="versionLists.length" :title="langs[langType].about" @click="handleIconClick('about')">
                    <i class="fa fa-exclamation-circle"></i>
                </span>
                <span :title="langs[langType].logout" @click="handleIconClick('logout')">
                    <i class="fa fa-power-off"></i>
                </span>
                <span :title="isfullscreen ? langs[langType].exit : langs[langType].enter" @click="handleIconClick('full')">
                    <i style="font-size: 22px;" :class="'mdi mdi-fullscreen' + (isfullscreen ? '-exit' : '')"></i>
                </span>
            </div>
            <div class="el-page-header-right-row"  v-if="langLists.length > 1 && showBtns.showLang">
                <div class="el-header-lang">
                    <span @click="showLang = !showLang">
                        <span>{{langNames[langType]}} </span>
                        <i class="fa fa-sort-desc"></i>
                    </span>
                    <transition name="slide-down">
                        <ul v-if="showLang" @mouseleave="showLang = false">
                            <li class="sanjiao_up"></li>
                            <li v-for="item in langLists" :key="item.value"  :class="{select: item.value === langType}" @click="handleChangeLang(item)">{{item.name}}</li>
                        </ul>
                    </transition>
                </div>
            </div>
        </div>
        <div v-else class="el-page-header-right" >
            <template v-if="$slots.back">
                <slot name="back"></slot>
            </template>
            <icon-content v-if="resetIcon" :renderContent="renderContent"></icon-content>
        </div>
        <!-- 版本信息 -->
        <ph-dialog :title="langs[langType].about" :visible.sync="aboutDialog" width="650px" append-to-body>
            <div class="el-about-container" style="padding: 15px;">
                <div class="el-about-top" v-if="!isOAM">
                    <img src="/common/images/aboutLogo.png">
                    <span>{{langs[langType].name}}</span>
                </div>
                <div class="el-about-versionlist">
                    <div v-for="item in versionLists" :key="item.version">
                        <p>
                            <span>{{item.model}}（ <i>{{item.version}}</i> ）</span>
                            <b v-if="item.date">{{item.date}}</b>
                        </p>
                        <div v-if="item.fileList.length" class="el-about-versionlist-ctr">
                            <p>{{langs[langType].czwd}}：</p>
                            <ul>
                                <li v-for="(o , index) in item.fileList" :key="'metto_'+index">
                                    <div>
                                        <i class="fa fa-eye sy-theme-text" @click="handlerSees(o)"></i> &nbsp;&nbsp;&nbsp;
                                        <i class="fa fa-download sy-theme-text" @click="handleDownLoad(o)"></i> 
                                    </div>
                                    <p>{{o.fileName}}</p>
                                </li>
                            </ul>
                        </div>
                        <div v-if="item.metto.length">
                            <p v-if="item.fileList.length">{{langs[langType].desc}}：</p>
                            <ul>
                                <li v-for="(o , index) in item.metto" :key="'metto_'+index">{{o}}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="no-version" v-if="versionLists.length == 0">
                        {{langs[langType].noversion}}
                    </div>
                </div>
                <div class="el-about-foot" v-if="!isOAM">
                    <a href="http://www.shiyuesoft.com" target="_blank">{{langs[langType].name}}</a>
                    <span>{{langs[langType].copyright}}</span>
                </div>
            </div>
        </ph-dialog>
        <!-- 注销 -->
        <ph-dialog :title="langs[langType].info" :visible.sync="logoutDialog" width="400px" :bgcolor="false" append-to-body>
            <p style="padding: 20px;">
                <i class="el-icon-info" style="font-size: 28px; color: #E6A23C;vertical-align: middle;"></i>
                <span style="padding-left: 10px;">{{langs[langType].infomsg}}</span>
            </p>
            <div slot="footer">
                <button :class="[currentColor]" @click="logoutDialog = false" class="el-button el-button--mini el-button--default sy-theme-button-default">{{langs[langType].cancel}}</button>
                <button :class="[currentColor]" @click="handleLogoutSubmit" class="el-button el-button--mini el-button--default el-button--primary sy-theme-button-primary">{{langs[langType].ok}}</button>
            </div>
        </ph-dialog>
        <!-- 换主题 -->
        <ph-dialog :title="langs[langType].theme" :visible.sync="themeModelDialog" width="360px" append-to-body>
            <div style="padding: 20px;">
                <div class="sy-sy-theme-row" v-for="item in themesList" :key="item.id">
                    <p class="sy-theme-text">{{langs[langType][item.id]}}</p>
                    <ul class="sy-parmary-color sy-parmary-color-themes sy-jd-theme">
                        <li v-for="c in item.list" :key="c.color" @click="handlechangeThemeColor(c.color, item.id)" :style="{width: item.id != 'themeColor' ? '100px' : '40px'}">
                            <i class="el-page-header-themes_checked" :style="{
                                background: c.color, 
                                width: item.id != 'themeColor' ? '100px' : '40px', 
                                height: item.id != 'themeColor' ? '64px' : '40px'
                            }" :class="[c.color]">
                                <b v-if="currentColor === c.color" class="el-icon-check"></b>
                            </i>
                            <p class="center">{{langs[langType][c.id]}}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </ph-dialog>
        <!-- 换主题提示 -->
        <ph-dialog :title="langs[langType].info" :visible.sync="infoDialog" width="400px" append-to-body>
            <p style="text-align:center;padding: 20px;">
                <i class="el-icon-info" style="font-size: 28px; color: #E6A23C;vertical-align: middle;"></i>
                <span style="padding-left: 10px;">{{infoText}}</span>
            </p>
            <div slot="footer">
                <button :class="[currentColor]" @click="infoDialog = false" class="el-button el-button--mini el-button--default sy-theme-button-default">{{langs[langType].cancel}}</button>
                <button :class="[currentColor]" v-if="isAdmin" @click="_change_themes('default_color',currentChangeColor)" class="el-button el-button--mini el-button--default sy-theme-button-default">{{langs[langType].cancel1}}</button>
                <button :class="[currentColor]" @click="_change_themes('color',currentChangeColor)" class="el-button el-button--mini el-button--default sy-theme-button-default">{{langs[langType].ok1}}</button>
            </div>
        </ph-dialog>
        <!-- 消息 -->
        <ph-dialog :title="langs[langType].msg" :visible.sync="showMsg" width="400px" slide="top" closeOnClickModal
            :position="[0,'170px', 'auto', 'auto']" :dragged="false" append-to-body>
            <ul class="el-page-header-msg-content">
                <li v-for="row in msgList" :key="row.value" @click.stop="handleCommandMsg(item)">
                    <p :title="row.messageMeno">{{row.messageMeno || langs[langType].nodata}}</p>
                    <div>
                        <span>{{langs[langType].res}}{{row.module}}</span>&nbsp;
                        <span>{{row.messageDate}}</span>
                    </div>
                </li>
            </ul>
        </ph-dialog>
        <!-- 学生列表 -->
        <ph-dialog :title="langs[langType].stu" :visible.sync="showStudentList" width="500px" slide="right" closeOnClickModal
            :position="positionInfo" :dragged="false" append-to-body>
            <table class="sy-base-table-border hover">
                <thead>
                    <tr>
                        <td>{{langs[langType].xm}}</td>
                        <td>{{langs[langType].nj}}</td>
                        <td>{{langs[langType].bj}}</td>
                        <td>{{langs[langType].cz}}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in parentChildList" :key="item.id">
                        <td>{{item.realName}}</td>
                        <td>{{item.gradeName}}</td>
                        <td>{{item.className}}</td>
                        <td>
                            <i v-if="currentChildId === item.id" style="color: #13ce66" class="fa fa-check"></i>
                            <button v-else @click="handleEnterChildMsg(item)" class="el-button el-button--mini el-button--default sy-theme-button-default">{{langs[langType].jr}}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </ph-dialog>
        <!-- 文档预览 -->
        <!-- <ph-dialog :title="langs[langType].stu" :visible.sync="showStudentList" width="500px" append-to-body>
            <div>

            </div>
        </ph-dialog> -->
    </div>
</template>
<script>
import { setTimeout } from 'timers';
import fullScreen from '@/utils/full-screen';
import PhDialog from '@/components/dialog/main.vue';
import PhMenu from './menu.vue';
export default {
    name: 'ElPageHeader',
    components: {
        PhDialog,
        PhMenu,
        IconContent: {
            name: 'icon',
            render(h){
                const parent = this.$parent;
                return (
                    parent.renderContent ? parent.renderContent.call(parent._renderProxy, h, {data: '123'})
                    : ''
                );
            }
        },
        CenterContent: {
            render(h){
                const parent = this.$parent;
                return (
                    parent.renderContentCenter ? parent.renderContentCenter.call(parent._renderProxy, h, {data: '123'})
                    : ''
                );
            }
        }
    },
    props: {
        iconsHidden: { // 是否隐藏右侧所有按钮
            type: Boolean,
            default: false
        },
        logoutUrl: {
            type: String,
            default: '/api/uaa/oauth/logout'
        },
        fixedWidth: {
            type: String,
            default: '100%'  // 头部固定宽度
        },
        versionList: {
            type: Array,
            default: () => {
                return []
            }
        },
        showMenu: {
            type: Boolean,
            default: false 
        },
        title: {
            type: String,
            default: ''
        },
        showName: {
            type: Boolean,
            default: false 
        },
        lang: {
            type: String,
            default: 'zh-CN'
        },
        langList: {
            type: Array,
            default: () => {
                return []
            }
        },
        resetLogout: {
            type: Boolean,
            default: false
        },
        resetTheme: {
            type: Boolean,
            default: false
        },
        theme: {
            type: String,
            default: ''
        },
        showTheme: {
            type: Boolean,
            default: true
        }
    },
    data(){
        return {
            showStudentList: false,
            showMainMenu: this.showMenu,
            titleName: this.title,
            positionInfo:undefined,
            // 换主题的提示
            infoDialog: false,
            infoText: '',
            // 关于
            aboutDialog: false,
            isOAM: true,
            // 注销
            logoutDialog: false,
            // 换主题
            themeModelDialog: false,
            currentColor: this.theme || window.localStorage.getItem('themeColor') || '#457cd6',
            currentChangeColor: this.theme || window.localStorage.getItem('themeColor') || '#457cd6',

            showUserName: this.showName,
            userName: '',
            resetIcon: false,
            isfullscreen: false,
            isgetCenterContainer: false,
            showSelectLnag: false,
            photoImageUrl: '',
            langNames: {
                'zh-CN': 'Language',
                'en': '语言'
            },
            themesList: [
                {
                    title: '经典主题',
                    id: 'themejd',
                    list: [
                        { color: 'ink', id: 'ink' }, 
                        { color: 'lotus', id: 'lotus' }
                    ]

                },
                {
                    title: '学段主题',
                    id: 'themeStage',
                    list: [
                        { color: 'cartoon', id: 'cartoon' }
                    ]
                },
                {
                    title: '颜色主题',
                    id: 'themeColor',
                    list: [
                        { color: '#e31d1a', id: 'red' }, 
                        { color: '#457CD6', id: 'blue' }, 
                        { color: '#49C1D9', id: 'siro' }, 
                        { color: '#4DB021' , id: 'green' }
                    ]
                }
            ],
            langs: {
                'zh-CN': {
                    xm: "姓名",
                    nj: "年级",
                    bj: "班级",
                    cz: "操作",
                    msg: '消息',
                    red: '中国红',
                    blue: '东方蓝',
                    siro: '赛罗蓝',
                    green: '清新绿',
                    ok: '确定',
                    ok1: '确定保存',
                    cancel: '取消',
                    cancel1: "同步主题",
                    personal: '个人',
                    desktop: '桌面',
                    welcome: '欢迎您',
                    module: '用户模块布局管理',
                    about: '关于',
                    skin: '换肤',
                    logout: '注销',
                    enter: '进入全屏',
                    exit: '退出全屏',
                    pmodule: '产品模块',
                    name: '上海师悦信息科技有限公司',
                    version: '版本',
                    desc: '版本说明',
                    copyright: '版权所有2017 Shiyue Inc. 保留所有权利。',
                    theme: '主题设置',
                    themejd: '经典主题',
                    themeStage: "学段主题",
                    themeColor: '颜色主题',
                    syncText: "将选中的主题同步给所有用户",
                    ink: '水墨风格',
                    lotus: '丹青风格',
                    cartoon: "卡通风格",
                    systheme: '系统主题',
                    other: '其他',
                    info: '提示',
                    infomsg: '您确认要退出吗？',
                    back: '返回桌面',
                    theme1: '温馨提示：中国风主题使用1920*1080分辨率浏览最佳 ',
                    theme2: "温馨提示：请确认是否更换主题！",
                    theme3: "（同步主题会将该主题设置给所有用户）",
                    nodata: '暂无内容',
                    res: '来源：',
                    noversion: "暂无版本信息",
                    stu: "选择小孩",
                    jr: "进入",
                    czwd: "操作文档"
                },
                en: {
                    xm: "Name",
                    nj: "Grade",
                    bj: "Class",
                    cz: "Operation",
                    msg: 'Messages',
                    red: 'China Red',
                    blue: 'Oriental Blue',
                    siro: 'Siro Blue',
                    green: 'Fresh Green',
                    ok: 'Ok',
                    ok1: 'Save',
                    cancel: 'Cancel',
                    cancel1: "Sync theme",
                    personal: 'Personal', // 个人
                    welcome: 'Welcome', // 欢迎您
                    desktop: 'desktop', // 桌面
                    module: 'Module management', // 用户模块布局管理
                    skin: 'Skin change', // 换肤
                    about: 'About', // 关于
                    logout: 'Log out', // 注销
                    enter: 'Enter full screen', // 进入全屏
                    exit: 'Exit Full Screen', // 退出全屏
                    pmodule: 'Product module', // 产品模块
                    name: 'Shanghai Shiyue Information.', // 上海师悦信息科技有限公司
                    version: 'version', // 版本
                    desc: 'Release Notes', // 版本说明
                    copyright: 'Copyright 2017 Shiyue Inc. All rights reserved.', // 版权所有2017 Shiyue Inc. 保留所有权利。
                    theme: 'Theme settings', // 主题设置
                    themejd: 'Classic theme',
                    themeStage: "Period theme",
                    themeColor: 'Color theme', // 主题颜色
                    syncText: "Sync selected topics to all users",
                    ink: 'Ink style', // 水墨风格
                    lotus: 'Dan Qing style', // 荷花风格
                    cartoon: "Cartoon style",
                    systheme: 'System theme', // 系统主题
                    other: 'other colors', // 其他
                    info: 'Prompt', // 提示
                    infomsg: 'Are you sure you want to exit?', // 您确认要退出吗？
                    back: 'Back to the desktop', // 返回桌面
                    theme1: 'Tips: Chinese style theme is best viewed with 1920*1080 resolution ',
                    theme2: "Warm Tip: Please confirm whether to change the theme! ",
                    theme3: "(Synchronization theme sets the theme to all users)",
                    nodata: 'No content yet', // 暂无内容
                    res: 'Source:', // 来源：,
                    noversion: "No version information yet",
                    stu: "Select child",
                    jr: "Enter",
                    czwd: "Operation document"
                }
            },
            versionLists: this.versionList,
            langLists: this.langList,
            isAdmin: false,
            msgList: [],
            langType: this.lang,
            showMsg: false,
            showLang: false,
            userType: '',
            userId: '',
            parentChildList: [],
            currentChildId:'',
            jgTimes: 30 * 60 * 60 * 1000,
            showBtns: {
                showTheme: true,
                showLang: true
            }
        }
    },
    created(){
        this.initData();
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
        BUS.$on('set-header-options', (params = {})=>{
            if(params.showMainMenu === true){
                this.showMainMenu = params.showMainMenu
            }
            if(params.lang){
                this.langType = params.lang;
            }
            // 版本
            if(params.versions){
                if(params.versions){
                    let arr = params.versions.filter(o=>{ 
                        o.fileList = [];
                        return true
                     })
                    this.versionLists = arr;
                }
            }
            // 插入自定义icon
            if(params.icons && typeof params.icons === "function"){
                this.resetIcon = false;
                this.renderContent = params.icons;
                setTimeout(()=>{
                    this.resetIcon = true;
                }, 50)
            }
            if(params.icons === null){
                this.resetIcon = false;
            }
            // 插入自定义中间
            if(params.center && typeof params.center === "function"){
                this.isgetCenterContainer = false
                this.renderContentCenter = params.center;
                setTimeout(()=>{
                    this.isgetCenterContainer = true;
                }, 50)
            }
            // 设置标题
            if(params.title){
                if(typeof params.title === 'string'){
                    this.titleName = params.title;
                }else{
                    this.titleName = '只能是字符串';
                    this.$notify({
                        title: '信息',
                        message: '标题必选传入字符串',
                        type: "info"
                    });
                }
            }
            if(params.logo){
                this.photoImageUrl = params.logo;
            }
            if(params.userName){
                this.userName = params.userName;
            }
            if(params.showUserName === true){
                this.showUserName = true;
            }
            if(params.langList){
                if(Object.prototype.toString.call(params.langList) == '[object Array]'){
                    this.langLists = params.langList;
                    if(this.langLists.length === 1){
                        this.handleChangeLang(this.langLists[0])
                    }
                }else{
                    this.$notify({
                        title: '信息',
                        message: '数据类型错误，语言列表必须是数组！',
                        type: "info"
                    });
                }
            }
        })
    },
    methods: {
        initData(){
            // 按钮控制
            if(ShiYue && ShiYue.theme === false){
                window.localStorage.setItem("themeColor", '#457CD6');
                this.showBtns.showTheme = false;
            }
            if(ShiYue && ShiYue.showlang === false){
                this.showBtns.showLang = false;
                window.localStorage.setItem("lange_", 'zh-CN')
            }
            // 获取语言设置
            let _lang = window.localStorage.getItem("lange_");
            if(_lang && _lang != 'null' && _lang != 'undfined'){
                this.langType = _lang;
            }
            let oldTime = window.localStorage.getItem('_times_');
            
            console.log(process.env.TEST_MODE, 'development')
            try {
                let userMsg = JSON.parse(window.localStorage.getItem('user'));
                this.photoImageUrl = '/api/storage/show/unit/'+ userMsg.data.unitId;
                this.userName = userMsg.data.realName;
                this.userType = userMsg.data.userType+'';
                this.userId = userMsg.data.userId;
                let userId = window.localStorage.getItem('_userId_');
                // 默认获取日志标识符
                let prePath = location.pathname.split('/')[1] || 'base';
                // 查询语言配置
                if(process.env.TEST_MODE == 'development'){
                    this.langLists = [{ value: 'zh-CN', name: '中文' }, { value: 'en', name: 'English' }];
                }else{
                    if(prePath){
                        // do orthers
                    }
                }
                oldTime = oldTime ? parseInt(oldTime) : 0;
                if(userId !== this.userId){
                    window.localStorage.removeItem('_parent_'+this.userId);
                    window.localStorage.removeItem('_childid_'+this.userId);
                    window.localStorage.removeItem('_msglist_'+this.userId);
                    this.queryMsgList();
                    window.localStorage.setItem('_times_', new Date().getTime());
                    window.localStorage.setItem('_userId_', this.userId);
                }
            } catch (error) {
                this.userType = '1';
            }
            if(this.userType === '3'){
                let childstr = window.localStorage.getItem('_parent_'+this.userId);
                try {
                    this.parentChildList = childstr ? JSON.parse(childstr) : [];
                } catch (error) {
                    
                }
                if(this.parentChildList.length==0){
                    this.getChildList();
                }
                this.currentChildId = window.localStorage.getItem('_childid_'+this.userId);
            }
        },
        // 家长登陆查询小孩 /student/findAll/by/parent
        getChildList(){
            // do orthers
        },
        handleEnterChildMsg(item){
            if(this.currentChildId != item.id){
                this.currentChildId = item.id;
                window.localStorage.setItem('_childid_'+this.userId, this.currentChildId);
                // do orthers
            }
        },
        // 查询消息列表
        queryMsgList(){
            // do orthers
        },
        renderContent(){},
        renderContentCenter(){},
        // 标题点击事件
        handleTitleClick(){
            BUS.$emit('title-click', 'click');
            this.$emit('title-click', 'click');
        },
        // 图标点击事件
        handleIconClick(t){
            if(t == 'desktop'){
                location.href = '/desktop';
            }else if(t === 'about'){
                this.aboutDialog = true;
                let unitId = '';
                try {
                    unitId = JSON.parse(localStorage.getItem('user')).data.unitId; 
                    // do orthers
                } catch (error) {
                    this.isOAM = false;
                }
                if(!unitId){
                    this._jumpLoginBox();
                }else{
                    if(!this.versionLists.length){
                        return
                    }
                    // do orthers
                }
            }else if(t === 'logout'){
                this.logoutDialog = true;
            }else if(t === 'theme'){
                this.themeModelDialog = true;
                if(this.userId){
                    // do orthers
                }else{
                    this.isAdmin = false;
                }
            }else if(t == 'full'){
                if(this.isfullscreen){
                    this.isfullscreen = false;
                    fullScreen();
                }else{
                    this.isfullscreen = true;
                    fullScreen(document.body);
                }
            }
        },
        // 下载版本说明
        handleDownLoad(data){
            if (!data.fileId) {
                return
            }
            // do orthers
        },
        handlerSees(data){
            if (!data.fileId) {
                return
            }
            // do orthers
        },
        // 跳转登陆
        _jumpLoginBox(){
            if(process.env.isDev){// 开发环境
                this.$LoginBox({ showOthers: window.ShiYue.showOthers });
            }else {
                if(process.env.TEST_MODE == 'development'){
                    LoginBox({ showOthers: window.ShiYue.showOthers });
                }else{
                    location.href = "/login/";
                }
            }
        },
        // 注销
        handleLogoutSubmit(){
            // do orthers
        },
        // 语言切换
        handleChangeLang(data){
            if(['zh-CN', 'en'].indexOf(data.value) === -1){return}
            if(this.langType !== data.value){
                window.localStorage.setItem("lange_", data.value);
                setTimeout(()=>{
                    location.reload();
                }, 50)
            }
        },
        // 切换主题
        handlechangeThemeColor(color, t){
            if (this.currentColor && this.currentColor == color) {
                return
            }
            this.currentChangeColor = color;
            let fixedtext = this.isAdmin ? this.langs[this.langType].theme3 : '';
            this.infoText = t === 'themeColor' ? this.langs[this.langType].theme1+fixedtext : this.langs[this.langType].theme2+fixedtext;
            if(this.isAdmin){
                this.infoDialog = true;
            }else{
                this._change_themes('color',this.currentChangeColor);
            }
        },
        _change_themes(type, theme) {
            if(this.resetTheme){
                this.$emit('change-theme',theme);
            }else{
                // do orthers
            }
        },
        
        handleCommandMsg(command){
            if(this.resetLogout){
                this.$emit('log-out', true)
            }else{
                // do orthers
            }
        },
    }
}
</script>

<style lang="scss">
$header-height: 60px;
$logo-width: 40px;
$logo-height: 40px;
.el-page-header{
    height: $header-height;
    box-sizing: border-box;
    position: relative;
    background-color: $--color-primary;
    .el-page-header-left{
        position: absolute;
        left: 0;
        top: 0;
        height: $header-height;
        width: 250px;
        padding: 0 10px 0 20px;
        box-sizing: border-box;
        cursor: pointer;
        img{
            box-sizing: border-box;
            height: $logo-height;
            width: $logo-width;
            box-shadow: $--box-shadow-dark;
            border-radius: 50%;
            overflow: hidden;
            float: left;
            background-color: #fff;
            vertical-align: middle;
            margin-top: ($header-height - $logo-height)/2;
        }
        p{
            margin-left: $logo-width + 10px;
            line-height: $header-height;
            font-size: $--font-size-max-large;
            font-weight: 600;
            color: $--color-white;
            text-shadow: $--text-shadow-base;
            white-space: nowrap;
        }
    }
    .el-page-header-right{
        position: absolute;
        right: 0;
        top: 0;
        height: $header-height;
        min-width: 250px;
        padding: 0 13px 0 0;
        box-sizing: border-box;
        text-align: right;
        .el-page-header-right-row{
            height: $header-height/2;
            box-sizing: border-box;
            white-space: nowrap;
            >span{
                display: inline-block;
                outline: none;
                margin-left: 5px;
                height: $header-height/2;
                box-sizing: border-box;
                cursor: pointer;
                vertical-align: middle;
                color: $--color-white;
                line-height: $header-height/2;
                i{
                    font-size: 16px;
                    &:hover{
                        opacity: .8;
                    }
                }
            }
            .el-page-header-msg{
                margin-right: 5px;
                position: relative;
                b{
                    font-weight: normal;
                    position: absolute;
                    min-width: 14px;
                    font-size: 12px;
                    height: 14px;
                    border-radius: 7px;
                    color: #fff;
                    left: 6px;
                    top: 1px;
                    background-color: #f00;
                    border: 1px solid #fff;
                    text-align: center;
                    line-height: 14px;
                    z-index: 1;
                }
            }
            svg{
                cursor: pointer;
                vertical-align: middle;
                &:hover{
                    opacity: .8;
                }
            }
            .el-header-lang{
                >span{
                    vertical-align: middle;
                    display: inline-block;
                    color: $--color-white;
                    cursor: pointer;
                }
                svg{
                    vertical-align: middle;
                    display: inline-block;
                }
                height: $header-height/2;
                position: relative;
                z-index: 1;
                    transition: all .3s ease-in;
                ul{
                    // display: none;
                    position: absolute;
                    right: 0;
                    top: 27px;
                    width: 120px;
                    color: $--color-text-primary;
                    background-color: $--color-white;
                    border-radius: $--border-radius-base;
                    box-shadow: $--box-shadow-dark;
                    text-align: left;
                    li{
                        padding: 0 10px;
                        line-height: 40px;
                        cursor: pointer;
                        &:hover:not(.sanjiao_up),
                        &.select{
                            border-radius: $--border-radius-base;
                            background-color: $--border-color-light;
                        }
                        &.sanjiao_up{
                            position: absolute;
                            top: -16px;
                            right: 30px;
                            width: 0;
                            height: 0;
                            padding: 0;
                            margin: 0;
                            overflow: hidden;
                            font-size: 0;     /*是因为, 虽然宽高度为0, 但在IE6下会具有默认的 */
                            line-height: 0;  /* 字体大小和行高, 导致盒子呈现被撑开的长矩形 */
                            border-width: 8px;
                            border-style: solid;/*IE6下, 设置余下三条边的border-style为dashed,即可达到透明的效果*/
                            border-color: transparent transparent $--color-white transparent;
                        }
                    }
                }
                &:hover{
                    ul{
                        display: block;
                    }
                }
            }
        }
    }
    .el-page-header-center{
        height: $header-height;
        box-sizing: border-box;
        margin: 0 250px;
    }
}

.slide-down-enter{
    opacity: 0;
}

.slide-down-leave-active {
    opacity: 1;
}
.el-page-header-msg-content{
    width: 100%;
    right: 14px;
    overflow: hidden;
    top: 14px;
    min-height: 72px;
    padding: 10px 0;
    transition: all .377s ease;
    background-color: $--color-white;
    border-radius: $--border-radius-base;
    box-shadow: $--box-shadow-dark;
    z-index: 1;
    color: $--color-text-primary;
    text-align: left;
    li{
        margin: 0 10px;
        padding: 10px 5px;
        line-height: 22px;
        >div{
            color: $--color-text-secondary;
        }
        >p,>div{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        &:not(:last-child){
            border-bottom: 1px solid $--border-color-base;
        }
        &:hover{
            background-color: $--background-color-base;
        }
    }
}
.el-page-header-themes_checked{
    position: relative;
    b{
        vertical-align: middle;
        color: #67C23A;
        position: absolute;
        right: 5px;
        top: 5px;
        width: 15px;
        font-weight: bold;
        height: 15px;
        line-height: 15px;
        text-align: center;
        background-color: rgba(255,255,255,.6);
        border-radius: 50%;
        font-weight: 700;
        -webkit-box-shadow: 0 0 3px #999;
        box-shadow: 0 0 3px #999;
    }
}

/*主题*/

.sy-sy-theme-row>p {
    color: #457cd6;
    padding: 0;
    margin: 10px 0;
}

.sy-sy-theme-row ul {
    overflow: hidden;
}

.sy-sy-theme-row ul {
    padding: 0;
    margin: 0;
    list-style: none;
}

.sy-sy-theme-row ul li {
    float: left;
    margin: 7px;
    width: 40px;
    text-align: center;
    box-sizing: border-box;
    margin: 0 15px;
    cursor: pointer;
}

.sy-sy-theme-row ul.sy-parmary-color-themes li {
    margin: 0 10px;
}

.sy-sy-theme-row ul li i {
    display: inline-block;
    margin: 7px 0;
    width: 40px;
    height: 40px;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, .6);
}

.sy-sy-theme-row ul li .color-other {
    display: inline-block;
    margin: 7px 0;
    width: 40px;
    height: 40px;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, .6);
}

.sy-sy-theme-row ul li p {
    font-size: 14px;
    margin: 5px -5px;
}

.sy-el-input-min-small {
    width: 80%;
}

.sy-sy-theme-row ul li.sy-color-choice-model {
    height: 83px;
    padding-top: 10px;
    vertical-align: top;
    width: auto;
}

.sy-sy-theme-row ul li.sy-color-choice-model .sy-color-choice-el {
    height: 40px;
    margin-bottom: 7px;
}

.sy-desktop-slide-open {
    background-color: #457cd6;
    border-radius: 5px;
}

.sy-desktop-slide-close {
    background-color: transparent;
}

.sy-parmary-color-themes i.ink {
    background: url(/common/images/theme/icons/ink.jpg) no-repeat;
}

.sy-parmary-color-themes i.lotus {
    background: url(/common/images/theme/icons/lotus.jpg) no-repeat;
}

.sy-parmary-color-themes i.cartoon {
    background: url(/common/images/theme/icons/cartoon.jpg) no-repeat;
}

.letters {
    position: relative;
    display: block;
    min-height: 400px;
    max-height: 70vh;
    margin: 0 auto;
}

.el-about-container {
    .el-about-top {
        font-size: 20px;
        line-height: 40px;
        padding-bottom: 15px;
        >img {
            height: 36px;
            width: 36px;
            vertical-align: middle;
        }
        >span {
            padding-left: 15px;
        }
    }
    .el-about-versionlist {
        box-shadow: 0 0 8px $--border-color-base;
        padding: 10px;
        border-radius: $--border-radius-base;
        max-height: 450px;
        min-height: 200px;
        overflow: auto;
        >div {
            &.no-version {
                text-align: center;
                line-height: 200px;
                color: $--color-text-placeholder;
            }
            border: 1px solid $--border-color-base;
            border-radius: $--border-radius-base;
            margin-bottom: 15px;
            >p {
                line-height: 40px;
                margin: 0;
                padding: 0 10px;
                font-size: 14px;
                span {
                    padding-right: 15px;
                    i {
                        font-weight: 600;
                    }
                }
                >i{
                    padding: 3px;
                    cursor: pointer;
                }
                b {
                    float: right;
                    color: $--color-text-secondary;
                    font-weight: normal;
                }
                border-bottom: 1px solid $--border-color-base;
            }
            >div {
                >p{
                    padding: 0 10px;
                    font-size: 14px;
                    font-weight: bold;
                    margin: 0;
                    line-height: 32px;
                }
                ul {
                    margin: 0;
                    padding-top: 15px;
                    padding-bottom: 15px;
                    list-style-type: disc;
                    line-height: 28px;
                    padding-left: 40px;
                    font-size: 13px;
                    li {
                        padding-right: 15px;
                    }
                }
            }
        }
    }
    .el-about-versionlist-ctr{
        ul {
            padding-right: 15px;
            li{
                padding-left: 10px;
                >p{
                    width: 445px;
                    overflow: hidden;
                    margin: 0;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                >div{
                    float: right;
                    i{
                        cursor: pointer;
                        font-size: 16px;
                        color: $--color-primary;
                        opacity: .8;
                        &:hover{
                            opacity: 1;
                        }
                    }
                }
                &:hover{
                    background-color: $--color-hover-background;
                }
            }
        }
    }
    .el-about-foot {
        line-height: 30px;
        span {
            float: right;
        }
    }
}
</style>