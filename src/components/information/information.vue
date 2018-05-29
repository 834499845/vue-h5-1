<template>
  <div class="information">
    <div class="ifmt-title">
      <div>
        <img src="/static/img/infobg.png" alt="">
      </div>
    </div>
    <div class="ifmt-navbar">
      <div class="ifmt-navbar-content">
        <ul>
          <li class="ifmt-navbarContentLi" :key="index" v-for="(item,index) in navLists" @click="navBarClick(index)">
            <div class="navbarContentLiLeft">
              <img :src="item.img" alt="">
            </div>
            <div class="navbarContentLiRight">
              {{item.name}}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="ifmt-list" v-for="(item,index) in dataLists" :key="index" @click="navBarClick(index)">
      <div class="ifmt-list-top">
        <div class="ifmt-list-topLeft">
          {{item.name}}
        </div>
        <div class="ifmt-list-topRight">
          <img src="/static/img/xiangqing@2x.png" alt="">
        </div>
      </div>
      <div class="ifmt-list-bottom">
        <div class="ifmt-list-bottomLeft">
          <div class="ifmt-list-bottomLeftTop">
            {{item.title}} 
          </div>
          <div class="ifmt-list-bottomLeftBottom">
            {{item.createTime | timeFun}}
          </div>
        </div>
          <div v-if="item.pictureUrl" class="ifmt-list-bottomRight">
            <div v-show="item.width < item.height" class="ifmt-list-bottomRightBgW" :style="{'background-image': 'url('+ item.pictureUrl +')'}"></div>
            <div v-show="!item.width < item.height" class="ifmt-list-bottomRightBgH" :style="{'background-image': 'url('+ item.pictureUrl +')'}"></div>
          </div>
          <div v-else class="ifmt-list-bottomRight">
            <img class="ifmt-list-bottomRightImg" src="/static/img/文化.png" alt="">
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
      imgBg: "/static/img/infobg.pg",
      navLists: [
        {
          img: "/static/img/gongsiwenhua@3x.png",
          name: "企业文化",
          path: "enterpriseINformation"
        },
        {
          img: "/static/img/gongsizhidu@3x.png",
          name: "公司制度",
          path: "informationList"
        },
        {
          img: "/static/img/peixunziliao@3x.png",
          name: "培训资料",
          path: "trainList"
        }
      ],
      dataLists: []
    };
  },
  components: {},
  methods: {
    navBarClick(index) {
      var pathsStr = "";
      if (index == 0) {
        pathsStr = this.navLists[index].path;
      } else {
        pathsStr = this.navLists[index].path;
      }
      this.$router.push({
        path: "/" + pathsStr
      });
    },
    // 获取初始数据
    listFun() {
      var self = this;
      sessionStorage.removeItem("searchNameVal");
      sessionStorage.removeItem("infoCatalogId");
      sessionStorage.removeItem("infoOneCatalogId");
      var listObj = {
        userId: sessionStorage.getItem("infoMemberId"),
        orgId: sessionStorage.getItem("infoOrgId")
      };
      self.$store.commit("setMutVuexisLoading", true);
      self
        .getapiinfoappselectparent(listObj)
        .then(data => {
          if (data.statusCode == 200) {
            if (data.data) {
              var logLeftLists = data.data;
              if (logLeftLists.parent) {
                sessionStorage.setItem(
                  "enterpriseINformationLowerId",
                  JSON.stringify(logLeftLists.parent[0])
                );
                sessionStorage.setItem(
                  "informationListLowerId",
                  JSON.stringify(logLeftLists.parent[1])
                );
                sessionStorage.setItem(
                  "trainLowerId",
                  JSON.stringify(logLeftLists.parent[2])
                );
              }
              if (logLeftLists.info) {
                if (logLeftLists.info.length > 0) {
                  var recordsList = logLeftLists.info;
                  var recordsListTrue = [];
                  logLeftLists.info.forEach(function(ele, ind) {
                    if (ele.pictureUrl) {
                      var img_url =
                        ele.pictureUrl + "?" + Date.parse(new Date());
                      var img = new Image();
                      img.src = img_url;
                      img.onload = function() {
                        var recordsListObj = {
                          width: img.width,
                          height: img.height,
                          id: ele.id, //资讯id
                          catalogId: ele.catalogId, //父级目录id
                          name: ele.name, //父级标题
                          title: ele.title, //资讯内容标题
                          pictureUrl: ele.pictureUrl, //图片地址
                          createTime: ele.createTime //创建时间
                        };
                        recordsList.splice(ind, 1, recordsListObj);
                        self.dataLists = recordsList;
                        self.$store.commit("setMutVuexisLoading", false);
                        if (logLeftLists.info.length == 1) {
                          self.dataLists[0]["path"] = "enterpriseINformation";
                        } else if (logLeftLists.info.length == 2) {
                          self.dataLists[0]["path"] = "enterpriseINformation";
                          self.dataLists[1]["path"] = "informationList";
                        } else if (logLeftLists.info.length == 3) {
                          self.dataLists[0]["path"] = "enterpriseINformation";
                          self.dataLists[1]["path"] = "informationList";
                          self.dataLists[2]["path"] = "trainList";
                        }
                      };
                    } else {
                      recordsListTrue.push(ind);
                    }
                  });
                  if (recordsListTrue.length == logLeftLists.info.length) {
                    self.dataLists = logLeftLists.info;
                    self.$store.commit("setMutVuexisLoading", false);
                    if (logLeftLists.info.length == 1) {
                      self.dataLists[0]["path"] = "enterpriseINformation";
                    } else if (logLeftLists.info.length == 2) {
                      self.dataLists[0]["path"] = "enterpriseINformation";
                      self.dataLists[1]["path"] = "informationList";
                    } else if (logLeftLists.info.length == 3) {
                      self.dataLists[0]["path"] = "enterpriseINformation";
                      self.dataLists[1]["path"] = "informationList";
                      self.dataLists[2]["path"] = "trainList";
                    }
                  }
                } else {
                  self.$store.commit("setMutVuexisLoading", false);
                }
              } else {
                self.$store.commit("setMutVuexisLoading", false);
              }
            } else {
              self.$store.commit("setMutVuexisLoading", false);
            }
          } else {
            self.$store.commit("setMutVuexisLoading", false);
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
    ...mapActions(["getapiinfoappselectparent"])
  },
  mounted() {
    var self = this;
    self.dataLists.forEach(function(ele, ind) {
      var node = document.getElementsByClassName("ifmt-list-bottomLeftTop")[
        ind
      ];
      $clamp(node, { clamp: 2 });
    });

    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    //获取用户信息
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("企业资讯");
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
      }
    }
    // 获取用户信息Ios
    window.UpdateIosFun = function(val) {};
  },
  created: function() {
    var self = this;
    // sessionStorage.setItem("infoUserId", "69f21c5b78774fbdaa29e6c10ce62483");
    // sessionStorage.setItem("infoOrgId", "a7e7e48cab1c4ee385e1cc78ad4fb009");
    // sessionStorage.setItem("infoMemberId", "c6d79786c2cd47b198d2c77703bdc087");
    // sessionStorage.setItem(
    //   "accessToken",
    //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3NfdG9rZW4iOnRydWUsImlzX2FkbWluIjpmYWxzZSwiaXNzIjoiYm90b25nIiwidXNlcl9pZGVudGl0eSI6IjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzIiwiZXhwIjoxNTI2NDAwMDAwLCJpYXQiOjE1MjYzMTM2MDAsInVzZXIiOiJ7XCJhY2NvdW50TGlzdFwiOlt7XCJhY2NvdW50XCI6XCIxMzYzNjg5ODY2OVwiLFwiYWNjb3VudFR5cGVcIjoxLFwiaWRcIjpcIjI5MzE4ZGUwOTIzMzRjMjZiMWQ3ZDgxNmVjMDc0YWUyXCIsXCJpc01haW5BY2NvdW50XCI6MSxcInBhc3Nwb3J0SWRcIjpcIjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzXCJ9XSxcImRpc3Rpbmd1aXNoV2ViTG9naW5cIjpcIm1vYmlsZVwiLFwiaWRcIjpcIjY5ZjIxYzViNzg3NzRmYmRhYTI5ZTZjMTBjZTYyNDgzXCIsXCJwYXNzcG9ydFN0YXR1c1wiOjEsXCJzYWZlQ29kZUNvbmZpZ1wiOntcImVuYWJsZVwiOjB9LFwic2VjdXJpdHlPcGVuXCI6MSxcInNlY3VyaXR5VGFsa0NvbmZpZ1wiOntcImhpZGRlbkVuYWJsZVwiOjEsXCJsZXZlbFwiOjF9fSIsImp0aSI6IjdkNDYyMzdkLTg1YjktNDExMi1iZDdiLTlmM2FmNzgxOWNjNyJ9.z82_zCMQws8MyvEtCLWD3uHH6QyDbh1ej5i7TzqzDVI"
    // );
    // self.listFun();

    document.title = "企业资讯";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setRightImageType(
          2,
          "javascript:window.pathFun();"
        );
        window.BenchJSInterface.setTitle("企业资讯");
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
          titles: [
            { name: "搜索", code: "shai", image: "search", notEnable: 0 }
          ]
        },
        callbackMethod: "pathFun"
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
        window.webkit.messageHandlers.BotongApplicationCenterUserInfoJSHandler.postMessage(
          setUserObj
        );
      }
    }
    //安卓获取用户信息
    window.getApplicationRelevantInfoFun = function(val) {
      var userobj = JSON.parse(JSON.stringify(val));
      sessionStorage.setItem("infoUserId", userobj.userId);
      sessionStorage.setItem("infoOrgId", userobj.orgId);
      sessionStorage.setItem("infoMemberId", userobj.memberId);
      sessionStorage.setItem("accessToken", userobj.AccessToken);
      sessionStorage.setItem("passportId", userobj.passportId);
      self.listFun();
    };
    // ios获取用户信息
    window.BotongApplicationCenterUserInfoJSHandlerFun = function(val) {
      var userobj = JSON.parse(JSON.stringify(val));
      sessionStorage.setItem("infoUserId", userobj.userId);
      sessionStorage.setItem("infoOrgId", userobj.companyId);
      sessionStorage.setItem("infoMemberId", userobj.memberId);
      sessionStorage.setItem("accessToken", userobj.accessToken);
      sessionStorage.setItem("passportId", userobj.passportId);
      self.listFun();
    };
    window.pathFun = function(val) {
      self.$router.push({
        path: "/informationSearch"
      });
    };
  },
  watch: {},
  filters: {
    imgFun(val) {
      if (val) {
        return val;
      } else {
        return "/static/img/文化.png";
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
        return y + "." + m + "." + d;
      } else {
        return "暂无";
      }
    }
  }
};
</script>
<style scoped>
.ifmt-list-bottomLeftTop {
  width: 5.28rem;
  height: 1.28rem;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.64rem;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ifmt-list-bottomLeftBottom {
  min-width: 1.6rem;
  height: 0.32rem;
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.32rem;
  margin-top: 0.64rem;
}

.ifmt-list-bottomLeft {
  max-width: 5.28rem;
  height: 2.24rem;
  margin-left: 0.4267rem;
}

.ifmt-list-bottomRightBgH {
  width: 2.9333rem;
  height: 2.24rem;
  overflow: hidden;
  background-repeat: no-repeat;
  background: center center;
  background-size: auto 2.24rem;
}
.ifmt-list-bottomRightBgW {
  width: 2.9333rem;
  height: 2.24rem;
  overflow: hidden;
  background-repeat: no-repeat;
  background: center center;
  background-size: 2.9333rem auto;
}
.ifmt-list-bottomRight {
  width: 2.9333rem;
  height: 2.24rem;
  overflow: hidden;
  margin-right: 0.4267rem;
}

.ifmt-list-bottomRightImg {
  width: 2.9333rem;
  height: 2.24rem;
}

.ifmt-list-bottom {
  height: 2.24rem;
  width: 100%;
  margin-top: 0.4267rem;
  display: flex;
  justify-content: space-between;
}

.ifmt-list-topLeft {
  height: 0.4267rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Medium;
  color: rgba(44, 44, 44, 1);
  line-height: 0.4267rem;
  margin-left: 0.4267rem;
}

.ifmt-list-topRight {
  margin-right: 0.4267rem;
  width: 0.2133rem;
  height: 0.3466rem;
  overflow: hidden;
}

.ifmt-list-topRight img {
  width: 100%;
  height: 100%;
}

.ifmt-list-top {
  margin-top: 0.32rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 0.4267rem;
}

.ifmt-list-one {
  margin-top: 0.32rem;
}

.ifmt-list-thr {
  margin-bottom: 0.8rem;
}

.ifmt-list:nth-child(3) {
  margin-top: 0.32rem;
}

.ifmt-list:nth-child(5) {
  margin-bottom: 0.8rem;
}

.ifmt-list {
  margin-top: 0.2133rem;
  height: 3.84rem;
  width: 100%;
  background-color: #fff;
  overflow: hidden;
}

.navbarContentLiLeft {
  width: 0.7467rem;
  height: 0.7467rem;
}

.navbarContentLiLeft img {
  width: 100%;
  height: 100%;
}

.navbarContentLiRight {
  height: 0.3733rem;
  font-size: 0.3733rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.3733rem;
  margin-top: 0.32rem;
  width: 100%;
}

.ifmt-navbar-content ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.2933rem;
}

.ifmt-navbarContentLi {
  width: 1.5933rem;
  height: 1.44rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.ifmt-navbar-content {
  width: calc(100% - 1.8667rem);
  height: 2.2933rem;
  margin: 0 auto;
}

.ifmt-navbar {
  height: 2.2933rem;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
}

.ifmt-title {
  width: 100%;
  overflow: hidden;
  height: 5.12rem;
  background-color: #fff;
}

.ifmt-title div {
  height: 5.12rem;
  width: 100%;
  overflow: hidden;
}

.ifmt-title img {
  width: 100%;
  height: 100%;
}

.information {
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #f1f1f1;
}
</style>