<template>
  <div class="customerServiceIssueOpinion">
    <div class="issueList-input">
      <div class="issueList-inputLeft">
        用户账号<small>*</small>
      </div>
      <div class="issueList-inputRight">
        <input type="number" placeholder="请输入正确账号" v-model.trim="phoneVal">
      </div>
    </div>
    <div class="issueList-text">
      <div class="issueList-textLeft">
        建议描述<small>*</small>
      </div>
      <div class="issueList-textRight">
        <pre><br>{{presentVal}}</pre>
        <textarea placeholder="请简要阐述反馈问题" v-model.trim="presentVal"></textarea>
      </div>
    </div>
    <div class="issueList-but">
      <div @click="issueListbutClick" :class="{'issueList-butCLick':true,'issueList-butGoCLick':issueListBut}">提交</div>
    </div>
    <div class="goTost" v-show="isGoTostShow">
      <div>
        <img src="static/img/Group@Go3x.png" alt="">
      </div>
      <div>
        提交成功
      </div>
      <div>
        我们会尽快给您答复
      </div>
      <div>
        <div @click="goListClick">
          查看记录
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapActions } from "vuex";
export default {
  props: ["createdShow"],
  components: {},
  data() {
    return {
      issueListbutClickTrue: false,
      phoneVal: "", // 账户
      presentVal: "", // 建议反馈
      isGoTostShow: false,
      issueListBut: false
    };
  },
  created: function() {
    var self = this;
  },
  mounted() {
    var self = this;
  },
  watch: {
    presentVal(val) {
      var self = this;
      // ^[0-9]*$

      if (val) {
        if (self.phoneVal.length > 0 && val.length > 0) {
          self.issueListBut = true;
        } else {
          self.issueListBut = false;
        }
      } else {
        self.issueListBut = false;
      }
    },
    phoneVal(val) {
      var self = this;
      if (val) {
        if (val.length > 11) {
          self.phoneVal = val.slice(0, 11);
        }

        if (val.length > 0 && self.presentVal.length > 0) {
          self.issueListBut = true;
        } else {
          self.issueListBut = false;
        }
      } else {
        self.issueListBut = false;
      }
    },
    createdShow(val) {
      var self = this;
    }
  },
  methods: {
    // 查看记录
    goListClick() {
      var self = this;
      self.$router.push({
        path: "/customerServiceList"
      });
    },
    // 提交问题
    issueListbutClick() {
      var self = this;
      var reg = new RegExp(/^\d{11}$/);

      if (reg.test(self.phoneVal) == true && self.presentVal.length > 0) {
        if (self.issueListbutClickTrue == false) {
          var timeStr = new Date().getTime();
          var obj = {
            userAccount: self.phoneVal,
            desc: self.presentVal,
            advise: 1,
            time: timeStr,
            userId: sessionStorage.getItem("customerServiceUserId")
          };
          self.$store.commit("setMutVuexisLoading", true);
          self
            .getfeedBacksave(JSON.stringify(obj))
            .then(data => {
              self.issueListbutClickTrue = false;
              self.$store.commit("setMutVuexisLoading", false);
              if (data.statusCode == 200) {
                self.$emit("issueListbutOpClick", 1);
              } else {
                Toast({
                  message: data.statusMessage,
                  position: "bottom"
                });
              }
            })
            .catch(msg => {
              self.$store.commit("setMutVuexisLoading", false);
              self.issueListbutClickTrue = false;
              Toast({
                message: "服务器异常",
                position: "bottom"
              });
            });
        }
      } else {
        if (reg.test(self.phoneVal) == false) {
          Toast({
            message: "请输入正确用户账号",
            position: "bottom"
          });
        } else if (self.presentVal.length == 0) {
          Toast({
            message: "请选择输入建议描述",
            position: "bottom"
          });
        }
      }
    },
    ...mapActions(["getfeedBacksave"])
  },
  filters: {}
};
</script>
<style scoped>
.goTost > div:nth-child(4) div {
  width: 3.7333rem;
  height: 0.96rem;
  background: rgba(67, 144, 225, 1);
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  line-height: 0.96rem;
  text-align: center;
}
.goTost > div:nth-child(4) {
  width: 100vw;
  display: flex;
  justify-content: center;
  margin-top: 0.64rem;
}
.goTost > div:nth-child(3) {
  width: 100vw;
  text-align: center;
  overflow: hidden;
  height: 0.5333rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.5333rem;
  margin-top: 0.32rem;
}
.goTost > div:nth-child(2) {
  width: 100vw;
  text-align: center;
  height: 0.6667rem;
  font-size: 0.48rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.6667rem;
  margin-top: 0.48rem;
  overflow: hidden;
}
.goTost > div:nth-child(1) {
  height: 1.92rem;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2.3467rem;
}
.goTost > div:nth-child(1) img {
  width: 1.92rem;
  height: 1.92rem;
}
.goTost {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  z-index: 10000000000000000000000000;
  overflow: hidden;
}
.issueList-butGoCLick {
  color: rgba(255, 255, 255, 1) !important;
}

