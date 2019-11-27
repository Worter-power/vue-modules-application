<template>
    <div class="qn-creat-question" :class="{'is-readobly': readonly}">
        <div :class="[`question_jump_${form.sort}`, {'qn-question': !show}]">
            <div class="qn-question-title">
                <b><span v-if="form.must" style="color: #f00">*</span><span v-if="isHiddenTip"> {{form.sort}}. </span> </b>
                <div v-html="form.name"></div>
            </div>
            <table class="sy-base-table-border">
                <thead>
                    <tr>
                        <th></th>
                        <th v-for="item in form.items" :key="item.id">{{item.name}}</th>
                    </tr>
                </thead>
                <tbody> 
                    <tr v-for="row in form.questions" :key="row.id">
                        <td>{{row.name}}</td>
                        <td v-for="item in row.items" :key="item.id">
                            <el-checkbox v-if="form.orderType == '1'" v-model="item.checked">{{''}}</el-checkbox>
                            <el-radio v-if="form.orderType == '0'" v-model="row.anwser" :label="item.id">{{''}}</el-radio>
                        </td>
                    </tr>
                </tbody>
            </table>
            <el-row :gutter="20">
                <el-col v-for="item in form.opts" :key="item.id" :span="cloums/(form.orderType == '5' ? form.opts.length : form.orderType)">
                    <el-checkbox v-model="form.defaultAnswer" :label="item.id">
                        {{item.name}}
                        <el-input v-if="item.arrow" v-model="item.arrowText" style="width: 150px;" :placeholder="$store.state.lang.qn.c9"></el-input>
                    </el-checkbox>
                </el-col>
            </el-row>
            <p class="qn-creat-question-info" v-if="form.openTip">{{$store.state.lang.qn.q12}}{{form.tip}}</p>
        </div>
        <div v-if="!show">
            <p>{{$store.state.lang.qn.c6}}</p>
            <el-ueditor ref="quetion_title" id-name="quetion_title" 
                :defaultMsg="form.name"  
                v-model="form.name" 
                :config="ueconfig" class="sy-ue-select" :maxLen="1000"></el-ueditor>
        </div>
        <div v-if="!show">
            <el-checkbox v-model="form.must">{{$store.state.lang.qn.c7}}</el-checkbox>
            <el-checkbox v-model="form.openTip">{{$store.state.lang.qn.c8}}</el-checkbox>
            <el-input v-if="form.openTip" v-model="form.tip" style="width: 150px;" :placeholder="$store.state.lang.qn.c9"></el-input>
        </div>
        <div v-if="!show">
            <table class="sy-base-table-border">
                <thead>
                    <tr>
                        <th style="text-align: left;">
                            {{$store.state.lang.qn.c16}}
                            <el-button type="text" size="small" @click="handleCtrOpt(form.questions, 'change')">
                                <i class="fa fa-exchange fa-rotate-90" style="color:#3B5616" aria-hidden="true"></i> 
                            </el-button>
                        </th>
                        <th style="width: 130px;">{{$store.state.lang.qn.q64}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in form.questions" :key="item.id">
                        <td style="padding: 0 15px;">
                            <el-input v-model="item.name"></el-input>
                        </td>
                        <td>
                            <el-button type="text" size="small" @click="handleCtrOpt(form.questions,'add1')">
                                <i class="fa fa-plus" style="color:#3B5616" aria-hidden="true"></i>
                            </el-button>
                            <el-button type="text" size="small" v-if="form.questions.length > 2" @click="handleCtrOpt(form.questions,'remove', item, index)">
                                <i class="fa fa-times" style="color:#F56C6C" aria-hidden="true"></i>
                            </el-button>
                            <el-button type="text" v-if="index != 0" size="small" @click="handleCtrOpt(form.questions,'up', item, index)">
                                <i class="fa fa-long-arrow-up" style="color:#67C23A" aria-hidden="true"></i>
                            </el-button>
                            <el-button type="text" v-if="index != form.questions.length-1" size="small" @click="handleCtrOpt(form.questions,'down', item, index)">
                                <i class="fa fa-long-arrow-down" style="color:#67C23A" aria-hidden="true"></i>
                            </el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="!show">
            <table class="sy-base-table-border">
                <thead>
                    <tr>
                        <th style="text-align: left;">
                            {{$store.state.lang.qn.c17}}
                            <el-button type="text" size="small" @click="handleCtrOpt(form.items,'change')">
                                <i class="fa fa-exchange fa-rotate-90" style="color:#3B5616" aria-hidden="true"></i> 
                            </el-button>
                        </th>
                        <th style="width: 130px;">{{$store.state.lang.qn.q64}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in form.items" :key="item.id">
                        <td style="padding: 0 15px;">
                            <el-input v-model="item.name" @blur="handleComitItem"></el-input>
                        </td>
                        <td>
                            <el-button type="text" size="small" @click="handleCtrOpt(form.items,'add')">
                                <i class="fa fa-plus" style="color:#3B5616" aria-hidden="true"></i>
                            </el-button>
                            <el-button type="text" size="small" v-if="form.items.length > 2" @click="handleCtrOpt(form.items,'remove', item, index)">
                                <i class="fa fa-times" style="color:#F56C6C" aria-hidden="true"></i>
                            </el-button>
                            <el-button type="text" v-if="index != 0" size="small" @click="handleCtrOpt(form.items,'up', item, index)">
                                <i class="fa fa-long-arrow-up" style="color:#67C23A" aria-hidden="true"></i>
                            </el-button>
                            <el-button type="text" v-if="index != form.items.length-1" size="small" @click="handleCtrOpt(form.items,'down', item, index)">
                                <i class="fa fa-long-arrow-down" style="color:#67C23A" aria-hidden="true"></i>
                            </el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="!show">
            <span>{{$store.state.lang.qn.c18}}</span>
            <el-select v-model="form.orderType" :placeholder="$store.state.lang.qn.q11" style="width: 120px;margin-right: 10px;">
                <el-option
                    v-for="item in sortOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div v-if="!show" style="padding: 10px;text-align: center;">
            <el-button  size="small" @click="handleComputed('save')">{{$store.state.lang.button.save}}</el-button>
            <el-button  size="small" @click="handleComputed('copy')">{{$store.state.lang.qn.q70}}</el-button>
            <el-button  size="small" @click="handleComputed('remove')">{{$store.state.lang.button.delete}}</el-button>
        </div>
        <el-dialog2
            :title="currentOpt.name + $store.state.lang.qn.c11"
            height="202px"
            width="450px"
            slide="fade"
            :visible.sync="optTextDialog">
            <div slot="body" style="padding:10px 20px;">
                <el-input
                    type="textarea"
                    :rows="5"
                    resize="none"
                    :placeholder="$store.state.lang.qn.c15"
                    :maxlength="500"
                    v-model="currentOpt.desc">
                </el-input>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button style="margin: 0 3px;" @click="optTextDialog = false"  size="small">{{$store.state.lang.button.cancel}}</el-button>
                <el-button style="margin: 0 3px;" @click="handleSave"  size="small">{{$store.state.lang.button.save}}</el-button>
            </div>
        </el-dialog2>
    </div>
</template>

<script>
import cps from "./common.js";
export default {
    mixins: [cps],
    data(){
        return {
            saveLoading: false,
            form: {
                id: '1',
                sort: '',
                name: '',
                type: 'question2',
                defaultAnswer: false,
                must: false, // 必填
                openTip: false,
                tip: '', // 填写提示
                orderType: '0',
                optImgType: '0',
                optImgStyleType: '1',
                opts: [],
                checkType: null,
                questions: [],
                items: []
            },
            cloums: 24,
            sortOptions: [
                {value: '0', label: this.$store.state.lang.qn.c19},
                {value: '1', label: this.$store.state.lang.qn.c20}
            ],
            columData: [
                {
                    id: '1',
                    titleId: '',
                    name: this.$store.state.lang.qn.opt1,
                    checked: false
                },
                {
                    id: '2',
                    titleId: '',
                    name: this.$store.state.lang.qn.opt2,
                    checked: false
                },
                {
                    id: '3',
                    titleId: '',
                    name: this.$store.state.lang.qn.opt3,
                    checked: false
                }
            ],
            questions: [
                {
                    id: '',
                    titleId: '',
                    anwser: '',
                    checked: [],
                    name: this.$store.state.lang.qn.que + ' 1',
                    items: [
                        {
                            id: '1',
                            titleId: '',
                            name: this.$store.state.lang.qn.opt1,
                            checked: false
                        },
                        {
                            id: '2',
                            titleId: '',
                            name: this.$store.state.lang.qn.opt2,
                            checked: false
                        },
                        {
                            id: '3',
                            titleId: '',
                            name: this.$store.state.lang.qn.opt3,
                            checked: false
                        }
                    ]
                },
                {
                    id: '',
                    titleId: '',
                    anwser: '',
                    checked: [],
                    name: this.$store.state.lang.qn.que + ' 2',
                    items: [
                        {
                            id: '1',
                            titleId: '',
                            name: this.$store.state.lang.qn.opt1,
                            checked: false
                        },
                        {
                            id: '2',
                            titleId: '',
                            name: this.$store.state.lang.qn.opt2,
                            checked: false
                        },
                        {
                            id: '3',
                            titleId: '',
                            name: this.$store.state.lang.qn.opt3,
                            checked: false
                        }
                    ]
                },
                {
                    id: '',
                    titleId: '',
                    anwser: '',
                    checked: [],
                    name: this.$store.state.lang.qn.que + ' 3',
                    items: [
                        {
                            id: '1',
                            titleId: '',
                            name: this.$store.state.lang.qn.opt1,
                            checked: false
                        },
                        {
                            id: '2',
                            titleId: '',
                            name: this.$store.state.lang.qn.opt2,
                            checked: false
                        },
                        {
                            id: '3',
                            titleId: '',
                            name: this.$store.state.lang.qn.opt3,
                            checked: false
                        }
                    ]
                }
            ],
            optTextDialog: false,
            currentOpt: {}
        }
    },
    created(){
        this.init();
    },
    watch: {
        form: {
            handler(newVal, oldVal){
                this._resultCheck();
            },
            deep: true
        }
    },
    methods: {
        init(){
            if(this.data.id){
                this.form = this.data;
                this.form.sort = this.num;
            }else{
                this.form.name = this.$store.state.lang.qn.c21;
                this.form.items = this.columData;
                this.form.questions = this.questions;
                this.form.sort = this.num;
            }
            this._resultCheck();
        },
        // 结果校验 和输入校验
        _resultCheck(){
            if(this.form.orderType == 0){
                // 单选
                let checks = this.form.questions.filter(o=>{return o.anwser}).length;
                let nocheckName = this.form.questions.filter(o=>{return !o.anwser}).map(o=>{return o.name}).join('，')
                console.log('矩阵单选',checks == this.form.questions.length, nocheckName)
                if(this.form.must){
                    this.form.finished = checks == this.form.questions.length;
                    if(!this.form.finished){
                        this.form.errored = true;
                        this.form.errorMsg = `${this.$store.state.lang.qn.q18} ${this.form.sort} ${this.$store.state.lang.qn.b84}`+nocheckName+ `${this.$store.state.lang.qn.b87}`;
                    }else{
                        this.form.errored = false;
                        this.form.errorMsg = '';
                    }
                }else{
                    this.form.finished = checks > 0;
                }
            }else{
                // 多选
                let _arr = [];
                let nonames = [];
                this.form.questions.forEach((_d,d)=>{
                    let arr = [];
                    _d.items.forEach((_q,q)=>{
                        if(_q.checked){
                            arr.push(`${_d.id}_${_q.id}`)
                        }
                    })
                    if(arr.length > 0){
                        _arr.push(_d.id)
                    }else{
                        nonames.push(_d.name)
                    }
                })
                if(this.form.must){
                    this.form.finished = _arr.length == this.form.questions.length;
                    if(!this.form.finished){
                        this.form.errored = true;
                        this.form.errorMsg = `${this.$store.state.lang.qn.q18} 
                            ${this.form.sort} ${this.$store.state.lang.qn.b84}`+nonames.join('，')+`${this.$store.state.lang.qn.b87}`;
                    }else{
                        this.form.errored = false;
                        this.form.errorMsg = '';
                    }
                }else{
                    this.form.finished = _arr.length > 0;
                }
            }
        },
        handleComitItem(){
            this.jzrowcol();
        },
        jzrowcol(){
            this.form.questions.forEach((_s,s)=>{
                _s.items = this.$_.cloneDeep( this.form.items);
            })
        },
        handleComputed(code){
            let text = this.$refs['quetion_title'].editor.getContent();
            this.form.name = text;
            this.form.code = code;
            if(!text && code != 'remove'){
                this.$notify({
                    title: this.$store.state.lang.qn.q29,
                    message: this.$store.state.lang.qn.b80,
                    type: 'warning'
                });
                return
            }
            this.saveLoading = true;
            this.$emit('save-sub', this.form)
        },
        handleCtrOpt(arr, t, data, index){
            if(t == 'change'){
                arr.reverse();
            } else if(t == 'add'){
                arr.push({
                    id: arr.length+1+'',
                    name: this.$store.state.lang.qn.opt + ' '  + (arr.length + 1),
                    checked: false
                })
            }else if(t == 'add1'){
                arr.push({
                    id: arr.length+1+'',
                    anwser: '',
                    items: this.form.items
                })
            } else if(t == 'up'){
                let x = index+1;
                let y = index;
                arr.splice(x - 1, 1, ...arr.splice(y - 1, 1, arr[x - 1]))
            } else if(t == 'down'){
                let x = index+1;
                let y = index+2;
                arr.splice(x - 1, 1, ...arr.splice(y - 1, 1, arr[x - 1]))
            } else if(t == 'remove'){
                arr.splice(index, 1);
            } else if(t == 'text'){
                this.currentOpt = data;
                this.optTextDialog = true;
            }
            this.jzrowcol();
        },
        handleSave(){
            this.optTextDialog = false;
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error(this.$store.state.lang.qn.b85);
            }
            if (!isLt2M) {
            this.$message.error(this.$store.state.lang.qn.b86);
            }
            return isJPG && isLt2M;
        }
    },
    mounted() {
        let me = this;
        if(this.$refs['quetion_title']){
            this.$refs['quetion_title'].editor.addListener('blur',function(editor){
                me.form.name = this.getContent();
            })
        }
    }
}
</script>

<style>

</style>
