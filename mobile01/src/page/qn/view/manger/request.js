export let getlogList = (params) => {
    return request('GET', '/api/logging/logging', params);
};
// GET /qnIpSet/stageUnit 获取学段单位列表
export let selectUnitListByStage = () => {
    return new Promise((resove, reject) => {
        request('get', '/api/qn/qnIpSet/stageUnit', {}).then(res => {
            if (res.status == 200) {
                resove(res.data)
            } else {
                reject(res)
            }
        }).catch(err => {
            reject(err)
        })
    })
};
export let selectUnitList = () => {
        return new Promise((resove, reject) => {
            request('get', '/api/base/unitTree', {}).then(res => {
                if (res.status == 200) {
                    resove(res.data)
                } else {
                    reject(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    };
    // GET /qnIpSet/list 查询IP设置段
export let selectIPList = (unitId) => {
        return new Promise((resove, reject) => {
            request('get', '/api/qn/qnIpSet/list', { unitId }).then(res => {
                if (res.status == 200) {
                    resove(res.data)
                } else {
                    reject(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    }
    // POST /qnIpSet/batch 批量新增IP设置段
export let saveIPs = (obj) => {
        return new Promise((resove, reject) => {
            request('POST', '/api/qn/qnIpSet/batch', obj).then(res => {
                if (res.status == 200) {
                    resove(res.data)
                } else {
                    reject(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    }
    // GET /qnIpSet/list 根据学段ID查询IP设置段
export let selectListIpS = (stage) => {
    return new Promise((resove, reject) => {
        request('GET', '/api/qn/qnIpSet/list', { stage }).then(res => {
            if (res.status == 200) {
                resove(res.data)
            } else {
                reject(res)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

//GET /years   查询用户单位所有年度 
export let getYearsInfo = (params) => {
    return request('GET', '/api/base/years', params)
};
//GET /term   根据单位，年度查询学期
export let getUnitSchoolList = (params) => {
    return request('GET', '/api/base/term', params)
}




//问卷信息
// POST    /qnQuestionnaire   新增问卷信息
export function addQuestionnaireInfo(t,obj) {
    return request(t, '/api/qn/qnQuestionnaire', obj);
}
// GET   /qnQuestionnaire/copyList        查询可以复制的问卷信息列表
export function queryCanCopyInfoList(obj) {
    return request('GET', '/api/qn/qnQuestionnaire/copyList ', obj);
}

// GET       /qnQuestionnaire/info    查询问卷信息
export function queryQuestionInfo(obj) {
    return request('GET', '/api/qn/qnQuestionnaire/info', obj);
}

// GET     /qnQuestionnaire/list    查询问卷信息列表
export function queryQuestionInfoList(obj) {
    return request('GET', '/api/qn/qnQuestionnaire/list', obj);
}
// DELETE     /qnQuestionnaire    删除问卷信息
export function deleteQuestInfo(obj) {
    return request('DELETE', '/api/qn/qnQuestionnaire?id=' + obj);
}

// 复制问卷 /qnQuestionnaire/copy
export function copyQuestion(obj) {
    return request('get', '/api/qn/qnQuestionnaire/copy', obj);
}





// 题目： 选择题
// POST /qnTitleChoose   新增选择项
export function addChooseQuest(obj) {
    return request('POST', '/api/qn/qnTitleChoose', obj);
}
// GET   /qnTitleChoose/find   查询选择项
export function queryChooseQuest(obj) {
    return request('GET', '/api/qn/qnTitleChoose/find', obj);
}


//题目： 填空题
// POST   /qnTitleTextarea   新增填空题
export function addFullInQuest(obj) {
    return request('POST', '/api/qn/qnTitleTextarea', obj);
}


//问卷填写对象
// POST   /qnObject   新增问卷访问对象
export function addQuestVistObj(obj) {
    return request('POST', '/api/qn/qnObject', obj);
}