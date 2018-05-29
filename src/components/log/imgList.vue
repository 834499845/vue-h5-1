// 图片展示
<template>
    <div class="imgList">
      <!--  v-for="(item,index) in imgLists" :key="index"  -->
      <div class="imgList-main" @touchstart="imgtouchStart($event)" @touchmove="imgtouchMove($event)" @touchend="imgtouchEnd($event)"  :style="{'transform':istranslate3d,'transition':istransition,'webkitTransform':iswebkitTransform,'webkitTransition':iswebkitTransition}">
          <div  v-for="(item,index) in imgLists" :key="index" :style="{'position': isAbsolute,'left':index * (item.widths) + 'px'}" class="imgList-main-one">
            <img :src="item.img" alt="">
          </div>
      </div>
      <div class="imgList-num">
        <small>{{selectIndex}}</small>/{{allIndex}}
      </div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isAbsolute: "absolute", // 滑动内容绝对经纬
      isLeft: "0px", // 定位left
      selectIndex: 1, // 当前的idnex
      allIndex: 0, // 所有idnex
      pockerShowstartY: 0,
      pockerShowEndY: 0,
      pockerShowMoveY: 0,
      isWidth: 0, // 屏幕的宽度
      maxHeight: 0, // 总位移
      temps: 0,
      istranslate3d: "translate3d(0, 0, 0)",
      iswebkitTransform: "translate3d(0, 0, 0)",
      istransition: "transform 0.2s ease-out",
      iswebkitTransition: "transform 0.2s ease-out",
      imgLists: [], // 图片替代数组
      Lists: [] // 图片数据
    };
  },
  beforeRouteLeave(to, from, next) {
    sessionStorage.removeItem("lookimg");
    next();
  },
  mounted() {
    var self = this;
    this.Lists = JSON.parse(sessionStorage.getItem("lookimg"));
    this.isWidth = screen.width;
    this.Lists.forEach(function(ele, ind) {
      self.imgLists.push({ img: ele, widths: self.isWidth });
    });
    this.maxHeight = (this.imgLists.length - 1) * this.isWidth;
    this.allIndex = this.imgLists.length;
  },
  components: {},
  methods: {
    imgtouchStart(event) {
      this.pockerShowstartY = 0;
      this.pockerShowstartY = event.changedTouches[0].pageX;
    },
    imgtouchMove(event) {
      var self = this;
      this.pockerShowMoveY = event.changedTouches[0].pageX;
      var moveNum = this.pockerShowstartY - this.pockerShowMoveY;
      if (self.temps == self.maxHeight || self.temps == 0) {
        if (self.temps == 0) {
          self.istranslate3d = "translate3d(-" + moveNum + "px,0, 0)";
          self.iswebkitTransform = "translate3d(-" + moveNum + "px,0, 0)";
        } else {
          self.istranslate3d =
            "translate3d(-" + (self.temps + moveNum) + "px,0, 0)";
          self.iswebkitTransform =
            "translate3d(-" + (self.temps + moveNum) + "px,0, 0)";
        }
      } else {
        if (self.temps == 0 && moveNum < 0) {
          self.istranslate3d =
            "translate3d( " + 1.5 * this.isWidth + "px,0, 0)";
          self.iswebkitTransform =
            "translate3d(" + 1.5 * this.isWidth + "px,0, 0)";
        } else {
          self.istranslate3d =
            "translate3d(-" + (self.temps + moveNum) + "px,0, 0)";
          self.iswebkitTransform =
            "translate3d(-" + (self.temps + moveNum) + "px,0, 0)";
        }
      }
    },
    imgtouchEnd(event) {
      var self = this;
      this.pockerShowEndY = 0;
      this.pockerShowEndY = Math.abs(event.changedTouches[0].pageX);
      var tempDis = self.temps + (this.pockerShowstartY - this.pockerShowEndY);
      self.temps =
        tempDis < 0 ? 0 : tempDis < self.maxHeight ? tempDis : self.maxHeight;
      var yNumber = self.temps % this.isWidth;
      if (yNumber < this.isWidth / 2) {
        self.temps = self.temps - yNumber;
      } else {
        self.temps = self.temps + (this.isWidth - yNumber);
      }
      self.istranslate3d = "translate3d(-" + self.temps + "px,0, 0)";
      self.iswebkitTransform = "translate3d(-" + self.temps + "px,0, 0)";
      self.selectIndex = self.temps / this.isWidth + 1;
    },
    ...mapActions([""])
  },
  created: function() {
    var self = this;
    document.title = "";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setTitle("");
        window.BenchJSInterface.setTopBarColor(1);
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
.imgList-main-thr {
  position: absolute;
  top: 0;
  left: 200vw;
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.imgList-main-two {
  position: absolute;
  top: 0;
  left: 100vw;
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.imgList-main-one {
  top: 0;
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.imgList-main > div {
  width: 100vw;
  height: 100vh;
}
.slide-fade-enter-active {
  transition: all 0.7s ease;
}

.slide-fade-enter,
.slide-fade-leave-active {
  transform: translateX(30px);
  opacity: 0;
}
.imgList img {
  max-width: 100%;
  max-height: 100%;
}
.imgList-num small {
  font-size: 0.48rem;
  color: rgba(69, 146, 226, 1);
}
.imgList-num {
  height: 0.48rem;
  font-size: 0.48rem;
  color: #848484;
  position: absolute;
  bottom: 0.9867rem;
  width: 100%;
  text-align: center;
}
.imgList-main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
}
.imgList {
  position: relative;
  height: 100vh;
  overflow: hidden;
  width: 100vw;
  background: rgba(44, 44, 44, 1);
}
</style>