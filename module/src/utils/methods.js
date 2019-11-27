// getStyle
export function getStyle(element, styleName) {
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'cssFloat';
    }
    try {
        const computed = document.defaultView.getComputedStyle(element, '');
        return element.style[styleName] || computed ? computed[styleName] : null;
    } catch (e) {
        return element.style[styleName];
    }
}

// firstUpperCase
function firstUpperCase(str) {
    return str.toString()[0].toUpperCase() + str.toString().slice(1);
}
export { firstUpperCase };

// scrollTo animation
export function scrollTo(el, to, target, duration = 500, num = 0) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                return window.setTimeout(callback, 1000 / 60);
            }
        );
    }
    let targetDom = '';
    let endNum = to;
    let lasetNum = 0;
    let getOffsetTop = function (dom) {
        if(dom != el){
            lasetNum += dom.offsetTop;
            getOffsetTop(dom.parentNode);
        }else{
            return
        }
    }
    if (target) {
        targetDom = document.getElementById(target);
        if (targetDom.parentNode == el ){
            endNum = targetDom.offsetTop + num;
        }else{
            getOffsetTop(targetDom);
            endNum = lasetNum + num
        }
    }
    let currentTop = el.scrollTop;
    const difference = Math.abs(currentTop - endNum);
    const step = Math.ceil(difference / duration * 50);

    function scroll(start, end, step) {
        if (start === end) return;

        let d = (start + step > end) ? end : start + step;
        if (start > end) {
            d = (start - step < end) ? end : start - step;
        }

        if (el === window) {
            window.scrollTo(d, d);
        } else {
            el.scrollTop = d;
        }
        window.requestAnimationFrame(() => scroll(d, end, step));
    }
    scroll(currentTop, endNum, step);
}

// scrollTop animation
export function scrollTop(el, from = 0, to, duration = 500) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                return window.setTimeout(callback, 1000 / 60);
            }
        );
    }


    const difference = Math.abs(from - to);
    const step = Math.ceil(difference / duration * 50);

    function scroll(start, end, step) {
        if (start === end) return;

        let d = (start + step > end) ? end : start + step;
        if (start > end) {
            d = (start - step < end) ? end : start - step;
        }

        if (el === window) {
            window.scrollTo(d, d);
        } else {
            el.scrollTop = d;
        }
        window.requestAnimationFrame(() => scroll(d, end, step));
    }
    scroll(from, to, step);
}

export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'shallowClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    for (const keys in source) {
        if (source.hasOwnProperty(keys)) {
            if (source[keys] && typeof source[keys] === 'object') {
                targetObj[keys] = source[keys].constructor === Array ? [] : {}
                targetObj[keys] = deepClone(source[keys])
            } else {
                targetObj[keys] = source[keys]
            }
        }
    }
    return targetObj
};

export function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

export let trimLeft = (str) => {
    return str.replace(/^\s+/, '');
}

