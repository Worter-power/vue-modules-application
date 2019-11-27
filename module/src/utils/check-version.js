function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6; //IE版本<=7
        }
    } else if (isEdge) {
        return 'edge'; //edge
    } else if (isIE11) {
        return 11; //IE11  
    } else {
        return -1; //不是ie浏览器
    }
} // -1 不是ie浏览器  'edge' ie的edge浏览器  
let pass = true;
if (IEVersion() == 6 || IEVersion() == 7 || IEVersion() == 8) {
    // 清空页面
    document.getElementsByTagName('body')[0].innerHTML = '';
    var divDom = document.createElement("div");
    divDom.style.lineHeight = '80px';
    divDom.style.textAlign = 'center';
    divDom.style.borderBottom = '1px solid #F56C6C';
    divDom.style.backgroundColor = 'rgba(245, 108, 108, .3)';
    var pText = document.createElement("p");
    pText.innerHTML = '您的浏览器版本过低，为了更好的体验产品，推荐您使用：Google浏览器、360急速浏览器、IE9及以上版本进行浏览';
    var aLink = document.createElement("a");
    aLink.href = "https://www.google.cn/chrome/"
    aLink.innerHTML = '下载';
    pText.appendChild(aLink);
    divDom.appendChild(pText);
    // document.getElementsByTagName('body')[0].innerHTML = '';
    document.getElementsByTagName('body')[0].appendChild(divDom);
    pass = false;
}

export default pass