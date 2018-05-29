<!--日常签到统计-->
<template>
    <div class="statisticsSign">
      <div class="top">
        <div class="normalSign-content">
          <div id="containerTwo">
          </div>
          <div class="container-center" @click="containerCenterClick">
            <img src="/static/img/定位.png" alt="">
          </div>
        </div>
        <div class="topSearchList" onclick="rangeValClick()">
          <div>
            范围：
          </div>
          <div id="rangClass">
            {{inputBumenVal}}
          </div>
          <div>
            <img src="/static/img/下拉2.png">
          </div>
        </div>
        <div class="topSearchList" @click="selectTimeClick">
          <div>
            时间：
          </div>
          <div id="timeClass">
            {{setTimeVal}}
          </div>
          <div>
            <img src="/static/img/下拉2.png">
          </div>
        </div>
      </div>
      <div class="main">
        <div class="mainTitle">
          <div :class="{activeClass: isBlueSigned,normalClass: isBlackSigned}" @click="signedClick">
            <div>{{signedLists.length}}</div>
            <div>已签到</div>
          </div>
          <div :class="{activeClass: isBlueNoSigned,normalClass: isBlackNoSigned}" @click="noSignedClick">
            <div>{{noSignedLists.length}}</div>
            <div>未签到</div>
          </div>
        </div>
        <div class="mainContent">
          <div v-show="isBlueSigned">
            <ul>
              <li v-for="(item,index) in signedLists" :key="index">
                <div class="ll-t-lf-img">
                  <img v-show="item.profile" :src="item.profile" alt="">
                  <div v-show="!item.profile">{{item.name | userNickFun}}</div>
                </div>
                <div>{{item.name}}</div>
              </li>
            </ul>
          </div>
          <div class="isBlueNoSignedView" v-show="isBlueNoSigned">
            <ul>
              <li v-for="(item,index) in noSignedLists" :key="index">
                  <div class="ll-t-lf-img">
                    <img v-show="item.profile" :src="item.profile" alt="">
                    <div v-show="!item.profile">{{item.name | userNickFun}}</div>
                  </div>
                  <div>{{item.name}}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="bottom" v-show="isBlueNoSigned && noSignedLists.length > 0 && dangTrueOrFalse&&dangShow" @click="dangClick">
        <div>DANG一下</div>
      </div>
      <div class="BOTTOM" v-show="isBlueNoSigned && noSignedLists.length > 0 && dangTrueOrFalse&&!dangShow">
        <div>已提醒</div>
      </div>
       <!--选择提醒时间弹出框-->
      <v-dateModel @message="canifmDateClick" :time="timeVal" @cancel="cancelDateClick" :dataState="dataStateVal"></v-dateModel>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import dateModel from "../cModule/dateModel";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      dangTrueOrFalse: true,
      currentTime: "",
      dataStateVal: false,
      timeVal: "",
      setTimeVal: new Date(),
      isBlueSigned: true,
      isBlackSigned: false,
      isBlueNoSigned: false,
      isBlackNoSigned: true,
      noSignedLists: [],
      signedLists: [],
      O: 0,
      P: 0,
      Ocenter: "",
      Pcenter: "",
      inputBumenVal: "请选择", // 选中的部门
      inputBumenId: "", // 选中部门id
      objLists: [], //部门选中数据
      orgIdVal: "",
      cpointVal: 1000,
      zoomVal: 15,
      dangClickTrueOrFalse: true,
      rangeVal: "",
      distanceStatusVal: "",
      dangShow: true,
      deptInfoArr: ""
    };
  },
  components: {
    "v-dateModel": dateModel
  },
  mounted: function() {
    var self = this;
    self.lngAndLatFun();
    self.inputBumenVal = sessionStorage.getItem("singOrgName");
    self.inputBumenId = sessionStorage.getItem("singOrgId");
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

    // 选择部门
    window.rangeValClick = function() {
      if (isAndroid) {
        if (window.BenchJSInterface) {
          if (self.inputBumenVal != sessionStorage.getItem("singOrgName")) {
            window.BenchJSInterface.setBtnOnClickEvent(
              "102",
              "javascript:window.updateAnListFun(->path<-);",
              JSON.stringify(self.objLists)
            );
          } else {
            window.BenchJSInterface.setBtnOnClickEvent(
              "102",
              "javascript:window.updateAnListFun(->path<-);"
            );
          }
        }
      } else {
        var messgaeObj = {};
        if (self.objLists.length > 0) {
          messgaeObj = {
            methodName: "BotongApplicationCenterDeptJSHandler",
            params: {
              // deptId: self.objLists[0].deptId, // 部门id
              // deptName: self.objLists[0].name, // 部门名称
              deptInfo: self.deptInfoArr
            },
            callbackMethod: "updateIosListFun"
          };
        } else {
          messgaeObj = {
            methodName: "BotongApplicationCenterDeptJSHandler",
            params: {
              deptInfo: ""
            },
            callbackMethod: "updateIosListFun"
          };
        }

        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterDeptJSHandler.postMessage(
            messgaeObj
          );
        }
      }
    };
    // 选中结果安卓
    window.updateAnListFun = function(val) {
      if (val) {
        var arrList = JSON.parse(JSON.stringify(val));
        self.objLists = [];
        self.objLists = arrList;
        self.inputBumenId = self.objLists[0].deptId;
        self.inputBumenVal =
          "选中了" +
          self.objLists[0].deptName +
          "等" +
          self.objLists.length +
          "个部门";
        self.normalSignSaerchListFun();
      } else {
        Toast({
          message: "选择部门异常",
          position: "bottom"
        });
      }
    };
    // 选中结果ios
    window.updateIosListFun = function(val) {
      if (val) {
        self.objLists = [];
        self.deptInfoArr = JSON.stringify(val);
        var arrList = JSON.parse(JSON.stringify(val));
        self.objLists = [];
        self.objLists = arrList.deptInfo;
        self.inputBumenId = self.objLists[0].deptId;
        self.inputBumenVal =
          "选中了" +
          self.objLists[0].name +
          "等" +
          self.objLists.length +
          "个部门";
        self.normalSignSaerchListFun();
      } else {
        Toast({
          message: "选择部门异常",
          position: "bottom"
        });
      }
    };
  },
  methods: {
    // 查看经纬度设置
    lngAndLatFun() {
      var self = this;
      self.O = sessionStorage.getItem("normalSignO");
      self.P = sessionStorage.getItem("normalSignP");
      self
        .getSignApiSignGetSetting({
          orgId: sessionStorage.getItem("singOrgId")
        })
        .then(data => {
          if (data.statusCode == 200) {
            if (data.data) {
              if (data.data.lng) {
                self.Ocenter = data.data.lng;
              }
              if (data.data.lat) {
                self.Pcenter = data.data.lat;
              }
              if (data.data.range) {
                self.rangeVal = data.data.range;
              }
              if (data.data.distanceStatus) {
                self.distanceStatusVal = data.data.distanceStatus;
              }
              if (data.data.distance) {
                self.cpointVal = data.data.distance;
                if (self.cpointVal == 1000) {
                  self.zoomVal = 14;
                } else if (self.cpointVal == 2000) {
                  self.zoomVal = 13;
                } else if (self.cpointVal == 3000) {
                  self.zoomVal = 12;
                } else if (self.cpointVal == 4000) {
                  self.zoomVal = 11;
                } else if (self.cpointVal == 5000) {
                  self.zoomVal = 11;
                } else {
                  self.zoomVal = 15;
                }
              } else {
                self.zoomVal = 15;
              }
            }
          } else {
            Toast({
              message: data.statusMessage,
              position: "bottom"
            });
          }
          self.listFun();
        })
        .catch(msg => {
          Toast({
            message: "服务器异常",
            position: "bottom"
          });
        });
    },
    containerCenterClick() {
      var self = this;
      self.marker1.setPosition([self.O, self.P]);
      self.map.setZoomAndCenter(self.zoomVal, [self.O, self.P]);
    },
    listFun() {
      var self = this;
      var lnglatXY = [];
      if (self.Ocenter) {
        lnglatXY = [self.Ocenter, self.Pcenter];
      } else {
        lnglatXY = [self.O, self.P];
      }
      self.map = new AMap.Map("containerTwo", {
        center: lnglatXY,
        resizeEnable: true,
        zoom: self.zoomVal
      });
      self.map.plugin(["AMap.ToolBar", "AMap.PlaceSearch"], function() {
        // self.map.addControl(new AMap.ToolBar());
        self.map.addControl(new AMap.PlaceSearch());
      });
      // 个人坐标
      // var icon = new AMap.Icon({
      //   image: "/static/img/地图坐标.png", //24px*24px
      //   size: new AMap.Size(28, 28),
      //   offset: new AMap.Pixel(-14, -14)
      // });
      // // 中心点坐标
      // var icon1 = new AMap.Icon({
      //   image: "/static/img/范围.png", //24px*24px
      //   size: new AMap.Size(20, 20),
      //   offset: new AMap.Pixel(-10, -10)
      // });
      self.marker1 = new AMap.Marker({
        position: [self.O, self.P],
        animation: "AMAP_ANIMATION_DROP"
        // icon: icon
      });
      self.marker1.setMap(self.map);
      // 确认中心点
      // self.marker = new AMap.Marker({
      //   icon: icon1,
      //   position: lnglatXY,
      //   offset: new AMap.Pixel(-10, -10)
      // });
      // self.marker.setMap(self.map);
      // 覆盖物
      // var cpointValue = ''
      // if (self.distanceStatusVal == 0) {
      //   cpointValue = self.rangeVal
      // } else if (self.distanceStatusVal == 1) {
      //   cpointValue = self.rangeVal + self.cpointVal
      // }
      // var circle = new AMap.Circle({
      //   center: lnglatXY,
      //   radius: cpointValue,
      //   fillOpacity: 0.2,
      //   strokeWeight: 1,
      //   fillColor: "#4390E1",
      //   strokeColor: "#4390E1"
      // });
      // circle.setMap(self.map);
    },
    // 选择时间
    selectTimeClick() {
      this.dataStateVal = true;
    },
    currentTimeFun(val) {
      var self = this;
      var y, m, d;
      y = val.getFullYear();
      m = val.getMonth();
      m = m > 9 ? m + 1 : "0" + (m + 1);
      d = val.getDate();
      d = d > 9 ? d : "0" + d;
      return y + "-" + m + "-" + d;
    },
    // 提醒时间选中
    canifmDateClick(val) {
      this.dataStateVal = false;
      this.timeVal = val;
      if (this.currentTimeFun(val) != this.currentTimeFun(this.currentTime)) {
        this.dangTrueOrFalse = false;
      } else {
        this.dangTrueOrFalse = true;
      }
      var y, m, d;
      y = this.timeVal.getFullYear();
      m = this.timeVal.getMonth();
      m = m > 9 ? m + 1 : "0" + (m + 1);
      d = this.timeVal.getDate();
      d = d > 9 ? d : "0" + d;
      this.timeVal = this.setTimeVal = y + "-" + m + "-" + d;
      this.normalSignSaerchListFun();
    },
    // 提醒时间取消
    cancelDateClick() {
      this.dataStateVal = false;
    },
    // DANG
    dangClick() {
      var self = this;
      if (self.dangClickTrueOrFalse == true) {
        self.dangClickTrueOrFalse = false;
        var receiveBodyArrs = [];
        self.noSignedLists.forEach(function(ele, ind) {
          if (ele.userId != sessionStorage.getItem("singUserId")) {
            receiveBodyArrs.push({ userId: ele.userId });
          }
        });
        var obj = {
          userId: sessionStorage.getItem("singUserId"),
          receiveBody: receiveBodyArrs,
          dangType: 1,
          remindType: 1,
          sendType: 1,
          sendContent: "您当日还未签到，请及时签到",
          sendTelephone: sessionStorage.getItem("singUserPhone"),
          isAccessory: 0
        };
        var object = JSON.stringify(obj);
        self
          .getdangSend(object)
          .then(data => {
            self.dangClickTrueOrFalse = true;
            if (data.statusCode == 200) {
              Toast({
                message: "DANG成功！",
                position: "bottom"
              });
              self.dangShow = false;
            } else {
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            self.dangClickTrueOrFalse = true;
            Toast({
              message: data.statusMessage,
              position: "bottom"
            });
          });
      }
    },
    // 日常-签到统计
    normalSignSaerchListFun() {
      var self = this;
      var timeValue = "";
      var obj = {};

      if (self.objLists.length > 0) {
        var inputBumenIds = [];
        self.objLists.forEach(function(ele, ind) {
          if (ele.deptId) {
            inputBumenIds.push(ele.deptId);
          }
        });
        if (inputBumenIds.length == self.objLists.length) {
        } else {
          Toast({
            message: "选中部门异常",
            position: "bottom"
          });
        }
        obj = {
          orgId: sessionStorage.getItem("singOrgId"),
          deptIds: inputBumenIds.join(","),
          signDate: self.setTimeVal,
          pageNo: 1,
          pageSize: 300
        };
      } else {
        obj = {
          // userIds: sessionStorage.getItem("singMemberId"),
          orgId: sessionStorage.getItem("singOrgId"),
          //deptIds: self.inputBumenId,
          signDate: self.setTimeVal,
          pageNo: 1,
          pageSize: 300
        };
      }
      var object = JSON.stringify(obj);
      self.$store.commit("setMutVuexisLoading", true);
      self
        .getSignApiSignSignCount(object)
        .then(data => {
          self.$store.commit("setMutVuexisLoading", false);
          if (data.statusCode == 200) {
            if (data.data) {
              if (data.data.signList) {
                self.signedLists = data.data.signList;
              } else {
                self.signedLists = [];
              }
              if (data.data.unSignList) {
                self.noSignedLists = data.data.unSignList;
              } else {
                self.noSignedLists = [];
              }
            }
          } else {
            Toast({
              message: 'data.statusMessage',
              position: "bottom"
            });
          }
        })
        .catch(msg => {
          self.$store.commit("setMutVuexisLoading", false);
          Toast({
            message: "服务器错误",
            position: "bottom"
          });
        });
    },
    // 点击已签到
    signedClick() {
      this.isBlackSigned = false;
      this.isBlueSigned = true;
      this.isBlackNoSigned = true;
      this.isBlueNoSigned = false;
    },
    // 点击未签到
    noSignedClick() {
      this.isBlackNoSigned = false;
      this.isBlueNoSigned = true;
      this.isBlackSigned = true;
      this.isBlueSigned = false;
    },
    ...mapActions([
      "getSignApiSignSignCount",
      "getSignApiSignGetSetting",
      "getdangSend"
    ])
  },
  created: function() {
    var self = this;

    document.title = "签到统计";
    self.currentTime = self.setTimeVal;
    var y, m, d;
    y = this.setTimeVal.getFullYear();
    m = this.setTimeVal.getMonth();
    m = m > 9 ? m + 1 : "0" + (m + 1);
    d = this.setTimeVal.getDate();
    d = d > 9 ? d : "0" + d;
    self.setTimeVal = y + "-" + m + "-" + d;
    self.normalSignSaerchListFun();
    // self.normalSignListFun();
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn(
          "我的",
          "javascript:window.pathFun();"
        );
        window.BenchJSInterface.setTitle("签到统计");
        window.BenchJSInterface.setRightTwoBut("", "");
        window.BenchJSInterface.setTopBarColor(1);
      }
    } else {
      var setNav = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          naviType: 0,
          titles: [
            { name: "我的", code: "my", notEnable: 0 },
            { name: "", code: "" }
          ]
        },
        callbackMethod: "pathFun"
      };
      if (window.webkit) {
        window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
          setNav
        );
      }
    }
    window.pathFun = function() {
      self.$router.push({
        path: "/myNormalSign"
      });
    };
    var a = new Date(),
      b;
    var standardTime = new Date(a);
    var y, m, d, h, f;
    y = standardTime.getFullYear();
    m = standardTime.getMonth() + 1;
    m = m > 9 ? m : "0" + m;
    d = standardTime.getDate();
    d = d > 9 ? d : "0" + d;
    b = y + "-" + m + "-" + d;
    console.log(typeof a);
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
    timeStr: function(val) {
      if (val) {
        var standardTime = new Date(val);
        var y, m, d;
        y = standardTime.getFullYear();
        m = standardTime.getMonth();
        m = m > 9 ? m + 1 : "0" + (m + 1);
        d = standardTime.getDate();
        d = d > 9 ? d : "0" + d;
        return y + "." + m;
      }
    },
    // 过滤时间
    timeFun: function(val) {
      if (val) {
        var standardTime = new Date(val);
        var y, m, d;
        y = standardTime.getFullYear();
        m = standardTime.getMonth() + 1;
        m = m > 9 ? m : "0" + m;
        d = standardTime.getDate();
        d = d > 9 ? d : "0" + d;
        return y + "-" + m + "-" + d;
      } else {
        return "暂无";
      }
    }
  }
};
</script>
<style scoped>
.statisticsSign {
  min-height: 100vh;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
  user-select: none;
}

