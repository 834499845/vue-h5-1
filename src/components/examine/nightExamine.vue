<!--我审批的列表-->
<template>
    <div class="nightExamine">
        <div class="examineScreen">
            <div class="examineScreenTop">
                <div class="examineScreenTopLeft" @click='awaitClick()' :class="{fontBlue:examineScreenTopShow}">
                    待我审批的({{awaitNumber}})
                </div>
                <div class="examineScreenTopRight" @click="alreadyClick()" :class="{fontBlue:!examineScreenTopShow}">
                    我已审批的
                </div>
            </div>
            <div class="examineScreenButton">
                <div v-show="!seekShow" class="examineScreenFoot">
                    <div class="examineScreenFootLeft" @click="seekShowClick()">
                        <div class="examineScreenIcon searchIcon"> </div>
                        <div>搜索</div>
                    </div>
                    <div class="examineScreenFootRight" @click="examineScreenClick()">
                        <div class="examineScreenIcon screenIcon"></div>
                        <div>筛选</div>
                    </div>
                </div>
                <div v-show="seekShow" class="examineSeek">
                    <div class="seekFont">
                        <div class="seekIcon">
                            <img src="/static/img/搜索@3x.png" alt="">
                        </div>
                        <input class="seekInp" v-model="searchVal" placeholder=" 搜索" type="text">
                    </div>
                    <div class="seekClick">
                        <div v-if="seekClickShow" class="seekOk" @click="seekOkClick()">搜索</div>
                        <div v-else class="seekCancel" @click="seekCancelClick()">取消</div>
                    </div>
                </div>
            </div>
        </div>
        <v-nightExamineWaitedList class="allLog-content" @onRefreshWaitedFun="onRefreshWaitedFunClick" v-show="listOrSearchSHow"
            @logListsIndex="logListsLookClick" :lists="nightWairedlist"></v-nightExamineWaitedList>
        <v-nightExamineCompletedList class="allLog-content" @onRefreshCompletedFun="onRefreshCompletedFunClick" v-show="!listOrSearchSHow"
            @logListsIndex="logListsLookClick" :lists="nightCompletelist"></v-nightExamineCompletedList>
        <div class="spinnerLoad" v-show="spinnerLoadShow">
            <mt-spinner type="snake" color="#4390E1"></mt-spinner>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import nightExamineWaitedList from "../cModule/nightExamineWaitedList";
