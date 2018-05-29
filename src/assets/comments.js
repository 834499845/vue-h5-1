// 公告
import Vue from 'vue'
var comments = {
    // 评论-新增评论接口
    apicomment: function apicomment(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 评论-获取评论接口
    apicomments: function apicomments(ip, postdata) {
        var ipstr = ip + '?type=' + postdata.type + '&objectId=' + postdata.objectId + '&pageNo=' + postdata.pageNo + '&pageSize=' + postdata.pageSize
        return Vue.http.get(ipstr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 收藏
    apifavouritefavouritesave: function apifavouritefavouritesave(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    //删除收藏
    apifavouritefavouritedelete: function apifavouritefavouritedelete(ip, postdata) {
        return Vue.http.post(ip, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
}
export default comments