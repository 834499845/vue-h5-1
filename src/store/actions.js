/**
 * Created by LangK on 2016/12/20.
 */
import Vue from 'vue'
require("../../API/config")
export default {
    // 勋章分享
    getapiuserMedalgetUserMedal({ }, postdata) {
        return Vue.http.post(global.apiuserMedalgetUserMedalPath, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 大v
    getapiuserPermissionApigetWhetherVDescribe({ }, postdata) {
        var ipstr = global.apiuserPermissionApigetWhetherVDescribePath + '?token=' + postdata.token
        return Vue.http.get(ipstr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 问题详情中问题信息获取
    getapiquestionAnswerquestionDetail({ }, postdata) {
        return Vue.http.post(global.apiquestionAnswerquestionDetailPath, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 问题的单个回答信息详情
    getapiquestionAnsweranswerDetail({ }, postdata) {
        return Vue.http.post(global.apiquestionAnsweranswerDetailPath, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 问题详情中问题回答列表获取
    getapiquestionAnswerquestionDetailAnswers({ }, postdata) {
        return Vue.http.post(global.apiquestionAnswerquestionDetailAnswersPath, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 搜索
    getGusosearchartdoList({ }, postdata) {
        return Vue.http.post(global.gusosearchartdoPath, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 新闻
    getnewsControlApiFindById({ }, postdata) {
        var ipstr = global.newsControlApiFindByIdPath
        return Vue.http.post(ipstr, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 新闻-小视频
    getnewsControlApiVideo({ }, postdata) {
        var ipstr = global.newsControlApiVideoPath
        return Vue.http.post(ipstr, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },

    // 医疗文章分享
    getmedicalarticleSelectById({ }, postdata) {
        return Vue.http.post(global.medicalarticleSelectByIdPath, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 医疗圈子分享
    getmedicaldynamicfindDynamicDetail({ }, postdata) {
        return Vue.http.post(global.medicaldynamicfindDynamicDetailPath, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 评论接口
    getcommentsInfopage({ }, postdata) {
        return Vue.http.post(global.commentsInfopagePath, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 健身周报
    getfinanceCourseControllerselectSportWeekly({ }, postdata) {
        return Vue.http.post(global.financeCourseControllerselectSportWeeklyPath, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 商城分享
    getproductListGetProductList({ }, postdata) {
        var ipstr = global.mallproductListGetProductListPath
        return Vue.http.post(ipstr, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 商城分享
    getproductListGetProductInfo({ }, postdata) {
        var ipstr = global.mallproductListGetProductInfoPath
        return Vue.http.post(ipstr, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 商城分享
    getapiMyCouponsFindCouponPath({ }, postdata) {
        var ipstr = global.mallapiMyCouponsFindCouponPath
        return Vue.http.post(ipstr, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 激励banner
    getpageContextselect({ }, postdata) {
        var ipstr = global.pageContextselectPath
        return Vue.http.post(ipstr, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 体检报告H5
    gethealthReportgetAbnormalReport({ }, postdata) {
        var ipstr = global.healthReportgetAbnormalReportPath
        return Vue.http.post(ipstr, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    }
}
