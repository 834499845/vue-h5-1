<!--地点微调-->
<template>
  <div class="siteSign">
    <div class="top">
      <div class="topContent">
        <div>
          <img src="/static/img/you.png" alt="">
        </div>
        <div class="noMaster" v-show="noMaster"  @click="searchSiteClick">
          <input type="text" placeholder="搜索">
        </div>
        <div class="isMaster" v-show="isMaster">
          <input type="text" placeholder="搜索" v-on:keyup.13="submit" v-model="addressVal">
          <img @click="removeClick" src="/static/img/否.png" alt="">
        </div>
        <div class="cancel" @click="cancelisMasterClick" v-show="isMaster">取消</div>
      </div>
    </div>
    <div class="master" v-show="isMasterShow"></div>
    <div class="normalSign-content">
      <div id="container">
      </div>
      <div class="container-center" @click="containerCenterClick">
        <img src="/static/img/定位.png" alt="">
      </div>
    </div>
    <div class="bottom">
      <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">
        <ul>
          <li v-for="(item,index) in dataLists" :key="index" @click="dataListsClick(index)">
            <div>
              <div>{{item.name}}</div>
              <div>{{item.address}}</div>
            </div>
            <div v-show="isSelectShow == index">
              <img src="/static/img/是.png" alt="">
            </div>
          </li>
        </ul>
      </v-scroll>
    </div>
    <div class="loadingList" v-show="markerShwo">
      <mt-spinner type="fading-circle"></mt-spinner>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import scroll from "../cModule/scroll";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      addressVal: "",
      aaplaceSearch: "",
      map: "",
      marker: "",
      marker1: "",
      markerShwo: false,
      page: 1,
      isSelectShow: 0,
      loadingText: "",
      dataLists: [],
      isMasterShow: false,
      noMaster: false,
      isMaster: true,
      address: "",
      name: "",
      O: "108.944634",
      P: "34.222256",
      myO: "108.944634",
      myP: "34.222256",
      Ocenter: "",
      Pcenter: "",
      orgIdVal: "123",
      cpointVal: "330",
      OVal: "",
      PVal: "",
      zoomVal: 10
    };
  },
  components: { "v-scroll": scroll },
  created: function() {
    var self = this;

    document.title = "地点微调";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn(
          "确定",
          "javascript:window.pathFun();"
        );
        window.BenchJSInterface.setTitle("地点微调");
        window.BenchJSInterface.setRightTwoBut("", "");
      }
    } else {
      var setNav = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          naviType: 0,
          titles: [{ name: "确定", code: "submit" }]
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
      if (self.$route.query.id) {
        history.go(-3);
      } else {
        history.go(-1);
      }
      sessionStorage.setItem("siteaddress", self.address);
      sessionStorage.setItem("sitename", self.name);
    };
    this.noMaster = true;
    this.isMaster = false;
  },
  mounted: function() {
    this.lngAndLatFun();
  },
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
                self.Ocenter = data.data.lat;
              }
              if (data.data.lat) {
                self.Pcenter = data.data.lng;
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
                  self.zoomVal = 10;
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
    // 搜索清除
    removeClick() {
      this.addressVal = "";
    },
    // 取消
    cancelisMasterClick() {
      // console.log(this.isMasterShow);
      this.isMasterShow = false;
      this.noMaster = true;
      this.isMaster = false;
    },
    containerCenterClick() {
      var self = this;
      self.marker1.setPosition([self.O, self.P]);
      self.map.setZoomAndCenter(self.zoomVal, [self.O, self.P]);
    },
    dataListsClick(index) {
      var self = this;
      this.isSelectShow = index;
      var locArr = [];
      var o = self.dataLists[index].location.O;
      var p = self.dataLists[index].location.P;
      self.marker1.setPosition([o, p]);
      self.map.setZoomAndCenter(self.zoomVal, [o, p]);
      (self.address = self.dataLists[index].address),
        (self.name = self.dataLists[index].name);
      self.OVal = self.dataLists[index].location.O;
      self.PVal = self.dataLists[index].location.P;
      // self.$router.push({
      //   path: '/normalSign'
      // })
    },
    submit() {
      this.$router.push({
        path: "/siteNormalSearchResult?name=" + this.addressVal
      });
    },
    searchSiteClick() {
      this.isMasterShow = true;
      this.noMaster = false;
      this.isMaster = true;
    },
    // 下拉刷新
    onRefresh(done) {
      var self = this;
      done();
    },
    // 上拉加载
    onInfinite(done) {
      var self = this;
      if (self.markerShwo == false) {
        self.markerShwo = true;
        self.loadingListShow = true;
        self.loadingText = "加载中···";
        self.aaplaceSearch = new AMap.PlaceSearch({
          //构造地点查询类
          pageSize: 10,
          type: "建筑",
          pageIndex: self.page,
          city: "029" //城市
        });
        var cpoint = [self.O, self.P]; //中心点坐标
        self.aaplaceSearch.searchNearBy("", cpoint, self.cpointVal, function(
          status,
          result
        ) {
          self.markerShwo = false;
          self.page++;
          if (result.length > 0) {
            self.dataLists = self.dataLists.concat(result.poiList.pois);
          } else {
            Toast({
              message: "没有更多数据了！",
              position: "bottom"
            });
          }
        });
      }
      done();
    },
    listFun() {
      var self = this;
      var lnglatXY = [];
      if (self.Ocenter) {
        lnglatXY = [self.Ocenter, self.Pcenter];
      } else {
        lnglatXY = [self.O, self.P];
      }
      var myLngLatXY = [self.O, self.P];
      self.map = new AMap.Map("container", {
        center: lnglatXY,
        resizeEnable: true,
        zoom: self.zoomVal
      });
      self.map.plugin(["AMap.ToolBar", "AMap.PlaceSearch"], function() {
        // self.map.addControl(new AMap.ToolBar());
        self.map.addControl(new AMap.PlaceSearch());
      });
      self.aaplaceSearch = new AMap.PlaceSearch({
        //构造地点查询类
        pageSize: 10,
        type: "建筑",
        pageIndex: self.page,
        city: "029" //城市
      });
      var cpoint = [self.O, self.P];
      self.aaplaceSearch.searchNearBy("", cpoint, self.cpointVal, function(
        status,
        result
      ) {
        if (result.poiList) {
          self.dataLists = result.poiList.pois;
        } else {
          Toast({
            message: "没有更多数据了！",
            position: "bottom"
          });
        }
      });
      var icon = new AMap.Icon({
        image: "/static/img/地图坐标.png", //24px*24px
        size: new AMap.Size(28, 28),
        offset: new AMap.Pixel(-14, -14)
      });
      var icon1 = new AMap.Icon({
        image: "/static/img/范围.png", //24px*24px
        size: new AMap.Size(20, 20),
        offset: new AMap.Pixel(-10, -10)
      });
      self.marker1 = new AMap.Marker({
        position: myLngLatXY,
        animation: "AMAP_ANIMATION_DROP",
        icon: icon
      });
      self.marker1.setMap(self.map);
      // 确认中心点
      self.marker = new AMap.Marker({
        icon: icon1,
        position: lnglatXY,
        offset: new AMap.Pixel(-10, -10)
      });
      self.marker.setMap(self.map);
      // 覆盖物
      var circle = new AMap.Circle({
        center: lnglatXY,
        radius: self.cpointVal,
        fillOpacity: 0.2,
        strokeWeight: 1,
        fillColor: "#4390E1",
        strokeColor: "#4390E1"
      });
      circle.setMap(self.map);
    },
    ...mapActions(["getSignApiSignGetSetting"])
  },
  watch: {}
};
</script>
<style scoped>
.siteSign {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  user-select: none;
}

