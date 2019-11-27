<template>
    <div class="mobile-body">
        <div class="mobile-container">
            <van-collapse v-model="activeNames">
                <van-collapse-item v-for="item in versionLists" :key="item.date" :title="item.model+' '+item.version" :name="item.date">
                    <ul class="mobile-about-metto">
                        <li v-for="row in item.metto" :key="row">
                            <i></i>
                            <p>{{row}}</p>
                        </li>
                    </ul>
                </van-collapse-item>
            </van-collapse>
        </div>
    </div>
</template>

<script>
import version from 'root/version.json';
export default {
    data() {
        return {
            versionLists: [],
            activeNames: []
        }
    },
    created() {
        this.versionLists = version[this.$store.state.langType] || [];
    }
}
</script>
<style scoped lang="scss">
.mobile-about-metto{
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
</style>