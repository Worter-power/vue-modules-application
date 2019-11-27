<template>
    <el-grader style="overflow: hidden;" :border="false" v-loading="saveLoading" :element-loading-text="$store.state.lang.qn.q101">
        <div slot="bodyRight" style="padding: 10px;overflow: auto;" v-loading="copyLoading">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
                <el-form-item :label="$store.state.lang.qn[questionType == 0 ? 'q83' : 'b37']" prop="name" style="margin-bottom: 20px;">
                    <el-input v-model="ruleForm.name" :maxlength="100"></el-input>
                </el-form-item>
                <el-form-item :label="$store.state.lang.qn.q84" style="margin-bottom: 20px;">
                    <el-col :span="6">
                        <el-form-item style="margin-bottom: 0;">
                            <el-date-picker type="datetime" :placeholder="$store.state.lang.qn.q74" 
                                :clearable="false" v-model="ruleForm.date1" style="width: 100%;"
                                :picker-options="pickerOptions0" :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="center" :span="1">-</el-col>
                    <el-col :span="6">
                        <el-form-item style="margin-bottom: 0;">
                            <el-date-picker type="datetime" :placeholder="$store.state.lang.qn.q74" 
                                :clearable="false" v-model="ruleForm.date2" style="width: 100%;"
                                :picker-options="pickerOptions1" :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                
                <el-form-item :label="$store.state.lang.qn.q102" prop="resource" style="margin-bottom: 20px;">
                    <el-input type="textarea" v-model="ruleForm.remind" :maxlength="500"></el-input>
                </el-form-item>

                <el-form-item :label="$store.state.lang.qn[questionType == 0 ? 'q6' : 'b41']" prop="desc" style="margin-bottom: 20px;">
                    <el-input type="textarea" v-model="ruleForm.desc" :maxlength="500"></el-input>
                </el-form-item>

                <el-form-item :label="$store.state.lang.qn.q103" prop="checkMan" style="margin-bottom: 20px;">
                    <el-input v-model="ruleForm.checkMan" style="width:266px" @click.native="handlerCellClick"
                        readonly></el-input>
                </el-form-item>

                <el-form-item :label="$store.state.lang.qn[questionType == 0 ? 'q104' : 'b42']" prop="resource" style="margin-bottom: 20px;">
                    <el-radio-group v-model="ruleForm.realName">
                        <el-radio label="1">{{$store.state.lang.qn.yes}}</el-radio>
                        <el-radio label="0">{{$store.state.lang.qn.no}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="ruleForm.realName == '0'" :label="$store.state.lang.qn.q105" prop="resource" style="margin-bottom: 20px;">
                    <div class="sy-lf">
                        <el-radio-group v-model="ruleForm.ip" style="margin-right:30px">
                            <el-radio label="0">{{$store.state.lang.qn.no}}</el-radio>
                            <el-radio label="1">{{$store.state.lang.qn.yes}}</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="sy-lf" v-if="ruleForm.ip == 1">
                        <span>{{$store.state.lang.qn.q106}}</span>
                        <el-input-number size="mini" v-model="ruleForm.ipNum" :min="0" 
                            :max="10000" :controls="false" style="width: 50px"></el-input-number>
                        <span>{{$store.state.lang.qn.q109}}</span>
                    </div>
                </el-form-item>
                <el-form-item v-if="ruleForm.realName == '0'" 
                    :label="$store.state.lang.qn.q107" prop="resource" style="margin-bottom: 20px;">
                    <div class="sy-lf">
                        <el-radio-group v-model="ruleForm.tell" style="margin-right:30px">
                            <el-radio label="0">{{$store.state.lang.qn.no}}</el-radio>
                            <el-radio label="1">{{$store.state.lang.qn.yes}}</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="sy-lf" v-if="ruleForm.tell ==1">
                        <span>{{$store.state.lang.qn.q108}}</span>
                        <el-input-number size="mini" v-model="ruleForm.pcNum" :min="0" :max="10000" 
                            :controls="false" style="width: 50px"></el-input-number>
                        <span>{{$store.state.lang.qn.q109}}</span>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="center">
            <el-button @click="handleBack" >{{$store.state.lang.button.cancel}}</el-button>
            <el-button  :loading="saveLoading" @click="submitData">{{$store.state.lang.qn.q124}}</el-button>
        </div>
    </el-grader>
</template>

<script>
import { addQuestionnaireInfo, queryQuestionInfo } from "../../request.js";
import methods from './methods.js';
export default {
    mixins: [methods],
    watch: {
        'ruleForm.date1': function(newVla,oldVal){
            this.pickerOptions1= {
                disabledDate(time) {
                    return time.getTime() < newVla.getTime();
                }
            };
        },
        'ruleForm.date2': function(newVla,oldVal){
            this.pickerOptions0= {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7 || time.getTime() > newVla.getTime();
                }
            };
        }
    },
    data() {
        var nowDate = new Date();
        nowDate.setTime(nowDate.getTime()+24*60*60*1000);
        var nextDate = new Date();
        nextDate.setTime(nextDate.getTime()+7*24*60*60*1000);
        return {
            selectUsers: [],
            ruleForm: {
                name: "",
                date1: nowDate,
                date2: nextDate,
                desc: "",
                checkMan: "",
                realName: "1",
                ip: "0",
                tell: "0",
                ipNum: "",
                pcNum: "",
                remind: ''
            },
            rules: {
                name: [{ required: true, message: this.$store.state.lang.qn[this.questionType == 0 ? 'q85' : 'b44'], trigger: "blur" },
                    { min: 3, max: 50, message: this.$store.state.lang.qn.q86, trigger: "blur" }
                ]
            },
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7 || time.getTime() > nextDate.getTime();
                }
            },
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() < nowDate.getTime();
                }
            }
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            /**
             * 1. 如果 this.$route.query.qnid 有值。则为修改流程 ，否则新增流程
             * 2. 修改流程 查询当前设置问卷的详情
             * 3. 查询到详情显示页面
             * 4. 再次点击下一步 保存修改
             * 5. 跳转下一步 ，通知父组件跳转
             */
            // 第一步
            if(this.$route.query.qnid){
                this.getLoacolData();
            }else{
                this.selectUsers = [{
                    id: this.$store.state.userId,
                    realName: this.$store.state.realName
                }]
                this.ruleForm.checkMan = this.$_.map(this.selectUsers, 'realName').join('，');
            }
        },
        getLoacolData(){
            if(!this.$route.query.qnid){return}
            queryQuestionInfo({id: this.$route.query.qnid}).then(res=>{
                if(res.status == 200 && res.code == 'ok'){
                    if(res.data.qnReportPermissionsVMs){
                        let arr = [];
                        res.data.qnReportPermissionsVMs.forEach((_s,s)=>{
                            arr.push({
                                id: _s.userId,
                                realName: _s.userName
                            })
                        })
                        this.ruleForm.checkMan = this.$_.map(arr, 'realName').join('，');
                        this.selectUsers = arr;
                        this.ruleForm.name = res.data.name;
                        this.ruleForm.date1 = new Date(res.data.beginDate + ' ' + res.data.beginTime);
                        this.ruleForm.date2 = new Date(res.data.endDate + ' ' + res.data.endTime);
                        this.ruleForm.desc = res.data.remark;
                        this.ruleForm.realName = res.data.realName+'';
                        this.ruleForm.ipNum = res.data.ipNum+'';
                        this.ruleForm.remind = res.data.remind;
                        this.ruleForm.tell = res.data.pcSet+'';
                        this.ruleForm.pcNum = res.data.pcNum;
                        this.ruleForm.ip = res.data.ipSet+'';
                    }
                }
            })
        },
        // 选人控件
        handlerCellClick() {
            let _m = this.$_.map(this.selectUsers, 'id');
            this.$SelectUsers({
                    lang: this.$store.state.langType,
                    unitType: this.unitType,
                    userTypes: [2],
                    selectUserType: 2,
                    unitId: this.unitId,
                    selectUserIds: _m,
                    beforeClose: (selectUsers, instance) => {
                        let arr1 = [];
                        this.selectUsers = selectUsers;
                        if (selectUsers.length > 0) {
                            selectUsers.forEach(s => {
                                arr1.push(s.realName);
                            });
                            this.ruleForm.checkMan = arr1.join('，');
                        } else {
                            this.ruleForm.checkMan = "";
                        }
                    }
                },
                () => {}
            );
        },
        submitData(){
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let param = {
                        id: this.$route.query.qnid || undefined,
                        name: this.ruleForm.name,
                        beginDate: moment(this.ruleForm.date1).format("YYYY-MM-DD"),
                        beginTime: moment(this.ruleForm.date1).format("HH:mm:ss"),
                        endDate: moment(this.ruleForm.date2).format("YYYY-MM-DD"),
                        endTime: moment(this.ruleForm.date2).format("HH:mm:ss"),
                        remark: this.ruleForm.desc,
                        realName: this.ruleForm.realName,
                        ipSet: this.ruleForm.ip,
                        ipNum: this.ruleForm.ipNum,
                        pcSet: this.ruleForm.tell,
                        pcNum: this.ruleForm.pcNum,
                        remind: this.ruleForm.remind,
                        type: this.$route.query.type
                    };
                    this.selectUsers.forEach((w, i) => {
                        param[`qnReportPermissionsVMs[${i}].userId`] = w.id;
                        param[`qnReportPermissionsVMs[${i}].userName`] = w.realName;
                    });
                    // 保存修改或者新增问卷信息
                    this.saveLoading = true;
                    addQuestionnaireInfo(this.$route.query.qnid ? 'put' : 'post', param).then(res => {
                        if (res && res.status == 200) {
                            this.$emit('next-click', {
                                step: 2,
                                qnid: res.data,
                                realName: this.ruleForm.realName
                            })
                        }
                        this.saveLoading = false;
                    }).catch(err=>{
                        this.saveLoading = false;
                    });
                } else {
                    return false;
                }
            });
        },
    }
};
</script>