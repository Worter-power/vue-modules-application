<template>
    <el-grader style="overflow: hidden;" :border="false" v-loading="saveLoading" :element-loading-text="$store.state.lang.qn.q101">
        <div slot="bodyRight">
            <div class="sy-qn-select-user" v-if="$store.state.unitType == 1">
                <span class="sy-theme-lightBackground"><b>{{$store.state.lang.qn.q116}}</b></span>
                <div>
                    <div style="padding: 10px;">
                        <el-input :placeholder="$store.state.lang.qn.b32" v-model="filterText"></el-input>
                    </div>
                    <el-tree :data="unitData" ref="tree" default-expand-all 
                        node-key="unitId" show-checkbox :filter-node-method="filterNode"
                        check-strictly :props="defaultProps" 
                        @check-change="handleCheckChange" highlight-current>
                    </el-tree>
                </div>
            </div>
            <div class="sy-qn-select-units" :class="{'is-scholl': $store.state.unitType == 2}">
                <!-- 学校 -->
                <div class="qn-select-user" v-if="$store.state.unitType == 2">
                    <p class="sy-theme-background" v-if="questionType == 0">
                        {{$store.state.lang.qn[isRealName == '1' ? 'q114' : 'q121']}}
                    </p>
                    <p class="sy-theme-background" v-else>
                        {{$store.state.lang.qn[isRealName == '1' ? 'b52' : 'b54']}}
                    </p>
                    <!-- 实名 -->
                    <div @click="selectRespondObj" v-if="isRealName == '1'">
                        <p v-if="selectedBySchool.length == 0">{{$store.state.lang.qn[questionType == 0 ? 'q115' : 'b53']}}</p>
                        <div v-else>
                            <el-tag  style="margin: 3px;" v-for="row in selectedBySchool" :key="row.id">{{row.realName}}</el-tag>
                        </div>
                    </div>
                    <!-- 匿名 -->
                    <div style="text-align: center;line-height: 280px" v-if="isRealName == '0'">
                        <el-input-number size="mini" v-model="schoolNum" :min="0" :max="10000" style="width: 120px"></el-input-number>
                    </div>
                </div>
                <!-- 教育局 -->
                <template v-if="$store.state.unitType == 1">
                    <ul v-if="isRealName == '1'">
                        <li v-for="item in sekectList" :key="item.id">
                            <div style="text-align: right;">
                                <span style="float: left;padding-left:15px;">{{item.name}}</span>
                                <el-checkbox-group size="mini" v-model="item.checkList" 
                                    @change="handleUtypeChage(item)"
                                    style="display: inline-block; line-height: 26px;margin-right: 10px;">
                                    <el-checkbox label="2">{{$store.state.lang.qn.q117}}</el-checkbox>
                                    <el-checkbox label="1">{{$store.state.lang.qn.q118}}</el-checkbox>
                                    <el-checkbox label="3">{{$store.state.lang.qn.q119}}</el-checkbox>
                                </el-checkbox-group>
                                <el-button style="margin-right:5px;" @click="handleSelectUser(item)">{{$store.state.lang.qn.q120}}</el-button>
                            </div>
                            <div class="selected-users">
                                <el-tag  style="margin: 3px;"
                                    v-for="row in item.selected" :key="row.id">{{row.realName}}</el-tag>
                            </div>
                        </li>
                    </ul>
                    <ul v-else>
                        <li style="text-align: right;">
                            <span>{{$store.state.lang.qn[this.questionType == 0 ? 'q122' : 'b58']}}：</span>
                            <el-input-number size="mini"  :controls="false" 
                                v-model="defaultNum" :min ="0" :max="10000" style="width: 60px;margin-right:5px;" precision="0"></el-input-number>
                        </li>
                        <li v-for="item in sekectList" :key="item.id">
                            <div>
                                <span style="padding-left:15px;">{{item.name}}</span>
                                <div style="float: right;">
                                    <el-input-number size="mini" :placeholder="$store.state.lang.qn.q121" 
                                    v-model="item.qnNum" :min="0" :max="10000" style="width: 120px"></el-input-number>
                                </div>
                            </div>
                        </li>
                    </ul>
                </template>
            </div>
        </div>
        <div slot="footer" class="center">
            <el-button @click="handleBack" >{{$store.state.lang.button.cancel}}</el-button>
            <el-button  @click="handlePrestep(3)">{{$store.state.lang.qn.q123}}</el-button>
            <el-button  :loading="saveLoading" @click="submitData">{{$store.state.lang.button.save}}</el-button>
        </div>
    </el-grader>
