// 多选，选择首页
<template>
    <div class="multipleSelect">
      <div class="msh-search">

      </div>
      <div></div>
      <div></div>
      <div></div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: [""],
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
.msh-search {
  margin: 0 auto;
  width: 9.1467rem;
  height: 0.8533rem;
  border: 1px solid red;
  overflow: hidden;
  margin-top: 0.16rem;
}
.multipleSelect {
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;
  background: rgba(241, 241, 241, 1);
}
</style>