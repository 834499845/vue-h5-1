<!--日常签到设置-->
<template>
    <div class="setSign">
      <div class="setOne">
        <div>
          <div>是否允许地点微调</div>
          <div>
            <v-swtich :status="statusValOne" @switchmodel="switchmodelClick"></v-swtich>
          </div>
        </div>
        <div v-show="isDistanceVal == 1">
          <div>允许微调距离</div>
          <div @click="setMessageClick">{{messageWayVal}} <span><img src="/static/img/右箭头@3x.png" alt=""></span></div>
        </div>
      </div>
      <div class="setOne">
        <div>
          <div>签到时间</div>
          <div>
            <v-swtich :status="statusValTwo" @switchmodel="switchTimemodelClick"></v-swtich>
          </div>
        </div>
        <div v-show="this.isOpenTimeVal == 1">
          <div>开始时间</div>
          <div @click="setStartTimeClick">{{this.setStarttimeVal}} <span><img src="/static/img/右箭头@3x.png" alt=""></span></div>
        </div>
        <div v-show="this.isOpenTimeVal == 1">
          <div>结束时间</div>
          <div @click="setEndTimeClick">{{this.setEndtimeVal}} <span><img src="/static/img/右箭头@3x.png" alt=""></span></div>
        </div>
      </div>
    <!--选择提醒时间弹出框-->
    <v-timeModel @message="canifmDateClick" :time="timeVal" @cancel="cancelDateClick" :dataState="dataStateVal"></v-timeModel>
    <!--选择提醒方式弹出框-->
    <v-singleSelect :pockerunit="pockerUnitShow" :numLists='numLists' :defStateIndex='defStateIndex' :defIndex='defIndex' @confirm="confirmClick" @cancel="cancelClick" ></v-singleSelect>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import swtich from "../cModule/swtichModel";
