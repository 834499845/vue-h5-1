// 工单
import Vue from 'vue'
var info = {
    // 新增反馈问题
    feedBacksave: function feedBacksave(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 列表
    feedBackList: function feedBackList(ip, postdata) {
        var ipStr = ip + "?userId=" + postdata.userId
        return Vue.http.get(ipStr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 详情
    feedBackDetails: function feedBackDetails(ip, postdata) {
        var ipStr = ip + "?feedbackId=" + postdata.feedbackId
        return Vue.http.get(ipStr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 用户反馈的回复
    feedBackreply: function feedBackreply(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 用户反馈接口
    feedBackresult: function feedBackresult(ip, postdata) {
        var ipStr = ip + "/" + postdata.success + "?feedId=" + postdata.feedId
        return Vue.http.get(ipStr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 评论列表
    feedBackreplyList: function feedBackreplyList(ip, postdata) {
        var ipStr = ip + "?feedId=" + postdata.feedId
        return Vue.http.get(ipStr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },


}
export default info