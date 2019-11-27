/**
 * harry 2019-08-25
 */
import config from './theme/config';
import colorMap from './theme/colorMap.js';
import colorFun from './theme/colorFun';
import background from '@/components/theme-background/index.js';

import {addClass} from './dom';
const SETCOLOR = (color) => {
    let app = document.getElementById('app');
    if(app){
        addClass(app, color)
    }
    window.localStorage.setItem('themeColor', color);
}

let profix = process.env.isDev ? location.origin : '';

const changeColor = (resove, settingColor)=>{
    if(config.themes[settingColor]){
        config.themeCss.push(`/common/styles/1.0.0/lib/${settingColor}.css`)
    }
    let reqList = [];
    config.themeCss.forEach((_s,s)=>{
        reqList.push(
            request('get', profix + _s, {
                noIntercept: true,
                cache: true
            })
        )
    })
    if(settingColor === 'ink' || settingColor === 'lotus'){
        let div = document.createElement('div');
        div.id = 'ph-theme-bg-canvas';
        document.getElementsByTagName("body")[0].appendChild(div);
        new Vue({
            el: '#ph-theme-bg-canvas',
            template: '<background theme="'+settingColor+'"></background>',
            components: {
                background
            }
        });
    }else{
        let bgdiv = document.getElementById('ph-theme-bg-canvas');
        if(bgdiv){
            document.getElementsByTagName("body")[0].removeChild(bgdiv);
        }
    }
    Promise.all(reqList).then(data => {
        if(data){
            let styleData = data.join(' ');
            let colors = colorFun(config.themes[settingColor] || settingColor)
            // 颜色替换成关键词
            Object.keys(colorMap).forEach(key => {
                var value = colorMap[key];
                styleData = styleData.replace(new RegExp(key, "ig"), value);
            });
            // 关键词替换成对应的颜色
            Object.keys(colors).forEach(key => {
                styleData = styleData.replace(new RegExp("(:|\\s+)" + key, "g"), "$1" + colors[key]);
            });
            styleData = '/*Theme style*/' + styleData;
            const styles = [].slice.call(document.querySelectorAll('style')).filter(style => {
                const text = style.innerText;
                return /Theme style/.test(text);
            });
            if(styles.length){
                styles.forEach(style => {
                    const { innerText } = style;
                    if (typeof innerText !== 'string') return;
                    style.innerText = styleData;
                });
            }else{
                var nod = document.createElement("style");
                if (nod.styleSheet) {
                    nod.styleSheet.cssText = styleData;
                } else {
                    nod.innerHTML = styleData;
                }
                document.getElementsByTagName("head")[0].appendChild(nod);
            }
            SETCOLOR(settingColor);
            resove(settingColor);
        }else{
            SETCOLOR(config.defaultColor);
            resove(settingColor)
        }
    }).catch(err=>{
        SETCOLOR(config.defaultColor);
        resove(settingColor)
    })
}

export default (noIntercept)=>{
    return new Promise((resove,reject)=>{
        let storeColor = window.localStorage.getItem('themeColor')
        // 直接更换主题
        if(/^#/i.test(noIntercept)){
            if(storeColor !== noIntercept){
                changeColor(resove, noIntercept)
            }
        }else{
            request("get", "/api/base/my_desktop/color", noIntercept ? {noIntercept} : {}).then(res => {
                let settingColor = res.data;
                if(settingColor === config.defaultColor){
                    SETCOLOR(config.defaultColor);
                    resove(config.defaultColor)
                }else{
                    if(config.themes[settingColor] || /^#/i.test(settingColor)){
                        changeColor(resove, settingColor)
                    } else {
                        SETCOLOR(config.defaultColor);
                        resove(config.defaultColor)
                    }
                }
            }).catch(err=>{
                resove(config.defaultColor);
            })
        }
    })
}