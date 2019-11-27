import { getFullPathList, getDefaultRoutes } from './recursion-router';
export default {
    namespaced: true,
    state: {
        permissionList: null, /** 所有路由 fullPath 集合 */
        resultList: [], /** 所有路由 根据权限处理过 应该显示的路由 fullPath 集合*/
        dyMenu: [], /** 导航菜单 接口返回原始数据 */
        currentMenu: '' /** 当前active导航菜单 */
    },
    getters: {},
    mutations: {
        SET_RESULTROUTER(state, routes){
            let arr = getDefaultRoutes(routes);
            state.resultList = arr;
        },
        SET_PERMISSION(state, routes) {
            let arr = getFullPathList(routes);
            state.permissionList = arr;
        },
        CLEAR_PERMISSION(state) {
            state.permissionList = null
        },
        SET_MENU(state, menu) {
            state.dyMenu = menu
        },
        CLEAR_MENU(state) {
            state.dyMenu = []
        },
        SET_CURRENT_MENU(state, currentMenu) {
            state.currentMenu = currentMenu
        }
    },
    actions: {
        
    }
}
