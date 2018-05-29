// 日志
import Vue from 'vue'
var log = {
    // 按日期查询已提交列表
    logreportmanagersubmitlist: function logreportmanagersubmitlist(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 按日期查询未提交列表
    logreportmanagerunsubmitlist: function logreportmanagerunsubmitlist(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 查看日志详情
    loglogsearchget: function loglogsearchget(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 查询日志模板列表
    logtemplatequeryAll: function logtemplatequeryAll(ip, postdata) {
        var ipstr = ip + '?orgId=' + postdata.orgId + '&pageNo=' + postdata.pageNo + '&pageSize=' + postdata.pageSize
        return Vue.http.get(ipstr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 查询日志模板明细
    logtemplatequery: function logtemplatequery(ip, postdata) {
        var ipstr = ip + '?id=' + postdata.id + '&memberId=' + postdata.memberId
        return Vue.http.get(ipstr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 发布日志
    loglogadd: function loglogadd(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 日志报表列表
    logreportlist: function logreportlist(ip, postdata) {
        var ipstr = ''
        if (postdata.startDate) {
            ipstr = ip + '?pageNo=' + postdata.pageNo + '&pageSize=' + postdata.pageSize
                + '&submitType=' + postdata.submitType + '&memberId=' + postdata.memberId + '&orgId=' + postdata.orgId
                + '&endDate=' + postdata.endDate + '&startDate=' + postdata.startDate
        } else {
            ipstr = ip + '?pageNo=' + postdata.pageNo + '&pageSize=' + postdata.pageSize
                + '&submitType=' + postdata.submitType + '&memberId=' + postdata.memberId + '&orgId=' + postdata.orgId

        }
        return Vue.http.get(ipstr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 未读全部设为已读
    logsearchchangestatus: function logsearchchangestatus(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 我发送的列表
    logsearchsendpage: function logsearchsendpage(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 我收到的列表
    logsearchreceivepage: function logsearchreceivepage(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 我收到的列表
    logremindsave: function logremindsave(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 获取已保存的提醒详情
    logremindinfo: function logremindinfo(ip, postdata) {
        var ipstr = ip + '?memberId=' + postdata.memberId + '&submitType=' + postdata.submitType
        return Vue.http.get(ipstr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 某条未读日志设置为已读
    logsearchread: function logsearchread(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 查看管理员权限
    signoutisadmin: function signoutisadmin(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 查看管理员权限
    loglogtemplateverifymanager: function loglogtemplateverifymanager(ip, postdata) {
        var ipstr = ip + '?memberId=' + postdata.memberId
        return Vue.http.get(ipstr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 查看管理员权限
    noticenoticeauthority: function noticenoticeauthority(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 查看管理员权限
    infoinfohority: function infoinfohority(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
}
export default log