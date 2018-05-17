<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="news ANEWS">
    <div class="main" v-show="!pathShow">
      <div class="main-top">
        <div class="main-top-top">
          <div>
            {{issueObj.title}}
          </div>
          <!-- <div>
            {{issueObj.content}}
          </div> -->
          <!-- <div v-show="issueObj.cover">
            <img :src="issueObj.cover" alt="">
          </div> -->
          <div class="top-content-text" v-show="issueObj.type == 0" v-html="issueObj.content">
            <!-- <img :src="item.cover" alt=""> -->
          </div>
          <div class="top-content-img" v-show="issueObj.type == 1" v-html="issueObj.content">
            <!-- <img :src="item.cover" alt=""> -->
          </div>
          <div class="top-content-video" v-show="issueObj.type == 2">
            <img :src="issueObj.cover" alt="">
          </div>
          <!--  v-html="item.content" -->
          <div class="top-content-audio" v-show="issueObj.type == 3">
            暂不支持音频
          </div>
          <div class="main-top-topBot">
            <!-- 展开问题 -->
          </div>
        </div>
      </div>
      <div class="main-bottom-bottom">
        <div>
          {{issueObj.answerCount}}个问答
        </div>
        <div>
          <div @click="selectHotCick(1)"  :class="{'newsSelect':isNewsSelect == 2}">最热</div>
          <div @click="selectNewsCick(2)" :class="{'newsSelect':isNewsSelect == 1}">最新</div>
        </div>
      </div>
      <div class="main-bottom">
        <ul>
          <li class="main-bottom-li" v-for="(item,index) in lists" :key="item.id">
            <div class="main-li-content">
              <div>
                <div>
                  <div>
                    <img :src="item.smallImg | imgFun" alt="">
                  </div>
                  <div>
                    {{item.nickName}}
                  </div>
                </div>
                <div>
                  {{item.createDate | timeFun}}
                </div>
              </div>
              <div>
                {{item.title}}
              </div>
              <div class="mli-content-text" v-show="item.type == 0" v-html="item.content">
                <!-- <img :src="item.cover" alt=""> -->
              </div>
              <div :class="{'mli-content-textImg':isTextImg,'mli-content-textImgMore':isTextImgMore}" v-show="item.type == 1" v-html="item.content">
                <!-- <img :src="item.cover" alt=""> -->
              </div>
              <div class="mli-content-video" v-show="item.type == 2">
                <img :src="item.cover" alt="">
              </div>
              <!--  v-html="item.content" -->
              <div class="mli-content-audio" v-show="item.type == 3">
                暂不支持音频
              </div>
              <div class="mli-content-four">
                <div>
                  {{item.praiseCount}} 赞
                </div>
                <!-- <div>
                  {{item.collectCount}} 收藏
                </div> -->
                <div class="textimg-more" @click="moreClick(index)" v-show="item.type == 10">
                  查看全部
                </div>
              </div>
            </div>
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
      isNewsSelect: 1,
      pathShow: false,
      isTextImg: true,
      isTextImgMore: 99999999999,
      issueNum: "0",
      issueObj: {
        content: "0", //问题内容
        follow: false, //是否被当前用户关注
        title: "", //问题标题
        type: "0", //类型（0：文字,1：图文 ,2：视频,3：语音）
        answerCount: 0, //回答总数
        picture: "",
        cover: null, //视频封面
        longTime: null, //视频时长
        size: null, //视频大小，int
        shareAddress: "" //分享地址
      },
      lists: [
        {
          title: "", //问题标题
          answerId: "", //问题回答id
          content: "", //问题回答内容
          updateDate: 0, //最后修改时间
          type: "", //问题回答类型类型（0：文字,1：图文 ,2：视频,3：语音
          picture: "",
          cover: null, //视频封面
          longTime: null, //视频时长
          size: null, //视频大小，int
          praiseCount: 0, //点赞数量
          collectCount: 0, //收藏数量
          praise: false, //是否被点赞
          collect: false, //是否被关注
          userId: "", //用户ID
          smallImg: "", //用户头像
          nickName: "", //用户昵称
          shareAddress: "" //分享地址
        }
      ]
    };
  },
  filters: {
    // 返回日期格式化
    timeFun(date) {
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
    imgFun(val) {
      if (val) {
        if (val.length > 0) {
          return val;
        } else {
          return "/static/img/ren.png";
        }
      } else {
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
      //   if (val) {
      //     if (val.length > 30) {
      //       val = val.substring(0, 30);
      //       val = val + "...";
      //       return val;
      //     } else {
      //       return val;
      //     }
      //   } else {
      //     return "无";
      //   }
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
    document.title = "问答分享";
    // questionId=978dd21313ce4bf3a30c7410835ecf27
    if (self.$route.query.id) {
      self
        .getapiquestionAnswerquestionDetail({
          questionId: self.$route.query.id
        })
        .then(data => {
          if (data.code == 200) {
            self.issueObj = data.data;
            document.title = self.issueObj.title;
            self
              .getapiquestionAnswerquestionDetailAnswers({
                questionId: self.$route.query.id,
                type: "0",
                pageNo: "1",
                pageSize: "300"
              })
              .then(data => {
                if (data.code == 200) {
                  self.lists = data.data.records;
                  self.pathShow = false;
                } else {
                  self.pathShow = true;
                  Toast({
                    message: data.message,
                    className: "toastLoad"
                  });
                }
              })
              .catch(msg => {
                self.pathShow = true;
                Toast({
                  message: "服务器错误",
                  className: "toastLoad"
                });
              });
          } else {
            self.pathShow = true;
            Toast({
              message: data.message,
              className: "toastLoad"
            });
          }
        })
        .catch(msg => {
          self.pathShow = true;
          Toast({
            message: "服务器错误",
            className: "toastLoad"
          });
        });
    } else {
      self.pathShow = true;
    }
  },
  beforeDestroy: function() {},
  watch: {},
  methods: {
    selectNewsCick(index) {
      var self = this;
      self.lists = [];
      self.isNewsSelect = 2;
      self
        .getapiquestionAnswerquestionDetailAnswers({
          questionId: self.$route.query.id,
          type: "1",
          pageNo: "1",
          pageSize: "300"
        })
        .then(data => {
          if (data.code == 200) {
            self.lists = data.data.records;
          } else {
            Toast({
              message: data.message,
              className: "toastLoad"
            });
          }
        })
        .catch(msg => {
          self.pathShow = true;
          Toast({
            message: "服务器错误",
            className: "toastLoad"
          });
        });
    },
    selectHotCick(index) {
      var self = this;
      self.isNewsSelect = 1;
      self.lists = [];
      self
        .getapiquestionAnswerquestionDetailAnswers({
          questionId: self.$route.query.id,
          type: "0",
          pageNo: "1",
          pageSize: "300"
        })
        .then(data => {
          if (data.code == 200) {
            self.lists = data.data.records;
          } else {
            Toast({
              message: data.message,
              className: "toastLoad"
            });
          }
        })
        .catch(msg => {
          self.pathShow = true;
          Toast({
            message: "服务器错误",
            className: "toastLoad"
          });
        });
    },
    moreClick(index) {
      // this.isTextImg = !this.isTextImg
      this.isTextImgMore = index;
    },
    ...mapActions([
      "getapiquestionAnswerquestionDetailAnswers",
      "getapiquestionAnsweranswerDetail",
      "getapiquestionAnswerquestionDetail"
    ])
  }
};
</script>
<style scoped>
.main-bottom {
  min-width: 5rem;
}

.main-li-content > div:nth-child(1) > div:nth-child(1) {
  display: flex;
  align-items: center;
}

.main-li-content > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
}

.main-li-content > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) {
  font-size: 1.33rem;
  color: #303030;
  margin-left: 1rem;
}

