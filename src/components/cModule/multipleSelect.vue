<template>
    <div class="multipleSelect">
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
.multipleSelect {
  height: 100vh;
  width: 100%;
  border: 1px solid red;
}
</style>