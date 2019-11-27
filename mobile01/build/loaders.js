const jsexclude = /node_modules/;
module.exports = [
    {
        test: /\.json$/,  //用于匹配loaders所处理文件拓展名的正则表达式
        use: 'json-loader', //具体loader的名称
        type: 'javascript/auto',
        exclude: jsexclude
    },
    {
        test: /\.vue$/,
        use: ['vue-loader']
    },
    {
        test: /\.(png|jpg|gif|jepg|svg|webp)$/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 8192, // 小于8192字节的图片打包成base 64图片
                    outputPath: 'images/', //定义输出的图片文件夹
                    publicPath: 'images/',
                    name: '[name].[ext]' //打包后输出路径
                }
            }
        ]
    },
    {
        // 文件依赖配置项——字体图标
        test: /\.(woff|woff2|svg|eot|ttf)$/,
        use: [{
            loader: 'file-loader',
            options: {
                limit: 8192,
                name: 'fonts/[name].[ext]?[hash:8]',
                publicPath: '',
            },
        }],
    },
    {
        // 文件依赖配置项——音频
        test: /\.(wav|mp3|ogg)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                limit: 8192,
                name: 'audios/[name].[ext]?[hash:8]',
                publicPath: ''
            },
        }],
    },
    {
        // 文件依赖配置项——视频
        test: /\.(ogg|mpeg4|webm)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                limit: 8192,
                name: 'videos/[name].[ext]?[hash:8]',
                publicPath: ''
            },
        }]
    }
]