.main-li-content > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) img {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
}

.main-li-content > div:nth-child(1) > div:nth-child(2) {
  font-size: 1rem;
  color: #999;
}

.main-li-content > div:nth-child(1) {
  display: flex;
  width: 100%;
  justify-content: space-between;
  height: 3rem;
  align-items: center;
  margin-top: 1.2rem;
}

.main-li-content > div:nth-child(2) {
  font-size: 1.17rem;
  color: #555;
  margin-top: 0.57rem;
}

.main-li-content > div:nth-child(3) {
  /* min-height: 10.83rem; */
}

.mli-content-text {
  min-width: 2rem;
  width: 100%;
  margin-top: 0.57rem;
}

.mli-content-textImg {
  /* height: 12rem; */
  min-height: 12rem;
  overflow: hidden;
  width: 100%;
  margin-top: 0.77rem;
}

.main-li-content .mli-content-textImgMore {
  min-height: 12rem !important;
}

.mli-content-video {
  margin-top: 0.57rem;
  width: 100%;
  max-height: 25rem;
}

.mli-content-video img {
  width: 100% !important;
  height: 100% !important;
}

.mli-content-audio {
  width: 100%;
  height: 3rem;
  margin-top: 0.57rem;
  text-align: center;
  font-size: 1.5rem;
  color: #979797;
  line-height: 3rem;
}

