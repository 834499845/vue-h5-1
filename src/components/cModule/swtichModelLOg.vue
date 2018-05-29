<template>
    <div>
        <div :class="{'switch-modelN':isSwitchModelN == true,'switch-modelY':isSwitchModelN == false}" @click="switchModelClcik">
            <div class="switch-model-select">

            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: ["stateSwitch"],
  data() {
    return {
      isSwitchModelN: false
    };
  },
  created: function() {},
  mounted: function() {},
  watch: {
    stateSwitch(val) {
      console.log(val);
      this.isSwitchModelN = val;
    }
  },
  methods: {
    switchModelClcik() {
      this.isSwitchModelN = !this.isSwitchModelN;
      this.$emit("switchmodel", this.isSwitchModelN);
    }
  }
};
</script>
<style scoped>
.switch-model-select {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fff;
  content: "";
  margin-left: 2px;
  margin-right: 2px;
}
.switch-modelY {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 46px;
  height: 28px;
  border-radius: 14px;
  background: rgba(67, 144, 225, 1);
}
.switch-modelN {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 46px;
  height: 28px;
  border-radius: 14px;
  background: rgba(195, 222, 250, 1);
}
</style>