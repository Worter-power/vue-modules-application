<template>
    <div class="sy-app-container">
        <el-grader :border="false">
            <div slot="headerRight" style="padding-top: 8px;">
                <el-select v-if="$store.state.unitType == 2" 
                    v-model="paramsList.yearValue" 
                    :placeholder="$store.state.lang.qn.q53" 
                    style="width: 120px;margin: 0 10px 0 0;"
                    @change="getUnitSchoolList">
                    <el-option v-for="item in yearValueOptions" 
                        :key="item.year" 
                        :label="item.year" 
                        :value="item.year">
                    </el-option>
                </el-select>
                <el-select v-if="$store.state.unitType == 2" 
                    v-model="paramsList.termValue" 
                    :placeholder="$store.state.lang.qn.q54"  
                    style="width: 120px;"
                    @change="handleYearTermChagne">
                    <el-option v-for="item in termValueOptions" 
                        :key="item.schoolTerm" 
                        :label="$store.state.lang.qn.term[item.schoolTerm+''] || item.name" 
                        :value="item.schoolTerm">
                    </el-option>
                </el-select>
                <el-select v-model="paramsList.status" 
                    :placeholder="$store.state.lang.qn.q55" 
                    style="width: 120px;margin: 0 10px;" 
                    @change="handleYearTermChagne">
                    <el-option v-for="item in statusOptions" 
                        :key="item.value" 
                        :label="item.value === '' ? $store.state.lang.qn.state.all : ($store.state.lang.qn.state[item.value+''] || item.label)" 
                        :value="item.value">
                    </el-option>
                </el-select>
                <span>{{$store.state.lang.qn.q57}}</span>
                <el-input v-model="paramsList.keywords"
                    :placeholder="$store.state.lang.qn.q56" style="width: 120px;"></el-input>
                <el-button @click="handleYearTermChagne"  >{{$store.state.lang.qn.q80}}</el-button>
                <el-button @click="handleClickAdd"  style="float: right;" >
                    <!-- {{questionType == 0 ? $store.state.lang.qn.q58 : $store.state.lang.qn.b33}} -->
                    {{$store.state.lang.qn[questionType == 0 ? 'q58' : 'b33']}}
                </el-button>
            </div>
            <div slot="bodyRight" style="padding: 0 10px 0;">
                <el-table :data="tableData" border style="width: 100%; height: 100%;" height="100%" v-loading="loading">
                    <el-table-column :label="$store.state.lang.qn.q59" align="center" width="50">
                        <template slot-scope="scope">
                            {{(currentPage-1)*pageSize+(scope.$index+1)}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="name" 
                        :label="questionType == 0 ? $store.state.lang.qn.q60 : $store.state.lang.qn.b34" align="left" header-align="center" width="">
                        <template slot-scope="scope">
                            <el-button @click="handleSeeDetails(scope.row)" type="text">{{scope.row.name}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$store.state.lang.qn.q61" align="center" width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.createDate}}&nbsp;&nbsp;{{scope.row.createTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :render-header="handleRenderHeader" align="center" :width="$store.state.langType == 'en' ? '365' : '330'">
                        <template slot-scope="scope">
                            <el-row>
                                <el-col :span="12" style="line-height: 20px;">
                                    <p>{{scope.row.beginDate}}&nbsp;&nbsp;{{scope.row.beginTime}}</p>
                                    <p>{{scope.row.endDate}}&nbsp;&nbsp;{{scope.row.endTime}}</p>
                                </el-col>
                                <el-col :span="12" style="line-height: 40px;color: #F56C6C;">
                                    <p>({{scope.row.times}})</p>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" :label="$store.state.lang.qn.q62" align="center" width="70">
                        <template slot-scope="scope">
                            {{$store.state.lang.qn.state[scope.row.status+'']}}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="questionType == 0" prop="pass" :label="$store.state.lang.qn.q63" align="center" width="135">
                        <template slot-scope="scope">
                            <el-button  style="margin: 0 3px;" v-if="scope.row.status!=0 && scope.row.status!=2" 
                                @click="handleSee(scope.row)" type="text" >{{$store.state.lang.qn.q65}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column v-else prop="pass" :label="$store.state.lang.qn.b35" align="center" width="135">
                        <template slot-scope="scope">
                            <el-button style="margin: 0 3px;" v-if="scope.row.status!=0 && scope.row.status!=2 && scope.row.realName == 1" 
                                @click="handleSee(scope.row)" type="text" >{{$store.state.lang.qn.q65}}
                            </el-button>
                            <span v-if="scope.row.realName == 0 && scope.row.status!=0">
                                {{scope.row.resultNum}}/{{scope.row.joinVoteNum}}  
                            </span> 
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" :label="$store.state.lang.qn.q64" align="center" width="160">
                        <template slot-scope="scope">
                            <el-button style="margin: 0 3px;" @click="handleShare(scope.row)" type="text" 
                                v-if="scope.row.status==1||scope.row.status==2">{{$store.state.lang.qn.q66}}</el-button>
                            <el-button style="margin: 0 3px;" @click="handleEnd(scope.row)" type="text" 
                                v-if="scope.row.status==1">{{$store.state.lang.qn.q67}}</el-button>
                            <el-button style="margin: 0 3px;" @click="handleAddTime(scope.row)" type="text" 
                                v-if="scope.row.status==1">{{$store.state.lang.qn.q68}}</el-button>
                            <el-button style="margin: 0 3px;" @click="handleChangeBtn(scope.row)" type="text" 
                                v-if="scope.row.status==0">{{$store.state.lang.qn.q69}}</el-button>
                            <el-button style="margin: 0 3px;"  @click="handleCopy(scope.row)" type="text" 
                                v-if="scope.row.status != 0 && scope.row.status != 1">{{$store.state.lang.qn.q70}}</el-button>
                            <el-button style="margin: 0 3px;" @click="handleChangeBtn(scope.row)" type="text" 
                                v-if="scope.row.status==2">{{$store.state.lang.button.update}}</el-button>
                            <el-button style="margin: 0 3px;" @click="handleReportForm(scope.row)" type="text" 
                                v-if="scope.row.status==3||scope.row.status==4">{{$store.state.lang.qn.q71}}</el-button>
                            <el-button style="margin: 0 3px;" @click="handleDelete(scope.row)" type="text" 
                                v-if="scope.row.status!=1">{{$store.state.lang.button.delete}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
                    layout="total, prev, pager, next" :total="total" class="pagination-mf">
                </el-pagination>
            </div>
        </el-grader>
        <!-- 延长 -->
        <el-dialog2 :title="$store.state.lang.qn.q72" height="250px" width="450px" slide="fade" :visible.sync="addtimesDialog">
            <div slot="body" style="padding:10px 20px;">
                <el-form :model="form" ref="form" label-width="150px" style="text-align: center;padding-top: 56px;">
                    <el-form-item prop="start" :label="$store.state.lang.qn.q73">
                        <el-date-picker type="datetime" clearable :editable="false" :placeholder="$store.state.lang.qn.q74" v-model="newEndTime"
                            :picker-options="pickerOptions" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button style="margin: 0 3px;" @click="addtimesDialog = false"  >{{$store.state.lang.button.cancel}}</el-button>
                <el-button style="margin: 0 3px;" @click="handleSave"  >{{$store.state.lang.qn.q75}}</el-button>
            </div>
        </el-dialog2>
        <!-- 查看当前进度 -->
        <el-dialog2 :title="$store.state.lang.qn[questionType == 0 ? 'q76' : 'b50']" height="400px" width="500px" slide="fade" :visible.sync="seeeDialog">
            <div slot="body" style="padding: 10px;">
                <el-table :data="prossTableData" border style="width: 100%; height: 100%;" height="100%" v-loading="loading">
                    <el-table-column :label="$store.state.lang.qn.q77" prop="unitName" align="center" width=""></el-table-column>
                    <el-table-column prop="pass" :label="$store.state.lang.qn.q63" align="center" width="150">
                        <template slot-scope="scope">
                            <el-progress style="width: 100%;" 
                                :percentage="scope.row.proportion ? parseFloat(scope.row.proportion) : 0">
                            </el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$store.state.lang.qn[questionType ==0 ? 'q78' : 'b35']" align="center" width="100">
                        <template slot-scope="scope">
                            <span v-if="questionType == 0">{{scope.row.minNum}}/{{scope.row.maxNum}}</span>
                            <span v-else>{{scope.row.minNum}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button style="margin: 0 3px;" @click="seeeDialog = false"  >{{$store.state.lang.button.close}}</el-button>
            </div>
        </el-dialog2>
        <!-- 分享到 -->
        <el-dialog2 :title="$store.state.lang.qn.q79" height="600px" width="850px" slide="fade" :visible.sync="shareDialog">
            <div slot="body">
                <el-grader>
                    <div slot="headerRight" style="padding-top: 8px;">
                        <span>{{$store.state.lang.qn.q57}}</span>
                        <el-input v-model="keywords" :placeholder="$store.state.lang.qn.q56" style="width: 120px;margin: 0 10px;"></el-input>
                        <el-button @click="handleSeacher"  >{{$store.state.lang.qn.q80}}</el-button>
                        <!-- <el-button @click="handleImportWORED" type="text"  style="float: right;">一键导出WORD文档</el-button> -->
                    </div>
                    <div slot="bodyRight" style="overflow: auto;">
                        <ul class="qn-manger-home-list-code">
                            <li v-for="(item,index) in codeData" :key="item.key">
                                <div class="sy-theme-border">
                                    <div class="qn_share_img">
                                        <el-popover
                                            effect="light" 
                                            placement="right"
                                            class="code_img"
                                            popper-class="code_img"
                                            trigger="hover">
                                            <img :src="item.code" alt="" width="200" height="200">
                                            <img slot="reference" :src="item.code" alt="" width="120" height="120">
                                        </el-popover>
                                    </div>
                                    <div class="qn_share_right">
                                        <p style="color: #3C5617;font-size: 14px;" class="sy-theme-text" 
                                            :title="item.value+$store.state.lang.qn.q81">{{item.value}}{{$store.state.lang.qn.q81}}</p>
                                        <input type="text" readonly :ref="'url_'+index" v-model="item.url">
                                        <el-button style="margin: 0 3px;" @click="copyUrl2(item.url, 'url_'+index)"
                                             >{{$store.state.lang.qn.q70}}</el-button>
                                        <div :class="[item.className]" class="iShare iShare-24"></div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-grader>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button style="margin: 0 3px;" @click="shareDialog = false"  >{{$store.state.lang.button.close}}</el-button>
            </div>
        </el-dialog2>
        <!-- 复制 -->
        <el-dialog2 :title="$store.state.lang.qn[questionType == 0 ? 'q82' : 'b36']" height="auto" width="550px" slide="fade" :visible.sync="copyDialog">
            <div slot="body" style="padding:25px 20px;">
                <el-form :model="ruleForm" ref="ruleForm" 
                    :label-width="$store.state.langType == 'en' ? '150px' : '100px'" :rules="rules">
                    <el-form-item :label="$store.state.lang.qn[questionType == 0 ? 'q83' : 'b37']" prop="name" style="margin-bottom: 20px;">
                        <el-input v-model="ruleForm.name" :maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item :label="$store.state.lang.qn.q84" required style="margin-bottom: 20px;">
                        <el-col :span="11">
                            <el-form-item style="margin-bottom: 0;" prop="date1">
                                <el-date-picker type="datetime" :placeholder="$store.state.lang.qn.q74" :clearable="false" v-model="ruleForm.date1" style="width: 100%;"
                                    :picker-options="pickerOptions0" :editable="false"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col class="center" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-form-item style="margin-bottom: 0;" prop="date2">
                                <el-date-picker type="datetime" :placeholder="$store.state.lang.qn.q74" :clearable="false" v-model="ruleForm.date2" style="width: 100%;"
                                    :picker-options="pickerOptions1" :editable="false"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button style="margin: 0 3px;" @click="copyDialog = false"  >{{$store.state.lang.button.cancel}}</el-button>
                <el-button style="margin: 0 3px;" @click="handleCopySubmit"  >{{$store.state.lang.qn.q70}}</el-button>
            </div>
        </el-dialog2>
    </div>
</template>

<script>
    import {
        queryQuestionInfoList,
        deleteQuestInfo,
        getYearsInfo,
        getUnitSchoolList,
        copyQuestion
    } from "../request.js";
    import QRCode from "qrcode";
    export default {
        watch: {
            $route(val,oldval){
                this.questionType = val.path == '/qn/manager/pages/home' ? 0 : 1;
                this.currentPage = 1;
                this.queryQuestionInfoList();
            },
            'ruleForm.date1': function(newVla,oldVal){
                if(newVla) {
                    this.pickerOptions1= {
                        disabledDate(time) {
                            return time.getTime() < newVla.getTime();
                        }
                    };
                }
         
            },
            'ruleForm.date2': function(newVla,oldVal){
                if(newVla) {
                    this.pickerOptions0= {
                        disabledDate(time) {
                            return time.getTime() < Date.now() - 8.64e7 || time.getTime() > newVla.getTime();
                        }
                    };
                }
            }
        },
        data() {
            return {
                copyDialog: false,
                ruleForm: {
                    id: '',
                    name: "",
                    date1: '',
                    date2: ''
                },
                rules: {
                    name: [
                        { required: true, message: this.$store.state.lang.qn.q85, trigger: "blur" },
                        { min: 3, max: 50, message: this.$store.state.lang.qn.q86, trigger: "blur" }
                    ],
                    date1: [
                        { type: 'date', required: true, message: this.$store.state.lang.qn.q87, trigger: 'change' }
                    ],
                    date2: [
                        { type: 'date', required: true, message: this.$store.state.lang.qn.q88, trigger: 'change' }
                    ],
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                currentQnItem: {},
                oldEndTime: "",
                newEndTime: "",
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                unitId: this.$store.state.unitId,
                loading: false,
                paramsList: {
                    keywords: "",
                    yearValue: "",
                    termValue: "",
                    status: ""
                },
                yearValueOptions: [],
                termValueOptions: [],
                statusOptions: [{
                        value: "",
                        label: "全部状态"
                    },
                    {
                        value: "0",
                        label: "创建中"
                    },
                    {
                        value: "1",
                        label: "进行中"
                    },
                    {
                        value: "2",
                        label: "即将开始"
                    },
                    {
                        value: "3",
                        label: "手动终止"
                    },
                    {
                        value: "4",
                        label: "已结束"
                    }
                ],
                tableData: [],
                addtimesDialog: false,
                form: {
                    time: ""
                },
                shareDialog: false,
                keywords: "",
                currentRow: {},
                shareTableData: [],
                currentPage: 1,
                pageSize: this.$store.state.pageSize,
                total: 0,
                codeData: [],
                seeeDialog: false,
                currentprogress: 0,
                prossTableData: [],
                questionType: 0
            };
        },
        created() {
            this.questionType = this.$route.path == '/qn/manager/pages/home' ? 0 : 1;
            this.$parent.$emit("currentPage", this.$route.path);
            if(this.$store.state.unitType == 2){
                this.getYearsInfo();
            }else{
                this.queryQuestionInfoList();
            }
        },
        methods: {
            // 学年数据获取
            getYearsInfo() {
                this.paramsList.yearValue = "";
                getYearsInfo({
                    unitId: this.unitId
                }).then(res => {
                    if (res && res.status == 200) {
                        if(res.data){
                            this.yearValueOptions = res.data;
                            if (this.yearValueOptions && this.yearValueOptions.length > 0) {
                                for (let i = 0; i < this.yearValueOptions.length; i++) {
                                    if (this.yearValueOptions[i].current == true) {
                                        this.paramsList.yearValue = this.yearValueOptions[i].year;
                                    }
                                }
                            }
                        }else{
                            this.queryQuestionInfoList();
                        }
                    }
                });
            },
            // 学期数据获取
            getUnitSchoolList() {
                this.paramsList.termValue = "";
                getUnitSchoolList({
                    unitId: this.unitId,
                    year: this.paramsList.yearValue
                }).then(res => {
                    if (res && res.status == 200) {
                        this.termValueOptions = res.data;
                        for (let i = 0; i < this.termValueOptions.length; i++) {
                            if (this.termValueOptions[i].current == 1) {
                                this.paramsList.termValue = this.termValueOptions[i].schoolTerm;
                            }
                        }
                        this.paramsList.termValue = !this.paramsList.termValue ?
                            this.termValueOptions[0].schoolTerm :
                            this.paramsList.termValue;
                    }
                });
            },
            statusName(status) {
                for (let index = 0; index < this.statusOptions.length; index++) {
                    const element = this.statusOptions[index];
                    if (element.value == status) {
                        return element.label;
                    }
                }
            },
            handleRenderHeader(h, column) {
                return h("span", [h("p", this.$store.state.lang.qn.q89), h("p", this.$store.state.lang.qn.q90)]);
            },
            handleClickAdd() {
                this.$router.push({path: "/qn/manager/add", query: {type: this.questionType}});
            },
            handleSee(row){
                this.seeeDialog = true;
                request("get", "/api/qn/qnQuestionnaire/progress", {
                    qnId: row.id
                }).then(res => {
                    if (res && res.status == 200) {
                       this.prossTableData = res.data;
                    }
                });
            },
            handleShare(row) {
                this.shareDialog = true;
                this.currentRow = row;
                this.getSharedList();
            },
            handleSeacher() {
                this.getSharedList();
            },
            getSharedList(){
                request("get", "/api/qn/qnQuestionnaire/userShare_unitIds", {
                    qnId: this.currentRow.id,
                    keyWords: this.keywords
                }).then(res => {
                    if (res && res.status == 200) {
                        let arr = [];
                        res.data.forEach((_s, s) => {
                            let url =
                                location.origin + "/qn/wj?id=" + this.currentRow.id + "&unitid=" + _s.key;
                            _s.id = this.currentRow.id;
                            _s.code = this.toOutStock(url);
                            _s.url = url;
                            _s.className = `ishares_${s}`
                            arr.push(_s);
                        });
                        this.codeData = arr;
                        this.$nextTick((res)=>{
                            this.initShare();
                        })
                    }
                });
            },
			initShare() {
                let _this = this;
                this.codeData.forEach((_s,s)=>{
                    new iShare({
                        container: `.${_s.className}`,
                        config: {
                            title: _s.value,
                            description: '',
                            url: _s.url,
                            isAbroad: false,
                            isTitle: true,
                            initialized: true,
                            sites: [
                                "iShare_qq",
                                "iShare_weibo",
                                "iShare_qzone"
                            ],
                            WXoptions: {
                                evenType: "click",
                                isTitleVisibility: true,
                                title: _s.value,
                                isTipVisibility: true,
                                tip: _s.value,
                                qrcodeW: 140,
                                qrcodeH: 140,
                                qrcodeBgc: "#fff",
                                qrcodeFgc: "#000",
                                bgcolor: "#2BAD13"
                            }
                        }
                    });
                })
				
			},
            toOutStock(url) {
                let outCode = "";
                QRCode.toDataURL(url, (err, url) => {
                    outCode = url;
                });
                return outCode;
            },
            copyUrl2(url, ref) {
                this.$message({
                    message: this.$store.state.lang.qn.q91,
                    type: "success"
                });
                let Url2 = this.$refs[ref] ? this.$refs[ref][0] : null;
                if (Url2) {
                    Url2.select();
                    document.execCommand("Copy");
                }
            },
            handleImportWORED() {},
            handleEnd(row) {
                this.$confirm(this.$store.state.lang.qn.q92, this.$store.state.lang.message.info, {
                        cancelButtonText: this.$store.state.lang.button.ok,
                        cancelButtonText: this.$store.state.lang.button.cancel,
                        type: "warning"
                    })
                    .then(() => {
                        request("get", "/api/qn/qnQuestionnaire/changeStatus", {
                            qnId: row.id,
                            status: 3
                        }).then(res => {
                            if (res && res.status == 200 && res.data == "success") {
                                this.$notify({
                                    title: this.$store.state.lang.message.success,
                                    message: this.$store.state.lang.qn.q93,
                                    type: "success"
                                });
                                this.queryQuestionInfoList();
                            }
                        });
                    })
                    .catch(() => {});
            },
            handleAddTime(row) {
                let oldEndTime = "";
                if (row.endDate && row.endTime) {
                    oldEndTime = this.$moment(row.endDate + " " + row.endTime).valueOf();
                } else {
                    oldEndTime = Date.now();
                }
                this.pickerOptions = {
                    disabledDate(time) {
                        return time.getTime() < oldEndTime;
                    }
                };
                this.addtimesDialog = true;
                this.currentQnItem = this.$_.cloneDeep(row);
            },
            handleSave() {
                if(!this.newEndTime){
                    this.$notify({
                        title: this.$store.state.lang.message.info,
                        message: this.$store.state.lang.qn.b100,
                        type: "warning"
                    });    
                    return
                }
                request("get", "/api/qn/qnQuestionnaire/changeDate", {
                    qnId: this.currentQnItem.id,
                    date: moment(this.newEndTime).format("YYYY-MM-DD"),
                    time: moment(this.newEndTime).format("HH:mm:ss")
                }).then(res => {
                    if (res && res.status == 200 && res.data == "success") {
                        this.addtimesDialog = false;
                        this.queryQuestionInfoList();
                        this.$notify({
                            title: this.$store.state.lang.message.info,
                            message: this.$store.state.lang.message.success,
                            type: "success"
                        });
                    }
                });
                 
            },
            handleCopy(row) {
                this.$refs.ruleForm.resetFields();
                this.pickerOptions0 = {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                this.pickerOptions1 = {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                this.ruleForm.name = row.name+ this.$store.state.lang.qn.q94;
                this.ruleForm.id = row.id;
                this.copyDialog = true;
            },
            handleCopySubmit(){
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        copyQuestion({
                            oldQnId: this.ruleForm.id,
                            newName: this.ruleForm.name,
                            beginDate: this.$moment(this.ruleForm.date1).format('YYYY-MM-DD'),
                            beginTime: this.$moment(this.ruleForm.date1).format('HH:mm:ss'),
                            endDate: this.$moment(this.ruleForm.date2).format('YYYY-MM-DD'),
                            endTime: this.$moment(this.ruleForm.date2).format('HH:mm:ss')
                        }).then(res => {
                            // console.log(res);
                            if(res.status == 200){
                                this.$notify({
                                    title: this.$store.state.lang.message.success,
                                    message: this.$store.state.lang.qn.q91,
                                    type: "success",
                                    offset: 21
                                });
                                this.queryQuestionInfoList();
                                this.copyDialog = false;
                            }
                            
                        }).catch(() => {});
                    } else {
                        return false;
                    }
                });
            },
            handleDelete(row) {
                this.$confirm(this.$store.state.lang.qn.q95, this.$store.state.lang.message.info, {
                        cancelButtonText: this.$store.state.lang.button.ok,
                        cancelButtonText: this.$store.state.lang.button.cancel,
                        type: "warning"
                    }).then(() => {
                        deleteQuestInfo(row.id).then(res => {
                            if (res && res.status == 200) {
                                this.$notify({
                                    title: this.$store.state.lang.message.success,
                                    message: this.$store.state.lang.message.delete1,
                                    type: "success"
                                });
                                this.queryQuestionInfoList();
                            }
                        });
                    }).catch(() => {});
            },
            //查询问卷信息列表
            queryQuestionInfoList() {
                this.tableData = [];
                this.loading = true;
                let param = {
                    keywords: this.paramsList.keywords,
                    schoolYear: this.paramsList.yearValue,
                    schoolPeriod: this.paramsList.termValue,
                    status: this.paramsList.status,
                    start: this.currentPage,
                    size: this.pageSize,
                    type: this.questionType
                };
                queryQuestionInfoList(param).then(res => {
                    if (res && res.status == 200 && res.data) {
                        this.total = 0;
                        this.total = res.data.total;
                        res.data.list.forEach(q => {
                            let beginT = new Date( moment(q.beginDate + " " + q.beginTime).valueOf() );
                            let endT = new Date( moment(q.endDate + " " + q.endTime).valueOf() );
                            let spaceT = endT.getTime() - beginT.getTime();
                            let days = parseInt(spaceT / (1000 * 60 * 60 * 24));
                            let hours = parseInt(
                                (spaceT % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                            );
                            let minutes = parseInt(
                                ((spaceT % (1000 * 60 * 60 * 24)) % (1000 * 60 * 60)) /
                                (1000 * 60)
                            );
                            let timeSpace = `${days}${this.$store.state.lang.qn.q49}${hours}${this.$store.state.lang.qn.q50}${minutes}${this.$store.state.lang.qn.q51}`;
                            this.tableData.push({
                                // sort: index + 1,
                                name: q.name,
                                beginDate: q.beginDate,
                                beginTime: q.beginTime,
                                createDate: q.createDate,
                                createTime: q.createTime,
                                endDate: q.endDate,
                                endTime: q.endTime,
                                status: q.status,
                                pass: q.proportion,
                                times: timeSpace,
                                id: q.id,
                                remark: q.remark,
                                realName: q.realName,
                                joinVoteNum: q.joinVoteNum || 0,
                                resultNum: q.resultNum || 0,
                                type: q.type
                            });
                        });
                        this.loading = false;
                    }
                });
            },
            handleCurrentChange(val){
                // console.log(val);
                this.currentPage = val;
                this.queryQuestionInfoList();
            },
            handleYearTermChagne(val){
                this.currentPage = 1;
                this.queryQuestionInfoList();
            },
            // 修改
            handleChangeBtn(row) {
                this.$router.push({
                    path: "/qn/manager/add",
                    query: {
                        qnid: row.id,
                        tp: '2',
                        type: this.questionType,
                        realName: row.realName,
                        step: 1
                    }
                });
            },
            handleReportForm(row){
                console.log(row)
                this.$router.push({path: '/qn/manager/bb', query: {id: row.id, type: this.questionType}})
            },
            handleDetailsForm(row){
                this.$router.push({path: '/qn/detail', query: {id: row.id}})
            },
            // 预览
            handleSeeDetails(data){
                if(data.status == 0){
                    this.$notify({
                        title: this.$store.state.lang.qn.q29,
                        message: this.$store.state.lang.qn[this.questionType == 0 ? 'q96' : 'b49'],
                        type: 'warning'
                    });
                }else{
                    this.$router.push({
                        path: '/qn/manager/preview',
                        query: {
                            copyid: data.id,
                            edt: 0
                        }
                    })
                }
            }
        }
    };
</script>

<style scoped>
    .qn-manger-home-list-code>li {
        float: left;
        width: 50%;
        padding: 10px;
        box-sizing: border-box;
    }

    .qn-manger-home-list-code>li>div {
        border: 1px solid #3c5617;
        min-height: 123px;
    }

    .qn-manger-home-list-code>li>div>div.qn_share_img {
        width: 120px;
        vertical-align: top;
        float: left;
        cursor: pointer;
        position: relative;
    }
    .qn-manger-home-list-code>li>div>div.qn_share_img>img.small{
        width: 100%;
    }
    .qn-manger-home-list-code>li>div>div.qn_share_img>img.big{
        position: absolute;
        width: 250px;
        display: none;
        top: -20px;
        left: -20px;
        z-index: 2000;;
    }
    .qn-manger-home-list-code>li>div>div.qn_share_img:hover img.big{
        display: inline-block;
    }
    .qn-manger-home-list-code>li>div>div.qn_share_right {
        margin-left: 120px;
    }

    .qn-manger-home-list-code>li>div>div.qn_share_right>p {
        line-height: 46px;
        /* word-break: break-all; */
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .qn-manger-home-list-code>li>div>div.qn_share_right>input {
        width: 200px;
        height: 26px;
        line-height: 26px;
        box-sizing: border-box;
        padding: 0 5px;
        border: 1px solid #3c5617;
        border-radius: 3px;
    }
    .qn-manger-home-list-code>li>div>div.qn_share_right>div{
        line-height: 43px;
    }
</style>