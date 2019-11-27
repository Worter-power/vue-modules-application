<template>
    <div class="sy-home-body sy-qn">
        <el-grader>
            <div slot="headerRight">
                <el-button style="float:right;margin-top: 5px;" @click="handlerBack">{{$store.state.lang.button.back}}</el-button>
                <el-tabs v-model="componentId" @tab-click="handleClick" style="margin-right: 100px;">
                    <!-- 投票学校报表 -->
                    <el-tab-pane v-if="questionsType == 1 && $store.state.unitType == 2" :label="$store.state.lang.qn.b2" name="ttitle"></el-tab-pane>
                    <el-tab-pane v-if="questionsType == 1 && $store.state.unitType == 2" :label="$store.state.lang.qn.b98" name="report"></el-tab-pane>
                    <!-- 投票教育局报表 -->
                    <el-tab-pane v-if="questionsType == 1 && $store.state.unitType == 1" :label="$store.state.lang.qn.b2" name="unittitle"></el-tab-pane>
                    <el-tab-pane v-if="questionsType == 1 && $store.state.unitType == 1" :label="$store.state.lang.qn.b3" name="unitcharts"></el-tab-pane>
                    <el-tab-pane v-if="questionsType == 1 && $store.state.unitType == 1" :label="$store.state.lang.qn.b4" name="unittable"></el-tab-pane>
                    <!-- 问卷报表 -->
                    <el-tab-pane v-if="questionsType != 1" :label="$store.state.lang.qn.b2" name="rtitle"></el-tab-pane>
                    <el-tab-pane v-if="questionsType != 1" :label="$store.state.lang.qn.b3" name="rcharts"></el-tab-pane>
                    <el-tab-pane v-if="questionsType != 1" :label="$store.state.lang.qn.b4" name="rtable"></el-tab-pane>
                </el-tabs>
            </div>
            <div slot="bodyRight" class="qn-report" v-if="componentId">
                <component :is="componentId" :questionType="questionsType" @details="open"></component>
            </div>
        </el-grader>
        <el-dialog2 :title="$store.state.lang.qn.b5" height="auto" width="700px" :visible.sync="detailsDiloag">
            <div slot="body" style="padding: 15px;overflow: auto;max-height: 600px">
                <div class="qn-question-title" style="line-height: 30px;margin-top: 5px;">
                    <b>{{detailsData.number}}. <span style="color: #61a205" class="sy-theme-text">[{{$store.state.lang.qn[`question${detailsData.type}`]}}]</span></b>
                    <div v-html="detailsData.title" style="margin-left: 60px;"></div>
                </div>
                <div v-if="detailsData.type == 3">
                    <p>{{$store.state.lang.qn.q35}} <span style="color:#61a205;">{{detailsData.proportion}}</span> {{$store.state.lang.qn.b8}}</p>
                    <ul style="padding-left: 30px;line-height: 24px;">
                        <li v-for="(txt,index) in detailsData.fillText" :key="index">
                            <span>{{index+1}}：</span>
                            <span>{{txt}}</span>
                        </li>
                    </ul>
                </div>
                <div v-if="detailsData.type == 0 || detailsData.type == 1 || detailsData.type == 6">
                    <el-table :data="detailsData.tableData" border style="width: 100%;margin: 8px 0;">
                        <el-table-column prop="unitName" 
                            :label="$store.state.lang.qn.b26" 
                            min-width="100px"
                            align="center" width="">
                        </el-table-column>
                        <el-table-column prop="proportion" 
                            v-for="head in detailsData.header" 
                            :key="head.id" 
                            min-width="100px"
                            :label="head.name" align="center" width="">
                            <template slot-scope="scope">
                                <span>{{scope.row[head.id+'_count']}}</span><span>（{{scope.row[head.id+'_proportion'] || '0%'}}）</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sum" 
                            :label="$store.state.lang.qn.b28" 
                            align="center" width="50">
                        </el-table-column>
                    </el-table>
                    <p>{{$store.state.lang.qn.b25}}{{detailsData.sum}}</p>
                    <div>
                        <div style="text-align: right;">
                            <el-radio-group v-model="chartsType" size="mini" @change="drawChart">
                                <el-radio-button label="bar">{{$store.state.lang.qn.b21}}</el-radio-button>
                                <el-radio-button label="line">{{$store.state.lang.qn.b23}}</el-radio-button>
                                <el-radio-button label="dj">{{$store.state.lang.qn.b27}}</el-radio-button>
                            </el-radio-group>
                        </div>
                        <div style="height: 350px;" ref="mychart">

                        </div>
                    </div>
                </div>
                <div v-if="detailsData.type == 2">
                    <el-table :data="detailsData.tableData" border style="width: 100%;margin: 8px 0;">
                        <el-table-column prop="unitName" 
                            :label="$store.state.lang.qn.b26" 
                            min-width="100px"
                            align="center" width="">
                        </el-table-column>
                        <el-table-column prop="proportion" 
                            v-for="head in detailsData.header" 
                            :key="head.id" 
                            min-width="100px"
                            :label="head.name" align="center" width="">
                            <el-table-column v-for="row in head.children" :key="row.id" 
                                prop="unitName" 
                                :label="row.name" 
                                min-width="100px"
                                align="center" width="">
                                <template slot-scope="scope">
                                    <span>{{scope.row[head.id+'-'+row.id+'_count']}}</span><span>（{{scope.row[head.id+'-'+row.id+'_proportion'] || '0%'}}）</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column prop="sum" 
                            :label="$store.state.lang.qn.b28" 
                            align="center" width="50">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button style="margin: 0 3px;" @click="detailsDiloag = false"  >{{$store.state.lang.button.close}}</el-button>
            </div>
        </el-dialog2>
    </div>
