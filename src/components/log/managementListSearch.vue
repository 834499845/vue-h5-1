// 设置-日报提醒
<template>
  <div class="settingLog">
    <div class="settingLog-list">
      <div class="sl-l-left">
        选择时间
      </div>
      <div class="sl-l-right" @click="setDateClick">
        <div class="sl-l-rl">
          {{messageTimeVal}}
        </div>
        <div class="sl-l-rr">
          <img src="/static/img/右箭头@3x.png" alt="">
        </div>
      </div>
    </div>
    <div class="settingLog-list">
      <div class="sl-l-left">
        选择模板
      </div>
      <div class="sl-l-right" @click="setMessageClick">
        <div class="sl-l-rl">
          {{messageWayVal}}
        </div>
        <div class="sl-l-rr">
          <img src="/static/img/右箭头@3x.png" alt="">
        </div>
      </div>
    </div>
    <div :class="{'settingLog-but':true,'settingLog-selbut':isSettingLogSelbut}" @click="confirmAddClick">
      完成
    </div>
    <!--选择提醒时间弹出框-->
    <v-timeModel @message="canifmDateClick" :time="timeVal" @cancel="cancelDateClick" :dataState="dataStateVal"></v-timeModel>
    <!--选择提醒方式弹出框-->
    <v-singleSelect :pockerunit="pockerUnitShow" :numLists='numLists' :defStateIndex='defStateIndex' :defIndex='defIndex' @confirm="confirmClick" @cancel="cancelClick" ></v-singleSelect>
  </div>
</template>
<script>
import singleSelect from "../cModule/singleSelect";
import timeModel from "../cModule/dateModel";
import { Toast } from "mint-ui";
export default {
  components: {
    "v-timeModel": timeModel,
    "v-singleSelect": singleSelect
  },
  data() {
    return {
      timeVal: "",
      pockerUnitShow: false,
      numLists: [],
      numDataLists: ["日报", "周报", "月报"],
      defStateIndex: 1,
      defIndex: 1,
      isSettingLogSelbut: false, // 完成按钮样式变更
      dataStateVal: false, // 提醒时间弹出控制
      messageStateVal: false, // 提醒方式弹出框控制
      messageTimeVal: "请选择", // 提醒时间val
      messageWayVal: "请选择" // 提醒方式Val
    };
  },
  methods: {
    // 确定
    confirmAddClick() {
      if (this.messageTimeVal == "请选择" || this.messageWayVal == "请选择") {
        if (this.messageTimeVal == "请选择") {
          Toast({
            message: "请选择时间",
            position: "bottom"
          });
        } else if (this.messageWayVal == "请选择") {
          Toast({
            message: "请选择模板",
            position: "bottom"
          });
        }
        this.isSettingLogSelbut = false;
      } else {
        this.$router.go(-1);
        var messageWayValSessage = 0;
        if (this.messageWayVal == "日报") {
          messageWayValSessage = 1;
        } else if (this.messageWayVal == "月报") {
          messageWayValSessage = 3;
        } else if (this.messageWayVal == "周报") {
          messageWayValSessage = 2;
        }
        sessionStorage.setItem("messageTimeValTime", this.messageTimeVal);
        sessionStorage.setItem("messageWayValMessage", messageWayValSessage);
      }
    },
    // 选择模板弹出
    setMessageClick() {
      this.numLists = this.numDataLists;
      this.pockerUnitShow = true;
    },
    // 选择模板确认
    confirmClick(val) {
      this.messageWayVal = val;
      this.pockerUnitShow = false;
    },
    // 选择模板取消
    cancelClick() {
      this.pockerUnitShow = false;
    },
    // 提醒时间弹出
    setDateClick() {
      this.dataStateVal = true;
    },
    // 提醒时间取消
    cancelDateClick() {
      this.dataStateVal = false;
    },
    // 提醒时间选中
    canifmDateClick(val) {
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
      this.messageTimeVal = y + "-" + m + "-" + d;
      this.dataStateVal = false;
    }
  },
  created: function() {
    var self = this;
    document.title = "筛选";
    if (sessionStorage.getItem("messageTimeValTime")) {
      this.messageTimeVal = sessionStorage.getItem("messageTimeValTime");
    }
    if (sessionStorage.getItem("messageWayValMessage")) {
      var messageWayValSessage = sessionStorage.getItem("messageWayValMessage");
      if (messageWayValSessage == "1") {
        this.messageWayVal = "日报";
      } else if (messageWayValSessage == "3") {
        this.messageWayVal = "月报";
      } else if (messageWayValSessage == "2") {
        this.messageWayVal = "周报";
      }
    }
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setTitle("筛选");
      }
    } else {
      var messgaeObj = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          naviType: 0,
          titles: [{ name: "", code: "" }]
        }
      };
      if (window.webkit) {
        window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
          messgaeObj
        );
      }
    }
  },
  mounted: function() {},
  watch: {
    messageTimeVal(val) {
      if (this.messageWayVal == "请选择" || val == "请选择") {
        this.isSettingLogSelbut = false;
      } else {
        this.isSettingLogSelbut = true;
      }
    },
    messageWayVal(val) {
      if (this.messageTimeVal == "请选择" || val == "请选择") {
        this.isSettingLogSelbut = false;
      } else {
        this.isSettingLogSelbut = true;
      }
    }
  },
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
  font-size: 0.48rem;
}

.sl-l-left {
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  margin-left: 0.4267rem;
}

.sl-l-rl {
  min-width: 1.1467rem;
  height: 0.3733rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.3933rem;
  text-align: right;
}

.sl-l-rr {
  margin-left: 0.1067rem;
  width: 0.2933rem;
}
.sl-l-rr img {
  width: 100%;
  height: 100%;
}
.sl-l-right {
  margin-right: 0.4267rem;
  height: 100%;
  min-width: 0.5rem;
  display: flex;
  align-items: center;
}

.settingLog-list {
  position: relative;
  width: 100%;
  height: 1.28rem;
  display: flex;
  justify-content: space-between;
  margin-top: 0.32rem;
  align-items: center;
  background: rgba(255, 255, 255, 1);
}

.settingLog {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: rgba(241, 241, 241, 1);
}
</style>