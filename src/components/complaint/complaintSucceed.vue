<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="complaint">
    <div>
      <img src="/static/img/iconfo.png" alt="">
    </div>
    <div>
      投诉已提交
    </div>
    <div>
     <div>
        伯图团队会尽快核实，并通过“伯图团队”通知你的审核结果，感谢你的支持
     </div>
    </div>
    <div>
      <div @click="closeClick">
        关闭
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      pathShow: true
    };
  },
  filters: {},
  created: function() {
    var self = this;
    document.title = "投诉";
  },
  beforeDestroy: function() {},
  watch: {},
  methods: {
    closeClick() {
      var message = {
        methodName: "close"
      };
      // DoctorWorkJSCallBackHandler
      window.webkit.messageHandlers.ComplainJSCallBackHandler.postMessage(
        message
      );
    }
  }
};
</script>
<style scoped>
.complaint > div:nth-child(1) {
  margin-top: 2.816rem;
  height: 8.533rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.complaint > div:nth-child(1) img {
  width: 8.533rem;
  height: 8.533rem;
}
.complaint > div:nth-child(2) {
  margin-top: 2.816rem;
  font-size: 1.8rem;
  height: 1.9rem;
  line-height: 1.9rem;
  color: black;
  width: 100%;
  text-align: center;
}
.complaint > div:nth-child(3) {
  margin-top: 1.365rem;
}
.complaint > div:nth-child(3) > div {
  margin: 0 auto;
  width: 90%;
  font-size: 1.2rem;
  color: #939393;
  text-align: center;
}
.complaint > div:nth-child(4) {
  margin-top: 2.2rem;
}
.complaint > div:nth-child(4) > div {
  margin: 0 auto;
  width: 90%;
  background-color: #51a938;
  border: 1px solid #2a8a16;
  height: 3.84rem;
  text-align: center;
  color: #fff;
  font-size: 1.451rem;
  line-height: 3.84rem;
  border-radius: 4px;
}
.complaint {
  background-color: #fff;
  overflow-x: hidden;
  min-height: calc(100vh);
}
</style>