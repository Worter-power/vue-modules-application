<template>
    <div class="qn-report-container" v-loading="pageLoading">
        <div class="qn_statc_header sy-theme-border">
            <h3> <span>{{qnData.name}}</span> 
                <el-button :disabled="!qnData.datas.length" type="text" v-download="{ table: true, fileName: qnData.name+$store.state.lang.qn.b98 }">{{$store.state.lang.qn.b105}}</el-button>
            </h3>
            <p>{{$store.state.lang.qn.b1}} {{qnData.beginDate}} {{$store.state.lang.qn.b62}} {{qnData.endDate}}</p>
        </div>
        <ul class="qn_statc_body sy-theme-border">
            <li v-for="(item,index) in qnData.datas" :key="item.id">
                <table class="sy-base-table-border hover" :data-download-options="JSON.stringify({})">
                    <tbody>
                        <tr>
                            <td style="width: 120px">{{$store.state.lang.qn.q59}}</td>
                            <td style="text-align: left;padding: 0 10px;" :style="{width: item.colspan*120 + 'px'}" :colspan="item.colspan">{{index +1}}</td>
                        </tr>
                        <tr>
                            <!-- 投票内容 -->
                            <td>{{$store.state.lang.qn.b92}}</td>
                            <td style="text-align: left;padding: 0 10px;" :colspan="item.colspan">
                                <div v-html="item.title"></div>
                            </td>
                        </tr>
                        <tr>
                            <!-- 总票数 -->
                            <td>{{$store.state.lang.qn.b94}}</td>
                            <td style="text-align: left;padding: 0 10px;" :colspan="item.colspan">{{item.totle}}</td>
                        </tr>
                        <tr>
                            <!-- 投票人数 -->
                            <td>{{$store.state.lang.qn.b95}}</td>
                            <td style="text-align: left;padding: 0 10px;" :colspan="item.colspan">{{item.sum}}</td>
                        </tr>
                        <tr>
                            <!-- 选项 -->
                            <td rowspan="2">{{$store.state.lang.qn.opt}}</td>
                            <td v-for="card in item.qnVoteOptionsVMList" :key="card.id">
                                {{card.name}}
                            </td>
                        </tr>
                        <tr>
                            <!-- 选项 -->
                            <td v-for="card in item.qnVoteOptionsVMList" :key="card.id">
                                <span>{{card.count}}{{$store.state.lang.qn.b65}}</span>
                                <span>{{card.proportion || '0%'}}</span>
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
            }
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
            request('get', '/api/qn/qn_vote_statistics/report', { qnId: this.$route.query.id, unitId: this.$store.state.unitId }).then(res=>{
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
                    let colspan = 0;
                    if(_s.qnVoteOptionsVMList){
                        _s.qnVoteOptionsVMList.forEach((_d,d)=>{
                            totle = totle + parseInt(_d.count)
                        })
                        colspan = _s.qnVoteOptionsVMList.length;
                    }else{
                        _s.qnVoteOptionsVMList = [];
                    }
                    _s.totle = totle;
                    _s.colspan = colspan;
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