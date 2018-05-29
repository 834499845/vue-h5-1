<!--我发起的-->
<template>
  <div>
    <div class="nightExamine" v-show='startedList.length > 0'>
      <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">
        <ul class="nightExamineUl">
          <li v-for="(item,index) in startedList" :key="index" class="nightExamineLi" @click="nightExamineClick(index)">
            <div class="nightExamineImg">
              <img v-lazy="item.logo" alt="">
            </div>
            <div class="nightExamineFont">
              <p class="nightExamineFontTop">
                {{item.title}}
              </p>
              <p class="nightExamineFontFoot">
                <span class="fontGray" :class="{fontRed:item.result == '2'}">
                  {{item.message}}
                </span>
              </p>
            </div>
            <div class="nightExamineTime">
              {{item.createTime | timeFun}}
            </div>
          </li>
        </ul>
      </v-scroll>
    </div>
    <div class="nullLI" v-show="startedList.length == 0">
      <div class="nullContent"></div>
      <img class="nullImg" src="/static/img/iconfont_default_list@3x.png" alt="">
      <div class="nullText">暂无审批</div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import scroll from "../cModule/startedScroll";
import { Toast } from "mint-ui";
export default {
  components: { "v-scroll": scroll },
  data() {
    return {
      startedList: [],
      state: "", //审批状态 0:审批中 1:审批完成 2:已撤回
      modelId: "", //	审批类型（即：模型主键）
      time: "", //审批时间
      pageNoVal: 1, //当前页码
      pageSizeVal: 20, //每页条数
      loadingText: "",
      onRefreshTrue: false,
      onInfiniteTrue: false
    };
  },
  updated: function() {
    this.$nextTick(function() {
      let position = this.$store.state.VuexStartedListsTop || 0; //返回页面取出来
      this.$el.querySelector(".yo-scroll").scrollTop = position * 1;
    });
  },
  created: function() {
    document.title = "我发起的";
  },
  mounted() {
    var self = this;
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("我发起的");
      }
    }
    if (sessionStorage.getItem("getstartedListShow")) {
      //由首页点击进来
      if (sessionStorage.getItem("getstartedListShow") == "true") {
        sessionStorage.removeItem("getstartedListShow");
        self.pageNoVal = 1;
        self.$store.commit("setMutVuexisLoading", true);
        self.listsFun();
      }
    } else if (sessionStorage.getItem("sponsor")) {
      if (sessionStorage.getItem("isDetailsExamineLook") == 1) {
        sessionStorage.removeItem("isDetailsExamineLook");
        // 筛选存在的情况-从详情页返回
        self.state = "";
        self.modelId = "";
        self.time = "";
        if (self.$store.state.VuexStartedLists.length > 0) {
          self.pageNoVal = self.$store.state.VuexStartedIndex;
          self.startedList = self.$store.state.VuexStartedLists;
          if (isAndroid) {
            if (window.BenchJSInterface) {
              window.BenchJSInterface.setTopBarColor(1);
              window.BenchJSInterface.setRightBtn(
                "筛选",
                "javascript:window.pathFun();"
              );
              window.BenchJSInterface.setRightImageType(10, "");
            }
          } else {
            var setNav = {
              methodName: "invokeNavigationRightItemFromJS",
              params: {
                naviType: 0,
                titles: [
                  {
                    name: "筛选",
                    code: "shai",
                    image: "",
                    notEnable: 0
                  }
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
          window.pathFun = function(val) {
            self.$router.push({
              path: "/sponsorScreen"
            });
          };
        } else {
          self.pageNoVal = 1;
          self.$store.commit("setMutVuexisLoading", true);
          self
            .getapprovalLaunchedApproval({
              companyId: sessionStorage.getItem("companyId"),
              memberId: sessionStorage.getItem("memberId"),
              state: self.state,
              modelId: self.modelId,
              time: self.time,
              currentPage: self.pageNoVal,
              pageSize: self.pageSizeVal
            })
            .then(data => {
              self.$store.commit("setMutVuexisLoading", false);
              if (data.statusCode == "200") {
                if (data.data.rows) {
                  if (data.data.rows.length > 0) {
                    self.pageNoVal++;
                    self.startedList = data.data.rows;
                    self.$store.commit(
                      "setMutVuexStartedLists",
                      self.startedList
                    );
                    self.$store.commit(
                      "setMutVuexStartedIndex",
                      self.pageNoVal
                    );
                    if (isAndroid) {
                      if (window.BenchJSInterface) {
                        window.BenchJSInterface.setTopBarColor(1);
                        window.BenchJSInterface.setRightBtn(
                          "筛选",
                          "javascript:window.pathFun();"
                        );
                        window.BenchJSInterface.setRightImageType(10, "");
                      }
                    } else {
                      var setNav = {
                        methodName: "invokeNavigationRightItemFromJS",
                        params: {
                          naviType: 0,
                          titles: [
                            {
                              name: "筛选",
                              code: "shai",
                              image: "",
                              notEnable: 0
                            }
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
                    window.pathFun = function(val) {
                      self.$router.push({
                        path: "/sponsorScreen"
                      });
                    };
                  } else {
                    self.startedList = [];
                  }
                } else {
                  self.startedList = [];
                }
                if (sessionStorage.getItem("leavrShow")) {
                  if (sessionStorage.getItem("leavrShow") == "true") {
                    self.nightExamineClick("0");
                  }
                }
              } else {
                Toast({
                  message: "服务器异常",
                  position: "bottom"
                });
              }
            })
            .catch(msg => {
              self.$store.commit("setMutVuexisLoading", false);
              sessionStorage.removeItem("getstartedListShow");
              Toast({
                message: "服务器异常",
                position: "bottom"
              });
            });
        }
      } else {
        //正常筛选进来
        if (isAndroid) {
          if (window.BenchJSInterface) {
            window.BenchJSInterface.setTopBarColor(1);
            window.BenchJSInterface.setRightBtn(
              "筛选",
              "javascript:window.pathFun();"
            );
            window.BenchJSInterface.setRightImageType(10, "");
          }
        } else {
          var setNav = {
            methodName: "invokeNavigationRightItemFromJS",
            params: {
              naviType: 0,
              titles: [{ name: "筛选", code: "shai", image: "", notEnable: 0 }]
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
            path: "/sponsorScreen"
          });
        };
        var objSpon = JSON.parse(sessionStorage.getItem("sponsor"));
        this.state = objSpon.stateVal;
        this.modelId = objSpon.typeVal;
        this.time = objSpon.dateVal;
        self.pageNoVal = 1;
        self.$store.commit("setMutVuexisLoading", true);
        self
          .getapprovalLaunchedApproval({
            companyId: sessionStorage.getItem("companyId"),
            memberId: sessionStorage.getItem("memberId"),
            state: self.state,
            modelId: self.modelId,
            time: self.time,
            currentPage: self.pageNoVal,
            pageSize: self.pageSizeVal
          })
          .then(data => {
            self.$store.commit("setMutVuexisLoading", false);
            sessionStorage.removeItem("getstartedListShow");
            if (data.statusCode == "200") {
              if (data.data.rows) {
                if (data.data.rows.length > 0) {
                  self.pageNoVal++;
                  self.startedList = data.data.rows;
                  self.$store.commit(
                    "setMutVuexStartedLists",
                    self.startedList
                  );
                  self.$store.commit("setMutVuexStartedIndex", self.pageNoVal);
                } else {
                  self.startedList = [];
                }
              } else {
                self.startedList = [];
              }
              if (sessionStorage.getItem("leavrShow")) {
                if (sessionStorage.getItem("leavrShow") == "true") {
                  self.nightExamineClick("0");
                }
              }
            } else {
              Toast({
                message: "服务器异常",
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            self.$store.commit("setMutVuexisLoading", false);
            sessionStorage.removeItem("getstartedListShow");
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    } else {
      // 由详情页或者筛选页回退回来
      if (self.$store.state.VuexStartedLists.length > 0) {
        self.pageNoVal = self.$store.state.VuexStartedIndex;
        self.startedList = self.$store.state.VuexStartedLists;
        if (isAndroid) {
          if (window.BenchJSInterface) {
            window.BenchJSInterface.setTopBarColor(1);
            window.BenchJSInterface.setRightBtn(
              "筛选",
              "javascript:window.pathFun();"
            );
            window.BenchJSInterface.setRightImageType(10, "");
          }
        } else {
          var setNav = {
            methodName: "invokeNavigationRightItemFromJS",
            params: {
              naviType: 0,
              titles: [
                {
                  name: "筛选",
                  code: "shai",
                  image: "",
                  notEnable: 0
                }
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
        window.pathFun = function(val) {
          self.$router.push({
            path: "/sponsorScreen"
          });
        };
      } else {
        self.pageNoVal = 1;
        self.$store.commit("setMutVuexisLoading", true);
        self
          .getapprovalLaunchedApproval({
            companyId: sessionStorage.getItem("companyId"),
            memberId: sessionStorage.getItem("memberId"),
            state: self.state,
            modelId: self.modelId,
            time: self.time,
            currentPage: self.pageNoVal,
            pageSize: self.pageSizeVal
          })
          .then(data => {
            self.$store.commit("setMutVuexisLoading", false);
            if (data.statusCode == "200") {
              if (data.data.rows) {
                if (data.data.rows.length > 0) {
                  self.pageNoVal++;
                  self.startedList = data.data.rows;
                  self.$store.commit(
                    "setMutVuexStartedLists",
                    self.startedList
                  );
                  self.$store.commit("setMutVuexStartedIndex", self.pageNoVal);
                  if (isAndroid) {
                    if (window.BenchJSInterface) {
                      window.BenchJSInterface.setTopBarColor(1);
                      window.BenchJSInterface.setRightBtn(
                        "筛选",
                        "javascript:window.pathFun();"
                      );
                      window.BenchJSInterface.setRightImageType(10, "");
                    }
                  } else {
                    var setNav = {
                      methodName: "invokeNavigationRightItemFromJS",
                      params: {
                        naviType: 0,
                        titles: [
                          {
                            name: "筛选",
                            code: "shai",
                            image: "",
                            notEnable: 0
                          }
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
                  window.pathFun = function(val) {
                    self.$router.push({
                      path: "/sponsorScreen"
                    });
                  };
                } else {
                  self.startedList = [];
                }
              } else {
                self.startedList = [];
              }
              if (sessionStorage.getItem("leavrShow")) {
                if (sessionStorage.getItem("leavrShow") == "true") {
                  self.nightExamineClick("0");
                }
              }
            } else {
              Toast({
                message: "服务器异常",
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            self.$store.commit("setMutVuexisLoading", false);
            sessionStorage.removeItem("getstartedListShow");
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    }
  },
  methods: {
    // 初始数据
    listsFun() {
      var self = this;
      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      self
        .getapprovalLaunchedApproval({
          companyId: sessionStorage.getItem("companyId"),
          memberId: sessionStorage.getItem("memberId"),
          state: self.state,
          modelId: self.modelId,
          time: self.time,
          currentPage: self.pageNoVal,
          pageSize: self.pageSizeVal
        })
        .then(data => {
          self.startedList = [];
          self.$store.commit("setMutVuexisLoading", false);
          sessionStorage.removeItem("getstartedListShow");
          if (data.statusCode == "200") {
            if (data.data.rows) {
              if (data.data.rows.length > 0) {
                self.pageNoVal++;
                self.startedList = data.data.rows;
                self.$store.commit("setMutVuexStartedLists", self.startedList);
                self.$store.commit("setMutVuexStartedIndex", self.pageNoVal);
                if (isAndroid) {
                  if (window.BenchJSInterface) {
                    window.BenchJSInterface.setTopBarColor(1);
                    window.BenchJSInterface.setRightBtn(
                      "筛选",
                      "javascript:window.pathFun();"
                    );
                    window.BenchJSInterface.setRightImageType(10, "");
                  }
                } else {
                  var setNav = {
                    methodName: "invokeNavigationRightItemFromJS",
                    params: {
                      naviType: 0,
                      titles: [
                        {
                          name: "筛选",
                          code: "shai",
                          image: "",
                          notEnable: 0
                        }
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
                window.pathFun = function(val) {
                  self.$router.push({
                    path: "/sponsorScreen"
                  });
                };
              }
            }
            if (sessionStorage.getItem("leavrShow")) {
              if (sessionStorage.getItem("leavrShow") == "true") {
                self.nightExamineClick("0");
              }
            }
          } else {
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          }
        })
        .catch(msg => {
          self.startedList = [];
          self.$store.commit("setMutVuexisLoading", false);
          sessionStorage.removeItem("getstartedListShow");
          Toast({
            message: "服务器异常",
            position: "bottom"
          });
        });
    },
    //我发起的详情
    nightExamineClick(index) {
      var self = this;
      this.$router.push({
        path: "/detailsExamine",
        query: { approvalId: this.startedList[index].approvalId }
      });
      self.$store.commit("setMutVuexStartedClickIndex", index);
    },
    // 下拉刷新
    onRefresh(done) {
      let self = this;
      if (self.onRefreshTrue == false) {
        self.onRefreshTrue = true;
        this.loadingText = "";
        this.$store.commit("setMutVuexStartedListsTop", 0);
        self.pageNoVal = 1;
        sessionStorage.removeItem("sponsor");
        done(1);
        self
          .getapprovalLaunchedApproval({
            companyId: sessionStorage.getItem("companyId"),
            memberId: sessionStorage.getItem("memberId"),
            currentPage: self.pageNoVal,
            pageSize: self.pageSizeVal
          })
          .then(data => {
            self.onRefreshTrue = false;
            done(2);
            if (data.statusCode == "200") {
              if (data.data.rows) {
                if (data.data.rows.length > 0) {
                  self.startedList = data.data.rows;
                  self.pageNoVal++;
                  self.$store.commit(
                    "setMutVuexStartedLists",
                    self.startedList
                  );
                  self.$store.commit("setMutVuexStartedIndex", self.pageNoVal);
                } else {
                  self.startedList = [];
                }
              } else {
                self.startedList = [];
              }
            } else {
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            done(2);
            self.onRefreshTrue = false;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    // 上拉加载
    onInfinite(done) {
      var self = this;
      done(3);
      if (self.onInfiniteTrue == false) {
        self.onInfiniteTrue = true;
        self.loadingText = "加载中···";
        self
          .getapprovalLaunchedApproval({
            companyId: sessionStorage.getItem("companyId"),
            memberId: sessionStorage.getItem("memberId"),
            state: self.state,
            modelId: self.modelId,
            time: self.time,
            currentPage: self.pageNoVal,
            pageSize: self.pageSizeVal
          })
          .then(data => {
            self.onInfiniteTrue = false;
            if (data.statusCode == "200") {
              if (data.data) {
                if (data.data.rows) {
                  if (data.data.rows.length > 0) {
                    var VuexStartedListsTopNum =
                      this.$store.state.VuexStartedListsTop + 56;
                    this.$store.commit(
                      "setMutVuexStartedListsTop",
                      VuexStartedListsTopNum
                    );
                    done(1);
                    var arr = data.data.rows;
                    self.startedList = self.startedList.concat(arr);
                    self.pageNoVal++;
                    self.$store.commit(
                      "setMutVuexStartedLists",
                      self.startedList
                    );
                    self.$store.commit(
                      "setMutVuexStartedIndex",
                      self.pageNoVal
                    );
                  } else {
                    var VuexStartedListsTopNum =
                      this.$store.state.VuexStartedListsTop + 56;
                    this.$store.commit(
                      "setMutVuexStartedListsTop",
                      VuexStartedListsTopNum
                    );
                    self.loadingText = "已加载全部数据";
                    done(2);
                  }
                } else {
                  var VuexStartedListsTopNum =
                    this.$store.state.VuexStartedListsTop + 56;
                  this.$store.commit(
                    "setMutVuexStartedListsTop",
                    VuexStartedListsTopNum
                  );
                  self.loadingText = "已加载全部数据";
                  done(2);
                }
              } else {
                var VuexStartedListsTopNum =
                  this.$store.state.VuexStartedListsTop + 56;
                this.$store.commit(
                  "setMutVuexStartedListsTop",
                  VuexStartedListsTopNum
                );
                self.loadingText = "已加载全部数据";
                done(2);
              }
            } else {
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
              done(2);
            }
          })
          .catch(msg => {
            done(2);
            self.onInfiniteTrue = false;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    ...mapActions(["getapprovalLaunchedApproval"])
  },
  watch: {
    seekVal: function(val) {
      if (val.length > 0) {
        this.seekClickShow = true;
      } else {
        this.seekClickShow = false;
      }
    }
  },
  filters: {
    // 过滤时间
    timeFun: function(val) {
      if (val) {
        var standardTime = new Date(Number(val));
        var y, m, d, h, f;
        y = standardTime.getFullYear();
        m = standardTime.getMonth() + 1;
        m = m > 9 ? m : "0" + m;
        d = standardTime.getDate();
        d = d > 9 ? d : "0" + d;
        return y + "-" + m + "-" + d;
      } else {
        return "暂无";
      }
    }
  }
};
</script>
<style scoped>
.snakeBox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(44, 44, 44, 0);
  display: flex;
  justify-content: center;
  overflow: hidden;
  padding-top: 50px;
}

.nullContent {
  height: 3.68rem;
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

.nullLI {
  width: 100vw;
  height: calc(100vh);
  text-align: center;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  background-color: #f1f1f1;
}

.nightExamine {
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
  user-select: none;
}

.allLog-font {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #848484;
  font-size: 18px;
}

.nightExamineUl {
  margin-bottom: 0.2rem;
  background: rgba(255, 255, 255, 1);
}

.nightExamineLi:nth-child(1) {
  border-top: 1px solid #e3e3e3;
}

.nightExamineLi {
  width: 100%;
  height: 1.7067rem;
  display: flex;
  /* height: 5.7rem; */
  position: relative;
}

.nightExamineLi::after {
  position: absolute;
  bottom: 0;
  left: 0.3733rem;
  width: calc(100% - 0.3733rem);
  height: 1px;
  background-color: #e3e3e3;
  content: "";
}

.nightExamineImg {
  width: 1.1733rem;
  height: 1.1733rem;
  border-radius: 100%;
  margin: 0.2667rem 0.32rem 0.2667rem 0.4267rem;
}

.nightExamineImg img {
  width: 100%;
  height: 100%;
  border-radius: 100%;
}

.nightExamineFont {
  width: 5.4rem;
  height: 1.1733rem;
  margin: 0.2667rem 0 0.2667rem 0;
  overflow-x: hidden;
}

.nightExamineFontTop,
.nightExamineFontFoot {
  width: 5.6rem;
  height: 0.5867rem;
  line-height: 0.5867rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.nightExamineFontTop {
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
}

.nightExamineFontFoot {
  font-size: 0.3733rem;
}

.fontGray {
  color: rgba(132, 132, 132, 1);
}

.fontRed {
  color: rgba(234, 98, 98, 1) !important;
}

.nightExamineTime {
  min-width: 2rem;
  height: 0.32rem;
  font-size: 0.32rem;
  color: rgba(192, 192, 192, 1);
  line-height: 0.32rem;
  margin: 0.4267rem 0.4267rem 0.96rem 0;
}
</style>