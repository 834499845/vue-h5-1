<template>
  <div>
    <div class="MedDatedatetimePicker" v-show="timeTrue">
      <div @click="cancelClick"></div>
        <div>
          <mt-datetime-picker @cancel="cancelClick" @confirm="confirmClick" ref="pickerdate" type="time" v-model="timeVal">
          </mt-datetime-picker>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  // 时分
  props: ["dataState", "time"],
  data() {
    return {
      timeTrue: false,
      timeVal: ""
    };
  },
  created: function() {
    // this.timeVal = new Date();
  },
  mounted: function() {},
  watch: {
    dataState: function(val) {
      this.timeTrue = val;
      this.$refs.pickerdate.open();
    },
    time: function(val) {
      if (val != "请选择") {
        this.timeVal = val;
        console.log(val, this.timeVal);
      } else {
        var standardTime = new Date();
        var y, m, d, h, f;
        h = standardTime.getHours();
        h = h > 9 ? h : "0" + h;
        f = standardTime.getMinutes();
        f = f > 9 ? f : "0" + f;
        this.timeVal = h + ":" + f;
      }
    }
  },
  methods: {
    cancelClick() {
      this.timeTrue = false;
      this.$refs.pickerdate.close();
      this.$emit("cancel", "");
    },
    confirmClick(index) {
      this.timeTrue = false;
      this.$refs.pickerdate.close();
      this.$emit("message", this.timeVal);
    }
  }
};
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-active {
  transform: translateY(30px);
  opacity: 0;
}

.MedDatedatetimePicker > div:nth-child(1) {
  height: calc(100vh - 295px);
  width: 100%;
  z-index: 10000000000;
}

.MedDatedatetimePicker > div:nth-child(2) {
  width: 100%;
  min-height: 295px;
}

.MedDatedatetimePicker {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 100000000000;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.3);
}
</style>