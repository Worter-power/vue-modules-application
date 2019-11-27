<template>
    <div class="mobile-body">
        <div class="qn-main-title" v-show="!showInfoMessages">
            <van-index-bar :index-list="indexList" :sticky="false">
                <div class="qn-main-title-box" v-for="(item,index) in qnData.data" :key="index">
                    <van-index-anchor :index="item.number">
                        <b v-if="item.must == 1" style="color: #f00">*</b>
                        <span>{{item.number}}. </span>
                        <span class="qn-main-title-name" v-html="item.title"></span>
                    </van-index-anchor>
                    <div class="qn-main-title-opts">
                        <!-- 单选题 -->
                        <van-radio-group v-model="item.radio" :disabled="false" v-if="item.type == 0">
                            <van-radio v-for="(row,index) in item.qnChooseItemVMs" :key="index+'radio'" :name="row.id">
                                {{row.name}}
                            </van-radio>
                        </van-radio-group>
                        <!-- 多选题 -->
                        <template v-if="item.type == 1">
                            <van-checkbox v-for="(row,index) in item.qnChooseItemVMs" v-model="row.checked" :key="index+'check'" 
                                :disabled="false" :name="row.id">
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
                                        <van-radio-group v-if="item.isRadio == 0" v-model="tr.radio">
                                            <van-radio :name="td.id">{{td.name}}</van-radio>
                                        </van-radio-group>
                                        <van-checkbox v-model="td.checked" v-if="item.isRadio == 1"
                                            :name="td.id">{{td.name}}
                                        </van-checkbox>
                                    </van-index-anchor>
                                </template>
                            </van-index-anchor>
                        </template>

                        <!-- 填空题 -->
                        <template v-if="item.type == 3 && item.must != 1">
                            <van-field type="textarea" :readonly="false" v-model="item.text" placeholder="请输入内容" 
                                @input="handleCheck"
                                clearable
                                :error-message="item.errorMessage"/>
                        </template>
                        <template v-if="item.type == 3 && item.must == 1">
                            <van-field
                                v-model="item.text"
                                clearable
                                placeholder="请输入内容"
                                @input="handleCheck"
                                :error-message="item.errorMessage"
                            >
                            </van-field>
                        </template>

                        <!-- 下拉选择 -->
                        <template v-if="item.type == 6">
                            <van-cell :title="item.text || ' '" :value="item.text ? '点击修改' : '点击选择'" @click="handleClick(item)"/>
                            <van-popup
                                v-model="item.popup"
                                round
                                position="bottom"
                                :style="{ maxHeight: '80%',overflow: 'auto' }"
                            >
                                <van-picker
                                    show-toolbar
                                    value-key="name"
                                    :columns="item.qnTitleSelectOptionVMs"
                                    @cancel="item.popup = false"
                                    @confirm="onConfirm"
                                />
                            </van-popup>
                        </template>
                        
                    </div>
                </div>
            </van-index-bar>
            <van-button type="info" style="width: 100%;" @click="hdnaleCmofirm">提交问卷</van-button>
        </div>
        <van-dialog v-model="showInfoMessages" title="提示">
            <p style="padding: 10px 15px;font-size: .3rem;line-height: .6rem;">{{qnData.qnData.remind}}</p>
        </van-dialog>
        <van-dialog v-model="optTextDialog" title="提示" @confirm="handleConfirm">
            <p style="padding: 10px 15px;font-size: .3rem;line-height: .6rem;text-align: center;">您已经完成本次问卷调查！</p>
        </van-dialog>
        
        <van-dialog v-model="numInfoDialog" show-cancel-button title="提示" @confirm="_handleSubmit">
            <p style="padding: 10px 15px;font-size: .3rem;line-height: .6rem;text-align: center;">
                您还有{{allsNum}}道题没有填写！
            </p>
        </van-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showInfoMessages: false,
            numInfoDialog: false,
            optTextDialog: false,
            qnData: {
                qnData: {},
                data: [],
                totle: 0,
                pageList: [],
                totlePage: 0,
                logined: false
            },
            indexList: [],
            errorMessage: '',
            currentItems: {},
            allsNum: 0
        }
    },
    created() {
        this.init()
    },
    methods: {
        init(){
            // 获取问卷信息
            let qnData = window.localStorage.getItem(`_qndata_${this.$route.query.id}`);
            try {
                this.qnData = JSON.parse(qnData);
            } catch (error) {}
            if(this.qnData.qnData.remind){
                this.showInfoMessages = true;
            }
            this.indexList = this.qnData.data.map(o=>{return o.number});
        },
        // 输入框内容校验
        handleCheck(t){
            this.qnData.data.forEach((_s,s)=>{
                if(_s.type == 3){
                    if(t == _s.text){
                        _s.text = _s.text.replace(/^\s+|\s+$/g, '');
                        // 必填校验
                        if(_s.must == 1){
                            // 手机号校验 phone 
                            if(_s.inputType == 'phone'){
                                if(!/^1[0-9]{10}$/.test(_s.text)){
                                    _s.errorMessage = "手机号码格式错误！"
                                }else{
                                    _s.errorMessage = '';
                                }
                            }else if(_s.inputType == 'email'){ // 邮箱校验 email
                                if(/^([a-zA-Z0-9_\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/gi.test(_s.text)){
                                    _s.errorMessage = '';
                                }else{
                                    _s.errorMessage = "邮箱格式错误！"
                                }
                            }else{ // 其他输入框校验长度
                                if(_s.islimit == 1){ // 开启校验
                                    if(_s.lengthType == 1){ // 字节长度类型
                                        if(_s.text.length > _s.maxLength*2){
                                            _s.errorMessage = "输入内容长度超出范围！"
                                        }else{
                                            _s.errorMessage = '';
                                        }
                                    }else{ // 字符长度
                                        if(_s.text.length > _s.maxLength){
                                            _s.errorMessage = "输入内容长度超出范围！"
                                        }else{
                                            _s.errorMessage = '';
                                        }
                                    }
                                }else{
                                    _s.errorMessage = '';
                                }
                            }
                        }
                    }
                }
            })
        },
        // 点击获取当前下拉题目信息
        handleClick(row){
            this.currentItems = row;
            row.popup = true;
        },
        // 下拉选中 确定事件
        onConfirm(row) {
            this.currentItems.radio = row.id;
            this.currentItems.text = row.name;
            this.currentItems.popup = false;
        },
        hdnaleCmofirm(){
            let lastNum = this._checkedIsOKuPdata();
            this.allsNum = this._checkedIsOKuPdata(true);
            // 校验数据必填
            if(lastNum > 0){
                this.$notify(`您有${lastNum}个必填的题目没有填写！`);
                return
            }
            if(this.allsNum > 0){
                this.numInfoDialog= true;
            }else{
                this._handleSubmit();
            }
        },
        // 提交问卷
        _handleSubmit(){
            let obj = {
                qnid: this.qnData.qnData.id,
                unitId: this.qnData.logined ? undefined : this.$route.query.unitid,
            }
            let imputpass = [];
            let validata = [];
            let num = 0;
            let lengthData = [];
            let errorMessage = [];
            this.qnData.data.forEach((_s,s)=>{
                if(_s.errorMessage){
                    errorMessage.push(_s)
                }
                if(_s.type != 4 && _s.type != 5){
                    obj[`qnResultVMs[${num}].qnid`]= this.qnData.id;
                    obj[`qnResultVMs[${num}].titleId`]= _s.titleId;
                    obj[`qnResultVMs[${num}].type`]= _s.type;
                    obj[`qnResultVMs[${num}].number`]= _s.number;
                    let result = '';
                    if(_s.type == 0 || _s.type == 6){
                        result = _s.radio;
                    }
                    if(_s.type == 1){
                        let arr = [];
                        _s.qnChooseItemVMs.forEach((_a,a)=>{
                            if(_a.checked){
                                arr.push(_a.id)
                            }
                        })
                        result = arr.join(',');
                    }
                    if(_s.type == 0 || _s.type == 1){
                        let kzs = [];
                        _s.qnChooseItemVMs.forEach((_d,d)=>{
                            if((result == _d.id || result.indexOf(_d.id) != -1) && _d.text == 1){
                                if(_d.must == 1){
                                    if(!_d.arrowText){
                                        validata.push({
                                            id: _d.id,
                                            name: _d.name
                                        })
                                    }
                                }
                                if(_s.type == 0){
                                    kzs.push(_d.arrowText || 'null')
                                }else{
                                    kzs.push( `${_d.id}_${_d.arrowText}`)
                                }
                            }

                        })
                        obj[`qnResultVMs[${num}].remark`]= kzs.join(',');
                    }
                    if(_s.type == 2){
                        if(_s.isRadio == 0){
                            let arr = [];
                            _s.questions.forEach((_d,d)=>{
                                if(_d.radio){
                                    arr.push(`${_d.id}_${_d.radio}`)
                                }
                            })
                            result= arr.join(',');
                        }else{
                            let arr = [];
                            _s.questions.forEach((_d,d)=>{
                                if(_d.items){
                                    _d.items.forEach((_q,q)=>{
                                        if(_q.checked){
                                            arr.push(`${_d.id}_${_q.id}`)
                                        }
                                    })
                                }
                                
                            })
                            result= arr.join(',');
                        }
                    }
                    if(_s.type == 3){
                        result = _s.text;
                        imputpass.push({
                            inputType: _s.inputType,
                            text: _s.text
                        })
                        if((_s.islimit == 1 && _s.must == 1) || (_s.text && _s.islimit == 1)){
                            if(_s.text){
                                if(_s.text.length > _s.textNumber || _s.text.length < _s.textMinNumber){
                                    lengthData.push(_s)
                                }
                            }else{
                                lengthData.push(_s)
                            }
                        }
                    }
                    obj[`qnResultVMs[${num}].result`]= result;
                    num = num + 1;
                }
            })
            if(errorMessage.length>0){
                this.$notify('题目填写内容不符合要求！');
                return
            }
            if(lengthData.length > 0){
                this.$notify('题目填写内容不符合要求！');
                return
            }
            for (let i = 0; i < validata.length; i++) {
                let element = validata[i];
                this.$notify(element.name + '扩展选项未填写！');
                return
            }
            let api = this.qnData.logined ? '/api/qn/qnTitle/save' : '/api/qn/nologin/qnTitle/save';
            let macId = localStorage.getItem('GUID_QN_CODE');
            obj.macId = !macId || macId == 'null' ? this.guid()+'-'+new Date().getTime() : macId;
            this.$request('post', api, obj).then(res1=>{
                if(res1.status == 200 && res1.code == 'ok'){
                    this.optTextDialog = true;
                    window.localStorage.setItem('GUID_QN_CODE', obj.macId)
                }else{
                    this.$notify('提交过程发生错误！');
                }
            }).catch(err=>{

            })
        },
        guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },
        _checkedIsOKuPdata(t){
            let pass = true;
            let num = 0;
            this.qnData.data.forEach((_s,s)=>{
                if(_s.must == 1 || t){
                    if(_s.type == 0 || _s.type == 6){
                        if(!_s.radio){
                            pass = false
                            num++
                        }
                    }
                    if(_s.type == 1){
                        let arr = [];
                        _s.qnChooseItemVMs.forEach((_a,a)=>{
                            if(_a.checked){
                                arr.push(_a.id)
                            }
                        })
                        if(arr.length == 0){
                            pass = false
                            num++
                        }
                    }
                    if(_s.type == 2){
                        if(_s.isRadio == 0){
                            let arr = [];
                            _s.questions.forEach((_d,d)=>{
                                if(_d.radio){
                                    arr.push(`${_d.id}_${_d.radio}`)
                                }
                            })
                            if(arr.length != _s.questions.length){
                                pass = false
                                num++
                            }
                        }else{
                            let _arr = [];
                            _s.questions.forEach((_d,d)=>{
                                let arr = [];
                                if(_d.items){
                                    _d.items.forEach((_q,q)=>{
                                        if(_q.checked){
                                            arr.push(`${_d.id}_${_q.id}`)
                                        }
                                    })
                                }
                                if(arr.length > 0){
                                    _arr.push(_d.id)
                                }
                            })
                            if(_arr.length != _s.questions.length){
                                pass = false
                                num++
                            }
                        }
                    }
                    if(_s.type == 3){
                        if(!_s.text){
                            pass = false
                            num++
                        }
                    }
                }
            })
            return num
        },

        handleConfirm(){
            this.$router.push({path: '/qn-mobile/list'})
        }
    },
    mounted(){
        
    }
}
</script>

<style lang="scss">
.qn-main-title{
    font-size: $font-size-small-xx;
    height: 100%;
    position: relative;
    overflow: auto;
    .van-index-bar__sidebar{
        right: 5px;
    }
    .qn-main-title-box{
        padding: 10px 0;
        background-color: #fff;
        border-bottom: 1px solid $--border-color-base;
    }
    .qn-main-title-name{
        >*{
            display: inline;
            word-break: break-all;
        }
    }
    .qn-main-title-opts{
        .van-cell{
            background-color: $--background-color-base;
        }
        padding: 0 15px;
        .van-radio,
        .van-checkbox{
            margin-bottom: 8px;
        }
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