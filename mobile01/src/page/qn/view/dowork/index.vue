<template>
    <div id="app" :class="[$store.state.theme]">
        <div class="sy-app-container sy-qn-bg" v-loading="pageLoading">
            <div class="sy-qn-details-container">
                <div class="qn-creat-container" style="padding-bottom:40px;" :class="{'is-pages': openPage}" ref="titlebox">
                    <div class="sy-qn-details-header no-position sy-theme-border" ref="header">
                        <ul class="sy-theme-lightBackground">
                            <li class="img">
                                <qn></qn>
                            </li>
                            <li class="title"> {{qnData.name}} </li>
                            <li>
                                <span>{{$store.state.lang.qn.q3}}{{qnData.createName}}</span>
                                <span>{{$store.state.lang.qn.q4}}{{qnData.unitName}}</span>
                                <span>{{$store.state.lang.qn.q5}}{{qnData.beginDate}} {{qnData.beginTime}} ~ {{qnData.endDate}} {{qnData.endTime}}</span>
                                <span>
                                    <span v-if="qnData.status == 1">{{$store.state.lang.qn.q7}}</span>
                                    <span v-if="qnData.status == 2">{{$store.state.lang.qn.q8}}</span>
                                    <stime style="color:#FF4949;" v-if="qnData.status == 1 || qnData.status == 2" :data="qnData"></stime>
                                    <span v-if="qnData.status == 4 || qnData.status == 3">{{$store.state.lang.qn.q9}}</span>
                                    <span v-if="qnData.status == 4 || qnData.status == 3">{{qnData.endDate + ' ' + qnData.endTime}}</span>
                                </span>
                                <span v-if="ixsitPages">
                                    <el-checkbox v-model="openPage" style="margin-left: 15px;" v-if="qnData.totle>1">{{$store.state.lang.qn.q22}}</el-checkbox>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div v-if="fixedItems" :style="{height: itemHeight + 'px'}"></div>
                    <div v-if="isHiddenTip" class="sy-qn-details-yd" :class="{'is-fixed': fixedItems, 'sy-theme-border': fixedItems}" ref="yditems">
                        <span>{{$store.state.lang.qn.q14}} <b style="color:#FF4949;">{{qnData.totle}}</b> {{$store.state.lang.qn.q15}} {{$store.state.lang.qn.q17}} <b>{{finishedNum}}</b> {{$store.state.lang.qn.q16}}</span>
                        <a class="qn-item-box" v-for="(item, index) in qnData.datas" :key="index"
                            @click="handleJumpById(item)"
                            v-show="item.type != 4 && item.type != 5"
                            :style="{background: item.finished == 1 ? '#E7FCD9' : item.finished == 0 ? '#FFCCCC' : '#fff'}">
                            {{item.sort}}
                        </a>
                    </div>
                    <template v-if="isInit && qnData.status == 1">
                        <div style="line-height: 32px;padding: 0 10px;"  v-if="qnData.remark">
                            <p>{{$store.state.lang.qn.q6}}{{qnData.remark}}</p>
                        </div>
                        <ul class="qn-dotitle-box">
                            <li v-for="row in qnData.datas" :key="row.id" 
                                :class="{
                                    'is-hiedden': openPage && (row.startNum != currentPage)
                                }">
                                <component :is="row.componentId" :data="row" :num="row.sort" show 
                                    :questionType="qnData.type"
                                    :showpages="openPage"
                                    :isHiddenTip="isHiddenTip"
                                    @pagechange="currentChange"
                                    :start="row.startNum" :totles="row.totles"></component>
                            </li>
                        </ul>
                    </template>
                </div>
                <div class="sy-qn-" v-if="isInit && qnData.status == 1">
                    <span class="sy-theme-background" @click="handleSave">{{$store.state.lang.qn.q20}}</span>
                    <span class="sy-theme-background" @click="handleChecks(false)">{{$store.state.lang.qn.q21}}</span>
                    <span class="back sy-theme-background" v-if="isLogin" @click="handleBackHome">{{$store.state.lang.button.back}}</span>
                </div>
                <div class="qn-do-btn" v-if="isInit && qnData.status == 1">
                    <el-button  @click="handleSave">{{$store.state.lang.qn.q20}}</el-button>
                    <el-button  @click="handleChecks(false)">{{$store.state.lang.qn.q21}}</el-button>
                    <el-button  v-if="isLogin" @click="handleBackHome">{{$store.state.lang.button.back}}</el-button>
                </div>
            </div>
            <el-dialog2
                :title="$store.state.lang.message.info"
                height="auto"
                width="450px"
                slide="fade"
                :show-close="false"
                :close-on-press-escape="false"
                :visible.sync="optTextDialog">
                <div slot="body" class="qn-info-box">
                    <i class="fa fa-check" style="color: #67C23A"></i>
                    <span>{{qnData.type == 1 ? $store.state.lang.qn.q25_1 : $store.state.lang.qn.q25}}</span>
                </div>
                <div slot="footer" style="text-align: center;">
                    <el-button style="margin: 0 3px;" v-if="isLogin" @click="$router.push('/qn/home')"  >{{$store.state.lang.qn.q23}}</el-button>
                    <el-button style="margin: 0 3px;" v-if="qnData.realName != 1" @click="handlecLiskc"  >{{$store.state.lang.qn.q24}}（{{timeLost}}）</el-button>
                </div>
            </el-dialog2>
            <el-dialog2
                :title="$store.state.lang.qn.q26"
                height="auto"
                width="500px"
                slide="fade"
                :visible.sync="infosDialog">
                <div slot="body" class="qn-info-box remind">
                    <i style="color: #E6A23C"></i>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;{{qnData.remind}}</span>
                </div>
                <div slot="footer" style="text-align: center;">
                    <el-button style="margin: 0 3px;" @click="infosDialog = false"  >{{$store.state.lang.qn.q27}}</el-button>
                </div>
            </el-dialog2>
            <el-dialog2 :title="$store.state.lang.message.info" height="auto" width="390px" slide="fade" :visible.sync="infoDialog">
                <div slot="body" class="qn-info-box">
                    <i class="el-icon-warning" style="color: #E6A23C"></i>
                    <span>{{infoText}}</span>
                </div>
                <div slot="footer" style="text-align: center;">
                    <el-button style="margin: 0 3px;" @click="infoDialog = false"  >{{$store.state.lang.button.close}}</el-button>
                </div>
            </el-dialog2>
            <el-dialog2 :title="$store.state.lang.message.info" height="auto" width="390px" slide="fade" :visible.sync="errorDialog">
                <div slot="body" style="padding: 20px;max-height: 500px;overflow:auto;">
                    <p style="line-height: 22px;">{{errorMsgList.message}}</p>
                    <p v-for="item in errorMsgList.error" :key="item" style="line-height: 22px;color: #F56C6C">{{item}}</p>
                </div>
                <div slot="footer" style="text-align: center;">
                    <el-button style="margin: 0 3px;" @click="errorDialog = false"  >{{$store.state.lang.button.close}}</el-button>
                </div>
            </el-dialog2>
        </div>
    </div>
