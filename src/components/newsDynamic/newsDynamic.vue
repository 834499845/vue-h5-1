<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="news">
    <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">
      <div v-show="!pathShow" class="main">
        <div class="titleName">
          <div class="titleNameImg">
            <img :src="newsObj.smallImg | imgFun" alt="">
          </div>
          <div class="titleNameTit">
            <div class="titleNameTitTop">
              {{newsObj.userName | strFun}}
            </div>
            <div class="titleNameTitFot">
              {{newsObj.createDate | UnFormatDates}}
            </div>
          </div>
        </div>
        <div class="content">
          <div class="content-text" v-show="newsObj.content">
            {{newsObj.content}}
          </div>
          <div class="content-video" v-show="newsObj.newsType == 2">
            <video :src="newsObj.picture" controls :poster="newsObj.cover"></video>
          </div>
          <div class="content-img" v-show="newsObj.newsType == 1">
            <ul>
              <li v-for="(item,index) in imgLists" @click="imgClick(index)" :key="index">
                <img :src="item.img" alt="">
              </li>
            </ul>
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
    <div class="showImg" v-show="imgShow">
      <div>
        <div @click="cancelImgClick">
          X
        </div>
        <div>
          <img :src="showImgList" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapActions, mapState } from "vuex";
  import { Toast } from "mint-ui";
  import scroll from "../cModule/fresh";
  export default {
    components: {
      "v-scroll": scroll
    },
    data() {
      return {
        showImgList: '',
        imgShow: false,
        newsObj: {},
        // newscontent: "",
        // newstitle: "",
        // date: "",
        pathShow: false,
        commentsLists: [],
        dataList: [], //上拉更多的数据存放数组
        loadingText: "", //往插件传递的提示文字
        page: 1, //当前页码
        imgLists: []
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
      document.title = "新闻动态分享";
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
                        console.log("获取新闻", data);
                        if (data.code == 200) {
                          self.newsObj = data.data.newsInfo;
                          self.imgLists = [];
                          if (data.data.newsInfo.newsType == 1) {
                            if (data.data.newsInfo.picture.indexOf(",") > -1) {
                              var imgs = data.data.newsInfo.picture.split(",");
                              imgs.forEach(function (ele, ind) {
                                self.imgLists.push({
                                  img: ele
                                });
                              });
                            } else {
                              self.imgLists.push({
                                img: data.data.newsInfo.picture
                              });
                            }
                          }
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
      cancelImgClick() {
        this.imgShow = false
      },
      imgClick(index) {
        this.imgShow = true
        this.showImgList = this.imgLists[index].img
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
            type: 5,
            limit: 100
          })
          .then(data => {
            self.loadingText = "";
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
            self.loadingText = "";
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
              type: 5,
              limit: 100
            })
            .then(data => {
              done();
              self.loadingText = "";
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
                self.loadingText = "";
              }
            })
            .catch(msg => {
              done();
              self.loadingText = "";
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
  .showImg>div:nth-child(1) {
    width: 95%;
    height: 5rem;
    position: relative;
    margin-top: 2rem;
  }

  .showImg>div:nth-child(1)>div:nth-child(1) {
    font-size: 18px;
    position: absolute;
    right: 0;
    top: 0;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 1px solid #fff;
    line-height: 35px;
    text-align: center;
    color: #fff;
  }

  .showImg>div:nth-child(1)>div:nth-child(2) {
    font-size: 18px;
    position: absolute;
    right: 0;
    top: 42px;
    width: 100%;
    min-height: 35px;
    border: 1px solid #fff;
  }

  .showImg>div:nth-child(1)>div:nth-child(2) img {
    width: 100%;
  }

  .showImg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.55);
    display: flex;
    justify-content: center;
  }

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

  .content-text {
    width: 100%;
    font-size: 1.34rem;
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
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bad-video>div {
    width: 100%;
  }

  .videoFa {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 98;
  }

  .content-img {
    width: 100%;
    min-height: 5px;
    margin-top: 0.9rem;
    overflow: hidden;
  }

  .content-img li {
    width: 30.33333%;
    height: 7rem;
    margin-top: 0.5rem;
    margin-left: 0.3rem;
    margin-right: 0.3rem;
  }

  .content-img ul {
    display: flex;
    flex-wrap: wrap;
  }

  .content-img li img {
    width: 100%;
    height: 7rem;
  }

  .content-video {
    width: 100%;
    height: 200px;
    margin-top: 0.9rem;
    overflow: hidden;
  }

  .content-video video {
    max-width: 100%;
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
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bad-video>div {
    width: 100%;
  }

  .videoFa {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 98;
  }

  #domImg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 90;
  }

  #domImg img {
    width: 100%;
    height: 100%;
  }

  video {
    height: 17.58rem;
    width: 100%;
    z-index: 2;
  }

  .vplay {
    position: absolute;
    width: 3.3rem;
    height: 3.3rem;
    z-index: 99;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .vplays {
    position: absolute;
    width: 3.3rem;
    height: 3.3rem;
    z-index: 99;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .vplay img,
  .vplays img {
    width: 100%;
    height: 100%;
  }

  .controlsa {
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    font-size: 1.2rem;
    color: white;
    display: block;
    position: absolute;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.55);
    display: -webkit-flex;
    display: flex;
  }

  .controlsa>* {
    flex: 1;
  }

  .controlsa>*:nth-child(1) {
    flex: 6;
  }

  .progressBarFar {
    position: absolute;
    top: -0.5rem;
    width: 100%;
    height: 1.5rem;
    border-radius: 10px;
  }

  .controlsa>*:nth-child(2) {
    flex: 3;
    text-align: center;
  }

  .controlsa>*:nth-child(3) {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .controlsaImg {
    width: 1.8rem;
    height: 1.8rem;
  }

  .controlsa .progressBar {
    margin: 1.25rem 5%;
    position: relative;
    width: 90%;
    height: 0.5rem;
    background-color: rgba(200, 200, 200, 0.55);
    border-radius: 10px;
  }

  .controlsa .timeBar {
    position: absolute;
    top: 0.5rem;
    left: 0;
    width: 0;
    height: 0.5rem;
    background-color: rgba(231, 88, 65, 0.924);
    border-radius: 10px;
  }

  .timeBalls {
    position: absolute;
    top: 0.2rem;
    left: -0.5rem;
    width: 1rem;
    height: 1rem;
    background-color: rgba(231, 88, 65, 0.924);
    border-radius: 100%;
  }

  .content-video video {
    height: 17.85rem;
    width: 100%;
  }

  .content-video {
    height: 17.85rem;
    width: 100%;
  }

  .content {
    min-height: 5.7rem;
    width: 100%;
    /* border: 1px solid #000; */
    margin: 1.03rem 0;
  }

  .titleName {
    width: 29.25rem;
    height: 3.67rem;
    margin: auto;
    margin-top: 0.1rem;
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
    border: 1px solid #ccc;
    overflow: hidden;
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