import timeModel from "../cModule/timeModel";
import singleSelect from "../cModule/singleSelectSign";
import { Toast } from "mint-ui";
export default {
  components: {
    "v-swtich": swtich,
    "v-singleSelect": singleSelect,
    "v-timeModel": timeModel
  },
  data() {
    return {
      isPhotoVal: "",
      isDistanceVal: "",
      distanceVal: "",
      isOpenTimeVal: 0,
      startTimeVal: "",
      endTimeVal: "",
      pockerUnitShow: false,
      numLists: [],
      numDataLists: ["1000", "2000", "3000", "4000", "5000"],
      defStateIndex: 9999,
      defIndex: 2,

      messageWayVal: "请选择",
      setStarttimeVal: "请选择",
      isStartTime: false,
      setEndtimeVal: "请选择",
      isEndTime: false,
      dataStateVal: false,
      timeVal: "",
      statusValOne: "",
      statusValTwo: "",
      spotAdjustmentNormalClickTrueOrFalse: true,
      orgIdVal: "",
      lngVal: "",
      latVal: "",
      rangeVal: "",
      closeSiteAddressTrueOrFalse: true
    };
  },
  created: function() {
    var self = this;
    this.lookNormalSignSet();
    document.title = "签到设置";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("签到设置");
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setRightTwoBut("", "");
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
  },
  methods: {
    // 日常-查看部门签到设置
    lookNormalSignSet() {
      var self = this;
      self.messageWayVal = "请选择";
      self.$store.commit("setMutVuexisLoading", true);
      self
        .getSignApiSignGetSetting({
          orgId: sessionStorage.getItem("singOrgId")
        })
        .then(data => {
          self.$store.commit("setMutVuexisLoading", false);
          if (data.statusCode == 200) {
            if (data.data) {
              if (data.data.distanceStatus) {
                self.isDistanceVal = data.data.distanceStatus;
                self.statusValOne = data.data.distanceStatus;
                if (data.data.distance) {
                  self.messageWayVal = data.data.distance;
                }
                if (data.data.range) {
                  self.rangeVal = data.data.range;
                }
              }
              if (data.data.timeStatus) {
                self.isOpenTimeVal = data.data.timeStatus;
                self.statusValTwo = data.data.timeStatus;
                if (data.data.startTime || data.data.endTime) {
                  self.statusValTwo = 1;
                  if (data.data.startTime) {
                    self.setStarttimeVal = data.data.startTime;
                  }
                  if (data.data.endTime) {
                    self.setEndtimeVal = data.data.endTime;
                  }
                }
              }
              if (data.data.lng) {
                self.lngVal = data.data.lng;
              }
              if (data.data.lat) {
                self.lngVal = data.data.lat;
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
    // 关闭地点微调
    closeSiteAddress() {
      var self = this;
      var obj = {
        photoStatus: 0,
        distanceStatus: self.isDistanceVal,
        timeStatus: self.isOpenTimeVal,
        orgId: sessionStorage.getItem("singOrgId"),
        distance: self.rangeVal
      };
      var object = JSON.stringify(obj);
      if (self.closeSiteAddressTrueOrFalse == true) {
        self.closeSiteAddressTrueOrFalse = false;
        self
          .getSignApiSignSetting(object)
          .then(data => {
            self.closeSiteAddressTrueOrFalse = true;
            if (data.statusCode == 200) {
              Toast({
                message: "操作成功",
                position: "bottom"
              });
              self.messageWayVal = "请选择";
              sessionStorage.removeItem("siteO");
              sessionStorage.removeItem("siteP");
              sessionStorage.removeItem("siteaddress");
              sessionStorage.removeItem("sitename");
            } else {
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            self.closeSiteAddressTrueOrFalse = true;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    // 日常-地点微调
    spotAdjustmentNormalClick() {
      var self = this;
      var obj = {
        photoStatus: 1,
        distanceStatus: self.isDistanceVal,
        timeStatus: self.isOpenTimeVal,
        orgId: sessionStorage.getItem("singOrgId")
      };
      if (self.isDistanceVal == 1) {
        if (self.messageWayVal == "请选择") {
        } else {
          obj.distance = self.messageWayVal;
        }
      }
      if (self.isOpenTimeVal == 1) {
        if (self.setStarttimeVal == "请选择") {
        } else {
          obj.startTime = self.setStarttimeVal;
        }
        if (self.setEndtimeVal == "请选择") {
        } else {
          obj.endTime = self.setEndtimeVal;
        }
      } else {
        self.setStarttimeVal = "请选择";
        self.setEndtimeVal = "请选择";
      }
      var object = JSON.stringify(obj);
      if (self.spotAdjustmentNormalClickTrueOrFalse == true) {
        self.spotAdjustmentNormalClickTrueOrFalse = false;
        self
          .getSignApiSignSetting(object)
          .then(data => {
            self.spotAdjustmentNormalClickTrueOrFalse = true;
            if (data.statusCode == 200) {
              Toast({
                message: "操作成功",
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
            self.spotAdjustmentNormalClickTrueOrFalse = true;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    // 选择模板弹出
    setMessageClick() {
      this.numLists = this.numDataLists;
      this.defStateIndex = 2;
      if (this.isDistanceVal == 1) {
        this.pockerUnitShow = true;
      } else {
        Toast({
          message: "请先开启允许微调开关",
          position: "bottom"
        });
      }
    },
    // 选择模板确认
    confirmClick(val1, val2) {
      this.messageWayVal = val1;
      this.pockerUnitShow = false;
      this.spotAdjustmentNormalClick();
    },
    // 选择模板取消
    cancelClick() {
      this.pockerUnitShow = false;
    },
    // 开始时间弹出
    setStartTimeClick() {
      this.isEndTime = false;
      this.timeVal = this.setStarttimeVal;
      this.dataStateVal = true;
      this.isStartTime = true;
    },
    // 结束时间弹出
    setEndTimeClick() {
      this.isStartTime = false;
      this.timeVal = this.setEndtimeVal;
      this.dataStateVal = true;
      this.isEndTime = true;
    },
    // 提醒时间取消
    cancelDateClick() {
      this.dataStateVal = false;
    },
    // 提醒时间选中
    canifmDateClick(val) {
      if (this.isStartTime == true) {
        this.setStarttimeVal = val;
      } else if (this.isEndTime == true) {
        this.setEndtimeVal = val;
      }
      this.dataStateVal = false;
      this.spotAdjustmentNormalClick();
    },
    // 是否允许微调距离
    switchmodelClick(val) {
      if (val == false) {
        this.isDistanceVal = 1;
        this.statusValOne = 1;
        this.spotAdjustmentNormalClick();
      } else {
        this.isDistanceVal = 0;
        this.statusValOne = 0;
        this.closeSiteAddress();
      }
    },
    //是否允许设置时间
    switchTimemodelClick(val) {
      if (val == false) {
        this.isOpenTimeVal = 1;
        this.statusValTwo = 1;
      } else {
        this.isOpenTimeVal = 0;
        this.statusValTwo = 0;
      }
      this.spotAdjustmentNormalClick();
    },
    ...mapActions(["getSignApiSignSetting", "getSignApiSignGetSetting"])
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
.setSign {
  height: 100vh;
  width: 100%;
  background: rgba(247, 247, 247, 1);
  overflow: hidden;
  user-select: none;
}

.setSign > div {
  margin-top: 0.32rem;
  overflow: hidden;
}

.setOne > div {
  padding-left: 0.4267rem;
  position: relative;
}

.setOne {
  background: rgba(255, 255, 255, 1);
}

.setOne > div {
  height: 1.1733rem;
  display: flex;
  align-items: center;
}

.setOne > div:nth-child(1),
.setOne > div:nth-child(2) {
  border-bottom: 1px solid #f7f7f7;
}
.setOne:nth-child(1) > div:nth-child(2) {
  /* border: none; */
  border-bottom: 1px solid #f7f7f7;
}

.setOne > div:nth-child(1) > div:nth-child(1) {
  min-width: 3.5133rem;
  height: 0.4267rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
  margin-right: 4.4rem;
  margin-top: -0.2133rem;
}

.setOne:nth-child(1) > div:nth-child(1) > div:nth-child(1) {
  margin-right: 4.4rem;
}

.setOne > div:nth-child(2) > div:nth-child(1) {
  min-width: 2.56rem;
  height: 0.4267rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
  margin-right: 5.04rem;
  margin-top: -0.2133rem;
}

.setOne > div:nth-child(2) > div:nth-child(2) {
  height: 0.3733rem;
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
  line-height: 0.3733rem;
  width: 1.68rem;
}

.setOne > div:nth-child(3) > div:nth-child(1) {
  width: 2.56rem;
  height: 0.4267rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
  margin-right: 5.04rem;
  margin-top: -0.2133rem;
}

.setOne > div:nth-child(3) > div:nth-child(2) {
  height: 0.3733rem;
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
  line-height: 0.3733rem;
  width: 1.68rem;
}

.setOne:nth-child(1) > div:nth-child(2) > div:nth-child(2) {
  position: relative;
}

.setOne:nth-child(1) span {
  position: absolute;
  width: 0.5867rem;
  height: 0.5867rem;
  padding-left: 0.1333rem;
  top: 0rem;
  right: -0.0533rem;
}
.setOne img {
  width: 0.2933rem;
  height: 0.2933rem;
  margin-top: 0.0533rem;
}

.setOne:nth-child(2) > div:nth-child(2) > div:nth-child(2) {
  position: relative;
}
.setOne:nth-child(2) > div:nth-child(3) > div:nth-child(2) {
  position: relative;
}

.setOne:nth-child(2) span {
  position: absolute;
  width: 0.5867rem;
  height: 0.5867rem;
  padding-left: 0.1333rem;
  top: 0rem;
  right: -0.0533rem;
}
</style>