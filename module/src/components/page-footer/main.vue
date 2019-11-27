<template>
    <div class="el-page-footer sy-theme-background">
        <div>
            <a :href="loginConfigMsg.link" target="_blank">{{langs[langType].bq}}{{loginConfigMsg.footer}}</a>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'ElPageFooter',
    props: {
        height: {
            type: String,
            default: '37px'
        },
        theme: {
            type: String,
            default: ''
        },
        fixed: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            loginConfigMsg: {
                footer: '百度',
                link: 'http://www.baidu.com'
            },
            langType: 'zh-CN',
            langs: {
                en: {
                    bq: 'Copyright:'
                },
                'zh-CN': {
                    bq: "版权所有："
                }
            }
        }
    },
    created() {
        // 获取语言设置
        let _lang = window.localStorage.getItem("lange_");
        if(_lang && _lang != 'null' && _lang != 'undfined'){
            this.langType = _lang;
        }
    }
  };
</script>

<style lang="scss" scoped>
$footer-height: 37px;
.el-page-footer{
    height: $footer-height;
    line-height: $footer-height;
    text-align: center;
    color: $--color-white;
    background-color: $--color-primary;
    a{
        color: $--color-white;
        text-decoration: none;
        cursor: pointer;
    }
}
</style>