// 日志报表搜搜
<template>
    <div class="logSearchList">
       <div class="logSearchList-time">
         <div class="logSearchList-time-top">
           选择时间
         </div>
         <div class="logSearchList-time-bot">
           <div class="logSearchList-time-start" @click="setStartDateClick">
             {{setStartDateClickVal}}
           </div>
           <div class="logSearchList-time-end" @click="setEndDateClick">
             {{setEndDateClickVal}}
           </div>
         </div>
       </div>
       <div class="logSearchList-model">
         <div class="logSearchList-model-top">
           选择模板
         </div>
         <div class="logSearchList-model-bot">
           <div v-for="(item,index) in workLists" @click="workListsClick(index)" :class="{'selectModel':isselectModel == index}" :key="index">
             {{item.name}}报
           </div>
         </div>
       </div>
       <div class="logSearchList-but">
         <div class="logSearchListCancel" @click="cancelClick">
           取消
         </div>
         <div class="logSearchListComifg" @click="confirmClick">
           确定
         </div>
       </div>
       <!-- 选择开始时间弹出框 -->
       <v-LogDateStartModel @message="canifmStatrDateClick" @cancel="cancelStartDateClick" :dataState="dataStartStateVal"></v-LogDateStartModel>
        <!-- 选择结束时间弹出框 -->
       <v-LogDateEndModel @message="canifmEndDateClick" @cancel="cancelEndDateClick" :dataState="dataEndStateVal"></v-LogDateEndModel>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import LogDateEndModel from "../cModule/LogDateEndModel";
