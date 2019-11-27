## 全局变量 
    1. window.BUS = new Vue();
    2. window.Vue = Vue;
    3. window.Vuex = Vuex;
    4. window.VueRouter = VueRouter;
    
    5. window.request = request; // 异步请求
    6. window.Notification = Notification; // 提示
    7. window.LoginBox = LoginBox; // 异步登陆组件
    8. window.isLogined = isLogined; // 判断是否登陆 Promise
    9. window.THEME = theme; // 更换主题 Promise 参数为Boolean/String
    10. window.InitProject = () => {} // 初始化页头页脚 Promise
    11. window.fullScreen = fullScreen; // 全屏 参数为要全屏的元素，退出全屏不用传参数
    12. window.moment = moment; // 格式化时间 目前只提供两个方法 moment(date).format('YYYY-MM-DD HH:mm:ss') moment(date).unix() // 获取时间戳 毫秒数

- 项目规划 移动端和前端合并
  - 版本号公用一份，根目录下version.json
  - html模板分开，public/**
    - dev.html,开发
    - index.html,生产pc
    - mobile.html,生产移动端
  - scss公共变量用一份src/assets/scssCommon,全局配置，无需重新引入
  - 公共翻译文件存在src/lang/**
  - 公共接口定义在src/qn/request.js
  
  - 开发模式下 npm run dev
    - 方便开发, 启动项目会启动所有项目，代码之间可以公用，样式可以公用
    - 要求所有人熟悉响应式开发，熟悉移动端项目特点
    - 主入口分开 
      - pc端入口src/page/qn/Index.vue
      - 移动端入口src/page/qn/Mobile.vue
    - 文件隔离
      - 样式文件在 
        - pc端 src/page/qn/scss/index.scss,并在pc端入口引入
        - 移动端 src/page/qn/scss/mobile.scss,并在移动端入口引入
      - 业务代码在 
        - pc端src/page/qn/view/**
        - 移动端src/page/qn/mobileView/** 
        - 可以组件化的代码可以公用，注意写法满足响应式
  
  - 生产环境下
    - 打包命令为 npm run build
      - 此命令下前后端包会生成在dist目录下，包含两个html文件，用来区分前端还是移动端
      - 其他文件公用一份
      - 此模式下为全路由
        - pc路由以 /qn 作为跟路由
        - 移动端以 /mobile-qn 作为跟路由
      - 推荐使用这种，在线上通过nginx配置实现，代码方便维护，版本统一，升级快速，pc移动可以同时升级，打包方便
    - 打包命令 npm run build:pc
      - 只打包pc
      - 只包含一个入口 index.html
      - 忽略移动端路由文件
    - 打包命令 npm run build:mobile
      - 只打包移动端
      - 只包含一个入口 mobil.html
      - 忽略pc端路由文件

- 移动端要求
  - 基础框架均采用绝对定位实现，z-index未指定