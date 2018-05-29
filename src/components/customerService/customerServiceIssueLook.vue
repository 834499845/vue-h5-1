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
      <div class="issueList-input">
        <div class="issueList-inputLeft">
          操作系统:
        </div>
        <div class="issueList-selectRight">
          {{dataObj.clientOs}}
        </div>
      </div>
      <div class="issueList-input">
        <div class="issueList-inputLeft">
          发生时间:
        </div>
        <div class="issueList-selectRight">
          {{dataObj.time | timeFun}}
        </div>
      </div>
      <div class="issueList-input">
        <div class="issueList-inputLeft">
          所属模块:
        </div>
        <div class="issueList-selectRight">
          {{dataObj.module}}
        </div>
      </div>
      <div class="issueList-input">
        <div class="issueList-inputLeft">
          问题类型:
        </div>
        <div class="issueList-selectRight">
          {{dataObj.type}}
        </div>
      </div>
      <div class="issueList-text">
        <div class="issueList-textLeft">
          问题描述
        </div>
        <div class="issueList-textRight">
          <pre>{{dataObj.desc}}</pre>
        </div>
      </div>
      <div class="issueList-img" v-show="imgLists.length > 0">
        <div class="issueList-imgLeft">
          相关截图
        </div>
        <div class="issueList-imgRight">
          <ul>
            <li class="imgRightLi" @click="LookFileIndeClick(index)" v-for="(item,index) in imgLists" :key="index">
              <img :src="item" alt="">
            </li>
          </ul>
        </div>
      </div>
      <div class="issueList-time">
        提交时间：{{dataObj.createTime | timeFun}}
      </div>
    </div>
    <div class="customerLookBot">
      <div class="customerLookBotComment" v-show="commentLists.length > 0">
        <ul>
          <li class="customerLookBotCommentLi" v-for="(item,index) in commentLists" :key="index">
            <div class="customerLookBotCommentLiTop" v-show="item.postUserType == 1">
              <div class="CommentLiTopLeft" v-if="item.userInfo">
                <div class="ll-t-lf-img" v-if="item.userInfo">
                  <img v-if="item.userInfo && item.userInfo.icon" :src="item.userInfo.icon" alt="">
                  <div v-else>{{item.userInfo.userName | userNickFun}}</div>
                </div>
                <div>{{item.userInfo.userName}}</div>
              </div>
              <div class="CommentLiTopRight">
                {{item.createTime | timeFun}}
              </div>
            </div>
            <div class="customerLookBotCommentLiTop" v-show="item.postUserType == 2">
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
      <div class="customerLookBotBut" v-show="dataObjStatus">
        <div @click="goIssueClick">
          已解决
        </div>
        <div @click="SupplementClick">
          {{SupplementClickVal}}
        </div>
      </div>
    </div>
    <div class="tostImg">
      <img v-show="dataObj.status == 1" src="static/img/待处理@3x.png" alt="">
      <img v-show="dataObj.status == 2" src="static/img/已处理@3x.png" alt="">
      <img v-show="dataObj.status == 4" src="static/img/Group 9@3x.png" alt="">
      <img v-show="dataObj.status == 8" src="static/img/未解决@3x.png" alt="">
    </div>
    <div class="noSuppTost" v-show="isNoSuppTost">
      <div class="cancelUpdateContent">
        <div>
          <div>
            如未解决您的问题，请及时与客服联系沟通问题，感谢您的支持！
          </div>
        </div>
        <div>
          <div @click="cancelUpdateCancelClick(1)">确定</div>
          <div @click="cancelUpdateCancelClick(2)">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapActions } from "vuex";
