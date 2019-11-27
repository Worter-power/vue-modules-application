<template>
    <div class="qn-report-container" v-loading="pageLoading">
        <div class="qn_statc_header sy-theme-border">
            <h3> <span>{{qnData.name}}</span> </h3>
            <div style="padding:10px;">
                <p style="float: right;">{{$store.state.lang.qn.b1}} {{qnData.beginDate}} {{$store.state.lang.qn.b62}} {{qnData.endDate}}</p>
                <el-select v-model="currentUnitId" style="width: 220px;margin-right: 10px;" @change="handleChange">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <ul class="qn_statc_body sy-theme-border">
            <li v-for="(item, index) in qnData.titleList" :key="item.id">
                <div class="qn-question-title" style="line-height: 30px;margin-top: 5px;">
                    <b>{{index+1}}. <span class="sy-theme-text">[{{$store.state.lang.qn[`question${item.type}`]}}]</span></b>
                    <el-button type="text" v-if="item.type != 1 && item.type != 0" style="float: right;margin-top: 5px;" @click="open(item)">{{$store.state.lang.qn.b5}}</el-button>
                    <div v-html="item.title" style="margin-left: 60px;"></div>
                </div>
                <template v-if="item.type != 3">
                    <div style="overflow: hidden;">
                        <el-tabs v-model="item.tab" @tab-click="handleClick(item)" style="float:right">
                            <el-tab-pane :label="$store.state.lang.qn.b20" name="table"></el-tab-pane>
                            <el-tab-pane :label="$store.state.lang.qn.b22" name="pie"></el-tab-pane>
                            <el-tab-pane :label="$store.state.lang.qn.b21" name="bar"></el-tab-pane>
                        </el-tabs>
                    </div>
                    <div :ref="item.id">
                        <el-table v-show="item.tab == 'table'" :data="item.tableData" border style="width: 100%">
                            <el-table-column prop="name" :label="item.type == 2 ? $store.state.lang.qn.b6 : $store.state.lang.qn.opt" 
                                align="center" width="">
                                <template slot-scope="scope">
                                    <span>{{scope.row.name}}
                                        <el-tooltip v-if="scope.row.remarks && scope.row.remarks.length > 0 && questionType == 0" placement="top" effect="light">
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
                            <el-table-column prop="count" v-if="item.type != 2" label="票数" align="center" width="180"></el-table-column>
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
                    <div v-show="item.tab == 'pie'" :ref="'pie'+item.id" class="qn-charts"></div>
                    <div v-show="item.tab == 'bar'" :ref="'bar'+item.id" class="qn-charts"></div>
                </template>
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
            }
        }
    },
    created(){
        this.getUnit();
    },
    methods: {
        handleChange(val){
            this.getData();
        },
        getData(){
            this.pageLoading = true;
            this.qnData = [];
            request('get', '/api/qn/qn_vote_statistics/report', { qnId: this.$route.query.id, unitId: this.currentUnitId }).then(res=>{
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
                        _s.tab = 'table';
                        _s.myCharts= {
                            table: true,
                            pie: false,
                            bar: false
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
                            // 统计行
                            let tableData = [];
                            if(_s.qnVoteOptionsVMList){
                                let totle = 0;
                                tableData = _s.qnVoteOptionsVMList.filter(o=>{
                                    totle = totle + parseInt(o.count)
                                    return true
                                });
                                tableData.push({
                                    name: this.$store.state.lang.qn.b96,
                                    count: totle,
                                    islast: true
                                })
                            }

                            tableData.push({
                                name: this.$store.state.lang.qn.b97,
                                count: _s.sum,
                                islast: true
                            })
                            _s.tableData = tableData;

                        }
                        _arrs.push(_s);
                    })
                    res.data.titleList = _arrs;
                }
                this.qnData = res.data;
            }
        },
        handleClick(item){
            // 避免重复绘制
            if(!item.myCharts[item.tab]){
                // 绘制图标表
                let dom = this.$refs[item.tab+item.id][0];
                if(dom){
                    this.handleDrawChart(item, dom);
                }
                item.myCharts[item.tab] = true;
            }
        },
        handleDrawChart(data, dom){
            this.$nextTick(()=>{
                dom.innerHTML = '';
                let myChart = echarts.init(dom);
                myChart.clear();
                let option = {
                    backgroundColor: 'rgba(242,242,242,1)',
                    tooltip: {
                        show: data.tab == 'pie',
                        trigger: data.tab == 'pie' ? 'item' : 'axis',
                        confine: true
                    },
                    legend: {
                        show: data.tab == 'pie',
                        type: 'scroll',
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        bottom: 20,
                        data: []
                    },
                    grid: {
                        left: '5%',
                        top: data.tab == 'bar' ? '10%' : "3%",
                        right: data.tab == 'bar' ? '5%' : "8%",
                        bottom: '5%',
                        containLabel: true
                    },
                    xAxis: {
                        show: data.tab == 'bar',
                        type: 'category',
                        boundaryGap: true,
                        data: []
                    },
                    yAxis: {
                        show: data.tab == 'bar',
                        type: 'value'
                    },
                    series: []
                }
                // 柱状图 bar 饼状图 pie
                // 饼图
                let series = [];
                if(data.tab == 'pie'){
                    option.legend.data = data.qnVoteOptionsVMList.map(o=>{return o.name});
                    series = [{
                        name: '',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data: data.qnVoteOptionsVMList.map(o=>{return {name: o.name, value: o.count}}),
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            normal:{
                                show: true,
                                formatter: '{b}: {c} ( {d}% )'
                            } 

                        }
                    }]
                }else{
                    option.xAxis.data = data.qnVoteOptionsVMList.map(o=>{return o.name});
                    series = [{
                        name: '',
                        type: 'bar',
                        data: data.qnVoteOptionsVMList.map(o=>{return o.count}),
                        label: {
                            normal:{
                                show: true,
                                formatter: '{c}票',
                                position: 'top'
                            } 

                        }
                    }]
                }
                option.series = series;
                
                myChart.setOption(option);
            })
            
        },
        open(data){
            this.$emit('details', data)
        }
    }
    
}
</script>

<style lang="scss" scoped>

</style>