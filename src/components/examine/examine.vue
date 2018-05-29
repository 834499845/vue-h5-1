<!--审批-->
<template>
  <div class="examine">
    <div class="examineTop">
      <div class="examineTopClick topOne" @click="examineClick()">
        <div class="examineTopClickImg topImgOne"></div>
        <div class="examineTopClickFont">
          我审批的
        </div>
      </div>
      <div class="examineTopClick topTwo" @click="sponsorClick()">
        <div class="examineTopClickImg topImgTwo"></div>
        <div class="examineTopClickFont">
          我发起的
        </div>
      </div>
      <div class="examineTopClick topTherr" @click="copyToClick()">
        <div class="examineTopClickImg topImgTherr"></div>
        <div class="examineTopClickFont">
          抄送我的
        </div>
      </div>
    </div>
    <div class="examineUse">
      <div class="useTop">
        常用应用
      </div>
      <div class="useFor">
        <ul>
          <li class="useButton" v-for="(item,index) in useList" :key="index" @click="useClick(index)">
            <div class="useClickImg">
              <img v-lazy="item.logo" alt="">
            </div>
            <div class="useClickFont">
              {{item.modelName}}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      useList: [],
      companyIdVal: ""
    };
  },
  components: {},
  created: function() {
    var self = this;

    // sessionStorage.setItem("companyId", "a7e7e48cab1c4ee385e1cc78ad4fb009");
    // sessionStorage.setItem("memberId", "c6d79786c2cd47b198d2c77703bdc087");
    // sessionStorage.setItem(
    //   "accessToken",
    //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3NfdG9rZW4iOnRydWUsImlzX2FkbWluIjpmYWxzZSwiaXNzIjoiYm90b25nIiwidXNlcl9pZGVudGl0eSI6IjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzIiwiZXhwIjoxNTI1Mjc2ODAwLCJpYXQiOjE1MjUxOTA0MDAsInVzZXIiOiJ7XCJhY2NvdW50TGlzdFwiOlt7XCJhY2NvdW50XCI6XCIxMzYzNjg5ODY2OVwiLFwiYWNjb3VudFR5cGVcIjoxLFwiaWRcIjpcIjI5MzE4ZGUwOTIzMzRjMjZiMWQ3ZDgxNmVjMDc0YWUyXCIsXCJpc01haW5BY2NvdW50XCI6MSxcInBhc3Nwb3J0SWRcIjpcIjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzXCJ9XSxcImRpc3Rpbmd1aXNoV2ViTG9naW5cIjpcIm1vYmlsZVwiLFwiaWRcIjpcIjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzXCIsXCJwYXNzcG9ydFN0YXR1c1wiOjF9IiwianRpIjoiMTc1NzVkMmMtNzgxYi00ZGNiLTg4MGYtMjg4YzNlODBkNjZmIn0.aNTzzQkFCrkiqP9e00SYBGQBx1eGxXdWV9QUubsqycM"
    // );
    // self.companyIdVal = "a7e7e48cab1c4ee385e1cc78ad4fb009";
    // self.getList();

    if (sessionStorage.getItem("leavrShow")) {
      if (sessionStorage.getItem("leavrShow") == "true") {
        this.sponsorClick();
      }
    }
    document.title = "审批";
  },
  mounted() {
    var self = this;
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    //获取用户信息
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("审批");
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setRightImageType(10, "");
        window.BenchJSInterface.getApplicationRelevantInfo(
          "0",
          "javascript:window.UpdateAndroidFun(->path<-);"
        );
      }
    } else {
      if (window.webkit) {
        window.webkit.messageHandlers.BotongApplicationCenterUserInfoJSHandler.postMessage(
          {
            methodName: "BotongApplicationCenterUserInfoJSHandler",
            params: {},
            callbackMethod: "UpdateIosFun"
          }
        );
        window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
          {
            methodName: "invokeNavigationRightItemFromJS",
            params: {
              naviType: 0,
              titles: [{ name: "", code: "shai", notEnable: 0 }]
            },
            callbackMethod: "pathFun"
          }
        );
      }
    }
    // 获取用户信息Ios
    window.UpdateIosFun = function(val) {
      sessionStorage.setItem("companyId", val.companyId); //公司id
      sessionStorage.setItem("memberId", val.memberId); //成员id
      sessionStorage.setItem("accessToken", val.accessToken);
      self.companyIdVal = val.companyId;
      self.getList();
    };
    // 获取用户信息Android
    window.UpdateAndroidFun = function(val) {
      sessionStorage.setItem("companyId", val.orgId); //公司id
      sessionStorage.setItem("memberId", val.memberId); //成员id
      sessionStorage.setItem("accessToken", val.AccessToken);
      self.companyIdVal = val.orgId;
      self.getList();
    };
  },
  methods: {
    //获取列表
    getList() {
      var self = this;
      self.$store.commit("setMutVuexWaitedApprovalTop", 0);
      sessionStorage.removeItem("waitedSaerch");
      sessionStorage.removeItem("completedSaerch");
      sessionStorage.removeItem("iAmDetailsExamineTrue");
      sessionStorage.removeItem("await");
      self.$store.commit("setMutVuexawaitNumberIndex", 0);
      self.$store.commit("setMutVuexCompletedApprovalTop", 0);
      self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
      self.$store.commit("setMutVuexCompletedApprovalIndex", 9999);
      self.$store.commit("setMuVuexWaitedApprovalLists", []);
      self.$store.commit("setMutVuexCompletedApprovalLists", []);

      sessionStorage.removeItem("isDetailsExamineLook");
      sessionStorage.removeItem("sponsor");
      self.$store.commit("setMutVuexStartedLists", []);
      self.$store.commit("setMutVuexStartedIndex", 9999);
      self.$store.commit("setMutVuexStartedListsTop", 0);

      sessionStorage.removeItem("copyTo");
      sessionStorage.removeItem("searchSeekVal");
      sessionStorage.removeItem("copyToDetailsLook");
      self.$store.commit("setMutVuexCopyListsTop", 0);
      self.$store.commit("setMutVuexCopyLists", []);
      self.$store.commit("setMutVuexCopyListsIndex", 9999);
      self.$store.commit("setMutVuexCopyListsClickIndex", 0);

      var VuexExamineListArr = this.$store.state.VuexExamineLists;
      if (VuexExamineListArr.length > 0) {
        self.useList = VuexExamineListArr;
      } else {
        self.$store.commit("setMutVuexisLoading", true);
        self.$store.commit("setMutVuexExamineLists", "");
        self
          .getapprovalIndex({
            companyId: self.companyIdVal
          })
          .then(data => {
            self.$store.commit("setMutVuexisLoading", false);
            if (data.statusCode == "200") {
              if (data.data) {
                self.useList = data.data;
                self.$store.commit("setMutVuexExamineLists", data.data);
              }
            } else {
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            self.$store.commit("setMutVuexExamineLists", "");
            self.$store.commit("setMutVuexisLoading", false);
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    //我审批的
    examineClick() {
      this.$router.push({
        path: "/nightExamine"
      });
      sessionStorage.setItem("getnightListShow", "true");
    },
    //我发起的
    sponsorClick() {
      this.$router.push({
        path: "/started"
      });
      sessionStorage.setItem("getstartedListShow", "true");
    },
    //抄送我的
    copyToClick() {
      this.$router.push({
        path: "/copyTo"
      });
      sessionStorage.setItem("getcopyListShow", "true");
    },
    //应用点击
    useClick(index) {
      this.$router.push({
        path: "/leave",
        query: {
          modelId: this.useList[index].modelId,
          modelName: this.useList[index].modelName
        }
      });
    },
    ...mapActions(["getapprovalIndex"])
  },

  watch: {},
  filters: {
    // 过滤时间
    timeFun: function(val) {
      if (val) {
        var standardTime = new Date(val);
        var y, m, d, h, f;
        y = standardTime.getFullYear();
        m = standardTime.getMonth() + 1;
        m = m > 9 ? m : "0" + m;
        d = standardTime.getDate();
        d = d > 9 ? d : "0" + d;
        h = standardTime.getHours();
        h = h > 9 ? h : "0" + h;
        f = standardTime.getMinutes();
        f = f > 9 ? f : "0" + f;
        return y + "-" + m + "-" + d + " " + h + ":" + f;
      } else {
        return "暂无";
      }
    }
  }
};
</script>
<style scoped>
.examine {
  height: 100vh;
  width: 100%;
  user-select: none;
  background: rgba(241, 241, 241, 1);
}

.examineTop {
  width: 10rem;
  height: 2.6667rem;
  display: flex;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 1);
}

.examineTopClick {
  width: 1.28rem;
  height: 1.8133rem;
  margin-top: 0.4267rem;
}

.topOne {
  margin-left: 1.0667rem;
}

.topTwo {
  margin-left: 2.0267rem;
  margin-right: 2.0267rem;
}

.examineTopClickImg {
  width: 1.28rem;
  height: 1.28rem;
  margin-bottom: 0.2133rem;
}

.topImgOne {
  background: url("/static/img/我审批的@3x.png");
  background-size: 100%;
}

.topImgTwo {
  background: url("/static/img/我发起的@3x.png");
  background-size: 100%;
}

.topImgTherr {
  background: url("/static/img/抄送我的@3x.png");
  background-size: 100%;
}

.examineTopClickFont {
  width: 1.28rem;
  height: 0.32rem;
  line-height: 0.32rem;
  font-size: 0.32rem;
  color: #2c2c2c;
  text-align: center;
  white-space: nowrap;
}

.examineUse {
  width: 10rem;
  min-height: 0.96rem;
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
}

.useTop {
  width: 1.76rem;
  height: 0.4267rem;
  color: #2b2b2b;
  line-height: 0.4267rem;
  font-size: 0.4267rem;
  font-weight: bold;
  font-family: PingFangSC-Medium;
  margin: 0.5333rem 0 0 0.4267rem;
}

.useFor ul {
  width: 100%;
  padding: 0 0.2933rem 0.32rem 0.2933rem;
  display: flex;
  flex-wrap: wrap;
}

.useButton {
  width: 1.28rem;
  height: 1.8133rem;
  margin-left: 0.5333rem;
  margin-right: 0.5333rem;
  margin-top: 0.5333rem;
}

.useClickImg {
  width: 1.28rem;
  height: 1.28rem;
  margin-bottom: 0.2133rem;
  background: rgba(241, 241, 241, 1);
}

.useClickImg img {
  width: 100%;
  height: 100%;
}

.useClickFont {
  width: 1.92rem;
  height: 0.32rem;
  line-height: 0.32rem;
  margin-left: -0.3467rem;
  white-space: nowrap;
  text-align: center;
  color: #2c2c2c;
}
</style>