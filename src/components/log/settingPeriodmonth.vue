// 设置
<template>
  <div class="settingLog">
    <div class="settingLog-list">
      <ul>
        <li class="mountLi" v-for="(item,index) in mLists" :key="index">
          <div @click="mlistClick(index)" :class="{'mountLiShow':ismountLiShow == index}">
            {{item.name}}
          </div>
        </li>
      </ul>
    </div>
    <div :class="{'settingLog-but':true,'settingLog-selbut':isSettingLogSelbut}" @click="confirmClick">
      完成
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
export default {
  components: {},
  data() {
    return {
      ismountLiShow: 0,
      mLists: [],
      isSettingLogSelbut: true // 完成按钮样式变更
    };
  },
  methods: {
    confirmClick() {
      var self = this;
      this.$router.go(-1);
      sessionStorage.setItem("settingPeriodmonthVal", self.ismountLiShow);
    },
    mlistClick(index) {
      this.ismountLiShow = index;
    }
  },
  created: function() {
    var self = this;
    document.title = "选择时间";
    if (this.$route.query.cycleVal) {
      if (this.$route.query.cycleVal * 1 - 1 < 0) {
        this.ismountLiShow = 0;
      } else {
        this.ismountLiShow = this.$route.query.cycleVal * 1 - 1;
      }
    }
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("选择时间");
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
    var standardTime = new Date();
    var y, m, d, h, f;
    y = standardTime.getFullYear();
    m = standardTime.getMonth() + 1;
    m = m > 9 ? m : "0" + m;
    var day = new Date(y, m, 0);
    var daycount = day.getDate();
    for (var i = 0; i < daycount; i++) {
      self.mLists.push({ name: i + 1, show: true });
    }
  },
  watch: {},
  filters: {}
};
</script>
<style scoped>
.mountLiShow {
  background: rgba(67, 144, 225, 1);
  color: #fff;
}
.mountLi > div {
  width: 0.96rem;
  height: 0.96rem;
  line-height: 0.96rem;
  border-radius: 50%;
}
.settingLog-list ul {
  display: flex;
  flex-wrap: wrap;
}
.mountLi {
  width: 14.285714%;
  height: 1.8667rem;
  text-align: center;
  font-size: 0.48rem;
  color: rgba(44, 44, 44, 1);
  color: #000;
  border-bottom: 1px solid #e3e3e3;
  display: flex;
  align-items: center;
  justify-content: center;
}
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

.settingLog-list {
  position: relative;
  width: 100%;
  min-height: 9.3333rem;
  background-color: #fff;
}

.settingLog {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: rgba(241, 241, 241, 1);
  user-select: none;
}
</style>