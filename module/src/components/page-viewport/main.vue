<template>
<div class="app-container-box">
    <div v-for="item in fileList" :key="item" :style="{'display':current == item ? '' : 'none'}" class="app-container-box">
        <div :id="item"></div>
    </div>
</div>
</template>

<script>
import { getQueryString } from "@/utils/href";
export default {
    name: 'ElPageViewport',
    data(){
        return{
            fileList:[],
            current: ''
        }
    },
    created(){
        this.$parent.$emit('currentPage',  this.$route.path);
    },
    watch: {
        $route(){
            this.initFiles();
        }
    },
    methods: {
        initFiles(){

            // this.removeScript();
            let {app, fileId, id, linkUrl} = this.$route.query;
            if(fileId){
                this.current = fileId
                if(this.fileList.indexOf(fileId)==-1){
                    this.fileList.push(fileId)
                    this.$nextTick(()=>{
                        this._buildeScript(app,fileId)
                    })
                }
            }
            
        },
        _buildeScript(app,fileId){
            this.$request('get', `/${app}/manifest.json`, {}).then(res=>{
                if(res && res[fileId+'.js']){
                    // css
                    if(res[fileId+'.css']){
                        var nod = document.createElement("style");
                        nod.href = res[fileId+'.css'];
                        document.getElementsByTagName("head")[0].appendChild(nod);
                    }
                    // js
                    let script = document.createElement('script');
                    script.id= fileId;
                    script.type= "text/javascript";
                    script.src = res[fileId+'.js'];
                    document.getElementsByTagName('body')[0].appendChild(script);
                }
            })
        },
        removeScript(){
            let script = document.getElementById('viewport-fild-box');
            if(script){
                document.getElementsByTagName('body')[0].removeChild(script)
            }
        }
    },
    mounted(){
        this.initFiles();
    },
    destroyed(){
        this.removeScript();
    }
}
</script>