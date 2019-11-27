<template>
    <div class="qn-items sy-theme-border-hover">
        <div class="qn-items-iocns" 
            :class="[data.fillStatus > 0 ? 'info' : 'danger']">
            <span>{{data.fillStatus > 0 ? $store.state.lang.qn.q44 : $store.state.lang.qn.q45}}</span>
        </div>
        <div class="qn-items-text"  @click="handleGo(data)">
            <el-popover
                effect="light" 
                placement="right"
                popper-class="code_img"
                class="code_img"
                trigger="hover">
                <img :src="outCode" alt="" width="200" height="200">
                <img slot="reference" :src="outCode" alt="" width="100" height="100">
            </el-popover>
            <div>
                <h4 class="cp">
                    <el-tooltip class="item" 
                        effect="light" 
                        :content="data.status == 1 ? (data.fillStatus > 0 ? $store.state.lang.qn.q46 :$store.state.lang.qn.q47) : $store.state.lang.qn.q46" 
                        placement="right">
                        <b >{{data.name}}</b>
                    </el-tooltip>
                </h4>
                <div class="sy-theme-text qn-remark">{{data.remark}}</div>
            </div>
        </div>
        <div class="qn-items-time">
            <span v-if="data.status == 1">{{$store.state.lang.qn.q7}}</span>
            <span v-if="data.status == 2">{{$store.state.lang.qn.q8}}</span>
            <stime v-if="data.status == 1 || data.status == 2" :data="data"></stime>
            <span v-if="data.status == 4 || data.status == 3">{{$store.state.lang.qn.q9}}</span>
            <span v-if="data.status == 4 || data.status == 3">{{data.endDate + ' ' + data.endTime}}</span>
            <span v-if="(data.status == 4 || data.status == 3) && data.hasReport == 1" 
                style="float: right;cursor: pointer;" 
                @click.stop="handleBB(data)">{{$store.state.lang.qn.q48}}</span>
        </div>
        <el-dialog2 :title="$store.state.lang.message.info" height="210px" width="390px" slide="fade" :visible.sync="infoDialog">
            <div slot="body" style="text-align: center;line-height: 130px;font-size: 16px;">
                <i class="el-icon-warning" style="color: #E6A23C"></i>
                <span>{{$store.state.lang.qn.q28}}</span>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button style="margin: 0 3px;" @click="infoDialog = false"  >{{$store.state.lang.button.close}}</el-button>
            </div>
        </el-dialog2>
    </div>
</template>

<script>
    import QRCode from "qrcode";
    import stime from "./time.vue";
    export default {
        components: {
            stime
        },
        props: {
            data: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        data() {
            return {
                infoDialog: false,
                outCode: ''
            }
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                this.toOutStock();
            },
            toOutStock() {
                QRCode.toDataURL(location.origin +'/qn/wj?id='+ this.data.id + '&unitid=' + this.$store.state.unitId, (err, url) => {
                    this.outCode = url
                })
            },
            handleGo(data){
                if(data.status == 1){
                    if(data.fillStatus <= 0){
                        this.$router.push({path: '/qn/wj', query: {id: data.id, unitid: this.$store.state.unitId}})
                    }else{
                        this.$router.push({path: '/qn/detail', query: {id: data.id}})
                    }
                }else if(data.status == 2){
                    this.infoDialog = true;
                }else{
                    this.$router.push({path: '/qn/detail', query: {id: data.id}})
                }
            },
            handleBB(data){
                this.$router.push({path: '/qn/manager/bb', query: {id: data.id, type: data.type, res: 'home', label: this.$route.query.label}})
            }


            
        }
    }
</script>

<style scoped>
    .qn-items {
        padding: 10px;
        position: relative;
        border: 1px solid #CCCCCC;
        font-size: 12px;
        margin-bottom: 20px;
        cursor: pointer;
        background-color: #fff;
    }

    .qn-items-iocns {
        position: absolute;
        width: 0;
        height: 0;
        border: 24px solid #13CE66;
        border-bottom-color: transparent;
        border-left-color: transparent;
        right: 0;
        top: 0;
    }

    .qn-items-iocns.info {
        border-top-color: #E6A23C;
        border-right-color: #E6A23C;
    }

    .qn-items-iocns.danger {
        border-top-color: #FF4949;
        border-right-color: #FF4949;
    }

    .qn-items-iocns>span {
        position: absolute;
        top: -14px;
        left: -3px;
        width: 26px;
        color: #fff;
        transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        -o-transform: rotate(45deg);
    }
    .qn-items-text{
        min-height: 100px;
    }
    .qn-items-text>.code_img {
        position: absolute;
        cursor: pointer;
        z-index: 10;
    }
    .qn-items-text>img:hover{
        width: 250px;
        height: 250px;
        transition: all 1s;
        z-index: 10000;
    }
    .qn-items-text>div {
        padding: 10px 10px 10px 115px;
    }

    .qn-items-text>div>h4 {
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin: 0;
    }

    .qn-items-text>div>div {
        padding-top: 10px;
        font-size: 12px;
        word-wrap: break-word;
        color: #3C9F4E;
    }

    .qn-items-text::after {
        content: '';
        display: block;
        clear: both;
    }

    .qn-items-time {
        padding-left: 10px;
    }
    .qn-remark{
        height: 50px;
        overflow: hidden;
    }
    
</style>