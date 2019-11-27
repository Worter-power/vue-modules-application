const fs = require('fs-extra');
const path = require('path');
const render = require("json-templater/string");
let TPL_ROUTER = require('./lib/router.js');
let VUEX_TEPL = require('./lib/vuex.js');
let LANG_TEPL = require('./lib/lang.js');
// router ----

let _p = path.join(__dirname, '../src/page/'),
    mks = [],
    state = ['...state'],
    mutations = ['...mutations'],
    actions = ['...actions'],
    vuex = [];

if (fs.existsSync(_p)) {
    fs.readdirSync(_p).forEach((el, i) => {
        if (el != '.svn') {
            mks.push(el);
            if(fs.existsSync(path.join(__dirname, `../src/page/${el}/vuex/state.js`))){
                vuex.push(`import ${el}State from "PAGE/${el}/vuex/state.js"`);
                state.push(`...${el}State`);
            }
            if(fs.existsSync(path.join(__dirname, `../src/page/${el}/vuex/mutations.js`))){
                vuex.push(`import ${el}Mutations from "PAGE/${el}/vuex/mutations.js"`);
                mutations.push(`...${el}Mutations`);
            }
            if(fs.existsSync(path.join(__dirname, `../src/page/${el}/vuex/actions.js`))){
                vuex.push(`import ${el}Actions from "PAGE/${el}/vuex/actions.js"`);
                actions.push(`...${el}Actions`);
            }
        }
    });
}
let routers = [];
let mobilerouters = [];
let list = [];
let mobile = [];
mks.forEach((val)=>{
    routers.push(`import ${val}RouterConfig from "@/page/${val}/route.config.json"`);
    list.push('...'+val+'RouterConfig');
    if(fs.existsSync(path.join(__dirname, `../src/page/${val}/route.mobile.config.json`))){
        mobilerouters.push(`import ${val}MobileRouterConfig from "@/page/${val}/route.mobile.config.json"`);
        mobile.push('...'+val+'MobileRouterConfig');
    }
})
fs.writeFileSync(path.join(__dirname, '../src/router/routes.js'), render(TPL_ROUTER, {
    routers: routers.join(';\n'),
    mobilerouters: mobilerouters.join(';\n'),
    alllist: list.concat(mobile).join(','),
    list: list.join(','),
    mobile: mobile.join(',')
}));
// vuex 重写
fs.writeFileSync(path.join(__dirname, '../src/vuex/store.js'), render(VUEX_TEPL, {
    import: vuex.join('\n'),
    state: state.join(','),
    mutations: mutations.join(','),
    actions: actions.join(',')
}));
// lang 文件重写
// let langs = [];
// let ens = ['en'];
// let cns = ['cn'];
// mks.forEach((val)=>{
//     if(fs.existsSync(path.join(__dirname, '../src/page/'+val+'/lang/zh-CN.js'))){
//         langs.push(`import ${val}Cn from "PAGE/${val}/lang/zh-CN.js";`)
//         cns.push(`${val}Cn`)
//     }
//     if(fs.existsSync(path.join(__dirname, '../src/page/'+val+'/lang/en.js'))){
//         langs.push(`import ${val}En from "PAGE/${val}/lang/en.js";`)
//         ens.push(`${val}En`)
//     }
// })
// fs.writeFileSync(path.join(__dirname, '../src/lang/index.js'), render(LANG_TEPL, {
//     imports: langs.join('\n'),
//     cn: cns.join(','),
//     en: ens.join(',')
// }));