// import lang from "../lang/index.js";
const model = require('../../webpack.config.js').name;
let getScoreBarWidt = () => {
    var oP = document.createElement('p'),
        styles = {
            width: '100px',
            height: '100px',
            overflowY: 'scroll',
        },
        i, scrollbarWidth;

    for (i in styles) {
        oP.style[i] = styles[i];
    }
    document.body.appendChild(oP);
    scrollbarWidth = oP.offsetWidth - oP.clientWidth;
    oP.parentNode.removeChild(oP);

    return scrollbarWidth;
};
export default {
    GET_USER_MSG(state) {
        try {
            let userMsg = JSON.parse(window.localStorage.getItem('user')) || { data: {} };
            state.realName = userMsg.data.realName || '';
            state.loginName = userMsg.data.loginName || '';
            state.avatar = userMsg.data.avatar || '';
            state.unitId = userMsg.data.unitId || '';
            state.unitType = userMsg.data.unitType || '';
            state.userId = userMsg.data.userId || '';
            state.userType = userMsg.data.userType || '';
            state.unitName = userMsg.data.unitName || '';
        } catch (error) {

        }
    },
    CHANGE_LANG_TYPE(state, data) {
        if (data) {
            state.langType = data;
        }else{
            let lang_ = window.localStorage.getItem('lange_');
            state.langType = lang_ || 'zh-CN';
        }
        if (state.langType == 'en' && ELEMENT) {
            ELEMENT.locale(ELEMENT.lang.en)
        }
    },
    CHANGE_LANG(state, data) {
        state.lang = data[state.langType];
    },
    CHANGE_THEME(state, data) {
        state.theme = data;
    },
    GET_SCROLL_BAR_WIDTH(state, data) {
        state.scrollbarWidth = getScoreBarWidt();
    },
    GET_PRE_PATH(state, data) {
        // 默认获取日志标识符
        let prePath = model;
        try {
            prePath = location.pathname.split('/')[1] || model;
        } catch (error) {}
        state.prePath = prePath;
    },
    INT_AUTH(state, data){
        // 处理权限 对象
        let perms = {};
        if(data && data.length){
            perms[state.prePath] = "首页";
            let codes = (arr)=>{
                if(arr.length){
                    arr.forEach(val=>{
                        perms[val.code] = val.name;
                        if(val.children && val.children.length){
                            codes(val.children);
                        }
                    })
                }
            }
            codes(data || []);
            window.sessionStorage.removeItem('noauthority');
        }else{
            window.sessionStorage.setItem('noauthority', '1')
        }
        // codeKrys 中有的code决定页面显示不显示
        state.codeKeys = perms;
    }
}