// 设置-周报，月报提醒
<template>
  <div :class="{'settingLog':true}">
    <div class="settingLog-list settingLog-listActive">
      <div class="sl-l-left">
        {{titleName}}
      </div>
      <div class="sl-l-right">
        <v-swtich :stateSwitch="stateSwitchVal" @switchmodel="switchmodelClick"></v-swtich>
      </div>
    </div>
    <div class="settingLog-list settingLog-listActive" v-show="datShow && titleNameShow">
      <div class="sl-l-left">
        提醒周期
      </div>
      <div class="sl-l-right" @click="setWorkClick">
        <div :class="{'sl-l-rl':true,'sl-l-rlSelect':issllrlSelect = messageWorkVal != '请选择' ? true : false}">
          {{messageWorkVal}}
        </div>
        <div class="sl-l-rr">
          <img src="/static/img/右箭头@3x.png" alt="">
        </div>
      </div>
    </div>
    <div class="settingLog-list settingLog-listActive" v-show="titleNameShow">
      <div class="sl-l-left">
        提醒时间
      </div>
      <div class="sl-l-right" @click="setDateClick">
        <div :class="{'sl-l-rl':true,'sl-l-rlSelect':issllrlSelect = jobTimeVal != '请选择' ? true : false}">
          {{jobTimeVal}}
        </div>
        <div class="sl-l-rr">
          <img src="/static/img/右箭头@3x.png" alt="">
        </div>
      </div>
    </div>
    <div class="settingLog-list" v-show="titleNameShow">
      <div class="sl-l-left">
        提醒方式
      </div>
      <div class="sl-l-right" @click="setMessageClick">
        <div :class="{'sl-l-rl':true,'sl-l-rlSelect':issllrlSelect = messageWayVal != '请选择' ? true : false}">
          {{messageWayVal}}
        </div>
        <div class="sl-l-rr">
          <img src="/static/img/右箭头@3x.png" alt="">
        </div>
      </div>
    </div>
    <div v-show="titleNameShow" :class="{'settingLog-but':true,'settingLog-selbut':isSettingLogSelbut}" @click="confirmClick">
      完成
    </div>
    <!--选择提醒方式弹出框-->
    <v-timeModel @message="canifmDateClick" :time="timeVal" @cancel="cancelDateClick" :dataState="dataStateVal"></v-timeModel>
    <!--选择提醒方式弹出框-->
    <v-messageModel @message="canifmMessageClick" @cancel="cancelMessageClick" :messageState="messageStateVal"></v-messageModel>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapActions } from "vuex";
