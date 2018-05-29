
<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="homeLog">
    <div class="homeLog-title">
      <ul>
        <li class="hl-t-Li" @click="innavClick(0)">
          <div class="hl-t-LiTop">
            <img src="/static/img/所有.png" alt="">
          </div>
          <div class="hl-t-LiBot">
            所有
          </div>
        </li>
        <li class="hl-t-Li" @click="innavClick(1)">
          <div class="hl-t-LiTop">
            <img src="/static/img/未读.png" alt="">
          </div>
          <div class="hl-t-LiBot">
            未读
          </div>
        </li>
        <li v-show="logListAd" class="hl-t-Li" onclick="innavLogListsClick()">
          <div class="hl-t-LiTop">
            <img src="/static/img/报表.png" alt="">
          </div>
          <div class="hl-t-LiBot">
            报表
          </div>
        </li>
        <li v-show="!logListAd" class="hl-t-Li" @click="innavClick(2)">
          <div class="hl-t-LiTop">
            <img src="/static/img/报表.png" alt="">
          </div>
          <div class="hl-t-LiBot">
            报表
          </div>
        </li>
        <li v-show="ismangerShow" class="hl-t-Li" @click="innavClick(3)">
          <div class="hl-t-LiTop">
            <img src="/static/img/管理.png" alt="">
          </div>
          <div class="hl-t-LiBot">
            管理
          </div>
        </li>
      </ul>
    </div>
    <div class="homeLog-content">
      <div class="hl-c-title">以下模板可选择</div>
      <div class="hl-c-main">
        <ul>
          <li class="hl-c-Li" v-for="(item,index) in modelLists" :key="index" @click="modelClick(index)">
            <div class="hl-c-LiTop">
              {{item.name}}
            </div>
            <div class="hl-c-LiBot">
              {{item.name}}报
            </div>
          </li>
        </ul>
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
      ismangerShow: false,
      logListAd: false,
      innavLists: [
        { name: "所有", img: "/static/img/所有@3x.png", path: "allLog" },
        { name: "未读", img: "/static/img/未读@3x.png", path: "unreadLog" },
        { name: "报表", img: "/static/img/报表 @3x.png", path: "logList" },
        { name: "管理", img: "/static/img/管理@3x.png", path: "managementList" }
      ], // 导航列表
      modelLists: [] // 模板列表
    };
  },

  components: {},
  methods: {
    innavClick(index) {
      var self = this;
      self.$router.push({
        path: "/" + self.innavLists[index].path
      });
    },
    modelClick(index) {
      this.$router.push({
        path: "/writeLog?id=" + this.modelLists[index].id
      });
    },
    // 初始化数据
    listFun() {
      var self = this;
      sessionStorage.setItem("navClickIndex", 1);

      self.$store.commit("MutVuexLogListsIndex", 9999);
      self.$store.commit("MutVuexLogLists", []);
      self.$store.commit("MutVuexMylogScrollTop", 0);

      self.$store.commit("MutVuexUnreadLogListsIndex", 9999);
      self.$store.commit("MutVuexUnreadLogLists", []);
      self.$store.commit("MutVuexVuexUnreadLogTop", 0);

      sessionStorage.removeItem("listOrSearchSHowVal");
      sessionStorage.removeItem("searchObjVal");
      sessionStorage.removeItem("messageWayValMessage");
      sessionStorage.removeItem("messageTimeValTime");
      sessionStorage.removeItem("logListsIndexObj");

      // 查看用户权限
      sessionStorage.setItem("isManager", 0);

      var isVuexMangerShow = self.$store.state.VuexMangerShow;
      if (isVuexMangerShow != 9) {
        if (isVuexMangerShow == 1) {
          self.ismangerShow = false;
          sessionStorage.setItem("isManager", 0);
        } else {
          self.ismangerShow = true;
          sessionStorage.setItem("isManager", 1);
        }
      } else {
        self.$store.commit("setMutVuexisLoading", true);
        self.$store.commit("MutVuexMangerShow", 1);
        self
          .getloglogtemplateverifymanager({
            memberId: sessionStorage.getItem("logMemberId")
          })
          .then(data => {
            self.$store.commit("setMutVuexisLoading", false);
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data == true) {
                  self.ismangerShow = true;
                  self.$store.commit("MutVuexMangerShow", 2);
                  sessionStorage.setItem("isManager", 1);
                } else {
                  self.ismangerShow = false;
                }
              }
            } else {
              self.ismangerShow = false;
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            self.$store.commit("setMutVuexisLoading", false);
            self.ismangerShow = false;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }

      // 获取日志模板
      var VuexModelListArr = self.$store.state.VuexModelLists;
      if (VuexModelListArr.length > 0) {
        self.modelLists = VuexModelListArr;
      } else {
        var listObj = {
          orgId: sessionStorage.getItem("logOrgId"),
          pageNo: "1",
          pageSize: "30"
        };
        self
          .getlogtemplatequeryAll(listObj)
          .then(data => {
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  self.modelLists = [];
                  data.data.records.forEach(function(ele, ind) {
                    self.modelLists.push({
                      id: ele.id,
                      name: ele.templateName.slice(0, 1),
                      submitType: ele.submitType
                    });
                  });
                  self.$store.commit("MutVuexModelLists", self.modelLists);
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
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    ...mapActions(["getlogtemplatequeryAll", "getloglogtemplateverifymanager"])
  },

  created: function() {
    var self = this;

    // sessionStorage.setItem("logOrgId", "a7e7e48cab1c4ee385e1cc78ad4fb009");
    // sessionStorage.setItem("logMemberId", "c6d79786c2cd47b198d2c77703bdc087");
    // sessionStorage.setItem("logPhone", "13636898669");
    // sessionStorage.setItem("logUserId", "69f21c5b78774fbdaa29e6c10ce62483");
    // sessionStorage.setItem(
    //   "accessToken",
    //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3NfdG9rZW4iOnRydWUsImlzX2FkbWluIjpmYWxzZSwiaXNzIjoiYm90b25nIiwidXNlcl9pZGVudGl0eSI6IjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzIiwiZXhwIjoxNTI2OTE4NDAwLCJpYXQiOjE1MjY4MzIwMDAsInVzZXIiOiJ7XCJhY2NvdW50TGlzdFwiOlt7XCJhY2NvdW50XCI6XCIxMzYzNjg5ODY2OVwiLFwiYWNjb3VudFR5cGVcIjoxLFwiaWRcIjpcIjI5MzE4ZGUwOTIzMzRjMjZiMWQ3ZDgxNmVjMDc0YWUyXCIsXCJpc01haW5BY2NvdW50XCI6MSxcInBhc3Nwb3J0SWRcIjpcIjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzXCJ9XSxcImRpc3Rpbmd1aXNoV2ViTG9naW5cIjpcIm1vYmlsZVwiLFwiaWRcIjpcIjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzXCIsXCJwYXNzcG9ydFN0YXR1c1wiOjAsXCJzYWZlQ29kZUNvbmZpZ1wiOntcImVuYWJsZVwiOjB9LFwic2VjdXJpdHlPcGVuXCI6MSxcInNlY3VyaXR5VGFsa0NvbmZpZ1wiOntcImhpZGRlbkVuYWJsZVwiOjEsXCJsZXZlbFwiOjF9fSIsImp0aSI6ImExMjZiNTAzLWY4ZTYtNGJlNS1hMmNjLTdlN2E3MjU3ZDRhYSJ9.lldOZxKhIB1tt2XXiICpTmPJ7t_3wKMxB7dXq_4J_Ok"
    // );
    // self.listFun();

    // sessionStorage.setItem("logOrgId", "a7e7e48cab1c4ee385e1cc78ad4fb009");
    // sessionStorage.setItem("logMemberId", "c6d79786c2cd47b198d2c77703bdc087");
    // sessionStorage.setItem("logPhone", "13636898669");
    // sessionStorage.setItem("logUserId", "69f21c5b78774fbdaa29e6c10ce62483");
    // sessionStorage.setItem(
    //   "accessToken",
    //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3NfdG9rZW4iOnRydWUsImlzX2FkbWluIjpmYWxzZSwiaXNzIjoiYm90b25nIiwidXNlcl9pZGVudGl0eSI6IjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzIiwiZXhwIjoxNTI2OTE4NDAwLCJpYXQiOjE1MjY4MzIwMDAsInVzZXIiOiJ7XCJhY2NvdW50TGlzdFwiOlt7XCJhY2NvdW50XCI6XCIxMzYzNjg5ODY2OVwiLFwiYWNjb3VudFR5cGVcIjoxLFwiaWRcIjpcIjI5MzE4ZGUwOTIzMzRjMjZiMWQ3ZDgxNmVjMDc0YWUyXCIsXCJpc01haW5BY2NvdW50XCI6MSxcInBhc3Nwb3J0SWRcIjpcIjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzXCJ9XSxcImRpc3Rpbmd1aXNoV2ViTG9naW5cIjpcIndlYlwiLFwiaWRcIjpcIjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzXCIsXCJwYXNzcG9ydFN0YXR1c1wiOjAsXCJzYWZlQ29kZUNvbmZpZ1wiOntcImVuYWJsZVwiOjB9LFwic2VjdXJpdHlPcGVuXCI6MSxcInNlY3VyaXR5VGFsa0NvbmZpZ1wiOntcImhpZGRlbkVuYWJsZVwiOjEsXCJsZXZlbFwiOjF9fSIsImp0aSI6ImVjMzAwNTI1LWZiMzQtNGQ4Zi04NDVhLTEyMTI0OTAzMjJjZCJ9.Jlpa1OSULDsKXKGOFgG7VpfON_nTFEhpGMzlXd2hOFU"
    // );
    // self.listFun();

    if (sessionStorage.getItem("sendLogIndex")) {
      self.$router.push({
        path: "/allLog"
      });
    }
    document.title = "工作日志";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      self.logListAd = true;
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn(
          "设置",
          "javascript:window.pathFun();"
        );
        window.BenchJSInterface.setTitle("工作日志");
        window.BenchJSInterface.setTopBarColor(0);
        // 安卓获取用户信息
        window.BenchJSInterface.getApplicationRelevantInfo(
          "0",
          "javascript:window.getApplicationRelevantInfoFun(->path<-);"
        );
      }
    } else {
      self.logListAd = false;
      var setNav = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          naviType: 1,
          titles: [{ name: "设置", code: "shai", notEnable: 0 }]
        },
        callbackMethod: "pathFun"
      };
      var screen = {
        methodName: "BotongApplicationCenterLandscapeJSHandler",
        params: {
          isLandscape: 0
        }
      };
      var setUserObj = {
        methodName: "BotongApplicationCenterUserInfoJSHandler",
        params: {},
        callbackMethod: "BotongApplicationCenterUserInfoJSHandlerFun"
      };
      if (window.webkit) {
        window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
          setNav
        );
        window.webkit.messageHandlers.BotongApplicationCenterLandscapeJSHandler.postMessage(
          screen
        );
        window.webkit.messageHandlers.BotongApplicationCenterUserInfoJSHandler.postMessage(
          setUserObj
        );
      }
    }
    window.pathFun = function(val) {
      self.$router.push({
        path: "/settingSelectModelLog"
      });
    };
    window.getApplicationRelevantInfoFun = function(val) {
      var userobj = JSON.parse(JSON.stringify(val));
      sessionStorage.setItem("logOrgId", userobj.orgId);
      sessionStorage.setItem("accessToken", userobj.AccessToken);
      sessionStorage.setItem("logMemberId", userobj.memberId);
      sessionStorage.setItem("logAppId", userobj.appId);
      sessionStorage.setItem("logUserId", userobj.userId);
      sessionStorage.setItem("logPhone", userobj.userMobile);
      self.listFun();
    };
    // iOS获取用户信息
    window.BotongApplicationCenterUserInfoJSHandlerFun = function(val) {
      var userobj = JSON.parse(JSON.stringify(val));
      sessionStorage.setItem("logOrgId", userobj.companyId); //企业
      sessionStorage.setItem("logMemberId", userobj.memberId); //成员
      sessionStorage.setItem("logAppId", userobj.appId);
      sessionStorage.setItem("logUserId", userobj.userId); //用户id
      sessionStorage.setItem("accessToken", userobj.accessToken);
      sessionStorage.setItem("logPhone", userobj.mobile);
      self.listFun();
    };
  },
  mounted() {
    var self = this;
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      window.innavLogListsClick = function() {
        // https://h5.botong.tech/#/logList  外网
        // http://192.168.10.230:1300/#/logList  测试
        // http://192.168.10.89:1300/#/logList  自己
        window.BenchJSInterface.setOperationEvent(
          0,
          "https://h5.botong.tech/#/logList"
        );
      };
    }
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
.hl-c-LiBot {
  width: 100%;
  text-align: center;
  height: 0.32rem;
  font-size: 0.32rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.32rem;
  margin-top: 0.2133rem;
}

