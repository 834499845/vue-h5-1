// 企业文化
<template>
  <div class="enterpriseDetails">
    <div class="enterpriseDetailsTitle">
      {{lookObj.title}}
    </div>
    <div class="enterpriseDetailsTime">
      <div class="enterpriseDetailsTimel">
        {{lookObj.departmentName}}
      </div>
      <div class="enterpriseDetailsTimet">
        {{lookObj.createTime | timeFun}}
      </div>
    </div>
    <div v-show="stateShow" class="enterpriseDetailsMain" v-html="lookObj.content">
      
    </div>
    <div v-show="!stateShow" class="enterpriseDetailsMain">
        <pre>{{lookObj.content}}</pre>
    </div>
    <div class="enterPictureUrl" v-show="lookObj.pictureUrl">
      <img :src="lookObj.pictureUrl" alt="">
    </div>
    <div class="enterpriseDetailsShow" v-show="isenterpriseDetailsShow">
      <div>
        <div>
          <img src="/static/img/Rectangle 4@3x.png" alt="">
        </div>
        <div>
          {{text}}
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
      text: "",
      isenterpriseDetailsShow: false,
      lookObj: {},
      stateShow: true
    };
  },
  components: {},
  methods: {
    // 获取初始数据
    listFun() {
      var self = this;
    },
    ...mapActions([
      "getapiinfoappselectdetail",
      "getapiinfoappupdatenumber",
      "getapifavouritefavouritesave",
      "getapifavouritefavouritedelete"
    ])
  },
  mounted() {},
  created: function() {
    var self = this;
    document.title = "详情";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setTitle("详情");
      }
    }
    var listObj = {
      id: self.$route.query.id,
      userId: sessionStorage.getItem("infoMemberId")
    };
    self
      .getapiinfoappselectdetail(listObj)
      .then(data => {
        if (data.statusCode == 200) {
          if (data.data) {
            self.lookObj = data.data;
            var reg = /<[^>]+>/g;
            if (reg.test(self.lookObj.content)) {
              self.stateShow = true;
            } else {
              self.stateShow = false;
            }
            if (data.data.favouriteState == true) {
              if (isAndroid) {
                if (window.BenchJSInterface) {
                  window.BenchJSInterface.setRightImageType(
                    1,
                    "javascript:window.cancelAdFun()"
                  );
                  window.BenchJSInterface.setRightBtn("", "");
                }
              } else {
                var setNav = {
                  methodName: "invokeNavigationRightItemFromJS",
                  params: {
                    naviType: 0,
                    titles: [{ name: "收藏", code: "shai", image: "collected" }]
                  },
                  callbackMethod: "cancelIosFun"
                };
                if (window.webkit) {
                  window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                    setNav
                  );
                }
              }
            } else {
              if (isAndroid) {
                if (window.BenchJSInterface) {
                  window.BenchJSInterface.setRightImageType(
                    0,
                    "javascript:window.addAdFun();"
                  );
                  window.BenchJSInterface.setRightBtn("", "");
                }
              } else {
                var setNav = {
                  methodName: "invokeNavigationRightItemFromJS",
                  params: {
                    naviType: 0,
                    titles: [
                      {
                        name: "收藏",
                        code: "shai",
                        image: "notCollected"
                      }
                    ]
                  },
                  callbackMethod: "addIosFun"
                };
                if (window.webkit) {
                  window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                    setNav
                  );
                }
              }
            }
          } else {
            if (isAndroid) {
              if (window.BenchJSInterface) {
                window.BenchJSInterface.setRightImageType(
                  0,
                  "javascript:window.addAdFun();"
                );
                window.BenchJSInterface.setRightBtn("", "");
              }
            } else {
              var setNav = {
                methodName: "invokeNavigationRightItemFromJS",
                params: {
                  naviType: 0,
                  titles: [
                    { name: "收藏", code: "shai", image: "notCollected" }
                  ]
                },
                callbackMethod: "addIosFun"
              };
              if (window.webkit) {
                window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                  setNav
                );
              }
            }
          }
        } else {
          if (isAndroid) {
            if (window.BenchJSInterface) {
              window.BenchJSInterface.setRightImageType(
                0,
                "javascript:window.addAdFun();"
              );
              window.BenchJSInterface.setRightBtn("", "");
            }
          } else {
            var setNav = {
              methodName: "invokeNavigationRightItemFromJS",
              params: {
                naviType: 0,
                titles: [{ name: "收藏", code: "shai", image: "notCollected" }]
              },
              callbackMethod: "addIosFun"
            };
            if (window.webkit) {
              window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                setNav
              );
            }
          }
          Toast({
            message: data.statusMessage,
            position: "bottom"
          });
        }
      })
      .catch(msg => {
        if (isAndroid) {
          if (window.BenchJSInterface) {
            window.BenchJSInterface.setRightImageType(
              0,
              "javascript:window.addAdFun();"
            );
            window.BenchJSInterface.setRightBtn("", "");
          }
        } else {
          var setNav = {
            methodName: "invokeNavigationRightItemFromJS",
            params: {
              naviType: 0,
              titles: [{ name: "收藏", code: "shai", image: "notCollected" }]
            },
            callbackMethod: "addIosFun"
          };
          if (window.webkit) {
            window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
              setNav
            );
          }
        }
        Toast({
          message: "服务器异常",
          position: "bottom"
        });
      });
    //安卓收藏
    window.addAdFun = function() {
      // https://h5.botong.tech/#/logList  外网
      // http://192.168.10.230:1300/#/logList  测试
      var listObj = {
        origin: self.lookObj.departmentName,
        userId: sessionStorage.getItem("infoUserId"),
        // originUserId: self.lookObj.userId,
        favouriteInfos: [
          {
            originId: self.$route.query.id, // 类型修改为string
            type: 9, // 类型
            isDang: 0,
            name: self.lookObj.title,
            content:
              "https://h5.botong.tech/#/enterpriseDetailsShare?id=" +
              self.$route.query.id +
              "&userId=" +
              sessionStorage.getItem("infoMemberId"),
            path:
              "https://h5.botong.tech/#/enterpriseDetailsShare?id=" +
              self.$route.query.id +
              "&userId=" +
              sessionStorage.getItem("infoMemberId") // 收藏内容
          }
        ]
      };
      if (self.isenterpriseDetailsShow == false) {
        self
          .getapifavouritefavouritesave(JSON.stringify(listObj))
          .then(data => {
            if (data.statusCode == 200) {
              self.lookObj.favId = data.data;
              self.text = "收藏成功";
              self.isenterpriseDetailsShow = true;
              setTimeout(function() {
                self.isenterpriseDetailsShow = false;
              }, 1500);
              if (window.BenchJSInterface) {
                window.BenchJSInterface.setRightImageType(
                  1,
                  "javascript:window.cancelAdFun();"
                );
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
    };
    // Ios收藏
    window.addIosFun = function() {
      var listObj = {
        origin: self.lookObj.departmentName,
        userId: sessionStorage.getItem("infoUserId"),
        // originUserId: self.lookObj.userId,
        favouriteInfos: [
          {
            originId: self.$route.query.id, // 类型修改为string
            type: 9, // 类型
            isDang: 0,
            name: self.lookObj.title,
            content:
              "https://h5.botong.tech/#/enterpriseDetailsShare?id=" +
              self.$route.query.id +
              "&userId=" +
              sessionStorage.getItem("infoMemberId"), //
            path:
              "https://h5.botong.tech/#/enterpriseDetailsShare?id=" +
              self.$route.query.id +
              "&userId=" +
              sessionStorage.getItem("infoMemberId") // 收藏内容
          }
        ]
      };
      if (self.isenterpriseDetailsShow == false) {
        self
          .getapifavouritefavouritesave(JSON.stringify(listObj))
          .then(data => {
            if (data.statusCode == 200) {
              self.text = "收藏成功";
              self.lookObj.favId = data.data;
              self.isenterpriseDetailsShow = true;
              setTimeout(function() {
                self.isenterpriseDetailsShow = false;
              }, 1500);
              var setImgNav = {
                methodName: "invokeNavigationRightItemFromJS",
                params: {
                  naviType: 0,
                  titles: [
                    {
                      name: "收藏",
                      code: "shai",
                      image: "collected"
                    }
                  ]
                },
                callbackMethod: "cancelIosFun"
              };
              if (window.webkit) {
                window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                  setImgNav
                );
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
    };
    //安卓取消收藏
    window.cancelAdFun = function() {
      var obj = {
        userId: sessionStorage.getItem("infoUserId"),
        favIdList: [self.lookObj.favId]
      };
      if (self.isenterpriseDetailsShow == false) {
        self
          .getapifavouritefavouritedelete(JSON.stringify(obj))
          .then(data => {
            if (data.statusCode == 200) {
              self.text = "取消收藏成功";
              self.isenterpriseDetailsShow = true;
              setTimeout(function() {
                self.isenterpriseDetailsShow = false;
              }, 1500);
              if (window.BenchJSInterface) {
                window.BenchJSInterface.setRightImageType(
                  0,
                  "javascript:window.addAdFun();"
                );
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
    };
    //ios取消收藏
    window.cancelIosFun = function() {
      var obj = {
        userId: sessionStorage.getItem("infoUserId"),
        favIdList: [self.lookObj.favId]
      };
      if (self.isenterpriseDetailsShow == false) {
        self
          .getapifavouritefavouritedelete(JSON.stringify(obj))
          .then(data => {
            if (data.statusCode == 200) {
              self.text = "取消收藏成功";
              self.isenterpriseDetailsShow = true;
              setTimeout(function() {
                self.isenterpriseDetailsShow = false;
              }, 1500);
              var setImgNav = {
                methodName: "invokeNavigationRightItemFromJS",
                params: {
                  naviType: 0,
                  titles: [
                    {
                      name: "收藏",
                      code: "shai",
                      image: "notCollected",
                      notEnable: 0
                    }
                  ]
                },
                callbackMethod: "addIosFun"
              };
              if (window.webkit) {
                window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                  setImgNav
                );
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
    };
  },
  watch: {},
  filters: {
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
.enterpriseDetailsShow {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  left: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0);
}
.enterpriseDetailsShow > div {
  width: 3.2rem;
  height: 3.2rem;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 0.1067rem;
}
.enterpriseDetailsShow > div > div:nth-child(1) img {
  width: 0.96rem;
  height: 0.96rem;
}
.enterpriseDetailsShow > div > div:nth-child(1) {
  width: 100%;
  height: 0.96rem;
  display: flex;
  justify-content: center;
  margin-top: 0.64rem;
}
.enterpriseDetailsShow > div > div:nth-child(2) {
  width: 100%;
  margin-top: 0.48rem;
  text-align: center;
  height: 0.4267rem;
  font-size: 0.4267rem;
  color: rgba(255, 255, 255, 1);
  line-height: 0.4267rem;
}
.enterPictureUrl {
  padding-left: 0.4rem;
  padding-right: 0.4rem;
  width: 100%;
  /* height: 4rem; */
  margin-top: 0.32rem;
  margin-bottom: 0.62rem;
}
.enterPictureUrl img {
  width: 100%;
  height: 100%;
}
.enterpriseDetailsMain {
  width: calc(100% - 0.8533rem);
  margin: 0 auto;
  min-width: 1.3333rem;
  margin-top: 0.32rem;
  font-size: 0.4267rem;
}
.enterpriseDetailsMain pre {
  width: 100%;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.5757rem;
  white-space: pre-wrap; /*css-3*/
  white-space: -moz-pre-wrap; /*Mozilla,since1999*/
  white-space: -pre-wrap; /*Opera4-6*/
  white-space: -o-pre-wrap; /*Opera7*/
  word-wrap: break-word; /*InternetExplorer5.5+*/
}
.enterpriseDetailsMain > p {
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
}
.enterpriseDetailsTimet {
  margin-left: 0.2133rem;
}
.enterpriseDetailsTimel {
  margin-left: 0.4267rem;
}
.enterpriseDetailsTime {
  margin-top: 0.2667rem;
  height: 0.32rem;
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.32rem;
  display: flex;
}
.enterpriseDetailsTitle {
  margin: 0 auto;
  width: calc(100% - 0.8533rem);
  min-height: 0.6933rem;
  font-size: 0.5333rem;
  font-family: PingFangSC-Medium;
  color: rgba(44, 44, 44, 1);
  line-height: 0.6933rem;
  margin-top: 0.4267rem;
}
.enterpriseDetails {
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>