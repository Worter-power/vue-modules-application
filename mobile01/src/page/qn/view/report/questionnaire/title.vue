<template>
    <div class="qn-report-container" v-loading="pageLoading">
        <div class="qn_statc_header sy-theme-border">
            <h3> 
                <span>{{qnData.name}}</span> 
                <el-button type="text" 
                    :disabled="!qnData.titleList.length" 
                    v-download="{ table: true, fileName: qnData.name+$store.state.lang.qn.b2 }">
                    {{$store.state.lang.qn.b105}}
                </el-button>
            </h3>
            <p>{{$store.state.lang.qn.b1}} {{qnData.beginDate}} {{$store.state.lang.qn.b62}} {{qnData.endDate}}</p>
        </div>
        <ul class="qn_statc_body sy-theme-border">
            <li v-for="(item, index) in qnData.titleList" :key="item.id">
                <div class="qn-question-title" style="line-height: 30px;margin-top: 5px;">
                    <b>{{index+1}}. <span class="sy-theme-text">[{{$store.state.lang.qn[`question${item.type}`]}}]</span></b>
                    <el-button type="text" style="float: right;margin-top: 5px;" @click="open(item)">{{$store.state.lang.qn.b5}}</el-button>
                    <div v-html="item.title" style="margin-left: 60px;"></div>
                </div>
                <div v-if="item.type != 3">
                    <table v-show="false" :data-download-options="JSON.stringify({
                        title: `[${$store.state.lang.qn[`question${item.type}`]}]${item.title}`})">
                        <tbody>
                            <tr>
                                <td>{{$store.state.lang.qn.opt}}</td>
                                <td>{{$store.state.lang.qn.b9}}</td>
                                <td>{{$store.state.lang.qn.b10}}</td>
                            </tr>
                            <tr v-for="row in item.statisticsList" :key="row.id">
                                <td>{{row.name}}</td>
                                <td>{{row.count}}</td>
                                <td>{{row.proportion}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <el-table :data="item.statisticsList" border style="width: 100%">
                        <el-table-column prop="name" 
                            :label="item.type == 2 ? $store.state.lang.qn.b6 : $store.state.lang.qn.opt" 
                            align="center" width="">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}
                                    <el-tooltip v-if="scope.row.remarks && scope.row.remarks.length > 0" placement="top" effect="light">
                                        <div slot="content" class="remarks_pop">
                                            <div v-for="(rem,index) in scope.row.remarks" :key="rem">
                                                <b>{{index+1}}</b>.<span>{{rem}}</span>
                                            </div>
                                        </div>
                                        <el-button type="text">{{$store.state.lang.qn.b7}}</el-button>
                                    </el-tooltip>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="count" v-if="item.type != 2" 
                            :label="$store.state.lang.qn.b9" align="center" width="180"></el-table-column>
                        <el-table-column prop="proportion" :label="$store.state.lang.qn.b10" align="center" width="" 
                            v-if="item.type != 2">
                            <template slot-scope="scope">
                                <el-progress v-if="!scope.row.islast" :text-inside="true" :stroke-width="14" 
                                    :percentage="scope.row.proportion ? parseFloat(scope.row.proportion) : 0 "
                                    status="success"></el-progress>
                            </template>
                        </el-table-column>
                        <el-table-column prop="proportion" 
                            v-for="(head, i) in item.header" 
                            v-show="item.type == 2"
                            :key="head.id" 
                            :label="head.name" align="center" width="">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.islast">{{scope.row[head.id+'_count']}}（{{scope.row[head.id+'_proportion']}}）</span>
                                <span v-if="scope.row.islast && i == 0">{{scope.row.count}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import cps from "../common.js";
export default {
    mixins: [cps],
    data(){
        return {
            qnData: {
                titleList: []
            },
        }
    },
    created(){
        console.log(this.questionType)
        this.init();
    },
    methods: {
        init(){
            if(this.$store.state.unitType == 1){
                this.getUnit();
            }else{
                this.currentUnitId = this.$store.state.unitId;
            }
            this.getData();
        },
        getData(){
            this.pageLoading = true;
            this.qnData = {
                 titleList: []
            }
            request('get', '/api/qn/qnStatistics/titleStatistics', { qid: this.$route.query.id }).then(res=>{
                this.makeDate(res);
                this.pageLoading = false;
            }).catch(err => {
                this.pageLoading = false;
            })
        },
        makeDate(res){
            if(res.status == 200 && res.code == 'ok'){
                if(res.data && res.data.titleList){
                    let _arrs = [];
                    res.data.titleList.forEach((_s,s)=>{
                        if(_s){
                            let arr =  _s.statisticsList || [];
                            arr.push({
                                name: this.$store.state.lang.qn.b29,
                                count: _s.sum,
                                islast: true
                            })
                            _s.statisticsList = arr;
                            // remarks 重置
                            if(_s.type == 0 || _s.type == 1){
                                if(_s.statisticsList){
                                    _s.statisticsList.forEach(val=>{
                                        let remarks = [];
                                        if(val.remarks){
                                            val.remarks.forEach(re=>{
                                                if(re){
                                                    remarks.push(re);
                                                }
                                            })
                                        }
                                        val.remarks = remarks;
                                    })
                                }
                            }
                            if(_s.type == 2){
                                let headers = [];
                                if(_s.statisticsList.length>1){
                                    headers = _s.statisticsList[0].qnStatisticsMatrixItemVMs;
                                }
                                _s.statisticsList.forEach((_a,a)=>{
                                    if(!_a.islast){
                                        _a.qnStatisticsMatrixItemVMs.forEach((_d,d)=>{
                                            _a[_d.id+'_count'] = _d.count;
                                            _a[_d.id+'_proportion'] = _d.proportion;
                                        })
                                    }
                                })
                                _s.header = headers;
                            }else{
                                _s.header = [];
                            }
                            _arrs.push(_s);
                        }
                    })
                    res.data.titleList = _arrs;
                }
                this.qnData = res.data;
            }
        },
        open(data){
            this.$emit('details', data)
        }
    }
    
}
</script>

<style lang="scss" scoped>

</style>