// 设置
<template>
    <div class="settingSelectModelLog">
      <div class="settingLog-list" v-for="(item,index) in modelList" :key="index" @click="modelClick(index)">
        <div class="sl-l-left">
          <div class="sl-l-left-o">
            {{item.name}}
          </div>
          <div class="sl-l-left-t">
             {{item.name}}报
          </div>
        </div>
        <div class="sl-l-right">
          <img src="/static/img/右箭头@3x.png" alt="">
        </div>
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      modelList: [
        { name: "日", path: "" },
        { name: "周", path: "" },
        { name: "月", path: "" }
      ]
    };
  },
  components: {},
  methods: {
    modelClick(index) {
      this.$router.push({
        path:
          "/settingDetailsLogG?m=" +
          index +
          "&authority=" +
          sessionStorage.getItem("authority") +
          "&a=1"
      });
    }
  },
  mounted() {},
  created: function() {
    var self = this;
    sessionStorage.removeItem("jobTimeValSes");
    sessionStorage.removeItem("messageWayValindex");
    sessionStorage.removeItem("settingPeriodmonthVal");
    sessionStorage.removeItem("logremindSwitchVal");
    sessionStorage.removeItem("settingPeriodVal");
    sessionStorage.setItem("authority", "1");

    document.title = "选择模板";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("选择模板");
        window.BenchJSInterface.setTopBarColor(1);
        window.BenchJSInterface.setRightBtn("", "");
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
  filters: {}
};
</script>
<style scoped>
.sl-l-left-t {
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.4267rem;
  margin-left: 0.32rem;
}
.sl-l-left-o {
  width: 0.7467rem;
  height: 0.7467rem;
  text-align: center;
  line-height: 0.8rem;
  font-size: 0.4267rem;
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
}
.sl-l-left {
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  margin-left: 0.4267rem;
  display: flex;
  align-items: center;
  height: 100%;
}

.sl-l-right {
  width: 0.2933rem;
  /* height: 0.2933rem; */
  margin-right: 0.4267rem;
}
.sl-l-right img {
  width: 100%;
  height: 100%;
}
.settingLog-list:nth-child(1) {
  margin-top: 0.32rem;
}
.settingLog-list:nth-child(1) ::after {
  position: absolute;
  bottom: 0;
  right: 0;
  width: calc(100% - 1.4133rem);
  height: 1px;
  background-color: #e3e3e3;
  content: "";
}
.settingLog-list:nth-child(2) ::after {
  position: absolute;
  bottom: 0;
  right: 0;
  width: calc(100% - 1.4133rem);
  height: 1px;
  background-color: #e3e3e3;
  content: "";
}
.settingLog-list {
  width: 100%;
  height: 1.28rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 1);
  position: relative;
}
.settingSelectModelLog {
  height: 100vh;
  user-select: none;
  width: 100%;
  overflow: hidden;
  background-color: rgba(241, 241, 241, 1);
}
</style>