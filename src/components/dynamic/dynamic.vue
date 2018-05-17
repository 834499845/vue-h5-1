<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="home">
        <div v-show="!pathShow" class="main">
            <div class="title">
                <div class="titleLeft">
                    <img :src="mesObj.smallImg | imgFun" alt="">
                    <span>{{mesObj.userCircleNickName | strFun}}</span>
                </div>
                <div class="titleRight">
                    {{mesObj.createDate | UnFormatDates}}
                </div>
            </div>
            <div class="content">
                <div class="contentText">
                    {{mesObj.content | strFun}}
                </div>
                <div class="contentImg">
                    <ul>
                        <li v-show="imgs.length > 0" :key="index" v-for="(item,index) in imgs">
                            <div>
                                <img :src="item" alt="">
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="message">
                <div>
                    <img v-show="mesObj.position" src="/static/img/地址.png" alt="">
                    <span> {{mesObj.position | strFun}}</span>
                </div>
                <div>
                    <img src="/static/img/Shape.png" alt="">
                    <span> {{mesObj.upvoteNum | numFun}}</span>
                    <img src="/static/img/消息-3.png" alt="">
                    <span> {{mesObj.commentNum | numFun}}</span>
                    <img src="/static/img/分享-3点击@2x.png" alt="">
                    <span> {{mesObj.shareNum | numFun}}</span>
                </div>
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
                    <li v-show="commentsLists.length > 0" class="oneLi" :key="item" v-for="item in commentsLists">
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
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      newscontent: "",
      newstitle: "",
      date: "",
      pathShow: false,
      image: "",
      mesObj: {
        id: "", //动态id
        userId: "", //发布人id
        smallImg: "", //发布人头像
        userCircleNickName: "", //发布人圈内昵称
        createDate: 0, //动态发布时间
        content: "", //动态内容
        pictures: "", //动态中的图片集合
        position: "", //位置
        upvoteNum: 0, //点赞数
        commentNum: 0, //评论数
        shareNum: 0 //分享数
      },
      imgs: [],
      commentsLists: []
    };
  },
  computed: mapState([""]),
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
          "-" +
          (m < 10 ? "0" + m : m) +
          "-" +
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
      if (val) {
        if (val.length > 30) {
          val = val.substring(0, 30);
          val = val + "...";
          return val;
        } else {
          return val;
        }
      } else {
        return "无";
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
  created: function() {
    var self = this;
    document.title = "圈子分享";
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
                    .getmedicaldynamicfindDynamicDetail({
                      id: idStr
                    })
                    .then(data => {
                      // console.log("医疗圈子", data);
                      if (data.code == 200) {
                        self.mesObj = data.data;
                        var imgStr = "";
                        if (data.data.pictures) {
                          imgStr = data.data.pictures;
                          if (imgStr.indexOf(",") > -1) {
                            self.imgs = data.data.pictures.split(",");
                          } else {
                            self.imgs.push(data.data.pictures);
                          }
                        }
                      } else {
                        Toast({
                          message: data.message,
                          className: "toastLoad"
                        });
                      }
                    })
                    .catch(msg => {
                      console.log(msg);
                      Toast({
                        message: "服务器错误",
                        className: "toastLoad"
                      });
                    });
                  self
                    .getcommentsInfopage({
                      current: 1,
                      size: 200,
                      objectId: idStr,
                      type: 3,
                      limit: 100
                    })
                    .then(data => {
                      console.log("医疗圈子评论", data);
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
                      console.log(msg);
                      Toast({
                        message: "服务器错误",
                        className: "toastLoad"
                      });
                    });
                } else {
                  console.log("网址错误");
                  self.pathShow = true;
                }
              } else {
                console.log("网址错误");
                self.pathShow = true;
              }
            } else {
              console.log("网址错误");
              self.pathShow = true;
            }
          } else {
            console.log("网址错误");
            self.pathShow = true;
          }
        } else {
          console.log("网址错误");
          self.pathShow = true;
        }
      } else {
        console.log("网址错误");
        self.pathShow = true;
      }
    } else {
      console.log("网址错误");
      self.pathShow = true;
    }
  },
  beforeDestroy: function() {},
  watch: {},
  methods: {
    ...mapActions(["getmedicaldynamicfindDynamicDetail", "getcommentsInfopage"])
  }
};
</script>
<style scoped>
.nullLi {
  border-top: 1px solid #ccc;
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
}

.yComments {
  overflow: hidden;
  margin-top: 0.7rem;
}

