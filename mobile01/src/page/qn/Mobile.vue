<template>
    <div id="app" :class="[$store.state.theme]" class="mobile">
        <router-view></router-view>
    </div>
</template>

<script>
import './scss/mobile/common.scss';
import './scss/mobile/qn.scss';
import inits from './js/mobile-init.js';
export default {
    created(){
        // 初始化
        inits(this);
    }
};
</script>