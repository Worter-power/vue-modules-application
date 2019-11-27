<template>
    <div class="sy-home-body sy-qn sy-qn-bg-w">
        <el-grader :border="false">
            <div slot="headerRight" style="padding-top: 20px;">
                <div class="qn-home-container">
                    <el-button @click="$router.push('/qn/home/pre')"  style="float: right;" >
                        {{$store.state.lang.button.back}}
                    </el-button>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/qn/home/pre' }">{{$store.state.lang.qn.b99}}</el-breadcrumb-item>
                        <el-breadcrumb-item v-if="$route.query.type == 0">{{$store.state.lang.qn.b51}}</el-breadcrumb-item>
                        <el-breadcrumb-item v-if="$route.query.type == 1">{{$store.state.lang.qn.b60}}</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>
            <div slot="bodyRight" style="overflow: auto;">
                <div class="qn-home-container">
                    <div class="qn-home-container-t">
                        <el-tabs v-model="activeName" tab-position="top" @tab-click="handleClick" ref="tabs">
                            <el-tab-pane :label="$store.state.lang.qn.q39" name="ongoingList"></el-tab-pane>
                            <el-tab-pane :label="$store.state.lang.qn.q40" name="beginList"> </el-tab-pane>
                            <el-tab-pane :label="$store.state.lang.qn.q41" name="endList"></el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="qn-home-container-b" v-loading="pageLoading">
                        <div v-if="activeName == 'endList' && $store.state.unitType == 2" style="margin-bottom: 10px;">
                            <span>{{$store.state.lang.qn.q42}}</span>
                            <el-select v-model="paramsList.yearValue" style="width: 120px;margin-right: 10px;" @change="handleChangeYear">
                                <el-option v-for="item in yearValueOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <span>{{$store.state.lang.qn.q43}}</span>
                            <el-select v-model="paramsList.termValue" style="width: 140px;margin-right: 10px;">
                                <el-option v-for="item in termValueOptions" :key="item.value" 
                                    :label="$store.state.lang.qn.term[item.value+''] || item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <el-row :gutter="20" v-if="dataList[activeName].length > 0">
                            <el-col :span="12" v-for="(row,index) in dataList[activeName]" :key="index">
                                <item :data="row"></item>
                            </el-col>
                        </el-row>
                        <div v-else class="sy-empty-text">
                            {{$store.state.lang.qn.b19}}
                        </div>
                    </div>
                </div>
            </div>
        </el-grader>
    </div>
</template>

<script>
    import item from "./item.vue";
    import {
        getYearlist,
        getTermlist
    } from "../request.js";
    export default {
        components: {
            item
        },
        data() {
            return {
                pageLoading: false,
                paramsList: {
                    yearValue: '',
                    termValue: ''
                },
                yearValueOptions: [],
                termValueOptions: [],
                activeName: 'ongoingList',
                dataList: {
                    endList: [],
                    beginList: [],
                    ongoingList: []
                },
                oldTableData: []
            };
        },
        created() {
            this.init();
        },
        watch: {
            'paramsList': {
                handler(newVal, oldVal){
                    console.log(newVal, oldVal)
                    if(newVal.yearValue && newVal.termValue){
                        if(this.activeName == 'endList'){
                            this.getData();
                        }
                    }
                },
                deep: true
            }
        },
        methods: {
            init() {
                this.activeName = this.$route.query.label || 'ongoingList';
                if(this.activeName == 'endList' && this.$store.state.unitType == 2){
                    this.getYearlist();
                }
                this.getData();
            },
            getData(){
                this.pageLoading = true;
                request('get', '/api/qn/qnStatistics/homePage', {
                    schoolYear: this.paramsList.yearValue, 
                    schoolPeriod: this.paramsList.termValue,
                    type: this.$route.query.type
                }).then(res=>{
                    this.pageLoading = false;
                    if(res.status == 200 && res.code == 'ok'){
                        this.dataList.endList = res.data.endList || [];
                        this.dataList.ongoingList = res.data.ongoingList || [];
                        this.dataList.beginList = res.data.beginList || [];
                    }
                }).catch(err => {
                    this.pageLoading = false;
                })
            },
            handleClick(tab){
                this.$router.push({path: '/qn/home/list', query: {type: this.$route.query.type ,label: this.activeName}})
                if(this.activeName == 'endList' && this.$store.state.unitType == 2){
                    this.getYearlist();
                }else{
                    this.paramsList.yearValue = undefined;
                    this.paramsList.termValue = undefined;
                    this.getData();
                }
            },
            getYearlist() {
                getYearlist(this.$store.state.unitId).then(res => {
                    let arr = [];
                    let current = '';
                    if(res){
                        res.forEach((_s,s)=>{
                            arr.push({
                                value: _s.year,
                                label: _s.year
                            })
                            if(_s.current){
                                current = _s.year;
                            }
                        })
                    }
                    this.paramsList.yearValue = current;
                    this.yearValueOptions = arr;
                }).catch(err => {

                })
            },
            handleChangeYear(val){
                if(val){
                    this.getTerms()
                }
            },
            getTerms(){
                getTermlist(this.$store.state.unitId, this.paramsList.yearValue).then(res=>{
                    let arr = [];
                    let current = '';
                    if(res){
                        res.forEach((_s,s)=>{
                            arr.push({
                                value: _s.schoolTerm,
                                label: _s.name
                            })
                            if(_s.current == 1){
                                current = _s.schoolTerm;
                            }
                        })
                    }
                    this.paramsList.termValue = current || (arr.length > 0 ? arr[0].value : '');
                    this.termValueOptions = arr;
                })
            }
        }
    }
</script>

<style scoped>
    .qn-home-container {
        max-width: 1220px;
        margin: 0 auto;
        position: relative;
        height: 100%;
    }

    .qn-home-container-t {
        position: absolute;
        top: 20px;
        left: 0;
        height: 54px;
        width: 100%;
    }

    .qn-home-container-b {
        position: absolute;
        top: 74px;
        left: 0;
        bottom: 20px;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        overflow-y: auto;
    }
</style>