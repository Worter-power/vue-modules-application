<template>
    <div>
        <h1>主题色</h1>
        
        <ul>
            <li v-for="(item, index) in themeColorList" :key="index" :style="{backgroundColor: item.color}"> 
                {{item['zh-CN']}}
            </li>
        </ul>
        <div v-for="(item, index) in colorData" :key="index" >
            <ul>
                <li v-for="(color, index) in item" :key="index" :style="{backgroundColor: color.color}"> 
                    {{color.color}}
                </li>
            </ul>
        </div>
        <h1>文字颜色</h1>
        
        <ul>
            <li v-for="(item, index) in textColor" :key="index" :style="{backgroundColor: item}"> 
                {{item}}
            </li>
        </ul>
        <h1>边框颜色</h1>
        
        <ul>
            <li v-for="(item, index) in border" :key="index" :style="{backgroundColor: item}"> 
                {{item}}
            </li>
        </ul>
        <h1>提示颜色</h1>
        
        <ul>
            <li v-for="(item, index) in infoColor" :key="index" :style="{backgroundColor: item}"> 
                {{item}}
            </li>
        </ul>


    </div>
</template>

<script>
import color from '@/utils/theme/colorFun.js';
export default {
    data(){
        return {
            colorMap: {
                '#457cd6': 'primary0',
                '#5889da': 'primary1',
                '#6a96de': 'primary2',
                '#7da3e2': 'primary3',
                '#8fb0e6': 'primary4',
                '#a2beeb': 'primary5',
                '#b5cbef': 'primary6',
                '#c7d8f3': 'primary7',
                '#dae5f7': 'primary8',
                '#ecf2fb': 'primary9',
                '#3e70c1': 'primary10' 
            },
            colorData: [],
            themeColorList: [ 
                {
                    'zh-CN': '东方蓝',
                    en: 'Oriental Blue',
                    color: '#457CD6'
                }, 
                {
                    'zh-CN': '中国红',
                    en: 'China red',
                    color: '#e31d1a'
                },{
                    'zh-CN': '赛罗蓝',
                    en: 'Siro Blue',
                    color: '#49C1D9'
                }, {
                    'zh-CN': '清新绿',
                    en: 'Fresh green',
                    color: '#4DB021'
                },
                {
                    'zh-CN': '水墨',
                    en: 'Fresh green',
                    color: '#A9947F'
                },
                {
                    'zh-CN': '荷花',
                    en: 'Fresh green',
                    color: '#b3b99f'
                },
                {
                    'zh-CN': '卡通',
                    en: 'Fresh green',
                    color: '#3ABAE8'
                }
            ],
            textColor: ['#303133', '#606266', '#909399', '#C0C4CC'],
            border: [ '#dfe6ec', '#DCDFE6', '#E4E7ED', '#EBEEF5', '#F2F6FC'],
            infoColor: ['#13ce66', '#E6A23C', '#F56C6C', '#909399', '#eef1f6']
        }
    },
    created(){
        this.init();
    },
    methods:{
        init(){
            let arr = [];
            this.themeColorList.forEach((_s,s)=>{
                let colors = color(_s.color)
                let _arr = [];
                Object.keys(colors).forEach((_d,d)=>{
                    _arr.push({
                        color: colors[_d],
                        name: _d
                    })
                })
                arr.push(_arr)
            })
            this.colorData = arr;
        }
    }
}
</script>
<style lang="scss" scoped>
h1{
    margin: 0;
}
ul{
    overflow: hidden;
    li{
        float: left;
        width: 55px;
        height: 55px;
        text-align: center;
        line-height: 50px;
    }
}
</style>