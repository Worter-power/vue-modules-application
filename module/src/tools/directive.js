import download from './download-tables.js';
import { setStyle } from "@/utils/dom";

const styles = {
    display: 'block',
    'box-sizing': 'border-box',
    width: '100%',
    'vertical-align': 'middle',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
    'overflow': 'hidden'
}

export default (Vue) => {
    Vue.directive('focus', { //输入框自动获得焦点
        inserted: (el) => {
            el.focus()
        }
    });

    Vue.directive("back", { //返回上个history页面
        bind: (el, binding, vnode) => {
            el.addEventListener('click', () => {
                window.history.go(-1);
            })
        }
    });
    let getStyles = function (styles, _styles) {
        if (_styles) {
            for (let key in _styles) {
                styles[key] = _styles[key];
            }
        }
        return styles;
    };
    Vue.directive("title", {
        //溢出隐藏 并增加鼠标提示
        bind: (el, binding, vnode) => {
            if (binding.value) {
                setStyle(el, getStyles(styles, binding.value.styles), null);
                if (el.offsetWidth < el.scrollWidth) {
                    el.setAttribute("title", binding.value.title);
                }
            } else {
                if (el.offsetWidth < el.scrollWidth) {
                    var re1 = new RegExp("<.+?>", "g");
                    el.setAttribute("title", el.innerHTML.replace(re1, ''));
                }
            }
        },
        inserted: (el, binding, vnode) => {
            if (binding.value) {
                setStyle(el, getStyles(styles, binding.value.styles), null);
                if (el.offsetWidth < el.scrollWidth) {
                    el.setAttribute("title", binding.value.title);
                }
            } else {
                if (el.offsetWidth < el.scrollWidth) {
                    var re1 = new RegExp("<.+?>", "g");
                    el.setAttribute("title", el.innerHTML.replace(re1, ''));
                }
            }
        },
        componentUpdated: (el, binding, vnode) => {
            if (binding.value) {
                setStyle(el, getStyles(styles, binding.value.styles), null);
                if (el.offsetWidth < el.scrollWidth) {
                    el.setAttribute("title", binding.value.title);
                }
            } else {
                if (el.offsetWidth < el.scrollWidth) {
                    var re1 = new RegExp("<.+?>", "g");
                    el.setAttribute("title", el.innerHTML.replace(re1, ''));
                }
            }
        }
    });
    let movetext = (el) => {
        let boxw = el.offsetWidth;
        let maxW = el.scrollWidth;
        let paremtDom = el.parentNode;

        let reg = new RegExp("<.+?>", "g");
        let isChildren = reg.test(el.innerHTML);
        if (!paremtDom) { return }
        let _cz = maxW - boxw;
        if (_cz > 0) {
            el.style.position = 'relative';
            if (isChildren) {
                el.style.zIndex = -1;
            }
            let timer = '';
            let start = () => {
                if (timer) {
                    clearInterval(timer)
                }
                let startnum = 0;
                timer = setInterval(() => {
                    el.style.left = startnum + 'px';
                    if (Math.abs(startnum) - maxW > 0) {
                        el.style.left = boxw + 'px';
                        startnum = boxw;
                    }
                    startnum = startnum - 2;
                }, 83);
            }
            paremtDom.onmouseover = function(e) {
                start()
                el.style.width = maxW * 1 + 2 + 'px';
            }
            paremtDom.onmouseout = () => {
                clearInterval(timer)
                el.style.width = boxw + 'px';
                el.style.left = 0;
            }
        }
    }
    Vue.directive("textscreen", {
        inserted: (el, binding, vnode) => {
            movetext(el)
        },
        update: (el, binding, vnode) => {
            movetext(el)
        }
    });

    Vue.directive("download", {
        bind(el, binding) {
            download(el, binding);
        },
        // update(el, binding) {
        //     el.onclick = null;
        //     el.onblur = null;
        //     download(el, binding);
        // }
    });
}