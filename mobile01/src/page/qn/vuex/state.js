let imgurl = '';
if (process.env.NODE_ENV == 'production') {
    imgurl = window.ShiYue.base + '/api/storage/show/';
}else{ 
    imgurl = 'http://1.shiyuesoft.com/api/storage/show/';
}
export default {
    imgurl
}