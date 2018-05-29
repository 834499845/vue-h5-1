// 意见列表
<template>
  <div class="customerLook">
    <div class="customerLookTop">
      <div class="issueList-input">
        <div class="issueList-inputLeft">
          反馈编号:
        </div>
        <div class="issueList-inputRight">
          {{dataObj.serNo}}
        </div>
      </div>
      <div class="issueList-input">
        <div class="issueList-inputLeft">
          用户账号:
        </div>
        <div class="issueList-inputRight">
           {{dataObj.userAccount}}
        </div>
      </div>
      <div class="issueList-text">
        <div class="issueList-textLeft">
          问题描述
        </div>
        <div class="issueList-textRight">
          <pre> {{dataObj.desc}}</pre>
        </div>
      </div>
      <div class="issueList-time">
        提交时间：{{dataObj.time | timeFun}}
      </div>
    </div>
    <div class="customerLookBot" v-show="commentLists.length > 0">
      <div class="customerLookBotComment">
        <ul>
          <li class="customerLookBotCommentLi" v-for="(item,index) in commentLists" :key="index">
            <div class="customerLookBotCommentLiTop">
              <div class="CommentLiTopLeft">
                <div>
                  <img src="/static/img/botong.png" alt="">
                </div>
                <div>伯通小密</div>
              </div>
              <div class="CommentLiTopRight">
                {{item.createTime | timeFun}}
              </div>
            </div>
            <div class="customerLookBotCommentLiBot">
              {{item.content}}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="tostImg">
      <img v-show="dataObj.status == 1" src="static/img/待处理@3x.png" alt="">
      <img v-show="dataObj.status == 2" src="static/img/已处理@3x.png" alt="">
      <img v-show="dataObj.status == 4" src="static/img/Group 9@3x.png" alt="">
      <img v-show="dataObj.status == 8" src="static/img/未解决@3x.png" alt="">
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapActions } from "vuex";
export default {
  props: ["createdShow"],
  components: {},
  data() {
    return {
      commentLists: [],
      issueListBut: false,
      presentVal: "",
      dataObj: {}
    };
  },
  created: function() {
    var self = this;
    if (sessionStorage.getItem("customerServiceId")) {
      var feedId = JSON.parse(sessionStorage.getItem("customerServiceId"));
      self.$store.commit("setMutVuexisLoading", true);
      self
        .getfeedBackDetails({
          feedbackId: feedId
        })
        .then(data => {
          self.$store.commit("setMutVuexisLoading", false);
          if (data.statusCode == 200) {
            if (data.data) {
              self.dataObj = data.data;
              self
                .getfeedBackreplyList({
                  feedId: self.dataObj.id
                })
                .then(data => {
                  self.$store.commit("setMutVuexisLoading", false);
                  if (data.statusCode == 200) {
                    if (data.data) {
                      self.commentLists = data.data;
                    }
                  } else {
                    Toast({
                      message: data.statusMessage,
                      position: "bottom"
                    });
                  }
                })
                .catch(msg => {
                  self.$store.commit("setMutVuexisLoading", false);
                  Toast({
                    message: "服务器异常",
                    position: "bottom"
                  });
                });
            }
          } else {
            self.$store.commit("setMutVuexisLoading", false);
            Toast({
              message: data.statusMessage,
              position: "bottom"
            });
          }
        })
        .catch(msg => {
          self.$store.commit("setMutVuexisLoading", false);
          Toast({
            message: "服务器异常",
            position: "bottom"
          });
        });
    }
  },
  mounted() {
    var self = this;
    document.title = "详情";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setTitle("详情");
        window.BenchJSInterface.setTopBarColor(1);
      }
    } else {
      var setNav = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          titles: [{ name: "", code: "" }]
        }
      };
      if (window.webkit) {
        window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
          setNav
        );
      }
    }
  },
  watch: {
    createdShow(val) {
      var self = this;
    }
  },
  methods: {
    ...mapActions(["getfeedBackDetails", "getfeedBackreplyList"])
  },
  filters: {
    // 过滤时间
    timeFun: function(val) {
      if (val) {
        var standardTime = new Date(val * 1);
        var y, m, d, h, f;
        y = standardTime.getFullYear();
        m = standardTime.getMonth() + 1;
        m = m > 9 ? m : "0" + m;
        d = standardTime.getDate();
        d = d > 9 ? d : "0" + d;
        h = standardTime.getHours();
        h = h > 9 ? h : "0" + h;
        f = standardTime.getMinutes();
        f = f > 9 ? f : "0" + f;
        return y + "." + m + "." + d + " " + h + ":" + f;
      } else {
        return "暂无";
      }
    }
  }
};
</script>
<style scoped>
.customerLookBotCommentLiBot {
  width: calc(100vw - 0.8533rem);
  margin-left: 0.4267rem;
  border: 0.0267rem solid #e3e3e3;
  margin-top: 0.32rem;
  margin-bottom: 0.48rem;
  font-size: 0.3733rem;
  color: #2b2b2b;
  padding: 0.1867rem;
}
.CommentLiTopLeft div:nth-child(1) {
  width: 0.96rem;
  height: 0.96rem;
  border-radius: 50%;
  overflow: hidden;
}
.CommentLiTopLeft div:nth-child(2) {
  font-size: 0.4267rem;
  color: rgba(43, 43, 43, 1);
  margin-left: 0.32rem;
}
.CommentLiTopLeft div:nth-child(1) img {
  width: 0.96rem;
  height: 0.96rem;
  border-radius: 50%;
  overflow: hidden;
}
.CommentLiTopRight {
  color: rgba(192, 192, 192, 1);
  font-size: 0.32rem;
  margin-right: 0.4267rem;
}
.CommentLiTopLeft {
  display: flex;
  height: 0.96rem;
  align-items: center;
  margin-left: 0.4267rem;
}
.customerLookBotCommentLiTop {
  display: flex;
  justify-content: space-between;
  height: 0.96rem;
  align-items: center;
}
.customerLookBotCommentLi:nth-child(1) {
  border: 0;
}
.customerLookBotCommentLi {
  min-height: 3.3267rem;
  padding-top: 0.4267rem;
  overflow: hidden;
  border-top: 1px solid #e3e3e3;
}
.customerLookBot {
  margin-top: 0.32rem;
  background-color: #fff;
  overflow: hidden;
  background-color: #fff;
}
.customerLookTop {
  background-color: #fff;
  padding-bottom: 0.4267rem;
  overflow: hidden;
}
.issueList-time {
  width: 100vw;
  padding-left: 0.4267rem;
  height: 0.32rem;
  font-size: 0.32rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.32rem;
}

