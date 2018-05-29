<!--地点微调-->
<template>
  <div class="siteSign">
    <div class="top">
      <div class="topContent" @click="searchSiteClick">
        <div>
          <img src="/static/img/you.png" alt="">
        </div>
        <div>
          搜索
        </div>
      </div>
    </div>
    <!-- <div class="master" v-show="isMasterShow"></div> -->
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
          <li v-show="locationSearchObjShwo" @click="dataListsClick(99999999999999)">
            <div>
              <div>{{locationSearchObj.name}}</div>
              <div>{{locationSearchObj.address}}</div>
            </div>
            <div v-show="isSelectShow == 99999999999999">
              <img src="/static/img/是.png" alt="">
            </div>
          </li>
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
      locationSearchObjShwo: false,
      locationSearchObj: {
        name: "",
        address: "",
        o: "",
        p: ""
      },
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
      O: "",
      P: "",
      myO: "",
      myP: "",
      Ocenter: "",
      Pcenter: "",
      orgIdVal: "",
      cpointVal: 1000,
      OVal: "",
      PVal: "",
      zoomVal: 14,
      distanceStatusVal: "",
      rangeVal: ""
    };
  },
  components: { "v-scroll": scroll },
  created: function() {
    var self = this;
    document.title = "地点微调";
    self.O = sessionStorage.getItem("normalSignO");
    self.P = sessionStorage.getItem("normalSignP");
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
        window.BenchJSInterface.setTopBarColor(1);
      }
    } else {
      var setNav = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          naviType: 0,
          titles: [{ name: "确定", code: "submit", notEnable: 0 }]
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
      if (self.isSelectShow == 99999999999999) {
        var addObStr = sessionStorage.getItem("locationSearch");
        var addObStrObj = JSON.parse(addObStr);
        sessionStorage.setItem("siteaddress", addObStrObj.address);
        sessionStorage.setItem("sitename", addObStrObj.name);
        sessionStorage.setItem("siteO", self.OVal);
        sessionStorage.setItem("siteP", self.PVal);
      } else {
        sessionStorage.setItem("siteaddress", self.address);
        sessionStorage.setItem("sitename", self.name);
        sessionStorage.setItem("siteO", self.OVal);
        sessionStorage.setItem("siteP", self.PVal);
      }
      self.$router.go(-1);
    };
  },
  mounted: function() {
    this.minDistanceFun();
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
    // 查看微调距离设置
    minDistanceFun() {
      var self = this;
      // self.O = sessionStorage.getItem("normalSignO");
      // self.P = sessionStorage.getItem("normalSignP");
      self
        .getSignApiSignGetSetting({
          orgId: sessionStorage.getItem("singOrgId")
        })
        .then(data => {
          if (data.statusCode == 200) {
            if (data.data) {
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
            message: "加载中...",
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

      if (self.isSelectShow == 99999999999999) {
        var addObStr = sessionStorage.getItem("locationSearch");
        var addObStrObj = JSON.parse(addObStr);
        var o = addObStrObj.location.O;
        var p = addObStrObj.location.P;
        self.marker1.setPosition([o, p]);
        self.map.setZoomAndCenter(self.zoomVal, [o, p]);
        self.address = addObStrObj.address;
        self.name = addObStrObj.name;
        self.OVal = addObStrObj.location.O;
        self.PVal = addObStrObj.location.P;
      } else {
        var o = self.dataLists[index].location.O;
        var p = self.dataLists[index].location.P;
        self.marker1.setPosition([o, p]);
        self.map.setZoomAndCenter(self.zoomVal, [o, p]);
        self.address = self.dataLists[index].address;
        self.name = self.dataLists[index].name;
        self.OVal = self.dataLists[index].location.O;
        self.PVal = self.dataLists[index].location.P;
      }
    },
    submit() {
      this.$router.push({
        path: "/siteNormalSearchResult?name=" + this.addressVal
      });
    },
    searchSiteClick() {
      this.$router.push({
        path: "/siteNormalSearchResult"
      });
      // sessionStorage.setItem("searchLists",this.dataLists)
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
          pageSize: 50,
          type: "建筑",
          pageIndex: self.page,
          city: "029" //城市
        });
        var cpoint = [self.O, self.P]; //中心点坐标
        self.aaplaceSearch.searchNearBy("", cpoint, self.cpointVal, function(
          status,
          result
        ) {
          if (result) {
            self.markerShwo = false;
            self.page++;
            if (result.length > 0) {
              self.dataLists = self.dataLists.concat(result.poiList.pois);
            } else {
              Toast({
                message: "没有更多数据了！",
                position: "bottom"
              });
              self.loadingText = "没有更多数据了！";
            }
          } else {
            Toast({
              message: "没有更多数据了！",
              position: "bottom"
            });
            self.loadingText = "没有更多数据了！";
          }
        });
      }
      done();
    },
    listFun() {
      var self = this;
      var lnglatXY = [];
      var myLngLatXY = [];
      if (sessionStorage.getItem("locationSearch")) {
        self.locationSearchObjShwo = true;
        var addObStr = sessionStorage.getItem("locationSearch");
        var addObStrObj = JSON.parse(addObStr);
        self.locationSearchObj.name = addObStrObj.name;
        self.locationSearchObj.address = addObStrObj.address;
        self.locationSearchObj.o = addObStrObj.location.O;
        self.locationSearchObj.p = addObStrObj.location.P;
        self.isSelectShow = 99999999999999;

        myLngLatXY = [
          self.locationSearchObj.o * 1,
          self.locationSearchObj.p * 1
        ];
      } else {
        myLngLatXY = [self.O, self.P];
      }
      lnglatXY = [self.O, self.P];
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
        pageSize: 50,
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
        size: new AMap.Size(14, 14),
        offset: new AMap.Pixel(-14, -14)
      });
      // var icon1 = new AMap.Icon({
      //   image: "/static/img/范围.png", //24px*24px
      //   size: new AMap.Size(20, 20),
      //   offset: new AMap.Pixel(-10, -10)
      // });
      self.marker1 = new AMap.Marker({
        position: myLngLatXY,
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
  align-items: center;
}
.topContent {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(241, 241, 241, 1);
}
.topContent > div:nth-child(1) img {
  width: 0.4267rem;
  height: 0.4267rem;
}
.topContent > div:nth-child(1) {
  width: 0.4267rem;
  height: 0.4267rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.0533rem;
}
.topContent > div:nth-child(2) {
  width: 1.0133rem;
  margin-left: 0.0533rem;
  height: 0.8533rem;
  font-size: 0.3733rem;
  color: rgba(192, 192, 192, 1);
  display: flex;
  justify-content: center;
  align-items: center;
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

.bottom img {
  width: 0.5867rem;
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
  height: 0.39rem;
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.39rem;
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