.yComments > div:nth-child(1) {
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

.meComments > div:nth-child(3) {
  margin-top: 0.7rem;
  width: 100%;
  height: 1.139rem;
  overflow: hidden;
  font-size: 0.89rem;
  line-height: 1.139rem;
  color: #9c9d9d;
  padding-left: 4.396rem;
}

.meComments > div:nth-child(2) > div {
  font-size: 1.28rem;
  color: #000;
  width: calc(100% - 5.12rem);
  margin-left: 4.393rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.meComments > div:nth-child(2) {
  margin-top: 0.3rem;
  width: 100%;
  height: 1.772rem;
  overflow: hidden;
}

.meComments > div:nth-child(1) > div:nth-child(2) span {
  font-size: 1.024rem;
  color: #9c9d9d;
  margin-right: 0.9rem;
  margin-left: 0.3rem;
}

.meComments > div:nth-child(1) > div:nth-child(2) img {
  width: 0.911em;
  height: 1.021rem;
}

.meComments > div:nth-child(1) > div:nth-child(1) span {
  font-size: 1.24rem;
  color: #000;
  margin-right: 0.9rem;
  margin-left: 0.5rem;
}

.meComments > div:nth-child(1) > div:nth-child(1) img {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 0.7rem;
  border: 1px solid rgba(255, 200, 200, 0.3);
}

.meComments > div:nth-child(1) div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.meComments > div:nth-child(1) {
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
  height: 1.707rem;
  width: 100%;
  margin-top: 1rem;
  margin-left: 1.024rem;
  overflow: hidden;
  position: relative;
}

.commentsTitle > div {
  font-size: 1.365rem;
  color: #2d2a2a;
  margin-left: 0.5rem;
}

.commentsTitle::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 1.707rem;
  background-color: #ef7726;
}

.comments {
  overflow: hidden;
  min-height: 3rem;
  margin-top: 1rem;
}

.contentText {
  width: 95%;
  margin-left: 1.024rem;
  font-size: 1.28rem;
  color: #2d2a2a;
  text-align: justify;
  text-justify: inter-ideograph;
}

.contentImg {
  width: 95%;
  margin-top: 0.7rem;
}

.contentImg ul {
  display: flex;
  flex-wrap: wrap;
  margin-left: 1.024rem;
}

.contentImg ul li {
  width: 31.333333333%;
  height: 6.827rem;
  margin-right: 0.2027rem;
  margin-left: 0.2027rem;
  border: 1px solid #9d9c9c;
  overflow: hidden;
  margin-top: 0.3rem;
  margin-bottom: 0.2rem;
}

.contentImg ul li img {
  width: 100%;
  height: 100%;
}

.content {
  min-height: 2rem;
  width: 100%;
  margin-top: 0.5rem;
}

.message {
  margin-top: 1.109rem;
  height: 2.133rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.message > div:nth-child(1) {
  display: flex;
  align-items: center;
  margin-left: 1rem;
  overflow: hidden;
}

.message > div:nth-child(2) {
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.message span {
  font-size: 0.939rem;
  color: #9d9c9c;
}

.message > div:nth-child(2) img:nth-child(1) {
  width: 0.951em;
  height: 1.051rem;
  margin-left: 0.5rem;
  margin-right: 0.3rem;
}

.message > div:nth-child(2) img:nth-child(3) {
  width: 0.891em;
  height: 1.091rem;
  margin-left: 0.5rem;
  margin-right: 0.3rem;
}

.message > div:nth-child(2) img:nth-child(5) {
  width: 0.851em;
  height: 1.051rem;
  margin-left: 0.5rem;
  margin-right: 0.3rem;
}

.message > div:nth-child(1) img {
  width: 0.751em;
  height: 1.151rem;
  margin-left: 0.5rem;
  margin-right: 0.3rem;
}

.title {
  color: #2d2a2a;
  display: flex;
  height: 4.267rem;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.365rem;
}

.titleLeft {
  display: flex;
  align-items: center;
}

.titleLeft img {
  border: 1px solid rgba(255, 200, 200, 0.3);
  margin-left: 1.024rem;
  width: 3.072rem;
  height: 3.072rem;
  border-radius: 50%;
}

.titleLeft span {
  font-size: 1.28rem;
  margin-left: 0.7rem;
  color: #2d2a2a;
}

.titleRight {
  font-size: 0.939rem;
  color: #9d9c9c;
  margin-right: 0.7rem;
}

.nullShow {
  height: 10rem;
  color: #e6e6e6;
  font-size: 3rem;
  text-align: center;
  line-height: 10rem;
}

.main {
  min-height: 5rem;
}

.home {
  background-color: #fff;
  overflow-x: hidden;
  height: 100vh;
  /*border: 1px solid red;*/
}
</style>