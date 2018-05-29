// 版权信息
<template>
    <div class="copyRight">
          <div class="copyRightContent">伯通 Copyright2.0版本 陕西必康制药集团控股有限公司</div>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  components: {},
  methods: {},
  created: function() {
    var self = this;
    document.title = "版权信息";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setTitle("版权信息");
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
  watch: {},
  filters: {}
};
</script>
<style scoped>
.copyRight {
  height: 100vh;
  width: 100%;
}
.copyRightContent {
  margin-top: 30px;
  font-size: 0.325rem;
  text-align: center;
}
</style>