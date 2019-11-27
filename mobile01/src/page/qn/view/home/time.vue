<template>
    <span>
        <span>{{days}}</span> {{$store.state.lang.qn.q49}} <span>{{hours}}</span> {{$store.state.lang.qn.q50}} <span>{{minutes}}</span> {{$store.state.lang.qn.q51}} <span>{{seconds}}</span> {{$store.state.lang.qn.q52}}
    </span>
</template>

<script>
    import QRCode from "qrcode";
    export default {
        props: {
            data: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        data() {
            return {
                text: '',
                days: '',
                hours: '',
                minutes: '',
                seconds: '',
                end: ''
            }
        },
        created() {
            this.init()
        },
        watch: {
            'data': {
                handler(newVal, oldVal){
                    this.init();
                },
                deep: true
            }
        },
        methods: {
            init() {
                
                if(this.data.status == 2){
                    if(this.data.beginDate && this.data.beginTime){
                        let d = this.data.beginDate.split('-');
                        let h = this.data.beginTime.split(':');
                        var date = new Date(d[0], d[1], d[2], h[0], h[1], h[2]);
                        this.end = moment(date);
                        this.leftTimer();
                    }
                }else{
                    if(this.data.endDate && this.data.endTime){
                        let d = this.data.endDate.split('-');
                        let h = this.data.endTime.split(':');
                        var date = new Date(d[0], d[1], d[2], h[0], h[1], h[2]);
                        this.end = moment(date.getTime());
                        this.leftTimer();
                    }
                }
            },
            leftTimer(){ 
                var year = this.end.format('YYYY');
                var month = this.end.format('M')-1;
                var day = this.end.format('D');
                var hour = this.end.format('H');
                var minute = this.end.format('m');
                var second = this.end.format('s');
                var leftTime = (new Date(year,month-1,day,hour,minute,second)) - (new Date()); //计算剩余的毫秒数 
                
                var days = parseInt(leftTime / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数 
                var hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时 
                var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟 
                var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数 
                this.days = this.checkTime(days); 
                this.hours = this.checkTime(hours); 
                this.minutes = this.checkTime(minutes); 
                this.seconds = this.checkTime(seconds);  
                this.text = this.days+"天" + this.hours+"小时" + this.minutes+"分"+this.seconds+"秒"; 
                if(leftTime>0){            
                    setTimeout(()=>{                
                        this.leftTimer();        
                    },1000);        
                }else{            
                    clearTimeout(this.leftTimer());        
                }
            },
            checkTime(i){ //将0-9的数字前面加上0，例1变为01 
                if(i<10){ 
                    i = "0" + i; 
                } 
                return i; 
            } 
        }
    }
</script>

<style scoped>
    /* span>span {
        display: inline-block;
        height: 14px;
        background-color: #AAAAAA;
        border-radius: 5px;
        color: #fff;
        padding: 0 3px;
    } */
</style>