.siteSign .top {
  padding: 0.1867rem 0.4267rem;
  /* background: rgba(255, 255, 255, 1); */
}

.top img {
  width: 0.4267rem;
  height: 0.4267rem;
  position: absolute;
  top: 0.2133rem;
  left: 0.48rem;
  z-index: 10000000;
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
  border: 1px solid #4490e1;
}

.container-center img {
  width: 0.8533rem;
  height: 0.8533rem;
}

.normalSign-content {
  width: 100%;
  height: 7.5467rem;
  position: relative;
}

#container {
  width: 100%;
  height: 7.5467rem;
  overflow: hidden;
}

.siteSign .top div {
  display: flex;
  height: 0.8533rem;
  line-height: 0.8533rem;
  /* background: rgba(241, 241, 241, 1); */
}

.topContent > div:nth-child(1) {
  position: relative;
  width: 1.0667rem;
  background: rgba(241, 241, 241, 1);
}

.topContent .noMaster input {
  text-align: left;
  height: 0.8533rem;
  line-height: 0.8533rem;
  padding-top: 0.08rem;
  width: 8rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
  background: rgba(241, 241, 241, 1);
  border-radius: 0;
}

.topContent .noMaster {
  text-align: left;
  height: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
}

.topContent .isMaster input {
  text-align: left;
  height: 0.8533rem;
  line-height: 0.8533rem;
  padding-top: 0.08rem;
  width: 6.9067rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
  background: rgba(241, 241, 241, 1);
  border-radius: 0;
}

.topContent .isMaster {
  text-align: left;
  height: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
  position: relative;
}

.topContent .cancel {
  padding-left: 0.3rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(67, 144, 225, 1);
  line-height: 0.4267rem;
  position: relative;
}
.isMaster img {
  width: 0.32rem;
  height: 0.32rem;
  position: fixed;
  top: 0.5rem;
  left: 7.7333rem;
}
.bottom {
  position: relative;
  width: 10rem;
  height: calc(100vh - 1.1733rem - 7.5467rem);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px -2px 6px 0px rgba(198, 198, 198, 0.5);
}

.loadingList {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 1.1733rem - 7.5467rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
}

.bottom li {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #f7f7f7;
  padding-bottom: 0.3733rem;
  padding-top: 0.3733rem;
}

.bottom li > div {
  padding-left: 0.4267rem;
  padding-right: 0.4267rem;
}

.bottom li > div:nth-child(1) {
  width: 7.0667rem;
  margin-right: 1.3333rem;
}

li > div:nth-child(1) > div:nth-child(1) {
  height: 0.4767rem;
  font-size: 0.4067rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.4767rem;
  margin-bottom: 0.2133rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 7.0667rem;
}

li > div:nth-child(1) > div:nth-child(2) {
  height: 0.32rem;
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.32rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.master {
  width: 10rem;
  height: 16.6133rem;
  position: absolute;
  top: 1.1733rem;
  left: 0rem;
  z-index: 100000000000;
  background: rgba(0, 0, 0, 0.4);
}
</style>