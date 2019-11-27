export default {
    props: {
        questionType: [String, Number]
    },
    data(){
        return {
            saveLoading: false
        }
    },
    methods: {
        // 返回列表页面
        handleBack(){
            this.$router.push(`/qn/manager/pages/${this.$route.query.type == 1 ? 'tp' : 'home'}`);
        },
        // 上一步
        handlePrestep(step){
            this.$emit('next-click', { step: step-1 })
        }
    }
}