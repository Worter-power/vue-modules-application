<template>
    <div class="qn-report-container" v-loading="pageLoading">
        <div class="qn_statc_header sy-theme-border sy-theme-lightBackground">
            <div class="qn-ctr">
                <el-select v-if="$store.state.unitType == 1" v-model="currentUnitId" style="width: 220px;margin-right: 10px;" @change="handleChange">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button v-download="{table: true}" type="primary" style="float:right;">{{$store.state.lang.button.download}} <i class="el-icon-download"></i>
                </el-button>
                <el-radio-group style="float:right;margin-right: 8px;" v-model="tableType" >
                    <el-radio-button label="v">{{$store.state.lang.qn.b11}}</el-radio-button>
                    <el-radio-button label="h">{{$store.state.lang.qn.b12}}</el-radio-button>
                </el-radio-group>
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
            <table class="sy-base-table-border hover"
                v-if="tableType == 'v'"
                :data-download-options=" JSON.stringify({
                    title: currentName + qnData.name + $store.state.lang.qn.b15,
                    fileName: currentName + qnData.name + $store.state.lang.qn.b15
                }) " >
                <thead>
                    <tr>
                        <th style="width: 60px;">{{$store.state.lang.qn.q59}}</th>
                        <th style="width: 150px;">{{$store.state.lang.qn.b16}}</th>
                        <th style="width: 120px;">{{$store.state.lang.qn.b17}}</th>
                        <th style="width: 120px;" v-if="maxOpt !== 0">{{$store.state.lang.qn.b18}}</th>
                        <th v-for="(item,index) in maxOpt" :key="index" style="width: 80px;">
                            {{$store.state.lang.qn.opt}} {{item}}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in tableData" :key="item.id">
                        <td v-if="item.subShow" :rowspan="item.rows" style="line-height: 20px;">{{item.sort}}</td>
                        <td v-if="item.type != 3 && item.subShow" :rowspan="item.rows" style="line-height: 20px;">
                            <span class="qiest-title" v-html="item.name"></span>
                            <span class="sy-theme-text">[{{$store.state.lang.qn[`question${item.type}`]}}]</span>
                        </td>
                        <td v-if="item.type != 3  && item.subShow" :rowspan="item.rows" style="line-height: 20px;">{{item.sum}}</td>
                        <td v-if="item.type != 3" style="line-height: 20px;">{{item.subName}}</td>
                        <td v-if="item.type != 3" v-for="(opt,index) in maxOpt" :key="index" style="line-height: 20px;">
                            <span>{{item['opt_'+(opt-1)]}}</span>
                            <el-tooltip placement="top" effect="light" v-if="item[`opt_${opt-1}_remarks`] && item[`opt_${opt-1}_remarks`].length > 0">
                                <div slot="content" class="remarks_pop">
                                    <div v-for="(rem,index) in item[`opt_${opt-1}_remarks`]" :key="index+'sss'">
                                        <b>{{index+1}}</b>.<span>{{rem}}</span>
                                    </div>
                                </div>
                                <el-button type="text">{{$store.state.lang.qn.b7}}</el-button>
                            </el-tooltip>
                            <br>
                            <span>{{item['nums_'+(opt-1)]}}</span>
                        </td>
                        <td v-if="item.type == 3" style="text-align: center;padding: 0 10px;">
                            <span class="qiest-title" v-html="item.name"></span>
                            <span class="qiest-title sy-theme-text">[{{$store.state.lang.qn[`question${item.type}`]}}]</span>
                        </td>
                        <td v-if="item.type == 3" :colspan="maxOpt+(maxOpt == 0 ? 1 : 2)" style="text-align: left;padding: 0 10px;">
                            <div>
                                <p>{{$store.state.lang.qn.q35}} <span class="sy-theme-text">{{item.proportion}}</span> {{$store.state.lang.qn.b8}}</p>
                                <ul style="padding-left: 30px;line-height: 24px;max-height: 200px;overflow: auto;">
                                    <li v-for="(txt,index) in item.fillText" :key="index">
                                        <span>{{index+1}}：</span>
                                        <span>{{txt}}</span>
                                    </li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="tableData.length == 0">
                        <td :colspan="maxOpt+(maxOpt == 0 ? 3 : 4)">{{$store.state.lang.qn.b19}}</td>
                    </tr>
                </tbody>
            </table>
            <table class="sy-base-table-border hover"
                v-if="tableType == 'h'"
                :data-download-options=" JSON.stringify({
                    title: currentName + qnData.name + $store.state.lang.qn.b15,
                    fileName: currentName + qnData.name + $store.state.lang.qn.b15
                }) " >
                <thead>
                    <tr>
                        <th style="width: 150px;">{{$store.state.lang.qn.q59}}</th>
                        <th v-for="(item,index) in hheader" :key="index" 
                            v-show="item.show"
                            :colspan="item.cols" style="min-height: 150px;">
                            {{item.sort}}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in htableData" :key="item.id">
                        <td style="line-height: 20px;">{{item.rowName}}</td>
                        <td style="line-height: 20px;padding: 0 5px;" v-for="(head,index) in hheader" :key="index"
                            v-if="head.type == 3 ? (item.rowId == 'title' || item.rowId == 'sum' ? true : false) :
                                (item.rowId == 'title' || item.rowId == 'sum' ? head.show : true)" 
                            :colspan="item.rowId == 'title' || item.rowId == 'sum' ? head.cols : 1"
                            :rowspan="head.type == 3 && item.rowId == 'sum' ? htableData.length-1 : 1"
                            :style="{
                                'vertical-align': head.type == 3 && item.rowId == 'sum' ? 'top' : 'middle', 
                                'text-align': head.type == 3 && item.rowId == 'sum' ? 'left' : 'center'
                            }">
                            <div v-if="item.rowId == 'title'">
                                <span class="qiest-title" v-html="item[
                                    head.type == 2 ? 'parentName_'+head.parentId :'title_'+head.id
                                ]"></span>
                                <p style="color: #61a205" class="sy-theme-text">[{{item[
                                    head.type == 2 ? 'parenttypeName_'+head.parentId :'typeName_'+head.id
                                ]}}]</p>
                            </div>
                            <span v-if="item.rowId == 'sum' && head.type != 3">{{item['sum_'+(head.parentId||head.id)]}}</span>
                            <div v-if="item.rowId == 'sum' && head.type == 3">
                                <p>{{$store.state.lang.qn.q35}} <span class="sy-theme-text">{{item[`questions_${head.id}_3_proportion`]}}</span> {{$store.state.lang.qn.b8}}</p>
                                <ul style="padding-left: 30px;line-height: 24px;overflow: auto;">
                                    <li v-for="(txt,index) in item[`questions_${head.id}_3_fillText`]" :key="index">
                                        <span>{{index+1}}：</span>
                                        <span>{{txt}}</span>
                                    </li>
                                </ul>
                            </div>
                            <span v-if="item.rowId == 'subName'">{{item['subName_'+head.id]}}</span>
                            <span v-if="item.rowId != 'title'&&item.rowId != 'sum'&&item.rowId != 'subName'">
                                
                                <p>{{item[`questions_${head.id}_${item.rowId-1}_name`]}}
                                    <el-tooltip placement="top" effect="light"
                                        v-if="item[`questions_${head.id}_${item.rowId-1}_remarks`] && item[`questions_${head.id}_${item.rowId-1}_remarks`].length > 0">
                                        
                                        <div slot="content" class="remarks_pop">
                                            <div v-for="(rem,index) in item[`questions_${head.id}_${item.rowId-1}_remarks`]" :key="index+'cc'">
                                                <b>{{index+1}}</b>.<span>{{rem}}</span>
                                            </div>
                                        </div>
                                        <el-button type="text">{{$store.state.lang.qn.b7}}</el-button>
                                    </el-tooltip>
                                </p>
                                <span>{{item[`questions_${head.id}_${item.rowId-1}_count`]}}
                                    <span v-if="item[`questions_${head.id}_${item.rowId-1}_proportion`]">（{{item[`questions_${head.id}_${item.rowId-1}_proportion`]}}）</span>
                                </span>
                            </span>
                        </td>
                    </tr>
                    <tr v-if="htableData.length == 0">
                        <td :colspan="maxOpt+3">{{$store.state.lang.qn.b19}}</td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>
