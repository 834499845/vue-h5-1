<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="news">
        <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">
            <div v-show="!pathShow" class="main">
                <div class="title">
                    {{newsObj.title}}
                </div>
                <div class="titleName">
                    <div class="titleNameImg">
                        <img :src="newsObj.smallImg | imgFun" alt="头像">
                    </div>
                    <div class="titleNameTit">
                        <div class="titleNameTitTop">
                            {{newsObj.userName}}
                        </div>
                        <div class="titleNameTitFot">
                            {{newsObj.createDate | UnFormatDates}}
                        </div>
                    </div>
                </div>
                <!-- <div style="margin-top:5px;">{{date | UnFormatDates}}</div> -->
                <div class="content" v-html="newsObj.content">
                </div>
            </div>
            <div v-show="!pathShow" class="comments">
                <div class="commentsTitle">
                    <div>
                        全部评论
                    </div>
                </div>
                <div class="commentsMain">
                    <ul class="oneUl">
                        <li v-show="commentsLists.length > 0" class="oneLi" :key="item.id" v-for="item in commentsLists">
                            <div class="meComments">
                                <div>
                                    <div>
                                        <img :src="item.userAvatar | imgFun" alt="">
                                        <span> {{item.userName | strFun}}</span>
                                    </div>
                                    <div>
                                        <img src="/static/img/Shape.png" alt="">
                                        <span> {{item.dotPraiseCount}}</span>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        {{item.content | contentFun}}
                                    </div>
                                </div>
                                <div>
                                    {{item.createDate | UnFormatDates}}
                                </div>
                            </div>
                            <div class="yComments">
                                <div>
                                    <ul>
                                        <li class="twoLi" v-show="item.replyInfos.length > 0" :key="reply" v-for="reply in item.replyInfos">
                                            <small>{{reply.fromUserName}}</small> 回复
                                            <small>{{reply.toUserName}}</small> ： {{reply.content | contentFun}}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li class="nullLi" v-show="commentsLists.length == 0">
                            暂无评论
                        </li>
                    </ul>
                </div>
            </div>
            <div v-show="pathShow" class="nullShow">
                暂无数据
            </div>
        </v-scroll>
    </div>
