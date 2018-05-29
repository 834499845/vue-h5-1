// 公告
<template>
  <div class="customerService">
    <div class="customerTop">
      <div :class="{'customerTopleft':true,'customerTopselect':isAllLogTitleSelect == 1}" @click="navClick(1)">
        问题反馈
      </div>
      <div :class="{'customerTopright':true,'customerTopselect':isAllLogTitleSelect == 2}" @click="navClick(2)">
        意见建议
      </div>
    </div>
    <div class="customerMain">
      <!-- 问题反馈 -->
      <div v-show="isAllLogTitleSelect == 1">
        <v-customerServiceIssue @issueListbutIsClick="issueListbutIsFun" :createdShow="isCreatedShow"></v-customerServiceIssue>
      </div>
      <!-- 意见反馈 -->
      <div v-show="isAllLogTitleSelect == 2">
        <v-customerServiceIssueOpinion @issueListbutOpClick="issueListbutIsFun" :createdShow="isCreatedShow"></v-customerServiceIssueOpinion>
      </div>
    </div>
    <div class="goTost" v-show="isGoTostShow">
      <div>
        <img src="static/img/Group@Go3x.png" alt="">
      </div>
      <div>
        提交成功
      </div>
      <div>
        我们会尽快给您答复
      </div>
      <div>
        <div @click="goListClick">
          查看记录
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import customerServiceIssue from "../cModule/customerServiceIssue";
import customerServiceIssueOpinion from "../cModule/customerServiceIssueOpinion";
import { mapActions } from "vuex";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      isGoTostShow: false,
      isAllLogTitleSelect: 1,
      isCreatedShowUn: false,
      isCreatedShow: false, // 给组件提供更新需求
      spinnerLoadShow: false, // 加载中
      isAdminShow: false //是否是管理员
    };
  },
  components: {
    "v-customerServiceIssueOpinion": customerServiceIssueOpinion,
    "v-customerServiceIssue": customerServiceIssue
  },
  methods: {
    navClick(index) {
      this.isAllLogTitleSelect = index;
    },
    // 初始化数据
    listFun() {
      var self = this;
      self.isCreatedShow = true;
      document.title = "意见反馈";
      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isAndroid) {
        if (window.BenchJSInterface) {
          window.BenchJSInterface.setRightBtn(
            "反馈记录",
            "javascript:window.pathFun();"
          );
          window.BenchJSInterface.setTitle("意见反馈");
          window.BenchJSInterface.setTopBarColor(1);
        }
      } else {
        var setNav = {
          methodName: "invokeNavigationRightItemFromJS",
          params: {
            titles: [{ name: "反馈记录", code: "shai" }]
          },
          callbackMethod: "pathFun"
        };
        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
            setNav
          );
        }
      }

      window.pathFun = function(val) {
        self.$router.push({
          path: "/customerServiceList"
        });
      };
    },
    // 查看记录
    goListClick() {
      var self = this;
      self.$router.push({
        path: "/customerServiceList"
      });
    },
    // 问题反馈
    issueListbutIsFun() {
      this.isGoTostShow = true;
    },
    ...mapActions([])
  },
  created: function() {},
  mounted() {
    var self = this;

    // sessionStorage.setItem(
    //   "customerServiceOrgId",
    //   "a7e7e48cab1c4ee385e1cc78ad4fb009"
    // );
    // sessionStorage.setItem(
    //   "customerServiceMemberId",
    //   "c6d79786c2cd47b198d2c77703bdc087"
    // );
    // sessionStorage.setItem("customerServicephone", "13636898669");
    // sessionStorage.setItem(
    //   "customerServiceUserId",
    //   "69f21c5b78774fbdaa29e6c10ce62483"
    // );
    // sessionStorage.setItem("customerServicerealName", "名字");
    // sessionStorage.setItem("customerServiceprofile", "头像");
    // sessionStorage.setItem(
    //   "accessToken",
    //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3NfdG9rZW4iOnRydWUsImlzX2FkbWluIjpmYWxzZSwiaXNzIjoiYm90b25nIiwidXNlcl9pZGVudGl0eSI6IjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzIiwiZXhwIjoxNTI2OTE4NDAwLCJpYXQiOjE1MjY4MzIwMDAsInVzZXIiOiJ7XCJhY2NvdW50TGlzdFwiOlt7XCJhY2NvdW50XCI6XCIxMzYzNjg5ODY2OVwiLFwiYWNjb3VudFR5cGVcIjoxLFwiaWRcIjpcIjI5MzE4ZGUwOTIzMzRjMjZiMWQ3ZDgxNmVjMDc0YWUyXCIsXCJpc01haW5BY2NvdW50XCI6MSxcInBhc3Nwb3J0SWRcIjpcIjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzXCJ9XSxcImRpc3Rpbmd1aXNoV2ViTG9naW5cIjpcIm1vYmlsZVwiLFwiaWRcIjpcIjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzXCIsXCJwYXNzcG9ydFN0YXR1c1wiOjAsXCJzYWZlQ29kZUNvbmZpZ1wiOntcImVuYWJsZVwiOjB9LFwic2VjdXJpdHlPcGVuXCI6MSxcInNlY3VyaXR5VGFsa0NvbmZpZ1wiOntcImhpZGRlbkVuYWJsZVwiOjEsXCJsZXZlbFwiOjF9fSIsImp0aSI6ImExMjZiNTAzLWY4ZTYtNGJlNS1hMmNjLTdlN2E3MjU3ZDRhYSJ9.lldOZxKhIB1tt2XXiICpTmPJ7t_3wKMxB7dXq_4J_Ok"
    // );
    // self.listFun();

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
      sessionStorage.setItem("customerServiceUserId", userobj.userId);
      sessionStorage.setItem("customerServiceCompanyName", userobj.orgName);
      sessionStorage.setItem("customerServiceOrgId", userobj.orgId);
      sessionStorage.setItem("customerServiceMemberId", userobj.memberId);
      sessionStorage.setItem("customerServiceAppId", userobj.appId);
      sessionStorage.setItem("customerServicephone", userobj.userMobile);
      sessionStorage.setItem("accessToken", userobj.AccessToken);
      sessionStorage.setItem("customerServicerealName", userobj.realName);
      if (userobj.userImage) {
        sessionStorage.setItem("customerServiceprofile", userobj.userImage);
      }
      self.listFun();
    };
    // 获取用户信息
    window.BotongApplicationCenterUserInfoJSHandlerFun = function(val) {
      // iOS获取用户信息
      var userobj = JSON.parse(JSON.stringify(val));
      sessionStorage.setItem("customerServiceUserId", userobj.userId);
      sessionStorage.setItem("customerServiceCompanyName", userobj.compayName);
      sessionStorage.setItem("customerServiceOrgId", userobj.companyId);
      sessionStorage.setItem("customerServiceMemberId", userobj.memberId);
      sessionStorage.setItem("customerServiceAppId", userobj.appId);
      sessionStorage.setItem("customerServicephone", userobj.mobile);
      sessionStorage.setItem("customerServicerealName", userobj.realName);
      if (userobj.profile) {
        sessionStorage.setItem("customerServiceprofile", userobj.profile);
      }
      sessionStorage.setItem("accessToken", userobj.accessToken);
      self.listFun();
    };
  },
  watch: {}
};
</script>
<style scoped>
.customerMain {
  width: 100vw;
  height: calc(100vh - 1.0667rem);
  position: absolute;
  top: 1.0667rem;
  left: 0;
  width: 100vw;
  overflow-y: scroll;
  overflow-x: hidden;
}

