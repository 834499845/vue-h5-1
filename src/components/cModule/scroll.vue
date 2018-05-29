<template lang="html">
<!--     :class="{'down':(state===0),'up':(state==1),refresh:(state===2),touch:touching}" -->
    <div class="yo-scroll" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)" @scroll="(onInfinite || infiniteLoading) ? onScroll($event) : undefined">
        <section class="inner" :style="{ 'webkitTransform':'translate3d(0, ' + top + 'px, 0)',transform: 'translate3d(0, ' + top + 'px, 0)','transition':'transform 0ms ease-out' }">
            <header class="pull-refresh">
                <!-- <slot name="pull-refresh"> -->
                    <span class="down-tip">{{downtipVal}}</span>
                    <!-- <span class="up-tip">松开更新</span>
                    <span class="refresh-tip">更新中...</span> -->
                <!-- </slot> -->
            </header>
            <slot></slot>
            <footer class="load-more">
                <slot name="load-more">
                    <span>{{loadingText}}</span>
                </slot>
            </footer>
        </section>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  props: {
    offset: {
      type: Number,
      default: 40
    },
    loadingText: {
      type: String,
      default: ""
    },
    loadingscrollTop: {
      type: Number,
      default: 0
    },
    enableInfinite: {
      type: Boolean,
      default: true
    },
    enableRefresh: {
      type: Boolean,
      default: true
    },
    onRefresh: {
      type: Function,
      default: undefined,
      required: false
    },
    onInfinite: {
      type: Function,
      default: undefined,
      require: false
    }
  },
  watch: {},
  mounted() {},
  updated() {},
  created() {},
  data() {
    return {
      downtipVal: "下拉刷新",
      startMoveY: 0, // 移动方向动向
      top: 0,
      state: 0,
      startY: 0,
      touching: false,
      infiniteLoading: false // 下拉加载状态控制
    };
  },
  methods: {
    touchStart(e) {
      this.startMoveY = e.changedTouches[0].clientY;
      // 点击位置距离顶部距离
      this.startY = e.targetTouches[0].pageY;
      // 列表溢出容器上边距
      this.startScroll = this.$el.scrollTop || 0;
      // 开始拖动列表
      this.touching = true;
    },
    touchMove(e) {
      // 列表溢出内容开始时，且状态拖动状态开始
      if (!this.enableRefresh || this.$el.scrollTop > 0 || !this.touching) {
        return;
      } else {
        let diff = e.targetTouches[0].pageY - this.startY;
        if (diff > 0) {
          // e.preventDefault();
        }
        this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0);
        // this.top = diff;
        if (this.state === 2) {
          return;
        }
        if (this.top >= this.offset) {
          // e.preventDefault();
          // this.state = 1;
          // this.downtipVal = "松开刷新";
        } else {
          // this.state = 0;
          // this.downtipVal = "下拉刷新";
        }
      }
    },
    touchEnd(e) {
      var distance = e.changedTouches[0].clientY - this.startMoveY;
      if (distance > 100) {
        // 上拉加载完成后，重置上拉加载状态
        this.infiniteLoading = false;
      }
      if (!this.enableRefresh) return;
      this.touching = false;
      if (this.state === 2) {
        // in refreshing
        this.state = 2;
        this.top = this.offset;
        return;
      }
      if (this.top >= this.offset) {
        // do refresh
        this.refresh();
      } else {
        // cancel refresh
        this.state = 0;
        this.top = 0;
      }
    },
    // 下拉加载事件
    refresh() {
      this.state = 2;
      this.top = this.offset;
      this.onRefresh(this.refreshDone);
    },
    // 下拉加载回调
    refreshDone() {
      this.state = 0;
      this.top = 0;
      // 上拉加载完成后，重置上拉加载状态
      this.infiniteLoading = false;
    },
    // 下拉加载调用方法
    infinite() {
      // 停止加载
      this.infiniteLoading = true;
      this.onInfinite(this.infiniteDone);
    },
    // 下拉加载完成后回调
    infiniteDone(val) {
      // done 回来时，1为有数据，有数据继续加载，2没数据，无数据则停止加载
      if (val == 1) {
        this.infiniteLoading = false;
      } else {
        this.infiniteLoading = true;
      }
    },
    // 监听列表移动事件
    onScroll(e) {
      // 当数据到达底部时候，禁止加载
      if (!this.enableInfinite || this.infiniteLoading == true) {
        return;
      } else {
        // 容器高度
        let outerHeight = this.$el.clientHeight;
        // 列表总高度
        let innerHeight = this.$el.querySelector(".inner").clientHeight;
        // 当前滚动的距离
        let scrollTop = this.$el.scrollTop;
        // 日志-所有
        this.$store.commit("MutVuexMylogScrollTop", scrollTop);
        // 日志-未读
        this.$store.commit("MutVuexVuexUnreadLogTop", scrollTop);
        // 审批-待我审批的
        this.$store.commit("setMutVuexWaitedApprovalTop", scrollTop);
        // 审批-我已审批的
        this.$store.commit("setMutVuexCompletedApprovalTop", scrollTop);
        // 审批-我发出的审批的
        this.$store.commit("setMutVuexStartedListsTop", scrollTop);
        // 审批-抄送我的审批的
        this.$store.commit("setMutVuexCopyListsTop", scrollTop);
        // 有无下拉加载这栏目，
        let ptrHeight = this.onRefresh
          ? this.$el.querySelector(".pull-refresh").clientHeight
          : 0;
        // 上拉加载高度
        let infiniteHeight = this.$el.querySelector(".load-more").clientHeight;
        // 列表总高度-容器高度-当前滚动的距离-下拉高度
        let bottom = innerHeight - outerHeight - scrollTop - ptrHeight;
        // 如果当前位置已经到达上拉加载区域，触发上拉事件
        if (bottom < infiniteHeight) {
          this.infinite();
        }
      }
    }
  }
};
</script>
<style>
.yo-scroll {
  position: absolute;
  top: 0rem;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  /* -webkit-overflow-scrolling: touch; */
  user-select: none;
}

.yo-scroll .inner {
  position: absolute;
  top: -1.3333rem;
  width: 100%;
  transition-duration: 300ms;
}

.yo-scroll .pull-refresh {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 1.3333rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.yo-scroll.touch .inner {
  /* transition-duration: 0ms; */
  /* transform 0.2s ease-out */
  transition-delay: 0;
}

.yo-scroll.down .down-tip {
  display: block;
}

.yo-scroll.up .up-tip {
  display: block;
}

.yo-scroll.refresh .refresh-tip {
  display: block;
}

/* .yo-scroll .down-tip,
.yo-scroll .refresh-tip,
.yo-scroll .up-tip {
  display: none;
} */

.yo-scroll .load-more {
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(44, 44, 44, 1);
}
</style>