.issueList-butGoCLick {
  color: rgba(255, 255, 255, 1) !important;
}

.issueList-butCLick {
  height: 1.28rem;
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
  border-radius: 0.0533rem;
  width: calc(100vw - 1.92rem);
  margin-left: 0.96rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.48rem;
  text-align: center;
  line-height: 1.28rem;
}

.issueList-but {
  width: 100vw;
  margin-top: 0.96rem;
  margin-bottom: 0.9333rem;
}

.imgRightLi {
  width: 2.1333rem;
  height: 2.1333rem;
  margin-right: 0.2133rem;
  position: relative;
  margin-bottom: 0.4267rem;
}

.imgRightLiDelete img {
  width: 100%;
  height: 100%;
}

.imgRightLiDelete {
  position: absolute;
  z-index: 100000;
  top: -0.2133rem;
  right: -0.2133rem;
  width: 0.4267rem;
  height: 0.4267rem;
}

.imgRightLi img {
  width: 100%;
  height: 100%;
}

.issueList-imgRight ul {
  display: flex;
  flex-wrap: wrap;
}

.issueList-imgRight {
  width: calc(100vw - 0.5867rem);
  min-height: 2.1333rem;
  margin-bottom: 0.4267rem;
  margin-left: 0.4267rem;
}

.issueList-imgLeft {
  height: 1.0667rem;
  width: 100%;
  line-height: 1.0667rem;
  padding-left: 0.4267rem;
  font-size: 0.4267rem;
  color: #2b2b2b;
}

.issueList-imgLeft small {
  font-size: 0.4267rem;
  color: rgba(192, 192, 192, 1);
}

.issueList-img {
  width: 100%;
  overflow: hidden;
  min-height: 3.2rem;
}

.issueList-textRight {
  width: calc(100vw - 0.8534rem);
  color: rgba(44, 44, 44, 1);
  position: relative;
  margin-left: 0.4267rem;
  border: 1px solid #e3e3e3;
  min-height: 1.3333rem;
}
.issueList-textRight pre {
  width: 100%;
  font-size: 0.4267rem;
  padding: 0.1867rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.5757rem;
  white-space: pre-wrap; /*css-3*/
  white-space: -moz-pre-wrap; /*Mozilla,since1999*/
  white-space: -pre-wrap; /*Opera4-6*/
  white-space: -o-pre-wrap; /*Opera7*/
  word-wrap: break-word; /*InternetExplorer5.5+*/
}
.issueList-textLeft {
  height: 1.0133rem;
  width: 100%;
  padding-left: 0.4267rem;
  line-height: 1.0133rem;
  font-size: 0.4267rem;
  color: rgba(43, 43, 43, 1);
}

.issueList-text {
  min-height: 2.9333rem;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.issueList-inputLeft {
  min-width: 2.4rem;
  height: 1.1733rem;
  line-height: 1.1733rem;
  font-size: 0.4267rem;
  color: rgba(43, 43, 43, 1);
  padding-left: 0.4267rem;
}

.issueList-inputSelect {
  height: 1.1733rem;
  width: 1.1467rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.issueList-inputSelect::after {
  position: absolute;
  height: 0.7467rem;
  width: 1px;
  background-color: #c0c0c0;
  top: 0.1867rem;
  left: 0;
  content: "";
}

input::-webkit-input-placeholder {
  color: rgba(192, 192, 192, 1);
}

.issueList-inputSelect img {
  width: 0.32rem;
}

.tostImg {
  position: absolute;
  top: 0.32rem;
  right: 0.4267rem;
  width: 2.56rem;
  height: 2.1333rem;
  z-index: 10000000000000000000000000000;
}

.tostImg img {
  width: 100%;
  height: 100%;
  z-index: 10000000000000000000000000000;
}
.issueList-inputRight {
  height: 1.1733rem;
  width: calc(100vw - 2.4rem - 1.1467rem - 0.4267rem);
  margin-left: 0.4267rem;
  font-size: 0.4267rem;
  line-height: 1.1933rem;
  color: rgba(44, 44, 44, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.issueList-selectRight {
  height: 1.1733rem;
  width: calc(100vw - 2.4rem - 1.1467rem - 0.4267rem);
  display: flex;
  align-items: center;
  margin-left: 0.4267rem;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
}

.issueList-input::after {
  position: absolute;
  bottom: 0;
  height: 1px;
  width: calc(100vw - 0.4267rem);
  left: 0.4267rem;
  background-color: #e3e3e3;
  content: "";
}

.issueList-input {
  height: 1.1733rem;
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
}

.customerLook {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100vh;
  width: 100vw;
  position: relative;
  background-color: rgba(241, 241, 241, 1);
}
</style>