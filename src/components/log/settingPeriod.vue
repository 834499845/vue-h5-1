// 设置
<template>
  <div class="settingLog">
    <div @click="listSelectClick(index)" class="settingLog-list settingLog-listActive" v-for="(item,index) in workLists" :key="index">
      <div class="sl-l-left">
        {{item.name}}
      </div>
      <!-- ,'sl-l-rightSelect':!item.show -->
      <div :class="{'sl-l-right':true}">
        <img v-show="isitemShowIndex == index" src="/static/img/选中@3x.png" alt="">
        <!-- <img v-show="isitemShowIndex != index" src="/static/img/未选中.png" alt=""> -->
      </div>
    </div>
    <div :class="{'settingLog-but':true}" @click="confirmClick">
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
      isitemShowIndex: 0,
      workLists: [
        { name: "星期一", show: true, selectIndex: 2 },
        { name: "星期二", show: true, selectIndex: 3 },
        { name: "星期三", show: true, selectIndex: 4 },
        { name: "星期四", show: true, selectIndex: 5 },
        { name: "星期五", show: true, selectIndex: 6 },
        { name: "星期六", show: true, selectIndex: 7 },
        { name: "星期天", show: true, selectIndex: 1 }
      ]
    };
  },
  methods: {
    // 完成
    confirmClick() {
      var self = this;
      sessionStorage.setItem(
        "settingPeriodVal",
        self.workLists[self.isitemShowIndex].selectIndex
      );
      self.$router.go(-1);
    },
    listSelectClick(index) {
      this.isitemShowIndex = index;
    }
  },
  created: function() {
    var self = this;
    if (this.$route.query.cycleVal) {
      var cycleStr = this.$route.query.cycleVal;
      if (cycleStr == 2) {
        this.isitemShowIndex = 0;
      } else if (cycleStr == 3) {
        this.isitemShowIndex = 1;
      } else if (cycleStr == 4) {
        this.isitemShowIndex = 2;
      } else if (cycleStr == 5) {
        this.isitemShowIndex = 3;
      } else if (cycleStr == 6) {
        this.isitemShowIndex = 4;
      } else if (cycleStr == 7) {
        this.isitemShowIndex = 5;
      } else if (cycleStr == 1) {
        this.isitemShowIndex = 6;
      }
    }
    document.title = "选择时间";
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
  color: rgba(255, 255, 255, 1);
  text-align: center;
  line-height: 1.1733rem;
  font-size: 0.48rem;
}

.sl-l-left {
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  margin-left: 0.4267rem;
}

.sl-l-rightSelect {
  width: 0.5867rem;
  height: 0.5867rem;
  margin-right: 0.4267rem;
}
.sl-l-right {
  width: 0.5867rem;
  height: 0.5867rem;
  margin-right: 0.4267rem;
}
.sl-l-right img {
  width: 100%;
  height: 100%;
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