.issueList-butCLick {
  height: 1.28rem;
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
  border-radius: 0.0533rem;
  width: calc(100vw - 1.92rem);
  margin-left: 0.96rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.48rem;
  text-align: center;
  line-height: 1.28rem;
}

.issueList-but {
  width: 100vw;
  margin-top: 0.96rem;
  margin-bottom: 0.9333rem;
}

.issueList-textRight {
  min-height: 3.7333rem;
  width: 100%;
}

.issueList-textRight {
  width: calc(100vw - 1.2267rem);
  color: rgba(44, 44, 44, 1);
  position: relative;
  margin-left: 0.4267rem;
}

.issueList-textRight textarea {
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  overflow-y: hidden;
  text-align: justify;
  text-justify: inter-ideograph;
  word-wrap: break-word;
  width: 100%;
  border: 1px solid #e3e3e3;
  resize: none;
  font-size: 0.4267rem;
  padding-top: 0.1867rem;
  padding-left: 0.1867rem;
  padding-right: 0.1867rem;
  line-height: 0.5867rem;
  overflow: hidden;
}

.issueList-textRight pre {
  display: block;
  white-space: pre-wrap;
  padding-top: 0.1867rem;
  padding-left: 0.1867rem;
  padding-right: 0.1867rem;
  word-wrap: break-word !important;
  visibility: hidden;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 100%;
  font-size: 0.4267rem;
  line-height: 0.5867rem;
  text-align: justify;
  word-wrap: break-word;
  text-justify: inter-ideograph;
}

.issueList-textLeft {
  height: 1.0133rem;
  width: 100%;
  padding-left: 0.4267rem;
  line-height: 1.0133rem;
  font-size: 0.4267rem;
  color: rgba(43, 43, 43, 1);
}

.issueList-text {
  min-height: 5.3333rem;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.issueList-inputLeft small,
.issueList-textLeft small {
  color: red;
}

.issueList-inputLeft {
  width: 2.4rem;
  height: 1.1733rem;
  line-height: 1.1733rem;
  font-size: 0.4267rem;
  color: rgba(43, 43, 43, 1);
  padding-left: 0.4267rem;
}

.issueList-inputSelect {
  height: 1.1733rem;
  width: 1.1467rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.issueList-inputSelect::after {
  position: absolute;
  height: 0.7467rem;
  width: 1px;
  background-color: #c0c0c0;
  top: 0.1867rem;
  left: 0;
  content: "";
}

input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: rgba(192, 192, 192, 1);
}

.issueList-inputSelect img {
  width: 0.32rem;
}

.issueList-inputRight input {
  height: 0.7467rem;
  line-height: 0.7467rem;
  font-size: 0.4267rem;
  width: calc(100vw - 2.4rem - 1.1467rem - 0.4267rem);
  color: #2c2c2c;
}

.issueList-inputRight {
  height: 1.1733rem;
  width: calc(100vw - 2.4rem - 1.1467rem - 0.4267rem);
  display: flex;
  align-items: center;
  margin-left: 0.4267rem;
}

.issueList-selectRight {
  height: 1.1733rem;
  width: calc(100vw - 2.4rem - 1.1467rem - 0.4267rem);
  display: flex;
  align-items: center;
  margin-left: 0.4267rem;
  font-size: 0.4267rem;
  color: rgba(192, 192, 192, 1);
  font-size: 0.4267rem;
}

.issueList-input::after {
  position: absolute;
  bottom: 0;
  height: 1px;
  width: calc(100vw - 0.4267rem);
  left: 0.4267rem;
  background-color: #e3e3e3;
  content: "";
}

.issueList-input {
  height: 1.1733rem;
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
}

.customerServiceIssueOpinion {
  overflow-y: scroll;
  overflow-x: hidden;
  height: calc(100vh - 1.0667rem);
  width: 100vw;
}
</style>