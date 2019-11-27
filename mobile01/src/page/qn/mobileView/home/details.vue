<template>
    <div class="mobile-body">
        <div class="qn-details">
            <h3>{{qnData.name}}</h3>
            <van-cell-group>
                <van-cell title="发布人" :value="qnData.createName" />
                <van-cell title="发布单位" :value="qnData.unitName" />
                <van-cell title="开始时间" :value="`${qnData.beginDate} ${qnData.beginTime}`" />
                <van-cell title="结束时间" :value="`${qnData.endDate} ${qnData.endTime}`" />
            </van-cell-group>

            <van-panel title="问卷说明:">
                <div class="qn-details-remark">{{qnData.remark}}</div>
            </van-panel>
            <div class="qn-details-title-box" v-for="(item,index) in qnData.tableData" :key="index">
                <van-index-anchor class="qn-details-title-opts"> 
                    <b v-if="item.must == 1" style="color: #f00">*</b>
                    <span>{{item.number}}. </span>
                    <span class="qn-details-title-name" v-html="item.title"></span>
                </van-index-anchor>
                <van-index-anchor class="qn-details-title-opts">
                    <!-- 单选题 -->
                    <van-radio-group v-model="item.radio" disabled v-if="item.type == 0">
                        <van-radio v-for="(row,index) in item.qnChooseItemVMs" :key="index+'radio'" :name="row.id">
                            {{row.name}}
                        </van-radio>
                    </van-radio-group>
                    <!-- 多选题 -->
                    <template v-if="item.type == 1">
                        <van-checkbox v-for="(row,index) in item.qnChooseItemVMs" disabled v-model="row.checked" :key="index+'check'" 
                            :name="row.id">
                            {{row.name}}
                        </van-checkbox>
                    </template>
                    <!-- 矩阵题 -->
                    <template v-if="item.type == 2">
                        <van-index-anchor v-for="(tr,index) in item.questions" :key="index">
                            <van-index-anchor>
                                <span>{{item.number}}-{{(index+1)}}. </span>
                                <span>{{tr.name}}</span>
                                <span>【{{item.isRadio == 0 ? "单选题" : "多选题"}}】</span>
                            </van-index-anchor>
                            <template>
                                <van-index-anchor v-for="td in tr.items" :key="td.number" >
                                    <van-radio-group disabled v-if="item.isRadio == 0" v-model="tr.radio">
                                        <van-radio :name="td.id">{{td.name}}</van-radio>
                                    </van-radio-group>
                                    <van-checkbox disabled v-model="td.checked" v-if="item.isRadio == 1"
                                        :name="td.id">{{td.name}}
                                    </van-checkbox>
                                </van-index-anchor>
                            </template>
                        </van-index-anchor>
                    </template>

                    <!-- 填空题 -->
                    <template v-if="item.type == 3">
                        <div class="qn-details-text">{{item.text}}</div>
                    </template>

                    <!-- 下拉选择 -->
                    <template v-if="item.type == 6">
                        <div class="qn-details-text">{{item.radio}}</div>
                    </template>
                </van-index-anchor>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            qnData: {
                tableData: []
            }
        }
    },
    created() {
        this.init();
    },
    methods: {
        // 初始化
        init(){
            this.getDataSource();
        },
        // 获取详情
        async getDataSource(){
            let data = await this.$request('get','/api/qn/qnTitle/query', {qid: this.$route.query.id});
            this.makeDate(data);
        },
        // 处理数据
        makeDate(res){

            console.log(res)
            if(res.status == 200 && res.code == 'ok'){
                let arr = [];
                let num = 1;
                let pageStart = 1;
                let totle = 0;
                if(res.data.qnTitleListVM.qnTitleVMs){
                    res.data.qnTitleListVM.qnTitleVMs.forEach((_s,s)=>{
                        if(_s.type != 4 && _s.type != 5){
                            totle++
                        }
                        let resutls = '';
                        let resutlsObj = {};
                        if(res.data.qnResultListVM.qnResultVMs){
                            res.data.qnResultListVM.qnResultVMs.forEach((val)=>{
                                if(val.titleId == _s.titleId){
                                    resutlsObj = val;
                                }
                            })
                        }
                        if(resutlsObj){
                            if(resutlsObj.type == 0){
                                resutls = resutlsObj.result;
                            }
                            if(resutlsObj.type == 6){
                                if(_s.qnTitleSelectOptionVMs){
                                    _s.qnTitleSelectOptionVMs.forEach((sel)=>{
                                        if(sel.id == resutlsObj.result){
                                            resutls = sel.name;
                                        }
                                    })
                                }
                            }
                            if(resutlsObj.type == 1){
                                resutls = resutlsObj.result ? resutlsObj.result.split(',') : [];
                            }
                            if(resutlsObj.type == 2){
                                resutls = resutlsObj.result ? resutlsObj.result.split(',') : [];
                            }
                            if(resutlsObj.type == 3){
                                resutls = resutlsObj.result;
                            }
                        }
                        _s.sort = num;
                        _s.text = _s.type == 3 ? resutls : '';
                        _s.finished = '';
                        _s.radio = resutls;
                        _s.check = [];
                        _s.result = '';
                        let items = [];
                        let isRadio = -1;
                        if(_s.type == 0){
                            if(resutlsObj){
                                _s.qnChooseItemVMs.forEach((_a,a)=>{
                                   if(_a.id == resutlsObj.result){
                                       _a.arrowText = resutlsObj.remark;
                                   }
                                })
                            }
                        }

                        if(_s.type == 1 && _s.qnChooseItemVMs){
                            let objs = {};
                            if(resutlsObj){
                                if(resutlsObj.remark){
                                    let arr = resutlsObj.remark.indexOf(',') != -1 ? resutlsObj.remark.split(',') : [resutlsObj.remark];
                                    arr.forEach((_s,s)=>{
                                        if(_s){
                                            let _arrs = _s.split('_');
                                            objs[_arrs[0]] = _arrs[1];
                                        }
                                    })
                                }
                            }
                            if(resutls && resutls.length > 0){
                                _s.qnChooseItemVMs.forEach((_a,a)=>{
                                    let pass = false;
                                    resutls.forEach((_d,d)=>{
                                        if(_d == _a.id){
                                            pass = true;
                                        }
                                    })
                                    _a.checked = pass;
                                    _a.arrowText = objs[_a.id] || '';
                                })
                            }
                        }
                        if(_s.qnMatrixItemVMs){
                            _s.qnMatrixItemVMs.forEach((_d,d)=>{
                                isRadio = _d.selType;
                                items.push({
                                    id: _d.id,
                                    name: _d.name,
                                    number: _d.number,
                                    selType: _d.selType,
                                    titleId: _d.titleId,
                                    checked: false,
                                    radio: ''
                                })
                            })
                        }
                        let questions = [];
                        // 矩阵
                        if(_s.type == 2){
                            if(_s.qnTitleMatrixVMs){
                                _s.qnTitleMatrixVMs.forEach((_d,d)=>{
                                    let radio = '';
                                    if(resutls && resutls.length > 0){
                                        resutls.forEach((_f,f)=>{
                                            items.forEach((_g,g)=>{
                                                // console.log(`${_d.id}_${_g.id}` == _f)
                                                if(_f == `${_d.id}_${_g.id}`){
                                                    radio = _g.id;
                                                }
                                                _g.checked = _f == `${_d.id}_${_g.id}`;
                                            })
                                        })
                                    }
                                    if(isRadio == 0){
                                        console.log('456',radio)
                                    }else{
                                        console.log('123',items)
                                    }
                                    // questions.push({
                                    //     id: _d.id,
                                    //     name: _d.subject,
                                    //     number: _d.number,
                                    //     titleId: _d.titleId,
                                    //     colspan: items.length
                                    // })
                                    questions.push({
                                        id: _d.id,
                                        name: _d.subject,
                                        number: _d.number,
                                        titleId: _d.titleId,
                                        radio: radio,
                                        colspan: 1,
                                        items: items ? JSON.parse(JSON.stringify(items)) : []
                                    })
                                })
                            }
                            
                        }
                        _s.questions = questions;
                        _s.items = items;
                        _s.isRadio = isRadio;
                        arr.push(_s);
                        if(_s.type != 4 && _s.type != 5){
                            num = num*1 + 1;
                        }
                    })
                }
                res.data.tableData = arr;
                res.data.totle = totle;
                this.qnData = res.data || {};
                console.log(this.qnData)
            }
        }
    }
}
</script>
<style lang="scss">
.qn-details{
    font-size: $font-size-large-xx;
    >h3{
        font-weight: bold;
        text-align: center;
        font-size: $font-size-large-xx;
        padding: .5rem 0;
        word-break: break-all;
    }
    .qn-details-remark{
        font-size: 13 * 0.02rem;
        line-height: 2 * 13 * 0.02rem;
        padding: px2rem(10) px2rem(15);
    }
    .qn-details-title-box{
        background-color: #fff;
        font-size: px2rem(14);
        padding: px2rem(10) px2rem(15) 0;
        .qn-details-title-opts{
            padding-bottom: px2rem(10);
            .van-radio,
            .van-checkbox{
                margin-bottom: 8px;
            }
        }
        .qn-details-title-name{
            font-size: px2rem(14);
            >*{
                display: inline;
                word-break: break-all;
            }

        }
    }
    .qn-details-text{
        padding: px2rem(10) px2rem(15);
        color: $--color-text-primary;
        border: 1px solid $--border-color-base;
        background-color: $--border-color-extra-light;
        border-radius: 3px;
    }
    table{
        width: 100%;
        border-top: 1px solid $--border-color-base;
        border-left: 1px solid $--border-color-base;
        line-height: .6rem;
        font-size: $font-size-small-xx;
        th{
            background-color: $--background-color-base;
        }
        th,td{
            border-right: 1px solid $--border-color-base;
            border-bottom: 1px solid $--border-color-base;
            text-align: center;
            vertical-align: middle;
        }
        td{
            padding-top: 8px;
            >*{
                display: inline-block;
                margin: 0;
            }
        }
    }
}
</style>