.main-li-content > div:nth-child(3) audio {
  position: absolute;
  left: 0 !important;
  top: 0 !important;
}

.mli-content-four {
  display: flex;
  width: 100%;
  height: 1.2rem;
  color: #999;
  font-size: 1rem;
  margin-top: 1rem;
  margin-bottom: 1.3rem;
  position: relative;
}

.textimg-more {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 80px;
  height: 1.2rem;
  background-color: #ff8a41;
  border-radius: 4px;
  z-index: 100000;
  line-height: 1.2rem;
  font-size: 1rem;
  color: #000;
  text-align: center;
}

.mli-content-four > div:nth-child(2) {
  margin-left: 1.5rem;
}

.main-li-content > div {
  width: 100%;
  overflow: hidden;
}

.main-li-content {
  width: 95%;
  margin: 0 auto;
  min-height: 8.08rem;
  background-color: #fff;
}

.main-bottom-li {
  min-height: 8.08rem;
  width: 100%;
  background-color: #fff;
  margin-bottom: 0.67rem;
  overflow: hidden;
}

.main-top-top > div:nth-child(1) {
  font-size: 1.67rem;
  color: #000;
  width: 100%;
  margin-top: 1.33rem;
}

/* .main-top-top>div:nth-child(2) {
    font-size: 1.17rem;
    color: #555;
    width: 100%;
    margin-top: 0.57rem;
  } */

.top-content-text {
  width: 100%;
  min-height: 2.33rem;
  margin-top: 0.57rem;
  font-size: 1.17rem;
  color: #555;
  width: 100%;
  margin-top: 0.57rem;
}

.top-content-img {
  width: 100%;
  min-height: 10.83rem;
  margin-top: 0.57rem;
}

.top-content-video {
  width: 100%;
  height: 10.83rem;
  margin-top: 0.57rem;
}

.top-content-video {
  margin-top: 0.57rem;
  width: 100%;
  max-height: 25rem;
}

.top-content-video img {
  width: 100% !important;
  height: 100% !important;
}

.top-content-audio {
  width: 100%;
  height: 3rem;
  margin-top: 0.57rem;
  text-align: center;
  font-size: 1.5rem;
  color: #979797;
  line-height: 3rem;
}

.main-top-topBot {
  font-size: 1.17rem;
  color: #ff8a41;
  width: 100%;
  margin-top: 1rem;
}

.main-top-top {
  width: 95%;
  margin: 0 auto;
}

.main-top {
  min-height: 3rem;
  width: 100%;
  background-color: #fff;
  overflow: hidden;
}

.main-bottom-bottom {
  height: 2.83rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #f7f7f7;
  align-items: center;
}

.main-bottom-bottom > div:nth-child(1) {
  color: #999;
  font-size: 1.17rem;
  margin-left: 1rem;
}

.main-bottom-bottom > div:nth-child(2) {
  display: flex;
  margin-right: 1rem;
}

.main-bottom-bottom > div:nth-child(2) > div:nth-child(1) {
  border-right: 1px solid #979797;
}

.main-bottom-bottom > div:nth-child(2) > div {
  font-size: 1.17rem;
  padding-left: 0.4rem;
  padding-right: 0.4rem;
}
.newsSelect {
  color: #ccc;
}
.nullLi {
  height: 8rem;
  width: 100%;
  text-align: center;
  line-height: 8rem;
  font-size: 1.3rem;
  color: #ccc;
}

.main {
  overflow: hidden;
  background-color: #f7f7f7 !important;
}

.nullShow {
  height: 10rem;
  color: #e6e6e6;
  font-size: 3rem;
  text-align: center;
  line-height: 10rem;
}

.news {
  background-color: #f7f7f7 !important;
  overflow-x: hidden;
  min-height: 100vh;
  /* padding: 1.07rem; */
}
</style>