.top {
  width: 10rem;
  height: 7.5467rem;
  position: relative;
}
.top > div:nth-child(2) {
  position: absolute;
  top: 0.7467rem;
  left: 0.4267rem;
  min-width: 4.3733rem;
  height: 0.8533rem;
  line-height: 0.8533rem;
  background: rgba(102, 173, 247, 1);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.26);
  border-radius: 4px;
  color: rgba(255, 255, 255, 1);
  font-size: 0.3733rem;
  text-align: center;
  overflow: hidden;
}

.topSearchList {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-width: 4rem;
  height: 0.8533rem;
}

.topSearchList img {
  width: 0.3013rem !important;
  height: 0.3013rem !important;
  /* border: 1px solid red; */
  vertical-align: middle;
  margin-top: 0.0533rem;
}
.topSearchList > div:nth-child(1) {
  width: 1.5rem;
  text-align: right;
  margin-top: 0.1rem;
}

#rangClass {
  width: 2rem;
  /* margin-left: -10px; */
  text-align: left;
}

#timeClass {
  width: 2rem;
  text-align: left;
  /* margin-left: -10px; */
}

.topSearchList > div:nth-child(2) {
  width: 2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  margin-top: 0.1rem;
}

.topSearchList > div:nth-child(3) {
  margin-right: 10px;
  margin-left: 10px;
}
.top > div:nth-child(3) {
  position: absolute;
  top: 1.92rem;
  left: 0.4267rem;
  width: 4.3733rem;
  height: 0.8533rem;
  line-height: 0.8533rem;
  background: rgba(102, 173, 247, 1);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.26);
  border-radius: 4px;
  color: rgba(255, 255, 255, 1);
  font-size: 0.3733rem;
  text-align: center;
}

