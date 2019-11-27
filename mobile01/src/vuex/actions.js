import { getUnitCodeConfigLang } from "@/service";
import { getCodeMenuList } from '@/service';
import router from '@/router/index';
import DynamicRoutes from '@/router/routes';

export default {
    FETCH_LANGUAGES({ commit, state }, param) {
        if (process.env.NODE_ENV == 'production') {
            getUnitCodeConfigLang(param.code, param.unitId).then(res => {
                let arr = [];
                res.forEach((_a) => {
                    arr.push({
                        value: _a.value,
                        name: _a.name
                    })
                })
                commit('CHANGE_LANG_LIST', arr);
            }).catch(err => {
                commit('CHANGE_LANG_LIST', []);
            })
        } else {
            commit('CHANGE_LANG_LIST', [{ value: 'zh-CN', name: '中文' }, { value: 'en', name: 'English' }]);
        }
    },
    async FETCH_PERMISSION({ commit, state }) {
        /**
         * resData 为后端返回的栏目信息，包含权限信息
         */
        let resData = await getCodeMenuList(state.prePath);
        // 初始化权限和栏目信息
        commit("INT_AUTH", resData);
        commit("permission/SET_RESULTROUTER", resData);
        // 目前权限信息和栏目相同 没有区分 后续优化
        console.log(resData)
        commit("permission/SET_MENU", resData);
        // 存储所有定义的路由
        let allRouter = DynamicRoutes(state.codeKeys, state.prePath, true);
        // 获取fullpath 集合
        commit("permission/SET_PERMISSION", allRouter);
        // 
        /*  动态添加路由 
            将接口返回的code集合传给参数，通过判断对应路由code来决定是否挂在该路由
        */
        let resutRouter = DynamicRoutes(state.codeKeys, state.prePath);
        router.addRoutes(resutRouter);
    }
}