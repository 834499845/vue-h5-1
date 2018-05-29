// 查看日志
<template>
  <div class="lookLog">
    <div class="look-main" v-show="isnullShow">
      <div class="look-head" v-if="listObj.user">
        <div class="look-head-left">
            <img v-show="listObj.user.profile" :src="listObj.user.profile" alt="">
            <div v-show="!listObj.user.profile">{{listObj.user.realName | userNickFun}}</div>
        </div>
        <div class="look-head-right">
          <div class="look-head-r-t">{{listObj.user.realName}}</div>
          <div class="look-head-r-b">{{listObj.submitTime | timeFun}}</div>
        </div>
      </div>
      <div class="look-text" v-for="(item,index) in listObj.contents" :key="index">
        <div class="look-text-top">
          {{item.name}}
        </div>
        <div class="look-text-bot">
          <pre>{{item.value | strFun}}</pre>
        </div>
      </div>
      <div class="look-text look-remark">
        <div class="look-text-top">
          备注
        </div>
        <div class="look-text-bot">
          <pre>{{listObj.remark | strFun}}</pre>
        </div>
      </div>
      <div class="look-text" v-show="listObj.logImages">
        <div class="look-text-top">
          图片
        </div>
        <div class="look-text-img">
          <ul>
            <li @click="LookFileIndeClick(index)" class="look-text-img-li" v-for="(item,index) in listObj.logImages" :key="index">
              <img :src="item" alt="">
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="look-people" v-show="isnullShow">
      <div class="look-people-title">
        <div class="people-title-l">
          已读
        </div>
        <div class="people-title-r">
          {{listObj.readUsers | readUsersFun}}人
        </div>
      </div>
      <div class="look-people-list" v-show="listObj.readUsers">
        <ul>
          <li class="peoListsLi" v-for="(item,index) in listObj.readUsers" :key="index">
            <div class="peoListsLi-t">
               <img v-show="item.profile" :src="item.profile" alt="">
               <div v-show="!item.profile">{{item.name | userNickFun}}</div>
            </div>
            <div class="peoListsLi-b">
              {{item.name}}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="look-commonts" v-show="isnullShow">
      <div class="look-commonts-title">
        <div class="people-commonts-l">
          评论
        </div>
        <div class="people-commonts-r">

        </div>
      </div>
      <div class="look-commonts-main">
        <ul>
          <li v-show="commentsLists.length > 0" class="lcommonts-LI" v-for="(item,index) in commentsLists" :key="index">
            <div class="lcommonts-LI-left">
               <img v-show="item.userAvatar" :src="item.userAvatar" alt="">
               <div v-show="!item.userAvatar">{{item.userName | userNickFun}}</div>
            </div>
            <div class="lcommonts-LI-right">
              <div class="lc-l-r-t">
                <div class="lc-l-r-t-name">
                  {{item.userName}}
                </div>
                <div>
                  {{item.createTime | timeFun}}
                </div>
              </div>
              <div class="lc-l-r-b">
                {{item.content}}
              </div>
            </div>
          </li>
          <li v-show="commentsLists.length == 0" class="lcommontsNull-LI">
             <img class="lcommontsNull-img" src="/static/img/iconfont_default_list@3x.png" alt="">
             <div class="lcommontsNull-text">暂无评论</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="look-input" v-show="isnullShow">
      <div class="look-input-top">
        <div class="imgList-main" @touchstart="imgtouchStart($event)" @touchmove="imgtouchMove($event)" @touchend="imgtouchEnd($event)"
          :style="{'transform':istranslate3d,'transition':istransition,'webkitTransform':iswebkitTransform,'webkitTransition':iswebkitTransition}">
          <div @click="inputListsClick(index)" v-for="(item,index) in inputLists" :key="index" :style="{'position': isAbsolute,'left':index * (item.widths) + 'px'}"
            :class="{'imgList-main-one':true}">
            <div class="imgList-main-oneName">
              {{item.name}}
            </div>
          </div>
        </div>
      </div>
      <div class="look-input-bot" :style="{height:isTextHeight}">
        <div class="look-input-bot-input">
          <textarea maxlength="20000" v-model.trim="texteCommentsVal" ref="pickerdate" :style="{height:isTextHeight,'lineHeight':isTextlineHeight}"
            placeholder="评论"></textarea>
        </div>
        <div @click="commientsClick" :style="{height:isTextHeight,'lineHeight':isTextButlineHeight}" :class="{'look-input-bot-but':true,'lookinputbotbutTExt':islookinputbotbut}">
          发送
        </div>
      </div>
    </div>
    <div class="codeNo" v-show="!isnullShow">
      <div class="nullContent"></div>
      <img class="nullImg" src="/static/img/zixun.png" alt="">
      <div class="nullText">暂无数据</div>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isAbsolute: "absolute", // 滑动内容绝对经纬
      isLeft: "0px", // 定位left
      selectIndex: 1, // 当前的idnex
      allIndex: 0, // 所有idnex
      pockerShowstartY: 0,
      pockerShowEndY: 0,
      pockerShowMoveY: 0,
      isWidth: 0, // 屏幕的宽度
      maxHeight: 0, // 总位移
      temps: 0,
      istranslate3d: "translate3d(0, 0, 0)",
      iswebkitTransform: "translate3d(0, 0, 0)",
      istransition: "transform 0.2s ease-out",
      iswebkitTransition: "transform 0.2s ease-out",

      isnullShow: true,
      listObj: {},
      islookinputbotbut: false,
      texteCommentsVal: "",
      isTextButlineHeight: "0.8533rem",
      isTextHeight: "0.8533rem",
      isTextlineHeight: "0.8533rem",
      inputLists: [], // 评论简洁回复列表
      Lists: [],
      imgLists: [], // 图片列表
      commentsLists: [] // 评论列表
    };
  },
  components: {},
  mounted() {
    var self = this;

    this.Lists = [
      { name: "做的真好！" },
      { name: "继续加油！" },
      { name: "你是最棒的！" },
      { name: "加油！" },
      { name: "赞！" },
      { name: "工作认真！" },
      { name: "早点休息！" }
    ];
    this.isWidth = screen.width / 3;
    this.Lists.forEach(function(ele, ind) {
      self.inputLists.push({ name: ele.name, widths: self.isWidth });
    });
    this.maxHeight = (this.inputLists.length - 3) * self.isWidth;
    this.allIndex = this.inputLists.length;
  },
  methods: {
    imgtouchStart(event) {
      this.pockerShowstartY = 0;
      this.pockerShowstartY = event.changedTouches[0].pageX;
    },
    imgtouchMove(event) {
      var self = this;
      if (self.inputLists.length > 3) {
        self.pockerShowMoveY = event.changedTouches[0].pageX;
        var moveNum = self.pockerShowstartY - self.pockerShowMoveY;
        if (self.temps == self.maxHeight || self.temps == 0) {
          if (self.temps == 0) {
            self.istranslate3d = "translate3d(-" + moveNum + "px,0, 0)";
            self.iswebkitTransform = "translate3d(-" + moveNum + "px,0, 0)";
          } else {
            self.istranslate3d =
              "translate3d(-" + (self.temps + moveNum) + "px,0, 0)";
            self.iswebkitTransform =
              "translate3d(-" + (self.temps + moveNum) + "px,0, 0)";
          }
        } else {
          if (self.temps == 0 && moveNum < 0) {
            self.istranslate3d =
              "translate3d( " + 1.5 * this.isWidth + "px,0, 0)";
            self.iswebkitTransform =
              "translate3d(" + 1.5 * this.isWidth + "px,0, 0)";
          } else {
            self.istranslate3d =
              "translate3d(-" + (self.temps + moveNum) + "px,0, 0)";
            self.iswebkitTransform =
              "translate3d(-" + (self.temps + moveNum) + "px,0, 0)";
          }
        }
      }
    },
    imgtouchEnd(event) {
      var self = this;
      if (self.inputLists.length > 3) {
        self.pockerShowEndY = 0;
        self.pockerShowEndY = Math.abs(event.changedTouches[0].pageX);
        var tempDis =
          self.temps + (self.pockerShowstartY - self.pockerShowEndY);
        self.temps =
          tempDis < 0 ? 0 : tempDis < self.maxHeight ? tempDis : self.maxHeight;
        var yNumber = self.temps % self.isWidth;
        if (yNumber < self.isWidth / 2) {
          self.temps = self.temps - yNumber;
        } else {
          self.temps = self.temps + (self.isWidth - yNumber);
        }
        self.istranslate3d = "translate3d(-" + self.temps + "px,0, 0)";
        self.iswebkitTransform = "translate3d(-" + self.temps + "px,0, 0)";
      }
    },
    // 图片预览
    // LookFileIndeClick() {
    //   var self = this;
    //   self.$router.push({
    //     path: "/imgList"
    //   });
    //   sessionStorage.setItem("lookimg", JSON.stringify(self.listObj.logImages));
    // },
    LookFileIndeClick(index) {
      var self = this;
      var arr = [];
      self.listObj.logImages.forEach(function(ele, ind) {
        arr.push({ img: ele });
      });
      this.WatchBigPicture(arr, index);
    },
    // 快捷输入
    inputListsClick(index) {
      this.texteCommentsVal = this.inputLists[index].name;
    },
    // 发送评论
    commientsClick() {
      var self = this;
      if (self.texteCommentsVal.length > 0) {
        self
          .getapicomment(
            JSON.stringify({
              type: 3,
              objectId: self.listObj.logId,
              content: self.texteCommentsVal
            })
          )
          .then(data => {
            if (data.statusCode == 200) {
              Toast({
                message: "评论成功",
                position: "bottom"
              });
              self.dataFun();
              self.texteCommentsVal = "";
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
      } else {
        Toast({
          message: "请输入评论内容",
          position: "bottom"
        });
      }
    },
    dataFun() {
      var self = this;
      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (self.$route.query.userId) {
        self.isnullShow = true;
        self.$store.commit("setMutVuexisLoading", true);
        self
          .getloglogsearchget(
            JSON.stringify({
              logId: self.$route.query.logId,
              userId: self.$route.query.userId
            })
          )
          .then(data => {
            self.$store.commit("setMutVuexisLoading", false);
            if (data.statusCode == 200) {
              if (data.data) {
                self.listObj = data.data;
                document.title =
                  self.listObj.user.realName + "的" + self.listObj.templateName;
                if (isAndroid) {
                  if (window.BenchJSInterface) {
                    window.BenchJSInterface.setRightBtn("", "");
                    window.BenchJSInterface.setTopBarColor(1);
                    window.BenchJSInterface.setTitle(
                      self.listObj.user.realName +
                        "的" +
                        self.listObj.templateName
                    );
                  }
                } else {
                  var setNav = {
                    methodName: "invokeNavigationRightItemFromJS",
                    params: {
                      naviType: 0,
                      titles: [{ name: "", code: "shai" }]
                    }
                  };
                  if (window.webkit) {
                    window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                      setNav
                    );
                  }
                }
                if (
                  self.listObj.user.id !=
                  sessionStorage.getItem("logShareMemberId")
                ) {
                  self
                    .getlogsearchread(
                      JSON.stringify({
                        logId: self.$route.query.logId,
                        userId: sessionStorage.getItem("logShareMemberId")
                      })
                    )
                    .then(data => {
                      if (data.statusCode == 200) {
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
              } else {
                document.title = "日报";
                if (isAndroid) {
                  if (window.BenchJSInterface) {
                    window.BenchJSInterface.setRightBtn("", "");
                    window.BenchJSInterface.setTopBarColor(1);
                    window.BenchJSInterface.setTitle("日报");
                  }
                } else {
                  var setNav = {
                    methodName: "invokeNavigationRightItemFromJS",
                    params: {
                      naviType: 0,
                      titles: [{ name: "", code: "shai" }]
                    }
                  };
                  if (window.webkit) {
                    window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                      setNav
                    );
                  }
                }
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
        // 查看评论
        self
          .getapicomments({
            type: "3",
            objectId: self.$route.query.logId,
            pageNo: "1",
            pageSize: "30"
          })
          .then(data => {
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  self.commentsLists = data.data.records;
                }
              }
            } else {
              Toast({
                message: "获取评论失败",
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
      } else {
        self.isnullShow = false;
      }
    },
    ...mapActions([
      "getapicomments",
      "getapicomment",
      "getlogsearchread",
      "getloglogsearchget"
    ])
  },
  created: function() {
    var self = this;
    if (self.$route.query.userId) {
      self.isnullShow = true;
      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isAndroid) {
        if (window.BenchJSInterface) {
          // 安卓获取用户信息
          window.BenchJSInterface.getApplicationRelevantInfo(
            "0",
            "javascript:window.getApplicationRelevantInfoFun(->path<-);"
          );
        }
      } else {
        var setUserObj = {
          methodName: "BotongApplicationCenterUserInfoJSHandler",
          params: {},
          callbackMethod: "BotongApplicationCenterUserInfoJSHandlerFun"
        };
        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterUserInfoJSHandler.postMessage(
            setUserObj
          );
        }
      }
      window.getApplicationRelevantInfoFun = function(val) {
        var userobj = JSON.parse(JSON.stringify(val));
        sessionStorage.setItem("logShareOrgId", userobj.orgId);
        sessionStorage.setItem("accessToken", userobj.AccessToken);
        sessionStorage.setItem("logShareMemberId", userobj.memberId);
        sessionStorage.setItem("logShareAppId", userobj.appId);
        sessionStorage.setItem("logShareUserId", userobj.userId);
        self.dataFun();
      };
      // iOS获取用户信息
      window.BotongApplicationCenterUserInfoJSHandlerFun = function(val) {
        var userobj = JSON.parse(JSON.stringify(val));
        sessionStorage.setItem("logShareOrgId", userobj.companyId); //企业
        sessionStorage.setItem("logShareMemberId", userobj.memberId); //成员
        sessionStorage.setItem("logShareAppId", userobj.appId);
        sessionStorage.setItem("logShareUserId", userobj.userId); //用户id
        sessionStorage.setItem("accessToken", userobj.accessToken);
        self.dataFun();
      };
    } else {
      self.isnullShow = false;
    }
  },
  watch: {
    texteCommentsVal(val) {
      if (val.length > 0) {
        this.islookinputbotbut = true;
        this.isTextlineHeight = "0.8533rem";
        this.isTextHeight = "2.8667rem";
        this.isTextButlineHeight = "4.5667rem";
      } else {
        this.islookinputbotbut = false;
        this.isTextlineHeight = "0.8533rem";
        this.isTextHeight = "0.8533rem";
        this.isTextButlineHeight = "0.8533rem";
      }
    }
  },
  filters: {
    strFun: function(val) {
      if (val) {
        return val;
      } else {
        return "无";
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
        return y + "-" + m + "-" + d + " " + h + ":" + f;
      } else {
        return "暂无";
      }
    },
    stateFun: function(val) {
      if (val == 1) {
        return "已读";
      } else {
        return "未读";
      }
    },
    readUsersFun(val) {
      if (val) {
        return val.length;
      } else {
        return 0;
      }
    },
    userNickFun: function(val) {
      if (val) {
        if (val.length > 2) {
          return val.slice(val.length - 2, val.length);
        } else {
          return val;
        }
      } else {
        return "无";
      }
    }
  }
};
</script>
<style scoped>
.codeNo {
  width: 100vw;
  text-align: center;
  height: 100vh;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.3733rem;
  background-color: #f1f1f1;
  margin: 0 auto;
}

.nullContent {
  height: 2.6133rem;
}

.nullImg {
  width: 2.24rem;
  height: 2.6133rem;
}

.nullText {
  height: 0.6667rem;
  width: 100%;
  height: 0.3733rem;
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.3733rem;
  text-align: center;
  margin-top: 0.6133rem;
}

.lookinputbotbutTExt {
  color: rgba(67, 144, 225, 1) !important;
}

.look-input-bot-but {
  width: 1.1733rem;
  text-align: left;
  font-size: 0.4267rem;
  color: rgba(195, 222, 250, 1);
  line-height: 0.8533rem;
}

.look-input-bot textarea {
  width: 7.3333rem;
  padding-left: 0.2133rem;
  border: 0;
  font-size: 0.4267rem;
  line-height: 0.48rem;
  resize: none;
  color: rgba(44, 44, 44, 1);
  background: rgba(241, 241, 241, 0);
  text-align: justify;
  word-wrap: break-word;
  text-justify: inter-ideograph;
}

.look-input-bot {
  width: 9.1467rem;
  background: rgba(241, 241, 241, 1);
  display: flex;
  margin: 0 auto;
  margin-top: 0.2933rem;
  justify-content: space-between;
  margin-bottom: 0.32rem;
  border-radius: 0.0533rem;
  overflow: hidden;
}

.look-input-top {
  height: 0.8967rem;
  width: 100vw;
  position: relative;
  overflow: hidden;
  background-color: #fff;
}
.imgList-main-oneName {
  width: 85%;
  margin: 0 auto;
  height: 0.6967rem;
  border: 1px solid #e3e3e3;
  font-size: 0.3733rem;
  color: rgba(44, 44, 44, 1);
  text-align: center;
  user-select: none;
  overflow: hidden;
}
.imgList-main-one {
  position: relative;
  top: 0;
  width: 33%;
  height: 0.6967rem;
  line-height: 0.6967rem;
  font-size: 0.4rem;
  text-align: center;
  font-size: 0.3733rem;
  color: rgba(44, 44, 44, 1);
  overflow: hidden;
}
.imgList-main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0.6967rem;
  margin-top: 0.1rem;
}

.look-input {
  z-index: 1000;
  position: fixed;
  bottom: 0;
  left: 0;
  min-height: 2.5333rem;
  margin-top: 0.6933rem;
  width: 100%;
  background-color: #fff;
  overflow: hidden;
}

.lc-l-r-b {
  min-height: 0.4533rem;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.6267rem;
  margin-top: 0.2667rem;
  width: 100%;
  text-align: justify;
  word-wrap: break-word;
  text-justify: inter-ideograph;
}

.lc-l-r-t-name {
  max-width: 4.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lc-l-r-t {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 0.3933rem;
  font-size: 0.3333rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.3933rem;
}

.lcommonts-LI-right {
  width: calc(100vw - 2.24rem);
  min-height: 1.12rem;
  display: flex;
  flex-wrap: wrap;
  margin-left: 0.32rem;
}

.lcommonts-LI-left div {
  position: absolute;
  top: 0;
  left: 0;
  width: 1.0667rem;
  height: 1.0667rem;
  overflow: hidden;
  border-radius: 50%;
  background-color: #4592e2;
  text-align: center;
  line-height: 1.1733rem;
  color: #fff;
  font-size: 0.3733rem;
}

.lcommonts-LI-left {
  position: relative;
  width: 1.0667rem;
  height: 1.0667rem;
  overflow: hidden;
  border-radius: 50%;
  margin-left: 0.4267rem;
}

.lcommonts-LI-left img {
  width: 100%;
  height: 100%;
}

.lcommontsNull-text {
  width: 100%;
  text-align: center;
  font-size: 0.3733rem;
  margin-top: 0.6133rem;
}

.lcommontsNull-img {
  height: 2.5067rem;
  width: 2.4rem;
  margin: 0 auto;
}

.lcommontsNull-LI {
  min-height: 1.12rem;
  display: flex;
  width: 100%;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 0.3733rem;
  overflow: hidden;
  color: #ccc;
}

.lcommonts-LI {
  min-height: 1.12rem;
  display: flex;
  margin-bottom: 0.3733rem;
  overflow: hidden;
}

.look-commonts-main {
  min-height: 1.12rem;
  width: 100%;
  overflow: hidden;
}

.look-commonts-title {
  height: 1.0133rem;
  width: calc(100% - 0.8533rem);
  margin-left: 0.4267rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.people-commonts-l {
  width: 0.7733rem;
  height: 0.3733rem;
  font-size: 0.3733rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.3733rem;
}

.look-commonts {
  background-color: #fff;
  /* min-height: 1.0133rem; */
  width: 100%;
  border-top: 1px solid #e3e3e3;
  margin-bottom: 2.8217rem;
  overflow: hidden;
}

.peoListsLi-t div {
  position: absolute;
  top: 0;
  left: 0;
  width: 1.0667rem;
  height: 1.0667rem;
  overflow: hidden;
  border-radius: 50%;
  background-color: #4592e2;
  text-align: center;
  line-height: 1.1733rem;
  color: #fff;
  font-size: 0.3733rem;
}

.peoListsLi-t {
  position: relative;
  width: 1.0667rem;
  height: 1.0667rem;
  overflow: hidden;
  border-radius: 50%;
}

.peoListsLi-t img {
  width: 100%;
  height: 100%;
}

.peoListsLi-b {
  height: 0.34rem;
  font-size: 0.3rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.34rem;
  width: 1.0667rem;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 0.2133rem;
}

.peoListsLi {
  height: 1.6rem;
  width: 1.0667rem;
  margin-right: 0.5067rem;
  margin-bottom: 0.2133rem;
}

.peoListsLi:nth-child(6n + 0) {
  margin-right: 0;
}

.look-people-list ul {
  display: flex;
  flex-wrap: wrap;
}

.people-title-l {
  width: 0.7733rem;
  height: 0.3733rem;
  font-size: 0.3733rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.3733rem;
}

.people-title-r {
  min-width: 0.64rem;
  height: 0.3733rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.3733rem;
}

.look-people-list {
  min-height: 1.6rem;
  width: calc(100% - 0.8533rem);
  margin-left: 0.4267rem;
  overflow: hidden;
}

.look-people-title {
  height: 1.0133rem;
  width: calc(100% - 0.8533rem);
  margin-left: 0.4267rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.look-people {
  background-color: #fff;
  min-height: 1.0133rem;
  width: 100%;
  border-top: 1px solid #e3e3e3;
}

.look-remark {
  /* margin-bottom: 10px; */
  overflow: hidden;
}

.look-textfileli-rt {
  max-width: 5.3333rem;
  height: 0.4267rem;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.4267rem;
  margin-top: 0.08rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.look-textfileli-rb {
  max-width: 5.3333rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 0.4267rem;
  font-size: 0.4267rem;
  color: rgba(192, 192, 192, 1);
  line-height: 0.4267rem;
  margin-top: 0.2133rem;
}

.look-text-file {
  margin-top: 0.16rem;
}

.look-text-file-li {
  display: flex;
  width: 100%;
  margin-bottom: 0.2133rem;
}

.look-textfileli-l {
  width: 1.28rem;
  height: 1.28rem;
}

.look-textfileli-r {
  margin-left: 0.32rem;
}

.look-text-img-li {
  width: 1.6533rem;
  height: 1.6533rem;
  margin-right: 0.2133rem;
  margin-bottom: 0.2133rem;
}

.look-text-img ul {
  display: flex;
  flex-wrap: wrap;
}

.look-text-img {
  margin-top: 0.16rem;
}

.look-text-top {
  width: 100%;
  height: 0.433rem;
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.4733rem;
}

.look-text-bot {
  margin-top: 0.16rem;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  text-align: justify;
  word-wrap: break-word;
  text-justify: inter-ideograph;
}
.look-text-bot pre {
  width: 100%;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.5757rem;
  white-space: pre-wrap; /*css-3*/
  white-space: -moz-pre-wrap; /*Mozilla,since1999*/
  white-space: -pre-wrap; /*Opera4-6*/
  white-space: -o-pre-wrap; /*Opera7*/
  word-wrap: break-word; /*InternetExplorer5.5+*/
}
.look-text:nth-child(1) {
  margin-top: 0;
}

.look-text {
  margin-left: 0.4267rem;
  width: calc(100% - 0.8533rem);
  /* border: 1px solid red; */
  margin-top: 0.2133rem;
  overflow: hidden;
}

.look-head-left div {
  position: absolute;
  top: 0;
  left: 0;
  width: 1.1733rem;
  height: 1.1733rem;
  overflow: hidden;
  border-radius: 50%;
  background-color: #4592e2;
  text-align: center;
  line-height: 1.1733rem;
  color: #fff;
  font-size: 0.3733rem;
}

.look-head-left {
  position: relative;
  width: 1.1733rem;
  height: 1.1733rem;
  overflow: hidden;
  border-radius: 50%;
  margin-left: 0.4267rem;
}

.look-head-left img {
  width: 100%;
  height: 100%;
}

.look-head-r-t {
  min-width: 1.3333rem;
  margin-top: 0.08rem;
  height: 0.4267rem;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.4267rem;
}

.look-head-r-b {
  min-width: 3.0933rem;
  height: 0.3733rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.3733rem;
  margin-top: 0.2133rem;
}

.look-head-right {
  margin-left: 0.32rem;
}

.look-head {
  height: 1.8133rem;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #fff;
}

.look-main {
  background-color: #fff;
  min-height: 5rem;
  width: 100%;
  padding-bottom: 0.2667rem;
  overflow: hidden;
}

.lookLog {
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: rgba(241, 241, 241, 1);
  /* display: flex;
  flex-direction: column; */
  /* flex-wrap: wrap; */
}

img {
  width: 100%;
  height: 100%;
}
</style>