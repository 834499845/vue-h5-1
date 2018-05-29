// 签到
import Vue from 'vue'
var notice = {
    // 日常签到
    // 日常签到-查看部门签到设置
    SignApiSignGetSetting: function SignApiSignGetSetting(ip, postdata) {
        var ipstr = ip + '?orgId=' + postdata.orgId
        return Vue.http.get(ipstr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 日常签到-按月查询我的签到列表
    SignApiSignQueryMonthInfo: function SignApiSignQueryMonthInfo(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 日常签到-查询当日签到次数
    SignApiSignGetSignInfo: function SignApiSignGetSignInfo(ip, postdata) {
        var ipstr = ip + '?userId=' + postdata.userId + '&orgId=' + postdata.orgId
        return Vue.http.get(ipstr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 日常签到-日常签到设置
    SignApiSignSetting: function SignApiSignSetting(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 日常签到-日常统计接口
    SignApiSignSignCount: function SignApiSignSignCount(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 日常签到-日常签到接口
    SignApiSignToSign: function SignApiSignToSign(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },

    // 签到-外出签到
    // 外出签到-查看部门签到设置
    SignApiSignOutGetSetting: function SignApiSignOutGetSetting(ip, postdata) {
        var ipstr = ip + '?orgId=' + postdata.orgId
        return Vue.http.get(ipstr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 外出签到-按月查询我的签到列表
    SignApiSignDetailOutQueryMonthInfo: function SignApiSignDetailOutQueryMonthInfo(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 外出签到-查询当日签到次数
    SignApiSignDetailOutGetSignInfo: function SignApiSignDetailOutGetSignInfo(ip, postdata) {
        var ipstr = ip + '?userId=' + postdata.userId + '&orgId=' + postdata.orgId
        return Vue.http.get(ipstr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 外出签到-外出签到接口
    SignApiSignDetailOutToSign: function SignApiSignDetailOutToSign(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 外出签到-外出签到统计
    SignApiSignDetailOutSignCount: function SignApiSignDetailOutSignCount(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 外出签到-外出签到设置
    SignApiSignOutSetting: function SignApiSignOutSetting(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // DANG
    dangSend: function dangSend(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
}
export default notice