const path = require('path');
module.exports = {
    openEslink: true,
    name: 'ph',
    buildPublicPath: '/ph/',
    port: 8081,
    publicPath: '/',
    open: false, // 开启浏览器
    contentBase: [
        path.join(__dirname, "public"),
        path.join(__dirname, "static")
    ],
    proxy: {
        "/api": {
            "target": "xxxxxxx",
            "changeOrigin": true,
            "pathRewrite": {
                "^/api": "/api"
            }
        },
        "/common": {
            "target": "xxxxxxx",
            "changeOrigin": true,
            "pathRewrite": {
                "^/common": "/common"
            }
        }
    }
}