// 设置
<template>
    <div class="settingLog">
      <div class="settingLog-list">
        <div class="sl-l-left">
          发送设置
        </div>
        <div class="sl-l-right" @click="setClick">

        </div>
      </div>
      <div class="settingLog-tost">
        可设置不同模板下，发送日志的时间，提醒时间及提醒方式
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  components: {},
  methods: {
    setClick() {
      this.$router.push({
        path: "/settingSelectModelLog"
      });
    }
  },
  created: function() {},
  watch: {},
  filters: {
  }
};
</script>
<style scoped>
.settingLog-tost {
  min-height: 0.32rem;
  font-size: 0.32rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.47rem;
  width: 8.8533rem;
  margin: 0 auto;
  margin-top: 0.4267rem;
}
.sl-l-left {
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  margin-left: 0.4267rem;
}

.sl-l-right {
  width: 0.3733rem;
  height: 0.3733rem;
  margin-right: 0.4267rem;
  background: url("/static/img/smallimg.png") no-repeat;
  background-position: -175px -114px;
}

.settingLog-list {
  width: 100%;
  height: 1.28rem;
  margin-top: 0.32rem;
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
}
</style>