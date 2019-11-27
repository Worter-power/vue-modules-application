<template>
    <div class="sy-home-body sy-qn" v-loading="pageLoading">
        <div class="sy-qn-details-header sy-theme-border">
            <ul class="sy-theme-lightBackground">
                <li class="title"> {{qnData.name}}
                    <el-button style="float:right;margin:8px;" type="text" :title="$store.state.lang.qn.b55" ><i class="fa fa-download" aria-hidden="true" @click="pdfDown"></i></el-button>
                </li>
                <li>
                    <span>{{$store.state.lang.qn.q3}}{{qnData.createName}}</span>
                    <span>{{$store.state.lang.qn.q4}}{{qnData.unitName}}</span>
                    <span>{{$store.state.lang.qn.q5}}{{qnData.beginDate}} {{qnData.beginTime}} {{$store.state.lang.qn.b62}} {{qnData.endDate}} {{qnData.endTime}}</span>
                </li>
            </ul>
        </div>
        <div class="sy-qn-details-body sy-qn-bg">
            <el-grader header-h="50px" style="background: white;">
                <div slot="bodyRight">
                    <div class="qn-creat-container">
                        <ul>
                            <li v-for="row in qnData.datas" :key="row.id">
                                <component :is="row.componentId" :data="row" :num="row.sort" show 
                                    :questionType="questionType"
                                    :start="row.startNum" :totles="row.totles"></component>
                            </li>
                        </ul>
                    </div>
                </div>
                <div slot="footer" style="text-align: center;">
                    <el-button @click="$router.go(-1)">{{$store.state.lang.button.back}}</el-button>
                    <el-button v-if="$route.query.edt == 1" :loading="saveLoading" @click="handleJumper(2.5)">{{$store.state.lang.button.edit}}</el-button>
                    <el-button v-if="$route.query.edt == 1" :loading="saveLoading" @click="handleJumper(3)">{{$store.state.lang.qn.q124}}</el-button>
                </div>
            </el-grader>
        </div>
    </div>
</template>

<script>
import components from "../../ques/index.js";
import formats from '../../details/details.js';
export default {
    components: components,
    mixins: [formats],
    data() {
        return {
            saveLoading: false,
            optTextDialog: false,
            pageLoading: false,
            realName: null,
            qnData: {
                tableData: []
            },
            finishedNum: 0,
            infosDialog: false,
            timeLost: 5,
            isInit: false,
            intNum: 0,
            questionType: this.$route.query.type
        }
    },
    created(){
        this.init();
    },
    methods: {
        init(){
            if(this.$route.query.copyid){
                this.getLoginData();
            }
        },
        getLoginData(){
            this.pageLoading = true;
            this._getTiletDetails(this.$route.query.copyid).then(res=>{
                console.log(res)
                this.qnData = res;
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
        // PDF下载
        pdfDown() {
            this.$downloade('/api/qn/qn_title/exportPDF','POST',{qnId: this.$route.query.copyid})
        }
    }
}
</script>