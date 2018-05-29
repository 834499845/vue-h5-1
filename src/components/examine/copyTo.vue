<!--抄送我的筛选列表-->
<template>
    <div class="nightExamine">
        <div class="examineScreenClick">
            <div v-show="!seekShow" class="examineScreenFoot">
                <div class="examineScreenFootLeft" @click="seekShowClick()">
                    <div class="examineScreenIcon searchIcon"> </div>
                    <div>搜索</div>
                </div>
                <div class="examineScreenFootRight" @click="examineClick()">
                    <div class="examineScreenIcon screenIcon"></div>
                    <div>筛选</div>
                </div>
            </div>
            <div v-show="seekShow" class="examineSeek">
                <div class="seekFont">
                    <div class="seekIcon">
                      <img src="/static/img/搜索@3x.png" alt="">
                    </div>
                    <input class="seekInp" v-model="seekVal" placeholder="搜索" type="text">
                </div>
                <div class="seekClick">
                    <div v-if="seekClickShow" class="seekOk" @click="seekOkClick()">搜索</div>
                    <div v-else class="seekCancel" @click="seekCancelClick()">取消</div>
                </div>
            </div>
        </div>
        <div class="allLog-main" v-show="copyList.length > 0">
            <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">
                <ul class="nightExamineUl">
                    <li v-for="(item,index) in copyList" :key="index" class="nightExamineLi" @click="nightExamineClick(index)">
                        <div class="nightExamineImg" v-if="item.userAvatar">
                            <img v-lazy="item.userAvatar" alt="">
                        </div>
                        <div class="nightExamineImgFont" v-if="!item.userAvatar">
                            {{item.userNick | nameFun}}
                        </div>
                        <div class="nightExamineFont">
                            <p class="nightExamineFontTop">
                                {{item.title}}
                            </p>
                            <p class="nightExamineFontFoot">
                                <span class="fontGray" v-if="item.state == '1'">
                                    审批完成（同意）
                                </span>
                                <span class="fontRed" v-if="item.state == '2'">
                                    审批完成（拒绝）
                                </span>
                                <span class="fontGray" v-if="item.state == '4'">
                                    已撤销
                                </span>
                                <!-- <span class="fontGray" v-if="item.state == '3'">
                                    等待{{item.await}}审批
                                </span> -->
                            </p>
                        </div>
                        <div class="nightExamineTime">
                            <div class="nightExamineTimeTop fontGray">
                                {{item.createTime | timeFun}}
                            </div>
                            <div class="nightExamineTimeFoot fontRed">
                                <span v-if='item.isRead == 0'>未读</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </v-scroll>
        </div>
        <div class="nullLI" v-show="copyList.length == 0">
          <div class="nullContent"></div>
          <img class="nullImg" src="/static/img/iconfont_default_list@3x.png" alt="">
          <div class="nullText">暂无审批</div>
        </div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import { Toast } from "mint-ui";
