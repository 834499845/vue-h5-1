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
  props: ["status", "switchMsg"],
  data() {
    return {
      isSwitchModelN: true,
      switchMsgVal: ""
    };
  },
  created: function() {
    this.switchMsgVal = this.switchMsg;
  },
  mounted: function() {},
  watch: {
    status: function(val) {
      if (val == 1) {
        this.isSwitchModelN = false;
      } else {
        this.isSwitchModelN = true;
      }
    },
    switchMsgVal: function(val) {
      console.log(val, "3213123213");
      if (val == 1) {
        this.isSwitchModelN = false;
      } else {
        this.isSwitchModelN = true;
      }
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