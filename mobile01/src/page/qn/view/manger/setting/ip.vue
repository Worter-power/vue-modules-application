<template>
    <div class="sy-app-container">
        <el-grader>
            <div slot="bodyLeft" v-if="$store.state.unitType == 1">
                <el-tree :data="data" 
                    default-expand-all 
                    style="height: 100%;"
                    node-key="id"
                    :props="defaultProps" 
                    highlight-current
                    @node-click="handleNodeClick">
                </el-tree>
            </div>
            <div slot="bodyRight" style="padding: 10px;">
                <el-table :data="tableData" border style="width: 100%; height: 100%;" height="100%">
                    <el-table-column prop="unitName" :label="$store.state.lang.qn.q140" align="center" width=""></el-table-column>
                    <el-table-column prop="ip" :label="$store.state.lang.qn.q141" align="center" width="">
                        <template slot-scope="scope">
                            <p v-for="item in scope.row.qnIpSetVMs" :key="item.id">
                                <span>{{item.beginIp}}</span>
                                <span style="padding: 0 5px;">~</span>
                                <span>{{item.endIp}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$store.state.lang.qn.q64" align="center" width="100">
                        <template slot-scope="scope">
                            <el-button style="margin: 0 3px;" @click="handleClick(scope.row)" type="text" >
                                <i class="fa fa-cog" aria-hidden="true" :title="$store.state.lang.qn.q142"></i>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-grader>
        <el-dialog2
            :title="$store.state.lang.qn.q142"
            height="250px"
            width="664px"
            slide="fade"
            :visible.sync="settingDialog">
            <div slot="body" style="padding:10px 20px;">
                <div v-for="(item,index) in addList" :key="item.id" style="padding: 5px 0;">
                    <el-input-number size="mini" v-model="item.beginIpList[0]" :min="1" :max="255" :controls="false" style="width: 55px;"></el-input-number>
                    <span>.</span>
                    <el-input-number size="mini" v-model="item.beginIpList[1]" :min="0" :max="255" :controls="false" style="width: 55px;"></el-input-number>
                    <span>.</span>
                    <el-input-number size="mini" v-model="item.beginIpList[2]" :min="0" :max="255" :controls="false" style="width: 55px;"></el-input-number>
                    <span>.</span>
                    <el-input-number size="mini" v-model="item.beginIpList[3]" :min="0" :max="255" :controls="false" style="width: 55px;"></el-input-number>
                    <span style="padding: 0 10px 0 5px;"> ~ </span>
                    <el-input-number size="mini" v-model="item.endIpList[0]" :min="1" :max="255" :controls="false" style="width: 55px;"></el-input-number>
                    <span>.</span>
                    <el-input-number size="mini" v-model="item.endIpList[1]" :min="0" :max="255" :controls="false" style="width: 55px;"></el-input-number>
                    <span>.</span>
                    <el-input-number size="mini" v-model="item.endIpList[2]" :min="0" :max="255" :controls="false" style="width: 55px;"></el-input-number>
                    <span>.</span>
                    <el-input-number size="mini" v-model="item.endIpList[3]" :min="0" :max="255" :controls="false" style="width: 55px;"></el-input-number>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-button type="text"  @click="handleClickAdd('add',index)">
                        <i class="fa fa-plus" aria-hidden="true"></i>
                    </el-button>
                    <el-button v-if="index != addList.length-1" type="text"  @click="handleClickAdd('remove', index)">
                        <i class="fa fa-times" style="color:#F56C6C" aria-hidden="true"></i>
                    </el-button>
                </div>
            </div>
            <div slot="footer">
                <el-button style="margin: 0 3px;" @click="settingDialog = false"  >{{$store.state.lang.button.cancel}}</el-button>
                <el-button style="margin: 0 3px;" @click="handleSave"  >{{$store.state.lang.qn.q75}}</el-button>
            </div>
        </el-dialog2>
    </div>
</template>

<script>
import { selectIPList, selectUnitListByStage, saveIPs, selectListIpS } from "../request.js";
export default {
    data() {
        return {
            reg: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            tableData: [],
            settingDialog: false,
            formInline: {
                start: '',
                end: ''
            },
            rules: {},
            currentData: {},
            addList: [],
            currentStage: ''
        }
    },
    created(){
        this.$parent.$emit("currentPage", "/qn/manager/pages/ip");
        this.init();
    },
    methods: {
        init(){
            if(this.$store.state.unitType == 1){
                this.getUnitList();
            }else{
                this.getUnit();
            }
        },
        // 获取本单位
        getUnit(){
            request('get', '/api/qn//qnIpSet/unit_ip_query', {}).then(res=>{
                if(res.status == 200 && res.code == 'ok'){
                    this.tableData = [{
                        unitName: res.data.unitName,
                        unitId: res.data.unitId,
                        qnIpSetVMs: res.data.qnIpSetVMs
                    }];
                }
            }).catch(err=>{

            })
        },  
        // 获取单位列表
        getUnitList(){
            this.data = [];
            selectUnitListByStage().then(res=>{
                let arr = [];
                if(res){
                    let obj = {
                        label: res.name,
                        id: res.id,
                        parentId: res.parentId,
                        type: res.type,
                        children: []
                    }
                    let _arr = [];
                    if(res.children){
                        res.children.forEach((_a,a)=>{
                            _arr.push({
                                label: _a.name,
                                id: _a.id,
                                parentId: _a.parentId,
                                type: _a.type,
                                children: [],
                                unitList: _a.children || []
                            })
                        })
                    }
                    obj.children = _arr;
                    arr.push(obj);
                }
                this.data = arr;
            }).catch(err=>{

            })
        },
        handleNodeClick(data) {
            this.tableData = [];
            if(data.type == 'stage'){
                this.currentStage = data.id;
                if(data.id || data.id*1 === 0){
                    this.getUnitListBystage();
                }
            }else{
                this.currentStage = '';
            }
            
        },
        handleClick(data){
            this.settingDialog = true;
            if(data.qnIpSetVMs.length > 0){
                let arr = [];
                data.qnIpSetVMs.forEach((_s,s)=>{
                    let obj = this.$_.cloneDeep(_s);
                    obj.beginIpList = _s.beginIp ? _s.beginIp.split('.') : [1,0,0,0];
                    obj.endIpList = _s.endIp ? _s.endIp.split('.') : [1,0,0,0];
                    arr.push(obj);
                })
                this.addList = this.$_.cloneDeep(arr);
            }else{
                this.addList = [{
                    id: '1',
                    beginIp: '',
                    endIp: '',
                    beginIpList: [1,0,0,0],
                    endIpList: [1,0,0,0]
                }];
            }
            this.currentData = data;
        },
        // 查询单位列表
        getUnitListBystage(){
            return new Promise((resove,reject)=>{
                selectListIpS(this.currentStage).then(res=>{
                    if(res){
                        res.forEach((_s,s)=>{
                            if(_s.qnIpSetVMs){
                                _s.qnIpSetVMs.forEach((_a,a)=>{
                                    _a.beginIpList = _a.beginIp ? _a.beginIp.split('.') : [];
                                    _a.endIpList = _a.endIp ? _a.endIp.split('.') : [];
                                })
                            }
                        })
                    }
                    this.tableData = res;
                    resove(res)
                }).catch(err=>{
                    reject(err)
                })
            })
        },
        handleClickAdd(t, index){
            if(t == 'add'){
                this.addList.push({
                    id: this.addList.length+1+'',
                    beginIp: '',
                    endIp: '',
                    beginIpList: [1,0,0,0],
                    endIpList: [1,0,0,0]
                })
            }else{
                this.addList.splice(index, 1);
            }
        },
        handleSave(){
            let obj = {
                unitId: this.currentData.unitId,
                unitName: this.currentData.unitName
            };
            this.addList.forEach((_s,s)=>{
                obj[`qnIpSetVMs[${s}].unitId`] = this.currentData.unitId;
                obj[`qnIpSetVMs[${s}].unitName`] = this.currentData.unitName;
                obj[`qnIpSetVMs[${s}].beginIp`] = _s.beginIpList.join('.');
                obj[`qnIpSetVMs[${s}].endIp`] = _s.endIpList.join('.');
            })
            saveIPs(obj).then(res=>{
                if(res == 'success'){
                    this.settingDialog = false;
                    this.currentData = {};
                    this.addList = [];
                    this.$notify({
                        title: this.$store.state.lang.qn.q133,
                        message: this.$store.state.lang.qn.q134,
                        type: 'success'
                    });
                    this.getUnitListBystage();
                }else{
                    this.$notify({
                        title: this.$store.state.lang.qn.q135,
                        message: this.$store.state.lang.qn.q136,
                        type: 'error'
                    });
                }
            })
                
        },
        validatePassStart(rule, value, callback) {
            if (value === '') {
                callback(new Error(this.$store.state.lang.qn.q138));
            } else {
                if(this.reg.test(value)){
                    callback();
                }else{
                    callback(new Error( this.$store.state.lang.qn.q137 ));
                }
            }
        },
        validatePassEnd(rule, value, callback) {
            if (value === '') {
                callback(new Error(this.$store.state.lang.qn.q139));
            } else {
                if(this.reg.test(value)){
                    callback();
                }else{
                    callback(new Error(this.$store.state.lang.qn.q137));
                }
            }
        }
    }
}
</script>

<style scoped>

</style>
