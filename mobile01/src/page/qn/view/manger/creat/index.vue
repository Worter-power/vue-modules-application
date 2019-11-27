<template>
    <div class="sy-home-body sy-qn">
        <div class="sy-qn-details-container" :class="[$store.state.langType]">
            <p class="sy-theme-background" :class="[$store.state.langType]"><b>{{$store.state.lang.qn[questionType == 0 ? 'c1' : 'b47']}}</b></p>
            <div class="qn-creat-container" v-loading="pageLoading">
                <ul class="qn-add-top sy-theme-background">
                    <li v-for="item in questionList" :key="item.id"
                        @click="handleCheckQuestion(item)">
                        <i class="fa" :class="[item.icon]" aria-hidden="true"></i>
                        <span>{{item.name}}</span>
                    </li>
                    <li>
                        <el-dropdown trigger="click" size="medium" placement="bottom" @command="handlecommand">
                            <span class="el-dropdown-link">
                                <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                                <span>{{$store.state.lang.qn.c2}}</span>
                            </span>
                            <el-dropdown-menu slot="dropdown" style="width: 278px;padding: 10px;">
                                <el-dropdown-item v-for="row in dropdownList" :key="row.id" style="display: inline-block;padding: 5px;"
                                    :command="row">
                                    <el-button>{{row.sname}}</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </li>
                </ul>
                <div class="qn-add-body" ref="box">
                    <div class="qn-add-title sy-theme-lightBackground sy-theme-border" >
                        <h2 contenteditable="plaintext-only" @blur="handleBlurTestName">{{qnData.name}}</h2>
                        <p>{{$store.state.lang.qn.q3}}{{$store.state.realName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{$store.state.lang.qn.q4}}{{qnData.unitName}}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{$store.state.lang.qn.q84}}{{qnData.beginDate}}
                            &nbsp;{{qnData.beginTime}}&nbsp;&nbsp;~&nbsp;&nbsp;{{qnData.endDate}}&nbsp;{{qnData.endTime}}</p>
                    </div>
                    <h4 style="word-wrap: break-word;white-space: pre-wrap;">{{$store.state.lang.qn[questionType == 0 ? 'q6' : 'b41']}}{{qnData.remark}}</h4>
                    <ul>
                        <li v-for="(row, index) in qnData.datas" :key="row.id">
                            <div class="qn-opts-btn" >
                                <el-button-group>
                                    <el-button v-if="index != 0" 
                                        type="primary" 
                                        @click="optClick('up', index, row)" 
                                        icon="el-icon-sort-up">{{$store.state.lang.qn.c3}}</el-button>
                                    <el-button type="primary" 
                                        @click="optClick('bj', index, row)" 
                                        icon="el-icon-edit-outline">{{$store.state.lang.button.edit}}</el-button>
                                    <el-button type="primary" 
                                        @click="optClick('sc', index, row)" 
                                        icon="el-icon-delete">{{$store.state.lang.button.delete}}</el-button>
                                    <el-button v-if="index != qnData.datas.length-1" 
                                        type="primary" 
                                        @click="optClick('down', index, row)" 
                                        icon="el-icon-sort-down">{{$store.state.lang.qn.c4}}</el-button>
                                </el-button-group>
                            </div>
                            <component :is="row.componentId" :data="row" :num="row.sort" show 
                                :questionType="questionType"
                                :start="row.startNum" :totles="row.totles"></component>
                        </li>
                    </ul>
                </div>
                <div class="qn-add-bottom">
                    <el-button @click="btnClick(2)"  >{{$store.state.lang.button.cancel}}</el-button>
                    <el-button   @click="btnClick(2)">{{$store.state.lang.qn.q123}}</el-button>
                    <el-button   @click="btnClick(3)">{{$store.state.lang.qn.q124}}</el-button>
                </div>
            </div>

            <div class="qn-add-btns">
                <div class="sy-theme-background" v-show="isShowTopBtn" @click="goTop"><i class="fa fa-chevron-up" aria-hidden="true"></i></div>
                <div class="sy-theme-background" v-show="isShowBottomBtn" @click="goBottom"><i class="fa fa-chevron-down" aria-hidden="true"></i></div>
            </div>
        </div>
        <!-- 弹出框 -->
        <el-dialog2 :title="questionTitle" :visible.sync="dialogVisible" 
            :height="componentId == 'question2' ? '646px' : 'auto'" width="1260px">
            <div slot="body" v-loading="saveLoading">
                <component :is="componentId" 
                    v-if="dialogVisible"
                    :data="questionData" 
                    :num="questionNum" 
                    :start="startNum"
                    :totles="pagetotles"
                    :questionType="questionType"
                    @save-sub="handleSaveQuestion"></component>
            </div>
        </el-dialog2>

    </div>