import LogDateStartModel from "../cModule/LogDateStartModel";
import { Toast } from "mint-ui";
export default {
  components: {
    "v-LogDateEndModel": LogDateEndModel,
    "v-LogDateStartModel": LogDateStartModel
  },
  data() {
    return {
      endTtimestamp: "",
      starttimestamp: "",
      setStartDateClickVal: "请选择开始时间",
      setEndDateClickVal: "请选择结束时间",
      isselectModel: 0,
      workLists: [
        { name: "日", index: "1" },
        { name: "周", index: "2" },
        { name: "月", index: "3" }
      ], // 日周月列表
      dataEndStateVal: false,
      dataStartStateVal: false // 提醒时间弹出控制
    };
  },
  methods: {
    // 取消
    cancelClick() {
      this.$router.go(-1);
      sessionStorage.removeItem("logSearchListStartTtimestamp");
      sessionStorage.removeItem("logSearchListendTtimestamp");
      sessionStorage.removeItem("logSearchListworkListsIndex");
    },
    // 确定
    confirmClick() {
      var self = this;  
      if (this.endTtimestamp && this.starttimestamp) {
        if (this.endTtimestamp >= this.starttimestamp) {
          self.$router.go(-1);
          sessionStorage.setItem(
            "logSearchListStartTtimestamp",
            self.starttimestamp
          );
          sessionStorage.setItem(
            "logSearchListendTtimestamp",
            self.endTtimestamp
          );
          sessionStorage.setItem(
            "logSearchListworkListsIndex",
            self.workLists[self.isselectModel].index
          );
        } else {
          Toast({
            message: "结束时间要大于开始时间",
            position: "bottom"
          });
        }
      } else {
        Toast({
          message: "请选择开始和结束时间",
          position: "bottom"
        });
      }
    },
    workListsClick(index) {
      this.isselectModel = index;
    },
    // 开始-提醒时间弹出
    setStartDateClick() {
      this.dataStartStateVal = true;
    },
    // 开始-提醒时间取消
    cancelStartDateClick() {
      this.dataStartStateVal = false;
    },
    // 开始-提醒时间选中
    canifmStatrDateClick(val) {
      var self = this;
      this.setStartDateClickVal = this.timeSerachFun(val);
      this.starttimestamp = new Date(self.setStartDateClickVal).getTime();
      this.dataStartStateVal = false;
    },
    // 结束-提醒时间弹出
    setEndDateClick() {
      this.dataEndStateVal = true;
    },
    // 结束-提醒时间取消
    cancelEndDateClick() {
      this.dataEndStateVal = false;
    },
    // 结束-提醒时间选中
    canifmEndDateClick(val) {
      var self = this;
      this.setEndDateClickVal = this.timeSerachFun(val);
      this.endTtimestamp = new Date(self.setEndDateClickVal).getTime();
      this.dataEndStateVal = false;
    },
    // 过滤时间
    timeSerachFun(val) {
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
      return y + "-" + m + "-" + d;
    },
    ...mapActions([""])
  },
  created: function() {
    var self = this;
    if (sessionStorage.getItem("logSearchListStartTtimestamp")) {
      this.setStartDateClickVal = this.timeSerachFun(
        sessionStorage.getItem("logSearchListStartTtimestamp") * 1
      );
      this.starttimestamp = new Date(
        sessionStorage.getItem("logSearchListStartTtimestamp") * 1
      ).getTime();
    }
    if (sessionStorage.getItem("logSearchListendTtimestamp")) {
      this.setEndDateClickVal = this.timeSerachFun(
        sessionStorage.getItem("logSearchListendTtimestamp") * 1
      );
      this.endTtimestamp = new Date(
        sessionStorage.getItem("logSearchListendTtimestamp") * 1
      ).getTime();
    }
    if (sessionStorage.getItem("logSearchListworkListsIndex")) {
      this.isselectModel =
        sessionStorage.getItem("logSearchListworkListsIndex") * 1 - 1;
    }
    document.title = "日志报表";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setOperationEvent(0);
        window.BenchJSInterface.setTitle("日志报表");
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
.logSearchListCancel {
  background: rgba(227, 227, 227, 1);
  margin-right: 0.4648rem;
}
.logSearchListComifg {
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
  margin-left: 0.4648rem;
}

.logSearchList-but div {
  width: 1.919rem;
  height: 0.6597rem;
  border-radius: 0.03rem;
  color: #fff;
  line-height: 0.6597rem;
  text-align: center;
  font-size: 0.2699rem;
}
.logSearchList-but {
  display: flex;
  margin-top: 0.4498rem;
  justify-content: center;
}
.selectModel {
  color: rgba(69, 146, 226, 1) !important;
  border: 1px solid #4592e2 !important;
}
.logSearchList-model-bot div:nth-child(1) {
  margin-left: 0.4048rem;
}
.logSearchList-model-bot div {
  width: 1.1544rem;
  height: 0.4198rem;
  background: rgba(255, 255, 255, 1);
  margin-right: 0.4798rem;
  border: 1px solid #e3e3e3;
  text-align: center;
  line-height: 0.4198rem;
  font-size: 0.2099rem;
  color: rgba(44, 44, 44, 1);
}
.logSearchList-model-bot {
  width: 100%;
  display: flex;
  height: 0.4198rem;
  margin-top: 0.1799rem;
}
.logSearchList-model-top {
  margin-top: 0.2999rem;
  height: 0.2099rem;
  font-size: 0.2099rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
  line-height: 0.2099rem;
  margin-left: 0.4048rem;
}
.logSearchList-model {
  width: 100%;
  overflow: hidden;
}
.logSearchList-time-start {
  width: 1.7241rem;
  height: 0.4798rem;
  background: rgba(255, 255, 255, 1);
  border: 1px solid #e3e3e3;
  font-size: 12px;
}
.logSearchList-time-end {
  width: 1.7241rem;
  height: 0.4798rem;
  background: rgba(255, 255, 255, 1);
  margin-left: 1.3193rem;
  border: 1px solid #e3e3e3;
  font-size: 12px;
}
.logSearchList-time-bot::after {
  position: absolute;
  top: 0.2249rem;
  left: 2.084rem;
  height: 0.03rem;
  width: 0.5997rem;
  background-color: #ccc;
  content: "";
}
.logSearchList-time-bot {
  margin-left: 1.3193rem;
  text-align: center;
  line-height: 0.4798rem;
  height: 0.4798rem;
  position: relative;
  display: flex;
  font-size: 0.2099rem;
  color: rgba(44, 44, 44, 1);
}
.logSearchList-time-top {
  width: 0.8696rem;
  height: 0.2099rem;
  font-size: 0.2099rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.2099rem;
  margin-left: 0.4348rem;
}
.logSearchList-time {
  width: 100%;
  height: 0.7196rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e3e3e3;
}
.logSearchList {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>