<template>
    <el-grader style="overflow: hidden;" :border="false" v-loading="saveLoading" :element-loading-text="$store.state.lang.qn.q101">
        <div slot="headerRight" style="padding-top: 8px;">
            <span>{{$store.state.lang.qn.q57}}</span>
            <el-input v-model="keywords" :placeholder="$store.state.lang.qn.q56" style="width: 180px;">
                <i slot="suffix" class="el-input__icon cp el-icon-search" @click="handleSelectCopy"></i>
            </el-input>
        </div>
        <div slot="bodyRight" v-loading="copyLoading">
            <el-grader style="overflow: hidden;" :border="false">
                <div slot="bodyRight" style="padding: 10px;">
                    <el-table :data="tableData" border style="width: 100%; height: 100%;" height="100%">
                        <el-table-column :label="$store.state.lang.qn[questionType == 0 ? 'q110' : 'b46' ]" align="left" width="">
                            <el-table-column prop="ip" label="" align="right" width="60">
                                <template slot-scope="scope">
                                    <el-radio class="radio" v-model="questionRadio" :label="scope.row.id">&nbsp;</el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column prop="number" :label="$store.state.lang.qn.q59" align="center" width="60">
                                <template slot-scope="scope">
                                    {{(currentPage-1)*pageSize+(scope.$index+1)}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" :label="$store.state.lang.qn[questionType == 0 ? 'q60' : 'b34' ]" align="left" header-align="center" width=""></el-table-column>
                            <el-table-column prop="status" :label="$store.state.lang.qn.q64" align="center" width="140">
                                <template slot-scope="scope">
                                    <el-button type="text"  @click="queryQuestionInfo(scope.row.id)">
                                        <i class="fa fa-file-text-o" :title="$store.state.lang.qn.q111" aria-hidden="true"></i>
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table>
                </div>
                <div slot="footer">
                    <span>{{$store.state.lang.qn.q112}} </span> &nbsp;&nbsp;
                    <el-button   @click="queryQuestionInfo(false)">{{$store.state.lang.qn.q113}}</el-button>
                    <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
                        :page-size="pageSize" style="float:right;" layout="total, prev, pager, next" :total="total">
                    </el-pagination>
                </div>
            </el-grader>
        </div>
        <div slot="footer" class="center">
            <el-button @click="handleBack" >{{$store.state.lang.button.cancel}}</el-button>
            <el-button  @click="handlePrestep(2)">{{$store.state.lang.qn.q123}}</el-button>
            <el-button  :loading="saveLoading" @click="submitData">{{$store.state.lang.qn.q124}}</el-button>
        </div>
    </el-grader>
</template>

<script>
import methods from './methods.js';
export default {
    mixins: [methods],
    data(){
        return {
            keywords: '',
            tableData: [],
            pageSize: 20,
            currentPage: 1,
            total: 0,
            questionRadio: '',
            copyLoading: false
        }
    },
    created(){
        this.init();
    },
    methods: {
        init(){
            // 查询可复制问卷列表
            this.queryCanCopyInfoList();
        },
        //  查询可以复制的问卷信息列表
        queryCanCopyInfoList() {
            let param = {
                keywords: this.keywords,
                start: this.currentPage,
                size: this.pageSize,
                type: this.$route.query.type
            }
            this.copyLoading = true;
            request('get', '/api/qn/qnQuestionnaire/copyList', param).then((res)=>{
                if(res.status == 200 && res.code == 'ok'){
                    this.tableData = res.data.list || [];
                    this.total = res.data.total;
                }
                this.copyLoading = false;
            }).catch(err=>{
                this.copyLoading = false;
            })
        },
        // 关键词筛选
        handleSelectCopy(){
            this.currentPage = 1;
            this.total = 0;
            this.queryCanCopyInfoList();
        },
        // 分页切换
        handleCurrentChange(val) {
            this.tableData = [];
            this.currentPage = val;
            this.queryCanCopyInfoList();
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
        // 保存并下一步
        submitData(){
            /**
             * 1. if(this.$route.query.tp == '2') 如果是修改，直接进入编辑页面
             */
            if(this.$route.query.tp == '2'){
                request('get', '/api/qn/qnTitle/preview', { qid: this.$route.query.qnid }).then((res)=>{
                    if(res.data && res.data.qnTitleListVM && res.data.qnTitleListVM.qnTitleVMs.length > 0){
                        if(this.questionRadio){
                            this.$confirm(this.$store.state.lang.qn.q127, this.$store.state.lang.message.info, {
                                confirmButtonText: this.$store.state.lang.button.ok,
                                cancelButtonText: this.$store.state.lang.qn.q126,
                                type: 'warning',
                                showClose: false,
                                closeOnClickModal: false
                            }).then(() => {
                                this.saveCopy().then((res)=>{
                                    // 跳转创建页面
                                    this.queryQuestionInfo(false);
                                })
                            }).catch(() => {
                                // 跳转创建页面
                                this.queryQuestionInfo(false);
                            });
                        }else{
                            // 跳转创建页面
                            this.queryQuestionInfo(false);
                        }
                    }else{
                        if(this.questionRadio){
                            this.saveCopy().then((res)=>{
                                // 跳转创建页面
                                this.queryQuestionInfo(false);
                            })
                        }else{
                            this.$notify({
                                title: this.$store.state.lang.qn.q29,
                                message: this.$store.state.lang.qn[this.questionType == 0 ? 'q128' : 'b48'],
                                type: 'warning'
                            });
                        }
                    }
                }).catch(err=>{

                })
            }else{
                if(this.questionRadio){
                    this.saveCopy().then((res)=>{
                        // 跳转创建页面
                        this.queryQuestionInfo(false);
                    })
                }else{
                    this.$notify({
                        title: this.$store.state.lang.qn.q29,
                        message: this.$store.state.lang.qn[this.questionType == 0 ? 'q128' : 'b48'],
                        type: 'warning'
                    });
                }
            }
        },
        // 保存拷贝问卷信息
        saveCopy(){
            return new Promise((resove, reject)=>{
                this.saveLoading = true;
                request('get', '/api/qn/qnTitle/copy', {
                    fromQid: this.questionRadio,
                    toQid: this.$route.query.qnid
                }).then(res=>{
                    if(res.status == 200){
                        resove()
                    }else{
                        reject();
                    }
                    this.saveLoading = false;
                }).catch(err => {
                    reject();
                    this.saveLoading = false;
                })
            })
            
        },
    }
}
</script>