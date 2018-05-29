// 日志未读
<template>
    <div class="unreadLog">
      <v-allLogList @onRefreshList="onRefreshListFun" v-show="listOrSearchSHow" @logListsIndex="logListsLookClick" :lists="listData"></v-allLogList>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { Toast } from "mint-ui";
import unresdLogLists from "../cModule/unresdLogLists";
export default {
  components: {
    "v-allLogList": unresdLogLists
  },
  data() {
    return {
      searchAllClickTrue: false,
      pageNoVal: 1,
      pageSizeVal: 20,
      listOrSearchSHow: true, // 切换列表和搜索
      listData: [], // 列表赋值表单
      logLists: [] // 日志列表
    };
  },
  computed: mapState(["VuexUnreadLogLists"]),
  mounted() {},
  methods: {
    // 发起筛选
    searchSelectClick() {
      this.listOrSearchSHow = false;
    },
    // 跳转页面
    logListsLookClick(val) {
      this.$router.push({
        path: "/lookLog?index=" + val
      });
    },
    // 下拉刷新后毁掉
    onRefreshListFun(val) {
      var self = this;

      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (val == 2) {
        if (isAndroid) {
          if (window.BenchJSInterface) {
            window.BenchJSInterface.setRightBtn(
              "全部已读",
              "javascript:window.pathFun();"
            );
            window.BenchJSInterface.setTopBarColor(1);
          }
        } else {
          var setNav = {
            methodName: "invokeNavigationRightItemFromJS",
            params: {
              naviType: 0,
              titles: [{ name: "全部已读", code: "shai", notEnable: 0 }]
            },
            callbackMethod: "pathFun"
          };
          if (window.webkit) {
            window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
              setNav
            );
          }
        }
      } else {
        if (isAndroid) {
          if (window.BenchJSInterface) {
            window.BenchJSInterface.setRightBtn("全部已读-1", "");
          }
          window.BenchJSInterface.setTopBarColor(1);
        } else {
          var setNav = {
            methodName: "invokeNavigationRightItemFromJS",
            params: {
              naviType: 0,
              titles: [{ name: "全部已读", code: "shai", notEnable: 1 }]
            }
          };
          if (window.webkit) {
            window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
              setNav
            );
          }
        }
      }
    },
    // 获取初始数据
    listsFun() {
      var self = this;
      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (self.VuexUnreadLogLists.length > 0) {
        self.logLists = self.VuexUnreadLogLists;
        self.listData = self.VuexUnreadLogLists;
        if (isAndroid) {
          window.BenchJSInterface.setRightBtn(
            "全部已读",
            "javascript:window.pathFun();"
          );
        } else {
          var setNav = {
            methodName: "invokeNavigationRightItemFromJS",
            params: {
              naviType: 0,
              titles: [{ name: "全部已读", code: "shai", notEnable: 0 }]
            },
            callbackMethod: "pathFun"
          };
          if (window.webkit) {
            window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
              setNav
            );
          }
        }
      } else {
        var listObj = {
          orgId: sessionStorage.getItem("logOrgId"),
          userId: sessionStorage.getItem("logMemberId"),
          readStatus: "0",
          pageNo: self.pageNoVal,
          pageSize: self.pageSizeVal
        };
        self.$store.commit("setMutVuexisLoading", true);
        self
          .getlogsearchreceivepage(JSON.stringify(listObj))
          .then(data => {
            self.$store.commit("setMutVuexisLoading", false);
            self.logLists = [];
            self.listData = [];
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  self.logLists = data.data.records;
                  self.listData = data.data.records;
                  if (isAndroid) {
                    window.BenchJSInterface.setRightBtn(
                      "全部已读",
                      "javascript:window.pathFun();"
                    );
                  } else {
                    var setNav = {
                      methodName: "invokeNavigationRightItemFromJS",
                      params: {
                        naviType: 0,
                        titles: [
                          { name: "全部已读", code: "shai", notEnable: 0 }
                        ]
                      },
                      callbackMethod: "pathFun"
                    };
                    if (window.webkit) {
                      window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                        setNav
                      );
                    }
                  }
                } else {
                  if (isAndroid) {
                    window.BenchJSInterface.setRightBtn("全部已读-1", "");
                  } else {
                    var setNav = {
                      methodName: "invokeNavigationRightItemFromJS",
                      params: {
                        naviType: 0,
                        titles: [
                          { name: "全部已读", code: "shai", notEnable: 1 }
                        ]
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
                if (isAndroid) {
                  window.BenchJSInterface.setRightBtn("全部已读-1", "");
                } else {
                  var setNav = {
                    methodName: "invokeNavigationRightItemFromJS",
                    params: {
                      naviType: 0,
                      titles: [{ name: "全部已读", code: "shai", notEnable: 1 }]
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
              if (isAndroid) {
                window.BenchJSInterface.setRightBtn("全部已读-1", "");
              } else {
                var setNav = {
                  methodName: "invokeNavigationRightItemFromJS",
                  params: {
                    naviType: 0,
                    titles: [{ name: "全部已读", code: "shai", notEnable: 1 }]
                  }
                };
                if (window.webkit) {
                  window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                    setNav
                  );
                }
              }
            }
          })
          .catch(msg => {
            self.logLists = [];
            self.listData = [];
            self.$store.commit("setMutVuexisLoading", false);
            if (isAndroid) {
              window.BenchJSInterface.setRightBtn("全部已读-1", "");
            } else {
              var setNav = {
                methodName: "invokeNavigationRightItemFromJS",
                params: {
                  naviType: 0,
                  titles: [{ name: "全部已读", code: "shai", notEnable: 1 }]
                }
              };
              if (window.webkit) {
                window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                  setNav
                );
              }
            }
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    ...mapActions(["getlogsearchreceivepage", "getlogsearchchangestatus"])
  },
  created: function() {
    var self = this;

    document.title = "未读";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      window.BenchJSInterface.setTitle("未读");
      window.BenchJSInterface.setTopBarColor(1);
    } else {
    }
    self.listsFun();
    window.pathFun = function() {
      if (self.searchAllClickTrue == false) {
        self.searchAllClickTrue = true;
        var statusObj = {
          orgId: sessionStorage.getItem("logOrgId"),
          userId: sessionStorage.getItem("logMemberId")
        };
        self
          .getlogsearchchangestatus(JSON.stringify(statusObj))
          .then(data => {
            self.searchAllClickTrue = false;
            if (data.statusCode == 200) {
              self.pageSizeVal = 1;
              self.$store.commit("MutVuexUnreadLogLists", []);
              self.listsFun();
              Toast({
                message: "全部标记为已读",
                position: "bottom"
              });
            } else {
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            self.searchAllClickTrue = false;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    };
  },
  watch: {},
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
  }
};
</script>
<style scoped>
.unreadLog {
  overflow: hidden;
  height: 100vh;
  user-select: none;
  width: 100%;
  background-color: rgba(241, 241, 241, 1);
}
</style>