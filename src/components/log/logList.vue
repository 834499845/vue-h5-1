// 日志报表
<template>
  <div class="logList">
    <div v-show="lists.length > 0" class="logList-top" v-for="(item,index) in navlists" :key="index">
      <div class="liname">
        {{item.a}}
      </div>
      <div class="litime">
        {{item.b}}
      </div>
      <div class="litay" v-for="(contentsItem,contentsIndex) in item.contents" :key="contentsIndex">
        {{contentsItem.name}}
      </div>
      <div class="litext">
        {{item.c}}
      </div>
      <div class="liimg">
        {{item.d}}
      </div>
    </div>
    <div class="logList-bottom">
      <v-scroll :on-infinite="onInfinite" :loading-text="loadingText">
        <ul v-show="lists.length > 0">
          <li class="dataLi" v-for="(item,index) in lists" :key="index">
            <div class="liname">
              {{item.user.name}}
            </div>
            <div class="litime">
              {{item.submitTime | timeFun}}
            </div>
            <div class="litay litayText" v-for="(contentsItem,contentsIndex) in item.contents" :key="contentsIndex">
              <pre>{{contentsItem.value | strFun}}</pre>
            </div>
            <div class="litext litayText">
              <pre>{{item.remark | strFun}}</pre>
            </div>
            <div class="liimg">
              <img v-if="item.logImages" @click="showImgListsClick(index)" :src="item.logImages[0]" :alt="item.logImages[0]">
            </div>
          </li>
        </ul>
        <div v-show="lists.length == 0" class="logList-nullDate">
          <div class="nullContent"></div>
          <img class="nullImg" src="/static/img/iconfont_default_list@3x.png" alt="">
          <div class="nullText">暂无数据</div>
        </div>
      </v-scroll>
    </div>
  </div>
