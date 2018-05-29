// 新功能介绍
<template>
  <div class="newFun">
    <div class="newFunIntrBox">
      <div class="intrTitle">2.0版本新功能介绍</div>
      <div class="borderBottom"></div>
      <div class="intrValBox">
        <div class="intrBold">1、联系人</div>
        <div class="intrVal">本次版本的联系人页面取消了之前版本的添加联系人功能，只可与企业内部人员进行沟通，更专业高效。</div>
        <div class="intrBold">2、所有页面布局</div>
        <div class="intrVal">较上一版本而言对软件的所有界面及布局进行了更加人性化的设计及调整，用户使用起来更加便捷、轻松。</div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapActions } from "vuex";
  import { Toast } from "mint-ui";
  export default {
    data() {
      return {};
    },
    components: {},
    methods: {
      ...mapActions([])
    },
    created: function () {
      var self = this;
      document.title = "新功能介绍";
      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isAndroid) {
        if (window.BenchJSInterface) {
          window.BenchJSInterface.setRightBtn("", "");
          window.BenchJSInterface.setTitle("新功能介绍");
        }
      } else {
        var setNav = {
          methodName: "invokeNavigationRightItemFromJS",
          params: {
            naviType: 0,
            titles: [{ name: "", code: "" }]
          },
          callbackMethod: "pathFun"
        };
        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
            setNav
          );
        }
      }
      window.pathFun = function (val) { };
    },
    watch: {},
    filters: {
      // 过滤时间
      timeFun: function (val) {
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
  .newFun {
    height: 100vh;
    width: 100%;
  }

  .newFunIntrBox {
    padding: 0.4rem;
  }

  .intrTitle {
    width: 100%;
    height: 0.875rem;
    font-size: 0.475rem;
  }

  .borderBottom {
    width: calc(100% - 0.8rem);
    height: 1px;
    background-color: #e3e3e3;
    position: absolute;
    left: 0.4rem;
  }

  .intrValBox {
    padding-left: 0.125rem;
    margin-top: 0.125rem;
  }

  .intrBold {
    font-size: 0.3733rem;
    margin-bottom: 0.125rem;
    color: #2c2c2c;
  }

  .intrVal {
    font-size: 0.4rem;
    margin-bottom: 0.25rem;
    color: #848484;
  }
</style>