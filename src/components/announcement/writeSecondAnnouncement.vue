// 发公告
<template>
    <div class="writeSecondAnnouncement">
      <div class="bigDiv">
        <textarea maxlength="200000"
        placeholder="在此输入内容…" class="enterContentInput" v-model="contentVal"></textarea>
      </div>
      <div class="sendNotice" @click="finishNoticeClick">
        <div :class="{'sendNoticeTextT':true,'sendNoticeTextF':isSettingNotice}">完成</div>
      </div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isSettingNotice: false, //完成按钮样式变更
      contentVal: "" //输入内容
    };
  },
  components: {},
  methods: {
    //跳转至发公告页面
    finishNoticeClick() {
      if (this.contentVal) {
        sessionStorage.setItem("noticeContent", this.contentVal);
        this.$router.go(-1);
      }
    },
    ...mapActions([""])
  },
  created: function() {
    var self = this;
    if (sessionStorage.getItem("noticeContent")) {
      this.contentVal = sessionStorage.getItem("noticeContent");
    }

    document.title = "发公告";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn();
        window.BenchJSInterface.setTitle("发公告");
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
  watch: {
    contentVal: function(val) {
      // this.contentVal = val.replace(/^\s+|\s+$/g, "");
      if (val.length > 0) {
        this.isSettingNotice = true;
      } else {
        this.isSettingNotice = false;
        sessionStorage.removeItem("noticeContent");
      }
    }
  },
  filters: {
    // 过滤时间
    timeFun: function(val) {
      if (val) {
        var standardTime = new Date(val * 1);
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
.writeSecondAnnouncement {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.bigDiv {
  padding: 0.4267rem;
  width: 9.1467rem;
  height: calc(100vh - 60px);
}
.enterContentInput {
  width: 9.1467rem;
  height: calc(100vh - 68px);
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
  border: 0;
}
.enterContentInput::-webkit-input-placeholder {
  /* WebKit browsers */
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
}
.enterContentInput:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
}

.enterContentInput::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
}

.enterContentInput:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
}
.sendNotice {
  width: 100%;
  height: 1.2rem;
  position: fixed;
  bottom: 0;
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
}
.sendNoticeTextT {
  font-size: 0.48rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  line-height: 1.28rem;
  position: absolute;
  left: 50%;
  margin-left: -0.5rem;
  opacity: 0.4;
}
.sendNoticeTextF {
  opacity: 1 !important;
}
</style>