</template>
<script>
import scroll from "../cModule/logScroll";
import { mapActions } from "vuex";
import { Toast } from "mint-ui";
export default {
  components: { "v-scroll": scroll },
  data() {
    return {
      onInfiniteTrue: false, // 防重复
      pageNoVal: 1,
      pageSizeVal: 20,
      loadingText: "", // 刷新提示
      navlists: [
        {
          a: "填报人",
          b: "填报时间",
          c: "备注",
          d: "图片",
          contents: []
        }
      ], // 导航列表
      lists: [] // 报表列表
    };
  },
  methods: {
    // 图片预览
    showImgListsClick(index) {
      var self = this;
      var arr = [];
      var arr = [];
      this.lists[index].logImages.forEach(function(ele, ind) {
        arr.push({ img: ele });
      });
      this.WatchBigPicture(arr, 0);
    },
    // 上拉加载
    onInfinite(done) {
      var self = this;
      done(3);
      if (self.onInfiniteTrue == false) {
        self.onInfiniteTrue = true;
        var listObj = {};
        if (sessionStorage.getItem("logSearchListStartTtimestamp")) {
          listObj = {
            memberId: sessionStorage.getItem("logListMemberId"),
            orgId: sessionStorage.getItem("logListOrgId"),
            submitType: sessionStorage.getItem("logSearchListworkListsIndex"),
            startDate: sessionStorage.getItem("logSearchListStartTtimestamp"),
            endDate: sessionStorage.getItem("logSearchListendTtimestamp"),
            pageNo: self.pageNoVal,
            pageSize: self.pageSizeVal
          };
        } else {
          listObj = {
            memberId: sessionStorage.getItem("logListMemberId"),
            orgId: sessionStorage.getItem("logListOrgId"),
            submitType: 0,
            pageNo: self.pageNoVal,
            pageSize: self.pageSizeVal
          };
        }
        self.loadingText = "加载中···";
        self
          .getlogreportlist(listObj)
          .then(data => {
            self.onInfiniteTrue = false;
            done(2);
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  if (data.data.records.length > 0) {
                    done(1);
                    self.pageNoVal++;
                    self.lists = self.lists.concat(data.data.records);
                    if (
                      sessionStorage.getItem("logSearchListStartTtimestamp")
                    ) {
                      self.navlists[0].contents = [];
                      self.lists[0].contents.forEach(function(ele, ind) {
                        self.navlists[0].contents.push({ name: ele.name });
                      });
                    }
                  } else {
                    done(2);
                    self.loadingText = "暂无更多数据";
                  }
                } else {
                  done(2);
                  self.loadingText = "暂无更多数据";
                }
              } else {
                done(2);
                self.loadingText = "暂无更多数据";
              }
            } else {
              done(2);
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            self.onInfiniteTrue = false;
            done(2);
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    // 初始化数据
    listFun() {
      var self = this;
      self.$store.commit("setMutVuexisLoading", true);
      self.lists = [];
      self.pageNoVal = 1;
      var listObj = {};
      if (sessionStorage.getItem("logSearchListStartTtimestamp")) {
        listObj = {
          memberId: sessionStorage.getItem("logListMemberId"),
          orgId: sessionStorage.getItem("logListOrgId"),
          submitType: sessionStorage.getItem("logSearchListworkListsIndex"),
          startDate: sessionStorage.getItem("logSearchListStartTtimestamp"),
          endDate: sessionStorage.getItem("logSearchListendTtimestamp"),
          pageNo: self.pageNoVal,
          pageSize: self.pageSizeVal
        };
      } else {
        listObj = {
          memberId: sessionStorage.getItem("logListMemberId"),
          orgId: sessionStorage.getItem("logListOrgId"),
          submitType: 0,
          pageNo: self.pageNoVal,
          pageSize: self.pageSizeVal
        };
      }
      self
        .getlogreportlist(listObj)
        .then(data => {
          self.$store.commit("setMutVuexisLoading", false);
          if (data.statusCode == 200) {
            if (data.data) {
              if (data.data.records) {
                if (data.data.records.length > 0) {
                  var datas = data.data.records;
                  self.lists = datas;
                  self.pageNoVal++;
                  self.navlists[0].contents = [];
                  self.lists[0].contents.forEach(function(ele, ind) {
                    self.navlists[0].contents.push({ name: ele.name });
                  });
                }
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
    },
    ...mapActions(["getlogreportlist"])
  },
  mounted() {
    var self = this;
    document.title = "日志报表";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn(
          "筛选",
          "javascript:window.pathFun();"
        );
        window.BenchJSInterface.setTitle("日志报表");
        window.BenchJSInterface.setTopBarColor(1);
        // 安卓获取用户信息
        window.BenchJSInterface.getApplicationRelevantInfo(
          "0",
          "javascript:window.getApplicationRelevantInfoFun(->path<-);"
        );
      }
    } else {
      var setNav = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          naviType: 0,
          titles: [{ name: "筛选", code: "shai", notEnable: 0 }]
        },
        callbackMethod: "pathFun"
      };
      var screen = {
        methodName: "BotongApplicationCenterLandscapeJSHandler",
        params: {
          isLandscape: 1
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
    window.getApplicationRelevantInfoFun = function(val) {
      var userobj = JSON.parse(JSON.stringify(val));
      sessionStorage.setItem("logListOrgId", userobj.orgId);
      sessionStorage.setItem("accessToken", userobj.AccessToken);
      sessionStorage.setItem("logListMemberId", userobj.memberId);
      sessionStorage.setItem("logListUserId", userobj.userId);
      self.listFun();
    };
    // iOS获取用户信息
    window.BotongApplicationCenterUserInfoJSHandlerFun = function(val) {
      var userobj = JSON.parse(JSON.stringify(val));
      sessionStorage.setItem("logListOrgId", userobj.companyId); //企业
      sessionStorage.setItem("logListMemberId", userobj.memberId); //成员
      sessionStorage.setItem("logListUserId", userobj.userId); //用户id
      sessionStorage.setItem("accessToken", userobj.accessToken);
      self.listFun();
    };
    window.pathFun = function() {
      self.$router.push({
        path: "/logSearchList"
      });
    };
  },
  created: function() {
    var self = this;
    // sessionStorage.setItem("logListOrgId", "a7e7e48cab1c4ee385e1cc78ad4fb009");
    // sessionStorage.setItem(
    //   "logListMemberId",
    //   "c6d79786c2cd47b198d2c77703bdc087"
    // );
    // sessionStorage.setItem("logPhone", "13636898669");
    // sessionStorage.setItem(
    //   "accessToken",
    //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3NfdG9rZW4iOnRydWUsImlzX2FkbWluIjpmYWxzZSwiaXNzIjoiYm90b25nIiwidXNlcl9pZGVudGl0eSI6IjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzIiwiZXhwIjoxNTI2NDAwMDAwLCJpYXQiOjE1MjYzMTM2MDAsInVzZXIiOiJ7XCJhY2NvdW50TGlzdFwiOlt7XCJhY2NvdW50XCI6XCIxMzYzNjg5ODY2OVwiLFwiYWNjb3VudFR5cGVcIjoxLFwiaWRcIjpcIjI5MzE4ZGUwOTIzMzRjMjZiMWQ3ZDgxNmVjMDc0YWUyXCIsXCJpc01haW5BY2NvdW50XCI6MSxcInBhc3Nwb3J0SWRcIjpcIjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzXCJ9XSxcImRpc3Rpbmd1aXNoV2ViTG9naW5cIjpcIm1vYmlsZVwiLFwiaWRcIjpcIjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzXCIsXCJwYXNzcG9ydFN0YXR1c1wiOjEsXCJzYWZlQ29kZUNvbmZpZ1wiOntcImVuYWJsZVwiOjB9LFwic2VjdXJpdHlPcGVuXCI6MSxcInNlY3VyaXR5VGFsa0NvbmZpZ1wiOntcImhpZGRlbkVuYWJsZVwiOjEsXCJsZXZlbFwiOjF9fSIsImp0aSI6IjdkNDYyMzdkLTg1YjktNDExMi1iZDdiLTlmM2FmNzgxOWNjNyJ9.z82_zCMQws8MyvEtCLWD3uHH6QyDbh1ej5i7TzqzDVI"
    // );
    // self.listFun();
  },
  watch: {},
  filters: {
    strFun: function(val) {
      if (val) {
        return val;
      } else {
        return "无";
      }
    },
    // 过滤时间
    timeFun: function(val) {
      if (val) {
        var standardTime = new Date(val * 1);
        var y, m, d, h, f;
        y = standardTime.getFullYear();
        m = standardTime.getMonth() + 1;
        d = standardTime.getDate();
        h = standardTime.getHours();
        h = h > 9 ? h : "0" + h;
        f = standardTime.getMinutes();
        f = f > 9 ? f : "0" + f;
        return m + "月" + d + "日 " + h + ":" + f;
      } else {
        return "暂无";
      }
    }
  }
};
</script>
<style scoped>
.logList-mian {
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  height: 100vh;
  border: 1px solid #fff;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.logList-nullDate {
  width: 100vw;
  height: 100%;
  color: #848484;
  font-size: 14px;
  text-align: center;
  padding-top: 0.2997rem;
  /* padding-left: 1.5rem; */
}
.nullContent {
  height: 1.1526rem;
}
.nullText {
  margin-top: 0.3233rem;
}
.nullImg {
  width: 1.1807rem;
  height: 1.3774rem;
}
.logList-top > div {
  text-align: center;
  border-left: 1px solid #e3e3e3;
  height: 0.6597rem;
  font-size: 0.2099rem;
  line-height: 0.6597rem;
  color: rgba(132, 132, 132, 1);
  float: left;
  overflow: hidden;
}

.logList-top {
  min-width: 11.4243rem;
  height: 0.6597rem;
  border-bottom: 1px solid #e3e3e3;
  border-top: 1px solid #e3e3e3;
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
  overflow-y: hidden;
  border-right: 1px solid #e3e3e3;
}

.logList-bottom {
  min-width: 11.4243rem;
  overflow-x: hidden;
  overflow-y: hidden;
  height: calc(100vh - 0.6967rem);
  position: relative;
  -webkit-overflow-scrolling: touch;
}
.logList {
  height: 100%;
  min-width: 11.4243rem;
  background: rgba(245, 245, 245, 1);
  overflow: hidden;
  overflow-y: scroll;
  height: 100vh;
  position: relative;
  -webkit-overflow-scrolling: touch;
  user-select: none;
}

.liname {
  width: 1.7241rem;
  overflow: hidden;
  background: rgba(245, 245, 245, 1);
}

.litime {
  width: 1.2594rem;
  overflow: hidden;
}

.litay {
  width: 1.4393rem;
  overflow: hidden;
}
.litayText pre {
  overflow: hidden;
  width: 100%;
  color: rgba(44, 44, 44, 1);
  white-space: pre-wrap; /*css-3*/
  white-space: -moz-pre-wrap; /*Mozilla,since1999*/
  white-space: -pre-wrap; /*Opera4-6*/
  white-space: -o-pre-wrap; /*Opera7*/
  word-wrap: break-word; /*InternetExplorer5.5+*/
}
.limr {
  width: 1.4393rem;
  overflow: hidden;
}

.lihz {
  width: 1.4393rem;
  overflow: hidden;
}

.lisx {
  width: 1.4393rem;
  overflow: hidden;
}

.litext {
  width: 1.2594rem;
  border-right: 1.0005px solid #e3e3e3;
  overflow: hidden;
}

.liimg {
  width: 1.2594rem;
  border: 0 !important;
  overflow: hidden;
}

.liimg img {
  width: 0.7295rem;
  height: 0.7295rem;
}

.dataLi > div {
  font-size: 0.2099rem;
  color: rgba(44, 44, 44, 1);
  min-height: 0.6597rem;
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: center; */
  border-left: 1px solid #e3e3e3;
  padding-right: 0.2399rem;
  padding-left: 0.2399rem;
  padding-top: 0.4498rem;
  padding-bottom: 0.4498rem;
  word-wrap: break-word;
}

.dataLi:nth-child(1) {
  border-top: 1px solid #e3e3e3;
}

.dataLi {
  display: flex;
  border-bottom: 1px solid #e3e3e3;
  min-height: 0.6597rem;
  width: 100%;
  border-right: 1px solid #e3e3e3;
  background-color: #fff;
}
</style>