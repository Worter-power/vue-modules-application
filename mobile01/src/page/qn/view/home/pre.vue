<template>
    <div class="sy-home-body sy-qn sy-qn-bg-w">
        <ul class="qn-pre">
            <li @click="handerClick('0')"  style="margin-bottom:40px;">
                <el-card :body-style="{ padding: '0px' }">
                    <img src="/common/images/qn/wj.png" class="image">
                    <div style="padding: 14px;">
                        <h1 style="margin: 0;">{{$store.state.lang.qn.b51}}</h1>
                    </div>
                    <p style="padding: 14px;">{{$store.state.lang.qn.b59}}</p>
                </el-card>
            </li>
            <li @click="handerClick('1')">
                <el-card :body-style="{ padding: '0px' }">
                    <img src="/common/images/qn/tp.png" class="image">
                    <div style="padding: 14px;">
                        <h1 style="margin: 0;">{{$store.state.lang.qn.b60}}</h1>
                    </div>
                    <p style="padding: 14px;">{{$store.state.lang.qn.b61}}</p>
                </el-card>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    methods: {
        handerClick(t){
            this.$router.push({path: '/qn/home/list', query: {type: t}})
        }
    }
}
</script>

<style lang="scss" scoped>
.qn-pre{
    text-align: center;
    padding: 50px 150px;
    li{
        width: 430px;
        display: inline-block;
        margin: 0 20px;
        transition: all .3s ease-in-out;
        cursor: pointer;
        &:hover{
            transform: scale(1.05);
        }
        img{
            width: 100%;
        }
    }
}
</style>