</template>
<script>
    import { mapActions, mapState } from "vuex";
    import { Toast } from "mint-ui";
    import scroll from '../cModule/fresh';
    export default {
        components: {
            'v-scroll': scroll
        },
        data() {
            return {
                newsObj: {},
                // newscontent: "",
                // newstitle: "",
                // date: "",
                pathShow: false,
                commentsLists: [],
                dataList: [],//上拉更多的数据存放数组
                loadingText: "加载中……", //往插件传递的提示文字
                page: 1, //当前页码
            };
        },
        filters: {
            // 返回日期格式化
            UnFormatDates(date) {
                if (date == "") {
                    return;
                } else {
                    var y, m, d, h, f, s;
                    var t = new Date(date);
                    y = t.getFullYear();
                    m = t.getMonth() + 1;
                    d = t.getDate();
                    h = t.getHours();
                    f = t.getMinutes();
                    return (
                        y +
                        "." +
                        (m < 10 ? "0" + m : m) +
                        "." +
                        (d < 10 ? "0" + d : d) +
                        "  " +
                        (h < 10 ? "0" + h : h) +
                        ":" +
                        (f < 10 ? "0" + f : f)
                    );
                }
            },
            numFun(val) {
                if (val == 0) {
                    return val;
                } else {
                    if (val) {
                        return val;
                    } else {
                        return 0;
                    }
                }
            },
            contentFun(val) {
                return val;
            },
            imgFun(val) {
                if (val) {
                    return val;
                } else {
                    return "/static/img/ren.png";
                }
            },
            strFun(val) {
                if (val) {
                    return val;
                } else {
                    return "无";
                }
            }
        },
        created: function () {
            var self = this;
            document.title = "新闻分享";
            var urlStr = location.href;
            if (urlStr.indexOf("?")) {
                if (urlStr.indexOf("?") != -1) {
                    if (urlStr.indexOf("=")) {
                        if (urlStr.indexOf("=") != -1) {
                            if (urlStr.indexOf("id")) {
                                if (urlStr.indexOf("id") != -1) {
                                    var idStr = self.$route.query.id;
                                    if (idStr) {
                                        self
                                            .getnewsControlApiFindById({
                                                newsId: idStr,
                                                userId: self.$route.query.userId
                                            })
                                            .then(data => {
                                                console.log("获取新闻列表", data);
                                                if (data.code == 200) {
                                                    self.newsObj = data.data.newsInfo;
                                                    document.title = data.data.newsInfo.title;
                                                    // self.newstitle = data.data.newsInfo.title;
                                                    // self.date = data.data.newsInfo.createDate;
                                                    // self.newscontent = data.data.newsInfo.content;
                                                } else {
                                                    Toast({
                                                        message: data.message,
                                                        className: "toastLoad"
                                                    });
                                                }
                                            })
                                            .catch(msg => {
                                                // console.log(msg)
                                                Toast({
                                                    message: "服务器错误",
                                                    className: "toastLoad"
                                                });
                                            });
                                        self
                                            .getcommentsInfopage({
                                                current: 1,
                                                size: 10,
                                                objectId: idStr,
                                                type: 5,
                                                limit: 100
                                            })
                                            .then(data => {
                                                console.log("评论", data);
                                                if (data.code == 200) {
                                                    if (data.data.records.length > 0) {
                                                        self.commentsLists = data.data.records;
                                                    }
                                                } else {
                                                    Toast({
                                                        message: data.message,
                                                        className: "toastLoad"
                                                    });
                                                }
                                            })
                                            .catch(msg => {
                                                //   console.log(msg);
                                                Toast({
                                                    message: "服务器错误",
                                                    className: "toastLoad"
                                                });
                                            });
                                    } else {
                                        // console.log('网址错误')
                                        self.pathShow = true;
                                    }
                                } else {
                                    // console.log('网址错误')
                                    self.pathShow = true;
                                }
                            } else {
                                // console.log('网址错误')
                                self.pathShow = true;
                            }
                        } else {
                            // console.log('网址错误')
                            self.pathShow = true;
                        }
                    } else {
                        // console.log('网址错误')
                        self.pathShow = true;
                    }
                } else {
                    // console.log('网址错误')
                    self.pathShow = true;
                }
            } else {
                // console.log('网址错误')
                self.pathShow = true;
            }
        },
        beforeDestroy: function () { },
        watch: {},
        methods: {
            // 下拉刷新
            onRefresh(done) {
                let self = this;
                self.page = 1;
                self.loadingText = "加载中……";
                self.commentsLists = []
                self.getcommentsInfopage({
                    current: 1,
                    size: 10,
                    objectId: self.$route.query.id, //视频id
                    type: 5,
                    limit: 100
                }).then(data => {
                    if (data.code == 200) {
                        if (data.data.records.length > 0) {
                            self.commentsLists = data.data.records;
                        }
                    } else {
                        Toast({
                            message: data.message,
                            className: "toastLoad"
                        });
                    }
                }).catch(msg => {
                    Toast({
                        message: "服务器错误",
                        className: "toastLoad"
                    });
                });
                done();
            },
            // 上拉加载
            onInfinite(done) {
                let self = this;
                if (self.loadingText == "") {
                    self.loadingText = "";
                    done();
                } else {
                    self.page++;
                    self.loadingText = "加载中……";
                    self.getcommentsInfopage({
                        current: self.page,
                        size: 10,
                        objectId: self.$route.query.id, //视频id
                        type: 5,
                        limit: 100
                    }).then(data => {
                        done();
                        if (data.code == 200) {
                            if (data.data.records.length > 0) {
                                self.dataList = data.data.records;
                                self.commentsLists = self.commentsLists.concat(self.dataList);
                            } else {
                                self.loadingText = "";
                            }
                        } else {
                            Toast({
                                message: data.message,
                                className: "toastLoad"
                            });
                        }
                    }).catch(msg => {
                        done();
                        Toast({
                            message: "服务器错误",
                            className: "toastLoad"
                        });
                    });
                }
            },
            ...mapActions(["getnewsControlApiFindById", "getcommentsInfopage"])
        }
    };
