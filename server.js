var path = require('path');
var express = require('express');
var proxyMiddleware = require('http-proxy-middleware')

require('./API/config.js')
var app = express()
app.use(express.static(path.join(__dirname, '/dist/')))
var proxyTable = {
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
}
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = {
            target: options
        }
    }
    app.use(proxyMiddleware(context, options))
})

app.listen(7001, function (err) {
    if (err) {
        console.log(err);
        return
    }
    console.log('server start -- 7001')
})