.customerTopselect {
  color: rgba(67, 144, 225, 1) !important;
  position: relative;
}

.customerTopselect::after {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 0.0533rem;
  left: 0rem;
  content: "";
  background-color: #4390e1;
}

.customerTopleft,
.customerTopright {
  position: relative;
  width: 50%;
  text-align: center;
  height: 1.0667rem;
  line-height: 1.0667rem;
  font-size: 0.3733rem;
  color: rgba(44, 44, 44, 1);
}

.customerTop {
  height: 1.0667rem;
  background-color: #fff;
  width: 100%;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: space-around;
  border-bottom: 1px solid #e3e3e3;
}

.customerService {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
}

.goTost > div:nth-child(4) div {
  width: 3.7333rem;
  height: 0.96rem;
  background: rgba(67, 144, 225, 1);
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  line-height: 0.96rem;
  text-align: center;
}
.goTost > div:nth-child(4) {
  width: 100vw;
  display: flex;
  justify-content: center;
  margin-top: 0.64rem;
}
.goTost > div:nth-child(3) {
  width: 100vw;
  text-align: center;
  overflow: hidden;
  height: 0.5333rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.5333rem;
  margin-top: 0.32rem;
}
.goTost > div:nth-child(2) {
  width: 100vw;
  text-align: center;
  height: 0.6667rem;
  font-size: 0.48rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.6667rem;
  margin-top: 0.48rem;
  overflow: hidden;
}
.goTost > div:nth-child(1) {
  height: 1.92rem;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2.3467rem;
}
.goTost > div:nth-child(1) img {
  width: 1.92rem;
  height: 1.92rem;
}
.goTost {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  z-index: 10000000000000000000000000;
  overflow: hidden;
}
</style>