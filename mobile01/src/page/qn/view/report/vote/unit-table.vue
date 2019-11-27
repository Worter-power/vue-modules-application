<template>
    <div class="qn-report-container" v-loading="pageLoading">
        <div class="qn_statc_header sy-theme-border">
            <h3> 
                <span>{{qnData.name}}</span> 
                <el-button :disabled="!qnData.datas.length" type="text" v-download="{ table: true, fileName: qnData.name+$store.state.lang.qn.b4 }">{{$store.state.lang.qn.b105}}</el-button>
            </h3>
            <p>{{$store.state.lang.qn.b1}} {{qnData.beginDate}} {{$store.state.lang.qn.b62}} {{qnData.endDate}}</p>
        </div>
        <ul class="qn_statc_body sy-theme-border">
            <li v-for="(item,index) in qnData.datas" :key="item.id">
                <table class="sy-base-table-border hover" :data-download-options="JSON.stringify({})">
                    <tbody>
                        <tr>
                            <td style="width: 120px">{{$store.state.lang.qn.q59}}</td>
                            <td style="text-align: left;padding: 0 10px;" :style="{width: item.colOpts*120 + 'px'}" :colspan="item.colOpts">{{index +1}}</td>
                        </tr>
                        <tr>
                            <!-- 投票内容 -->
                            <td>{{$store.state.lang.qn.b92}}
                                <span class="sy-theme-text">[{{$store.state.lang.qn[`question${item.type}`]}}]</span>
                            </td>
                            <td style="text-align: left;padding: 0 10px;" :colspan="item.colOpts">
                                <div v-html="item.title"></div>
                            </td>
                        </tr>
                        <tr>
                            <!-- 总票数 -->
                            <td>{{$store.state.lang.qn.b94}}</td>
                            <td style="text-align: left;padding: 0 10px;" :colspan="item.colOpts">{{item.totle}}</td>
                        </tr>
                        <tr>
                            <!-- 投票人数 -->
                            <td>{{$store.state.lang.qn.b95}}</td>
                            <td style="text-align: left;padding: 0 10px;" :colspan="item.colOpts">{{item.sum}}</td>
                        </tr>
                        <tr v-for="unit in item.unitList" :key="unit.name">
                            <!-- 选项 -->
                            <td :rowspan="2" v-if="unit.id">{{unit.name}}</td>
                            <td style="padding: 0 15px;" v-for="card in unit.opts" :key="card.id">
                                <span v-if="unit.id">{{card.name}}</span>
                                <span v-else>{{card.count}}{{$store.state.lang.qn.b65}} <span>{{card.proportion || '0%'}}</span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                datas: []
            },
            currentUnitId: []
        }
    },
    created(){
        this.getData();
    },
    methods: {
        getData(){
            this.pageLoading = true;
            this.qnData = {
                datas: []
            };
            request('get', '/api/qn/qn_vote_statistics/unit', { qnId: this.$route.query.id }).then(res=>{
                this.makeDate(res.data);
                this.pageLoading = false;
            }).catch(err => {
                this.pageLoading = false;
            })
        },
        makeDate(res){
            console.log(res)
            let result = {
                name: res.name,
                remark: res.remark,
                id: res.remark,
                beginDate: res.beginDate,
                endDate: res.endDate
            }
            let datas = [];
            if(res.titleList){
                res.titleList.forEach((_s,s)=>{
                    let totle = 0;
                    let unitList = [];
                    let colOpts = 0; // 选项数
                    // 循环单位
                    if(_s.unitStaInfoList){
                        _s.unitStaInfoList.forEach((_d,d)=>{
                            if(_d.voteStatisticsVM && _d.voteStatisticsVM.qnVoteOptionsVMList){
                                _d.voteStatisticsVM.qnVoteOptionsVMList.forEach((_a,a)=>{
                                    totle = totle + parseInt(_a.count);
                                })
                                colOpts = _d.voteStatisticsVM.qnVoteOptionsVMList.length;
                            }
                            unitList.push({
                                id: _d.unitId,
                                name: _d.unitName,
                                opts: _d.voteStatisticsVM.qnVoteOptionsVMList || []
                            })
                            unitList.push({
                                name: _d.unitName,
                                opts: _d.voteStatisticsVM.qnVoteOptionsVMList || []
                            })
                        })
                    }
                    _s.unitList = unitList;
                    _s.totle = totle;
                    _s.colOpts = colOpts;
                    datas.push(_s);
                })
            }
            result.datas = datas;
            this.qnData = result;
        }   
    }
    
}
</script>

<style lang="scss" scoped>

</style>