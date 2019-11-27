
export default {
    methods: {
        handleBackHome(){
            this.$router.push({
                path: '/qn/home/list',
                query: {
                    type: this.qnData.type || 0
                }
            })
        },
        _getTiletDetails(qid, type='preview'){
            return new Promise((resove,reject)=>{
                if(typeof qid != 'string'){
                    console.log('查询结果', qid)
                    resove(this._resoveData(qid, type));
                    return
                }
                let apis = {
                    preview: '/api/qn/qnTitle/preview',
                    npreview: '/api/qn/nologin/qnTitle/preview',
                    query: '/api/qn/qnTitle/query'
                }
                request('get', apis[type], { qid }).then(res=>{
                    console.log('查询结果',res)
                    if(res.status == 200 && res.code == 'ok'){
                        resove(this._resoveData(res, type));
                    }else{
                        resove({datas: []});
                    }
                }).catch(err => {
                    this.pageLoading = false;
                    reject();
                })
            })
        },
        _resoveData(res,type){
            let arrs = res.data.qnTitleListVM.qnTitleVMs || [];
            let resultarr = res.data.type == 1 ? res.data.qnResultListVM.qnVoteResultVMs : res.data.qnResultListVM.qnResultVMs;
            let obj = {
                totle: arrs.filter(o=>{return o.type != 4 && o.type != 5}).length,
                datas: this._getFormatData(arrs, resultarr || [], res.data.type)
            }
            if(res.data){
                Object.keys(res.data).forEach(key=>{
                    obj[key] = res.data[key];
                })
            }
            return obj
        },
        // 题目转化
        _getFormatData(data = [],ansers=[], type){
            let arr = [];
            if(data){
                let number = 0;
                // 获取总页数
                let startNum = data.filter(o=>{return o.type == 5}).length;
                let currnetPats = 1;
                data.forEach((_s,s)=>{
                    // 题号递增 题号不包含段落和分页
                    if(_s.type != 4 && _s.type != 5){
                        number++;
                    }
                    let obj = {
                        id: _s.id,
                        questionType: type,
                        titleId: _s.titleId, // 数据库id
                        sort: number, // 题号
                        oldSort: s+1, // 数据库题目序号，用于修改的时候
                        name: _s.title,
                        number: _s.number,
                        componentId: 'question'+_s.type,
                        type: _s.type,
                        defaultAnswer: '', // 单选 填空 答案字段
                        must: _s.must == 0 ? false : true, // 必填
                        openTip: _s.openTip == 0 ? false : true,
                        tip: _s.tip, // 填写提示
                        orderType: _s.orderType + '',
                        img: _s.img + '', 
                        styleType: _s.styleType + '',
                        opts: [],
                        startNum: currnetPats,// 分页存在时 当前题目所在页码
                        totles: startNum+1, // 总页数
                        widthint: _s.widthint,
                        showVoteint: _s.showVoteint,
                        showPercentageint: _s.showPercentageint,
                        finished: false,
                        errored: false,
                        errorMsg: '',
                        showVote: _s.showVote == 1,
                        showPercentage: _s.showPercentage == 1,
                        // showVote: true,
                        // showPercentage: true
                    }
                    if(_s.type == 5){
                        currnetPats = currnetPats + 1
                    }
                    /**
                     * 题型如下：
                     * 0： 单选； 
                     * 1： 多选； 
                     * 2： 矩阵题； 
                     * 3： 填空题； 
                     * 4： 段落说明； ---------- 不需要处理
                     * 5： 分页； --------- 不需要处理
                     * 6： 下拉框； 
                     * 7： 基本字段
                     * 
                     * 1. 格式化选项 适配组件
                     * 2. 格式化答案
                     * 
                     * （1.已完成问卷查看详情  实名问卷
                     * （2.本地获取答案 匿名问卷
                     * 
                     * 组件内展示答案字段 defaultAnswer
                     * 注意：复选框的答案为opts选项checked
                     * 按题型处理答案
                     */
                    // 获取对应答案对象
                    let _resultObj = ansers.find( o=>{ return o.titleId == _s.titleId}) || {result: ''};
                    switch(_s.type){
                        case 0:
                            this._formatTitle0(obj, _s, _resultObj);
                            break;
                        case 1:
                            this._formatTitle0(obj, _s, _resultObj);
                            break;
                        case 2:
                            this._formatTitle2(obj, _s, _resultObj);
                            break;
                        case 3:
                            this._formatTitle3(obj, _s, _resultObj);
                            break;
                        case 6:
                            this._formatTitle6(obj, _s, _resultObj);
                            break;
                        default:
                            
                   } 
                    arr.push(obj)
                })
            }
            return arr;
        },
        _formatTitle0(obj, data, _resultObj){
            let opts = [];
            let objs = {};
            if(obj.type != 0){
                if(_resultObj.remark){
                    let arr = _resultObj.remark.indexOf(',') != -1 ? _resultObj.remark.split(',') : [_resultObj.remark];
                    arr.forEach((_s,s)=>{
                        if(_s){
                            let _arrs = _s.split('_');
                            objs[_arrs[0]] = _arrs[1];
                        }
                    })
                }
            }
            obj.voteNum= obj.questionType == 1 ? (data.voteNum || 0) : (data.qnChooseItemVMs ? data.qnChooseItemVMs.length : 100);
            if(data.qnChooseItemVMs){
                data.qnChooseItemVMs.forEach((_d,d)=>{
                    let remark = '';
                    if(obj.type == 0){
                        remark = _d.id == _resultObj.result ? _resultObj.remark : ''
                    }else{
                        remark = objs[_d.id] || '';
                    }
                    opts.push({
                        id: _d.id,
                        sort: d+1,
                        chooseId: _d.chooseId,
                        name: _d.name,
                        percentage: _d.percentage || '0%',
                        howMuchVoteNum: _d.howMuchVoteNum || 0,
                        desc: _d.exp,
                        url: _d.image,
                        arrow: _d.text == 0 ? false : true,
                        arrowText: remark,
                        mast: _d.must == 0 ? false : true,
                        checked: obj.type == 0 ? false : (_resultObj.result ? _resultObj.result.indexOf(_d.id)!==-1 : false),
                        image: _d.image,
                        showImgUrl: !_d.image ? '' : this.$store.state.imgurl + _d.image
                    })
                })
            }
            obj.defaultAnswer = obj.type == 0 ? _resultObj.result : '';
            obj.opts = opts;
        },
        _formatTitle2(obj, data, _resultObj){
            let orderType = null;
            let items = [];
            if(data.qnMatrixItemVMs){
                data.qnMatrixItemVMs.forEach((_a,a)=>{
                    items.push({
                        id: _a.id,
                        titleId: _a.titleId,
                        name: _a.name
                    })
                    orderType = _a.selType;
                })
            }
            obj.orderType = orderType+''; // 0 单选   1 多选
            obj.items = items; // 选项 列
            let questions = []; // 题目 行
            let als = _resultObj.result ? _resultObj.result.split(',') : []; // 答案组合拆解
            /**
             * 题目id_选项id
             */
            if(data.qnTitleMatrixVMs){
                data.qnTitleMatrixVMs.forEach((_d,d)=>{
                    // 获取单选题答案
                    let anwser = '';
                    try {
                        if(orderType == 0){
                            let _rs = als.find(o=>{return o.indexOf(_d.id) != -1});
                            anwser = _rs ? _rs.split('_')[1] : '';
                        }
                    } catch (error) { }
                    questions.push({
                        id: _d.id,
                        titleId: _d.titleId,
                        anwser, // 单选答案
                        name: _d.subject,
                        items: this._getQusetion6Items(items, _d.id, als)
                    })
                })
            }
            obj.questions = questions;
        },
        _getQusetion6Items(data, id, als){
            let items = [];
            data.forEach((_s,s)=>{
                items.push({
                    ..._s,
                    checked: als.indexOf(`${id}_${_s.id}`) !== -1 // 多选是否选中
                })
            })
            return items
        },
        _formatTitle3(obj, data, _resultObj){
            // 填空题答案在 defaultPre 最终显示
            obj.inputType = data.inputType;
            obj.rows = data.high == 0 ? -2 : data.high;
            obj.min = data.minLength;
            obj.max = data.maxLength;
            obj.customHigh = data.customHigh;
            obj.rowsOther =  data.customHigh;
            obj.widthOther = data.customWidth;
            obj.defaultValue = data.isdefault ? true : false;
            obj.defaultAnswer = _resultObj.result || data.defaultVal;
            obj.defaultPre = data.defaultVal || '';
            obj.ismaxlength = data.islimit == 1 ? true : false;
            obj.lengthType = data.lengthType;
            obj.width = data.width;
        },
        _formatTitle6(obj, data, _resultObj){
            let opts = [];
            if(data.qnTitleSelectOptionVMs){
                data.qnTitleSelectOptionVMs.forEach((_d,d)=>{
                    opts.push({
                        id: _d.id,
                        sort: d+1,
                        name: _d.name,
                        arrow: _d.isdefault == 0 ? false : true
                    })
                    obj.titleId = _d.titleId;
                })
            }
            obj.opts = opts;
            obj.defaultAnswer = _resultObj.result;
        }
        // 获取答案

    }
}