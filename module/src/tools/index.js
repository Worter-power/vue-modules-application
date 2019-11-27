/**组件 */
import PageHeader from '../components/page-header/main.vue';
import Notification from '../components/notification/index.js';
import PageFooter from '../components/page-footer/main.vue';
import LoginBox from '../components/page-login/main.js';
import PhDialog from '../components/dialog/main.vue';
import PageViewport from '../components/page-viewport/main.vue';

/**方法 */
const _ = require('lodash');
import moment from '@/utils/moment';
import print from './print/index.js';
import tableDownload from './download-tables.js';
import { scrollTo, 
    trim, 
    trimLeft, 
    trimRight, 
    setStore ,
    getStore, 
    setSess, 
    getSess, 
    removeSess,
    removeStore,
    data2tree,
    downloade,
    checkIdCard,
    checkEmail,
    checkPhoneNumber,
    checkContact,
    checkFileType,
    checkIsImage,
    checkIsAudeo } from '@/utils/methods.js';
import { getQueryString } from '@/utils/href.js';
import request from '@/utils/axios.js';
import isLogined from '@/utils/isLogin';
import THEME from '@/utils/theme.js';
import fullScreen from '@/utils/full-screen';
// import win from '@/utils/winnotice';
/**指令 */
import directive from './directive.js';

const components = {
    PageHeader,
    PageFooter,
    PhDialog,
    PageViewport
}

const methds = {
    print,
    tableDownload,
    scrollTo,
    trim, 
    trimLeft, 
    trimRight, 
    setStore ,
    getStore, 
    setSess, 
    getSess, 
    removeSess,
    removeStore,
    data2tree,
    downloade,
    checkIdCard,
    checkEmail,
    checkPhoneNumber,
    checkContact,
    checkFileType,
    checkIsImage,
    checkIsAudeo,
    getQueryString // 获取地址 query参数
}

const glabelMethds = {
    _,
    moment,
    request,
    isLogined,
    THEME,
    fullScreen
}

const install = function(Vue, opts = {}) {
    window.BUS = new Vue();

    Object.keys(components).forEach(key => {
        Vue.component(components[key].name, components[key]);
    });

    Vue.prototype.$notify = Notification;
    window.Notification = Notification;
    Vue.prototype.$LoginBox = LoginBox;
    window.LoginBox = LoginBox;

    // vue 原型链方法
    Object.keys(methds).forEach(key => {
        Vue.prototype[`$${key}`] = methds[key];
    });

    // vue 原型链方法 并全局化
    Object.keys(glabelMethds).forEach(key => {
        Vue.prototype[`$${key}`] = glabelMethds[key];
        window[key] = glabelMethds[key];
    });

    // 自定义指令
    directive(Vue)
}

export default {
    install
}