</script>
<style scoped>
    .nullLi {
        height: 8rem;
        width: 100%;
        text-align: center;
        line-height: 8rem;
        font-size: 1.3rem;
        color: #ccc;
    }

    .yComments ul li small {
        color: #f09569;
        font-size: 1.19rem;
    }

    .yComments li:nth-child(1) {
        padding-top: 0.5rem;
    }

    .yComments li:nth-last-of-type(1) {
        padding-bottom: 0.5rem;
    }

    .yComments li {
        min-height: 1.365rem;
        width: 100%;
        font-size: 1.19rem;
        padding: 0.2rem 1rem;
        color: #333;
        text-align: justify;
        text-justify: inter-ideograph;
    }

    .yComments {
        overflow: hidden;
        margin-top: 0.7rem;
    }

    .yComments>div:nth-child(1) {
        background-color: #fff9ef;
        width: calc(100% - 5.12rem);
        margin-left: 4.393rem;
        height: 100%;
        /* min-height: 1rem; */
    }

    .meComments {
        /* min-height: 8.533rem; */
        /* border: 1px solid red; */
        overflow: hidden;
    }

    .meComments>div:nth-child(3) {
        margin-top: 0.7rem;
        width: 100%;
        height: 1.139rem;
        overflow: hidden;
        font-size: 0.89rem;
        line-height: 1.139rem;
        color: #9c9d9d;
        padding-left: 4.396rem;
    }

    .meComments>div:nth-child(2)>div {
        font-size: 1.28rem;
        color: #000;
        width: calc(100% - 5.12rem);
        margin-left: 4.393rem;
        /* overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; */
        text-align: justify;
        text-justify: inter-ideograph;
    }

    .meComments>div:nth-child(2) {
        margin-top: 0.3rem;
        width: 100%;
        min-height: 1.772rem;
        overflow: hidden;
    }

    .meComments>div:nth-child(1)>div:nth-child(2) span {
        font-size: 1.024rem;
        color: #9c9d9d;
        margin-right: 0.9rem;
        margin-left: 0.3rem;
    }

    .meComments>div:nth-child(1)>div:nth-child(2) img {
        width: 0.911em;
        height: 1.021rem;
    }

    .meComments>div:nth-child(1)>div:nth-child(1) span {
        font-size: 1.24rem;
        color: #000;
        margin-right: 0.9rem;
        margin-left: 0.5rem;
    }

    .meComments>div:nth-child(1)>div:nth-child(1) img {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        overflow: hidden;
        margin-left: 0.7rem;
        border: 1px solid rgba(255, 200, 200, 0.3);
    }

    .meComments>div:nth-child(1) div {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .meComments>div:nth-child(1) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 3.172rem;
        overflow: hidden;
    }

    .commentsMain .oneUl .oneLi {
        /* min-height: 8.533rem; */
        width: 100%;
        overflow: hidden;
        margin-top: 0.9rem;
        margin-bottom: 1.9rem;
    }

    .commentsMain ul {
        display: flex;
        flex-wrap: wrap;
    }

    .commentsMain {
        min-height: 5rem;
        margin-top: 1rem;
        margin-left: 1.024rem;
        width: 94%;
    }

    .commentsTitle {
        height: 3.707rem;
        width: 100%;
        line-height: 3.707rem;
        overflow: hidden;
        border-bottom: 1px solid rgb(226, 221, 221);
        /* border: 1px solid red; */
    }

    .main {
        padding: 1.07rem;
        overflow: hidden;
        background-color: #fff;
    }

    .commentsTitle>div {
        font-size: 1.365rem;
        color: #2d2a2a;
        width: 100%;
        padding-left: 1rem;
    }

    .comments {
        overflow: hidden;
        min-height: 3rem;
        background-color: #fff;
    }

    .nullShow {
        height: 10rem;
        color: #e6e6e6;
        font-size: 3rem;
        text-align: center;
        line-height: 10rem;
    }

    .news {
        background-color: #fff;
        overflow-x: hidden;
        min-height: 100vh;
        /* padding: 1.07rem; */
    }

    .title {
        width: 27.92rem;
        font-size: 1.83rem;
        font-family: PingFangSC-Medium;
        color: rgba(48, 48, 48, 1);
        line-height: 2.5rem;
    }

    .content {
        min-height: 35.7rem;
        width: 100%;
        /*border:1px solid #000;*/
        margin: 1.43rem 0;
        /*overflow-x: auto;*/
    }

    .content p {
        font-size: 20px !important;
    }

    .titleName {
        width: 29.25rem;
        height: 3.67rem;
        margin: auto;
        margin-top: 1.5rem;
        display: flex;
    }

    .titleNameImg {
        width: 3.67rem;
        height: 3.67rem;
    }

    .titleNameImg img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }

    .titleNameTit {
        height: 3.67rem;
        margin-left: 1.17rem;
    }

    .titleNameTitTop {
        margin-top: 0.42rem;
        height: 1.33rem;
        font-size: 1.33rem;
        color: rgba(48, 48, 48, 1);
        line-height: 1.33rem;
    }

    .titleNameTitFot {
        margin: 0.5rem 0 0.42rem;
        height: 1rem;
        font-size: 1rem;
        font-family: PingFangSC-Regular;
        color: rgba(153, 153, 153, 1);
        line-height: 1rem;
    }
</style>