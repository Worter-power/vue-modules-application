class Moment {
    constructor(arg = new Date().getTime()) {
        if(typeof arg === 'string'){
            this.date = new Date(arg.replace(/-/g,'/'))
        }else{
            this.date = new Date(arg)
        }
    }
    // getTime()返回的是毫秒数，需要转成秒数并取整
    unix() {
        return Math.round(this.date.getTime())
    }
    valueOf(){
        return Math.round(this.date.getTime())
    }
    // 静态unix方法：参数timestamp 毫秒数  返回一个Date对象
    static valueOf(timestamp) {
        return new Moment(timestamp)
    }
    // 静态unix方法：参数timestamp 毫秒数  返回一个Date对象
    static unix(timestamp) {
        return new Moment(timestamp)
    }

    // format方法： 传入'YYY-MM-DD HH：mm:ss'，'YYY-MM-DD' 等，根据自己的传入要获取的格式（具体可参看moment.js的format的方法）
    format(formatStr) {
        const date = this.date
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const week = date.getDay()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()

        return formatStr.replace(/Y{2,4}|M{1,2}|D{1,2}|d{1,4}|H{1,2}|m{1,2}|s{1,2}/g, (match) => {
            switch (match) {
            case 'YY':
                return String(year).slice(-2)
            case 'YYY':
            case 'YYYY':
                return String(year)
            case 'M':
                return String(month)
            case 'MM':
                return String(month).padStart(2, '0')
            case 'D':
                return String(day)
            case 'DD':
                return String(day).padStart(2, '0')
            case 'd':
                return String(week)
            case 'dd':
                return weeks[week]
            case 'ddd':
                return '周' + weeks[week]
            case 'dddd':
                return '星期' + weeks[week]
            case 'H':
                return String(hour)
            case 'HH':
                return String(hour).padStart(2, '0')
            case 'm':
                return String(minute)
            case 'mm':
                return String(minute).padStart(2, '0')
            case 's':
                return String(second)
            case 'ss':
                return String(second).padStart(2, '0')
            default:
                return match
            }
        })
    }
}

export default (date)=>{
    return new Moment(date)
}