import swtich from "../cModule/swtichModelLOg";
import messageModel from "../cModule/messageModel";
import timeModel from "../cModule/timeModel";
export default {
  components: {
    "v-swtich": swtich,
    "v-messageModel": messageModel,
    "v-timeModel": timeModel
  },
  data() {
    return {
      titleNameShow: false,
      stateSwitchVal: false, // 开关默认状态
      confirmClickTrue: false,
      timeVal: "", // 时间默认
      remindSwitchVal: 1,
      submitTypeVal: 1,
      cycleVal: 1,
      cycleTypeVal: "DAY",
      remindModeVal: "",
      titleName: "未提交人员提醒", // 管理员和员工显示
      datShow: false, // 控制显示周期
      isSettingLogSelbut: true, // 完成按钮样式变更
      dataStateVal: false, // 提醒时间弹出控制
      messageStateVal: false, // 提醒方式弹出框控制
      jobTimeVal: "请选择", // 提醒时间val
      messageWorkVal: "请选择", // 提醒中期Val
      messageWayVal: "请选择" // 提醒方式Val
    };
  },
  methods: {
    // 获取数据
    listFun() {
      var self = this;
      var listObj = {
        memberId: sessionStorage.getItem("logMemberId"),
        submitType: self.submitTypeVal
      };
      self.stateSwitchVal = false;
      self
        .getlogremindinfo(listObj)
        .then(data => {
          if (data.statusCode == 200) {
            if (data.data) {
              if (data.data.remindSwitch == 0 || data.data.remindSwitch == 1) {
                if (sessionStorage.getItem("logremindSwitchVal")) {
                  if (sessionStorage.getItem("logremindSwitchVal") == 1) {
                    self.stateSwitchVal = false;
                    self.titleNameShow = true;
                  } else {
                    self.stateSwitchVal = true;
                    self.titleNameShow = false;
                  }
                  self.remindSwitchVal = sessionStorage.getItem(
                    "logremindSwitchVal"
                  );
                } else {
                  self.remindSwitchVal = data.data.remindSwitch;
                  if (data.data.remindSwitch == 1) {
                    self.stateSwitchVal = false;
                    self.titleNameShow = true;
                  } else {
                    self.stateSwitchVal = true;
                    self.titleNameShow = false;
                  }
                }
                if (data.data.remindSwitch == 1) {
                  if (data.data.remindMode) {
                    if (sessionStorage.getItem("messageWayValindex")) {
                      if (sessionStorage.getItem("messageWayValindex") == 1) {
                        self.messageWayVal = "应用内消息推送";
                      } else if (
                        sessionStorage.getItem("messageWayValindex") == 2
                      ) {
                        self.messageWayVal = "短信";
                      } else if (
                        sessionStorage.getItem("messageWayValindex") == 3
                      ) {
                        self.messageWayVal = "DANG一下";
                      }
                      self.remindModeVal = sessionStorage.getItem(
                        "messageWayValindex"
                      );
                    } else {
                      if (data.data.remindMode == 1) {
                        self.messageWayVal = "应用内消息推送";
                      } else if (data.data.remindMode == 2) {
                        self.messageWayVal = "短信";
                      } else if (data.data.remindMode == 3) {
                        self.messageWayVal = "DANG一下";
                      }
                      self.remindModeVal = data.data.remindMode;
                    }
                  } else {
                    if (sessionStorage.getItem("messageWayValindex")) {
                      if (sessionStorage.getItem("messageWayValindex") == 1) {
                        self.messageWayVal = "应用内消息推送";
                      } else if (
                        sessionStorage.getItem("messageWayValindex") == 2
                      ) {
                        self.messageWayVal = "短信";
                      } else if (
                        sessionStorage.getItem("messageWayValindex") == 3
                      ) {
                        self.messageWayVal = "DANG一下";
                      }
                      self.remindModeVal = sessionStorage.getItem(
                        "messageWayValindex"
                      );
                    } else {
                      self.messageWayVal = "请选择";
                    }
                  }

                  if (data.data.jobTime) {
                    if (sessionStorage.getItem("jobTimeValSes")) {
                      self.jobTimeVal = sessionStorage.getItem("jobTimeValSes");
                    } else {
                      self.jobTimeVal = data.data.jobTime;
                    }
                  } else {
                    if (sessionStorage.getItem("jobTimeValSes")) {
                      self.jobTimeVal = sessionStorage.getItem("jobTimeValSes");
                    } else {
                      self.jobTimeVal = "请选择";
                    }
                  }

                  if (
                    data.data.cycleType == "WEEK" ||
                    data.data.cycleType == "MONTH"
                  ) {
                    if (data.data.cycleType == "WEEK") {
                      if (sessionStorage.getItem("settingPeriodVal")) {
                        if (
                          sessionStorage.getItem("settingPeriodVal") ==
                          data.data.cycle
                        ) {
                          self.cycleVal = data.data.cycle;
                        } else {
                          self.cycleVal = sessionStorage.getItem(
                            "settingPeriodVal"
                          );
                        }
                      } else {
                        self.cycleVal = data.data.cycle;
                      }
                      if (self.cycleVal == 2) {
                        self.messageWorkVal = "星期一";
                      } else if (self.cycleVal == 3) {
                        self.messageWorkVal = "星期二";
                      } else if (self.cycleVal == 4) {
                        self.messageWorkVal = "星期三";
                      } else if (self.cycleVal == 5) {
                        self.messageWorkVal = "星期四";
                      } else if (self.cycleVal == 6) {
                        self.messageWorkVal = "星期五";
                      } else if (self.cycleVal == 7) {
                        self.messageWorkVal = "星期六";
                      } else if (self.cycleVal == 1) {
                        self.messageWorkVal = "星期七";
                      }
                    } else {
                      if (sessionStorage.getItem("settingPeriodmonthVal")) {
                        var settingPeriodmonthValNum =
                          sessionStorage.getItem("settingPeriodmonthVal") * 1;
                        settingPeriodmonthValNum = settingPeriodmonthValNum + 1;
                        if (settingPeriodmonthValNum == data.data.cycle) {
                          self.cycleVal = data.data.cycle;
                        } else {
                          self.cycleVal = settingPeriodmonthValNum;
                        }
                      } else {
                        self.cycleVal = data.data.cycle;
                      }
                      self.messageWorkVal = self.cycleVal + "号";
                    }
                  } else {
                    if (sessionStorage.getItem("settingPeriodVal")) {
                      self.cycleVal = sessionStorage.getItem(
                        "settingPeriodVal"
                      );
                      if (self.cycleVal == 2) {
                        self.messageWorkVal = "星期一";
                      } else if (self.cycleVal == 3) {
                        self.messageWorkVal = "星期二";
                      } else if (self.cycleVal == 4) {
                        self.messageWorkVal = "星期三";
                      } else if (self.cycleVal == 5) {
                        self.messageWorkVal = "星期四";
                      } else if (self.cycleVal == 6) {
                        self.messageWorkVal = "星期五";
                      } else if (self.cycleVal == 7) {
                        self.messageWorkVal = "星期六";
                      } else if (self.cycleVal == 1) {
                        self.messageWorkVal = "星期七";
                      }
                    } else if (
                      sessionStorage.getItem("settingPeriodmonthVal")
                    ) {
                      self.cycleVal =
                        sessionStorage.getItem("settingPeriodmonthVal") * 1 + 1;
                      self.messageWorkVal = self.cycleVal + "号";
                    } else {
                      self.messageWorkVal = "请选择";
                    }
                  }
                } else {
                  if (
                    data.data.cycleType == "WEEK" ||
                    data.data.cycleType == "MONTH"
                  ) {
                    if (data.data.cycleType == "WEEK") {
                      if (sessionStorage.getItem("settingPeriodVal")) {
                        self.cycleVal = sessionStorage.getItem(
                          "settingPeriodVal"
                        );
                      } else {
                        self.cycleVal = 99999;
                      }
                      if (self.cycleVal == 2) {
                        self.messageWorkVal = "星期一";
                      } else if (self.cycleVal == 3) {
                        self.messageWorkVal = "星期二";
                      } else if (self.cycleVal == 4) {
                        self.messageWorkVal = "星期三";
                      } else if (self.cycleVal == 5) {
                        self.messageWorkVal = "星期四";
                      } else if (self.cycleVal == 6) {
                        self.messageWorkVal = "星期五";
                      } else if (self.cycleVal == 7) {
                        self.messageWorkVal = "星期六";
                      } else if (self.cycleVal == 1) {
                        self.messageWorkVal = "星期七";
                      } else {
                        self.messageWorkVal = "请选择";
                      }
                    } else {
                      if (sessionStorage.getItem("settingPeriodmonthVal")) {
                        var settingPeriodmonthValNum =
                          sessionStorage.getItem("settingPeriodmonthVal") * 1;
                        settingPeriodmonthValNum = settingPeriodmonthValNum + 1;

                        self.cycleVal = settingPeriodmonthValNum;
                        self.messageWorkVal = self.cycleVal + "号";
                      } else {
                        self.messageWorkVal = "请选择";
                      }
                    }
                  } else {
                    if (sessionStorage.getItem("settingPeriodVal")) {
                      self.cycleVal = sessionStorage.getItem(
                        "settingPeriodVal"
                      );
                      if (self.cycleVal == 2) {
                        self.messageWorkVal = "星期一";
                      } else if (self.cycleVal == 3) {
                        self.messageWorkVal = "星期二";
                      } else if (self.cycleVal == 4) {
                        self.messageWorkVal = "星期三";
                      } else if (self.cycleVal == 5) {
                        self.messageWorkVal = "星期四";
                      } else if (self.cycleVal == 6) {
                        self.messageWorkVal = "星期五";
                      } else if (self.cycleVal == 7) {
                        self.messageWorkVal = "星期六";
                      } else if (self.cycleVal == 1) {
                        self.messageWorkVal = "星期七";
                      }
                    } else if (
                      sessionStorage.getItem("settingPeriodmonthVal")
                    ) {
                      self.cycleVal =
                        sessionStorage.getItem("settingPeriodmonthVal") * 1 + 1;
                      self.messageWorkVal = self.cycleVal + "号";
                    } else {
                      self.messageWorkVal = "请选择";
                    }
                  }

                  if (sessionStorage.getItem("jobTimeValSes")) {
                    self.jobTimeVal = sessionStorage.getItem("jobTimeValSes");
                  } else {
                    self.jobTimeVal = "请选择";
                  }
                  if (sessionStorage.getItem("messageWayValindex")) {
                    if (sessionStorage.getItem("messageWayValindex") == 1) {
                      self.messageWayVal = "应用内消息推送";
                    } else if (
                      sessionStorage.getItem("messageWayValindex") == 2
                    ) {
                      self.messageWayVal = "短信";
                    } else if (
                      sessionStorage.getItem("messageWayValindex") == 3
                    ) {
                      self.messageWayVal = "DANG一下";
                    }
                    self.remindModeVal = sessionStorage.getItem(
                      "messageWayValindex"
                    );
                  } else {
                    self.messageWayVal = "请选择";
                  }
                }
              } else {
                if (sessionStorage.getItem("logremindSwitchVal")) {
                  if (sessionStorage.getItem("logremindSwitchVal") == 1) {
                    self.stateSwitchVal = false;
                  } else {
                    self.stateSwitchVal = true;
                  }
                } else {
                  self.stateSwitchVal = false;
                }
              }
            } else {
              if (sessionStorage.getItem("logremindSwitchVal")) {
                if (sessionStorage.getItem("logremindSwitchVal") == 1) {
                  self.stateSwitchVal = false;
                } else {
                  self.stateSwitchVal = true;
                }
              } else {
                self.stateSwitchVal = false;
              }
              if (self.$route.query.m == 1) {
                if (sessionStorage.getItem("settingPeriodVal")) {
                  self.cycleVal = sessionStorage.getItem("settingPeriodVal");
                  if (self.cycleVal == 2) {
                    self.messageWorkVal = "星期一";
                  } else if (self.cycleVal == 3) {
                    self.messageWorkVal = "星期二";
                  } else if (self.cycleVal == 4) {
                    self.messageWorkVal = "星期三";
                  } else if (self.cycleVal == 5) {
                    self.messageWorkVal = "星期四";
                  } else if (self.cycleVal == 6) {
                    self.messageWorkVal = "星期五";
                  } else if (self.cycleVal == 7) {
                    self.messageWorkVal = "星期六";
                  } else if (self.cycleVal == 1) {
                    self.messageWorkVal = "星期七";
                  }
                } else {
                  self.messageWorkVal = "请选择";
                }
              }
              if (self.$route.query.m == 2) {
                if (sessionStorage.getItem("settingPeriodmonthVal")) {
                  self.cycleVal =
                    sessionStorage.getItem("settingPeriodmonthVal") * 1 + 1;
                  self.messageWorkVal = self.cycleVal + "号";
                } else {
                  self.messageWorkVal = "请选择";
                }
              }
              if (sessionStorage.getItem("jobTimeValSes")) {
                self.jobTimeVal = sessionStorage.getItem("jobTimeValSes");
              } else {
                self.jobTimeVal = "请选择";
              }
              if (sessionStorage.getItem("messageWayValindex")) {
                if (sessionStorage.getItem("messageWayValindex") == 1) {
                  self.messageWayVal = "应用内消息推送";
                } else if (sessionStorage.getItem("messageWayValindex") == 2) {
                  self.messageWayVal = "短信";
                } else if (sessionStorage.getItem("messageWayValindex") == 3) {
                  self.messageWayVal = "DANG一下";
                }
                self.remindModeVal = sessionStorage.getItem(
                  "messageWayValindex"
                );
              } else {
                self.messageWayVal = "请选择";
              }
              if (
                self.messageWayVal == "请选择" ||
                self.jobTimeVal == "请选择" ||
                self.messageWorkVal == "请选择"
              ) {
                self.isSettingLogSelbut = false;
              } else {
                self.isSettingLogSelbut = true;
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
    // 确认
    confirmClick() {
      var self = this;
      if (self.isSettingLogSelbut == true) {
        if (self.confirmClickTrue == false) {
          self.confirmClickTrue = true;
          if (self.$route.query.m == 0) {
            if (self.jobTimeVal != "请选择" && self.messageWayVal != "请选择") {
              var listObj = {
                remindSwitch: self.remindSwitchVal,
                submitType: self.submitTypeVal,
                cycleType: self.cycleTypeVal,
                jobTime: self.jobTimeVal,
                remindMode: self.remindModeVal,
                memberId: sessionStorage.getItem("logMemberId"),
                orgId: sessionStorage.getItem("logOrgId"),
                isManager: sessionStorage.getItem("isManager")
              };
              self.cycleTypeVal = "DAY";
              self
                .getlogremindsave(JSON.stringify(listObj))
                .then(data => {
                  self.confirmClickTrue = false;
                  if (data.statusCode == 200) {
                    this.$router.go(-1);
                    Toast({
                      message: "设置成功",
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
                  self.confirmClickTrue = false;
                  Toast({
                    message: "服务器异常",
                    position: "bottom"
                  });
                });
            } else {
              self.confirmClickTrue = false;
              if (self.jobTimeVal == "请选择") {
                Toast({
                  message: "请选择提醒时间",
                  position: "bottom"
                });
              } else if (self.messageWayVal == "请选择") {
                Toast({
                  message: "请选择提醒方式",
                  position: "bottom"
                });
              }
            }
          } else {
            if (
              self.jobTimeVal != "请选择" &&
              self.messageWorkVal != "请选择" &&
              self.messageWayVal != "请选择"
            ) {
              var listObj = {
                memberId: sessionStorage.getItem("logMemberId"),
                orgId: sessionStorage.getItem("logOrgId"),
                remindSwitch: self.remindSwitchVal,
                submitType: self.submitTypeVal,
                cycleType: self.cycleTypeVal,
                jobTime: self.jobTimeVal,
                remindMode: self.remindModeVal,
                isManager: sessionStorage.getItem("isManager")
              };
              if (self.$route.query.m == 1) {
                listObj["cycle"] = self.cycleVal;
                listObj.cycleType = "WEEK";
              } else if (self.$route.query.m == 2) {
                listObj["cycle"] = self.cycleVal;
                listObj.cycleType = "MONTH";
              } else {
                listObj.cycleType = "DAY";
              }
              self
                .getlogremindsave(JSON.stringify(listObj))
                .then(data => {
                  self.confirmClickTrue = false;
                  if (data.statusCode == 200) {
                    this.$router.go(-1);
                    sessionStorage.removeItem("settingPeriodVal");
                    Toast({
                      message: "设置成功",
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
                  self.confirmClickTrue = false;
                  Toast({
                    message: "服务器异常",
                    position: "bottom"
                  });
                });
            } else {
              self.confirmClickTrue = false;
              if (self.messageWorkVal == "请选择") {
                Toast({
                  message: "请选择提醒周期",
                  position: "bottom"
                });
              } else if (self.jobTimeVal == "请选择") {
                Toast({
                  message: "请选择提醒时间",
                  position: "bottom"
                });
              } else if (self.messageWayVal == "请选择") {
                Toast({
                  message: "请选择提醒方式",
                  position: "bottom"
                });
              }
            }
          }
        }
      }
    },
    // 获取开关的值
    switchmodelClick(val) {
      var self = this;
      if (val == false) {
        self.remindSwitchVal = 1;
        self.titleNameShow = true;
      } else {
        self.remindSwitchVal = 0;
        self.titleNameShow = false;
        if (self.$route.query.m == 0) {
          var listObj = {
            remindSwitch: 0,
            submitType: 1,
            cycleType: "DAY",
            jobTime: "09:17",
            remindMode: 2,
            memberId: sessionStorage.getItem("logMemberId"),
            orgId: sessionStorage.getItem("logOrgId"),
            isManager: sessionStorage.getItem("isManager")
          };
          self.cycleTypeVal = "DAY";
          self
            .getlogremindsave(JSON.stringify(listObj))
            .then(data => {
              self.confirmClickTrue = false;
              if (data.statusCode == 200) {
                this.$router.go(-1);
                Toast({
                  message: "已关闭日报提醒",
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
              self.confirmClickTrue = false;
              Toast({
                message: "服务器异常",
                position: "bottom"
              });
            });
        } else {
          var listObj = {
            memberId: sessionStorage.getItem("logMemberId"),
            orgId: sessionStorage.getItem("logOrgId"),
            remindSwitch: 0,
            cycleType: "",
            submitType: "",
            jobTime: "09:17",
            remindMode: 1,
            isManager: sessionStorage.getItem("isManager")
          };
          if (self.$route.query.m == 1) {
            listObj["cycle"] = "4";
            listObj.cycleType = "WEEK";
            listObj.submitType = 2;
          } else if (self.$route.query.m == 2) {
            listObj["cycle"] = "1";
            listObj.cycleType = "MONTH";
            listObj.submitType = 3;
          }
          self
            .getlogremindsave(JSON.stringify(listObj))
            .then(data => {
              self.confirmClickTrue = false;
              if (data.statusCode == 200) {
                this.$router.go(-1);
                if (self.$route.query.m == 1) {
                  Toast({
                    message: "已关闭周报提醒",
                    position: "bottom"
                  });
                } else if (self.$route.query.m == 2) {
                  Toast({
                    message: "已关闭月报提醒",
                    position: "bottom"
                  });
                }
              } else {
                Toast({
                  message: data.statusMessage,
                  position: "bottom"
                });
              }
            })
            .catch(msg => {
              self.confirmClickTrue = false;
              Toast({
                message: "服务器异常",
                position: "bottom"
              });
            });
        }
      }
      sessionStorage.setItem("logremindSwitchVal", self.remindSwitchVal);
    },
    // 提醒方式弹出
    setMessageClick() {
      this.messageStateVal = true;
    },
    // 提醒方式选择
    canifmMessageClick(val) {
      this.messageStateVal = false;
      this.messageWayVal = val;

      if (this.messageWayVal == "应用内消息推送") {
        this.remindModeVal = 1;
      } else if (this.messageWayVal == "短信") {
        this.remindModeVal = 2;
      } else if (this.messageWayVal == "DANG一下") {
        this.remindModeVal = 3;
      }
      sessionStorage.setItem("messageWayValindex", this.remindModeVal);
      this.isSettingLogSelbut = true;
    },
    // 提醒方式取消
    cancelMessageClick() {
      this.messageStateVal = false;
    },
    // 提醒时间弹出
    setDateClick() {
      this.dataStateVal = true;
      this.timeVal = this.jobTimeVal;
    },
    // 提醒时间取消
    cancelDateClick() {
      this.dataStateVal = false;
    },
    // 提醒时间选中
    canifmDateClick(val) {
      this.dataStateVal = false;
      this.jobTimeVal = val;
      sessionStorage.setItem("jobTimeValSes", this.jobTimeVal);
      this.isSettingLogSelbut = true;
    },
    // 提醒周期
    setWorkClick() {
      if (this.$route.query.m == 1) {
        this.$router.push({
          path:
            "/settingPeriod?m=" +
            this.$route.query.m +
            "&authority=" +
            this.$route.query.authority +
            "&a=2" +
            "&cycleVal=" +
            this.cycleVal
        });
      } else {
        this.$router.push({
          path:
            "/settingPeriodmonth?m=" +
            this.$route.query.m +
            "&authority=" +
            this.$route.query.authority +
            "&a=3" +
            "&cycleVal=" +
            this.cycleVal
        });
      }
    },
    ...mapActions(["getlogremindsave", "getlogremindinfo"])
  },
  created: function() {
    var self = this;
  },
  mounted() {
    var self = this;

    if (this.$route.query.authority == 1) {
      this.titleName = "发送提醒";
    } else {
      this.titleName = "未提交人员提醒";
    }

    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (this.$route.query.m == "0") {
      self.submitTypeVal = 1;
      if (isAndroid) {
        if (window.BenchJSInterface) {
          window.BenchJSInterface.setTitle("日报");
          window.BenchJSInterface.setRightBtn("", "");
          window.BenchJSInterface.setTopBarColor(1);
        } else {
          var setNav = {
            methodName: "invokeNavigationRightItemFromJS",
            params: {
              naviType: 0,
              titles: [{ name: "筛选", code: "shai", notEnable: 0 }]
            }
          };
          if (window.webkit) {
            window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
              setNav
            );
          }
        }
      }
      document.title = "日报";
      this.datShow = false;
    } else if (this.$route.query.m == 1) {
      self.submitTypeVal = 2;
      if (isAndroid) {
        if (window.BenchJSInterface) {
          window.BenchJSInterface.setTitle("周报");
          window.BenchJSInterface.setTopBarColor(1);
          window.BenchJSInterface.setRightBtn("", "");
        } else {
          var setNav = {
            methodName: "invokeNavigationRightItemFromJS",
            params: {
              naviType: 0,
              titles: [{ name: "筛选", code: "shai", notEnable: 0 }]
            }
          };
          if (window.webkit) {
            window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
              setNav
            );
          }
        }
      }
      document.title = "周报";
      this.datShow = true;
    } else if (this.$route.query.m == 2) {
      self.submitTypeVal = 3;
      if (isAndroid) {
        if (window.BenchJSInterface) {
          window.BenchJSInterface.setTitle("月报");
          window.BenchJSInterface.setTopBarColor(1);
          window.BenchJSInterface.setRightBtn("", "");
        }
      } else {
        var setNav = {
          methodName: "invokeNavigationRightItemFromJS",
          params: {
            naviType: 0,
            titles: [{ name: "", code: "" }]
          }
        };
        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
            setNav
          );
        }
      }
      document.title = "月报";
      this.datShow = true;
    }
    self.listFun();
  },
  watch: {},
  filters: {}
};
</script>
<style scoped>
.settingLog-selbut {
  color: rgba(255, 255, 255, 1) !important;
}

.settingLog-but {
  width: 8.08rem;
  height: 1.1733rem;
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
  border-radius: 0.0533rem;
  margin: 0 auto;
  margin-top: 0.96rem;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  line-height: 1.1733rem;
  font-size: 18px;
}

.sl-l-left {
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  margin-left: 0.4267rem;
}
.sl-l-rlSelect {
  color: #2c2c2c !important;
}
.sl-l-rl {
  min-width: 1.1467rem;
  height: 0.3733rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 1.34rem;
  text-align: right;
  height: 100%;
}

.sl-l-rr {
  margin-left: 0.1067rem;
  width: 0.2933rem;
  display: flex;
  align-items: center;
}
.sl-l-rr img {
  width: 100%;
  height: 100%;
}
.sl-l-right {
  margin-right: 0.4267rem;
  height: 100%;
  width: 5.5rem;
  display: flex;
  align-items: center;
  display: flex;
  justify-content: flex-end;
}

.settingLog-listActive ::after {
  position: absolute;
  bottom: 0;
  right: 0;
  width: calc(100% - 0.4267rem);
  height: 1px;
  background-color: #e3e3e3;
  content: "";
}

.settingLog-list:nth-child(1) {
  margin-top: 0.32rem;
}

.settingLog-list {
  position: relative;
  width: 100%;
  height: 1.28rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 1);
}

.settingLog {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: rgba(241, 241, 241, 1);
  user-select: none;
}
</style>