</template>

<script>
import cps from "../common.js";
export default {
    mixins: [cps],
    data(){
        return {
            qnData: {},
            tableType: 'v',
            maxOpt: 0,
            htableData: [],
            tableData: []
        }
    },
    created(){
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
                    res.data.titleList.forEach((_s,s)=>{
                        if(_s){
                            if(_s.type == 0 || _s.type == 1 || _s.type == 6|| _s.type == 2 ){
                                if(_s.type == 2){
                                    if(_s.statisticsList[0].qnStatisticsMatrixItemVMs.length > maxOpt){
                                        maxOpt = _s.statisticsList[0].qnStatisticsMatrixItemVMs.length;
                                    }
                                }else{
                                    if(_s.statisticsList.length > maxOpt){
                                        maxOpt = _s.statisticsList.length;
                                    }
                                }
                            }
                            let obj = {
                                sort: s+1,
                                name: _s.title,
                                sum: _s.sum,
                                type: _s.type,
                                subShow: true,
                                subName: '',
                                rows: 1,
                                typeName: _s.typeName
                            };
                            if(_s.type != 3){
                                if(_s.type == 2){
                                    _s.statisticsList.forEach((_d,d)=>{
                                        let _obj = this.$_.cloneDeep(obj);
                                        _obj.subName = _d.name;
                                        _obj.rows = _s.statisticsList.length || 0;
                                        _d.qnStatisticsMatrixItemVMs.forEach((_a,a)=>{
                                            _obj[`opt_${a}`] = _a ? _a.name : '/';
                                            _obj[`nums_${a}`] = _a ? `${_a.count}（${_a.proportion || '0%'}）` : '';
                                        })
                                        if(d != 0){
                                            _obj.subShow = false;
                                        }else{
                                            _obj.subShow = true;
                                        }
                                        arr.push(_obj);
                                    })
                                }else{
                                    for (let index = 0; index < _s.statisticsList.length; index++) {
                                        let item = _s.statisticsList[index];
                                        let remarks = [];
                                        if(item){
                                            if(item.remarks){
                                                item.remarks.forEach(re=>{
                                                    if(re){
                                                        remarks.push(re);
                                                    }
                                                })
                                            }
                                        }
                                        obj[`opt_${index}`] = item ? item.name : '/';
                                        obj[`opt_${index}_remarks`] = remarks;
                                        obj[`nums_${index}`] = item ? `${item.count}（${item.proportion || '0.0%'}）` : '';
                                    }
                                    arr.push(obj);
                                }
                            }else{
                                obj.proportion = _s.proportion;
                                obj.fillText = _s.fillText;
                                arr.push(obj);
                            }
                            
                        }
                    })
                    this.tableData = arr;
                    let _arr = [];
                    let rows = [
                        {name: this.$store.state.lang.qn.b16, id: 'title'}, 
                        {name: this.$store.state.lang.qn.b17, id: 'sum'}, 
                        {name: this.$store.state.lang.qn.b18, id: 'subName'}
                    ];
                    for (let v = 1; v <= maxOpt; v++) {
                        rows.push({name: this.$store.state.lang.qn.opt+ ' ' +v, id: v})   
                    }
                    this.maxOpt = maxOpt;
                    let hheader = [];
                    
                    res.data.titleList.forEach((_d,d)=>{
                        if(_d){
                            
                            if(_d.type == 0 || _d.type == 1 || _d.type == 6 || _d.type == 2 || _d.type == 3 ){
                                if(_d.type == 2){
                                    _d.statisticsList.forEach((_a,a)=>{
                                        hheader.push({
                                            id: _a.id,
                                            name: _a.name,
                                            parentId: _d.id,
                                            parentName: _d.title,
                                            show: a == 0 ? true : false,
                                            cols: _d.statisticsList.length,
                                            sort: d+1,
                                            typeName: _d.typeName,
                                            type: _d.type,
                                            sum:  _d.sum || _d.count
                                        })
                                    })
                                }else{
                                    hheader.push({
                                        id: _d.id,
                                        name: _d.title,
                                        show: true,
                                        cols: 1,
                                        sort: d+1,
                                        typeName: _d.typeName,
                                        type: _d.type,
                                        sum:  _d.sum || _d.count
                                    })
                                }
                            }
                        }
                    })
                    rows.forEach((_s,s)=>{
                        let obj = {
                            rowName: _s.name,
                            rowId: _s.id
                        }
                        hheader.forEach((_d,d)=>{
                            obj[`show_`+_d.id] = true;
                            obj[`cols_`+_d.id] = 1;
                            obj[`title_`+_d.id] = _d.name;
                            obj[`typeName_${_d.id}`] = _d.typeName;
                            if(_d.type == 2){
                                obj[`parenttypeName_${_d.parentId}`]= _d.typeName;
                                obj[`parentName_${_d.parentId}`]= _d.parentName;
                                obj[`subName_${_d.id}`]= _d.name;
                                obj[`sum_`+_d.parentId] = _d.sum;
                                let titiles = this.$_.find(res.data.titleList, {id: _d.parentId});
                                if(titiles){
                                    if(_s.id != 'title' && _s.id != 'sum' && _s.id != 'subName'){
                                        titiles.statisticsList.forEach((_q,q)=>{
                                            if(_q.qnStatisticsMatrixItemVMs[_s.id-1]){
                                                obj[`questions_${_d.id}_${_s.id-1}_name`] = _q.qnStatisticsMatrixItemVMs[_s.id-1].name;
                                                obj[`questions_${_d.id}_${_s.id-1}_count`] = _q.qnStatisticsMatrixItemVMs[_s.id-1].count;
                                                obj[`questions_${_d.id}_${_s.id-1}_proportion`] = _q.qnStatisticsMatrixItemVMs[_s.id-1].proportion;
                                            }
                                        })
                                    }
                                    
                                }
                            }else if(_d.type == 3){
                                obj[`sum_`+_d.id] = _d.sum;
                                if(_s.id == 'sum'){
                                    let titiles = this.$_.find(res.data.titleList, {id: _d.id});
                                    if(titiles){
                                        obj[`questions_${_d.id}_3_proportion`] = titiles.proportion;
                                        obj[`questions_${_d.id}_3_fillText`] = titiles.fillText;
                                    }
                                }
                            }else{
                                obj[`sum_`+_d.id] = _d.sum;
                                let titiles = this.$_.find(res.data.titleList, {id: _d.id});
                                
                                if(titiles){
                                    if(_s.id != 'title' && _s.id != 'sum' && _s.id != 'subName'){
                                        if(titiles.statisticsList[_s.id-1]){
                                            let remarks = [];
                                            if(titiles.statisticsList[_s.id-1].remarks){
                                                titiles.statisticsList[_s.id-1].remarks.forEach(re=>{
                                                    if(re){
                                                        remarks.push(re);
                                                    }
                                                })
                                            }
                                            obj[`questions_${_d.id}_${_s.id-1}_name`] = titiles.statisticsList[_s.id-1].name;
                                            obj[`questions_${_d.id}_${_s.id-1}_remarks`] = remarks;
                                            obj[`questions_${_d.id}_${_s.id-1}_count`] = titiles.statisticsList[_s.id-1].count;
                                            obj[`questions_${_d.id}_${_s.id-1}_proportion`] = titiles.statisticsList[_s.id-1].proportion;
                                        }
                                    }
                                    
                                }
                            }
                        })
                        _arr.push(obj)
                    })
                    
                    this.hheader = hheader;
                    this.htableData = _arr;
                    this.qnData = res.data;
                }
            }
        },
        
    }
    
}
</script>

<style lang="scss" scoped>

</style>