export default {
  components: {},
  data() {
    return {
      dataObjStatus: false,
      isNoSuppTost: false,
      SupplementClickVal: "补充反馈",
      commentLists: [], // 评论列表
      issueListBut: false,
      dataObj: {},
      imgLists: [],
      presentVal: ""
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
          if (data.statusCode == 200) {
            self.dataObj = data.data;
            if (self.dataObj.images) {
              var imageStr = JSON.parse(self.dataObj.images);
              self.imgLists = imageStr;
            }
            self
              .getfeedBackreplyList({
                feedId: self.dataObj.id
              })
              .then(data => {
                self.$store.commit("setMutVuexisLoading", false);
                if (data.statusCode == 200) {
                  if (data.data) {
                    self.commentLists = data.data;
                    if (self.dataObj.status == 2) {
                      var aommArr = [];
                      self.commentLists.forEach(function(ele, ind) {
                        if (ele.postUserType == 1) {
                          aommArr.push(ele);
                        }
                      });
                      if (aommArr.length == 1) {
                        self.SupplementClickVal = "未解决";
                        self.dataObjStatus = true;
                      } else {
                        self.SupplementClickVal = "补充反馈";
                        self.dataObjStatus = true;
                      }
                    } else if (
                      self.dataObj.status == 1 &&
                      self.commentLists.length > 0
                    ) {
                      var adminArr = [];
                      self.commentLists.forEach(function(ele, ind) {
                        if (ele.postUserType == 2) {
                          adminArr.push(ele);
                        }
                      });
                      if (adminArr.length == 2) {
                        self.SupplementClickVal = "未解决";
                        self.dataObjStatus = true;
                      } else {
                        self.dataObjStatus = false;
                      }
                    }
                  } else {
                    if (self.dataObj.status == 2) {
                      var aommArr = [];
                      var adminArr = [];
                      self.commentLists.forEach(function(ele, ind) {
                        if (ele.postUserType == 1) {
                          aommArr.push(ele);
                        }
                        if (ele.postUserType == 2) {
                          adminArr.push(ele);
                        }
                      });
                      if (aommArr.length == 1 && adminArr.length == 2) {
                        self.SupplementClickVal = "未解决";
                        self.dataObjStatus = true;
                      } else {
                        self.SupplementClickVal = "补充反馈";
                        self.dataObjStatus = true;
                      }
                    } else if (
                      self.dataObj.status == 1 &&
                      self.commentLists.length > 0
                    ) {
                      var adminArr = [];
                      self.commentLists.forEach(function(ele, ind) {
                        if (ele.postUserType == 2) {
                          adminArr.push(ele);
                        }
                      });
                      if (adminArr.length == 2) {
                        self.SupplementClickVal = "未解决";
                        self.dataObjStatus = true;
                      } else {
                        self.dataObjStatus = false;
                      }
                    }
                  }
                } else {
                  if (self.dataObj.status == 2) {
                    var aommArr = [];
                    self.commentLists.forEach(function(ele, ind) {
                      if (ele.postUserType == 1) {
                        aommArr.push(ele);
                      }
                    });
                    if (aommArr.length == 1) {
                      self.SupplementClickVal = "未解决";
                      self.dataObjStatus = true;
                    } else {
                      self.SupplementClickVal = "补充反馈";
                      self.dataObjStatus = true;
                    }
                  } else if (
                    self.dataObj.status == 1 &&
                    self.commentLists.length > 0
                  ) {
                    var adminArr = [];
                    self.commentLists.forEach(function(ele, ind) {
                      if (ele.postUserType == 2) {
                        adminArr.push(ele);
                      }
                    });
                    if (adminArr.length == 2) {
                      self.SupplementClickVal = "未解决";
                      self.dataObjStatus = true;
                    } else {
                      self.dataObjStatus = false;
                    }
                  }
                  Toast({
                    message: data.statusMessage,
                    position: "bottom"
                  });
                }
              })
              .catch(msg => {
                if (self.dataObj.status == 2) {
                  var aommArr = [];
                  self.commentLists.forEach(function(ele, ind) {
                    if (ele.postUserType == 1) {
                      aommArr.push(ele);
                    }
                  });
                  if (aommArr.length == 1) {
                    self.SupplementClickVal = "未解决";
                    self.dataObjStatus = true;
                  } else {
                    self.SupplementClickVal = "补充反馈";
                    self.dataObjStatus = true;
                  }
                } else if (
                  self.dataObj.status == 1 &&
                  self.commentLists.length > 0
                ) {
                  var adminArr = [];
                  self.commentLists.forEach(function(ele, ind) {
                    if (ele.postUserType == 2) {
                      adminArr.push(ele);
                    }
                  });
                  if (adminArr.length == 2) {
                    self.SupplementClickVal = "未解决";
                    self.dataObjStatus = true;
                  } else {
                    self.dataObjStatus = false;
                  }
                }
                self.$store.commit("setMutVuexisLoading", false);
                Toast({
                  message: "服务器异常",
                  position: "bottom"
                });
              });
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
  watch: {},
  methods: {
    // 图片预览
    LookFileIndeClick(index) {
      var self = this;
      var arr = [];
      self.imgLists.forEach(function(ele, ind) {
        arr.push({ img: ele });
      });
      this.WatchBigPicture(arr, index);
    },
    // 取消离开页面 未解决
    cancelUpdateCancelClick(index) {
      var self = this;
      this.isNoSuppTost = false;
      if (index == 1) {
        self
          .getfeedBackresult({
            success: 0,
            feedId: self.dataObj.id
          })
          .then(data => {
            if (data.statusCode == 200) {
              Toast({
                message: "反馈成功",
                position: "bottom"
              });
              this.$router.go(-1);
            } else {
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    // 已解决
    goIssueClick() {
      var self = this;
      self
        .getfeedBackresult({
          success: 1,
          feedId: self.dataObj.id
        })
        .then(data => {
          if (data.statusCode == 200) {
            Toast({
              message: "反馈成功",
              position: "bottom"
            });
            this.$router.go(-1);
          } else {
            Toast({
              message: data.statusMessage,
              position: "bottom"
            });
          }
        })
        .catch(msg => {
          Toast({
            message: "服务器异常",
            position: "bottom"
          });
        });
    },
    // 补充反馈/未解决
    SupplementClick() {
      var self = this;
      if (self.SupplementClickVal == "补充反馈") {
        self.$router.push({
          path: "/customerServiceSupplement"
        });
      } else {
        self.isNoSuppTost = true;
      }
    },
    ...mapActions([
      "getfeedBackreplyList",
      "getfeedBackresult",
      "getfeedBackDetails"
    ])
  },
  filters: {
    userNickFun: function(val) {
      if (val) {
        if (val.length > 2) {
          return val.slice(val.length - 2, val.length);
        } else {
          return val;
        }
      } else {
        return "";
      }
    },
    // 状态
    statusFun(val) {
      if (val) {
        if (val == 1) {
          return "待处理";
        } else if (val == 2) {
          return "已处理";
        } else if (val == 4) {
          return "已解决";
        } else if (val == 8) {
          return "未解决";
        }
      } else {
        return "暂无";
      }
    },
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
.cancelUpdateContent > div:nth-child(2) > div {
  width: 50%;
  text-align: center;
  font-size: 0.48rem;
  color: rgba(67, 144, 225, 1);
  height: 1.1733rem;
  line-height: 1.1733rem;
}

.cancelUpdateContent > div:nth-child(2) > div:nth-child(1) {
  border-right: 1px solid rgba(195, 222, 250, 1);
}

.cancelUpdateContent > div:nth-child(2) {
  display: flex;
  justify-content: space-between;
  height: 1.1733rem;
  align-items: center;
}

.cancelUpdateContent > div:nth-child(1) {
  height: 1.92rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(195, 222, 250, 1);
}
.cancelUpdateContent > div:nth-child(1) div {
  height: 1.92rem;
  width: 6.4rem;
  text-align: center;
  font-size: 0.4267rem;
  height: 1.1733rem;
  color: rgba(44, 44, 44, 1);
}
.cancelUpdateContent {
  width: 7.2rem;
  height: 3.0933rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.0533rem;
}

.noSuppTost {
  width: 100vw;
  height: 100vh;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
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

.customerLookBotBut {
  height: 0.8533rem;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0.4533rem;
  margin-bottom: 0.7467rem;
  overflow: hidden;
}

.customerLookBotBut div:nth-child(1) {
  margin-right: 0.32rem;
}

.customerLookBotBut div:nth-child(2) {
  margin-left: 0.32rem;
}

.customerLookBotBut div {
  width: 2.9333rem;
  height: 0.8533rem;
  background: rgba(67, 144, 225, 1);
  line-height: 0.8533rem;
  font-size: 0.3733rem;
  color: rgba(255, 255, 255, 1);
  text-align: center;
}

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
.ll-t-lf-img div {
  position: absolute;
  top: 0;
  left: 0;
  width: 0.96rem;
  height: 0.96rem;
  overflow: hidden;
  border-radius: 50%;
  background-color: #4592e2;
  text-align: center;
  line-height: 0.96rem;
  color: #fff;
  font-size: 0.3733rem;
}
.ll-t-lf-img {
  position: relative;
  width: 0.96rem;
  height: 0.96rem;
  border-radius: 50%;
}

.ll-t-lf-img img {
  width: 0.96rem;
  height: 0.96rem;
  border-radius: 50%;
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
  /* min-height: 0.8533rem; */
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
  margin-top: 0.4267rem;
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
  min-height: 1.2rem;
}

.issueList-textRight {
  width: calc(100vw - 0.8534rem);
  color: rgba(44, 44, 44, 1);
  position: relative;
  margin-left: 0.4267rem;
  border: 1px solid #e3e3e3;
  min-height: 1.3333rem;
  overflow: hidden;
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

.issueList-text::after {
  position: absolute;
  bottom: 0;
  height: 1px;
  width: calc(100vw - 0.4267rem);
  left: 0.4267rem;
  background-color: #e3e3e3;
  content: "";
}

.issueList-inputLeft small,
.issueList-textLeft small {
  color: red;
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
  /* WebKit browsers */
  color: rgba(192, 192, 192, 1);
}

.issueList-inputSelect img {
  width: 0.32rem;
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