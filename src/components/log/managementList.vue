// 日志管理
<template>
  <div class="managementList">
    <div class="managementList-title">
      <div :class="{'managementList-title-left':true,'managementList-title-select':isAllLogTitleSelect == 1}" @click="navClick(1)">
        已发送人
      </div>
      <div :class="{'managementList-title-right':true,'managementList-title-select':isAllLogTitleSelect == 2}" @click="navClick(2)">
        未发送人
      </div>
    </div>
    <div class="managementList-time">
      {{NewDate}}
    </div>
    <!-- 已发送人 -->
    <v-managementListModel v-show="listOrSearchSHow" :lists="listData"></v-managementListModel>
    <!-- 未发送人 -->
    <v-managementListSeletModel v-show="!listOrSearchSHow" :lists="listData"></v-managementListSeletModel>
    <!-- 新增审批加载中 -->
    <div v-show="isAddShowTost" class="AddShowTost">
      <mt-spinner type="snake" color="#4390E1"></mt-spinner>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { Toast } from "mint-ui";
import managementListModel from "../cModule/managementListModel";
import managementListSeletModel from "../cModule/managementListSeletModel";
export default {
  components: {
    "v-managementListModel": managementListModel,
    "v-managementListSeletModel": managementListSeletModel
  },
  data() {
    return {
      isAddShowTost: false,
      pageNoVal: 1,
      pageSizeVal: 30,
      listOrSearchSHow: true, // 页面切换
      listData: [], // 渲染数据
      NewDate: "", // 当前日期
      manLeftLists: [], // 已发送
      manRightLists: [], // 未发送
      isAllLogTitleSelect: 1 // 导航选中
    };
  },
  mounted() {
    var self = this;
  },
  methods: {
    // 选中点击跳转
    // 导航切换
    navClick(index) {
      var self = this;
      self.isAllLogTitleSelect = index;
      self.listData = [];
      self.manLeftLists = [];
      self.manRightLists = [];
      self.pageNoVal = 1;
      var standardTime = new Date();
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
      var listObj = {}
      if (sessionStorage.getItem("messageTimeValTime")) {
        self.NewDate = sessionStorage.getItem("messageTimeValTime");
        listObj = {
          memberId: sessionStorage.getItem("logMemberId"),
          orgId: sessionStorage.getItem("logOrgId"),
          submitType: sessionStorage.getItem("messageWayValMessage"),
          date: sessionStorage.getItem("messageTimeValTime"),
          pageNo: self.pageNoVal,
          pageSize: self.pageSizeVal
        };
      } else {
        self.NewDate = y + "-" + m + "-" + d;
        listObj = {
          memberId: sessionStorage.getItem("logMemberId"),
          orgId: sessionStorage.getItem("logOrgId"),
          submitType: 0,
          date: self.NewDate,
          pageNo: self.pageNoVal,
          pageSize: self.pageSizeVal
        };
      }

      if (index == 2) {
        self.listOrSearchSHow = false;
        self.isAddShowTost = true;
        self
          .getlogreportmanagerunsubmitlist(JSON.stringify(listObj))
          .then(data => {
            self.isAddShowTost = false;
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  data.data.records.forEach(function(ele, ind) {
                    self.manLeftLists.push({
                      color: ele.color,
                      id: ele.id,
                      name: ele.memberName,
                      mobile: ele.mobile,
                      profile: ele.profile,
                      show: true
                    });
                  });
                  self.listData = self.manLeftLists;
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
            self.isAddShowTost = false;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      } else {
        self.listOrSearchSHow = true;
        self.isAddShowTost = true;
        self
          .getlogreportmanagersubmitlist(JSON.stringify(listObj))
          .then(data => {
            self.isAddShowTost = false;
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  self.manRightLists = data.data.records;
                  self.listData = self.manRightLists;
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
            self.isAddShowTost = false;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
      sessionStorage.setItem("listOrSearchSHowVal", index);
    },
    listFun() {
      var self = this;
      var standardTime = new Date();
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
      var listObj = {};
      self.listData = [];
      self.manRightLists = [];
      if (sessionStorage.getItem("messageTimeValTime")) {
        self.NewDate = sessionStorage.getItem("messageTimeValTime");
        listObj = {
          memberId: sessionStorage.getItem("logMemberId"),
          orgId: sessionStorage.getItem("logOrgId"),
          submitType: sessionStorage.getItem("messageWayValMessage"),
          date: sessionStorage.getItem("messageTimeValTime"),
          pageNo: self.pageNoVal,
          pageSize: self.pageSizeVal
        };
      } else {
        self.NewDate = y + "-" + m + "-" + d;
        listObj = {
          memberId: sessionStorage.getItem("logMemberId"),
          orgId: sessionStorage.getItem("logOrgId"),
          submitType: 0,
          date: self.NewDate,
          pageNo: self.pageNoVal,
          pageSize: self.pageSizeVal
        };
      }

      if (sessionStorage.getItem("listOrSearchSHowVal") == 2) {
        self.isAllLogTitleSelect = sessionStorage.getItem(
          "listOrSearchSHowVal"
        );
        self.listOrSearchSHow = false;
        self.manLeftLists = [];
        self.$store.commit("setMutVuexisLoading", true);
        self
          .getlogreportmanagerunsubmitlist(JSON.stringify(listObj))
          .then(data => {
            self.$store.commit("setMutVuexisLoading", false);
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  data.data.records.forEach(function(ele, ind) {
                    self.manLeftLists.push({
                      color: ele.color,
                      id: ele.id,
                      name: ele.memberName,
                      mobile: ele.mobile,
                      profile: ele.profile,
                      show: true
                    });
                  });
                  self.listData = self.manLeftLists;
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
      } else {
        self.isAllLogTitleSelect = 1;
        self.listOrSearchSHow = true;
        self.$store.commit("setMutVuexisLoading", true);
        self
          .getlogreportmanagersubmitlist(JSON.stringify(listObj))
          .then(data => {
            self.$store.commit("setMutVuexisLoading", false);
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  self.manRightLists = data.data.records;
                  self.listData = self.manRightLists;
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
    },
    ...mapActions([
      "getlogreportmanagerunsubmitlist",
      "getlogreportmanagersubmitlist"
    ])
  },
  created: function() {
    var self = this;
    document.title = "列表";
    self.listFun();
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        if (sessionStorage.getItem("messageWayValMessage")) {
          var messageWayValSessage = sessionStorage.getItem(
            "messageWayValMessage"
          );
          var messageWayValTitle = "";
          if (messageWayValSessage == "1") {
            messageWayValTitle = "日报";
          } else if (messageWayValSessage == "3") {
            messageWayValTitle = "月报";
          } else if (messageWayValSessage == "2") {
            messageWayValTitle = "周报";
          }
          window.BenchJSInterface.setTitle(messageWayValTitle);
        } else {
          window.BenchJSInterface.setTitle("列表");
        }
        window.BenchJSInterface.setRightBtn(
          "筛选",
          "javascript:window.pathFun();"
        );

        window.BenchJSInterface.setTopBarColor(1);
      }
    } else {
      if (sessionStorage.getItem("messageWayValMessage")) {
        var messageWayValSessage = sessionStorage.getItem(
          "messageWayValMessage"
        );
        var messageWayValTitle = "";
        if (messageWayValSessage == "1") {
          messageWayValTitle = "日报";
        } else if (messageWayValSessage == "3") {
          messageWayValTitle = "月报";
        } else if (messageWayValSessage == "2") {
          messageWayValTitle = "周报";
        }
        document.title = messageWayValTitle;
      } else {
        document.title = "列表";
      }

      var messgaeObj = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          naviType: 0,
          titles: [{ name: "筛选", code: "shai", notEnable: 0 }]
        },
        callbackMethod: "pathFun"
      };
      if (window.webkit) {
        window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
          messgaeObj
        );
      }
    }
    window.pathFun = function() {
      self.$router.push({
        path: "/managementListSearch"
      });
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
.AddShowTost {
  width: 100vw;
  height: calc(100vh - 1.2233rem);
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 1.2233rem;
  left: 0;
  background: rgba(255, 255, 255, 1);
}
.managementList-time {
  height: 1.0133rem;
  width: 100%;
  background-color: rgba(241, 241, 241, 1);
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 1.0133rem;
  padding-left: 0.4267rem;
  overflow: hidden;
}

.managementList-title-select {
  color: rgba(67, 144, 225, 1) !important;
  position: relative;
}

.managementList-title-select::after {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 0.0533rem;
  left: 0rem;
  content: "";
  background-color: #4390e1;
}

.managementList-title-left,
.managementList-title-right {
  position: relative;
  width: 50%;
  height: 1.2rem;
  text-align: center;
  line-height: 1.2rem;
  font-size: 0.3733rem;
  color: rgba(44, 44, 44, 1);
}

.managementList-title {
  height: 1.2rem;
  background-color: #fff;
  width: 100%;
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #e3e3e3;
}

.managementList {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: rgba(241, 241, 241, 1);
  user-select: none;
}
</style>