</template>

<script>
import components from "../../ques/index.js";
import dataJSON from "./data.js";
import { addChooseQuest, queryQuestionInfo, queryChooseQuest } from "../request.js";
import formats from '../../details/details.js';
export default {
    mixins: [formats],
    data() {
        return {
            dialogWidth: {
                question0: '646px',
                question1: '646px',
                question2: '700px',
                question3: '452px',
                question4: '344px',
                question5: '344px',
                question6: '700px',
            },
            questionList: [],
            saveLoading: false,
            allQuestionList: [{
                    icon: 'fa-dot-circle-o',
                    name: this.$store.state.lang.qn.question0,
                    componentId: 'question0',
                    includ: '1,0'
                },
                {
                    icon: 'fa-check-square',
                    name: this.$store.state.lang.qn.question1,
                    componentId: 'question1',
                    includ: '1,0'
                },
                {
                    icon: 'fa-braille',
                    name: this.$store.state.lang.qn.question2,
                    componentId: 'question2',
                    includ: '0'
                },
                {
                    icon: 'fa-pencil-square',
                    name: this.$store.state.lang.qn.question3,
                    componentId: 'question3',
                    includ: '0'
                },
                {
                    icon: 'fa-file-text-o',
                    name: this.$store.state.lang.qn.question4,
                    componentId: 'question4',
                    includ: '1,0'
                },
                {
                    icon: 'fa-laptop',
                    name: this.$store.state.lang.qn.question5,
                    componentId: 'question5',
                    includ: '1,0'
                }
            ],
            dropdownList: dataJSON[this.$store.state.langType],
            componentId: '',
            questionId: this.$route.query.qnid, //问卷的id
            copyQuestionId: this.$route.query.copyid, //问卷的id
            isShowTopBtn: false,
            isShowBottomBtn: false,
            questionData: {},
            questionNum: '1',
            dialogVisible: false,
            questionTitle: '',
            qnData: {
                datas: []
            },
            types: {
                question0: 0,
                question1: 1,
                question2: 2,
                question3: 3,
                question4: 4,
                question5: 5,
                question6: 6
            },
            startNum: 0,
            pagetotles: 1,
            questionType: this.$route.query.type,
            pageLoading: false
        }
    },
    components: components,
    created() {
        this.init();
    },
    methods: {
        init() {
            // 根据type题型筛选
            this.questionList = this.allQuestionList.filter(o=>{return o.includ.indexOf(this.questionType) != -1})
            // 查询已设置的题目
            this.getLoginData();
        },
        getLoginData(){
            this.pageLoading = true;
            this.qnData={};
            this._getTiletDetails(this.copyQuestionId || this.questionId).then(res=>{
                this.qnData = res;
                this.$nextTick(()=>{
                    this.checkBtn();
                })
                this.pageLoading = false;
            }).catch(err=>{
                this.pageLoading = false;
            })
        },
        optClick(t, index, row){
            if(t == 'bj'){
                this.questionTitle = this.$store.state.lang.qn.c5;
                this.questionNum = row.sort;
                this.questionData = row;
                this.componentId = row.componentId;
                this.dialogVisible = true;
            }else if(t == 'sc'){
                this.$confirm( this.$store.state.lang.message.delete, this.$store.state.lang.message.info, {
                    confirmButtonText: this.$store.state.lang.button.ok,
                    cancelButtonText: this.$store.state.lang.button.cancel,
                    type: 'warning'
                }).then(() => {
                    request('delete', '/api/qn/qnTitle', {titleId: row.titleId}).then(res=>{
                        if(res.code == 'ok'){
                            this.getLoginData();
                        }else{
                            this.$notify.error({
                                message: res.fieldErrors ? res.fieldErrors.map(o=>{return o.message}).join('，') : res.message
                            });
                        }
                    })
                }).catch(() => {
                        
                });
            }else if(t == 'up'){
                this.changeSort(this.qnData.datas[index].titleId, this.qnData.datas[index-1].titleId);
            }else{
                this.changeSort(this.qnData.datas[index+1].titleId, this.qnData.datas[index].titleId);
            }
        },
        changeSort(upTitleId,downTitleId){
            request('get', '/api/qn/qnTitle/order', {
                upTitleId,
                downTitleId
            }).then(res=>{
                this.getLoginData();
            })
        },
        handleComputed() {
            this.$emit('save-sub', this.form)
        },
        // 点击题目类型
        handleCheckQuestion(row) {
            this.questionTitle = row.name
            this.questionData = {};
            this.componentId = row.componentId;
            this.questionNum = row.id == 'question4' || row.id == 'question5' ? this.qnData.datas.length+1 : this.getQuestionNumber();
            this.startNum = this.getPaperPages();
            this.pagetotles = this.getPaperPages()+1;
            this.dialogVisible = true;
        },
        handlecommand(data) {
            this.questionTitle = this.$store.state.lang.qn.c2;
            this.questionNum = this.getQuestionNumber();
            this.questionData = data;
            this.componentId = data.componentId;
            this.dialogVisible = true;
        },
        getPaperPages(){
            let num = 0;
            this.qnData.datas.forEach((_s,s)=>{
                if(_s.type ==  'question5'){
                    num++
                }
            })
            return num+1; 
        },
        getQuestionNumber(){
            let num = 0;
            this.qnData.datas.forEach((_s,s)=>{
                if(_s.type !=  'question4' && _s.type !=  'question5'){
                    num++
                }
            })
            return num+1; 
        },
        handleBlurTestName(e) {
            this.testName = e.target.innerHTML;
        },
        btnClick(step){
            this.$router.push({path: '/qn/manager/add', query: {
                step: step,
                qnid: this.$route.query.qnid,
                realName: this.$route.query.realName,
                tp: this.$route.query.tp,
                type: this.$route.query.type
            }});
        },
        goTop() {
            this.$scrollTo(this.$refs.box, 0);
        },
        goBottom() {
            let box = this.$refs.box;
            if (box) {
                this.isShowTopBtn = true;
                box.scrollTop = box.scrollHeight;
            }
        },
        checkBtn() {
            this.$nextTick(() => {
                let box = this.$refs.box;
                if (box) {
                    if (box.scrollHeight > (box.innerHeight || box.clientHeight)) {
                        this.isShowBottomBtn = true;
                        box.onscroll = () => {
                            if (box.scrollTop > 10) {
                                this.isShowTopBtn = true;
                            } else {
                                this.isShowTopBtn = false;
                            }
                        }
                    } else {
                        this.isShowTopBtn = false;
                        this.isShowBottomBtn = false;
                    }
                }
            })
        },
        // 获取并处理 弹出框 的数据 
        handleSaveQuestion(data) {
            if(data.code == 'remove'){
                this.dialogVisible = false;
            }else{
                if(data.code == 'copy'){
                    data.titleId = '';
                }
                this.saveLoading = true;
                this[`add_${this.componentId}`](data);
            }
        },
        add_question0(val) {
            let param = {
                id: val.titleId,
                titleId: val.titleId,
                qnid: this.questionId,
                number: val.titleId ? val.oldSort : this.qnData.datas.length+1,
                title: val.name,
                must: val.must * 1,
                openTip: val.openTip * 1,
                tip: val.openTip ? val.tip : undefined, // 填写提示
                type: val.type,
                orderType: val.orderType * 1,
                img: val.img * 1, // 是否图文样式
                styleType: val.styleType * 1,
                showVote: this.questionType == 1 ?  (val.showVote ? 1 : 0) : 0,
                showPercentage: this.questionType == 1 ?  (val.showPercentage ? 1 : 0) : 0,
                voteNum: this.questionType == 1 ? val.voteNum : val.opts.length
            }
            val.opts.forEach((n, i) => {
                param[`qnChooseItemVMs[${i}].id`] = n.id
                param[`qnChooseItemVMs[${i}].chooseId`] = n.chooseId
                param[`qnChooseItemVMs[${i}].name`] = n.name
                param[`qnChooseItemVMs[${i}].number`] = n.sort * 1; // 选项名称
                param[`qnChooseItemVMs[${i}].choose`] = ''; // 选项顺序
                param[`qnChooseItemVMs[${i}].image`] = n.image;
                param[`qnChooseItemVMs[${i}].exp`] = n.desc;
                param[`qnChooseItemVMs[${i}].text`] = n.arrow * 1
                param[`qnChooseItemVMs[${i}].must`] = n.mast * 1;
            });
            if(param.titleId){
                request('PUT', '/api/qn/qnTitleChoose', param).then(res => {
                    this.successInfo(res, val);
                }).catch(err=>{
                    this.saveLoading = false;
                })
            }else{
                request('POST', '/api/qn/qnTitleChoose', param).then(res => {
                    console.log(123)
                    this.successInfo(res, val);
                }).catch(err=>{
                    console.log(45)
                    this.saveLoading = false;
                })
            }
        },
        add_question1(val){
            this.add_question0(val);
        },
        add_question2(val) {
            let param = {
                id: val.titleId,
                titleId: val.titleId,
                qnid: this.questionId,
                number: val.titleId ? val.oldSort : this.qnData.datas.length+1,
                title: val.name,
                must: val.must * 1,
                openTip: val.openTip * 1,
                tip: val.openTip ? val.tip : undefined,
                type: this.types[this.componentId]
            }

            val.items.forEach((n, i) => {
                param[`qnMatrixItemVMs[${i}].id`] = n.id
                param[`qnMatrixItemVMs[${i}].titleId`] = n.titleId
                param[`qnMatrixItemVMs[${i}].name`] = n.name
                param[`qnMatrixItemVMs[${i}].number`] = i+1;
                param[`qnMatrixItemVMs[${i}].selType`] = val.orderType*1
            });
            val.questions.forEach((n, i) => {
                param[`qnTitleMatrixVMs[${i}].id`] = n.id
                param[`qnTitleMatrixVMs[${i}].titleId`] = n.titleId
                param[`qnTitleMatrixVMs[${i}].subject`] = n.name
                param[`qnTitleMatrixVMs[${i}].number`] = i+1
            });
            if(param.titleId){
                request('PUT', '/api/qn/qnTitleMatrix', param).then(res => {
                    this.successInfo(res, val);
                }).catch(err=>{
                    this.saveLoading = false;
                })
            }else{
                request('POST', '/api/qn/qnTitleMatrix', param).then(res => {
                    this.successInfo(res, val);
                }).catch(err=>{
                    this.saveLoading = false;
                })
            }
        },
        add_question3(val) {
            let param = {
                id: val.titleId,
                titleId: val.titleId,
                qnid: this.questionId,
                number:val.titleId ? val.oldSort : this.qnData.datas.length+1,
                title: val.name,
                must: val.must * 1,
                openTip: val.openTip * 1,
                tip: val.openTip ? val.tip : undefined,
                type: this.types[this.componentId],
                high: val.rows,
                customHigh: val.rowsOther || undefined,
                width: val.width,
                inputType: val.inputType,
                customWidth: val.width == -2 ? val.widthOther : val.width,
                isdefault: val.defaultValue ? 1 : 0,
                islimit: val.ismaxlength ? 1 : 0,
                defaultVal: val.defaultValue ? val.defaultAnswer : undefined,
                lengthType: val.ismaxlength ? val.lengthType : -1,
                minLength: parseFloat(val.min),
                maxLength: parseFloat(val.max)
            }
            if(param.titleId){
                request('PUT', '/api/qn/qnTitleTextarea', param).then(res => {
                    this.successInfo(res, val);
                }).catch(err=>{
                    this.saveLoading = false;
                })
            }else{
                request('POST', '/api/qn/qnTitleTextarea', param).then(res => {
                    this.successInfo(res, val);
                }).catch(err=>{
                    this.saveLoading = false;
                })
            }
        },
        add_question4(val) {
            let param = {
                id: val.titleId,
                titleId: val.titleId,
                qnid: this.questionId,
                number: val.titleId ? val.oldSort : this.qnData.datas.length+1,
                title: val.name,
                must: 0,
                openTip: 0,
                type: this.types[this.componentId],
                paragraphText: val.name
            }
            if(param.titleId){
                request('PUT', '/api/qn/qnTitleParagraph', param).then(res => {
                    this.successInfo(res, val);
                }).catch(err=>{
                    this.saveLoading = false;
                })
            }else{
                request('POST', '/api/qn/qnTitleParagraph', param).then(res => {
                    this.successInfo(res, val);
                }).catch(err=>{
                    this.saveLoading = false;
                })
            }
        },
        add_question5(val) {
            let param = {
                id: val.titleId,
                titleId: val.titleId,
                qnid: this.questionId,
                number: val.titleId ? val.oldSort : this.qnData.datas.length+1,
                title: val.name,
                must: 0,
                openTip: 0,
                type: this.types[this.componentId],
                subject: val.name, 
                pageText: val.name
            }
            if(param.titleId){
                request('PUT', '/api/qn/qnTitlePage', param).then(res => {
                    this.successInfo(res, val);
                }).catch(err=>{
                    this.saveLoading = false;
                })
            }else{
                request('POST', '/api/qn/qnTitlePage', param).then(res => {
                    this.successInfo(res, val);
                }).catch(err=>{
                    this.saveLoading = false;
                })
            }
        },
        add_question6(val) {
            let param = {
                id: val.titleId,
                titleId: val.titleId,
                qnid: this.questionId,
                number: val.titleId ? val.oldSort : this.qnData.datas.length+1, // 题号处理
                title: val.name,
                must: val.must * 1,
                openTip: val.openTip * 1,
                tip: val.openTip ? val.tip : undefined,
                type: this.types[this.componentId]
            }
            val.opts.forEach((n, i) => {
                param[`qnTitleSelectOptionVMs[${i}].titleId`] = n.id
                param[`qnTitleSelectOptionVMs[${i}].name`] = n.name
                param[`qnTitleSelectOptionVMs[${i}].number`] = i + 1;
                param[`qnTitleSelectOptionVMs[${i}].isdefault`] = n.arrow ? 1 : 0;
            });
            if(param.titleId){
                request('PUT', '/api/qn/qnTitleSelect', param).then(res => {
                    this.successInfo(res, val);
                }).catch(err=>{
                    this.saveLoading = false;
                })
            }else{
                request('POST', '/api/qn/qnTitleSelect', param).then(res => {
                    this.successInfo(res, val);
                }).catch(err=>{
                    this.saveLoading = false;
                })
            }
        },
        successInfo(res, val){
            if (res && res.status == 200 && res.data) {
                this.$notify({
                    title: this.$store.state.lang.qn.q133,
                    message: val.code == 'save' ? this.$store.state.lang.message.success : '复制成功！',
                    type: 'success'
                });
                if(val.code == 'save'){
                    this.dialogVisible = false;
                }
                this.getLoginData();
            }
            this.saveLoading = false;
        }
    },
    mounted() {
        this.checkBtn();
    }
}
</script>