</template>

<script>
import { selectUnitList } from "../../request.js";
import methods from './methods.js';
export default {
    mixins: [methods],
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    data() {
        return {
            filterText: '',
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            isRealName: this.$route.query.realName,
            unitData: [],
            schoolNum: [],
            sekectList: [],
            selectedBySchool: [],
            defaultNum: 100
        }
    },
    mounted(){
        this.init();
    },
    methods: {
        init(){
            if(this.$store.state.unitType == 1){
                this.getUnitList();
            }else{
                this.getStep3Data();
            }
        },
        // 获取单位列表
        getUnitList(){
            this.data = [];
            selectUnitList().then(res=>{
                this.unitData = this.$data2tree(res, 'unitId', 'parentId')
                this.getStep3Data();
            }).catch(err=>{

            })
        },
        // 第三部获取数据
        getStep3Data(){
            if(!this.$route.query.qnid){return}
            return new Promise((resove,reject)=>{
                request('get', '/api/qn/qnObject/find', {qid: this.$route.query.qnid}).then((res)=>{
                    if(res.code == 'ok'){
                        if(res.data){
                            // 选中单位列表
                            if(res.data.qnObjectUnitVMs){
                                if(this.$route.query.realName == '0'){ // 匿名
                                    if(this.$store.state.unitType == 1){ // 教育局
                                        let arr = [];
                                        res.data.qnObjectUnitVMs.forEach((_s,s)=>{
                                            arr.push({
                                                unitId: _s.unitId,
                                                name: _s.unitName,
                                                qnNum: _s.number,
                                                checkList: [],
                                            })
                                        })
                                        this.sekectList = arr;
                                        // 重置复选框
                                        if(this.$refs.tree){
                                            this.$refs.tree.setCheckedKeys(this.$_.map(this.sekectList, 'unitId'));
                                        }
                                    }else{ // 学校
                                        this.schoolNum = res.data.qnObjectUnitVMs.length>0 ? res.data.qnObjectUnitVMs[0].number : 0;
                                    }
                                }else{ // 实名
                                    if(this.$store.state.unitType == 1){ // 教育局
                                        let arr = [];
                                        res.data.qnObjectUnitVMs.forEach((_s,s)=>{
                                            let selected = [];
                                            if(res.data.qnObjectUserVMs){
                                                res.data.qnObjectUserVMs.forEach((_d,d)=>{
                                                    if(_d.unitId == _s.unitId){
                                                        selected.push({
                                                            id: _d.userId,
                                                            realName: _d.userName
                                                        })
                                                    }
                                                })
                                            }
                                            arr.push({
                                                unitId: _s.unitId,
                                                name: _s.unitName,
                                                qnNum: _s.number,
                                                selected: _s.userType ? [] : selected,
                                                checkList: _s.userType ? _s.userType.split(',') : []
                                            })
                                            
                                        })
                                        this.sekectList = arr;
                                        // 重置复选框
                                        if(this.$refs.tree){
                                            this.$refs.tree.setCheckedKeys(this.$_.map(this.sekectList, 'unitId'));
                                        }
                                    }else{ // 学校
                                        let arr = [];
                                        if(res.data.qnObjectUserVMs){
                                            res.data.qnObjectUserVMs.forEach((_d,d)=>{
                                                arr.push({
                                                    id: _d.userId,
                                                    realName: _d.userName
                                                })
                                            })
                                        }
                                        this.selectedBySchool = arr;
                                    }
                                }
                            }
                        }
                        resove(res)
                    }else{
                        reject(res)
                    }
                }).catch((err)=>{
                    reject(err)
                })
            })
            
        },
        handleCheckChange(data, checked, indeterminate) {
            let arr = this.$refs.tree.getCheckedNodes() || [];
            let _arr = [];
            arr.forEach((_s,s)=>{
                if(_s.type != 'stage'){
                    if(!this.$_.find(this.sekectList, {unitId: _s.unitId})){
                        _s.selected = [];
                        _s.checkList = [];
                        _s.qnNum = this.defaultNum;
                        _arr.push(_s);
                    }else{
                        _arr.push(this.$_.find(this.sekectList, {unitId: _s.unitId}));
                    }
                }
            })
            this.sekectList = this.$_.cloneDeep(_arr);
        },
        // 选择调查对象
        selectRespondObj() {
            let _m = this.$_.map(this.selectedBySchool, 'id');
            this.$SelectUsers({
                    lang: this.$store.state.langType,
                    unitType: 2,
                    // userTypes: [],
                    selectUserType: 1,
                    unitId: this.unitId,
                    selectUserIds: _m
                },
                (selectUsers, instance) => {
                    this.selectedBySchool = selectUsers
                }
            );
        },
        handleSelectUser(data){
            let _m = this.$_.map(data.selected, 'id');
            this.$SelectUsers({
                    lang: this.$store.state.langType,
                    unitType: data.type == 'unit' ? 1 : data.type == 'school' ? 2 : '',
                    // userTypes: [],
                    selectUserType: 1,
                    unitId: data.unitId,
                    selectUserIds: _m
                },
                (selectUsers, instance) => {
                    if(selectUsers.length > 0){
                        data.checkList = [];
                    }
                    let arr = [];
                    this.sekectList.forEach((_s,s)=>{
                        if(_s.unitId == data.unitId){
                            _s.selected = selectUsers;
                        }
                        arr.push(_s)
                    })
                    this.sekectList = arr;
                }
            );
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        submitData(){
            let objparam = {
                qnObjectUnitVMs: [],
                qnObjectUserVMs: [],
                qnid: this.$route.query.qnid,
                type: this.$route.query.type
            };
            if(this.$store.state.unitType == 1){
                this.sekectList.forEach((_s,s)=>{
                    objparam.qnObjectUnitVMs.push({
                        number: _s.qnNum || undefined,
                        unitId: _s.unitId,
                        unitName: _s.name,
                        userType: _s.checkList.join(','),
                        qnid: this.$route.query.qnid,
                    })
                    if(_s.selected){
                        _s.selected.forEach((_d,d)=>{
                            objparam.qnObjectUserVMs.push({
                                userId: _d.id,
                                qnid: this.$route.query.qnid,
                                userName: _d.realName,
                                unitId: _s.unitId,
                                unitName: _s.name
                            })
                        })
                    }
                })
            }else{
                objparam.qnObjectUnitVMs.push({
                    qnid: this.$route.query.qnid,
                    number: this.$route.query.realName != '1' ? this.schoolNum : undefined,
                    unitId: this.$store.state.unitId,
                    unitName: this.$store.state.unitName
                })
                this.selectedBySchool.forEach((_s,s)=>{
                    objparam.qnObjectUserVMs.push({
                        userId: _s.id,
                        qnid: this.$route.query.qnid,
                        userName: _s.realName,
                        unitId: this.$store.state.unitId,
                        unitName: this.$store.state.unitName
                    })
                })
            }
            let param = {
                qnid: this.$route.query.qnid,
                type: this.$route.query.type
            }
            if(this.$store.state.unitType == 1){
                let arrs = [];
                let users = 0;
                let isparss = [];
                this.sekectList.forEach((_s,s)=>{
                    if(_s.checkList.length>0){
                        param[`qnObjectUnitVMs[${s}].qnid`] = this.$route.query.qnid;
                        param[`qnObjectUnitVMs[${s}].unitId`] = _s.unitId;
                        param[`qnObjectUnitVMs[${s}].unitName`] = _s.name;
                        param[`qnObjectUnitVMs[${s}].userType`] = _s.checkList.join(',');
                        param[`qnObjectUnitVMs[${s}].number`] = _s.qnNum || undefined;
                        
                    }else{
                        param[`qnObjectUnitVMs[${s}].qnid`] = this.$route.query.qnid;
                        param[`qnObjectUnitVMs[${s}].unitId`] = _s.unitId;
                        param[`qnObjectUnitVMs[${s}].unitName`] = _s.name;
                        param[`qnObjectUnitVMs[${s}].number`] = _s.qnNum || undefined;
                        if(_s.selected) {
                            _s.selected.forEach((_d,d)=>{
                                param[`qnObjectUserVMs[${users}].qnid`] = this.$route.query.qnid;
                                param[`qnObjectUserVMs[${users}].userId`] = _d.id;
                                param[`qnObjectUserVMs[${users}].userName`] = _d.realName;
                                param[`qnObjectUserVMs[${users}].unitId`] = _s.unitId;
                                param[`qnObjectUserVMs[${users}].unitName`] = _s.name;
                                users++;
                            })
                        }             
                    }
                    if(this.$route.query.realName == '1'){
                        if(_s.selected.length == 0 && _s.checkList.length == 0 ){
                            isparss.push({name: _s.name})
                        }
                    }else{
                        if(_s.qnNum <= 0){
                            isparss.push({name: _s.name})
                        }
                    }
                })
                for (let i = 0; i < isparss.length; i++) {
                    let element = isparss[i];
                    this.$notify({
                        title: this.$store.state.lang.qn.q29,
                        message: this.$route.query.realName == '1' ? 
                            `${element.name} ${this.$store.state.lang.qn.q129}` : 
                            `${element.name} ${this.$store.state.lang.qn.q130}`,
                        type: 'warning'
                    });
                    return
                }
            }else{
                param['qnObjectUnitVMs[0].qnid'] = this.$route.query.qnid;
                param['qnObjectUnitVMs[0].unitId'] = this.$store.state.unitId;
                param['qnObjectUnitVMs[0].unitName'] = this.$store.state.unitName;
                param['qnObjectUnitVMs[0].number'] = this.$route.query.realName != '1' ? this.schoolNum : undefined;
                this.selectedBySchool.forEach((_s,s)=>{
                    param[`qnObjectUserVMs[${s}].qnid`] = this.$route.query.qnid;
                    param[`qnObjectUserVMs[${s}].userId`] = _s.id;
                    param[`qnObjectUserVMs[${s}].userName`] = _s.realName;
                    param[`qnObjectUserVMs[${s}].unitId`] = this.$store.state.unitId;
                    param[`qnObjectUserVMs[${s}].unitName`] = this.$store.state.unitName;
                })
                if(this.$route.query.realName == '1'){
                    if(this.selectedBySchool.length == 0){
                        this.$notify({
                            title: this.$store.state.lang.qn.q29,
                            message: this.$store.state.lang.qn[this.questionType == 0 ? 'q131' : 'b57'],
                            type: 'warning'
                        });
                        return
                    }
                }else{
                    if(this.schoolNum == 0){
                        this.$notify({
                            title: this.$store.state.lang.qn.q29,
                            message: this.$store.state.lang.qn[this.questionType == 0 ? 'q132' : 'b56'],
                            type: 'warning'
                        });
                        return
                    }
                }
            }
            this.saveLoading = true;
            if(objparam.qnObjectUnitVMs.length > 0) {
                request('POST', '/api/qn/qnObject', objparam, false).then((res)=>{
                    if(res.status == 200 && res.code == 'ok' && res.data == 'success'){
                        this.$notify({
                            title: this.$store.state.lang.qn.q133,
                            message: this.$store.state.lang.message.success,
                            type: 'success'
                        });
                        this.handleBack();
                    }
                this.saveLoading = false;
                }).catch(err=>{
                    this.saveLoading = false;
                })
            }else {
                this.$notify({
                    title:this.$store.state.lang.message.info,
                    message:this.$store.state.lang.qn.b103,
                    type:"info"
                })
                this.saveLoading = false;
            }
        },
        handleUtypeChage(data){
            if(data.checkList.length > 0){
                data.selected = [];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.qn-select-user>p {
    text-align: center;
    font-size: 14px;
    color: #fff;
    background-color: #3c5617;
    line-height: 32px;
    padding: 0 10px;
}

.qn-select-user>div {
    min-height: 300px;
    cursor: pointer;
    border: 1px solid #ccc;
    background-color: #fff;
}

.qn-select-user>div>p {
    line-height: 300px;
    text-align: center;
    color: #999999;
}

.sy-qn-select-user{
    border: 1px solid #bfcbd9;
    overflow: hidden;
    position: absolute;
    width: 300px;
    left: 0;
    bottom: 0;
    top: 0;
    >span{
        line-height: 40px;
        padding: 0 10px;
        background-color: #E7FDD9;
        box-sizing: border-box;
        display: block;
        border-bottom: 1px solid #bfcbd9;
        height: 40px;
        
    }
    >div{
        position: absolute;
        top: 40px;
        min-height: 40px;
        box-sizing: border-box;
        bottom: 0;
        width: 100%;
        overflow-y: auto;
        overflow-x: auto;
    }
}
.sy-qn-select-units{
    position: absolute;
    left: 300px;
    height: 100%;
    box-sizing: border-box;
    bottom: 0;
    overflow-y: auto;
    right: 0;
    border: 1px solid #bfcbd9;
    border-left: 0;
    &.is-scholl{
        left: 0;
        border: none;
    }
    >ul>li{
        line-height: 36px;
        border-bottom: 1px solid #bfcbd9;
    }
}
</style>