</template>

<script>
import rtitle from './questionnaire/title.vue';
import rcharts from './questionnaire/unit-cahrts.vue';
import rtable from './questionnaire/unit-table.vue';
import ttitle from './vote/title.vue';
import report from './vote/report.vue';
import unittitle from './vote/unit-title.vue';
import unitcharts from './vote/unit-charts.vue';
import unittable from './vote/unit-table.vue';
export default {
    components: {
        rtitle,
        rcharts,
        rtable,
        report,
        ttitle,
        unittitle,
        unitcharts,
        unittable
    },
    data(){
        return {
            componentId: 'rtitle',
            detailsData: [],
            detailsDiloag: false,
            chartsType: 'bar',
            mychart: null,
            questionsType: this.$route.query.type
        }
    },
    created(){
        let first = this.questionsType == 1 ? (this.$store.state.unitType == 1 ? 'unittitle' :'ttitle') : 'rtitle';
        this.componentId = this.$route.query.componentId || first;
        console.log()
    },
    methods: {
        handlerBack(){
            this.$router.push({
                path: this.$route.query.res ? '/qn/home/list' : (this.questionsType == 1 ? '/qn/manager/pages/tp' :'/qn/manager/pages/home'),
                query: {
                    type: this.questionsType,
                    label: this.$route.query.label
                }
            })
        },
        handleClick(tab){
            this.$router.push({ path: '/qn/manager/bb', query: {
                id: this.$route.query.id,
                type: this.questionsType,
                componentId: this.componentId
            } })
        },
        open(data){
            this.detailsDiloag = true;
            if(data.type != 3){
                request('get', '/api/qn/qnStatistics/statisticsDetailed', {
                    titleId: data.id
                }).then(res=>{
                    let datas = this.$_.cloneDeep(data);
                    let tableData = [];
                    let header = [];
                    if(res && res.data){
                        res.data.forEach((_s,s)=>{
                            let obj = {
                                unitName: _s.unitName,
                                unitId: _s.unitId,
                                type: _s.type,
                                sum: _s.sum,
                                typeName: _s.typeName,
                            }
                            let arr = [];
                            _s.statisticsList.forEach((_d,d)=>{
                                if(data.type != 2){
                                    obj[_d.id+'_count'] = _d.count;
                                    obj[_d.id+'_proportion'] = _d.proportion;
                                    obj[_d.id+'_name'] = _d.name;
                                }else{
                                    _d.qnStatisticsMatrixItemVMs.forEach((_a,a)=>{
                                        obj[_d.id+'-'+_a.id+'_count'] = _a.count;
                                        obj[_d.id+'-'+_a.id+'_proportion'] = _a.proportion;
                                        obj[_d.id+'-'+_a.id+'_name'] = _a.name;
                                    })
                                }
                                arr.push({
                                    name: _d.name,
                                    id: _d.id,
                                    children: _d.qnStatisticsMatrixItemVMs || []
                                })
                            })
                            tableData.push(obj);
                            header = arr;
                        })
                    }
                    datas.header = header;
                    datas.tableData = tableData;
                    this.detailsData = datas;
                    if(data.type == 0 || data.type == 1 || data.type == 6){
                        this.drawChart();
                    }
                }).catch(err => {
                    this.pageLoading = false;
                })
            }else{
                this.detailsData = data;
            }
        },
        
        drawChart(){
            this.$nextTick(()=>{
                this.myChart = echarts.init(this.$refs.mychart);
                let legendData = this.detailsData.header.map(o=>{return o.name});
                
                let series = [];
                let xAxisData = [];
                this.detailsData.header.forEach((_s,s)=>{
                    let obj = {
                        name: _s.name,
                        type: this.chartsType == 'dj' ? 'bar' : this.chartsType,
                        stack: this.chartsType == 'dj' ? this.$store.state.lang.qn.b30 : null,
                        data: []
                    }
                    this.detailsData.tableData.forEach((_d,d)=>{
                        obj.data.push(_d[_s.id+'_count']);
                    })
                    series.push(obj);
                    
                })
                this.detailsData.tableData.forEach((_d,d)=>{
                    xAxisData.push(_d.unitName)
                })
                let option = {
                    tooltip: {
                        trigger: 'axis',
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
                        right: '15%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: this.chartsType == 'bar' || this.chartsType == 'dj' ? true : false,
                        data: xAxisData
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: series
                }
                this.myChart.setOption(option);
            })
        },
    }
}
</script>

<style lang="scss" scoped>

</style>