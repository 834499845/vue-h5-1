
<template>
    <div>
    <div class="selectMessage" v-show="messageShow">
      <div class="messageTop" @click="cancelClick"></div>
      <transition name="slide-fade">
        <div class="messageBot" v-show="messageShow">
          <div class="messageBot-content">
            <div class="mb-c-top">
              <ul>
                <li class="mb-c-topLi" @click="messageClick(index)" v-for="(item,index) in mewssageLists" :key="index">
                  {{item.name}}
                </li>
              </ul>
            </div>
            <div class="mb-c-bot" @click="cancelClick">
              取消
            </div>
          </div>
        </div>
      </transition>
    </div>
    </div>
</template>
<script>
export default {
  // 选择消息提示
  props: ["messageState"],
  data() {
    return {
      messageShow: false,
      mewssageLists: [
        { name: "应用内消息推送" },
        { name: "短信" },
        { name: "DANG一下" }
      ]
    };
  },
  created: function() {},
  mounted: function() {},
  watch: {
    messageState: function(val) {
      this.messageShow = val;
    }
  },
  methods: {
    cancelClick() {
      this.messageShow = false;
      this.$emit("cancel", "");
    },
    messageClick(index) {
      this.messageShow = false;
      this.$emit("message", this.mewssageLists[index].name);
    }
  }
};
</script>
<style scoped>
.mb-c-topLi:nth-child(1) {
  border: 0;
}
.mb-c-topLi {
  height: 57px;
  width: 100%;
  text-align: center;
  font-size: 18px;
  color: rgba(44, 44, 44, 1);
  line-height: 57px;
  border-top: 1px solid rgba(215, 215, 215, 1);
}

.mb-c-top {
  background-color: #fff;
  width: 100%;
  height: 171px;
  border-radius: 2px;
  overflow: hidden;
}

.mb-c-bot {
  background-color: #fff;
  margin-top: 9px;
  width: 100%;
  border-radius: 2px;
  height: 57px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(44, 44, 44, 1);
  overflow: hidden;
}

.messageBot-content {
  width: 94.666666%;
  height: 236px;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.messageTop {
  height: calc(100vh - 244px);
  width: 100%;
  z-index: 1000000000;
  overflow: hidden;
}

.messageBot {
  width: 100%;
  height: 244px;
  overflow: hidden;
}

.selectMessage {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 100000;
}
</style>