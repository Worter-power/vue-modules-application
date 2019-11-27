
export default {
    props: {
        questionType: [Number, String]
    },
    data(){
        return {
            pageLoading: false,
            currentName: '',
            currentUnitId: '',
            options: [],
        }
    },
    methods: {
        getUnit(){
            request('get', '/api/qn/qnQuestionnaire/progress', {
                qnId: this.$route.query.id
            }).then(res=>{
                let arr = [];
                if(res.status == 200 && res.code == 'ok' &&　res.data){
                    res.data.forEach((_s,s)=>{
                        arr.push({
                            value: _s.unitId,
                            label: _s.unitName
                        })
                    })
                }
                this.options = arr;
                this.currentUnitId = arr.length>0?arr[0].value:'';
                this.currentName = arr.length>0?arr[0].label: this.$store.state.unitName;
            }).catch(err => {
                this.pageLoading = false;
            })
        },
    }
}