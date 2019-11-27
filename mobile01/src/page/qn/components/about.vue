<template>
    <div class="mobile-body">
        <div class="mobile-container">
            <div class="mobile-about-header">
                <img :src="isOAM ? photoImageUrl : '/common/images/mobile/logo.png'">
                <p>{{isOAM ? $store.state.unitName : '上海师悦信息科技有限公司'}}</p>
                <div>版本号： {{currentVersion.version}}</div>
            </div>
            <div class="mobile-about-body">
                <van-divider>版本特色</van-divider>
                <ul class="mobile-about-metto">
                    <li v-for="item in currentVersion.metto" :key="item">
                        <i></i>
                        <p>{{item}}</p>
                    </li>
                </ul>
                <van-cell title="功能介绍" :to="morePath" is-link>
                </van-cell>
            </div>
        </div>
    </div>
</template>

<script>
import version from 'root/version.json';
export default {
    data() {
        return {
            isOAM: true,
            photoImageUrl: '',
            currentVersion: {
                version: '',
                date: '',
                model: '',
                metto: []
            },
            versionLists: [],
            morePath: ''
        }
    },
    created() {
        this.init();
    },
    methods: {
        init(){
            this.versionLists = version[this.$store.state.langType];
            this.photoImageUrl = '/api/storage/show/unit/'+ this.$store.state.unitId;
            if(this.versionLists.length){
                this.currentVersion = this.versionLists[0];
            }
            this.morePath = `abouts`;
            console.log(this.versionLists)
            this.$request('get', '/api/base/license/unit_oam', {noIntercept: true, unitId: this.$store.state.unitId}).then(res=>{
                if(res.status == 200){
                    this.isOAM = res.data;
                }else{
                    this.isOAM = false;
                }
            }).catch((err)=>{
                this.isOAM = false;
            })
        },
        // 查询关于文件
        getFileDocs(){
            this.$request('get', '/api/base/app_document/findByAppName', {noIntercept: true, appName: this.versionLists[0].code}).then(res=>{
                if(res.data){
                    this.versionLists.forEach((_s,s)=>{
                        let vs = _s.version.split('.').slice(0,3);
                        _s.fileList = res.data[vs.join('.')] || [];
                    })
                }
            }).catch((err)=>{
                
            })
        }
    }
}
</script>
<style scoped lang="scss">
.mobile-about-header{
    text-align: center;
    padding: 10px;
    img{
        height: 100px;
        width: 100px;
        border-radius: 50px;
        box-shadow: 0 0 5px #eee;
    }
    p{
        line-height: px2rem(40);
        font-size: 16px;
        color: $--color-text-primary;
    }
    >div{
        font-size: 14px;
        color: $--color-text-regular;
    }
}
.mobile-about-body{
    >ul{
        padding: 0 16px 20px 16px;
        line-height: px2rem(40);
        li{
            overflow: hidden;
            padding: 0 10px;
            i{
                float: left;
                width: px2rem(40);
                height: px2rem(40);
                text-align: center;
                position: relative;
                &:before{
                    content: '';
                    display: inline-block;
                    width: 5px;
                    height: 5px;
                    border-radius: 2.5px;
                    background-color: $--color-text-regular;
                }
            }
            p{
                color: $--color-text-regular;
                margin-left: px2rem(40);
                word-break: break-all;
            }
        }
    }
}
</style>