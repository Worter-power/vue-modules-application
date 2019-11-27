<template>
    <div class="mobile-body">
        <div class="qn-desc">
            <div class="qn-desc-top">
                <h3>{{qnData.name}}</h3>
                <p>问卷说明：</p>
                <div>{{qnData.remark}}</div>
            </div>
            <div class="qn-desc-bottom">
                <van-button type="primary" style="width: 100%;" @click="handleStart">开始问卷</van-button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            qnData: {
                name: '',
                remark: ''
            }
        }
    },
    created() {
        this.init();
    },
    methods: {
        // 初始化
        /**
         * 1.从本地获取问卷信息 by ID
         * 2.没有先请求没有权限的详情接口，获取问卷类型，如果为实名问卷 则请求实名问卷详情接口
         * 3.将获取到的数据存储在localstorage中备用
         * 4.下次进入提高速度
         */
        init(){
            let storageDatas = window.localStorage.getItem(this.$route.query.id);
            // 获取详情
            this.getDataSource();
        },
        async getDataSource(){
            let data1 = await this.$request('get', '/api/qn/nologin/qnTitle/preview', {qid: this.$route.query.id});
            try {
                if(data1 && data1.status === 200){
                    if(data1.data.realName == 1){ // 实名问卷
                        let loginData = await this.$request('get', '/api/qn/nologin/qnExist/whether_login', {});
                        if(loginData.status == 200 && loginData.code == 'ok' && loginData.data){// 已经登录
                            let data2 = await this.$request('get', '/api/qn/qnTitle/preview', {qid: this.$route.query.id});
                            this.makeDate(data2, true);
                        }
                    }else{
                        this.makeDate(data1, false);
                    }
                }else{
                    // 请求出错
                }
            } catch (error) {
                
            }
            
        },
        // 处理数据
        makeDate(res, logined){
            if(!res.data){ return }
            // 问卷基本信息
            this.qnData.name = res.data.name;
            this.qnData.remark = res.data.remark;
            
            let dataObj = {
                qnData: {},
                data: [],
                totle: 0,
                pageList: [],
                totlePage: 0,
                logined: logined
                
            }
            if(res.status == 200 && res.code == 'ok'){
                let arr = [];
                let num = 1;
                let pageStart = 1;
                let totle = 0;
                let pageList = [];
                if(res.data.qnTitleListVM.qnTitleVMs){
                    res.data.qnTitleListVM.qnTitleVMs.forEach((_s,s)=>{
                        _s.pageNum = pageStart;
                        if(_s.type != 4 && _s.type != 5){
                            totle++
                        }
                        if(_s.type == 5){
                            _s.page = pageStart;
                            pageList.push(pageStart);
                            pageStart++;
                        }
                        if(_s.qnChooseItemVMs){
                            _s.qnChooseItemVMs.forEach((_a,a)=>{
                                _a.checked = false;
                                _a.arrowText = '';
                            })
                        }
                        _s.sort = num;
                        _s.text = '';
                        _s.finished = '';
                        _s.radio = '';
                        _s.check = [];
                        _s.result = '';
                        let items = [];
                        let isRadio = -1;
                        if(_s.type == 3){
                            _s.textNumber = _s.islimit == 1 ? (_s.lengthType == 1 ? _s.maxLength*2 : _s.maxLength) : 0;
                            _s.textMinNumber = _s.islimit == 1 ? (_s.lengthType == 1 ? _s.minLength*2 : _s.minLength) : 0;
                            _s.isPassed = _s.islimit == 1 ? false : true;
                        }
                        let questions = [];
                        
                        if(_s.type == 2){
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
                            if(_s.qnTitleMatrixVMs){
                                _s.qnTitleMatrixVMs.forEach((_d,d)=>{
                                    // questions.push({
                                    //     id: _d.id,
                                    //     name: _d.subject,
                                    //     number: _d.number,
                                    //     titleId: _d.titleId,
                                    //     colspan: items.length
                                    // })
                                    let strs = JSON.stringify(items);
                                    questions.push({
                                        id: _d.id,
                                        name: _d.subject,
                                        number: _d.number,
                                        titleId: _d.titleId,
                                        radio: '',
                                        colspan: 1,
                                        items: items ? JSON.parse(strs) : []
                                    })
                                })
                            }
                        }
                        
                        _s.questions = questions;
                        _s.items = items;
                        _s.isRadio = isRadio;
                        // 错误信息
                        _s.errorMessage = '';
                        // 弹出层控制字段
                        _s.popup = false;

                        if(_s.type != 5){
                            arr.push(_s);
                        }
                        // if(_s.type == 5){
                        //     let obj = _s ? JSON.parse(JSON.stringify(_s)) : [];
                        //     obj.show = true;
                        //     obj.pageNum = obj.pageNum*1+1;
                        //     arr.push(obj);
                        // }
                        if(_s.type != 4 && _s.type != 5){
                            num++
                        }
                        
                    })
                }
                dataObj.data = arr;
                dataObj.totle = totle;
                dataObj.qnData = res.data;
                dataObj.pageList = pageList;
                dataObj.totlePage = pageList.length > 0 ? pageList.length+1 : 0;
            }
            window.localStorage.setItem(`_qndata_${this.$route.query.id}`, JSON.stringify(dataObj))
            // if(!this.qnData.remark){
            //     this.handleStart();
            // }
        },
        // 跳转答题 或者查看结果页面
        handleStart(){
            this.$router.push({path: '/qn-mobile/home/main', query: {id: this.$route.query.id}})
        }
    }
}
</script>
<style scoped lang="scss">
.qn-desc{
    .qn-desc-top{
        padding: px2rem(10);
        >h3{
            font-weight: bold;
            text-align: center;
            font-size: $font-size-large-xx;
            line-height: 1.3*$font-size-large-xx;
            word-break: break-all;
        }
        >p{
            font-size: $font-size-small;
            line-height: 4*$font-size-small;
        }
        >div{
            font-size: $font-size-small;
            line-height: 2*$font-size-small;
        }
        position: absolute;
        width: 100%;
        box-sizing: border-box;
        top: 0;
        left: 0;
        overflow: auto;
        bottom: px2rem(44);
    }
    .qn-desc-bottom{
        font-size: $font-size-small;
        background-color: $--background-color-base;
        position: absolute;
        width: 100%;
        box-sizing: border-box;
        bottom: 0;
        left: 0;
    }
}
</style>