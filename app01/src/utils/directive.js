import store from "@/vuex/index.js";
export default (vue)=>{
    // 注册一个全局自定义指令 v-ape
    vue.directive('ape', {
        inserted: function (el, binding) {
            let args = binding.value;
            if(typeof args === 'string'){
                if(!store.state.codeKeys[args]){
                    el.parentNode.removeChild(el); 
                }
            }else{
                if(Object.prototype.toString.call(args) === '[object Array]'){
                    let isRemove = false;
                    args.forEach(code=>{
                        if(!store.state.codeKeys[code]){
                            isRemove = true;
                        }
                    })
                    if(isRemove){
                        el.parentNode.removeChild(el); 
                    }
                }
            }
        }
    })
}