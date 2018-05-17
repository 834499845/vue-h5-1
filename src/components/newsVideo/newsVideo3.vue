<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="newsVideo">

        <div v-show="!pathShow" class="newsVideoContent">
            <div class="bad-video">
                <div class="ckplayerVideo">

                </div>
            </div>
            <div class="videoCss">
            </div>
            <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">
                <div class="top">
                    <div class="topName">
                        <div class="topNameImg">
                            <img :src="videoObj.smallImg | imgFun" alt="">
                        </div>
                        <div class="topNameFont">
                            {{videoObj.nickName}}
                        </div>
                    </div>
                    <div class="topTitle">
                        {{videoObj.title}}
                    </div>
                    <div class="topLabel">
                        {{videoObj.labelName}}
                    </div>
                    <div class="topNum">
                        <div>
                            <div>
                                <img src="/static/img/赞.png" alt="">
                            </div>
                            <div>
                                {{videoObj.praiseCount}}
                            </div>
                        </div>
                        <div>
                            <div>
                                <img src="/static/img/踩.png" alt="">
                            </div>
                            <div>
                                {{videoObj.stepCount}}
                            </div>
                        </div>
                        <!-- <div>
                        <div>
                            <img src="/static/img/赏.png" alt="">
                        </div>
                        <div>
                            115
                        </div>
                    </div> -->
                    </div>
                </div>

                <div v-show="!pathShow" class="comments">
                    <div class="commentsTitle">
                        <div>
                            评论
                        </div>
                    </div>
                    <div class="commentsMain">
                        <ul class="oneUl">
                            <li v-show="commentsLists.length > 0" class="oneLi" v-for="item in commentsLists">
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
                                            {{item.content}}
                                        </div>
                                    </div>
                                    <div>
                                        {{item.createDate | UnFormatDates}}
                                    </div>
                                </div>
                                <div class="yComments">
                                    <div>
                                        <ul>
                                            <li class="twoLi" v-show="item.replyInfos.length > 0" v-for="reply in item.replyInfos">
                                                <small>{{reply.fromUserName}}</small> 回复
                                                <small>{{reply.toUserName}}</small> ： {{reply.content}}
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
            </v-scroll>
        </div>
        <!-- <div v-show="pathShow" class="nullShow">
            暂无数据
        </div> -->
        <div v-show="pathShow">

        </div>
    </div>
