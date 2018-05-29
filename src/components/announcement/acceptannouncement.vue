// 公告，查看未读人员
<template>
    <div class="acceptannouncement">
      <div v-show="users.length > 0" class="acceptAnnouncementBox">
          <div class="userInformation" v-for="(user,index) in users" :key="index">
            <div class="userImg">
              <img  v-if="user.img" v-lazy="user.img" class="userImage" alt="">
              <div  v-else class="noAvatar">{{user.name | userNickFun}}</div>
            </div>
            <div class="userName">
              <span class="uName">{{user.name}}</span>
            </div>
          </div>
      </div>
      <div v-show="users.length == 0" class="acceptAnnouncementBoxNull">
        暂无数据
      </div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      noticeId: "",
      users: []
    };
  },
  components: {},
  methods: {
    ...mapActions(["getNoticedeleteNotice", "getNoticeselectNoticeUser"])
  },
  created: function() {
    var self = this;
    // self.users = [];
    this.noticeId = this.$route.query.noticeId;
    self.$store.commit("setMutVuexisLoading", true);

    self
      .getNoticeselectNoticeUser({
        id: self.noticeId,
        state: "1",
        pageNo: "1",
        pageSize: "1000"
      })
      .then(data => {
        self.$store.commit("setMutVuexisLoading", false);
        if (data.statusCode == 200) {
          if (data.data) {
            if (data.data.records) {
              self.users = data.data.records;
            }
          }
        } else {
          Toast({
            message: data.statusMessage,
            position: "bottom"
          });
        }
      })
      .catch(msg => {
        self.$store.commit("setMutVuexisLoading", false);
        Toast({
          message: "服务器异常",
          position: "bottom"
        });
      });

    document.title = "未读人员";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setTitle("未读人员");
      }
    } else {
      var setNav = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          naviType: 0,
          titles: [{ name: "", code: "" }]
        }
      };
      if (window.webkit) {
        window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
          setNav
        );
      }
    }
  },
  watch: {},
  filters: {
    userNickFun: function(val) {
      if (val) {
        if (val.length > 2) {
          return val.slice(val.length - 2, val.length);
        } else {
          return val;
        }
      } else {
        return "";
      }
    },
    imgFun(val) {
      if (val.indexOf("http") > -1) {
        return val;
      } else {
        return "/static/img/1@3x.png";
      }
    },
    // 过滤时间
    timeFun: function(val) {
      if (val) {
        var standardTime = new Date(val * 1);
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
.acceptannouncement {
  height: 100vh;
  width: 100%;
  background-color: #f1f1f1;
}
.acceptAnnouncementBoxNull {
  height: 100vh;
  width: 100%;
  text-align: center;
  line-height: 100vh;
  font-size: 0.3733rem;
  color: #848484;
}
.acceptAnnouncementBox {
  width: 100%;
  background-color: #ffffff;
}
.userInformation {
  padding-left: 0.4267rem;
  width: 100%;
  height: 1.28rem;
  /* position: relative; */
  display: flex;
  justify-content: flex-start;
  /* border: 1px solid red */
}
.userImg {
  width: 0.96rem;
  height: 0.96rem;
  border-radius: 50%;
  margin-top: 0.125rem;
  /* display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row */
}
.userImage {
  width: 0.96rem;
  height: 0.96rem;
  border-radius: 0.5867rem;
}
.userName {
  width: 8.2933rem;
  margin-left: 0.3rem;
  border-bottom: 1px solid rgb(241, 241, 241) !important;
}
.noAvatar {
  min-width: 0.96rem;
  height: 0.96rem;
  border-radius: 50%;
  background-color: #4390e1;
  line-height: 1rem;
  text-align: center;
  font-size: 12px;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  /* margin-top: 0.15rem; */
}
.uName {
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
  line-height: 1.28rem;
  pointer-events: none;
}
/* .uImg {
  display: inline-block;
  width: 0.32rem;
  height: 0.32rem;
  border-radius: 1px;
  border: 1px solid red;
} */
</style>