.hl-c-LiTop {
  width: 1.28rem;
  height: 1.28rem;
  overflow: hidden;
  text-align: center;
  line-height: 1.28rem;
  font-size: 0.5333rem;
  color: #fff;
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
}

.hl-c-Li {
  width: 1.28rem;
  height: 1.8133rem;
  overflow: hidden;
}

.hl-c-main ul {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.hl-c-title {
  height: 1.3333rem;
  line-height: 1.44rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  padding-left: 0.4267rem;
}

.hl-t-LiBot {
  width: 100%;
  text-align: center;
  font-size: 0.32rem;
  color: rgba(255, 255, 255, 1);
  height: 0.32rem;
  line-height: 0.32rem;
  margin-top: 0.2667rem;
}

.hl-t-LiTop {
  width: 0.8533rem;
  height: 0.8533rem;
  border-radius: 2px;
  overflow: hidden;
}

.hl-t-LiTop img {
  width: 100%;
  height: 100%;
}

.hl-t-Li {
  width: 0.8533rem;
  height: 1.44rem;
  overflow: hidden;
}

.homeLog-title ul {
  display: flex;
  justify-content: space-around;
  height: 2.8267rem;
  align-items: center;
}

.homeLog-title {
  height: 2.8267rem;
  width: 100%;
  background: rgba(67, 144, 225, 1);
  overflow: hidden;
}

.homeLog-content {
  background-color: #fff;
  min-height: 8rem;
}

.homeLog {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  user-select: none;
}
</style>