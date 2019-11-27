<template>
    <transition name="fade" mode="out-in" appear>
        <router-view></router-view>
    </transition>
</template>

<script>
import "./scss/index.scss";
import lang from "./lang/index";
export default {
    created(){
        this.$store.commit("CHANGE_LANG", lang);
    }
}
</script>