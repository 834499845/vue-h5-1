// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
require("../API/config.js");
module.exports = {
    // production 环境
    build: {
        // 使用 prod.env 中定义的编译环境
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        // 编译输出的静态资源根路径
        assetsRoot: path.resolve(__dirname, '../dist'),
        // 编译输出的二级目录
        assetsSubDirectory: 'static',
        // 编译发布上线路径的根目录，可配置为资源服务器域名或CDN域名
        assetsPublicPath: '/',
        // 是否开启 gzip
        productionGzip: false,
        // 需要使用 gsip 压缩的文件扩展名
        productionGzipExtensions: ['js', 'css'],
    },
    // dev环境
    dev: {
        // 使用 dev.env 中定义的编译环境
        env: require('./dev.env'),
        // 进行测试页面的端口
        port: 7001,
        // 编译 输出的二级目录
        assetsSubDirectory: 'static',
        // 编译发布线上的根目录 可以自定义
        assetsPublicPath: '/',
        proxyTable: {
            '/guso/search': {
                target: "http://" + global.guJieIp + ":" + global.guJiePort,
                changeOrigin: true
            },
            '/V2.0.0/api/static/newsApi': {
                target: global.httpStr + global.newsIp + "/" + global.newsPort,
                changeOrigin: true
            },
            '/V2.0.0/api/static/video': {
                target: global.httpStr + global.newsIp + "/" + global.newsPort,
                changeOrigin: true
            },
            '/V1.0.0/product': {
                target: global.httpStr + global.mallIp + "/" + global.mallPort,
                changeOrigin: true
            },
            '/V1.0.0/api/MyCoupons': {
                target: global.httpStr + global.mallIp + "/" + global.mallPort,
                changeOrigin: true
            },
            '/V1.0.0/pageContext': {
                target: global.httpStr + global.encourafeIp + "/" + global.encourafePort,
                changeOrigin: true
            },
            '/V1.0.0/CourseController': {
                target: global.httpStr + global.financeIp + "/" + global.financePort,
                changeOrigin: true
            },
            '/V1.0.0/static/dynamic': {
                target: global.httpStr + global.medicalIp + "/" + global.medicalPort,
                changeOrigin: true
            },
            '/V1.1.0/static/commentsInfo': {
                target: global.httpStr + global.commentsIp + "/" + global.commentsPort,
                changeOrigin: true
            },
            '/V1.0.0/static/article': {
                target: global.httpStr + global.medicalIp + "/" + global.medicalPort,
                changeOrigin: true
            },
            '/V2.0.0/static/healthReport': {
                target: global.httpStr + global.healthReportIp + "/" + global.healthReportPort,
                changeOrigin: true
            },
            '/V2.0.0/api/static/questionAnswer': {
                target: global.httpStr + global.questionAnswerIp + "/" + global.questionAnswerPort,
                changeOrigin: true
            },
            '/V2.0.0/static/userMedal': {
                target: global.httpStr + global.userMedalIp + "/" + global.userMedalPort,
                changeOrigin: true
            },
            '/V2.0.0/api/userPermissionApi': {
                target: global.httpStr + global.newsIp + "/" + global.newsPort,
                changeOrigin: true
            }
        },
        // 是否开启 cssSourceMap
        cssSourceMap: false
    }
}
