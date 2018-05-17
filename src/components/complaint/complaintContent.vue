<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="complaint">
    <div class="title">
      投诉须知
    </div>
    <div class="content">
      <div>
        你应保证你的投诉行为给予善意，并代表你本人真实意思。伯图作为中立的平台服务者，收到你的投诉后，会尽快按照相关法律法规的规定独立判断并进行处理。伯图将会餐区合理的措施保护你的个人信息；除法律法规规定的情形外，未经用户许可伯图不会向第三方公开，透露你的个人信息。
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
    ...mapActions(["getpageContextselect"])
  }
};
</script>
<style scoped>
.title {
  width: 100%;
  height: 5.858rem;
  line-height: 5.858rem;
  color: #000;
  font-size: 1.365rem;
  text-align: center;
}

.complaint {
  background-color: #fff;
  overflow-x: hidden;
  min-height: calc(100vh);
}

.content > div {
  width: 90%;
  color: #000;
  font-size: 1.24rem;
  margin: 0 auto;
  text-align: justify;
  line-height: 2.1rem;
  text-justify: inter-ideograph;
}

.content {
  width: 100%;
  overflow: hidden;
}
</style>