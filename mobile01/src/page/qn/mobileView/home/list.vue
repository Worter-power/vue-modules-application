<template>
    <div class="mobile-body">
        <div class="mobile-container">
            <van-collapse v-model="activeNames">
                <van-collapse-item title="问卷进行中" name="1">
                    <div v-if="questionList.ongoingList.length == 0" class="no-data">暂无数据</div>
                    <ul class="qnlist">
                        <li v-for="item in questionList.ongoingList" :key="item.id">
                            <card :item="item"></card>
                        </li>
                    </ul>
                </van-collapse-item>
                <van-collapse-item title="未开始的问卷" name="2">
                    <div v-if="questionList.beginList.length == 0" class="no-data">暂无数据}</div>
                    <ul class="qnlist">
                        <li v-for="item in questionList.beginList" :key="item.id">
                            <card :item="item"></card>
                        </li>
                    </ul>
                </van-collapse-item>
            </van-collapse>
        </div>
    </div>
</template>

<script>
import card from "./card.vue";
export default {
    name: "home",
    components: {
        card
    },
    data() {
        return {
            value: '',
            minHour: 10,
            maxHour: 20,
            minDate: new Date(),
            maxDate: new Date(2019, 10, 1),
            currentDate: new Date(),
            activeNames: ['1','2'],
            questionList: {
                beginList: [], // 未开启的
                ongoingList: [] // 开启中的
            }
        }
    },
    computed: {
        
    },
    created() {
        this.init();
    },
    methods: {
        init(){
            this.getList();
        },
        // 查询问卷列表
        getList(){
            this.showLoading();
            this.$request('get', '/api/qn/qnStatistics/homePage', {}).then(res=>{
                if(res.status == 200 && res.data){
                    this.questionList.beginList = res.data.beginList || [];
                    this.questionList.ongoingList = res.data.ongoingList || [];
                }
                
                this.hideLoading();
            }).catch(err=>{
                this.hideLoading();
            })
        },
    },
    mounted(){
        
    },
    activated() {

    },


};
</script>

<style lang="scss">
.qn-list{
    .van-cell{
        background-color: $--border-color-extra-light;
        .van-cell__title>span{
            font-weight: bold;
            color: $--color-text-regular;
        }
    }
}
.qnlist{
    li{
        margin-bottom: px2rem(10);
    }
}
</style>