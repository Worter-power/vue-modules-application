<template>
    <div class="qn-report-container" v-loading="pageLoading">
        <div class="qn_statc_header sy-theme-border sy-theme-lightBackground">
            <div v-if="$store.state.unitType == 1" style="padding: 10px;overflow: hidden;">
                <el-select v-model="currentUnitId" style="width: 220px;margin-right: 10px;" @change="handleChange">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <h3>
                <span>{{qnData.name}}</span>
            </h3>
        </div>
        <div class="qn_statc_body sy-theme-border">
            <el-row style="text-align: right;padding: 0 10px;line-height: 40px;">
                <el-col :span="8">
                    <p style="text-align: left;padding: 0 10px;">{{$store.state.lang.qn.b13}} {{currentName}}</p>
                </el-col>
                <el-col :span="8">
                    <p style="text-align: center;padding: 0 10px;">{{$store.state.lang.qn.b14}}{{qnData.effective || 0}}</p>
                </el-col>
                <el-col :span="8">
                    <p style="text-align: right;padding: 0 10px;">{{$store.state.lang.qn.b1}} {{qnData.beginDate}}</p>
                </el-col>
            </el-row>
            <ul>
                <li v-for="(item, index) in qnData.titleList" :key="item.id">
                    <div class="qn-question-title" style="line-height: 30px;margin-top: 10px;">
                        <b>{{index+1}}. <span class="sy-theme-text" style="float:right;">[{{$store.state.lang.qn[`question${item.type}`]}}]</span></b>
                        <el-radio-group style="float:right;margin-top: 6px;" 
                            v-if="item.type != 3"
                            v-model="item.chartType" size="mini" @change="handleDrawChart(item)">
                            <el-radio-button label="table">{{$store.state.lang.qn.b20}}</el-radio-button>
                            <el-radio-button label="bar">{{$store.state.lang.qn.b21}}</el-radio-button>
                            <el-radio-button v-if="item.type != 2" label="pie">{{$store.state.lang.qn.b22}}</el-radio-button>
                            <el-radio-button v-if="item.type == 2" label="line">{{$store.state.lang.qn.b23}}</el-radio-button>
                            <el-radio-button v-if="item.type == 2" label="radar">{{$store.state.lang.qn.b24}}</el-radio-button>
                        </el-radio-group>
                        <div v-html="item.title" style="margin-left: 60px;"></div>
                    </div>
                    <div v-if="item.chartType == 'table' && item.type != 3">
                        <el-table :data="item.statisticsList" border style="width: 100%">
                            <el-table-column prop="name" 
                                :label="item.type == 2 ?  $store.state.lang.qn.b6 : $store.state.lang.qn.opt" 
                                align="center" width="">
                                <template slot-scope="scope">
                                    <span>{{scope.row.name}}
                                        <el-tooltip v-if="scope.row.remarks && scope.row.remarks.length > 0" placement="top" effect="light">
                                            <div slot="content" class="remarks_pop">
                                                <div v-for="(rem,index) in scope.row.remarks" :key="index+'c'">
                                                    <b>{{index+1}}</b>.<span>{{rem}}</span>
                                                </div>
                                            </div>
                                            <el-button type="text">{{$store.state.lang.qn.b7}}</el-button>
                                        </el-tooltip>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="count" v-if="item.type != 2" :label="$store.state.lang.qn.b9" align="center" width="180"></el-table-column>
                            <el-table-column prop="proportion" :label="$store.state.lang.qn.b10" align="center" width="" 
                                v-if="item.type != 2">
                                <template slot-scope="scope">
                                    <el-progress v-if="!scope.row.islast" :text-inside="true" :stroke-width="14" 
                                        :percentage="scope.row.proportion ? parseFloat(scope.row.proportion) : 0 "
                                        status="success"></el-progress>
                                </template>
                            </el-table-column>
                            <el-table-column prop="proportion" 
                                v-show="item.type == 2"
                                v-for="(head, i) in item.header" 
                                :key="head.id" 
                                :label="head.name" align="center" width="">
                                <template slot-scope="scope">
                                    <span v-if="!scope.row.islast">{{scope.row[head.id+'_count']}}（{{scope.row[head.id+'_proportion']}}）</span>
                                    <span v-if="scope.row.islast && i == 0">{{scope.row.count}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div v-if="item.chartType != 'table' && item.type != 3" style="height: 300px;" :ref="`chart_${item.id}`"></div>
                    <div v-if="item.type == 3" style="padding: 0 24px;">
                        <p>{{$store.state.lang.qn.q35}} <span class="sy-theme-text">{{item.proportion}}</span> {{$store.state.lang.qn.b8}}</p>
                        <ul style="line-height: 24px;">
                            <li v-for="(txt,index) in item.fillText" :key="index">
                                <span>{{index+1}}：</span>
                                <span>{{txt}}</span>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>

        </div>
    </div>
</template>

<script>
import cps from "../common.js";
export default {
    mixins: [cps],
    data(){
        return {
            qnData: { },
        }
    },
    created(){
        console.log(this.questionType)
        if(this.$store.state.unitType == 1){
            this.getUnit();
        }else{
            this.currentUnitId = this.$store.state.unitId;
            this.currentName = this.$store.state.unitName;
            this.getData();
        }
    },
    methods: {
        handleChange(val){
            this.getData();
        },
        getData(api){
            this.pageLoading = true;
            this.qnData = [];
            request('get', '/api/qn/qnStatistics/unitStatistics', {
                qid: this.$route.query.id,
                unitId: this.currentUnitId,
                qnId: this.$route.query.id
            }).then(res=>{
                console.log(res);
                
                this.pageLoading = false;
                this.makeDate1(res);
            }).catch(err => {
                this.pageLoading = false;
            })
        },
        makeDate1(res){
            if(res.status == 200 && res.code == 'ok'){
                let maxOpt = 0;
                if(res.data && res.data.titleList){
                    let arr = [];
                    let _arr = [];
                    res.data.titleList.forEach((_s,s)=>{
                        if(_s){
                            let arr =  _s.statisticsList || [];
                            arr.push({
                                name: this.$store.state.lang.qn.b29,
                                count: _s.sum,
                                islast: true
                            })
                            _s.statisticsList = arr;
                            _s.chartType = 'table';
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
                            _arr.push(_s)
                        }
                    })
                    res.data.titleList = _arr;
                    this.qnData = res.data;
                }
            }
        },
        handleDrawChart(data){
            console.log(123)
            this.$nextTick(()=>{
                if(data.chartType == 'table'){return}
                let dom = this.$refs[`chart_${data.id}`][0];
                let myChart = echarts.init(dom);
                myChart.clear();
                let legendData = [];
                let xAxisData = [];
                let series = [];
                let seriesData = [];
                let indicator = [];
                if(data.type != 2 && data.type != 3){
                    data.statisticsList.forEach((_s,s)=>{
                        if(!_s.islast){
                            xAxisData.push(_s.name);
                            if(data.chartType == 'bar'){
                                seriesData.push(_s.count)
                            }else{
                                seriesData.push({
                                    value: _s.count,
                                    name: _s.name
                                })
                                legendData.push(_s.name)
                            }
                        }
                    })
                    series = [{
                        name: '',
                        type: data.chartType,
                        center: ['50%', '60%'],
                        radius : '55%',
                        data: seriesData
                    }];
                }
                if(data.type == 2){
                    let _legendData = [];
                    data.statisticsList.forEach((_s,s)=>{
                        if(!_s.islast){
                            xAxisData.push(_s.name);
                            let arr = [];
                            _s.qnStatisticsMatrixItemVMs.forEach((_a,a)=>{
                                arr.push(_a);
                            })
                            _legendData = arr;
                        }
                    })
                    if(data.chartType == 'bar' || data.chartType == 'line' ){
                        _legendData.forEach((_s,s)=>{
                            legendData.push(_s.name);
                            let obj = {
                                name: _s.name,
                                type: data.chartType,
                                center: [ (s+1)*30 + '%', '60%'],
                                radius : '55%',
                                data: []
                            }
                            data.statisticsList.forEach((_a,a)=>{
                                if(!_a.islast){
                                    obj.data.push(this.$_.find(_a.qnStatisticsMatrixItemVMs, {id: _s.id}).count)
                                }
                            })
                            series.push(obj)
                        })
                    }else if(data.chartType == 'radar'){
                        let seriesDatas = [];
                        let max = 0;
                        _legendData.forEach((_s,s)=>{
                            legendData.push(_s.name);
                            if(_s.count > max){
                                max = _s.count
                            }
                            let obj = {
                                value : [],
                                name: _s.name
                            }
                            data.statisticsList.forEach((_a,a)=>{
                                if(!_a.islast){
                                    obj.value.push(this.$_.find(_a.qnStatisticsMatrixItemVMs, {id: _s.id}).count)
                                }
                            })
                            seriesDatas.push(obj)
                        })
                        data.statisticsList.forEach((_s,s)=>{
                            if(!_s.islast){
                                indicator.push({
                                    name: _s.name,
                                    max: max
                                })
                            }
                        })
                        series.push({
                            name: '',
                            type: 'radar',
                            data: seriesDatas
                        })
                        
                    }
                }
                let option = {
                    tooltip: {
                        trigger: data.chartType == 'radar' ? 'item' : 'axis',
                        confine: true
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        bottom: 20,
                        data: legendData
                    },
                    grid: {
                        left: '3%',
                        top: "3%",
                        right: '8%',
                        bottom: '3%',
                        containLabel: true
                    },
                    series: series
                }
                if(data.chartType != 'pie'){
                    option.xAxis = {
                        show: data.chartType == 'pie' || data.chartType == 'radar' ? false : true,
                        type: 'category',
                        boundaryGap: true,
                        data: xAxisData
                    };
                    option.yAxis = {
                        show: data.chartType == 'pie' || data.chartType == 'radar' ? false : true,
                        type: 'value'
                    };
                }
                
                if(data.type == 2 && data.chartType == 'radar'){
                    option.radar = {
                        name: {
                            textStyle: {
                                color: '#fff',
                                backgroundColor: '#999',
                                borderRadius: 3,
                                padding: [3, 5]
                        }
                        },
                        indicator: indicator
                    }
                }
                myChart.setOption(option);
            })
            
        }
    }
    
}
</script>

<style lang="scss" scoped>

</style>