<template>
    <div class="qn-creat-question">
        <div :class="{'qn-question': !show}">
            <b class="qn-question-title" v-html="`${form.name}`"></b>
            <div style="text-align: center;">
                <b>{{$store.state.lang.qn.q18}}{{form.startNum}}{{$store.state.lang.qn.q19}}</b>
                <b>/</b>
                <b>{{$store.state.lang.qn.q14}}{{form.totles}}{{$store.state.lang.qn.q19}}</b>
            </div>
            <div v-if="showpages" class="center">
                <el-button :disabled="form.startNum == 1" @click="handlePageChange(form.startNum-1)">上一页</el-button>
                <el-button :disabled="form.startNum == form.totles" @click="handlePageChange(form.startNum*1+1)">下一页</el-button>
            </div>
        </div>
        <div v-if="!show">
            <p>{{$store.state.lang.qn.c37}}</p>
            <el-ueditor ref="quetion_title" id-name="quetion_title" 
                :defaultMsg="form.name"  
                v-model="form.name" 
                :config="ueconfig" class="sy-ue-select" :maxLen="1000"></el-ueditor>
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
    props: {
        start: {
            type: Number,
            default: 0
        },
        totles: {
            type: Number,
            default: 0
        },
        showpages: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            saveLoading: false,
            form: {
                id: '',
                sort: '',
                name: '',
                componentId: 'question5',
                type: 5,
                startNum: 0,
                totles: 0
            }
        }
    },
    created(){
        this.init();
    },
    methods: {
        init(){
            if(this.data.id){
                this.form = this.data;
            }else{
                this.form.id = this.num;
                this.form.name = '';
                this.form.sort = this.num;
                this.form.startNum = this.start;
                this.form.totles = this.totles;
            }
        },
        handleComputed(code){
            this.getContent()
            this.form.code = code;
            this.$emit('save-sub', this.form)
        },
        getContent(){
            let text = this.$refs['quetion_title'].editor.getContent();
            this.form.name = text;
        },
        handlePageChange(page){
            this.$emit('pagechange', page)
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