import nightExamineCompletedList from "../cModule/nightExamineCompletedList";
import { Toast } from "mint-ui";
export default {
  components: {
    "v-nightExamineWaitedList": nightExamineWaitedList,
    "v-nightExamineCompletedList": nightExamineCompletedList
  },
  data() {
    return {
      spinnerLoadShow: false, // 切换加载中
      listOrSearchSHow: true, // 切换列表
      nightWairedlist: [], // 待我审批列表
      nightCompletelist: [], // 我已审批列表
      // state：审批状态；0-拒绝；1-同意；2-撤销；3-审批中
      seekShow: false, //控制搜索点击和输入框的切换
      seekClickShow: false, //控制搜索输入框的所搜和取消
      examineScreenTopShow: true, //待我审批与我已审批的切换
      state: "", //审批状态 0:审批中 1:审批完成 2:已撤回
      deptId: "", //部门id
      searchVal: "", //搜索关键字
      pageSize: 20, //	每页显示条数
      awaitNumber: 0, // 待我审批数量
      pageVal: 1 //当前页码
    };
  },
  mounted: function() {
    var self = this;
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("我审批的");
      }
    }
    document.title = "我审批的";
    this.pageVal = 1;
    if (sessionStorage.getItem("getnightListShow")) {
      //由首页点击过来
      if (sessionStorage.getItem("getnightListShow") == "true") {
        self.$store.commit("setMutVuexisLoading", true);
        self.getwaitedList();
      }
    } else if (sessionStorage.getItem("await")) {
      // 由执行筛选过来
      this.pageVal = 1;
      if (sessionStorage.getItem("iAmDetailsExamineTrue") == 1) {
        sessionStorage.removeItem("iAmDetailsExamineTrue");
        if (sessionStorage.getItem("examineScreenTopShow") == "true") {
          //判断头部为待我审批
          self.examineScreenTopShow = true;
          self.listOrSearchSHow = true;
          if (sessionStorage.getItem("nightExamineSaechIndex") == 98) {
            sessionStorage.removeItem("nightExamineSaechIndex");
            sessionStorage.removeItem("waitedSaerch");
            sessionStorage.removeItem("completedSaerch");
            sessionStorage.removeItem("await");
            self.state = "";
            self.deptId = "";
            self.searchVal = "";
            self.$store.commit("setMutVuexWaitedApprovalTop", 0);
            self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
            self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
            self.$store.commit("setMutVuexisLoading", true);
            self.pageVal = 1;
            self.getwaitedList();
          } else {
            if (self.$store.state.VuexWaitedApprovalLists.length > 0) {
              if (sessionStorage.getItem("waitedSaerch")) {
                this.seekShow = true;
                this.searchVal = sessionStorage.getItem("waitedSaerch");
              } else {
                this.seekShow = false;
                this.searchVal = "";
              }
              self.nightWairedlist = [];
              self.nightWairedlist = self.$store.state.VuexWaitedApprovalLists;
              self.awaitNumber = self.$store.state.VuexawaitNumberIndex;
            } else {
              this.seekShow = false;
              this.state = "";
              this.deptId = "";
              this.searchVal = "";
              sessionStorage.removeItem("waitedSaerch");
              sessionStorage.removeItem("completedSaerch");
              sessionStorage.removeItem("await");
              self.$store.commit("setMutVuexWaitedApprovalTop", 0);
              self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
              self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
              self.$store.commit("setMutVuexisLoading", true);
              self.pageVal = 1;
              self.getwaitedList();
            }
          }
        } else {
          //判断头部为我已审批
          self.examineScreenTopShow = false;
          self.listOrSearchSHow = false;
          if (sessionStorage.getItem("nightExamineSaechIndex") == 98) {
            sessionStorage.removeItem("nightExamineSaechIndex");
            self.state = "";
            self.deptId = "";
            self.searchVal = "";
            sessionStorage.removeItem("waitedSaerch");
            sessionStorage.removeItem("completedSaerch");
            sessionStorage.removeItem("await");
            self.$store.commit("setMutVuexCompletedApprovalTop", 0);
            self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
            self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
            self.$store.commit("setMutVuexisLoading", true);
            self.pageVal = 1;
            self.getcompletedList();
            self.awaitNumber = this.$store.state.VuexawaitNumberIndex;
          } else {
            if (self.$store.state.VuexCompletedApprovalLists.length > 0) {
              if (sessionStorage.getItem("completedSaerch")) {
                this.seekShow = true;
                this.searchVal = sessionStorage.getItem("completedSaerch");
              } else {
                this.seekShow = false;
                this.searchVal = "";
              }
              self.nightCompletelist = [];
              self.nightCompletelist =
                self.$store.state.VuexCompletedApprovalLists;
              self.awaitNumber = self.$store.state.VuexawaitNumberIndex;
            } else {
              self.$store.commit("setMutVuexisLoading", true);
              this.seekShow = false;
              this.state = "";
              this.deptId = "";
              this.searchVal = "";
              sessionStorage.removeItem("waitedSaerch");
              sessionStorage.removeItem("completedSaerch");
              sessionStorage.removeItem("await");
              self.$store.commit("setMutVuexCompletedApprovalTop", 0);
              self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
              self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
              self.pageVal = 1;
              self.getcompletedList();
              self.awaitNumber = self.$store.state.VuexawaitNumberIndex;
            }
          }
        }
      } else {
        var awaitObj = JSON.parse(sessionStorage.getItem("await")); //筛选的条件
        this.state = awaitObj.genderVal;
        this.examineScreenTopShow = awaitObj.examineScreenTopShow;
        this.deptId = awaitObj.departmentVal;
        if (awaitObj.examineScreenTopShow == true) {
          self.listOrSearchSHow = true;
          self.$store.commit("setMutVuexisLoading", true);
          self.$store.commit("setMutVuexWaitedApprovalTop", 0);
          self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
          self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
          this.getwaitedList();
        } else {
          self.listOrSearchSHow = false;
          self.$store.commit("setMutVuexCompletedApprovalTop", 0);
          self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
          self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
          self.$store.commit("setMutVuexisLoading", true);
          self.awaitNumber = self.$store.state.VuexawaitNumberIndex;
          this.getcompletedList();
        }
      }
    } else if (sessionStorage.getItem("examineScreenTopShow")) {
      //由详情或者筛选页返回至此页
      if (sessionStorage.getItem("examineScreenTopShow") == "true") {
        //判断头部为待我审批
        self.examineScreenTopShow = true;
        self.listOrSearchSHow = true;
        if (sessionStorage.getItem("nightExamineSaechIndex") == 98) {
          sessionStorage.removeItem("nightExamineSaechIndex");
          sessionStorage.removeItem("waitedSaerch");
          sessionStorage.removeItem("completedSaerch");
          sessionStorage.removeItem("await");
          self.state = "";
          self.deptId = "";
          self.searchVal = "";
          self.$store.commit("setMutVuexWaitedApprovalTop", 0);
          self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
          self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
          self.$store.commit("setMutVuexisLoading", true);
          self.pageVal = 1;
          self.getwaitedList();
        } else {
          if (self.$store.state.VuexWaitedApprovalLists.length > 0) {
            if (sessionStorage.getItem("waitedSaerch")) {
              this.seekShow = true;
              this.searchVal = sessionStorage.getItem("waitedSaerch");
            } else {
              this.seekShow = false;
              this.searchVal = "";
            }
            self.nightWairedlist = [];
            self.nightWairedlist = self.$store.state.VuexWaitedApprovalLists;
            self.awaitNumber = self.$store.state.VuexawaitNumberIndex;
          } else {
            self.$store.commit("setMutVuexisLoading", true);
            self.pageVal = 1;
            self.getwaitedList();
          }
        }
      } else {
        //判断头部为我已审批
        self.examineScreenTopShow = false;
        self.listOrSearchSHow = false;
        if (sessionStorage.getItem("nightExamineSaechIndex") == 98) {
          sessionStorage.removeItem("nightExamineSaechIndex");
          self.state = "";
          self.deptId = "";
          self.searchVal = "";
          sessionStorage.removeItem("waitedSaerch");
          sessionStorage.removeItem("completedSaerch");
          sessionStorage.removeItem("await");
          self.$store.commit("setMutVuexCompletedApprovalTop", 0);
          self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
          self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
          self.$store.commit("setMutVuexisLoading", true);
          self.pageVal = 1;
          self.getcompletedList();
          self.awaitNumber = this.$store.state.VuexawaitNumberIndex;
        } else {
          if (self.$store.state.VuexCompletedApprovalLists.length > 0) {
            if (sessionStorage.getItem("completedSaerch")) {
              this.seekShow = true;
              this.searchVal = sessionStorage.getItem("completedSaerch");
            } else {
              this.seekShow = false;
              this.searchVal = "";
            }
            self.nightCompletelist = [];
            self.nightCompletelist =
              self.$store.state.VuexCompletedApprovalLists;
            self.awaitNumber = self.$store.state.VuexawaitNumberIndex;
          } else {
            self.$store.commit("setMutVuexisLoading", true);
            self.pageVal = 1;
            self.getcompletedList();
            self.awaitNumber = self.$store.state.VuexawaitNumberIndex;
          }
        }
      }
      sessionStorage.removeItem("examineScreenTopShow");
      sessionStorage.removeItem("getnightListShow");
    }
  },
  created: function() {
    var self = this;
  },
  methods: {
    //我审批的详情
    logListsLookClick(val) {
      this.$router.push({
        path: "/iAmDetailsExamine",
        query: { approvalId: val }
      });
      sessionStorage.setItem("examineScreenTopShow", this.examineScreenTopShow);
    },
    //获取待我审批列表
    getwaitedList() {
      var self = this;
      self
        .getapprovalWaitedApproval({
          companyId: sessionStorage.getItem("companyId"),
          memberId: sessionStorage.getItem("memberId"),
          state: self.state,
          deptId: self.deptId,
          searchKey: self.searchVal,
          currentPage: self.pageVal,
          pageSize: self.pageSize
        })
        .then(data => {
          self.spinnerLoadShow = false;
          self.$store.commit("setMutVuexisLoading", false);
          sessionStorage.removeItem("examineScreenTopShow");
          sessionStorage.removeItem("getnightListShow");
          if (data.statusCode == "200") {
            if (data.data.rows) {
              self.awaitNumber = data.data.totalCount;
              self.$store.commit(
                "setMutVuexawaitNumberIndex",
                self.awaitNumber
              );
              if (data.data.rows.length > 0) {
                self.nightWairedlist = [];
                self.nightWairedlist = data.data.rows;
              } else {
                self.nightWairedlist = [];
              }
            } else {
              self.nightWairedlist = [];
            }
          } else {
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          }
        })
        .catch(msg => {
          self.spinnerLoadShow = false;
          self.$store.commit("setMutVuexisLoading", false);
          sessionStorage.removeItem("examineScreenTopShow");
          sessionStorage.removeItem("getnightListShow");
          Toast({
            message: "服务器异常",
            position: "bottom"
          });
        });
    },
    //待我审批事件
    awaitClick() {
      var self = this;
      if (self.listOrSearchSHow == false) {
        this.examineScreenTopShow = true;
        this.seekShow = false;
        this.pageVal = 1;
        this.state = "";
        this.deptId = "";
        this.searchVal = "";
        sessionStorage.removeItem("waitedSaerch");
        sessionStorage.removeItem("completedSaerch");
        sessionStorage.removeItem("await");
        self.$store.commit("setMutVuexWaitedApprovalTop", 0);
        self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
        self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
        self.spinnerLoadShow = true;
        self.listOrSearchSHow = true;
        self.getwaitedList();
      }
    },
    // 获取我已审批的列表
    getcompletedList() {
      var self = this;
      self
        .getapprovalCompletedApproval({
          companyId: sessionStorage.getItem("companyId"),
          memberId: sessionStorage.getItem("memberId"),
          deptId: self.deptId,
          state: self.state,
          searchKey: self.searchVal,
          currentPage: self.pageVal,
          pageSize: self.pageSize
        })
        .then(data => {
          self.spinnerLoadShow = false;
          this.$store.commit("setMutVuexisLoading", false);
          sessionStorage.removeItem("examineScreenTopShow");
          sessionStorage.removeItem("getnightListShow");
          if (data.statusCode == "200") {
            if (data.data.rows) {
              if (data.data.rows.length > 0) {
                self.nightCompletelist = [];
                self.nightCompletelist = data.data.rows;
              } else {
                self.nightCompletelist = [];
              }
            } else {
              self.nightCompletelist = [];
            }
          } else {
            Toast({
              message: data.statusMessage,
              position: "bottom"
            });
          }
        })
        .catch(msg => {
          self.spinnerLoadShow = false;
          this.$store.commit("setMutVuexisLoading", false);
          sessionStorage.removeItem("examineScreenTopShow");
          sessionStorage.removeItem("getnightListShow");
          Toast({
            message: "服务器异常",
            position: "bottom"
          });
        });
    },
    //我已审批的事件
    alreadyClick() {
      var self = this;
      if (this.listOrSearchSHow == true) {
        this.examineScreenTopShow = false;
        this.seekShow = false;
        this.pageVal = 1;
        this.state = "";
        this.deptId = "";
        this.searchVal = "";
        sessionStorage.removeItem("waitedSaerch");
        sessionStorage.removeItem("completedSaerch");
        sessionStorage.removeItem("await");
        self.$store.commit("setMutVuexawaitNumberIndex", self.awaitNumber);
        self.$store.commit("setMutVuexCompletedApprovalTop", 0);
        self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
        self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
        self.spinnerLoadShow = true;
        this.listOrSearchSHow = false;
        this.getcompletedList();
      }
    },
    //搜索点击切换搜索框
    seekShowClick() {
      this.seekShow = true;
    },
    // 我已审批下拉刷新后重置
    onRefreshCompletedFunClick() {
      var self = this;
      this.seekShow = false;
      this.searchVal = "";
      this.state = "";
      this.deptId = "";
      this.pageVal = 1;
      sessionStorage.removeItem("waitedSaerch");
      sessionStorage.removeItem("completedSaerch");
      sessionStorage.removeItem("await");
      self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
      self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
      self.$store.commit("setMutVuexCompletedApprovalTop", 0);
      this.awaitNumber = this.$store.state.VuexawaitNumberIndex;
    },
    // 待我审批下拉刷新后重置搜索
    onRefreshWaitedFunClick() {
      var self = this;
      this.seekShow = false;
      this.searchVal = "";
      this.state = "";
      this.deptId = "";
      this.pageVal = 1;
      sessionStorage.removeItem("waitedSaerch");
      sessionStorage.removeItem("completedSaerch");
      sessionStorage.removeItem("await");
      self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
      self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
      this.awaitNumber = this.$store.state.VuexawaitNumberIndex;
      self.$store.commit("setMutVuexWaitedApprovalTop", 0);
    },
    //搜索按钮
    seekOkClick() {
      var self = this;
      self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
      self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
      if (this.examineScreenTopShow == true) {
        // 待我审批
        this.pageVal = 1;
        self.$store.commit("setMutVuexWaitedApprovalTop", 0);
        sessionStorage.setItem("waitedSaerch", this.searchVal);
        this.getwaitedList();
      } else {
        //我已审批
        this.pageVal = 1;
        self.$store.commit("setMutVuexawaitNumberIndex", self.awaitNumber);
        self.$store.commit("setMutVuexCompletedApprovalTop", 0);
        sessionStorage.setItem("completedSaerch", this.searchVal);
        this.getcompletedList();
      }
    },
    //取消搜索框切换至搜索和筛选
    seekCancelClick() {
      var self = this;
      this.seekShow = false;
      this.state = "";
      this.deptId = "";
      this.searchVal = "";
      sessionStorage.removeItem("waitedSaerch");
      sessionStorage.removeItem("completedSaerch");
      sessionStorage.removeItem("await");
      self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
      self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
      if (this.examineScreenTopShow == true) {
        //待我审批
        self.$store.commit("setMutVuexWaitedApprovalTop", 0);
        this.pageVal = 1;
        this.getwaitedList();
      } else {
        //我已审批
        self.$store.commit("setMutVuexawaitNumberIndex", self.awaitNumber);
        self.$store.commit("setMutVuexCompletedApprovalTop", 0);
        this.pageVal = 1;
        this.getcompletedList();
      }
    },
    //筛选
    examineScreenClick() {
      this.$router.push({
        path: "/awaitExamineScreen",
        query: { examineScreenTopShow: this.examineScreenTopShow }
      });
      sessionStorage.setItem("examineScreenTopShow", this.examineScreenTopShow);
    },
    ...mapActions(["getapprovalCompletedApproval", "getapprovalWaitedApproval"])
  },
  watch: {
    searchVal: function(val) {
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
  padding-top: 2.8667rem;
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
  height: calc(100vh - 1.1733rem - 1.1333rem);
  text-align: center;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  background-color: #f1f1f1;
}

.nightExamine {
  height: 100vh;
  width: 100%;
  user-select: none;
}

.allLog-content {
  overflow-x: hidden;
  overflow-y: scroll;
  user-select: none;
  height: calc(100vh - 1.1733rem - 1.1733rem);
  position: relative;
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
  /* height: 1.7067rem; */
  height: 5.7067rem;
  display: flex;
  /* border-bottom: 1px solid #e3e3e3; */
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
  width: 5rem;
  height: 1.1733rem;
  border-radius: 100%;
  margin: 0.2667rem 0 0.2667rem 0;
}

.nightExamineFontTop,
.nightExamineFontFoot {
  width: 5rem;
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
  color: rgba(234, 98, 98, 1);
}

.nightExamineTime {
  min-width: 2rem;
  height: 0.32rem;
  font-size: 0.32rem;
  color: rgba(192, 192, 192, 1);
  line-height: 0.32rem;
  margin: 0.4267rem 0.4267rem 0.96rem 0;
}

.examineScreen {
  width: 100%;
  height: 2.2667rem;
  border-top: 1px solid #e3e3e3;
  /* border-bottom: 1px solid #e3e3e3; */
}

.examineScreenButton {
  width: 100%;
  /* border-bottom: 1px solid #d7d7d7; */
  position: relative;
}

.examineScreenButton::after {
  position: absolute;
  bottom: 0;
  left: 0.3733rem;
  width: calc(100% - 0.3733rem);
  height: 1px;
  background-color: #d7d7d7;
  content: "";
}

.examineScreenTop,
.examineScreenFoot {
  width: 100%;
  display: flex;
  user-select: none;
}

.examineScreenTop {
  height: 1.0667rem;
}

.examineScreenTopLeft,
.examineScreenTopRight {
  width: 50%;
  height: 1.0667rem;
  text-align: center;
  color: #848484;
  line-height: 1.0667rem;
  font-size: 0.3733rem;
  border-bottom: 1px solid #d7d7d7;
  overflow: hidden;
}

.fontBlue {
  color: #4a94e3 !important;
  border-bottom: 2px solid #4a94e3 !important;
}

.examineScreenFootLeft,
.examineScreenFootRight {
  user-select: none;
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
  height: 1.3333rem;
  display: flex;
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
  /* background: url("/static/img/搜索.png") no-repeat; */
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
  height: 0.6533rem;
  margin-top: 0.11rem;
  font-size: 0.3733rem;
  line-height: 0.6533rem;
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