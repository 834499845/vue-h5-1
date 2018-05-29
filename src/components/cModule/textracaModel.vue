<template>
  <div>
    <div class="writeList-right">
      <pre><br>{{presentVal}}</pre>
      <textarea placeholder="输入文字" v-model="presentVal"></textarea>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: ["name"],
  data() {
    return {
      presentVal: ""
    };
  },
  created: function() {},
  mounted: function() {},
  watch: {
    value: function(val, oldVal) {
      console.log(val);
      this.presentVal = val;
    },
    presentVal(val) {
      // this.modelVal = val
      // this.$emit("presentVal", val);
    }
  },
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
.writeList-right {
  border: 1px solid #000;
  width: 100%;
  color: rgba(44, 44, 44, 1);
  position: relative;
  margin: 0;
  padding: 0;
  line-height: normal;
  font-size: 0.4267rem;
  line-height: 0.56rem;
  min-height: 84px;
}

.writeList-right textarea {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  overflow-y: hidden;
  font-size: 0.4267rem;
  line-height: 0.56rem;
  text-align: justify;
  text-justify: inter-ideograph;
  word-wrap: break-word;
  border: 0;
  resize: none;
}

.writeList-right pre {
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word !important;
  visibility: hidden;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 100%;
  font-size: 0.4267rem;
  line-height: 0.56rem;
  text-align: justify;
  text-justify: inter-ideograph;
  word-wrap: break-word;
}
</style>