</template>
<script>
    import { mapActions, mapState } from "vuex";
    import scroll from "../cModule/fresh";
    import { Toast } from "mint-ui";
    export default {
        components: {
            "v-scroll": scroll
        },
        data() {
            return {
                video: "",
                time: "",
                timeOk: "",
                asd: '',


                pathShow: false,
                videoObj: {},
                commentsLists: [],
                dataList: [], //上拉更多的数据存放数组
                loadingText: "加载中……", //往插件传递的提示文字
                page: 1 //当前页码
            };
        },
        filters: {
            // 返回日期格式化
            UnFormatDates(val) {
                if (val == "") {
                    return;
                } else {
                    var y, m, d, h, f, s;
                    var t = new Date(val);
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
            this.loadedmetadata();
            this.timeupdate();
            var self = this;
            document.title = "小视频分享";
            var idStr = self.$route.query.id;
            if (idStr) {
                self.getnewsControlApiVideo({
                    id: self.$route.query.id, //视频id
                    userId: self.$route.query.userId //用户id
                }).then(data => {
                    if (data.code == 200) {
                        if (data.data) {
                            self.videoObj = data.data;


                            var videoObject = {
                                container: ".ckplayerVideo", //“#”代表容器的ID，“.”或“”代表容器的class
                                variable: "player", //该属性必需设置，值等于下面的new chplayer()的对象
                                poster: self.videoObj.cover, //封面图片 http://img.ksbbs.com/asset/Mon_1703/05cacb4e02f9d9e.mp4
                                video: self.videoObj.content //视频地址
                            };
                            var player = new ckplayer(videoObject);



                            self.getcommentsInfopage({
                                current: 1,
                                size: 10,
                                objectId: self.$route.query.id, //视频id
                                type: 4,
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
                        } else {
                            self.pathShow = true;
                        }
                    } else {
                        Toast({
                            message: data.message,
                            className: "toastLoad"
                        });
                        self.pathShow = true;
                    }
                }).catch(msg => {
                    Toast({
                        message: "服务器错误",
                        className: "toastLoad"
                    });
                });
            } else {
                self.pathShow = true;
            }
        },
        // 计算属性
        mounted() {
            this.video = document.getElementsByTagName("video")[0];
            var video = document.getElementsByTagName('video')[0]
            console.log('aaa', video)
            // video.controls = false;
        },
        beforeDestroy: function () { },
        watch: {},
        methods: {
            playClick() {
                console.log(this.video)
                this.video.play();
            },
            pauseClick() {
                this.video.pause();
            },
            loadedmetadata() {
                this.time = Math.round(Number(this.video.duration));
            },
            timeupdate() {
                this.timeOk = Math.round(Number(this.video.currentTime));
            },

            // 下拉刷新
            onRefresh(done) {
                let self = this;
                self.page = 1;
                self.loadingText = "加载中……";
                self.commentsLists = [];
                self
                    .getcommentsInfopage({
                        current: 1,
                        size: 10,
                        objectId: self.$route.query.id, //视频id
                        type: 4,
                        limit: 100
                    })
                    .then(data => {
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
                    self
                        .getcommentsInfopage({
                            current: self.page,
                            size: 10,
                            objectId: self.$route.query.id, //视频id
                            type: 4,
                            limit: 100
                        })
                        .then(data => {
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
                        })
                        .catch(msg => {
                            done();
                            Toast({
                                message: "服务器错误",
                                className: "toastLoad"
                            });
                        });
                }
            },
            ...mapActions(["getnewsControlApiVideo", "getcommentsInfopage"])
        }
    };
</script>
<style scoped>
    .newsVideo {
        width: 31.25rem;
        height: 55.58rem;
        background: rgba(247, 247, 247, 1);
    }

    .videoCss {
        width: 100%;
        height: 17.58rem;
    }

    .newsVideoContent {
        widows: 100%;
        min-height: 38rem;
        overflow-y: hidden;
    }

    .top {
        width: 100%;
        height: 15.83rem;
    }

    .topName {
        width: 100%;
        height: 4.67rem;
        display: flex;
    }

    .topNameImg {
        width: 3rem;
        height: 3rem;
        margin: 0.83rem 1.17rem;
    }

    .topNameImg img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }

    .topNameFont {
        min-width: 4.17rem;
        max-width: 10.17rem;
        height: 1.33rem;
        font-size: 1.33rem;
        font-family: PingFangSC-Regular;
        color: rgba(0, 0, 0, 0.8);
        line-height: 1.33rem;
        margin: 1.67rem 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .topTitle {
        width: 29.25rem;
        height: 3.33rem;
        font-size: 1.33rem;
        font-family: PingFangSC-Regular;
        color: rgba(48, 48, 48, 1);
        line-height: 1.67rem;
        margin: 0.5rem auto 1rem;
    }

    .topLabel {
        width: 29.25rem;
        height: 1rem;
        font-size: 1rem;
        font-family: PingFangSC-Regular;
        color: rgba(153, 153, 153, 1);
        line-height: 1rem;
        margin: 0 auto;
    }

    .topNum {
        /* width: 9.08rem; */
        width: 29.25rem;
        height: 2.67rem;
        margin: 1.67rem auto 1rem;
        display: flex;
        justify-content: space-between;
    }

    .topNum>div {
        width: 14rem;
        height: 2.67rem;
        border-radius: 0.17rem;
        border: 1px solid #d7d7d7;
        color: #555555;
        display: flex;
    }

    .topNum>div>div:nth-child(1) {
        width: 1.4rem;
        height: 1.4rem;
        /* margin: 0.55rem 0 0 2.58rem; */
        margin: 0.55rem 0 0 4.5rem;
    }

    .topNum>div>div:nth-child(1) img {
        width: 100%;
        height: 100%;
    }

    .topNum>div>div:nth-child(2) {
        min-width: 1.75rem;
        height: 1.17rem;
        font-size: 1.17rem;
        font-family: PingFangSC-Regular;
        color: rgba(85, 85, 85, 1);
        line-height: 1.17rem;
        /* margin: 0.75rem 0 0 0.2rem; */
        margin: 0.75rem 0 0 0.5rem;
    }

    .comments {
        width: 100%;
        overflow: hidden;
        min-height: 3rem;
        margin-top: 0.5rem;
        background-color: #fff;
    }

    .commentsTitle {
        height: 3.707rem;
        width: 100%;
        line-height: 3.707rem;
        overflow: hidden;
        border-bottom: 1px solid rgb(226, 221, 221);
    }

    .commentsTitle>div {
        font-size: 1.565rem;
        color: #2d2a2a;
        width: 100%;
        text-align: center;
    }

    .commentsMain .oneUl .oneLi {
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

    .meComments {
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
    }

    .nullLi {
        height: 8rem;
        width: 100%;
        text-align: center;
        line-height: 8rem;
        font-size: 1.3rem;
        color: #ccc;
    }

    .nullShow {
        height: 10rem;
        color: #e6e6e6;
        font-size: 3rem;
        text-align: center;
        line-height: 10rem;
    }

    .bad-video {
        width: 100%;
        height: 17.58rem;
        position: fixed;
        top: 0;
        background-color: black;
        z-index: 1;
        position: relative;
        overflow: hidden;
    }

    .ckplayerVideo {
        width: 100%;
        height: 17.58rem;
    }
</style>