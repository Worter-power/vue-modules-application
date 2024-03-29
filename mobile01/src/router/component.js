function componentCont(component, code) {
    let cont
    if (component == 'log') {
        cont = {
            template: '<el-page-log code="' + code + '"></el-page-log>',
            created() {
                this.$parent.$emit("currentPage", this.$route.path);
            }
        }
    } else if (component == 'auth') {
        cont = {
            template: '<el-page-auth code="' + code+ '" :unit-id="$store.state.unitId"></el-page-auth>',
            created() {
                this.$parent.$emit("currentPage", this.$route.path);
            }
        }
    } else if (component == 'viewport') {
        cont = {
            template: '<el-page-viewport></el-page-viewport>',
            created() {
                this.$parent.$emit("currentPage", this.$route.path);
            }
        }
    }else if (component == 'hello') {
        cont = {
            template: '<el-page-hello :name="$store.state.realName"></el-page-hello>'
        }
    }
    return cont
}
export default componentCont