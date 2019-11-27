const path = require('path');
module.exports = {
    openEslink: true,
    name: 'base',
    buildPublicPath: '/base/',
    port: 8080,
    publicPath: '/',
    open: false, // 开启浏览器
    contentBase: [
        path.join(__dirname, "public"), 
        path.join(__dirname, "static"), 
        path.join(__dirname, "dist")
    ],
    proxy: {
        "/api": {
            "target": "http://1.shiyuesoft.com",
            "changeOrigin": true,
            "pathRewrite": {
                "^/api": "/api"
            }
        },
        "/common": {
            "target": "http://1.shiyuesoft.com",
            "changeOrigin": true,
            "pathRewrite": {
                "^/common": "/common"
            }
        }
    }
}