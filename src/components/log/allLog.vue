// 日志
<template>
    <div class="allLog">
        <div class="allLog-title">
            <div :class="{'allLog-title-left':true,'allLog-title-select':isAllLogTitleSelect == 1}" @click="navClick(1)">
                我收到的
            </div>
            <div :class="{'allLog-title-right':true,'allLog-title-select':isAllLogTitleSelect == 2}" @click="navClick(2)">
                我发出的
            </div>
        </div>
        <!--  v-show="logLeftLists.length > 0" -->
        <div class="allLog-search" v-show="sendpageShow && logLeftLists.length > 0">
            <div class="a-search-all" @click="searchAllClick(1)">
                全部已读
            </div>
            <div class="a-search-select" @click="searchSelectClick(2)">
                <div class="a-search-s-l">
                    筛选
                </div>
                <div :class="{'a-search-s-r':true,'searchSlectHide':listOrSearchSHow}">
                  <img src="/static/img/向上小箭头@3x.png" alt="">
                </div>
            </div>
        </div>

        <v-allLogList class="allLog-content" v-show="listOrSearchSHow && allLogContentShow" :searchObj='searchObjVal' :sleectIndex='sleectIndex'
            @logListsIndex="logListsLookClick" @searchonRefresh="searchonRefreshClick" :lists="listData"></v-allLogList>
        <v-allLogListMy class="allLog-contentMy" v-show="listOrSearchSHow && !allLogContentShow" :searchObj='searchObjVal' :sleectIndex='sleectIndex'
            @logListsIndex="logListsLookClick" :lists="listMyData"></v-allLogListMy>
        <v-allLogListSearch class="allLog-content" :listOrSearch="listOrSearchSHow" @search="searchAllLogsearchClick" v-show="!listOrSearchSHow"></v-allLogListSearch>
        
        <div class="spinnerLoad" v-show="spinnerLoadShow">
          <mt-spinner type="snake" color="#4390E1"></mt-spinner>
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapActions, mapState } from "vuex";
import allLogList from "../cModule/allLogList";
import allLogListMy from "../cModule/allLogListMy";
import allLogListSearch from "../cModule/allLogListSearch";
export default {
  components: {
    "v-allLogList": allLogList,
    "v-allLogListMy": allLogListMy,
    "v-allLogListSearch": allLogListSearch
  },

  data() {
    return {
      spinnerLoadShow: false, // 加载中
      allLogContentShow: true,
      searchObjVal: {}, // 搜索时需要传递参数
      sendpageShow: true, // 是否存在删选
      sleectIndex: 1, //当前选中收到还是发送
      searchAllClickTrue: false,
      pageNoVal: 1, // 我收到的页码
      pageMyNoVal: 1, // 我发出的页码
      pageSizeVal: 20,
      navClickTrue: false,
      listOrSearchSHow: true, // 切换列表和搜索
      listData: [], // 列表收到的赋值表单
      listMyData: [], // 列表我发出的的赋值表单
      logLeftLists: [], // 收到日志列表
      isAllLogTitleSelect: 1 // 导航选中
    };
  },
  computed: mapState(["VuexMyLogLists", "VuexLogLists"]),
  mounted() {
    var self = this;
    self.lisFun();
  },
  methods: {
    // 搜索后获取数据
    searChListFun() {
      var self = this;
      self.$store.commit("MutVuexMylogScrollTop", 0);
      self.$store.commit("MutVuexLogListsIndex", 9999);
      let position = 0; //返回页面取出来
      self.$el.querySelector(".yo-scroll").scrollTop = position * 1;
      self.pageNoVal = 1;
      var listObj = {
        orgId: sessionStorage.getItem("logOrgId"),
        userId: sessionStorage.getItem("logMemberId"),
        readStatus: "",
        pageNo: self.pageNoVal,
        pageSize: self.pageSizeVal
      };
      self.sendpageShow = true;
      self.logLeftLists = [];
      self.listData = [];
      self
        .getlogsearchreceivepage(JSON.stringify(listObj))
        .then(data => {
          self.$store.commit("setMutVuexisLoading", false);
          if (data.statusCode == 200) {
            if (data.data) {
              if (data.data.records) {
                self.logLeftLists = data.data.records;
                self.listData = data.data.records;
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
    },
    // 全部已读
    searchAllClick() {
      var self = this;
      if (self.searchAllClickTrue == false) {
        self.searchAllClickTrue = true;
        var statusObj = {
          orgId: sessionStorage.getItem("logOrgId"),
          userId: sessionStorage.getItem("logMemberId")
        };
        self.$store.commit("setMutVuexisLoading", true);
        self
          .getlogsearchchangestatus(JSON.stringify(statusObj))
          .then(data => {
            self.searchAllClickTrue = false;

            if (data.statusCode == 200) {
              Toast({
                message: "全部标记为已读",
                position: "bottom"
              });

              self.searChListFun();
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
            self.searchAllClickTrue = false;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    // 收到/发出
    navClick(index) {
      var self = this;
      self.$store.commit("MutVuexMylogScrollTop", 0);
      self.$store.commit("MutVuexLogListsIndex", 9999);
      sessionStorage.removeItem("searchObjVal");
      self.searchObjVal = {};
      self.listOrSearchSHow = true;
      self.isAllLogTitleSelect = index;
      self.sleectIndex = index;
      if (self.navClickTrue == false) {
        self.navClickTrue = true;
        if (index == 1) {
          sessionStorage.setItem("navClickIndex", 1);
          self.allLogContentShow = true;
          self.sendpageShow = true;
          self.pageNoVal = 1;
          var listObj = {
            orgId: sessionStorage.getItem("logOrgId"),
            userId: sessionStorage.getItem("logMemberId"),
            readStatus: "",
            pageNo: self.pageNoVal,
            pageSize: self.pageSizeVal
          };
          self.spinnerLoadShow = true;
          self
            .getlogsearchreceivepage(JSON.stringify(listObj))
            .then(data => {
              self.spinnerLoadShow = false;
              self.navClickTrue = false;
              self.listData = [];
              self.logLeftLists = [];
              if (data.statusCode == 200) {
                if (data.data) {
                  if (data.data.records) {
                    self.listData = data.data.records;
                    self.logLeftLists = data.data.records;
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
              self.listData = [];
              self.logLeftLists = [];
              self.spinnerLoadShow = false;
              self.navClickTrue = false;
              Toast({
                message: "服务器异常",
                position: "bottom"
              });
            });
        } else {
          sessionStorage.setItem("navClickIndex", 2);
          self.allLogContentShow = false;
          self.sendpageShow = false;

          self.pageMyNoVal = 1;
          var listObj = {
            orgId: sessionStorage.getItem("logOrgId"),
            userId: sessionStorage.getItem("logMemberId"),
            pageNo: self.pageMyNoVal,
            pageSize: self.pageSizeVal
          };
          self.spinnerLoadShow = true;
          self
            .getlogsearchsendpage(JSON.stringify(listObj))
            .then(data => {
              self.navClickTrue = false;
              self.spinnerLoadShow = false;
              self.listMyData = [];
              if (data.statusCode == 200) {
                if (data.data) {
                  if (data.data.records) {
                    self.listMyData = data.data.records;
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
              self.listMyData = [];
              self.spinnerLoadShow = false;
              self.navClickTrue = false;
              Toast({
                message: "服务器异常",
                position: "bottom"
              });
            });
        }
      }
    },
    // 发起筛选
    searchSelectClick() {
      this.listOrSearchSHow = !this.listOrSearchSHow;
    },
    // 搜索无数据后，下拉刷新数据更新
    searchonRefreshClick(val) {
      this.sendpageShow = true;
      this.logLeftLists = val;
    },
    // 筛选结果
    searchAllLogsearchClick(val) {
      var self = this;
      this.listOrSearchSHow = true;
      var sendUserIdArr = [];
      var listStrObj = val;
      if (listStrObj.arr) {
        listStrObj.arr.forEach(function(ele, ind) {
          sendUserIdArr.push(ele.memberId);
        });
      }
      self.searchObjVal = listStrObj;
      sessionStorage.setItem("searchObjVal", JSON.stringify(self.searchObjVal));
      self.listData = [];
      self.logLeftLists = [];
      var listObj = {};
      self.pageNoVal = 1;
      if (sendUserIdArr.length > 0) {
        listObj = {
          orgId: sessionStorage.getItem("logOrgId"),
          userId: sessionStorage.getItem("logMemberId"),
          readStatus: listStrObj.readStatus,
          sendUserIds: sendUserIdArr,
          pageNo: self.pageNoVal,
          pageSize: self.pageSizeVal
        };
      } else {
        listObj = {
          orgId: sessionStorage.getItem("logOrgId"),
          userId: sessionStorage.getItem("logMemberId"),
          readStatus: listStrObj.readStatus,
          pageNo: self.pageNoVal,
          pageSize: self.pageSizeVal
        };
      }
      self.$store.commit("MutVuexMylogScrollTop", 0);
      self.$store.commit("MutVuexLogListsIndex", 9999);
      let position = 0;
      self.$el.querySelector(".yo-scroll").scrollTop = position * 1;
      self
        .getlogsearchreceivepage(JSON.stringify(listObj))
        .then(data => {
          self.navClickTrue = false;
          if (data.statusCode == 200) {
            if (data.data) {
              if (data.data.records) {
                self.listData = data.data.records;
                self.logLeftLists = data.data.records;
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
          self.navClickTrue = false;
          Toast({
            message: "服务器异常",
            position: "bottom"
          });
        });
    },
    // 跳转页面
    logListsLookClick(val) {
      var self = this;
      this.$router.push({
        path: "/lookLog?index=" + val
      });
    },
    // 获取初始数据
    lisFun() {
      var self = this;
      if (sessionStorage.getItem("sendLogIndex")) {
        sessionStorage.removeItem("sendLogIndex");
        sessionStorage.setItem("navClickIndex", 2);
        self.searchObjVal = {};
        self.listOrSearchSHow = true;
        self.isAllLogTitleSelect = 2;
        self.sleectIndex = 2;
        self.allLogContentShow = false;
        self.sendpageShow = false;
        self.listMyData = [];
        var listObj = {
          orgId: sessionStorage.getItem("logOrgId"),
          userId: sessionStorage.getItem("logMemberId"),
          pageNo: self.pageMyNoVal,
          pageSize: self.pageSizeVal
        };
        self.$store.commit("setMutVuexisLoading", true);
        self
          .getlogsearchsendpage(JSON.stringify(listObj))
          .then(data => {
            self.$store.commit("setMutVuexisLoading", false);
            self.navClickTrue = false;
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  self.listMyData = data.data.records;
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
            self.navClickTrue = false;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      } else {
        if (sessionStorage.getItem("navClickIndex") == 1) {
          self.isAllLogTitleSelect = 1;
          self.sleectIndex = 1;
          self.listData = [];
          self.allLogContentShow = true;
          self.sendpageShow = true;
          self.pageNoVal = 1;
          if (self.VuexLogLists.length > 0) {
            self.logLeftLists = self.VuexLogLists;
            self.listData = self.VuexLogLists;
          } else {
            var listObj = {
              orgId: sessionStorage.getItem("logOrgId"),
              userId: sessionStorage.getItem("logMemberId"),
              readStatus: "",
              pageNo: self.pageNoVal,
              pageSize: self.pageSizeVal
            };
            self.$store.commit("setMutVuexisLoading", true);
            self.logLeftLists = [];
            self
              .getlogsearchreceivepage(JSON.stringify(listObj))
              .then(data => {
                self.$store.commit("setMutVuexisLoading", false);
                if (data.statusCode == 200) {
                  if (data.data) {
                    if (data.data.records) {
                      self.logLeftLists = data.data.records;
                      self.listData = data.data.records;
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
          }
        } else {
          self.searchObjVal = {};
          self.listOrSearchSHow = true;
          self.isAllLogTitleSelect = 2;
          self.sleectIndex = 2;
          self.allLogContentShow = false;
          self.sendpageShow = false;
          self.listMyData = [];
          sessionStorage.removeItem("logListsIndexObj");

          if (self.VuexMyLogLists.length > 0) {
            var logAllListArr = self.VuexMyLogLists;
            self.listMyData = logAllListArr;
          } else {
            self.$store.commit("setMutVuexisLoading", true);
            var listObj = {
              orgId: sessionStorage.getItem("logOrgId"),
              userId: sessionStorage.getItem("logMemberId"),
              pageNo: self.pageMyNoVal,
              pageSize: self.pageSizeVal
            };
            self
              .getlogsearchsendpage(JSON.stringify(listObj))
              .then(data => {
                self.$store.commit("setMutVuexisLoading", false);
                self.navClickTrue = false;
                if (data.statusCode == 200) {
                  if (data.data) {
                    if (data.data.records) {
                      self.listMyData = data.data.records;
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
                self.navClickTrue = false;
                Toast({
                  message: "服务器异常",
                  position: "bottom"
                });
              });
          }
        }
      }
    },
    ...mapActions([
      "getlogsearchsendpage",
      "getlogsearchreceivepage",
      "getlogsearchchangestatus"
    ])
  },
  created: function() {
    var self = this;
    document.title = "所有";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setTitle("所有");
        window.BenchJSInterface.setTopBarColor(1);
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
.a-search-s-l {
  font-size: 0.3733rem;
  color: rgba(44, 44, 44, 1);
  margin-right: 0.08rem;
  height: 0.7467rem;
  line-height: 0.8167rem;
}

.searchSlectHide {
  transform: rotate(180deg);
  background-position: 0px 4px !important;
}

.a-search-s-r {
  width: 0.3733rem;
  margin-left: 0.0533rem;
}
.a-search-s-r img {
  width: 100%;
  height: 100%;
}
.a-search-all {
  width: 2.0533rem;
  height: 0.7467rem;
  text-align: center;
  line-height: 0.8067rem;
  background: rgba(255, 255, 255, 1);
  font-size: 0.3733rem;
  color: rgba(44, 44, 44, 1);
  border: 1px solid #e3e3e3;
}

.a-search-select {
  width: 2.0533rem;
  border: 1px solid #e3e3e3;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 0.7467rem;
  background: rgba(255, 255, 255, 1);
}
.spinnerLoad {
  width: 100vw;
  height: calc(100vh - 1.2867rem);
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 1.2867rem;
  left: 0;
  background: rgba(255, 255, 255, 1);
  z-index: 100000000000000000;
}
.allLog-content {
  position: absolute;
  top: 2.4867rem;
  left: 0;
  width: 100%;
}

.allLog-contentMy {
  position: absolute;
  top: 1.3867rem;
  left: 0;
  width: 100%;
}

.allLog-search {
  position: absolute;
  top: 1.2rem;
  left: 0;
  height: 1.0667rem;
  background-color: #fff;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.allLog-title-select {
  color: rgba(67, 144, 225, 1) !important;
  position: relative;
}

.allLog-title-select::after {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 0.0533rem;
  left: 0rem;
  content: "";
  background-color: #4390e1;
}

.allLog-title-left,
.allLog-title-right {
  position: relative;
  width: 50%;
  text-align: center;
  height: 1.2rem;
  line-height: 1.2rem;
  font-size: 0.3733rem;
  color: rgba(44, 44, 44, 1);
}

.allLog-title {
  height: 1.2rem;
  background-color: #fff;
  width: 100%;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: space-around;
  border-bottom: 1px solid #e3e3e3;
}

.allLog {
  position: relative;
  overflow: hidden;
  height: 100vh;
  width: 100%;
  background-color: rgba(241, 241, 241, 1);
  user-select: none;
}
</style>