export let trimRight = (str) => {
    return str.replace(/\s+$/, '');
}
// 存储localStorage
export let setStore = (name, content) => { 
    if (!name) return;
    if (typeof content === 'object') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

// 获取localStorage
export let getStore = name => { 
    if (!name) return '';
    let localValue = window.localStorage.getItem(name);
    try {
        localValue = JSON.parse(localValue)
    } catch (error) {

    }
    return localValue;
}

export let setSess = (name, content) => { // sessionStorage
    if (!name) return;
    if (typeof content === 'object') {
        content = JSON.stringify(content);
    }
    window.sessionStorage.setItem(name, content);
}
export let getSess = name => { // sessionStorage
    if (!name) return false;
    let msg = window.sessionStorage.getItem(name);
    try {
        localValue = JSON.parse(msg)
    } catch (error) {

    }
    return msg;
}
export let removeSess =  name => { // 删除sessionStorage
    if (!name) return;
    window.sessionStorage.removeItem(name);
}
export let removeStore = name => { // 删除localStorage
    if (!name) return;
    window.localStorage.removeItem(name);
}
// 将平级数据格式化树形数据
export let data2tree = (datas, idprop, pIdprop) => {
    if (!idprop) {
        idprop = 'id';
    }
    if (!pIdprop) {
        pIdprop = 'parentId';
    }
    let nodes = [],
        c = function (obj) {
            let _c = [];
            for (let i = 0; i < datas.length; i++) {
                let _d = _.cloneDeep(datas[i]);
                if (_d[pIdprop + ''] == obj[idprop + '']) {
                    _c.push(_d);
                    c(_d);
                }
            }
            if (_c.length) {
                obj.children = _c;
            }
        };
    for (let i = 0; i < datas.length; i++) {
        let _d = _.cloneDeep(datas[i]);
        if ((!_d[pIdprop + ''] && _d[pIdprop + ''] != '') || (!_.result(_.find(datas, {
            [idprop]: _d[pIdprop + '']
        }), idprop))) {
            c(_d);
            nodes.push(_d);
        }
    }
    return nodes;
}
// 文件下载
export let downloade = (url, method, parmas = {}) => {
    let obj = {};
    for (let key in parmas) {
        if (typeof (parmas[key]) == 'number' || parmas[key]) {
            obj[key] = parmas[key]
        }
    }
    let resultUrl = /^http/.test(url) ? url : window.ShiYue.base + url;
    let formDom = document.createElement('form');
    formDom.method = method.toUpperCase();
    formDom.style.display = 'none';
    if (formDom.method == 'GET') {
        formDom.action = resultUrl + '?' + qs.stringify(obj);
    } else {
        Object.keys(obj).forEach((_p, p) => {
            let textarea = document.createElement('textarea');
            textarea.value = obj[_p];
            textarea.name = _p;
            formDom.appendChild(textarea);
        })
        formDom.action = resultUrl;
    }
    document.body.appendChild(formDom);
    formDom.submit();
    setTimeout(() => {
        document.body.removeChild(formDom)
    }, 500)
}
export let checkIdCard = (value) => {
    return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)
}
export let checkEmail = (value) => {
    return /^([a-zA-Z0-9_\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/gi.test(value);
}
export let checkPhoneNumber = (value) => {
    return /^1[0-9]{10}$/.test(value)
}
//验证联系电话
/*规则：
 * 可以为空字符串或null；
 * 允许包含最多两个空格或"-"，不允许空格或"-"连续或交替输入;
 * 可以匹配手机、座机或400/800热线电话;
 * 联系电话正确返回true,错误返回false；
 */
export let checkContact = (value) => {
    let f = /^\d|-|\s{1,}$/
    let nf = /-{2,}|\s{2,}|(\s-)|(-\s)/
    let s = /(^1\d{10}$)|(^(0[1-9]\d{1,2})?\d{7,8}$)|(^(400|800)\d{7,8}$)/
    let v = value === null ? "" : value + "";
    if (v.length === 0) return true;
    if (f.test(v) && !nf.test(v) && v.replace(/\d/g, "").length < 3) {
        if (s.test(v.replace(/\D/g, ""))) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}
//检验非法文件类型
export let checkFileType = (fileName) => {
    let fileType = /\.[^\.]+$/.exec(fileName);
    if (fileType == ".exe" ||
        fileType == ".jar" ||
        fileType == ".jsp" ||
        fileType == ".asp" ||
        fileType == ".dll" ||
        fileType == ".php" ||
        fileType == ".aspx" ||
        fileType == ".bat" ||
        fileType == ".sh" ||
        fileType == ".html" ||
        fileType == ".com" ||
        fileType == ".cgi" ||
        fileType == ".class" ||
        fileType == ".jspx")
        return false;
    else
        return true;
}
// 校验是否是图片
export let checkIsImage = (fileName) => {
    let fileType = /\.[^\.]+$/.exec(fileName);
    if (fileType == ".gif" ||
        fileType == ".jpg" ||
        fileType == ".jpeg" ||
        fileType == ".img" ||
        fileType == ".bmp" ||
        fileType == ".png" ||
        fileType == ".tif" ||
        fileType == ".GIF" ||
        fileType == ".JPG" ||
        fileType == ".JPEG" ||
        fileType == ".IMG" ||
        fileType == ".BMP" ||
        fileType == ".PNG" ||
        fileType == ".TIF")
        return true;
    else
        return false;
}
// 校验是否是音视频
export let checkIsAudeo = (fileName) => {
    let fileType = /\.[^\.]+$/.exec(fileName);
    if (fileType == ".mp3" ||
        fileType == ".wma" ||
        fileType == ".wav" ||
        fileType == ".m4a" ||
        fileType == ".flac" ||
        fileType == ".MP3" ||
        fileType == ".WMA" ||
        fileType == ".WAV" ||
        fileType == ".M4A" ||
        fileType == ".FLAC" ||

        fileType == ".3gp" || //视频格式
        fileType == ".avi" ||
        fileType == ".flv" ||
        fileType == ".rm" ||
        fileType == ".rmvb" ||
        fileType == ".mp4" ||
        fileType == ".mkv" ||
        fileType == ".mov" ||
        fileType == ".wmv" ||
        fileType == ".3GP" ||
        fileType == ".AVI" ||
        fileType == ".FLV" ||
        fileType == ".RM" ||
        fileType == ".RMVB" ||
        fileType == ".MP4" ||
        fileType == ".MKV" ||
        fileType == ".MOV" ||
        fileType == ".WMV"
    )
        return true;
    else
        return false;
}