</template>

<script>
import components from "../ques/index.js";
import stime from "../home/time.vue";
import formats from '../details/details.js';
export default {
    components: {
        stime,
        ...components
    },
    mixins: [formats],
    data() {
        return {
            isStart: false,
            infoText: '',
            infoDialog: false,
            optTextDialog: false,
            pageLoading: false,
            qnData: {
                totle: 0,
                datas: []
            },
            isLogin: false,
            infosDialog: false,
            timeLost: 5,
            isInit: false,
            intNum: 0,
            saveLoading: false,
            pageList: [],
            openPage: true,
            currentPage: 1,
            headerHeight: '56px',
            fixedItems: false,
            itemHeight: 54,
            ixsitPages: false,
            errorDialog: false,
            errorMsgList: {
                message: '',
                error: []
            },
            isHiddenTip: true
        }
    },
    computed: {
        finishedNum(){
            return this.qnData.datas.filter(o=>{return o.finished}).length;
        }
    },
    created(){
        this.init();
    },
    mounted(){
        let box = this.$refs.titlebox;
        let header = this.$refs.header;
        if(!box || !header){return}
        let h = header.offsetHeight || 82;
        box.onscroll = () => {
            // console.log(box.scrollTop, h)
            let top = box.scrollTop;
            this.fixedItems = top >= h;
        }
    },
    methods: {
        init(){
            if(this.$route.query.id){
                this.getDetails();
            }
        },
        getDetails(){
            /**
             * 1. 通过 /api/qn/nologin/qnTitle/preview 查询问卷信息
             * 2. 如果是匿名问卷 不需要登录
             * 3. 如果是实名问卷 调用 /api/qn/nologin/qnExist/whether_login 查询是否登陆
             * 4. 如果未登录 弹出异步登陆框
             * 5. 如果登陆调用/api/qn/qnTitle/preview 查询问卷详情
             */
            this.isInit = false;
            this.isLogin = false;
            this.pageLoading = true;
            request('get', '/api/qn/nologin/qnTitle/preview', {
                qid: this.$route.query.id
            }).then(res=>{
                if(res.status == 200 && res.code == 'ok'){
                    if(res.data.realName == 1){ // 实名问卷
                        request('get', '/api/qn/nologin/qnExist/whether_login', {}).then(res1=>{
                            if(res1.status == 200 && res1.code == 'ok' && res1.data){// 已经登录
                                this.isLogin = true;
                                THEME();
                                this.makeDate(res);
                            }else{
                                this.isLogin = false;
                                this.$store.commit('SHOW_LOGIN_DIALOG');
                            }
                        })
                    }else{ 
                        this.makeDate(res);
                        // 匿名问卷
                    }
                }else{
                    this.pageLoading = true;
                }
            }).catch(err => {
                this.pageLoading = false;
            })
        },
        // 处理数据  res 为 问卷id 或者匿名问卷数据体
        makeDate(res){
            this._getTiletDetails(res || this.$route.query.id).then(data=>{
                if(data.realName == 1){
                    let issubmit = window.localStorage.getItem(`_userdo_${this.$route.query.id}_`);
                    if(issubmit === this.$store.state.userId){
                        this.$router.push({path: '/qn/detail', query: {id: this.$route.query.id}})
                        return
                    }else{
                        
                    }
                }
                /**
                 * 1. 判断有没有分页
                 * 2. 判断最后一题是不是分页
                 * 3. 不是分页要加一个分页
                 */
                if(data.datas && data.datas.find(o=>o.type == 5)){
                    this.ixsitPages = true;
                    if(data.datas[data.datas.length-1].type != 5){
                        let lastPage = this.$_.cloneDeep(data.datas.find(o=>o.type == 5));
                        lastPage.startNum = lastPage.totles;
                        data.datas.push(lastPage)
                    }
                }
                this.pageLoading = false;
                this.isInit = true;
                document.title = res.data.name || this.$store.state.lang.base.title;
                this.qnData = data;
                this.isHiddenTip = this.qnData.datas.filter(o=>{
                    return o.type == 0 || o.type == 1 || o.type == 2 || o.type == 3 || o.type == 6
                }).length > 1 ;
                // console.log(this.qnData)
                // 判断问卷是否有提示
                /**
                 * 0 创建中
                 * 1 进行中
                 * 2 即将开始
                 * 3 手动终止
                 * 4 已结束
                 */
                if(res.data.status == 2){
                    this.infoText = this.$store.state.lang.qn.q28; //该问卷即将开始，请等待！
                    this.infoDialog = true;
                    return
                }
                if(res.data.status == 3 || res.data.status == 4){
                    this.infoText = this.$store.state.lang.qn.q13; // 该问卷已经结束，谢谢您的关注！
                    this.infoDialog = true;
                    return
                }
                // 提示
                if(res.data.remind && res.data.status == 1){
                    this.infosDialog = true;
                }
                // 获取题目列表
                this.tableData = this.qnData.datas.filter(o=>{return o.type != 4 && o.type != 5}).map(o=>{return {sort: o.sort, id: o.id}});
            }).catch(err=>{
                this.pageLoading = false;
            })
        },
        // 锚点跳转
        handleJumpById(data){
            if(this.$refs.yditems){
                this.itemHeight = this.$refs.yditems.offsetHeight;
            }
            let title = document.getElementsByClassName(`question_jump_${data.sort}`);
            if(!title || !title[0]){return}
            let jump = title[0];
            let total = jump.offsetTop;
            let parentNode = this.$refs.titlebox;
            this.currentPage = data.startNum;
            // 当前滚动条距离
            this.$scrollTo(parentNode, total-this.itemHeight)
        },
        // 检查漏题
        handleChecks(jump){
            // console.log(this.qnData.datas)
            let dos = this.qnData.datas.filter(o=>{return o.finished}).length;
            let notdos = this.qnData.totle - dos;
            let message = '';
            if(this.qnData.totle == dos){
                message = this.$store.state.lang.qn.q34;
            }else{
                message = `${this.$store.state.lang.qn.q35} ${this.qnData.totle}${this.$store.state.lang.qn.q36}${dos}${this.$store.state.lang.qn.q37}${notdos}${this.$store.state.lang.qn.q38}`
            }
            if(!jump){
                this.$notify({
                    title: this.$store.state.lang.message.info,
                    message: message,
                    type: this.qnData.totle == dos ? 'success' : 'warning'
                });
            }
            let errormsg = this.qnData.datas.filter(o=>{return o.errored });
            return {
                error: errormsg.map(o=>{return o.errorMsg}),
                message: message,
                finished: this.qnData.totle == dos
            }
        },
        // 生成标识
        guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },
        // 提交结果
        handleSave(){
            if ((new Date().getTime() - this.intNum) < 500) { //解决双击发两条请求的问题，只要点击相隔小于500毫秒就不发请求
                this.intNum = 0;
                return false;
            }else{
                this.intNum = new Date().getTime();
            }
            let msg = this.handleChecks(true);
            if(msg.error.length > 0){
                this.errorMsgList = msg;
                this.errorDialog = true;
                return
            }
            this.$confirm(msg.message, this.$store.state.lang.message.info, {
                confirmButtonText: this.$store.state.lang.qn.b102,
                cancelButtonText: this.$store.state.lang.button.cancel,
                type: 'warning'
            }).then(() => {
                this.handleSubmitData();
            }).catch(() => {
                    
            });
        },
        // 提交
        handleSubmitData(){
            // 公共参数
            let params = {
                qnid: this.qnData.id,
                unitId: this.isLogin ? undefined : this.$route.query.unitid,
            }
            // 类型 是 匿名 标识类参数
            if(this.qnData.realName == 0){
                let macId = localStorage.getItem('GUID_QN_CODE');
                macId = !macId || macId == 'null' ? this.guid()+'-'+new Date().getTime() : macId;
                params.macId = macId;
            }
            if(this.qnData.type == 1){
                // 投票
            }else{
                // 问卷
            }
            let vMsKey = `${this.qnData.type == 0 ? 'wj' : 'tp'}${this.qnData.realName||0}`;
            let vms = {
                '0': 'qnResultVMs', // 问卷
                '1': 'qnVoteResultVMs' // 投票
            }
            // 获取结果并赋值
            this._getResultMsg(vms[this.qnData.type||0], params);
            let apis = {
                wj0: '/api/qn/nologin/qnTitle/save',
                wj1: '/api/qn/qnTitle/save',
                tp0: '/api/qn/nologin/qn_vote_title/save',
                tp1: '/api/qn/qn_vote_Title/save',
            }
            console.log(params)
            this.pageLoading = true;
            request('post', apis[vMsKey], params).then(data=>{
                if(data.status == 200 && data.code == 'ok'){
                    this.optTextDialog = true;
                    window.localStorage.setItem('GUID_QN_CODE', params.macId)
                    if(this.qnData.realName != 1){
                        // 问卷
                        let timer = setInterval(()=>{
                            this.timeLost--;
                            if(this.timeLost == 0){
                                clearInterval(timer)
                                location.reload();
                            }
                        },1000)
                    }else{
                        window.localStorage.setItem(`_userdo_${this.$route.query.id}_`, this.$store.state.userId)
                        // 实名跳转详情页
                        this.$router.push({path: '/qn/detail', query: {id: params.qnid}})
                    }
                }
                this.pageLoading = false;
            }).catch(err=>{
                this.pageLoading = false;
            })
        },
        // 获取题目答案
        _getResultMsg(vm, params){
            let arrs = this.qnData.datas.filter(o=>{return o.type != 4 && o.type != 5});
            let num = 0;
            arrs.forEach((_s,s)=>{
                params[`${vm}[${num}].qnid`]= this.qnData.id;
                params[`${vm}[${num}].titleId`]= _s.titleId;
                params[`${vm}[${num}].type`]= _s.type;
                params[`${vm}[${num}].number`]= _s.number;
                try {
                    let result = '';
                    // 单选题 下拉选 填空题 直接获取 defaultAnswer
                    if([0,6,3].indexOf(_s.type) !== -1){
                        result = _s.defaultAnswer;
                        //单选  选项输入内容保存
                        if(_s.opts && _s.opts.length){
                            params[`${vm}[${num}].remark`]=  result ? (_s.opts.find(o=>o.id == result).arrowText || '') : '';
                        }
                    }
                    // 多选题答案获取 选项中checked
                    if(_s.type == 1){
                        result = _s.opts.filter(o=>o.checked).map(o=>o.id).join(',');
                        // 多选  选项输入内容保存
                        params[`${vm}[${num}].remark`]= _s.opts.filter(o=>o.checked).map(o=>`${o.id}_${o.arrowText || ''}`).join(',');
                    }
                    // 矩阵题处理
                    if(_s.type == 2){
                        if(_s.orderType == 0){
                            // 单选
                            result = _s.questions.map(o=>{ return o.anwser ? `${o.id}_${o.anwser}` : '' }).join(',')
                        }else{
                            // 多选
                            let arr = [];
                            _s.questions.forEach((_d,d)=>{
                                _d.items.forEach((_q,q)=>{
                                    if(_q.checked){
                                        arr.push(`${_d.id}_${_q.id}`)
                                    }
                                })
                            })
                            result= arr.join(',');
                        }
                    }
                    params[`${vm}[${num}].result`]= result;
                    num = num + 1;
                } catch (error) {
                    num = num + 1;
                }
            })
        },
        // 分页改变
        currentChange(page){
            this.currentPage = page;
        },
        handlecLiskc(){
            location.reload();
        }
    }
}
</script>