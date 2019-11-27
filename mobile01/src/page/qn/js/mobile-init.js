import langData from "../lang/index";
import enUS from './en-US.js';
export default ($vue) => {
    // 设置rem单位
    try {
        document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
    } catch (error) {
        
    }
    // 初始化 全局方法
    let loading;
    Vue.prototype.showLoading = function () {
        loading = $vue.$toast.loading({
            message: '加载中',
            forbidClick: false,
            duration: 0,
            loadingType: 'spinner'
        });
    };
    Vue.prototype.hideLoading = function () {
        loading.clear();
    };
    // 初始化语言
    let lang = JSON.parse(localStorage.getItem('lang'));
    if(lang && lang.id){
        $vue.$store.commit('CHANGE_LANG_TYPE', lang.id || 'zh-CN');
    }else{
        $vue.$store.commit('CHANGE_LANG_TYPE', 'zh-CN');
    }
    $vue.$store.commit('CHANGE_LANG', langData);
    //多语言
    vant.Locale.use('en-US', enUS);
}