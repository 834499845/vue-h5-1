// 搜索
<template>
  <div class="siteSign">
    <div class="top">
      <div class="topContent">
        <div @click="searchSiteClick">
          <img src="/static/img/Group@3x.png" alt="">
        </div>
        <input type="text" placeholder="搜索" v-model="searchNameVal">
      </div>
    </div>
    <div class="bottom" v-show="dataLists.length > 0">
        <ul id="listUl">
          <li class="ifmt-list-bottom" v-for="(item,index) in dataLists" :key="index" @click="searchClick(index)">
            <div class="ifmt-list-bottomLeft">
              <div class="ifmt-list-bottomLeftTop">
                {{item.title}}
              </div>
              <div class="ifmt-list-bottomLeftBottom">
                {{item.createTime | timeFun}}
              </div>
            </div>
            <div class="ifmt-list-bottomRight">
              <img :src="item.pictureUrl | imgFun" alt="">
            </div>
          </li>
        </ul>
    </div>
    <div v-show="!isNullShow" class="ifmt-listNull">
      <div class="nullContent"></div>
        <img class="nullImg" src="/static/img/iconfont_default_search@3x.png" alt="">
        <div class="nullText">搜索</div>
    </div>
    <div class="loadingList" v-show="markerShwo">
      <mt-spinner type="fading-circle"></mt-spinner>
    </div>
    <div v-show="isNullShow" class="ifmt-listNull">
      <div class="nullContent"></div>
        <img class="nullImg" src="../../../static/img/zixun.png" alt="">
        <div class="nullText">暂无数据</div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isNullShow: false,
      markerShwo: false,
      searchNameVal: "",
      dataLists: [],
      loadingListShow: false
    };
  },
  components: {},
  methods: {
    // 列表点击
    searchClick(index) {
      this.$router.push({
        path: "/enterpriseDetails?id=" + this.dataLists[index].id
      });
    },
    // 点击搜索
    searchSiteClick() {
      var self = this;
      var listObj = {
        orgId: sessionStorage.getItem("infoOrgId"),
        title: val,
        pageNo: 1,
        pageSize: 150
      };
      self
        .getapiinfoappsearchpage(listObj)
        .then(data => {
          if (data.statusCode == 200) {
            if (data.data) {
              if (data.data.records) {
                self.dataLists = data.data.records;
              } else {
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
    },
    ...mapActions(["getapiinfoappsearchpage"])
  },
  mounted: function() {
    var self = this;
  },
  created: function() {
    var self = this;
    if (sessionStorage.getItem("searchNameVal")) {
      self.searchNameVal = sessionStorage.getItem("searchNameVal");
    }
    document.title = "搜索";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setRightImageType(10, "");
        window.BenchJSInterface.setTitle("搜索");
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
    dataLists(val) {
      this.$nextTick(() => {
        var container = this.$el.querySelector("#listUl");
        container.scrollTop = container.scrollHeight;
      });
    },
    searchNameVal(val) {
      var self = this;
      if (val.length > 0) {
        sessionStorage.setItem("searchNameVal", val);
        var listObj = {
          orgId: sessionStorage.getItem("infoOrgId"),
          title: val,
          pageNo: 1,
          pageSize: 100
        };
        self
          .getapiinfoappsearchpage(listObj)
          .then(data => {
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  self.dataLists = data.data.records;
                } else {
                  self.isNullShow = true;
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
      } else {
        self.isNullShow = false;
        self.dataLists = [];
      }
    }
  },
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
.ifmt-listNull {
  width: 100%;
  height: 100vh;
  /* line-height: 100vh; */
  /* margin-top: 50px; */
  text-align: center;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
}
.nullContent {
  height: 3.65rem;
}
.nullText {
  margin-top: 0.575rem;
}
.nullImg {
  width: 2.1rem;
  /* height: 2.45rem; */
}
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
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
}

.siteSign .top div {
  display: flex;
  height: 0.8533rem;
  line-height: 0.8533rem;
  background: rgba(241, 241, 241, 1);
  border-radius: 0.0533rem;
}

.topContent > div:nth-child(1) {
  position: relative;
  width: 1.0667rem;
}

.topContent {
  display: flex;
  align-items: center;
  height: 0.8533rem;
  border-radius: 0.0533rem;
  overflow: hidden;
}

.topContent > input {
  text-align: left;
  padding: 0;
  margin: 0;
  height: 0.62rem;
  line-height: 0.62rem;
  width: 8rem;
  color: rgba(192, 192, 192, 1);
  background: rgba(241, 241, 241, 1);
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
}

.bottom {
  position: relative;
  width: 10rem;
  height: calc(100vh - 1.2733rem);
  background: rgba(255, 255, 255, 1);
  overflow-y: scroll;
  overflow-x: hidden;
}

.ifmt-list-bottom::after {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 1px;
  width: calc(100% - 0.4267rem);
  background: rgba(192, 192, 192, 1);
  content: "";
}

.ifmt-list-bottom:nth-last-child(1)::after {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 0px;
  width: calc(100% - 0.4267rem);
  background: rgba(192, 192, 192, 1);
  content: "";
}

.ifmt-list-bottomLeft {
  max-width: 5.28rem;
  height: 2.24rem;
  margin-left: 16.0013px;
  margin-top: 0.4267rem;
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

.ifmt-list-bottomRight {
  width: 2.9333rem;
  height: 2.24rem;
  margin-right: 0.4267rem;
  margin-top: 0.4267rem;
}

.ifmt-list-bottomRight img {
  width: 100%;
  height: 100%;
}

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

.ifmt-list-bottom {
  height: 3.0933rem;
  background-color: #fff;
  width: 100%;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
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
</style>