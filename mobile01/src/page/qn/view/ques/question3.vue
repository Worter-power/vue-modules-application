<template>
    <div class="qn-creat-question" :class="{'is-readobly': readonly}">
        <div :class="[`question_jump_${form.sort}`, {'qn-question': !show}]">
            <div class="qn-question-title">
                <b><span v-if="form.must" style="color: #f00">*</span><span v-if="isHiddenTip"> {{form.sort}}. </span> </b>
                <div v-html="form.name"></div>
            </div>
            <div>
                <!--:maxlength="form.ismaxlength ? form.max : 1000" 
                    :minlength="form.ismaxlength ? form.min : 0"  -->
                <el-input v-model="form.defaultAnswer" :placeholder="$store.state.lang.qn.q10" 
                    resize="none" :rows="form.rows == -2 ? form.rowsOther*1 : form.rows*1"
                    type="textarea" 
                    show-word-limit
                    @blur="_resultCheck"
                    :style="{width: form.width == -2 ? form.widthOther+'px' : (form.width === -1 ? '100%' : form.width+'px')}">
                </el-input>
            </div>
            <p class="qn-creat-question-info" v-if="form.openTip || form.ismaxlength">
                <span>{{$store.state.lang.qn.q12}}</span>
                <span v-if="form.openTip">{{form.tip}}</span>
                <span v-if="form.ismaxlength">(
                    <span v-if="form.min>0">{{$store.state.lang.qn.b88}}{{form.min}}{{$store.state.lang.qn.b89}},</span>
                    <span>{{$store.state.lang.qn.b90}}{{form.max}}{{$store.state.lang.qn.b89}}</span>
                )</span>
            </p>
        </div>
        <div v-if="!show">
            <p>{{$store.state.lang.qn.c6}}</p>
            <el-ueditor ref="quetion_title" id-name="quetion_title" :defaultMsg="form.name" v-model="form.name" :config="ueconfig"
                class="sy-ue-select" :maxLen="1000"></el-ueditor>
        </div>
        <div v-if="!show">
            <el-checkbox v-model="form.must">{{$store.state.lang.qn.c7}}</el-checkbox>
            <el-checkbox v-model="form.openTip">{{$store.state.lang.qn.c8}}</el-checkbox>
            <el-input v-if="form.openTip" v-model="form.tip" style="width: 148px;" :placeholder="$store.state.lang.qn.c9"></el-input>
        </div>
        <div v-if="!show">
            <span>{{$store.state.lang.qn.c22}}</span>
            <el-select v-model="form.rows" :placeholder="$store.state.lang.qn.q11" style="width: 120px;">
                <el-option v-for="item in rowsOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-input-number v-if="form.rows == -2" v-model="form.rowsOther" size="small" :precision="0" controls-position="right"
                style="width: 80px;margin-right: 10px;" :min="1" :max="100"></el-input-number>
            <span style="padding-left: 10px;">{{$store.state.lang.qn.c23}}</span>
            <el-select v-model="form.width" :placeholder="$store.state.lang.qn.q11" style="width: 120px;">
                <el-option v-for="item in widthOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-input-number v-if="form.width == -2" v-model="form.widthOther" size="small" :precision="0" controls-position="right"
                style="width: 100px;margin-right: 10px;" :min="50" :max="1500"></el-input-number>
            <el-checkbox v-model="form.defaultValue" style="padding-left: 10px;">{{$store.state.lang.qn.c24}}</el-checkbox>
            <el-input v-if="form.defaultValue" v-model="form.defaultPre" @change="form.defaultAnswer = form.defaultPre" 
                :placeholder="$store.state.lang.qn.c25" style="width: 150px;"></el-input>
            <el-checkbox v-model="form.ismaxlength" style="margin-left: 10px;">{{$store.state.lang.qn.c26}}</el-checkbox>
            <span v-if="form.ismaxlength">
                <!-- <el-select v-model="form.lengthType" style="width:110px">
                    <el-option v-for="item in lengthOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select> -->
                <span v-if="form.lengthType == 0">
                    <span>{{$store.state.lang.qn.c27}}</span>
                    <el-input-number size="small" v-model="form.min" :precision="0" :controls="false" style="width: 70px;" :min="1"
                        :max="form.max"></el-input-number>
                    <span>{{$store.state.lang.qn.c28}}</span>
                    <el-input-number size="small" v-model="form.max" :precision="0" :controls="false" style="width: 70px;" :min="form.min"
                        :max="201"></el-input-number>
                </span>
                <span v-if="form.lengthType == 1">
                    <span>{{$store.state.lang.qn.c30}}</span>
                    <el-input-number size="small" v-model="form.min" :precision="0" :controls="false" style="width: 70px;" :min="1"
                        :max="form.max"></el-input-number>
                    <span>{{$store.state.lang.qn.c29}}</span>
                    <el-input-number size="small" v-model="form.max" :precision="0" :controls="false" style="width: 70px;" :min="form.min"
                        :max="201"></el-input-number>
                </span>
            </span>
        </div>
        <div v-if="!show" style="padding: 10px;text-align: center;">
            <el-button @click="handleComputed('save')">{{$store.state.lang.button.save}}</el-button>
            <el-button @click="handleComputed('copy')">{{$store.state.lang.qn.q70}}</el-button>
            <el-button @click="handleComputed('remove')">{{$store.state.lang.button.delete}}</el-button>
        </div>
    </div>
</template>

