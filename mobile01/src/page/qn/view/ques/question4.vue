<template>
    <div class="qn-creat-question">
        <div :class="{'qn-question': !show}">
            <div class="qn-question-title" v-html="`${form.name || $store.state.lang.qn.c35}`"></div>
        </div>
        <div v-if="!show" >
            <p>{{$store.state.lang.qn.question4}}</p>
            <el-ueditor ref="quetion_title" id-name="quetion_title" 
                :defaultMsg="form.name  || $store.state.lang.qn.c35"  
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
    data(){
        return {
            saveLoading: false,
            form: {
                id: '',
                sort: '',
                name: '',
                type: 4,
                componentId: 'question4'
            }
        }
    },
    created(){
        this.init();
    },
    methods: {
        init(){
            if(this.data.id){
                this.form = this.$_.cloneDeep(this.data);
            }else{
                this.form.id = this.num;
                this.form.name = this.$store.state.lang.qn.c35;
                this.form.sort = this.num;
            }
        },
        handleComputed(code){
            this.getContent();
            if(!this.form.name && code != 'remove'){
                this.$notify({
                    title: this.$store.state.lang.qn.q29,
                    message: this.$store.state.lang.qn.b93,
                    type: 'warning'
                });
                return
            }
            this.form.code = code;
            this.saveLoading = true;
            this.$emit('save-sub', this.form)
        },
        getContent(){
            let text = this.$refs['quetion_title'].editor.getContent();
            this.form.name = text;
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
