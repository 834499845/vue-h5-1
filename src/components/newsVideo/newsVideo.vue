<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="newsVideo">
        <div v-show="!pathShow" class="newsVideoContent">
            <div class="bad-video" id="fullId">
                <div v-if="isIOS">
                    <video :src="videoObj.content" controls="controls"></video>
                </div>
                <div v-show="!isIOS">
                    <video id="dom" :src="videoObj.content" @loadedmetadata="loadedmetadata" @timeupdate="timeupdate">
                    </video>
                    <div v-show="isvideoImg" id="domImg">
                        <img :src="videoObj.cover" alt="">
                    </div>
                    <div v-show="!isvideoImg" @click="controlsShow" class="videoFa"></div>
                    <div v-show="opClick" @click="playClick" class="vplay">
                        <img src="/static/img/begin.png" alt="">
                    </div>
                    <div v-show="!opClick && isControls" @click="pauseClick" class="vplays">
                        <img src="/static/img/stop.png" alt="">
                    </div>
                    <div v-show="!isvideoImg" class="controlsa" id="controIndex">
                        <div>
                         <div class="progressBar" >
                            <div class="progressBarFar" id="timeLength" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
                                    <div id="timeBall" class="timeBalls"></div>
                                    <div id="timeLengthSon" class="timeBar"></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span class="current">{{timeOk | timeFun}}</span>/
                            <span class="duration">{{time | timeFun}}</span>
                        </div>
                        <div>
                            <img class="controlsaImg" src="/static/img/full.png" v-if="isFull" @click="fullClick">
                            <img class="controlsaImg" src="/static/img/shrink.png" v-else @click="shrinkClick">
                        </div>
                    </div>
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
                        {{videoObj.labelName}} / {{videoObj.broadcastCount}}次播放次数
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
                            <li v-show="commentsLists.length > 0" class="oneLi" :key="index" v-for="(item,index) in commentsLists">
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
                                            <li class="twoLi" v-show="item.replyInfos.length > 0" :key="replyIndex" v-for="(reply,replyIndex) in item.replyInfos">
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
        <div v-show="pathShow" class="nullShow">
            暂无数据
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
      timeBall: "", //视频拖动
      timeLengthSon: "", //视频当前进度条
      timeLength: "", //视频总进度条
      isvideoImg: true,
      isControls: false, //视频按钮
      opClick: true, //开始按钮
      video: "", //视频
      time: "", //视频总时长
      timeOk: "", //视频当前播放时长
      isIOS: false, //是否ios
      pathShow: false,
      videoObj: {},
      commentsLists: [],
      dataList: [], //上拉更多的数据存放数组
      loadingText: "加载中……", //往插件传递的提示文字
      page: 1, //当前页码
      isFull: true,
      startNum: "", //按下时鼠标位置
      moveNum: "", //滑动时鼠标位置
      endNum: "" //离开时鼠标位置
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
    },
    timeFun(val) {
      if (val) {
        var a = parseInt(val / 60);
        var b = val % 60;
        var c = a > 10 ? a : "0" + a;
        var d = b > 10 ? b : "0" + b;
        return c + ":" + d;
      } else {
        return "00:00";
      }
    }
  },
  created: function() {
    this.judgevesionFun();
    var self = this;
    document.title = "小视频分享";
    var idStr = self.$route.query.id;
    if (idStr) {
      self
        .getnewsControlApiVideo({
          id: self.$route.query.id, //视频id
          userId: self.$route.query.userId //用户id
        })
        .then(data => {
          if (data.code == 200) {
            if (data.data) {
              self.videoObj = data.data;
              this.loadedmetadata(); //获取视频总时长
              this.timeupdate(); //获取视频当前播放时长/同样也可赋值
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
        })
        .catch(msg => {
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
    this.video = document.getElementById("dom");
    this.timeLengthSon = document.getElementById("timeLengthSon");
    this.timeBall = document.getElementById("timeBall");
    this.timeLength = document.getElementById("timeLength");
  },
  beforeDestroy: function() {},
  watch: {},
  methods: {
    //   判断手机浏览器版本
    judgevesionFun() {
      var self = this;
      var browser = {
        versions: (function() {
          var u = navigator.userAgent,
            app = navigator.appVersion;
          return {
            //移动终端浏览器版本信息
            trident: u.indexOf("Trident") > -1, //IE内核
            presto: u.indexOf("Presto") > -1, //opera内核
            webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
            gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
            mobile:
              !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
            iPhone: u.indexOf("iPhone") > -1 || u.indexOf("Mac") > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf("iPad") > -1, //是否iPad
            webApp: u.indexOf("Safari") == -1 //是否web应该程序，没有头部与底部
          };
        })(),
        language: (
          navigator.browserLanguage || navigator.language
        ).toLowerCase()
      };
      if (
        browser.versions.ios ||
        browser.versions.iPhone ||
        browser.versions.iPad
      ) {
        self.isIOS = true;
      } else if (browser.versions.android) {
        self.isIOS = false;
      }
    },
    //开始
    playClick() {
      this.video.play();
      this.isControls = false;
      document.getElementById("controIndex").style.zIndex = "-1";
      document.getElementById("controIndex").style.opacity = "0";
      this.isvideoImg = false;
    },
    //暂停
    pauseClick() {
      this.video.pause();
      this.isControls = false;
      document.getElementById("controIndex").style.zIndex = "-1";
      document.getElementById("controIndex").style.opacity = "0";
    },
    //获取视频总时长
    loadedmetadata() {
      this.time = Math.round(Number(this.video.duration));
    },
    //获取视频当前播放时长/同样也可赋值
    timeupdate() {
      var self = this;
      this.opClick = this.video.paused;
      this.timeOk = Math.round(Number(this.video.currentTime));
      this.timeLengthSon.style.width =
        Number(this.timeOk / this.time * this.timeLength.offsetWidth) + "px";
      this.timeBall.style.left =
        Number(this.timeOk / this.time * this.timeLength.offsetWidth) -
        12 +
        "px";
    },
    //全屏
    fullClick() {
      var itemHeight = document.documentElement.clientHeight; //获取手机高度
      var itemWidth = document.documentElement.clientWidth; //手机宽度
      var fullDiv = document.getElementById("fullId");
      fullDiv.style.width = itemWidth + "px";
      fullDiv.style.height = itemHeight + "px";
      this.video.style.height = itemHeight * 0.95 + "px";
      this.isFull = false;
      this.isControls = false;
      document.getElementById("controIndex").style.zIndex = "-1";
      document.getElementById("controIndex").style.opacity = "0";
    },
    //缩小
    shrinkClick() {
      var fullDiv = document.getElementById("fullId");
      fullDiv.style.width = "100%";
      fullDiv.style.height = "17.58rem";
      this.video.style.height = "17.58rem";
      this.isFull = true;
      this.isControls = false;
      document.getElementById("controIndex").style.zIndex = "-1";
      document.getElementById("controIndex").style.opacity = "0";
    },
    //视频点击呼出按钮
    controlsShow() {
      this.isControls = !this.isControls;
      if (this.isControls) {
        document.getElementById("controIndex").style.zIndex = "100";
        document.getElementById("controIndex").style.opacity = "1";
      } else {
        document.getElementById("controIndex").style.zIndex = "-1";
        document.getElementById("controIndex").style.opacity = "0";
      }
    },
    //触摸（刚开始按下）
    touchstart(event) {
      console.log("aaaaaaaa");
      this.startNum = event.changedTouches[0].clientX;
      var timeLengthLeft = document
        .getElementById("timeLength")
        .getBoundingClientRect().left;
      var distance = this.startNum - timeLengthLeft;
      this.timeLengthSon.style.width = distance + "px";
      this.timeBall.style.left = distance - 12 + "px";
      this.video.currentTime = Math.round(
        Number(
          this.timeLengthSon.offsetWidth /
            this.timeLength.offsetWidth *
            this.time
        )
      );
    },
    //触摸（在屏幕上滑动）
    touchmove(event) {
      this.moveNum = event.changedTouches[0].clientX;
      var timeLengthLeft = document
        .getElementById("timeLength")
        .getBoundingClientRect().left;
      var distance = this.moveNum - timeLengthLeft;
      if (distance > 0) {
        if (distance > this.timeLength.offsetWidth) {
          distance = this.timeLength.offsetWidth;
        }
      } else {
        distance = 0;
      }
      this.timeLengthSon.style.width = distance + "px";
      this.timeBall.style.left = distance - 12 + "px";
    },
    //触摸（手指离开屏幕）
    touchend(event) {
      this.endNum = event.changedTouches[0].clientX;
      var timeLengthLeft = document
        .getElementById("timeLength")
        .getBoundingClientRect().left;
      var distance = this.endNum - timeLengthLeft;
      if (distance > 0) {
        if (distance > this.timeLength.offsetWidth) {
          distance = this.timeLength.offsetWidth;
        }
      } else {
        distance = 0;
      }
      this.timeLengthSon.style.width = distance + "px";
      this.timeBall.style.left = +"px";
      this.video.currentTime = Math.round(
        Number(
          this.timeLengthSon.offsetWidth /
            this.timeLength.offsetWidth *
            this.time
        )
      );
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
  width: 100%;
  height: 100vh;
  background: rgba(247, 247, 247, 1);
}

.videoCss {
  width: 100%;
  height: 17.58rem;
}

.newsVideoContent {
  widows: 100%;
  height: 100vh;
  min-height: 38rem;
  overflow-y: hidden;
}

.top {
  width: 100%;
  height: 12.17rem;
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

.commentsTitle > div {
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
  text-align: justify;
  text-justify: inter-ideograph;
}

.meComments > div:nth-child(2) {
  margin-top: 0.3rem;
  width: 100%;
  min-height: 1.772rem;
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

.yComments > div:nth-child(1) {
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

.yo-scroll {
  position: absolute;
  top: 17.5rem;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
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

.bad-video > div {
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

.controlsa > * {
  flex: 1;
}

.controlsa > *:nth-child(1) {
  flex: 6;
}

.progressBarFar {
  position: absolute;
  top: -0.5rem;
  width: 100%;
  height: 1.5rem;
  border-radius: 10px;
}

.controlsa > *:nth-child(2) {
  flex: 3;
  text-align: center;
}

.controlsa > *:nth-child(3) {
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
</style>