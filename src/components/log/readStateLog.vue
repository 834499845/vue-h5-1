// 日志读取人员列表状态
<template>
    <div class="readStateLog">
     已读未读人列表
    </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  components: {},
  methods: {
    ...mapActions([""])
  },
  created: function() {},
  watch: {},
  filters: {
    // 过滤时间
    timeFun: function(val) {
      if (val) {
        var standardTime = new Date(val);
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
.readStateLog {
  height: 100vh;
  width: 100%;
  border: 1px solid red;
}
</style>