.top img {
  width: 10rem;
  height: 7.5467rem;
}

.main > .mainTitle {
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid #f7f7f7;
  padding-left: 0.4267rem;
}

.main > .mainTitle div {
  margin-right: 0.2133rem;
}

.mainTitle > div > div:nth-child(1) {
  min-width: 0.2667rem;
  height: 0.4267rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  line-height: 0.4267rem;
  text-align: center;
  margin-bottom: 0.16rem;
  margin-top: 0.3467rem;
}

.mainTitle > div > div:nth-child(2) {
  min-width: 1.28rem;
  height: 0.4967rem;
  font-size: 0.4267rem;
  line-height: 0.4967rem;
}
.activeClass {
  color: rgba(67, 144, 225, 1);
  border-bottom: 2px solid rgba(67, 144, 225, 1);
  padding-bottom: 0.3467rem;
}
.normalClass {
  color: rgba(44, 44, 44, 1);
}

.mainContent ul {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.mainContent {
  margin-bottom: 1.3733rem;
}
.mainContent ul li {
  width: 2rem;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.mainContent li > div:nth-child(1) {
  position: relative;
  border-radius: 50%;
  width: 0.96rem;
  height: 0.96rem;
  margin-top: 0.5067rem;
  border-radius: 50%;
  overflow: hidden;
}
.ll-t-lf-img img {
  width: 0.96rem;
  height: 0.96rem;
  border-radius: 50%;
}
.ll-t-lf-img div {
  position: absolute;
  top: 0;
  left: 0;
  width: 0.96rem;
  height: 0.96rem;
  border: none;
  overflow: hidden;
  border-radius: 50%;
  background-color: #4592e2;
  text-align: center;
  line-height: 1.06rem;
  color: #fff;
  font-size: 0.3733rem;
}

.mainContent li > div:nth-child(2) {
  height: 0.4933rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.4933rem;
  text-align: center;
  margin-bottom: 0.5333rem;
  width: 80%;
  margin: 0 auto;
  margin-top: 0.2133rem;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.BOTTOM {
  position: fixed;
  bottom: 0px;
  left: 0;
  width: 10rem;
  height: 1.1733rem;
  line-height: 1.1733rem;
  background: #d3d3d3;
  margin-top: 4.64rem;
  display: flex;
  justify-content: center;
  z-index: 100000000000;
}

.BOTTOM div {
  font-family: PingFangSC-Regular;
  font-size: 0.48rem;
  color: rgba(255, 255, 255, 1);
}

.bottom {
  position: fixed;
  bottom: 0px;
  left: 0;
  width: 10rem;
  height: 1.1733rem;
  line-height: 1.1733rem;
  background: rgba(67, 144, 225, 1);
  margin-top: 4.64rem;
  display: flex;
  justify-content: center;
  z-index: 100000000000;
}
.bottom div {
  font-family: PingFangSC-Regular;
  font-size: 0.48rem;
  color: rgba(255, 255, 255, 1);
}

.normalSign-content {
  width: 100%;
  height: 7.5467rem;
  position: relative;
}

#containerTwo {
  width: 100%;
  height: 7.5467rem;
  overflow: hidden;
}

.container-center {
  position: absolute;
  bottom: 0.8rem;
  width: 0.8533rem;
  height: 0.8533rem;
  left: 0.4267rem;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
  /* border-radius: 4px; */
  /* border: 1px solid #4490e1; */
}

.container-center img {
  width: 0.8533rem;
  height: 0.8533rem;
}
</style>