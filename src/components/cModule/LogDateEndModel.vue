<template>
  <div>
    <div class="MedDatedatetimePicker" v-show="dataTrue">
      <div @click="cancelClick"></div>
        <div>
          <mt-datetime-picker placeholder="结束时间" :endDate="endDateStr" @cancel="cancelClick" @confirm="confirmClick" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"
            ref="pickerdate" type="date" v-model="dataVal">
          </mt-datetime-picker>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  // 年月日
  props: ["dataState", "time"],
  data() {
    return {
      endDateStr: "",
      dataTrue: false,
      dataVal: ""
    };
  },
  created: function() {
    this.dataVal = new Date();
    this.endDateStr = new Date();
  },
  mounted: function() {},
  watch: {
    dataState: function(val) {
      this.dataTrue = val;
      this.$refs.pickerdate.open();
      this.dataVal = new Date();
    },
    time: function(val) {
      if (val != "请选择") {
        this.dataVal = new Date(val);
      } else {
        this.dataVal = new Date();
      }
    }
  },
  methods: {
    cancelClick() {
      this.dataTrue = false;
      this.$refs.pickerdate.close();
      this.$emit("cancel", "");
    },
    confirmClick(index) {
      this.dataTrue = false;
      this.$refs.pickerdate.close();
      this.$emit("message", this.dataVal);
    }
  }
};
</script>
<style scoped>
.MedDatedatetimePicker .mint-popup {
  height: 255px !important;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-active {
  transform: translateY(30px);
  opacity: 0;
}

.MedDatedatetimePicker > div:nth-child(1) {
  height: calc(100vh - 255px);
  width: 100%;
  z-index: 10000000000;
}

.MedDatedatetimePicker > div:nth-child(2) {
  width: 100%;
  min-height: 255px;
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