<style lang="scss" scoped>
.qn-add-top,
.qn-add-body,
.qn-add-bottom {
    position: absolute;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    background-color: #fff;
}
$top-height: 46px;
$mr-to: 10px;
$bottom-height: 40px;
.qn-add-top {
    top: $mr-to;
    height: $top-height;
    border-bottom: 1px solid #EEEEEE;
    background-color: $--color-primary;
    overflow: hidden;
    color: #fff;
    padding: 5px 10px;
    box-sizing: border-box;
    >li {
        float: left;
        padding: 0 15px;
        line-height: 36px;
        height: 36px;
        cursor: pointer;
        transition: all .2s ease-in;
        &:not(:last-child) {
            border-right: 2px solid #fff;
        }
        >span {
            padding: 0 5px;
        }
        &.select {
            border-bottom: 2px solid #fff;
        }
        &:hover {
            opacity: .8;
            transform: scale(1.1);
        }
    }
    i.fa{
        font-size: 16px;
    }
    .el-dropdown{
        span{
            color: #fff;
        }
    }
}
.qn-add-body {
    top: $mr-to + $top-height;
    bottom: $bottom-height;
    background-color: #fff;
    overflow: auto;
    .qn-add-title{
        text-align: center;
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;
        >h2 {
            margin: 0;
            line-height: 36px;
            height: 36px;
            box-sizing: border-box;
            border-bottom: 1px solid transparent;
            &:focus {
                outline: none;
                border-bottom-color: #333;
            }
        }
        >p {
            line-height: 22px;
        }
    }
    >h4 {
        min-height: 22px;
        line-height: 22px;
        padding: 0 10px;
        background-color: #fff;
        margin: 0;
        box-sizing: border-box;
        border-bottom: 1px dashed #cccccc;
        font-weight: normal;
    }
    >ul{
        padding: 10px;
        >li{
            border: 1px dotted transparent;
            box-sizing: border-box;
            position: relative;
            div.qn-opts-btn{
                visibility: hidden;
                position: absolute;
                right: 0;
                top: 0;
                z-index: 10;
            }
            &:hover{
                border-color:#cccccc;
                div.qn-opts-btn{
                    visibility: visible;
                }
            }
        }
    }
}
.qn-add-bottom {
    bottom: 0;
    height: $bottom-height;
    line-height: $bottom-height;
    text-align: center;
}

.qn-add-btns {
    position: absolute;
    right: -45px;
    bottom: 15px;
    >div {
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        color: #fff;
        background-color: #3B5616;
        cursor: pointer;
        &:hover {
            opacity: .8;
        }
    }
}
</style>