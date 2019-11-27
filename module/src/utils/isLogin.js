/**
 * @auth Harry
 * @date 2019-08-23
 * 用于登录判断，初始化项目基本数据
 * 逻辑：
 *      1. 从本地 localStorage 中获取 user 字段
 *      2. 如果没有user字段或者内容为空，则跳转登陆 或者弹出异步登录框
 *      3. 如果user字段有值，请求借口判断登陆是否失效
 *      4. 如果登陆失效，则尝试刷新token重新登陆，否则返回登陆
 *      5. 如果未失效，next()
 */ 
const authme = (resove, colback)=>{
    request('get', '/api/uaa/oauth/me', {noIntercept: true}).then(res=>{
        if(res.status !== 200){
            if(process.env.isDev){// 开发环境
                LoginBox({ showOthers:  window.ShiYue.showOthers });
            }else{
                if(process.env.TEST_MODE == 'development'){
                    LoginBox({ showOthers:  window.ShiYue.showOthers });
                }else{
                    location.href = "/login?redirect_uri=" + encodeURIComponent(location.href);
                }
            }
        }else{
            if(typeof res === 'object'){
                window.localStorage.setItem('user', JSON.stringify(res))
            }else{
                window.localStorage.removeItem('user');
            }
            colback(true)
            resove(true)
        }
    })
}
import {getQueryString} from '@/utils/href.js';
export default (colback = ()=>{}) => {
    return new Promise((resove, reject)=>{
        if (getQueryString("code") && location.pathname != '/desktop/setting') {
            let type = getQueryString("state").split("_")[0];
            request('get', "/api/uaa/social/" + type, {
                code: getQueryString("code")
            }).then(res => {
                if (res.status && res.status == 200) {
                    localStorage.setItem("user", JSON.stringify(res.data));
                    authme(resove, colback)
                }
            }).catch(err => {
                
            })
        } else {
            authme(resove, colback)
        }
    })
}

