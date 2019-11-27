// 进入全屏
const fullScreen = (el) => {
    let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen, 
        wscript;
    if(typeof rfs != "undefined" && rfs) { 
        rfs.call(el); 
        return; 
    }   
    if(typeof window.ActiveXObject != "undefined") { 
        wscript = new ActiveXObject("WScript.Shell"); 
        if(wscript) { 
            wscript.SendKeys("{F11}"); 
        } 

    } 
};
// 退出全屏
const exitFullScreen = () => {
    let el = document;
    let cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen, 
        wscript; 
    if (typeof cfs != "undefined" && cfs) { 
        cfs.call(el); 
        return; 
    }  
     if (typeof window.ActiveXObject != "undefined") { 
        wscript = new ActiveXObject("WScript.Shell"); 
        if (wscript != null) { 
            wscript.SendKeys("{F11}"); 
        } 
    }    
}

export default (el)=>{
    if(el === false || el === undefined){
        exitFullScreen();
    }else{
        fullScreen(el)
    }
}