import scroll from "../cModule/startedScroll";
export default {
  components: { "v-scroll": scroll },
  data() {
    return {
      copyList: [],
      // state：审批状态；0-拒绝；1-同意；2-撤销；3-等待
      seekShow: false, //控制搜索点击和输入框的切换
      seekClickShow: false, //控制搜索输入框的所搜和取消
      seekVal: "", //搜索关键字
      state: "", //审批状态 0:审批中 1:审批完成 2:已撤回
      time: "", //审批时间
      pageNoVal: 1, //当前页数
      pageSize: 20, //每页条数
      onInfiniteTrue: false,
      onRefreshTrue: false,
      loadingText: ""
    };
  },
  created: function() {
    document.title = "抄送我的";
  },
  updated: function() {
    this.$nextTick(function() {
      let position = this.$store.state.VuexCopyListsTop || 0; //返回页面取出来
      this.$el.querySelector(".yo-scroll").scrollTop = position * 1;
    });
  },
  mounted() {
    var self = this;
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("抄送我的");
      }
    }
    if (sessionStorage.getItem("getcopyListShow")) {
      //首页过来
      if (sessionStorage.getItem("getcopyListShow") == "true") {
        self.pageNoVal = 1;
        self.state = "";
        self.time = "";
        self.seekVal = "";
        self.$store.commit("setMutVuexisLoading", true);
        self.listFun();
      }
    } else if (sessionStorage.getItem("copyTo")) {
      if (sessionStorage.getItem("copyToDetailsLook") == 1) {
        sessionStorage.removeItem("copyToDetailsLook");
        // 筛选后从详情页返回
        if (self.$store.state.VuexCopyLists.length > 0) {
          if (sessionStorage.getItem("searchSeekVal")) {
            self.seekVal = sessionStorage.getItem("searchSeekVal");
            self.seekShow = true;
          } else {
            self.seekVal = "";
            self.seekShow = false;
          }
          self.copyList = self.$store.state.VuexCopyLists;
          self.pageNoVal = self.$store.state.VuexCopyListsIndex;
        } else {
          self.seekVal = "";
          self.state = "";
          self.time = "";
          self.$store.commit("setMutVuexisLoading", true);
          self
            .getapprovalCopiedApproval({
              companyId: sessionStorage.getItem("companyId"),
              memberId: sessionStorage.getItem("memberId"),
              state: self.state,
              searchKey: self.seekVal,
              time: self.time,
              currentPage: self.pageNoVal,
              pageSize: self.pageSize
            })
            .then(data => {
              self.$store.commit("setMutVuexisLoading", false);
              self.copyList = [];
              if (data.statusCode == "200") {
                sessionStorage.removeItem("getcopyListShow");
                if (data.data.rows) {
                  if (data.data.rows.length > 0) {
                    self.copyList = data.data.rows;
                    self.pageNoVal++;
                    self.$store.commit("setMutVuexCopyLists", self.copyList);
                    self.$store.commit(
                      "setMutVuexCopyListsIndex",
                      self.pageNoVal
                    );
                    if (isAndroid) {
                      if (window.BenchJSInterface) {
                        window.BenchJSInterface.setTopBarColor(1);
                        window.BenchJSInterface.setRightBtn(
                          "全部已读",
                          "javascript:window.pathFun();"
                        );
                      }
                    } else {
                      var setNav = {
                        methodName: "invokeNavigationRightItemFromJS",
                        params: {
                          naviType: 0,
                          titles: [{ name: "全部已读", code: "shai" }]
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
                      var approvalIdArr = [];
                      for (var i = 0; i < self.copyList.length; i++) {
                        approvalIdArr.push(self.copyList[i].approvalId);
                      }
                      self
                        .getapprovalupdateisread({
                          approvalId: approvalIdArr.join(",")
                        })
                        .then(data => {
                          if (data.statusCode == 200) {
                            Toast({
                              message: "已全部标记为已读",
                              position: "bottom"
                            });
                            for (var i = 0; i < self.copyList.length; i++) {
                              self.copyList[i].isRead = 1;
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
                    };
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
              self.copyList = [];
            });
          sessionStorage.removeItem("getcopyListShow");
        }
      } else {
        //进行筛选
        var copyObj = JSON.parse(sessionStorage.getItem("copyTo"));
        if (copyObj.departmentVal) {
          self.state = copyObj.departmentVal;
        }
        if (copyObj.dateVal) {
          self.time = copyObj.dateVal;
        }
        self.$store.commit("setMutVuexCopyListsTop", 0);
        self.pageNoVal = 1;
        self.$store.commit("setMutVuexisLoading", true);
        self
          .getapprovalCopiedApproval({
            companyId: sessionStorage.getItem("companyId"),
            memberId: sessionStorage.getItem("memberId"),
            state: self.state,
            searchKey: self.seekVal,
            time: self.time,
            currentPage: self.pageNoVal,
            pageSize: self.pageSize
          })
          .then(data => {
            self.copyList = [];
            self.$store.commit("setMutVuexisLoading", false);
            if (data.statusCode == 200) {
              sessionStorage.removeItem("getcopyListShow");
              if (data.data.rows) {
                if (data.data.rows.length > 0) {
                  self.pageNoVal++;
                  self.copyList = data.data.rows;
                  self.$store.commit("setMutVuexCopyLists", self.copyList);
                  self.$store.commit(
                    "setMutVuexCopyListsIndex",
                    self.pageNoVal
                  );
                  if (isAndroid) {
                    if (window.BenchJSInterface) {
                      window.BenchJSInterface.setTopBarColor(1);
                      window.BenchJSInterface.setRightBtn(
                        "全部已读",
                        "javascript:window.pathFun();"
                      );
                    }
                  } else {
                    var setNavOBj = {
                      methodName: "invokeNavigationRightItemFromJS",
                      params: {
                        image: "search",
                        titles: [{ name: "全部已读", code: "shai" }]
                      },
                      callbackMethod: "pathFun"
                    };
                    if (window.webkit) {
                      if (window.webkit.messageHandlers) {
                        window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                          setNavOBj
                        );
                      }
                    }
                  }
                  window.pathFun = function(val) {
                    var approvalIdArr = [];
                    for (var i = 0; i < self.copyList.length; i++) {
                      approvalIdArr.push(self.copyList[i].approvalId);
                    }
                    self
                      .getapprovalupdateisread({
                        approvalId: approvalIdArr.join(",")
                      })
                      .then(data => {
                        if (data.statusCode == 200) {
                          Toast({
                            message: "已全部标记为已读",
                            position: "bottom"
                          });
                          for (var i = 0; i < self.copyList.length; i++) {
                            self.copyList[i].isRead = 1;
                          }
                        } else {
                          Toast({
                            message: "服务器异常",
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
                  };
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
            self.copyList = [];
            self.$store.commit("setMutVuexisLoading", false);
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    } else {
      if (self.$store.state.VuexCopyLists.length > 0) {
        if (sessionStorage.getItem("searchSeekVal")) {
          self.seekVal = sessionStorage.getItem("searchSeekVal");
          self.seekShow = true;
        } else {
          self.seekVal = "";
          self.seekShow = false;
        }
        self.copyList = self.$store.state.VuexCopyLists;
        self.pageNoVal = self.$store.state.VuexCopyListsIndex;
      } else {
        self.seekVal = "";
        self.state = "";
        self.time = "";
        self.$store.commit("setMutVuexisLoading", true);
        self
          .getapprovalCopiedApproval({
            companyId: sessionStorage.getItem("companyId"),
            memberId: sessionStorage.getItem("memberId"),
            state: self.state,
            searchKey: self.seekVal,
            time: self.time,
            currentPage: self.pageNoVal,
            pageSize: self.pageSize
          })
          .then(data => {
            self.$store.commit("setMutVuexisLoading", false);
            self.copyList = [];
            if (data.statusCode == "200") {
              sessionStorage.removeItem("getcopyListShow");
              if (data.data.rows) {
                if (data.data.rows.length > 0) {
                  self.copyList = data.data.rows;
                  self.pageNoVal++;
                  self.$store.commit("setMutVuexCopyLists", self.copyList);
                  self.$store.commit(
                    "setMutVuexCopyListsIndex",
                    self.pageNoVal
                  );
                  if (isAndroid) {
                    if (window.BenchJSInterface) {
                      window.BenchJSInterface.setTopBarColor(1);
                      window.BenchJSInterface.setRightBtn(
                        "全部已读",
                        "javascript:window.pathFun();"
                      );
                    }
                  } else {
                    var setNav = {
                      methodName: "invokeNavigationRightItemFromJS",
                      params: {
                        naviType: 0,
                        titles: [{ name: "全部已读", code: "shai" }]
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
                    var approvalIdArr = [];
                    for (var i = 0; i < self.copyList.length; i++) {
                      approvalIdArr.push(self.copyList[i].approvalId);
                    }
                    self
                      .getapprovalupdateisread({
                        approvalId: approvalIdArr.join(",")
                      })
                      .then(data => {
                        if (data.statusCode == 200) {
                          Toast({
                            message: "已全部标记为已读",
                            position: "bottom"
                          });
                          for (var i = 0; i < self.copyList.length; i++) {
                            self.copyList[i].isRead = 1;
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
                  };
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
            self.copyList = [];
          });
        sessionStorage.removeItem("getcopyListShow");
      }
    }
  },
  methods: {
    // 初始化数据
    listFun() {
      var self = this;
      this.$store.commit("setMutVuexCopyListsTop", 0);
      sessionStorage.removeItem("getcopyListShow");
      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      self
        .getapprovalCopiedApproval({
          companyId: sessionStorage.getItem("companyId"),
          memberId: sessionStorage.getItem("memberId"),
          state: self.state,
          searchKey: self.seekVal,
          time: self.time,
          currentPage: self.pageNoVal,
          pageSize: self.pageSize
        })
        .then(data => {
          self.copyList = [];
          self.$store.commit("setMutVuexisLoading", false);
          if (data.statusCode == "200") {
            if (data.data.rows) {
              if (data.data.rows.length > 0) {
                self.pageNoVal++;
                self.copyList = data.data.rows;
                self.$store.commit("setMutVuexCopyLists", self.copyList);
                self.$store.commit("setMutVuexCopyListsIndex", self.pageNoVal);
                if (isAndroid) {
                  if (window.BenchJSInterface) {
                    window.BenchJSInterface.setTopBarColor(1);
                    window.BenchJSInterface.setRightBtn(
                      "全部已读",
                      "javascript:window.pathFun();"
                    );
                  }
                } else {
                  var setNav = {
                    methodName: "invokeNavigationRightItemFromJS",
                    params: {
                      naviType: 0,
                      titles: [{ name: "全部已读", code: "shai" }]
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
                  var approvalIdArr = [];
                  for (var i = 0; i < self.copyList.length; i++) {
                    approvalIdArr.push(self.copyList[i].approvalId);
                  }
                  self
                    .getapprovalupdateisread({
                      approvalId: approvalIdArr.join(",")
                    })
                    .then(data => {
                      if (data.statusCode == 200) {
                        Toast({
                          message: "已全部标记为已读",
                          position: "bottom"
                        });
                        for (var i = 0; i < self.copyList.length; i++) {
                          self.copyList[i].isRead = 1;
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
                };
              } else {
                self.copyList = [];
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
          self.copyList = [];
        });
    },
    //获取我抄送的列表
    getcopyList() {
      var self = this;
      this.$store.commit("setMutVuexCopyListsTop", 0);
      self.$store.commit("setMutVuexisLoading", true);
      self
        .getapprovalCopiedApproval({
          companyId: sessionStorage.getItem("companyId"),
          memberId: sessionStorage.getItem("memberId"),
          state: self.state,
          searchKey: self.seekVal,
          time: self.time,
          currentPage: self.pageNoVal,
          pageSize: self.pageSize
        })
        .then(data => {
          self.$store.commit("setMutVuexisLoading", false);
          self.copyList = [];
          if (data.statusCode == "200") {
            sessionStorage.removeItem("getcopyListShow");
            if (data.data.rows) {
              if (data.data.rows.length > 0) {
                self.copyList = data.data.rows;
                self.pageNoVal++;
                self.$store.commit("setMutVuexCopyLists", self.copyList);
                self.$store.commit("setMutVuexCopyListsIndex", self.pageNoVal);
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
          self.copyList = [];
        });
    },
    //搜索点击切换搜索框
    seekShowClick() {
      this.seekShow = true;
    },
    //搜索
    seekOkClick() {
      var self = this;
      self.pageNoVal = 1;
      if (sessionStorage.getItem("copyTo")) {
        var copyObj = JSON.parse(sessionStorage.getItem("copyTo"));
        if (copyObj.departmentVal) {
          self.state = copyObj.departmentVal;
        } else {
          self.state = "";
        }
        if (copyObj.dateVal) {
          self.time = copyObj.dateVal;
        } else {
          self.time = "";
        }
      }
      this.$store.commit("setMutVuexCopyListsTop", 0);
      sessionStorage.setItem("searchSeekVal", self.seekVal);
      self.$store.commit("setMutVuexisLoading", true);
      self
        .getapprovalCopiedApproval({
          companyId: sessionStorage.getItem("companyId"),
          memberId: sessionStorage.getItem("memberId"),
          state: self.state,
          searchKey: self.seekVal,
          time: self.time,
          currentPage: self.pageNoVal,
          pageSize: self.pageSize
        })
        .then(data => {
          self.copyList = [];
          self.$store.commit("setMutVuexisLoading", false);
          if (data.statusCode == "200") {
            if (data.data.rows) {
              if (data.data.rows.length > 0) {
                self.pageNoVal++;
                self.copyList = data.data.rows;
                self.$store.commit("setMutVuexCopyLists", self.copyList);
                self.$store.commit("setMutVuexCopyListsIndex", self.pageNoVal);
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
          self.copyList = [];
        });
    },
    //取消搜索框切换至搜索和筛选
    seekCancelClick() {
      var self = this;
      sessionStorage.removeItem("searchSeekVal");
      self.$store.commit("setMutVuexCopyListsTop", 0);
      this.seekShow = false;
      this.pageNoVal = 1;
      this.seekVal = "";
      this.getcopyList();
    },
    //筛选
    examineClick() {
      this.$router.push({
        path: "/copyToScreen"
      });
    },
    //详情
    nightExamineClick(index) {
      var self = this;
      this.$router.push({
        path: "/copyToDetails",
        query: { approvalId: this.copyList[index].approvalId }
      });
      self.$store.commit("setMutVuexCopyListsClickIndex", index);
    },
    // 下拉刷新
    onRefresh(done) {
      let self = this;
      if (self.onRefreshTrue == false) {
        self.onRefreshTrue = true;
        sessionStorage.removeItem("copyTo");
        sessionStorage.removeItem("searchSeekVal");
        self.$store.commit("setMutVuexCopyListsTop", 0);
        self.seekShow = false;
        self.pageNoVal = 1;
        self.state = "";
        self.time = "";
        self.seekVal = "";
        done(1);
        self
          .getapprovalCopiedApproval({
            companyId: sessionStorage.getItem("companyId"),
            memberId: sessionStorage.getItem("memberId"),
            currentPage: self.pageNoVal,
            pageSize: self.pageSize
          })
          .then(data => {
            self.onRefreshTrue = false;
            done(2);
            self.copyList = [];
            if (data.statusCode == "200") {
              if (data.data.rows) {
                if (data.data.rows.length > 0) {
                  self.copyList = data.data.rows;
                  self.pageNoVal++;
                  self.$store.commit("setMutVuexCopyLists", self.copyList);
                  self.$store.commit(
                    "setMutVuexCopyListsIndex",
                    self.pageNoVal
                  );
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
            done(2);
            self.onRefreshTrue = false;
            self.copyList = [];
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
        if (sessionStorage.getItem("copyTo")) {
          var copyObj = JSON.parse(sessionStorage.getItem("copyTo"));
          if (copyObj.departmentVal) {
            self.state = copyObj.departmentVal;
          } else {
            self.state = "";
          }
          if (copyObj.dateVal) {
            self.time = copyObj.dateVal;
          } else {
            self.time = "";
          }
        }
        self
          .getapprovalCopiedApproval({
            companyId: sessionStorage.getItem("companyId"),
            memberId: sessionStorage.getItem("memberId"),
            state: self.state,
            searchKey: self.seekVal,
            time: self.time,
            currentPage: self.pageNoVal,
            pageSize: self.pageSize
          })
          .then(data => {
            self.onInfiniteTrue = false;
            if (data.statusCode == "200") {
              if (data.data) {
                if (data.data.rows) {
                  if (data.data.rows.length > 0) {
                    var VuexStartedListsTopNum =
                      this.$store.state.VuexCopyListsTop + 56;
                    this.$store.commit(
                      "setMutVuexCopyListsTop",
                      VuexStartedListsTopNum
                    );
                    self.pageNoVal++;
                    done(1);
                    var arr = data.data.rows;
                    self.copyList = self.copyList.concat(arr);
                    self.$store.commit("setMutVuexCopyLists", self.copyList);
                    self.$store.commit(
                      "setMutVuexCopyListsIndex",
                      self.pageNoVal
                    );
                  } else {
                    var VuexStartedListsTopNum =
                      this.$store.state.VuexCopyListsTop + 56;
                    this.$store.commit(
                      "setMutVuexCopyListsTop",
                      VuexStartedListsTopNum
                    );
                    done(2);
                    self.loadingText = "已加载全部数据";
                  }
                } else {
                  var VuexStartedListsTopNum =
                    this.$store.state.VuexCopyListsTop + 56;
                  this.$store.commit(
                    "setMutVuexCopyListsTop",
                    VuexStartedListsTopNum
                  );
                  done(2);
                  self.loadingText = "已加载全部数据";
                }
              } else {
                var VuexStartedListsTopNum =
                  this.$store.state.VuexCopyListsTop + 56;
                this.$store.commit(
                  "setMutVuexCopyListsTop",
                  VuexStartedListsTopNum
                );
                done(2);
                self.loadingText = "已加载全部数据";
              }
            } else {
              done(2);
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            self.onInfiniteTrue = false;
            done(2);
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    ...mapActions(["getapprovalCopiedApproval", "getapprovalupdateisread"])
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
    },
    nameFun: function(val) {
      if (val) {
        if (val.length > 2) {
          return val.slice(val.length - 2);
        } else {
          return val;
        }
      }
    }
  }
};
</script>
<style scoped>
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
  height: calc(100vh - 1.2333rem);
  text-align: center;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  background-color: #f1f1f1;
}

.nightExamine {
  height: 100vh;
  width: 100%;
}

.allLog-main {
  overflow-x: hidden;
  overflow-y: scroll;
  height: calc(100vh - 1.3333rem);
  position: relative;
  user-select: none;
  width: 100%;
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

.nightExamineLi {
  width: 100%;
  height: 1.7067rem;
  /* height: 7rem; */
  display: flex;
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

.nightExamineImgFont {
  width: 1.1733rem;
  height: 1.1733rem;
  border-radius: 100%;
  margin: 0.2667rem 0.32rem 0.2667rem 0.4267rem;
  background: #1e90ff;
  border-radius: 100%;
  text-align: center;
  line-height: 1.1733rem;
  color: white;
}

.nightExamineFont {
  width: 4.3rem;
  height: 1.1733rem;
  border-radius: 100%;
  margin: 0.2667rem 0 0.2667rem 0;
}

.nightExamineFontTop,
.nightExamineFontFoot {
  width: 4.3rem;
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
  color: #848484;
}

.fontRed {
  color: #ea6262;
}

.nightExamineTime {
  min-width: 3rem;
  margin: 0.2667rem 0.4267rem 0.2667rem 0;
}

.nightExamineTimeTop,
.nightExamineTimeFoot {
  height: 0.5867rem;
  width: 100%;
  text-align: right;
  line-height: 0.6933rem;
}

.examineScreenClick {
  width: 100%;
}

.examineScreenFoot {
  width: 100%;
  border-bottom: 1px solid #d7d7d7;
  border-top: 1px solid #e3e3e3;
  display: flex;
  user-select: none;
}

.ScreenTopBorLeft,
.ScreenTopBorRight {
  height: 0.0533rem;
  background: #4a94e3;
  margin: 0 auto;
  margin-top: -0.1067rem;
}

.ScreenTopBorLeft {
  width: 2.9333rem;
}

.ScreenTopBorRight {
  width: 2rem;
}

.examineScreenFootLeft,
.examineScreenFootRight {
  width: 50%;
  height: 1.1733rem;
  line-height: 1.1733rem;
  font-size: 0.3733rem;
  color: #c0c0c0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.examineScreenIcon {
  width: 0.4267rem;
  height: 0.4267rem;
  background: brown;
  margin-right: 0.1067rem;
}

.searchIcon {
  background: url("/static/img/搜索@3x.png") no-repeat;
  background-size: 0.4267rem 0.4267rem;
}

.screenIcon {
  background: url("/static/img/筛选@3x.png") no-repeat;
  background-size: 0.4267rem 0.4267rem;
}

.examineSeek {
  width: 100%;
  height: 44%;
  display: flex;
  border-bottom: 1px solid #e3e3e3;
}

.seekFont {
  width: 7.9733rem;
  height: 0.8533rem;
  line-height: 0.8533rem;
  word-spacing: 0.0267rem;
  margin: 0.2133rem 0 0.1067rem 0.4267rem;
  background: #f1f1f1;
  display: flex;
}

.seekIcon {
  width: 0.4267rem;
  height: 0.4267rem;
  margin: 0.2133rem 0.1067rem 0.2133rem 0.32rem;
  /* background: url("/static/img/搜索@3x.png") no-repeat; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.seekIcon img {
  width: 100%;
  height: 100%;
}
.seekInp {
  background: #f1f1f1;
  height: 0.8533rem;
  font-size: 0.3733rem;
  line-height: 0.8533rem;
  word-spacing: 0.0267rem;
}

.seekClick {
  width: 1.4933rem;
  height: 0.8533rem;
  margin: 0.2133rem 0.1067rem 0.2133rem 0;
  line-height: 0.8533rem;
  font-size: 0.4267rem;
  text-align: center;
  color: #4390e1;
}
</style>