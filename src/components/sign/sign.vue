<!--签到-->
<template>
    <div class="sign">
        <div @click="normalSignClick" class="normalSign">
            <div class="normalSignOneDiv" style="margin-top: 1.4133rem;">
                <div>
                    <img src="/static/img/日常签到.png" alt="">
                </div>
                <div>日常签到</div>
            </div>
            <div class="normalSignTwoDiv" style="margin-right: 2.6667rem;">用于公司办公室签到</div>
        </div>
        <div @click="outSignClick" class="outSign">
            <div class="normalSignOneDiv" style="margin-top: 1.4133rem;">
                <div>
                    <img src="/static/img/外出签到.png" alt="">
                </div>
                <div>外出签到</div>
            </div>
            <div class="normalSignTwoDiv" style="margin-right: 3.0933rem;">用于公事外出等</div>
        </div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      O: "",
      P: "",
      normalSignClickTrueOrFalse: false
    };
  },
  components: {},
  created: function() {
    var self = this;
    document.title = "签到";
    sessionStorage.removeItem("address");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("siteaddress");
    sessionStorage.removeItem("sitename");
    sessionStorage.removeItem("currentTime");
    sessionStorage.removeItem("currentCompany");
    sessionStorage.removeItem("path");
    sessionStorage.removeItem("OVal");
    sessionStorage.removeItem("PVal");
    sessionStorage.removeItem("normalSignO");
    sessionStorage.removeItem("normalSignP");

    // sessionStorage.setItem("singOrgId", "a7e7e48cab1c4ee385e1cc78ad4fb009");
    // sessionStorage.setItem("singOrgName", "陕西运璟网络科技有限公司");
    // sessionStorage.setItem("singMemberId", "c6d79786c2cd47b198d2c77703bdc087");
    // sessionStorage.setItem("singUserId", "69f21c5b78774fbdaa29e6c10ce62483");
    // sessionStorage.setItem("singUserName", "柠檬草的微");
    // sessionStorage.setItem("singUserPhone", "13636898669");
    // sessionStorage.setItem(
    //   "accessToken",
    //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3NfdG9rZW4iOnRydWUsImlzX2FkbWluIjpmYWxzZSwiaXNzIjoiYm90b25nIiwidXNlcl9pZGVudGl0eSI6IjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzIiwiZXhwIjoxNTI1Mjc2ODAwLCJpYXQiOjE1MjUxOTA0MDAsInVzZXIiOiJ7XCJhY2NvdW50TGlzdFwiOlt7XCJhY2NvdW50XCI6XCIxMzYzNjg5ODY2OVwiLFwiYWNjb3VudFR5cGVcIjoxLFwiaWRcIjpcIjI5MzE4ZGUwOTIzMzRjMjZiMWQ3ZDgxNmVjMDc0YWUyXCIsXCJpc01haW5BY2NvdW50XCI6MSxcInBhc3Nwb3J0SWRcIjpcIjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzXCJ9XSxcImRpc3Rpbmd1aXNoV2ViTG9naW5cIjpcIm1vYmlsZVwiLFwiaWRcIjpcIjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzXCIsXCJwYXNzcG9ydFN0YXR1c1wiOjF9IiwianRpIjoiMTc1NzVkMmMtNzgxYi00ZGNiLTg4MGYtMjg4YzNlODBkNjZmIn0.aNTzzQkFCrkiqP9e00SYBGQBx1eGxXdWV9QUubsqycM"
    // );
    // self.normalSignClickTrueOrFalse = true;

    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("签到");
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setRightTwoBut("", "");
        // 安卓获取用户信息
        window.BenchJSInterface.getApplicationRelevantInfo(
          "0",
          "javascript:window.getApplicationReleSignvantInfoFun(->path<-);"
        );
      }
    } else {
      var setNav = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          naviType: 0,
          titles: [{ name: "", code: "" }]
        }
      };
      var setUserObj = {
        methodName: "BotongApplicationCenterUserInfoJSHandler",
        params: {},
        callbackMethod: "BotongApplicationCenterUserInfoJSHandlerFun"
      };
      if (window.webkit) {
        window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
          setNav
        );
        window.webkit.messageHandlers.BotongApplicationCenterUserInfoJSHandler.postMessage(
          setUserObj
        );
      }
    }
    // Android 获取用户信息
    window.getApplicationReleSignvantInfoFun = function(val) {
      var userobj = JSON.parse(JSON.stringify(val));
      if (userobj) {
        sessionStorage.setItem("singOrgId", userobj.orgId);
        sessionStorage.setItem("singOrgName", userobj.orgName);
        sessionStorage.setItem("singMemberId", userobj.memberId);
        sessionStorage.setItem("singUserId", userobj.userId);
        sessionStorage.setItem("singUserName", userobj.realName);
        sessionStorage.setItem("singUserPhone", userobj.userMobile);
        sessionStorage.setItem("singUserImg", userobj.userImage);
        sessionStorage.setItem("accessToken", userobj.AccessToken);
        self.normalSignClickTrueOrFalse = true;
      } else {
        Toast({
          message: "暂未获取到用户信息",
          position: "bottom"
        });
        self.normalSignClickTrueOrFalse = false;
      }
    };
    // iOS获取用户信息
    window.BotongApplicationCenterUserInfoJSHandlerFun = function(val) {
      var userobj = JSON.parse(JSON.stringify(val));
      if (userobj) {
        sessionStorage.setItem("singOrgId", userobj.companyId);
        sessionStorage.setItem("singOrgName", userobj.compayName);
        sessionStorage.setItem("singMemberId", userobj.memberId);
        sessionStorage.setItem("singAppId", userobj.appId);
        sessionStorage.setItem("singUserId", userobj.userId);
        sessionStorage.setItem("singUserName", userobj.realName);
        sessionStorage.setItem("singUserImg", userobj.profile);
        sessionStorage.setItem("singUserPhone", userobj.mobile);
        sessionStorage.setItem("accessToken", userobj.accessToken);
        self.normalSignClickTrueOrFalse = true;
      } else {
        Toast({
          message: "暂未获取到用户信息",
          position: "bottom"
        });
        self.normalSignClickTrueOrFalse = false;
      }
    };
  },
  mounted: function() {},
  updated: function() {
    window.scrollTo(0, 0);
  },
  filters: {
    // 过滤时间
    timeFun: function(val) {
      if (val) {
        var standardTime = new Date(val);
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
    }
  },
  methods: {
    // 跳转到日常签到页面
    normalSignClick() {
      var self = this;
      if (self.normalSignClickTrueOrFalse == true) {
        self.normalSignClickTrueOrFalse = false;
        this.$router.push({
          path: "/normalSign"
        });
      }
    },
    // 跳转到外出签到页面
    outSignClick() {
      this.$router.push({
        path: "/outSign"
      });
    },
    ...mapActions([""])
  },
  watch: {}
};
</script>
<style scoped>
.sign {
  height: 100vh;
  width: 100%;
  background: rgba(247, 247, 247, 1);
  overflow: hidden;
  user-select: none;
}

