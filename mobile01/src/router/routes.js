
import componentCont from "./component.js"
import qnRouterConfig from "@/page/qn/route.config.json"
import qnMobileRouterConfig from "@/page/qn/route.mobile.config.json"
const LOAD_MAP = (name) => {
    return () => import('PAGE/' + name)
}
const addRoute = (children, prePath, codeKeys, all) => {
    let _routes = [];
    children.forEach(_d => {
        if(_d.name === 'viewport' && _d.path){
            throw new Error('router is not viewport') 
        }
        if(!_d.code || codeKeys[_d.code] || all){
            if (_d.redirect) {
                _routes.push(_d)
            }else {
                let _route = {
                    path: prePath + _d.name,
                    name: _d.name,
                    component: _d.component? componentCont(_d.component,_d.codes) : LOAD_MAP(_d.path)
                }
                if (_d.children && _d.children.length) {
                    _route.children = addRoute(_d.children, '', codeKeys, all)
                }
                _routes.push(_route)
            }
        }
    })
    return _routes
}

let routes = [];
// 判断环境
if(process.env.PLATFORM == 'all'){
    // 开发环境
    routes = [ ...qnRouterConfig,...qnMobileRouterConfig ];
}else{
    // 生产环境
    if(process.env.PLATFORM == 'pc'){
        routes = [ ...qnRouterConfig ]
    }else if(process.env.PLATFORM == 'mobile'){
        routes = [ ...qnMobileRouterConfig ]
    }
}

export default (codeKeys,rootPath,all)=>{
    return addRoute( routes, '/', codeKeys, all)
} 
