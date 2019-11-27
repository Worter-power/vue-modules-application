<template>
    <div class="sy-home-body sy-qn">
        <div class="qn-add-top">
            <ul>
                <li :class="[step >= 1 ? 'active' : '']" @click="handleStep(1)">
                    <div class="icons" :class="[step >= 1 ? 'sy-theme-background sy-theme-border' : '']">
                        <i class="fa fa-file-text-o" aria-hidden="true"></i>
                    </div>
                    <p :class="[step >= 1 ? 'sy-theme-text' : '']">{{$store.state.lang.qn[questionType == 0 ? 'q98' : 'b38']}}</p>
                </li>
                <li class="line" :class="[step >=2 ? 'active' : '']">
                    <div :class="[step >=2 ? 'sy-theme-border' : '']"></div>
                </li>
                <li :class="[step >= 2 ? 'active' : '']" @click="handleStep(2)">
                    <div class="icons" :class="[step >= 2 ? 'sy-theme-background sy-theme-border' : '']">
                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </div>
                    <p style="position: relative;left: -17px;" :class="[step >= 2 ? 'sy-theme-text' : '']">{{$store.state.lang.qn[questionType == 0 ? 'q99' : 'b39' ]}}</p>
                </li>
                <li class="line" :class="[step >=3 ? 'active' : '']">
                    <div :class="[step >=3 ? 'sy-theme-border' : '']"></div>
                </li>
                <li :class="[step >= 3 ? 'active' : '']" @click="handleStep(3)">
                    <div class="icons" :class="[step >= 3 ? 'sy-theme-background sy-theme-border' : '']">
                        <i class="fa fa-user-o" aria-hidden="true"></i>
                    </div>
                    <p style="position: relative;left: -17px;" :class="[step >= 3 ? 'sy-theme-text' : '']">{{$store.state.lang.qn[questionType == 0 ? 'q100' : 'b40' ]}}</p>
                </li>
            </ul>
        </div>
        <div class="qn-add-body">
            <div class="qn-add-body-container ">
                <component :is="componentId" @next-click="handlerNextClick" :questionType="questionType"></component>
            </div>
        </div>
    </div>
</template>

<script>
import step1 from './step/step1.vue';
import step2 from './step/step2.vue';
import step3 from './step/step3.vue';
export default {
    components: {
        step1,
        step2,
        step3
    },
    data() {
        return {
            componentId: 'step'+ (this.$route.query.step || 1),
            step: this.$route.query.step || 1,
            questionType: this.$route.query.type
        };
    },
    methods: {
        // 下一步回调函数
        handlerNextClick(data){
            this.componentId = 'step'+data.step;
            this.$router.push({path: this.$route.path, query: {
                qnid: data.qnid || this.$route.query.qnid,
                realName: data.realName || this.$route.query.realName,
                step: data.step || this.$route.query.step,
                tp: this.$route.query.tp,
                type: this.$route.query.type,
            }})
            this.step = data.step;
        },
        // 点击切换step
        handleStep(step) {
            if(!this.$route.query.qnid && step != 1){
                this.$notify({
                    title: this.$store.state.lang.qn.q29,
                    message: this.$store.state.lang.qn.q125,
                    type: 'warning'
                });
                return
            }
            this.handlerNextClick({step: step});
        }
    }
};
</script>

<style scoped>
    .qn-add-top,
    .qn-add-body {
        position: absolute;
        left: 0;
        box-sizing: border-box;
        width: 100%;
        padding: 0 10px;
    }

    .qn-add-top {
        height: 100px;
        border-bottom: 1px solid #eeeeee;
        text-align: center;
    }

    .qn-add-top>ul {
        width: 550px;
        margin: 0 auto;
    }

    .qn-add-top>ul>li {
        height: 100px;
        float: left;
        vertical-align: bottom;
    }

    .qn-add-top>ul>li:not(.line) {
        width: 50px;
        cursor: pointer;
    }

    .qn-add-top>ul>li:not(.line) p {
        white-space: nowrap;
        line-height: 36px;
        font-size: 14px;
        font-weight: 700;
    }

    .qn-add-top>ul>li.line>div {
        height: 0;
        border-top: 2px solid #bfcbd9;
        width: 200px;
        margin-top: 35px;
    }

    .qn-add-top>ul>li.line.active>div {
        border-color: #3c5617;
    }

    .qn-add-top>ul>li>div.icons {
        height: 50px;
        width: 50px;
        border-radius: 25px;
        border: 2px solid #bfcbd9;
        line-height: 50px;
        text-align: center;
        box-sizing: border-box;
        margin-top: 10px;
    }

    .qn-add-top>ul>li.active>div.icons {
        background-color: #3c5617;
        color: #fff;
        border-color: #3c5617;
    }

    .qn-add-top>ul>li.active>div.icons>i {
        color: #fff;
    }

    .qn-add-top>ul>li.active>p {
        color: #3c5617;
    }

    .qn-add-top>ul>li>div.icons>i {
        color: #bfcbd9;
        font-size: 24px;
        position: relative;
        top: 3px;
    }

    .qn-add-body {
        top: 100px;
        bottom: 0;
        padding: 10px;
    }

    .qn-add-body-container {
        max-width: 1220px;
        margin: 0 auto;
        height: 100%;
        overflow-y: auto;
        position: relative;
    }
</style>