.normalSign {
  margin: 0 auto;
  margin-top: 0.7467rem;
  background: rgba(102, 173, 247, 1);
  overflow: hidden;
  width: 9.1467rem;
  height: 4.0267rem;
  border-radius: 4px;
}
.outSign {
  background: rgba(195, 222, 250, 1);
  overflow: hidden;
  margin: 0 auto;
  margin-top: 0.32rem;
  overflow: hidden;
  width: 9.1467rem;
  height: 4.0267rem;
  border-radius: 4px;
}
.sign .normalSign div {
  color: rgba(255, 255, 255, 1);
}
.sign .outSign div {
  color: rgba(67, 144, 225, 1);
}
.normalSignOneDiv {
  margin-top: 1.4133rem;
  display: flex;
  justify-content: flex-start;
  width: 9.1467rem;
  margin-left: 2.73rem;
}

.normalSignOneDiv > div:nth-child(1) {
  min-width: 0.48rem;
  height: 0.48rem;
  margin-left: 0.5333rem;
  padding-top: 0.0267rem;
  display: flex;
  align-items: center;
}

.normalSignOneDiv > div:nth-child(1) img {
  width: 0.48rem;
  height: 0.48rem;
  margin-bottom: 0.0833rem;
}

.normalSignOneDiv > div:nth-child(2) {
  min-width: 2.1333rem;
  font-size: 0.5333rem;
  height: 0.48rem;
  line-height: 0.48rem;
  margin-bottom: 0.2667rem;
  margin-left: 0.16rem;
}

.normalSignTwoDiv:nth-child(1) {
  margin-left: 2.6667rem !important;
}

.normalSignTwoDiv {
  height: 0.4967rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  line-height: 0.4967rem;
  text-align: center;
  width: 9.1467rem;
}

.outSign > .outSignOneDiv {
  margin-top: 1.4133rem;
  margin-left: 3.2rem;
  display: flex;
}

.outSign > .outSignOneDiv > div:nth-child(1) {
  min-width: 0.48rem;
  min-height: 0.48rem;
  padding-top: 0.0267rem;
}

.outSignOneDiv > div:nth-child(1) img {
  width: 0.48rem;
  height: 0.48rem;
}

.outSign > .outSignOneDiv > div:nth-child(2) {
  min-width: 2.1333rem;
  height: 0.5333rem;
  font-size: 0.5333rem;
  font-family: PingFangSC-Medium;
  line-height: 0.5333rem;
  margin-bottom: 0.2667rem;
  margin-left: 0.16rem;
}

.outSign > .outSignTwoDiv {
  min-width: 2.9867rem;
  height: 0.4267rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  line-height: 0.4267rem;
  margin-left: 3.0933rem;
}
</style>