<template>
    <div class="sy-app-container sy-qn-bg" v-loading="pageLoading">
        <div class="sy-qn-details-container qn-title-view-box">
            <div class="qn-creat-container" style="padding-bottom:40px;">
                <div class="sy-qn-details-header no-position sy-theme-border">
                    <ul class="sy-theme-lightBackground">
                        <li class="img">
                            <qn></qn>
                        </li>
                        <li class="title">{{qnData.name}}
                        </li>
                        <li>
                            <span>{{$store.state.lang.qn.q3}}{{qnData.createName}}</span>
                            <span>{{$store.state.lang.qn.q4}}{{qnData.unitName}}</span>
                            <span>{{$store.state.lang.qn.q5}}{{qnData.beginDate}} {{qnData.beginTime}} {{$store.state.lang.qn.b62}} {{qnData.endDate}} {{qnData.endTime}}</span>
                            <span>
                                <span v-if="qnData.status == 1">{{$store.state.lang.qn.q7}}</span>
                                <span v-if="qnData.status == 2">{{$store.state.lang.qn.q8}}</span>
                                <stime v-if="qnData.status == 1 || qnData.status == 2" :data="qnData"></stime>
                                <span v-if="qnData.status == 4 || qnData.status == 3">{{$store.state.lang.qn.q9}}</span>
                                <span v-if="qnData.status == 4 || qnData.status == 3">{{qnData.endDate + ' ' + qnData.endTime}}</span>
                            </span>
                        </li>
                    </ul>
                </div>
                <ul>
                    <li v-for="row in qnData.datas" :key="row.id">
                        <component :is="row.componentId" :data="row" :num="row.sort" show 
                            :questionType="qnData.type"
                            :isHiddenTip="isHiddenTip"
                            readonly
                            :start="row.startNum" :totles="row.totles"></component>
                    </li>
                </ul>
            </div>
            
            <div class="qn-do-btn">
                <el-button @click="handleBackHome">{{$store.state.lang.button.back}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import components from "../ques/index.js";
import formats from './details.js';
import stime from "../home/time.vue";
export default {
    components: {stime, ...components},
    mixins: [formats],
    data() {
        return {
            saveLoading: false,
            optTextDialog: false,
            pageLoading: false,
            realName: null,
            qnData: {
                datas: []
            },
            finishedNum: 0,
            infosDialog: false,
            timeLost: 5,
            isInit: false,
            intNum: 0,
            questionType: this.$route.query.type,
            isHiddenTip: false
        }
    },
    created(){
        this.init();
    },
    methods: {
        init(){
            /**
             * 1. 此页面为实名问卷详情页，查询提交结果
             * 2. _getTiletDetails（ ） 第二个参数为 query
             */
            if(this.$route.query.id){
                this.getLoginData();
            }
        },
        getLoginData(){
            this.pageLoading = true;
            this._getTiletDetails(this.$route.query.id, 'query').then(res=>{
                this.qnData = res;
                this.isHiddenTip = this.qnData.datas.filter(o=>{
                    return o.type == 0 || o.type == 1 || o.type == 2 || o.type == 3 || o.type == 6
                }).length > 1 ;
                this.pageLoading = false;
                this.isInit = true;
            }).catch(err=>{
                this.pageLoading = false;
            })
        },
        //  查询问卷信息
        queryQuestionInfo(copy) {
            let query = {
                qnid: this.$route.query.qnid,
                realName: this.$route.query.realName,
                type: this.$route.query.type,
                tp: this.$route.query.tp,
            }
            if(copy){
                this.$router.push({ path: '/qn/manager/preview',
                    query: {
                        copyid: copy,
                        edt: 1,
                        ...query
                    }
                })
            }else{
                this.$router.push({
                    path: '/qn/manager/addqn',
                    query: query
                })
            }
        },
        handleJumper(t){
            this._getTiletDetails(this.$route.query.qnid).then(res=>{
                if(res.datas.length){
                    this.$confirm(this.$store.state.lang.qn.q127, this.$store.state.lang.message.info, {
                        confirmButtonText: this.$store.state.lang.button.ok,
                        cancelButtonText: this.$store.state.lang.qn.q126,
                        type: 'warning',
                        showClose: false,
                        closeOnClickModal: false
                    }).then(() => {
                        this.saveCopy(t)
                    }).catch(() => {
                        this.queryQuestionInfo(false);
                    });
                }else{
                    this.saveCopy(t)
                }
            }).catch(err=>{
            })
        },
        saveCopy(t){
            this.saveLoading = true;
            request('get', '/api/qn/qnTitle/copy', {
                fromQid: this.$route.query.copyid,
                toQid: this.$route.query.qnid
            }).then(res=>{
                this.$router.push({path: t  == 2.5 ? '/qn/manager/addqn' : '/qn/manager/add', query: {
                    step: t  == 2.5 ? 2 : 3,
                    qnid: this.$route.query.qnid,
                    realName: this.$route.query.realName,
                    type:this.$route.query.type,
                    tp: this.$route.query.tp
                }});
                this.saveLoading = false;
            }).catch(err => {
                this.saveLoading = false;
            })
        },
    }
}
</script>