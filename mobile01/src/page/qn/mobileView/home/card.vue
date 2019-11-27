<template>
    <div class="qn-items-box" @click="handleAnswerQn(item)">
        <div class="qn-items-iocns" 
            :class="[item.fillStatus > 0 ? 'info' : 'danger']">
            <span>{{item.fillStatus > 0 ? "已填" : "未填"}}</span>
        </div>
        <van-notice-bar color="#606266" background="#ffffff"> {{item.name}} </van-notice-bar>
        <p>{{item.remark}}</p>
        <div class="qn-times">
            <span v-if="item.status == 1">距离任务结束：</span>
            <span v-if="item.status == 2">距离任务开始：</span>
            <van-count-down :time="_DatetoTime(item)" style="display: inline-block;">
                <template v-slot="timeData">
                    <span class="tiem">{{ timeData.days }}</span>
                    <span class="tiem-text">天</span>
                    <span class="tiem">{{ timeData.hours }}</span>
                    <span class="tiem-text">时</span>
                    <span class="tiem">{{ timeData.minutes }}</span>
                    <span class="tiem-text">分</span>
                    <span class="tiem">{{ timeData.seconds }}</span>
                    <span class="tiem-text">秒</span>
                </template>
            </van-count-down>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            default: ()=>{
                return {}
            }
        }
    },
    data() {
        return {
            time: 5 * 60 * 60 * 1000
        }
    },
    methods: {
        // 查看 或者 开始问卷
        handleAnswerQn(item){
            console.log(item)
            if(item.status == 2){
                this.$notify("问卷未开始，请耐心等待！");
                return
            }
            if(item.fillStatus <= 0){
                this.$router.push({path: '/qn-mobile/home/desc', query: {id: item.id}})
            }else{
                this.$router.push({path: '/qn-mobile/home/details', query: {id: item.id}})
            }
        },
        // 时间转化毫秒数
        _DatetoTime(item){
            if(item.status == 1){
                let dateTime = `${item.endDate} ${item.endTime}`;
                dateTime = dateTime.replace(/-/g,"/");
                let times = 0;
                try {
                    times = new Date(dateTime).getTime() - new Date().getTime();
                } catch (error) {
                    
                }
                return times
            }else if(item.status == 2){
                let dateTime = `${item.beginDate} ${item.beginTime}`;
                dateTime = dateTime.replace(/-/g,"/");
                let times = 0;
                try {
                    times = new Date(dateTime).getTime() - new Date().getTime();
                } catch (error) {
                    
                }
                return times
            }else{
                return 0
            }
        }
    }
}
</script>

<style lang="scss">
.qn-items-box{
    border: 1px solid $--border-color-lighter;
    border-radius: 3px;
    position: relative;
    min-height: px2rem(120);
    .van-notice-bar__content{
        font-weight: bold;
    }
    .qn-items-iocns {
        position: absolute;
        width: 0;
        height: 0;
        border: px2rem(24) solid #13CE66;
        border-bottom-color: transparent;
        border-left-color: transparent;
        right: 0;
        z-index: 10;
        top: 0;
        >span {
            position: absolute;
            top: -14px;
            left: -3px;
            width: px2rem(26);
            color: #fff;
            transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
            -o-transform: rotate(45deg);
        }
        &.info {
            border-top-color: #E6A23C;
            border-right-color: #E6A23C;
        }
        &.danger {
            border-top-color: #FF4949;
            border-right-color: #FF4949;
        }

    }
    >p{
        padding: 0 15px;
        line-height: .5rem;
        color: $--color-success;
        height: 1rem;
        overflow: hidden;
        font-size: px2rem(12);
        word-break: break-all;
    }
    .qn-times{
        padding: 0 15px;
        line-height: .5rem;
        color: $--color-text-primary;
        font-size: px2rem(12);
        .tiem{
            display: inline-block;
            width: .5rem;
            border-radius: 4px;
            margin: 0 3px;
            color: #fff;
            font-size: 12px;
            text-align: center;
            background-color: $--color-text-secondary;
        }
        .tiem-text{
            font-size: px2rem(12);
        }
    }
    
}
</style>

