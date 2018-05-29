<!--日常签到-搜索结果-->
<template>
    <div class="siteSign">
      <div class="top">
        <div class="topContent">
          <div>
            <img src="/static/img/you.png" alt="">
          </div>
          <div class="isMaster">
            <input type="text" placeholder="搜索" v-model="searchName">
            <img @click="removeClick" src="/static/img/否.png" alt="">
          </div>
          <div @click="cancelisMasterClick" class="cancel">取消</div>
      </div>
      </div>
      <div class="bottom">
          <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">
            <ul id="listUl">
              <li v-for="(item,index) in dataLists" :key="index" @click="siteDetailClick(index)">
                <div>
                  <div>{{item.name}}</div>
                  <div>{{item.address}}</div>
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
      aaplaceSearch: "",
      map: "",
      markerShwo: false,
      page: 1,
      isSelectShow: 0,
      loadingText: "",
      searchName: "",
      dataLists: [],
      loadingListShow: false,
      addressVal: "",
      cpointVal: '',
      O: '',
      P: '',
    };
  },
  components: { "v-scroll": scroll },
  methods: {
    // 查看微调距离设置
    minDistanceFun() {
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
              if (data.data.distance) {
                 self.cpointVal = data.data.distance;                 
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
          // Toast({
          //   message: "服务器异常",
          //   position: "bottom"
          // });
        });
    },
    // 搜索清除
    removeClick() {
      this.searchName = "";
    },
    // 调到地点定位页面
    siteDetailClick(index) {
      var self = this;
      this.$router.go(-1);
      sessionStorage.setItem(
        "locationSearch",
        JSON.stringify(self.dataLists[index])
      );
    },
    // 取消
    cancelisMasterClick() {
      var self = this;
      // 
      self.$router.go(-1)
    },
    // 下拉刷新
    onRefresh(done) {
      let self = this;          
      done();
    },
    // 上拉加载
    onInfinite(done) {
      var self = this;
      if (self.loadingListShow == false) {
        if (self.markerShwo == false) {
          self.markerShwo = true;
          self.loadingText = "加载中···";
          var placeSearch = new AMap.PlaceSearch({
            //构造地点查询类
            pageSize: 10,
            // type: "建筑",
            pageIndex: self.page,
            city: "029" //城市
          });
          //关键字查询
          var cpoint = [self.O, self.P];
          self.aaplaceSearch.searchNearBy(self.searchName, cpoint, self.cpointVal, function(
            status,
            result
          ) {
            self.markerShwo = false;
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
            // if (status == "complete") {
            //   self.page++;
            //   self.dataLists = self.dataLists.concat(result.poiList.pois);
            // } else {
            //   self.loadingListShow = true;
            //   self.loadingText = "没有更多...";
            // }
          });
          var cpoint = [self.O, self.P];
          placeSearch.searchNearBy(self.searchName,cpoint, self.cpointVal,function(status, result) {
            self.markerShwo = false;
            if (status == "complete") {
              self.page++;
              self.dataLists = self.dataLists.concat(result.poiList.pois);
            } else {
              self.loadingListShow = true;
              self.loadingText = "没有更多...";
            }
          });
        }
      }
      done();
    },
     listFun() {
      var self = this;
      var lnglatXY = [];
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
        pageSize: 10,
        // type: "建筑",
        pageIndex: self.page,
        city: "029" //城市
      });
      var cpoint = [self.O, self.P];
      self.aaplaceSearch.searchNearBy(self.searchName, cpoint, self.cpointVal, function(
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
      // var icon1 = new AMap.Icon({
      //   image: "/static/img/范围.png", //24px*24px
      //   size: new AMap.Size(20, 20),
      //   offset: new AMap.Pixel(-10, -10)
      // });
      self.marker1 = new AMap.Marker({
        position: myLngLatXY,
        animation: "AMAP_ANIMATION_DROP",
        icon: icon
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
    // 地图列表
    // listFun() {
    //   var self = this;
    //   var lnglatXY = [];
    //   if (self.Ocenter) {
    //     lnglatXY = [self.Ocenter, self.Pcenter];
    //   } else {
    //     lnglatXY = [self.O, self.P];
    //   }
    //   var myLngLatXY = [self.O, self.P];
    //   self.searchName = "";
    //   self.page = 1;
    //   self.map = new AMap.Map("container", {
    //     center: myLngLatXY
    //   });
    //   self.map.plugin(["AMap.ToolBar", "AMap.PlaceSearch"], function() {
    //     self.map.addControl(new AMap.PlaceSearch());
    //   });
    //   var placeSearch = new AMap.PlaceSearch({
    //     //构造地点查询类
    //     pageSize: 10,
    //     type: "建筑",
    //     pageIndex: self.page,
    //     city: "029" ,//城市
    //   });
    //   var lnglatXY = [self.O*1,self.P*1]
    //   //关键字查询
    //   placeSearch.search(self.searchName,lnglatXY,self.cpointVal,function(status, result) {
    //     self.loadingListShow = false;
    //     if (status == "complete") {
    //       self.dataLists = result.poiList.pois;
    //       console.log(self.dataLists);
    //     } else {
    //       self.loadingListShow = true;
    //     }
    //   });
    // },
    ...mapActions(["getSignApiSignGetSetting"])
  },
  mounted: function() {
    var self = this;
    self.minDistanceFun();
  },
  created: function() {
    var self = this;
    var u = navigator.userAgent;
    document.title = "搜索";
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("搜索");
        window.BenchJSInterface.setRightBtn("", "");
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
  watch: {
    searchName(val) {
      var self = this;
      if (val) {
        var placeSearch = new AMap.PlaceSearch({
          //构造地点查询类
          pageSize: 10,
          type: "建筑",
          pageIndex: self.page,
          city: "029" //城市
        });
        self.O = sessionStorage.getItem("normalSignO")
        self.P = sessionStorage.getItem("normalSignP")
        var lnglatXY = [self.O*1,self.P*1]
        //关键字查询
        placeSearch.searchNearBy(val,lnglatXY,self.cpointVal,function(status, result) {
        //  if (status == "complete") {
        //     self.dataLists = result.poiList.pois;
        //   }
          if (result.poiList) {
          self.dataLists = result.poiList.pois;
          } else {
            Toast({
              message: "没有更多数据了！",
              position: "bottom"
            });
          }
        });
      }
    }
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
  }
};
</script>
<style scoped>
.siteSign {
  height: 100vh;
  overflow: hidden;
  width: 100%;
  background: rgba(255, 255, 255, 1);
}
.siteSign .top {
  padding: 0.1867rem 0.4267rem;
  background: rgba(255, 255, 255, 1);
}
.top img {
  width: 0.4267rem;
  height: 0.4267rem;
  position: absolute;
  top: 0.2133rem;
  left: 0.48rem;
  z-index: 10000000;
}

.main {
  width: 10rem;
  height: 7.5467rem;
  position: relative;
}

.main img {
  width: 10rem;
  height: 7.5467rem;
}

.main > div:nth-child(2) {
  width: 10rem;
  height: 7.5467rem;
  position: absolute;
  top: 0px;
  left: 0px;
  background: rgba(0, 0, 0, 0.4);
}

.siteSign .top div {
  display: flex;
  height: 0.8533rem;
  line-height: 0.8533rem;
  /* background: rgba(241, 241, 241, 1); */
  border-radius: 2px;
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
  font-size: 0.4267rem;
  color: #000;
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
  /* width: 1.1733rem; */
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
  padding-left: 0.4267rem;
  width: 10rem;
  height: calc(100vh - 1.1733rem);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px -2px 6px 0px rgba(198, 198, 198, 0.5);
}
.bottom ul {
  padding-left: 0.4267rem;
}
.bottom li {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #f7f7f7;
  padding-bottom: 0.3733rem;
  padding-top: 0.3733rem;
}

.bottom li > div:nth-child(1) {
  width: 7.0667rem;
  margin-right: 1.3333rem;
}

li > div:nth-child(1) > div:nth-child(1) {
  height: 0.4567rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
  line-height: 0.4567rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.2133rem;
}
.loadingList {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 1.1733rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
}

li > div:nth-child(1) > div:nth-child(2) {
  height: 0.42rem;
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.42rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>