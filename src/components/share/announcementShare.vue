// 公告详情
<template>
    <div class="announcementDetails">
      <div class="detailsDiv">
          <div class="detailsTitle">
            <span class="detailsTitleSpan">
                {{details.title}}
            </span>
          </div>
          <div class="detailsName">
              <span class="detailsUname">{{details.author}}</span>
              <span class="detailsTime">{{parseInt(details.createTime)|timeFun}}</span>
          </div>
          <div class="detailsImg" v-show="details.cover">
              <img :src="details.cover" class="detailsImage" alt="">
          </div>
          <!-- <div class="detailsContent" v-html="details.content"></div> -->
          <div v-show="stateShow" class="detailsContent" v-html="details.content"></div>
          <div v-show="!stateShow" class="detailsContent">
            <pre>{{details.content}}</pre>
          </div>
          <div class="unRead">
              <span class="unReadSpan">未读：</span>
              <span class="unReadHuman">{{details.notReadNumber}}人</span>
          </div>
      </div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      stateShow: true,
      noticeId: "1",
      isShareUnreadShow: false,
      details: {
        title: "", //标题
        author: "", //作者
        createTime: "", //创建日期
        cover: "", //封面图
        readNumber: 0, //已读人数
        notReadNumber: 0, //未读人数
        content: "", //内容
        picture: "", //图片地址
        pictureName: "", //图片名称
        issueUserName: "", //发布人名称
        noticeH5Address: "", //H5分享地址
        secrecyState: 1 //保密状态 0为保密 1为不保密
      }
    };
  },
  components: {},
  methods: {
    listFun() {
      var self = this;
      self.details = {};
      self
        .getNoticeselectNoticeDetail({
          userId: sessionStorage.getItem("announcementShareMemberId"),
          id: self.$route.query.id
        })
        .then(data => {
          if (data.statusCode == 200) {
            if (data.data) {
              self.details = data.data;
              var reg = /<[^>]+>/g;
              if (reg.test(self.details.content)) {
                self.stateShow = true;
              } else {
                self.stateShow = false;
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
          Toast({
            message: "服务器异常",
            position: "bottom"
          });
        });
    },
    //查看未读人数
    checkUnreadClick() {
      this.$router.push({
        path: "/acceptannouncement",
        query: {
          noticeId: this.noticeId
        }
      });
    },
    ...mapActions(["getNoticeselectNoticeDetail"])
  },
  created: function() {
    var self = this;

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
      sessionStorage.setItem("accessToken", userobj.AccessToken);
      sessionStorage.setItem("announcementShareMemberId", userobj.memberId);
      self.listFun();
    };
    // iOS获取用户信息
    window.BotongApplicationCenterUserInfoJSHandlerFun = function(val) {
      var userobj = JSON.parse(JSON.stringify(val));
      sessionStorage.setItem("announcementShareMemberId", userobj.memberId);
      sessionStorage.setItem("accessToken", userobj.accessToken);
      self.listFun();
    };

    document.title = "公告详情";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setTitle("公告详情");
      }
    } else {
      var setNav = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          naviType: 0,
          titles: [{ name: "", img: "share", code: "shai" }]
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
        return y + "." + m + "." + d;
      } else {
        return "暂无";
      }
    }
  }
};
</script>
<style scoped>
.announcementDetails {
  height: 100vh;
  width: 100%;
}
.detailsDiv {
  padding: 0.4267rem;
}
.detailsTitle {
  width: 100%;
}
.detailsTitleSpan {
  font-size: 0.5333rem;
  font-family: PingFangSC-Medium;
  color: rgba(44, 44, 44, 1);
  font-weight: bold;
  width: calc(100vw - 0.8533rem - 2.9333rem);
  height: 1.28rem;
  color: rgba(44, 44, 44, 1);
  word-break: break-all;
  overflow: hidden;
}
.detailsUname {
  width: 100%;
  height: 1.1467rem;
}
.detailsUname,
.detailsTime {
  line-height: 1.1467rem;
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
}
.detailsTime {
  margin-left: 0.32rem;
}
.detailsImg {
  width: 100%;
  /* height: 4.56rem; */
}
.detailsImage {
  width: 100%;
  /* height: 4.56rem; */
  /* width: auto; */
  height: 100%;
  /* max-width: 100%; */
  /* max-height: 100%; */
}

.detailsContent {
  width: 100%;
  margin-top: 0.2133rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
}
.detailsContent pre {
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

.detailsContent > p {
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
}
.detailsContentSpan {
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
}
.unRead {
  margin-top: 0.4533rem;
  color: #4390e1;
  font-size: 0.3733rem;
}
.unReadHuman {
  cursor: pointer;
}
</style>