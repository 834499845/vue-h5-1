<!--日常签到-->
<template>
    <div class="outSign">
      <div>
          <div class="top">
            <div class="topHeadImg">
              <img v-show="userNameValprofileShow" :src="userNameValprofile" alt="">
              <div v-show="!userNameValprofileShow">{{userNameVal | userNickFun}}</div>
            </div>
            <div>
              <div>{{userNameVal}}</div>
              <div>今天您已经签到{{signCount}}次</div>
            </div>
            <div>
              <div>{{currentTime | dateFun}}</div>
            </div>
          </div>
      </div>
      <div class="main">
        <div class="mainTop">
          <div>当前企业：{{currentCompany}}</div>
        </div>
        <div class="mainMiddle">
          <div id="container2">
            <!-- <img src="/static/img/ditu.png" alt=""> -->
          </div>
          <div>
            <div><img src="/static/img/地图坐标.png" alt="">{{address}}</div>
            <div>{{detailAddress}}</div>
            <div v-show="siteClickShow" @click="siteClick">地点微调</div>
          </div>
        </div>
        <div :class="{'mainBottom':true,'mainBottomNo':signClickTrue}">
          <div @click="signClick">
            <div class="signTime">
              <div>签到</div>
              <div>{{currentTime | timeFun}}</div>
            </div> 
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
      siteClickShow: false,
      carentTimeFunt: null,
      currentTime: "",
      signCount: "0",
      address: "加载中···",
      signClickTrue: true,
      detailAddress: "加载中···",
      currentCompany: "",
      O: "",
      P: "",
      userIdVal: "",
      orgIdVal: "",
      userNameValprofile: "",
      userNameValprofileShow: false,
      userNameVal: ""
    };
  },
  components: {},
  created: function() {
    var self = this;
    self.userNameVal = sessionStorage.getItem("singUserName") || "暂无";
    self.currentCompany = sessionStorage.getItem("singOrgName") || "暂无";
    self.userNameValprofile = sessionStorage.getItem("singUserImg") || "暂无";
    if (self.userNameValprofile.indexOf("http") > -1) {
      self.userNameValprofileShow = true;
    } else {
      self.userNameValprofileShow = false;
    }
    self.carentTimeFun();
    self.signCountFun();
    document.title = "外出签到";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("外出签到");
      }
    } else {
    }
    window.pathFun = function() {
      self.$router.push({
        path: "/statisticsOutSign"
      });
    };
  },
  mounted() {
    var self = this;
    // self.P = 34.187166;
    // self.O = 108.852328;
    // self.locgFun();
    self.signClickTrue = true;
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        // 安卓获取用户信息
        window.BenchJSInterface.getApplicationRelevantInfo(
          1,
          "javascript:window.getApplicationRelevantInfolicationFunctionFun(->path<-);"
        );
        window.BenchJSInterface.setTopBarColor(1);
      }
    } else {
      var setNavs = {
        methodName: "BotongApplicationCenterLocationJSHandler",
        params: {},
        callbackMethod: "licationFunction"
      };
      if (window.webkit) {
        window.webkit.messageHandlers.BotongApplicationCenterLocationJSHandler.postMessage(
          setNavs
        );
      }
    }
    window.getApplicationRelevantInfolicationFunctionFun = function(val) {
      if (val) {
        var userobj = JSON.parse(JSON.stringify(val));
        if (userobj) {
          self.O = userobj.longitude;
          self.P = userobj.latitude;
          self.OPName = userobj.cityCode;
          self.locgFun();
          self.siteClickShow = true;
        } else {
          Toast({
            message: "获取地理位置失败，暂无法签到",
            position: "bottom"
          });
          self.siteClickShow = false;
        }
        window.BenchJSInterface.setRightBtn(
          "统计",
          "javascript:window.pathFun();"
        );
        window.BenchJSInterface.setTopBarColor(1);
      } else {
        Toast({
          message: "获取地理位置失败，暂无法签到",
          position: "bottom"
        });
        self.siteClickShow = false;
      }
    };
    window.licationFunction = function(val) {
      if (val) {
        self.O = val.split(",")[0];
        self.P = val.split(",")[1];
        self.locgFun();
        self.siteClickShow = true;
        var setNav = {
          methodName: "invokeNavigationRightItemFromJS",
          params: {
            naviType: 0,
            titles: [{ name: "统计", code: "statics", notEnable: 0 }]
          },
          callbackMethod: "pathFun"
        };
        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
            setNav
          );
        }
      } else {
        self.siteClickShow = false;
        Toast({
          message: "获取地理位置失败，暂无法签到",
          position: "bottom"
        });
      }
    };
  },
  beforeDestroy() {
    clearTimeout(self.carentTimeFunt);
  },
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
    // 过滤时间
    timeFun: function(val) {
      if (val) {
        var standardTime = new Date(val);
        var h, f, m;
        h = standardTime.getHours();
        h = h > 9 ? h : "0" + h;
        f = standardTime.getMinutes();
        f = f > 9 ? f : "0" + f;
        m = standardTime.getSeconds();
        m = m > 9 ? m : "0" + m;
        return h + ":" + f + ":" + m;
      } else {
        return "暂无";
      }
    },
    // 过滤日期
    dateFun: function(val) {
      if (val) {
        var standardTime = new Date(val);
        var y, m, d, h, f;
        y = standardTime.getFullYear();
        m = standardTime.getMonth() + 1;
        m = m > 9 ? m : "0" + m;
        d = standardTime.getDate();
        d = d > 9 ? d : "0" + d;
        return y + "." + m + "." + d;
      } else {
        return "暂无";
      }
    }
  },
  beforeDestroy() {
    clearTimeout(self.carentTimeFunt);
  },
  methods: {
    // 时间变化
    carentTimeFun() {
      var self = this;
      self.carentTimeFunt = null;
      self.currentTime = new Date();
      self.carentTimeFunt = setTimeout(time, 1000); //開始运行
      function time() {
        clearTimeout(self.carentTimeFunt); //清除定时器
        self.currentTime = new Date();
        self.carentTimeFunt = setTimeout(time, 1000); //设定定时器，循环运行
      }
    },
    locgFun() {
      var self = this;

      sessionStorage.setItem("normalSignO", self.O);
      sessionStorage.setItem("normalSignP", self.P);

      var lnglatXY = [self.O * 1, self.P * 1];
      var map = new AMap.Map("container2", {
        center: lnglatXY,
        resizeEnable: true,
        zoom: 9
      });
      var marker = new AMap.Marker({
        position: lnglatXY
      });
      marker.setMap(map);
      //已知点坐标
      //逆地理编码
      map.plugin(["AMap.Geocoder"], function() {
        map.addControl(new AMap.Geocoder());
      });
      var circle = new AMap.Circle({
        center: lnglatXY,
        radius: 42,
        fillOpacity: 0.2,
        strokeWeight: 1,
        fillColor: "#4390E1",
        strokeColor: "#4390E1"
      });
      circle.setMap(map);
      var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
      });
      self.signClickTrue = true;
      geocoder.getAddress(lnglatXY, function(status, result) {
        if (status === "complete" && result.info === "OK") {
          self.signClickTrue = false;
          if (sessionStorage.getItem("siteaddress")) {
            self.address = sessionStorage.getItem("siteaddress");
          } else {
            self.address =
              result.regeocode.addressComponent.street +
              result.regeocode.addressComponent.streetNumber;
          }
          if (sessionStorage.getItem("sitename")) {
            self.detailAddress = sessionStorage.getItem("sitename");
          } else {
            self.detailAddress = result.regeocode.formattedAddress;
          }
        } else {
          Toast({
            message: "获取地理位置失败",
            position: "bottom"
          });
        }
      });
    },
    // 查询当日签到次数
    signCountFun() {
      var self = this;
      self
        .getSignApiSignDetailOutGetSignInfo({
          userId: sessionStorage.getItem("singMemberId"),
          orgId: sessionStorage.getItem("singOrgId")
        })
        .then(data => {
          if (data.statusCode == 200) {
            self.signCount = data.data;
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
    },
    // 点击签到
    signClick() {
      var self = this;
      if (self.signClickTrue == false) {
        self.$router.push({
          path: "/optionOutSign"
        });
        sessionStorage.setItem("currentTime", self.currentTime);
        sessionStorage.setItem("address", self.address);
        sessionStorage.setItem("detailAddress", self.detailAddress);
      }
    },
    // 地点微调
    siteClick() {
      this.$router.push({
        path: "/siteOutSign"
      });
    },
    ...mapActions(["getSignApiSignDetailOutGetSignInfo"])
  },
  watch: {}
};
</script>
<style scoped>
.outSign {
  height: 100vh;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
  user-select: none;
}
.outSign > div:nth-child(1) {
  border-bottom: 1px solid #f7f7f7;
}

.top {
  padding-left: 0.4267rem;
  padding-right: 0.4267rem;
  display: flex;
  width: 100%;
  justify-content: flex-start;
}

.main {
  padding-left: 0.4267rem;
  padding-right: 0.4267rem;
}

.topHeadImg {
  margin-top: 0.2667rem;
  min-width: 1.1733rem;
  height: 1.1733rem;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}

.topHeadImg div {
  position: absolute;
  top: 0;
  left: 0;
  width: 1.1733rem;
  height: 1.1733rem;
  overflow: hidden;
  background-color: #4592e2;
  text-align: center;
  line-height: 1.1733rem;
  color: #fff;
  font-size: 0.3733rem;
  padding-top: 0.04rem;
}

.topHeadImg img {
  width: 1.1733rem;
  height: 1.1733rem;
  border-radius: 22px;
}

.top > div:nth-child(2) {
  margin-left: 0.32rem;
  margin-top: 0.2667rem;
  margin-bottom: 0.2667rem;
  width: 3.2267rem;
  margin-right: 17%;
}
.top > div:nth-child(2) > div:nth-child(1) {
  margin-top: 0.1067rem;
  min-width: 1.28rem;
  height: 0.4267rem;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.4267rem;
}
.top > div:nth-child(2) > div:nth-child(2) {
  min-width: 4.5rem;
  height: 0.3733rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.3733rem;
  margin-top: 0.2667rem;
}

.top > div:nth-child(3) {
  width: 4.4267rem;
  height: 0.32rem;
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.32rem;
  margin-top: 0.72rem;
  text-align: right;
}

.mainTop div {
  width: 9rem;
  height: 0.4rem;
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mainTop,
.mainMiddle {
  margin-top: 0.32rem;
}

.mainMiddle {
  display: flex;
  justify-content: flex-start;
}

.mainMiddle > div:nth-child(1) {
  width: 2.3467rem;
  height: 2.32rem;
}

.mainMiddle > div:nth-child(1) > img {
  width: 2.3467rem;
  height: 2.32rem;
}

.mainMiddle > div:nth-child(2) {
  margin-left: 0.7733rem;
}

.mainMiddle > div:nth-child(2) > div:nth-child(1) {
  width: 5.0667rem;
  height: 0.4767rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
  line-height: 0.4767rem;
  margin-bottom: 0.2133rem;
  margin-left: 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mainMiddle > div:nth-child(2) > div:nth-child(1) img {
  width: 0.3733rem;
  margin-right: 0.16rem;
}

.mainMiddle > div:nth-child(2) > div:nth-child(2) {
  width: 5.12rem;
  height: 0.8533rem;
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.4267rem;
  margin-bottom: 0.2133rem;
  margin-bottom: 0.4267rem;
  margin-left: 0.4941rem;
}

.mainMiddle > div:nth-child(2) > div:nth-child(3) {
  min-width: 1.7067rem;
  height: 0.4267rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(67, 144, 225, 1);
  line-height: 0.4267rem;
  margin-left: 0.4941rem;
}

.mainBottom {
  margin-top: 3.8667rem;
}
.mainBottomNo > div:nth-child(1) {
  background: #ccc !important;
  box-shadow: 0px 2px 12px 0px #ccc;
}
.mainBottom > div {
  position: relative;
  border-radius: 50%;
  margin: 0 auto;
  width: 3.4133rem;
  height: 3.4133rem;
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
  box-shadow: 0px 2px 12px 0px rgba(133, 181, 231, 1);
}
.mainBottom .signTime {
  text-align: center;
}

.signTime > div:nth-child(1) {
  width: 1.12rem;
  height: 0.48rem;
  font-size: 0.48rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  line-height: 0.48rem;
  position: absolute;
  top: 1.2rem;
  left: 1.1467rem;
  margin-bottom: 0.2133rem;
}

.signTime > div:nth-child(2) {
  width: 1.44rem;
  height: 0.32rem;
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  line-height: 0.32rem;
  position: absolute;
  top: 1.9733rem;
  left: 0.9867rem;
}
</style>