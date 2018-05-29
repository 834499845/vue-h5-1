// 公告
<template>
  <div class="announcement">
    <!-- 普通用户 -->
    <div v-show="!isAdminShow">
      <v-unAdminAnnouncement :createdShow="isCreatedShow"></v-unAdminAnnouncement>
    </div>
    <!-- 管理员 -->
    <div v-show="isAdminShow">
      <v-AdminAnnouncement :createdShow="isCreatedShow"></v-AdminAnnouncement>
    </div>
  </div>
</template>
<script>
import AdminAnnouncement from "../cModule/AdminAnnouncement";
import unAdminAnnouncement from "../cModule/AdminUnAnnouncement";
import { mapActions } from "vuex";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      isCreatedShowUn: false,
      isCreatedShow: false, // 给组件提供更新需求
      spinnerLoadShow: false, // 加载中
      isAdminShow: false, //是否是管理员
      companyName: "" //企业名称
    };
  },
  components: {
    "v-unAdminAnnouncement": unAdminAnnouncement,
    "v-AdminAnnouncement": AdminAnnouncement
  },
  methods: {
    // 初始化数据
    listIosFun() {
      var self = this;
      var setNav = {};
      self.isCreatedShow = true;
      if (self.$store.state.VuexAdminAnnouncement) {
        self.isAdminShow = self.$store.state.VuexAdminAnnouncement;
        // 判断是否是管理
        if (self.isAdminShow == true) {
          setNav = {
            methodName: "invokeNavigationRightItemFromJS",
            params: {
              naviType: 0,
              titles: [{ name: "发公告", code: "shai", notEnable: 0 }]
            },
            callbackMethod: "pathFun"
          };
        } else {
          setNav = {
            methodName: "invokeNavigationRightItemFromJS",
            params: {
              titles: [{ name: "", code: "" }]
            }
          };
        }
        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
            setNav
          );
        }
      } else {
        self.$store.commit("setMutVuexisLoading", true);
        self
          .getnoticenoticeauthority({
            userId: sessionStorage.getItem("noticeMemberId")
          })
          .then(data => {
            self.$store.commit("setMutVuexisLoading", false);
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data == true) {
                  self.isAdminShow = true;
                } else {
                  self.isAdminShow = false;
                }
                self.$store.commit(
                  "setMutVuexAdminAnnouncement",
                  self.isAdminShow
                );
                // 判断是否是管理
                if (self.isAdminShow == true) {
                  setNav = {
                    methodName: "invokeNavigationRightItemFromJS",
                    params: {
                      naviType: 0,
                      titles: [{ name: "发公告", code: "shai", notEnable: 0 }]
                    },
                    callbackMethod: "pathFun"
                  };
                } else {
                  setNav = {
                    methodName: "invokeNavigationRightItemFromJS",
                    params: {
                      titles: [{ name: "", code: "" }]
                    }
                  };
                }
                if (window.webkit) {
                  window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                    setNav
                  );
                }
              }
            } else {
              // 判断是否是管理
              if (self.isAdminShow == true) {
                setNav = {
                  methodName: "invokeNavigationRightItemFromJS",
                  params: {
                    naviType: 0,
                    titles: [{ name: "发公告", code: "shai", notEnable: 0 }]
                  },
                  callbackMethod: "pathFun"
                };
              } else {
                setNav = {
                  methodName: "invokeNavigationRightItemFromJS",
                  params: {
                    titles: [{ name: "", code: "" }]
                  }
                };
              }
              if (window.webkit) {
                window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                  setNav
                );
              }
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            // 判断是否是管理
            if (self.isAdminShow == true) {
              setNav = {
                methodName: "invokeNavigationRightItemFromJS",
                params: {
                  naviType: 0,
                  titles: [{ name: "发公告", code: "shai" }]
                },
                callbackMethod: "pathFun"
              };
            } else {
              setNav = {
                methodName: "invokeNavigationRightItemFromJS",
                params: {
                  titles: [{ name: "", code: "" }]
                }
              };
            }
            window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
              setNav
            );
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    listAdFun() {
      var self = this;
      self.isCreatedShow = true;
      if (self.$store.state.VuexAdminAnnouncement) {
        self.isAdminShow = self.$store.state.VuexAdminAnnouncement;
        if (self.isAdminShow == true) {
          window.BenchJSInterface.setRightBtn(
            "发公告",
            "javascript:window.pathFun();"
          );
          window.BenchJSInterface.setTopBarColor(1);
          window.BenchJSInterface.setTitle("公告");
        } else {
          window.BenchJSInterface.setRightBtn("");
          window.BenchJSInterface.setTopBarColor(1);
          window.BenchJSInterface.setTitle("公告");
        }
      } else {
        self.$store.commit("setMutVuexisLoading", true);
        self
          .getnoticenoticeauthority({
            userId: sessionStorage.getItem("noticeMemberId")
          })
          .then(data => {
            self.$store.commit("setMutVuexisLoading", false);
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data == true) {
                  self.isAdminShow = true;
                } else {
                  self.isAdminShow = false;
                }
                self.$store.commit(
                  "setMutVuexAdminAnnouncement",
                  self.isAdminShow
                );
                if (self.isAdminShow == true) {
                  window.BenchJSInterface.setRightBtn(
                    "发公告",
                    "javascript:window.pathFun();"
                  );
                  window.BenchJSInterface.setTopBarColor(1);
                  window.BenchJSInterface.setTitle("公告");
                } else {
                  window.BenchJSInterface.setRightBtn("");
                  window.BenchJSInterface.setTopBarColor(1);
                  window.BenchJSInterface.setTitle("公告");
                }
              }
            } else {
              if (self.isAdminShow == true) {
                window.BenchJSInterface.setRightBtn(
                  "发公告",
                  "javascript:window.pathFun();"
                );
                window.BenchJSInterface.setTopBarColor(1);
                window.BenchJSInterface.setTitle("公告");
              } else {
                window.BenchJSInterface.setRightBtn("");
                window.BenchJSInterface.setTopBarColor(1);
                window.BenchJSInterface.setTitle("公告");
              }
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            self.$store.commit("setMutVuexisLoading", false);
            if (self.isAdminShow == true) {
              window.BenchJSInterface.setRightBtn(
                "发公告",
                "javascript:window.pathFun();"
              );
              window.BenchJSInterface.setTopBarColor(1);
              window.BenchJSInterface.setTitle("公告");
            } else {
              window.BenchJSInterface.setRightBtn("");
              window.BenchJSInterface.setTopBarColor(1);
              window.BenchJSInterface.setTitle("公告");
            }
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    ...mapActions([
      "getNoticeupdateNotice",
      "getNoticedeleteNotice",
      "getNoticeselectNoticePage",
      "getnoticenoticeauthority"
    ])
  },
  created: function() {},
  mounted() {
    var self = this;

    // sessionStorage.setItem("noticeCompanyName", "陕西运璟网络科技有限公司");
    // sessionStorage.setItem("noticeOrgId", "e8c2e5d578324972b6022eeb21d10524");
    // sessionStorage.setItem(
    //   "noticeMemberId",
    //   "a19d7b6e57c4451c8fff9371b5022772"
    // );
    // sessionStorage.setItem("noticeUserId", "bfe08568b2024819898f493721e8fa2f");
    // sessionStorage.setItem("noticephone", "13636898669");
    // sessionStorage.setItem(
    //   "accessToken",
    //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3NfdG9rZW4iOnRydWUsImlzX2FkbWluIjpmYWxzZSwiaXNzIjoiYm90b25nIiwidXNlcl9pZGVudGl0eSI6ImJmZTA4NTY4YjIwMjQ4MTk4OThmNDkzNzIxZThmYTJmIiwiZXhwIjoxNTI2NTcyODAwLCJpYXQiOjE1MjY0ODY0MDAsInVzZXIiOiJ7XCJhY2NvdW50TGlzdFwiOlt7XCJhY2NvdW50XCI6XCIxNzYwMjk1NTk3MFwiLFwiYWNjb3VudFR5cGVcIjoxLFwiaWRcIjpcImM1MjYzOWI1Zjk0NjRiZGE5NDhkMTc0NzFmMmViNTQ4XCIsXCJpc01haW5BY2NvdW50XCI6MSxcInBhc3Nwb3J0SWRcIjpcImJmZTA4NTY4YjIwMjQ4MTk4OThmNDkzNzIxZThmYTJmXCJ9XSxcImRpc3Rpbmd1aXNoV2ViTG9naW5cIjpcIm1vYmlsZVwiLFwiaWRcIjpcImJmZTA4NTY4YjIwMjQ4MTk4OThmNDkzNzIxZThmYTJmXCIsXCJwYXNzcG9ydFN0YXR1c1wiOjEsXCJzYWZlQ29kZUNvbmZpZ1wiOntcImVuYWJsZVwiOjB9LFwic2VjdXJpdHlPcGVuXCI6MSxcInNlY3VyaXR5VGFsa0NvbmZpZ1wiOntcImhpZGRlbkVuYWJsZVwiOjEsXCJsZXZlbFwiOjF9fSIsImp0aSI6IjQzNzk0NzExLTcwNjktNGMzOC05OWQzLTJiYWZhOTJmNTM5MCJ9.XuVAfUCP3fYhT8g-o44hmycj_bV22RENRXo6dHE1SmU"
    // );
    // self.listIosFun();

    sessionStorage.removeItem("noticeTitle");
    sessionStorage.removeItem("noticeAuthor");
    sessionStorage.removeItem("switchMsg");
    sessionStorage.removeItem("noticeDang");
    sessionStorage.removeItem("noticeDangState");
    sessionStorage.removeItem("noticeContent");
    sessionStorage.removeItem("noticeImgSrc");
    sessionStorage.removeItem("noticeUserInfo");
    sessionStorage.removeItem("noticeCover");
    sessionStorage.removeItem("noticeSendTo");

    document.title = "公告";
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
      sessionStorage.setItem("noticeUserId", userobj.userId);
      sessionStorage.setItem("noticeCompanyName", userobj.orgName);
      sessionStorage.setItem("noticeOrgId", userobj.orgId);
      sessionStorage.setItem("noticeMemberId", userobj.memberId);
      sessionStorage.setItem("noticeAppId", userobj.appId);
      sessionStorage.setItem("noticephone", userobj.userMobile);
      sessionStorage.setItem("accessToken", userobj.AccessToken);
      self.listAdFun();
    };
    // 获取用户信息
    window.BotongApplicationCenterUserInfoJSHandlerFun = function(val) {
      // iOS获取用户信息
      var userobj = JSON.parse(JSON.stringify(val));
      sessionStorage.setItem("noticeUserId", userobj.userId);
      sessionStorage.setItem("noticeCompanyName", userobj.compayName);
      sessionStorage.setItem("noticeOrgId", userobj.companyId);
      sessionStorage.setItem("noticeMemberId", userobj.memberId);
      sessionStorage.setItem("noticeAppId", userobj.appId);
      sessionStorage.setItem("noticephone", userobj.mobile);
      sessionStorage.setItem("accessToken", userobj.accessToken);
      self.listIosFun();
    };
    window.pathFun = function(val) {
      self.$router.push({
        path: "/writeFirstAnnouncement"
      });
    };
  },
  watch: {}
};
</script>
<style scoped>
.announcement {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>