<template>
    <div id="app">
        <div class="delCont">
            {{name}}
        </div>
        <div class="delope">
            <span class="sureing" @click="okClick">确定</span>
            <span class="noSure" @click="canleClick">取消</span>
        </div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: ["name"],
  data() {
    return {};
  },
  created: function() {},
  mounted: function() {},
  watch: {},
  methods: {
    // 确认
    okClick() {
      this.$emit("ok", "1");
    },
    // 取消
    canleClick() {
      this.$emit("canle", "2");
    },
    ...mapActions([""])
  }
};
</script>
<style scoped>
.delCont {
  text-align: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e7e7e7;
}

.delope {
  padding: 1.5rem 0;
  text-align: center;
}
.sureing {
  color: #fff;
  padding: 0.3rem 1.2rem;
  background: #fd6162;
  border-radius: 5px;
  margin-right: 1rem;
}

.noSure {
  color: #333;
  background: #ddd;
  padding: 0.3rem 1.2rem;
  border-radius: 5px;
  margin-left: 1rem;
}
</style>