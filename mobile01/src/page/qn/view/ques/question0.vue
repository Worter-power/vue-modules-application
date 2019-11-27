<template>
    <div class="qn-creat-question">
        <div :class="[`question_jump_${form.sort}`, {'qn-question': !show}]">
            <div class="qn-question-title">
                <b><span v-if="form.must" style="color: #f00">*</span> <span v-if="isHiddenTip"> {{form.sort}}. </span></b>
                <div v-html="form.name"></div>
            </div>
            <el-row v-if="form.img == '0'" :gutter="10">
                <el-col v-for="item in form.opts" :key="item.id" :span="cloums/(form.orderType == '5' ? form.opts.length : form.orderType)" :xs="24">
                    <div :class="{'is-readobly': readonly}">
                        <el-radio v-model="form.defaultAnswer" :label="item.id">
                            {{item.name}}
                            <el-input v-show="form.defaultAnswer == item.id || !show" v-if="item.arrow" v-model="item.arrowText" style="width: 150px;" placeholder="" :maxlength="100" @blur="_resultCheck"></el-input>
                            <span :style="{'padding-left': (form.widthint || 20) +'px'}" v-if="questionType == 1 && (form.showPercentage || form.showVote)">
                                <span v-if="form.showPercentage">{{item.howMuchVoteNum || 0}}{{$store.state.lang.qn.b65}}</span> 
                                <span v-if="form.showVote">({{item.percentage || '0%'}})</span>
                            </span>
                        </el-radio>
                    </div>
                    <p v-if="isarrowdesc" class="qn-title-desc" v-eclips>
                        {{item.desc}}
                        <span v-if="item.desc" class="qn-title-desc-more" @click.stop="handleOpenDesc(item)"></span>
                    </p>
                </el-col>
            </el-row>
            <el-row v-if="form.img == '1'" :gutter="10" >
                <el-col v-for="item in form.opts" :key="item.id" :span="cloums/form.orderType" :xs="24">
                    <div class="qn-title-img" :style="{width: imgSize.width + 'px'}">
                        <div v-if="form.img == 1 && form.styleType == 2 && form.defaultAnswer == item.id" class="qn-title-check"></div>
                        <div class="qn-title-card" :class="{'is-checked': form.defaultAnswer == item.id, 'cp': !readonly}" @click="handleCheck(item)">
                            <div class="qn-title-imgcard" :style="{width: imgSize.width + 'px',height: imgSize.height + 'px' }">
                                <img :src="item.showImgUrl || '/common/images/qn/default.png'">
                                <!-- <div v-if="item.desc">{{item.desc}}</div> -->
                                <!-- 啊手动阀空手道解放了客户阿斯顿发射点快捷回复拉山口的会计分录啊手动阀啊手动阀空手道解 -->
                            </div>
                            <div class="qn-title-desc" v-if="isarrowdesc" v-eclips>
                                {{item.desc}}
                                <span v-if="item.desc" class="qn-title-desc-more" @click.stop="handleOpenDesc(item)"></span>
                            </div>
                            <div class="qn-title-img-item" :title="item.name" :class="{'is-readobly': readonly}">
                                <el-radio v-model="form.defaultAnswer" :label="item.id" v-if="form.styleType == '1'">
                                    {{item.name}}
                                </el-radio>
                                <p v-if="form.styleType == '2'">{{item.name}}</p>
                                <div :class="{'qn-title-card-arrow': form.orderType != 1}" v-if="isarrow">
                                    <el-input v-show="form.defaultAnswer == item.id || !show" v-if="item.arrow" v-model="item.arrowText" style="width: 100%;" placeholder="" @blur="_resultCheck"></el-input>
                                </div>
                            </div>
                        </div>
                        <div class="qn-title-tp" v-if="questionType == 1 && (form.showPercentage || form.showVote)">
                            <span v-if="form.showPercentage">{{item.howMuchVoteNum}}{{$store.state.lang.qn.b65}}</span> 
                            <span v-if="form.showVote">({{item.percentage || '0%'}})</span>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <p class="qn-creat-question-info" v-if="form.openTip">{{$store.state.lang.qn.q12}}{{form.tip}}</p>
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
                        <!-- 图片 -->
                        <th v-if="form.img == '1'" style="width: 100px;">{{$store.state.lang.qn.b66}}</th>
                        <th style="width: 100px;">{{$store.state.lang.qn.c11}}</th>
                        <th v-if="questionType != 1" style="width: 100px;">{{$store.state.lang.qn.c12}}</th>
                        <th style="width: 130px;">{{$store.state.lang.qn.q64}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in form.opts" :key="item.id">
                        <td style="padding: 0 15px;">
                            <el-input v-model="item.name"></el-input>
                        </td>
                        <td v-if="form.img == '1'">
                            <upimg :size="imgSize" :sort="index" :defaultImg="item.showImgUrl" @success="handlerSuccessImg"></upimg>
                        </td>
                        <td>
                            <el-button type="text" size="small" @click="handleCtrOpt('text', item, index)">
                                <i class="fa fa-file-text-o" style="color:#409EFF" aria-hidden="true"></i>
                            </el-button>
                        </td>
                        <td v-if="questionType != 1">
                            <el-checkbox v-model="item.arrow"></el-checkbox>
                            <span v-if="item.arrow">|</span>
                            <el-checkbox v-if="item.arrow" v-model="item.mast" style="margin:0">{{$store.state.lang.qn.c13}}</el-checkbox>
                        </td>
                        <td>
                            <el-button type="text" size="small" @click="handleCtrOpt('add')">
                                <i class="fa fa-plus" style="color:#3B5616" aria-hidden="true"></i>
                            </el-button>
                            <el-button type="text" size="small" v-if="form.opts.length > 2" @click="handleCtrOpt('remove', item, index)">
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
        <div v-if="!show">
            <span>{{$store.state.lang.qn.c14}}</span>
            <el-select v-model="form.orderType" :placeholder="$store.state.lang.qn.q11" style="width: 120px;margin-right: 10px;" @change="handleSortChange">
                <el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <!-- 选项图文样式显示： -->
            <span>{{$store.state.lang.qn.b67}}</span>
            <el-radio-group v-model="form.img">
                <el-radio label="0">{{$store.state.lang.qn.no}}</el-radio>
                <el-radio label="1">{{$store.state.lang.qn.yes}}</el-radio>
            </el-radio-group>
            <el-select v-if="form.img == '1'" v-model="form.styleType" :placeholder="$store.state.lang.qn.q11" style="width: 120px;margin-left: 10px;">
                <el-option :label="$store.state.lang.qn.b68" value="1"></el-option>
                <el-option :label="$store.state.lang.qn.b69" value="2"></el-option>
            </el-select>
            <template v-if="form.img == '1'">
                <br>
                <span>{{$store.state.lang.qn.b70}}</span>
                <span>{{$store.state.lang.qn.b71}}</span>
                <el-input-number :disabled="disabledChangeSize" size="mini" v-model="imgSize.width" :step="2" :min="40" :max="1200" :precision="0" :controls="false" style="width: 120px"></el-input-number>
                <span style="padding-left: 20px;">{{$store.state.lang.qn.b72}}</span>
                <el-input-number :disabled="disabledChangeSize" size="mini" v-model="imgSize.height" :step="2" :min="40" :max="1200" :precision="0" :controls="false" style="width: 120px"></el-input-number>
            </template>
            <template v-if="questionType == '1'">
                <br>
                <!-- 选项设置： -->
                <span>{{$store.state.lang.qn.b73}}</span>
                <el-checkbox v-model="form.showPercentage">{{$store.state.lang.qn.b74}}</el-checkbox>
                <el-checkbox v-model="form.showVote">{{$store.state.lang.qn.b75}}</el-checkbox>
                <span style="padding-left: 20px;" v-if="form.img == '0'&& form.orderType == 1">{{$store.state.lang.qn.b76}}</span>
                <el-input-number v-if="form.img == '0'&& form.orderType == 1" size="mini" v-model="form.widthint" :step="2" :min="20" :max="1200" :precision="0" :controls="false" style="width: 120px"></el-input-number>
            </template>
        </div>
        <div v-if="!show" style="padding: 10px;text-align: center;">
            <el-button  size="small" @click="handleComputed('save')">{{$store.state.lang.button.save}}</el-button>
            <el-button  size="small" @click="handleComputed('copy')">{{$store.state.lang.qn.q70}}</el-button>
            <el-button  size="small" @click="handleComputed('remove')">{{$store.state.lang.button.delete}}</el-button>
        </div>
        <el-dialog2 :title="currentOpt.name + $store.state.lang.qn.c11" height="100px" width="450px" slide="fade" :visible.sync="optTextDialog" append-to-body>
            <div slot="body" style="padding:17px 20px;">
                <el-input style="" type="textarea" :rows="3" resize="none" :placeholder="$store.state.lang.qn.c15" :maxlength="500" v-model="currentOpt.desc">
                </el-input>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button style="margin: 0 3px;" @click="optTextDialog = false"  size="small">{{$store.state.lang.button.cancel}}</el-button>
                <el-button style="margin: 0 3px;" @click="handleSave"  size="small">{{$store.state.lang.button.save}}</el-button>
            </div>
        </el-dialog2>
        <el-dialog2 :title="currentOpt2.name + $store.state.lang.qn.c11" height="auto" width="450px" slide="fade" :visible.sync="optTextDialog2" append-to-body>
            <div slot="body" style="padding:20px;">
                {{currentOpt2.desc}}
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button style="margin: 0 3px;" @click="optTextDialog2 = false"  size="small">{{$store.state.lang.button.close}}</el-button>
            </div>
        </el-dialog2>
    </div>
</template>

<script>
import cps from "./common.js";
import upimg from './img.vue';
export default {
    mixins: [cps],
    components: {
        upimg
    },
    data() {
        return {
            form: {
                id: '1',
                sort: '',
                name: '',
                titleId: '',
                componentId: 'question0',
                type: 0,
                defaultAnswer: '',
                must: false, // 必填
                openTip: false,
                tip: '', // 填写提示
                orderType: '4', // 每行几个
                img: '0', // 图片模式
                styleType: '1', // 样式类型
                widthint: 20, // 选项宽度
                showPercentage: true, // 是否显示票数
                showVote: true, // 是否显示百分比
                maxNum: 1, // 最大投票数
                opts: []
            },
            columData: [{
                    id: '1',
                    sort: 1,
                    name: this.$store.state.lang.qn.opt1,
                    desc: '',
                    url: '',
                    arrow: false,
                    arrowText: '',
                    showImgUrl: '',
                    image: '',
                    mast: 0,
                    percentage: '0%',
                    howMuchVoteNum: 0
                },
                {
                    id: '2',
                    sort: 2,
                    name: this.$store.state.lang.qn.opt2,
                    desc: '',
                    url: '',
                    arrow: false,
                    arrowText: '',
                    showImgUrl: '',
                    image: '',
                    mast: 0,
                    percentage: '0%',
                    howMuchVoteNum: 0
                },
                {
                    id: '3',
                    sort: 3,
                    name: this.$store.state.lang.qn.opt3,
                    desc: '',
                    url: '',
                    arrow: false,
                    arrowText: '',
                    showImgUrl: '',
                    image: '',
                    mast: 0,
                    percentage: '0%',
                    howMuchVoteNum: 0
                },
                {
                    id: '4',
                    sort: 4,
                    name: this.$store.state.lang.qn.opt4,
                    desc: '',
                    url: '',
                    arrow: false,
                    arrowText: '',
                    showImgUrl: '',
                    image: '',
                    mast: 0,
                    percentage: '0%',
                    howMuchVoteNum: 0
                }
            ],
            optTextDialog: false,
            optTextDialog2: false,
            currentOpt: {},
            currentOpt2: {}
        }
    },
    computed: {
        isarrow(){
            return this.form.opts.filter(o=>{return o.arrow}).length > 0
        },
        isarrowdesc(){
            return this.form.opts.filter(o=>{return o.desc}).length > 0
        }
    },
    watch: {
        'form.defaultAnswer': function(newVal,oldVal){
            this._resultCheck()
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            /** 
             * 1. 新增的时候 this.data 为空对象
             * 2. 修改的时候this.data 有值
             */
            if (this.data.id) {
                this.form = this.data;
                this.form.sort = this.num; // 题号
                this.handleSortChange(this.form.orderType)
            } else {
                this.form.name = this.$store.state.lang.qn.question0;
                this.form.opts = this.columData;
                this.form.sort = this.num;
            }
            this._resultCheck()
        },
        // 结果校验 和输入校验
        _resultCheck(){
            console.log('++++++++++',this.form)
            // 结果处理
            this.form.finished = this.form.defaultAnswer ? true : false;
            let msg = `${this.$store.state.lang.qn.q18} ${this.form.sort} ${this.$store.state.lang.qn.b84}`;
            if(this.form.must){
                this.form.errored = !this.form.finished;
                this.form.errorMsg = this.form.errored ? msg : '';
            }
            this.form.opts.forEach((_s,s)=>{
                if(this.form.defaultAnswer == _s.id){
                    if(_s.arrow && _s.mast && !_s.arrowText){
                        this.form.errored = true;
                        this.form.errorMsg = this.form.errored ? `${this.$store.state.lang.qn.q18} ${this.form.sort} ${this.$store.state.lang.qn.b78} ${_s.name} ${this.$store.state.lang.qn.b79}` : '';
                    }else{
                        this.form.errored = false;
                        this.form.errorMsg = '';
                    }
                }
            })
        },
        // 获取图片
        handlerSuccessImg(res){
            try {
                this.form.opts[res.sort].showImgUrl = this.$store.state.imgurl + res.id;
                this.form.opts[res.sort].image = res.id;
            } catch (error) {
                
            }
            if(this.form.opts.filter(o=>{return o.image}).length){
                this.disabledChangeSize = true;
            }else{
                this.disabledChangeSize = false;
            }
        },
        // 选中
        handleCheck(item){
            if(this.readonly){
                return
            }
            this.form.defaultAnswer = item.id;
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
        handleCtrOpt(t, data, index) {
            if (t == 'change') {
                this.form.opts.reverse();
            } else if (t == 'add') {
                this.form.opts.push({
                    id: this.form.opts.length + 1 + '',
                    sort: this.form.opts.length,
                    name: this.$store.state.lang.qn.opt+' '+ (this.form.opts.length + 1),
                    desc: '',
                    url: '',
                    arrow: 0,
                    arrowText: '',
                    showImgUrl: '',
                    image: '',
                    mast: 0,
                    percentage: '0%',
                    howMuchVoteNum: 0
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
        handleOpenDesc(item){
            this.currentOpt2 = item;
            this.optTextDialog2 = true;
        },
        handleSave() {
            this.optTextDialog = false;
        },
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