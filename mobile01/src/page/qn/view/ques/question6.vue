<template>
    <div class="qn-creat-question" :class="{'is-readobly': readonly}">
        <div :class="[`question_jump_${form.sort}`, {'qn-question': !show}]">
            <div class="qn-question-title">
                <b><span v-if="form.must" style="color: #f00">*</span><span v-if="isHiddenTip"> {{form.sort}}. </span></b>
                <div v-html="form.name"></div>
            </div>
            <div>
                <el-select v-model="form.defaultAnswer" :placeholder="$store.state.lang.qn.q11">
                    <el-option
                        v-for="item in form.opts"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <p class="qn-creat-question-info" v-if="form.openTip">{{$store.state.lang.qn.q12}}{{form.info}}</p>
        </div>
        <div v-if="!show">
            <p>{{$store.state.lang.qn.c6}}</p>
            <el-ueditor ref="quetion_title" id-name="quetion_title" :defaultMsg="form.name" v-model="form.name" :config="ueconfig"
                class="sy-ue-select" :maxLen="1000"></el-ueditor>
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
                        <th>
                            <el-button type="text" size="small" @click="handleCtrOpt('change')">
                                <i class="fa fa-exchange fa-rotate-90" style="color:#3B5616" aria-hidden="true"></i>
                            </el-button>
                            {{$store.state.lang.qn.c10}}
                        </th>
                        <th style="width: 100px;">{{$store.state.lang.qn.c34}}</th>
                        <th style="width: 130px;">{{$store.state.lang.qn.q64}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in form.opts" :key="item.id">
                        <td style="padding: 0 15px;">
                            <el-input v-model="item.name"></el-input>
                        </td>
                        <td>
                            <el-checkbox v-model="item.arrow"></el-checkbox>
                        </td>
                        <td>
                            <el-button type="text" size="small" @click="handleCtrOpt('add')">
                                <i class="fa fa-plus" style="color:#3B5616" aria-hidden="true"></i>
                            </el-button>
                            <el-button type="text" size="small" @click="handleCtrOpt('remove', item, index)">
                                <i class="fa fa-times" style="color:#F56C6C" aria-hidden="true"></i>
                            </el-button>
                            <el-button type="text" v-if="index != 0" size="small" @click="handleCtrOpt('up', item, index)">
                                <i class="fa fa-long-arrow-up" style="color:#67C23A" aria-hidden="true"></i>
                            </el-button>
                            <el-button type="text" v-if="index != form.opts.length-1" size="small" @click="handleCtrOpt('down', item, index)">
                                <i class="fa fa-long-arrow-down" style="color:#67C23A" aria-hidden="true"></i>
                            </el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
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
            saveLoading: false,
            form: {
                id: '1',
                sort: '',
                name: '',
                componentId: 'question6',
                type: 6,
                defaultAnswer: '',
                must: false, // 必填
                openTip: false,
                tip: '', // 填写提示
                orderType: '1',
                optImgType: '0',
                optImgStyleType: '1',
                opts: []
            },
            cloums: 24,
            optTextDialog: false,
            currentOpt: {}
        }
    },
    created() {
        this.init();
    },
    watch: {
        'form.defaultAnswer': function(newVal,oldVal){
            this._resultCheck()
        }
    },
    methods: {
        init() {
            if (this.data.id) {
                this.form = this.data;
                this.form.sort = this.num;
            } else {
                this.form.name = this.$store.state.lang.qn.c38;
                this.form.sort = this.num;
            }
            this._resultCheck()
        },
        // 结果校验 和输入校验
        _resultCheck(){
            // 结果处理
            this.form.finished = this.form.defaultAnswer ? true : false;
            if(this.form.must){
                this.form.errored = !this.form.finished;
                this.form.errorMsg = this.form.errored ? `${this.$store.state.lang.qn.q18} ${this.form.sort} ${this.$store.state.lang.qn.b84}` : '';
            }
        },
        handleComputed(code) {
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
            this.$emit('save-sub', this.form)
        },
        getContent() {
            let text = this.$refs['quetion_title'].editor.getContent();
            this.form.name = text;
        },
        handleCtrOpt(t, data, index) {
            if (t == 'change') {
                this.form.opts.reverse();
            } else if (t == 'add') {
                this.form.opts.push({
                    id: this.form.opts.length + 1 + '',
                    sort: this.form.opts.length,
                    name: this.$store.state.lang.qn.opt+ ' ' + (this.form.opts.length + 1),
                    desc: '',
                    url: '',
                    arrow: 0,
                    arrowText: '',
                    mast: 0
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
        if (this.$refs['quetion_title']) {
            this.$refs['quetion_title'].editor.addListener('blur', function (editor) {
                me.form.name = this.getContent();
            })
        }
    }
}
</script>

<style>

</style>