<script>
import cps from "./common.js";
export default {
    mixins: [cps],
    data() {
        return {
            form: {
                id: '1',
                sort: '',
                name: '',
                type: 'question3',
                defaultAnswer: '',
                inputType: 'input',
                defaultPre: '',
                must: false, // 必填
                openTip: false,
                tip: '', // 填写提示
                orderType: '1',
                optImgType: '0',
                optImgStyleType: '1',
                opts: [],
                rows: 1,
                rowsOther: 11,
                width: -1,
                widthOther: 500,
                defaultValue: false,
                ismaxlength: false,
                min: 1,
                max: 200,
                lengthType: 1,
            },
            lengthOption: [{
                value: 0,
                label: this.$store.state.lang.qn.c31
            }, {
                value: 1,
                label: this.$store.state.lang.qn.c32
            }],
            cloums: 24,
            rowsOptions: [{
                    value: 1,
                    label: "1 " + this.$store.state.lang.qn.rows
                },
                {
                    value: 2,
                    label: "2 " + this.$store.state.lang.qn.rows
                },
                {
                    value: 3,
                    label: "3 " + this.$store.state.lang.qn.rows
                },
                {
                    value: 10,
                    label: "10 " + this.$store.state.lang.qn.rows
                },
                {
                    value: -2,
                    label: this.$store.state.lang.qn.c33
                }
            ],
            widthOptions: [{
                    value: -1,
                    label: this.$store.state.lang.qn.c34
                },
                {
                    value: 50,
                    label: "50px"
                },
                {
                    value: 100,
                    label: "100px"
                },
                {
                    value: 200,
                    label: "200px"
                },
                {
                    value: 300,
                    label: "300px"
                },
                {
                    value: 400,
                    label: "400px"
                },
                {
                    value: 500,
                    label: "500px"
                },
                {
                    value: -2,
                    label: this.$store.state.lang.qn.c33
                }
            ],
            optTextDialog: false,
            currentOpt: {},
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            if (this.data.id) {
                this.form = this.data;
                this.form.sort = this.num;
            } else {
                this.form.id = this.num;
                this.form.name = this.$store.state.lang.qn.question3;
                this.form.sort = this.num;
            }
            this._resultCheck();
        },
        // 结果校验 和输入校验
        _resultCheck(){
            // 结果处理
            this.form.finished = this.form.defaultAnswer ? true : false;
            if(this.form.must){
                this.form.errored = !this.form.finished;
                this.form.errorMsg = this.form.errored ? `${this.$store.state.lang.qn.q18} ${this.form.sort} ${this.$store.state.lang.qn.b84}` : '';
            }
            if(this.form.finished){
                let data = this.checkInputTxt(this.form.inputType, this.form.defaultAnswer);
                this.form.errored = data.pass;
                this.form.errorMsg = this.form.errored ? `${this.$store.state.lang.qn.q18} ${this.form.sort} ${this.$store.state.lang.qn.b84}`+ data.text : '';
            }
        },
        // 校验输入值
        checkInputTxt(t,value){
            let len = value ? value.length : 0;
            if(this.form.ismaxlength) {
                if(len < this.form.min || len > this.form.max) {
                    if(len > this.form.max) {
                        return {
                            pass: true,
                            text: `${this.$store.state.lang.qn.b108}${this.form.max}${this.$store.state.lang.qn.b110}`    
                        }
                    }else {
                        return {
                            pass: true,
                            text: `${this.$store.state.lang.qn.b109}${this.form.min}${this.$store.state.lang.qn.b110}`    
                        } 
                    }                  
                }
            }else{
                if(len > 1000){
                    return {
                        pass: true,
                        text: `${this.$store.state.lang.qn.b91}`
                    }
                }
            }

            if(t == 'phone'){
                if(!this.$checkContact(value)){
                    this.$notify({
                        title: this.$store.state.lang.message.info,
                        message: this.$store.state.lang.qn.q30,
                        type: 'warning'
                    });
                    return {
                        pass: true,
                        text: this.$store.state.lang.qn.q30
                    }
                }else{
                    return {pass: false}
                }
                
            }else if(t == 'email'){
                if(!this.$checkEmail(value)){
                    this.$notify({
                        title: this.$store.state.lang.message.info,
                        message: this.$store.state.lang.qn.q31,
                        type: 'warning'
                    });
                    return {
                        pass: true,
                        text: this.$store.state.lang.qn.q31
                    }
                }else{
                    return {pass: false}
                }
            }
            return {pass: false}
        },
        handleComputed(code) {
            let text = this.$refs['quetion_title'].editor.getContent();
            this.form.name = text;
            this.form.code = code;
            if(!this.form.name && code != 'remove'){
                this.$notify({
                    title: this.$store.state.lang.qn.q29,
                    message: this.$store.state.lang.qn.b80,
                    type: 'warning'
                });
                return
            }
            this.$emit('save-sub', this.form)
        },
        handleCtrOpt(t, data, index) {
            if (t == 'change') {
                this.form.opts.reverse();
            } else if (t == 'add') {
                this.form.opts.push({
                    id: this.form.opts.length + 1 + '',
                    sort: this.form.opts.length,
                    name: this.$store.state.lang.qn.opt+' ' + (this.form.opts.length + 1),
                    desc: '',
                    url: '',
                    arrow: false,
                    arrowText: ''
                })
            } else if (t == 'up') {
                let x = index + 1;
                let y = index;
                this.form.opts.splice(x - 1, 1, ...this.form.opts.splice(y - 1, 1, this.form.opts[x - 1]))
            } else if (t == 'down') {
                let x = index + 1;
                let y = index + 2;
                this.form.opts.splice(x - 1, 1, ...this.form.opts.splice(y - 1, 1, this.form.opts[x - 1]))
            } else if (t == 'remove') {
                this.form.opts.splice(index, 1);
            } else if (t == 'text') {
                this.currentOpt = data;
                this.optTextDialog = true;
            }
        },
        handleSave() {
            this.optTextDialog = false;
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
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