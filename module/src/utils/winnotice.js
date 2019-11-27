const winnotice = (options)=>{
    console.log(1231654564)
    if (window.Notification) {
        var popNotice = function() {
            if (Notification.permission == "granted") {
                var notification = new Notification("Hi，帅哥：", {
                    body: '可以加你为好友吗？',
                    icon: 'http://image.zhangxinxu.com/image/study/s/s128/mm1.jpg'
                });
                
                notification.onclick = function() {
                    text.innerHTML = '张小姐已于' + new Date().toTimeString().split(' ')[0] + '加你为好友！';
                    notification.close();    
                };
            }    
        };
        
        if (Notification.permission == "granted") {
            popNotice();
        } else if (Notification.permission != "denied") {
            Notification.requestPermission(function (permission) {
                popNotice();
            });
        }
    } else {
        alert('浏览器不支持Notification');    
    }

}
export default (options)=>{
    winnotice(options)
}