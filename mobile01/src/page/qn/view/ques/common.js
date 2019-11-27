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
        isHiddenTip: {
            type: Boolean,
            default: true
        },
        num: {
            type: String,
            default: '1'
        },
        pageLoading: {
            type: Boolean,
            default: false
        },
        questionType: [Number, String],
        readonly: {
            type: Boolean,
            default: false
        }
    },
    directives: {
        eclips: {
            inserted(el, binding, vnode){
                try {
                    if(el.scrollHeight <= el.clientHeight){
                        let child = el.getElementsByTagName('span');
                        if(child && child[0]){
                            child[0].style.display = "none";
                        }
                    }
                } catch (error) {
                    
                }
            },
            update(el, binding, vnode){
                try {
                    if(el.scrollHeight <= el.clientHeight){
                        let child = el.getElementsByTagName('span');
                        if(child && child[0]){
                            child[0].style.display = "none";
                        }
                    }
                } catch (error) {
                    
                }
            }
        }
    },
    data() {
        return {
            cloums: 24,
            //-------------------------------- 投票
            imgSize: {
                width: 280,
                height: 380
            },
            disabledChangeSize: false,
            oneWidth: 70,
            whpercent: 0.7,
            //-------------------------------- 投票
            // 多选分列数
            sortOptions: [
                { value: '1', label: this.$store.state.lang.qn.ls1 },
                { value: '2', label: this.$store.state.lang.qn.ls2 },
                { value: '3', label: this.$store.state.lang.qn.ls3 },
                { value: '4', label: this.$store.state.lang.qn.ls4 },
                { value: '6', label: this.$store.state.lang.qn.ls }
            ],
            ueconfig: {
                initialFrameHeight: 100,
                zIndex: 1500,
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
    methods: {
        handleSortChange(val) {
            if (val && val == 6) {
                this.imgSize.width = 190;
                this.imgSize.height = parseInt(190 / this.whpercent)
            }
        }
    }
}