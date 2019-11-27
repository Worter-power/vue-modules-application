
const count = 0;
let realName = '';
let loginName = '';
let avatar = '';
let unitId = '';
let unitType = 1;
let userId = '';
let userType = 0;
let unitName = '';
let userMsg = JSON.parse(window.localStorage.getItem("user"));
let checkedData = [];

let APPLY_KEY = "报名";
if (userMsg && userMsg.data) {
    realName = userMsg.data.realName;
    loginName = userMsg.data.loginName;
    avatar = userMsg.data.avatar;
    unitId = userMsg.data.unitId;
    unitType = userMsg.data.unitType;
    userId = userMsg.data.userId;
    userType = userMsg.data.userType;
    unitName = userMsg.data.unitName
}
// 默认获取日志标识符
let prePath = 'base';
try {
    prePath = location.pathname.split('/')[1] || 'base';
} catch (error) {
    prePath = 'base'
}
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
}
export default {
    scrollbarWidth: getScoreBarWidt(),
    prePath: prePath,
    isShowLoginBox: false,
    theme: '',
    count,
    realName,
    loginName,
    checkedData,
    avatar,
    unitId,
    unitType,
    userType,
    userId,
    unitName,
    pageSize: 30,
    APPLY_KEY,
    classType: null
}