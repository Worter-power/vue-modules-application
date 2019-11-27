/**
 *
 * @param  {Array} routers 传入的全部路由
 * 获取fullPath集合
 */

export function getFullPathList(routers) {
    var realRoutes = [];
    let gets = (arr, pre)=>{
        arr.forEach((_s,s)=>{
            let prepath = `${pre}/${_s.name}`;
            realRoutes.push(prepath);
            if(_s.children && _s.children.length){
                gets(_s.children, prepath)
            }
        })
    }
    gets(routers, '')
    return realRoutes
}

/**
 *
 * @param {Array} routes 用户过滤后的路由s
 *
 */
export function getDefaultRoutes(routes) {
    var realRoutes = [];
    let gets = (arr)=>{
        arr.forEach((_s,s)=>{
            if(_s.resourceType == 2){
                realRoutes.push(_s.menuRoute);
                if(_s.children && _s.children.length){
                    gets(_s.children)
                }
            }
        })
    }
    gets(routes);
    return realRoutes
}
