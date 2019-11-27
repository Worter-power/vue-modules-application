<template>
    <div :id="isOpended ? 'sy-desktop-header-menu-box' : 'ph-header-module'" @click.stop="handleChangeMenu('c')">
        <div class="sy-desktop-header-menu">
            <div class="code_cy-box sy-theme-background">
                <div class="code_cy" v-drop="{ set:set, 
                        row: { 
                            data: {
                                p: { code: 'ZDYYYFL-CYYY' },
                                c: null
                            } ,
                            type: 'card', 
                            mtype: 'm'
                        }
                    }">
                    <div draggable v-for="item in menuListCy.iconVMs" :key="item.id" @click.stop="jump(item)"
                        v-drop="{set:set, row: { data: {p:menuListCy,c: item} ,type: 'card', mtype: 'm'}}" 
                        v-move="{set:set, row: { data: {p:menuListCy,c: item}, type: 'card', mtype: 'm'}}" 
                        class="code_cy_item sy-list-group-item-icon">
                        <div class="sy-desktop-iocns-box code_cy_item" :class="[item.code]">
                            <div :class="[item.code, `ph-${item.code}`]"></div>
                        </div>
                        <p class="sy-badge" :title="t(item.code) || item.name">{{t(item.code) || item.name}}</p>
                    </div>
                    <div v-if="menuList.length" class="ph-header-expened" @click.stop="handleChangeMenu('e')">
                        <i class="fa" :class="[isOpendedBox ? 'fa-angle-double-up' : 'fa-angle-double-down']"></i>
                    </div>
                </div>
            </div>
            <div class="sy-desktop-header-menu-box" :class="{'show-box': isOpendedBox}" :style="{maxHeight: fullHeight+'px'}" ref="menubox">
                <ul>
                    <li v-for="element in menuList" :key="element.code" @click.stop="removeDefaultClic"
                        class="sy-theme-border sy-theme-extraLightGray"
                        style="min-height: 70px" v-drop="{set:set, row: { data: {p:element,c: null}, type: 'box', mtype: 'm'}}">
                        <div class="group__name sy-theme-background" :class="[langType]">
                            <span>{{t(element.code) || element.name}}</span>
                        </div>
                        <ul tag="ul" :class="[langType]" v-if="element.iconVMs.length > 0">
                            <li v-for="(item,i) in element.iconVMs" :key="i+'_s'" class="sy-list-group-item" :title="t(item.code) || item.name" :item-icon="item.code"
                                @click.stop="handleGetLms">
                                <div v-if="item.types != 'other'" class="sy-list-group-item-icon" draggable :item-icon="item.code"
                                    v-drop="{set:set, row: { data: {p:element,c: item} ,type: 'card', mtype: 'm'}}" 
                                    v-move="{set:set, row: { data: {p:element,c: item}, type: 'card', mtype: 'm'}}">
                                    <el-button class="remove_cybtn" v-if="element.code == 'ZDYYYFL-CYYY'" type="text" @click.stop="handlerSort('remove',item, element.iconVMs)" icon="el-icon-error">
                                    </el-button>
                                    <div class="sy-desktop-iocns-box" :class="[item.code]" :item-icon="item.code">
                                        <div :class="[item.code, `ph-${item.code}`]" :item-icon="item.code"></div>
                                    </div>
                                    <p class="sy-badge" :item-icon="item.code">{{t(item.code) || item.name}}</p>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div id="ph-lms" ref="lms" :style="codePostion" class="ph-lms sy-theme-text" v-show="lmsListData.length && showLmList && isOpended">
                <div v-for="lm in lmsListData" :key="lm.code" @click.stop="handleCodeClick(lm)" class="sy-theme-primary9">
                    <i class="fa" :class="[lm.icon]"></i>
                    <span>{{lm.name}}</span>

                    <div v-show="lm.isSelect && lm.children.length" 
                        :class="[currrentLmcode === lm.code ? 'out' : 'in']">
                        <p v-for="l in lm.children" :key="l.code" @click.stop="handleCodeClick(l)" class="sy-theme-background-hover">
                            <span>{{l.name}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import desk from './desk.js';
import { setTimeout } from 'timers';
export default {
    mixins: [desk], // --------- 拖拽指令
    props: {
        isOpenRight: { type: Boolean , default: true}  
    },
    data(){
        return {
            langType: 'zh-CN',
            isOpended: false,
            isOpendedBox: false,
            menuListCy: { iconVMs: [] },
            menuList: [],
            mavheight: false,
            showLmList: false,
            currentCode: '',
            lmsListData: [],
            currrentLmcode: '',
            currentTimes: new Date().getTime(),
            resourceData: [],
            codePostion: {
                left: 0,
                top: 0
            },
            codeList: [],
            fullHeight: 700,
            langs: {
                en: {
                },
                'zh-CN': {
                }
            }
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            // 获取语言设置
            let _lang = window.localStorage.getItem("lange_");
            if(_lang && _lang != 'null' && _lang != 'undfined'){
                this.langType = _lang;
            }
            this.getMyMsgList();
            // 查询权限一览表 http://10.0.0.232:8555/api/base/resource/tree/c6b8860d-1f23-4946-8907-44b3c8c3d313
            this.getResourceTreeList()
        },
        t(key){
            let _lang = window.localStorage.getItem("lange_") || 'zh-CN';
            return this.langs[_lang][key]
        },
        getResourceTreeList(){
            let userId = '';
            // 获取用户信息
            try {
                let userMsg = JSON.parse(window.localStorage.getItem('user'));
                userId = userMsg.data.userId;
            } catch (error) {
                
            }
            this.$request("get", "/api/base/resource/tree/"+userId, {}).then(data => {
                this.resourceData = data.data || [];
            })
        },
        removeDefaultClic(){
            this.showLmList = true;
            this.lmsListData = [];
        },
        // 查询个人桌面 页头导航 配置信息 
        getMyMsgList() {
            this.$request("get", "/api/base/my_desktop", {}).then(data => {
                if (data && data.data) {
                    let menu = data.data.iconProps ? JSON.parse(data.data.iconProps) : [];
                    let arr = [];
                    menu.forEach((_s, s) => {
                        if (_s.code == 'ZDYYYFL-CYYY') {
                            this.menuListCy = _s || {};
                        } else {
                            arr.push(_s);
                        }
                    })
                    this.menuList = [];
                    this.menuList = this.$_.cloneDeep(arr);
                    this.codeList = [].concat.apply( [], arr.map(o=>{return o.iconVMs}));
                    
                    this.$nextTick(() => {
                        if (this.$refs.expended) {
                            this.mavheight = this.$refs.expended.scrollHeight + 'px';
                        }
                    })
                }
            }).catch((err) => {

            })
        },
        // 点击展开更多的导航模块  -------- 本次优化展开收缩时滚动条的显示
        handleChangeMenu(close) {
            console.log(13, close)
            if(close == 'c'){
                this.isOpendedBox = false;
                setTimeout(()=>{
                    this.isOpended = false;
                }, 300)
            }else{
                this.fullHeight = document.body.clientHeight - 60;
                this.currentCode = '';
                this.currrentLmcode = '';
                this.lmsListData = [];
                if(this.isOpended){
                    this.isOpendedBox = false;
                    setTimeout(()=>{
                        this.isOpended = false;
                    }, 300)
                }else{
                    this.isOpended = true;
                    this.isOpendedBox = true;
                }
            }
        },
        // 单机查看模块栏目
        handleGetLms(e){
            let target = e.target;
            this.showLmList = false;
            if(target.hasAttribute('item-icon')){
                this.codePostion = {
                    left: e.clientX+10 + 'px',
                    top: e.clientY+10 + 'px'
                }
                let code = target.getAttribute('item-icon');
                if(this.isOpenRight){
                    this.showLmList = false;
                    this.lmsListData = [];
                    this.jump(code);
                }else{
                    setTimeout(()=>{
                        let H = document.body.clientHeight;
                        let times = new Date().getTime();
                        if(times - this.currentTimes < 500){
                            this.jump(code)
                            return
                        }
                        this.currentTimes = times;
                        if(this.currentCode === code){
                            this.lmsListData = [];
                            this.currentCode = '';
                            return
                        }
                        let ignoreList = ['ne', 'el', 'rc', 'rcArea', 'signup', 'cg', 'sr', 'xbxx', 'sdaplus', 'bk', 'sc', 'score', 'scgk', 'pk', 'sar',
                            'note', 'hw', 'lib', 'sl', 'evaluate'];
                        if(ignoreList.indexOf(code) === -1){
                            let codeData = this.$_.find(this.resourceData, {code: code}) || null;
                            if(codeData && codeData.code){
                                this.lmsListData = codeData.children;
                            }else{
                                this.lmsListData = [];
                                this.currentCode = '';
                                this.jump(code)
                            }
                        }else{
                            this.lmsListData = [];
                            this.currentCode = '';
                            this.jump(code)
                        }

                        let _h = this.lmsListData.length*36;
                        if((H - e.clientY) < _h){
                            this.codePostion = {
                                left: e.clientX + 'px',
                                top: H - _h + 'px'
                            }
                        }
                        this.$nextTick(()=>{
                            this.currentCode = code;
                            this.showLmList = true;
                        })
                    }, 200)
                    
                }
            }
        },
        // 点击跳转具体模块
        jump(item) {
            // ------
        },
        // 栏目跳转
        handleCodeClick(item){
            if(item.isSelect){
                if(this.currrentLmcode === item.code){
                    this.currrentLmcode = '';
                }else{
                    this.currrentLmcode = item.code;
                }
            }else{
                if(item.indexUrl){
                    if(item.opener == 0){
                        window.location.href = item.indexUrl;
                    }else{
                        // window.open(item.indexUrl);
                        window.location.href = item.indexUrl;
                    }
                }else if (item.menuRoute) {
                    // window.open(item.menuRoute);
                    window.location.href = item.menuRoute;
                } else if (item.index) {
                    // window.open(item.index);
                    window.location.href = item.index;
                }
            }
        },
        handlerSort(type, data, arr) {
            // ------
        },
        findIndex(arr, code) {
            for (let index = 0; index < arr.length; index++) {
                let element = arr[index];
                if (element.code == code) {
                    return index + 1
                }
            }
        },
        // 拖动排序
        set(data) {
            // -------
        }
    },
    mounted(){
        if(!this.isOpenRight){
            return
        }
        let _this = this;
        window.document.oncontextmenu = function(e){ 
            _this.showLmList = false;
            let target = e.target;
            let H = document.body.clientHeight;
            if(target.hasAttribute('item-icon')){
                _this.codePostion = {
                    left: e.clientX + 'px',
                    top: e.clientY + 'px'
                }
                setTimeout(() => {
                    let code = target.getAttribute('item-icon');
                    let ignoreList = ['ne', 'el', 'rc', 'rcArea', 'signup', 'cg', 'sr', 'xbxx', 'sdaplus', 'bk', 'sc', 'score', 'scgk', 'pk', 'sar',
                        'note', 'hw', 'lib', 'sl', 'evaluate'];
                    if(ignoreList.indexOf(code) === -1){
                        let codeData = _this.$_.find(_this.resourceData, {code: code}) || null;
                        if(codeData && codeData.code){
                            _this.lmsListData = codeData.children;
                        }else{
                            _this.currentCode = [];
                        }
                    }else{
                        _this.lmsListData = [];
                    }
                    let _h = _this.lmsListData.length*36;
                    if((H - e.clientY) < _h){
                        _this.codePostion = {
                            left: e.clientX + 'px',
                            top: H - _h + 'px'
                        }
                    }
                    _this.$nextTick(()=>{
                        _this.currentCode = code;
                        _this.showLmList = true;
                    })
                }, 200);
            }
            BUS.$emit('mouse-right', e)
            return false
        }  
    }
}
</script>

<style lang="scss">

$icon-url-prifix: "/common/images/icons/";
$icons-url: "/common/images/icons/icons.png";
$--color-lightBackground: #edf7ff !default;
$--color-tableBorder: #dfe6ec !default;

/*icons*/
.sy-list-group-item-icon {
    position: relative;
    height: 60px;
    width: 60px;
    text-align: center;
    cursor: pointer;
    transition: all ease-in-out .3s;
    transform: scale(1);
    transform-origin: center center 0;
    border-radius: 0;
    .sy-desktop-iocns-box {
        background-repeat: no-repeat;
        background-position: center center;
        box-sizing: border-box;
        width: 38px;
        height: 38px;
        display: inline-block;
        padding: 3px 4px;
        > div {
            background-image: url($icons-url);
            background-repeat: no-repeat;
            background-position: -690px 0;
            box-sizing: border-box;
            width: 30px;
            height: 30px;
            display: inline-block;
        }
        &.code_cy_item {
            > div {
                background-position: -690px -30px;
            }
        }
    }

    > p {
        margin: 0;
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    &.code_cy_item {
        >p{
            color: $--color-white;
        }
    }
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.3);
        transform: scale(1.2); 
        animation: borderRed .5s infinite;  /*引用动画*/
        animation-direction: alternate;
    }
    @keyframes borderRed {
        from{ 
            border-radius: 0;
        };
        to{  
            border-radius: 20%;
        }
    }
}

