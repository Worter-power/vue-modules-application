export default {
    props: {
        data: {
            type: Object,
            default: () => {
                return {}
            }
        },
        show: {
            type: Boolean,
            default: false
        },
        num: {
            type: String,
            default: '1'
        },
        start: {
            type: Number,
            default: 0
        },
        totles: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            // 显示头像all
            showImgUrlAll: window.ShiYue.base + '/api/storage/show/',
            ueconfig: {
                initialFrameHeight: 100,
                zIndex: 3000,
                toolbars: [
                    [
                        'bold', 'forecolor', 'italic', 'underline',
                        'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify',
                        'fontsize',
                        'simpleupload', 'imagenone', 'imageleft', 'imageright',
                        'removeformat'
                    ]
                ]
            }
        }
    },
    mounted() {
        let me = this;
        // if(this.$refs['quetion_title']){
        //     this.$refs['quetion_title'].editor.addListener('blur',function(editor){
        //         me.form.name = this.getContent();
        //     })
        // }
    }
}