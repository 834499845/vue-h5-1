<template>
    <div id="app">
        <div class="delCont">
            {{name}}
        </div>
        <div class="delope">
            <span class="sureing" @click="okClick">好</span>
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
  padding: 0.4rem 2.4rem;
  background: #fd6162;
  border-radius: 5px;
  margin-right: 1rem;
}
</style>