$max-width: 650px;
.sy-desktop-header-menu {
    position: relative;
    text-align: center;
    width: $max-width;
    margin: 0 auto;
    .code_cy-box{
        position: relative;
        overflow: hidden;
        height: 60px;
        z-index: 10;
        background-color: $--color-primary;
    }
    .code_cy{
        white-space: nowrap;
        position: absolute;
        left: 50%;
        overflow: hidden;
        height: 100%;
        transform: translateX(-50%);
        >div{
            display: inline-block;
        }
        .ph-header-expened{
            margin-top: 7px;
            height: 40px;
            width: 40px;
            line-height: 40px;
            color: #fff;
            cursor: pointer;
            vertical-align: top;
            text-align: center;
            position: relative;
            z-index: 999;
            border-radius: 10px;
            border: 2px dashed #fff;
            > i {
                font-size: 32px;
                position: relative;
                line-height: 40px;
            }
        }
    }
    .sy-desktop-header-menu-box {
        box-shadow: $--box-shadow-dark;
        width: 100%;
        position: absolute;
        padding: 0;
        background-color: $--color-lightBackground;
        text-align: left;
        overflow-y: auto;
        z-index: -10000;
        opacity: 0;
        transition: all ease-in-out .3s;
        transform: scale(1,0);
        transform-origin: 0 0 0;
        &.show-box{
            z-index: 0;
            opacity: 1;
            transform: scale(1,1);
        }
        > ul {
            padding: 0;
            box-sizing: border-box;
            > li {
                border-left: 1px solid $--color-primary;
                border-right: 1px solid $--color-primary;
                position: relative;
                box-sizing: border-box;
                &:not(:last-child) {
                    border-bottom: 1px solid $--color-tableBorder;
                }
                &:last-child {
                    border-bottom: 1px solid $--color-primary;
                }
                .group__name {
                    width: 28px;
                    position: absolute;
                    padding: 3px 7px;
                    box-sizing: border-box;
                    text-align: center;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    background-color: $--color-primary;
                    border-bottom: 1px solid #fff;
                    color: $--color-white;
                    > span {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    &.en {
                        width: 100%;
                        line-height: 20px;
                        text-align: left;
                        position: initial;
                        span {
                            position: initial;
                        }
                    }
                }
                ul {
                    margin-left: 28px;
                    padding: 5px;
                    &.en {
                        margin-left: 0;
                    }
                    li {
                        float: left;
                        color: $--color-text-primary;
                    }
                    &::after{
                        content: '';
                        display: block;
                        height: 0;
                        clear: both;
                    }
                }
            }
        }
    }
}
#sy-desktop-header-menu-box {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1500;
    background-color: rgba(0, 0, 0, 0.4);
    overflow: auto;
}
#ph-header-module{
    position: relative;
    z-index: 1000;
}

#ph-lms{
    position: fixed;
    left: 60px;
    top: 0;
    width: 230px;
    min-height: 40px;
    background-color: #fff;
    border-radius: 4px;
    z-index: 10;
    text-align: left;
    box-shadow: $--box-shadow-dark;
    animation: lms .3s;
    color: $--color-primary;
    cursor: pointer;
    >div{
        >i{
            display: inline-block;
            width: 20px;
            text-align: center;
        }
        line-height: 36px;
        padding: 0 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        >div{
            min-height: 0; 
            overflow: hidden; 
            transition: all ease-in-out .3s; 
            &.in{
                max-height: 0; 
            }
            &.out{
                max-height: 500px; 
            }
            >p{
                padding: 0 10px 0 35px;
                &:hover{
                    color: #fff;
                    background-color: $--color-primary;
                }
            }
        }
        &:hover{
            background-color: $--color-primary9;
        }
    }
}
@keyframes lms {
    0%{width:0;}
    50%{width:150px;}
    100%{width:230px;}
}
</style>