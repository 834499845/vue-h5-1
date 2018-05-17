<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div id="app" class="mallList">
        <ul>
            <li v-show="lists.length > 0" class="dataLi" :key="index" v-for="(item,index) in lists" @touchstart="mallListTouchstart($event)" @touchend="mallListTouchend($event,index)">
                <div class="dataLeft">
                    <img :src="item.picture" alt="">
                </div>
                <div class="dataRight">
                    <div class="dataRightOne">
                        {{item.productName}}
                    </div>
                    <div class="dataRightOTwo">
                        <div>
                            <small>￥</small> <small>{{item.productPrice}}</small>
                        </div>
                        <div>
                            优惠券
                        </div>
                    </div>
                    <div class="dataRightThr">
                        <div>
                            定制
                        </div>
                        <div>
                            <small>12345</small><small>条评论</small>
                        </div>
                    </div>
                </div>
            </li>
            <li v-show="lists.length == 0" class="nullLi">
                {{newstitle}}
            </li>
        </ul>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      newstitle: "",
      startTouchYShop: 0,
      lists: []
    };
  },
  computed: mapState([""]),
  filters: {},
  created: function() {
    var urlStr = location.href;
    var paths = "";
    var code = "";
    document.title = "商品分享";
    var self = this;
    if (urlStr.indexOf("?")) {
      if (urlStr.indexOf("?") != -1) {
        paths = urlStr.split("?")[1];
        if (paths.indexOf("=")) {
          if (paths.indexOf("=") != -1) {
            var idarr = self.$route.query.ids;
            if (idarr) {
              self
                .getproductListGetProductList({
                  pageSize: 30,
                  pageNo: 1,
                  ids: idarr
                })
                .then(data => {
                  console.log("商品列表数据", JSON.parse(JSON.stringify(data)));
                  self.loading = false;
                  if (data.code == 200) {
                    if (data.data) {
                      if (data.data.records) {
                        if (data.data.records.length > 0) {
                          self.lists = data.data.records;
                        } else {
                          self.newstitle = "暂无数据";
                        }
                      } else {
                        self.newstitle = "暂无数据";
                      }
                    } else {
                      self.newstitle = "暂无数据";
                    }
                  } else {
                    self.newstitle = "暂无数据";
                  }
                })
                .catch(msg => {
                  self.newstitle = "暂无数据";
                  console.log(msg);
                });
            } else {
              console.log("网址错误");
              self.newstitle = "暂无数据";
            }
          } else {
            console.log("网址错误");
            self.newstitle = "暂无数据";
          }
        } else {
          console.log("网址错误");
          self.newstitle = "暂无数据";
        }
      } else {
        console.log("网址错误");
        self.newstitle = "暂无数据";
      }
    } else {
      console.log("网址错误");
      self.newstitle = "暂无数据";
    }
  },
  beforeDestroy: function() {},
  watch: {},
  methods: {
    // 商城详情
    mallListTouchstart(event) {
      this.startTouchYShop = event.changedTouches[0].clientY;
    },
    mallListTouchend(event, index) {
      var self = this;
      var distance = event.changedTouches[0].clientY - this.startTouchYShop;
      if (15 > distance && distance > -15) {
        console.log("商品详情", self.$route.query);
        self.$router.push({
          path: "/mall/particulars/commodity",
          query: {
            sort: self.$route.query.sort,
            path: 2,
            id: self.lists[index].productId
          }
        });
      }
    },
    ...mapActions([
      "getproductListGetProductList",
      "getproductListGetProductInfo"
    ])
  }
};
//   11.71875
</script>
<style scoped>
.dataRightOne {
  height: 5.5467rem;
  font-size: 1.365rem;
  color: #030303;
  overflow: hidden;
}

.dataRightOTwo {
  display: flex;
}

.dataRightOTwo > div:nth-child(1) {
  max-width: 13.65rem;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.dataRightOTwo > div:nth-child(1) small:nth-child(1) {
  font-size: 1.024rem;
  color: #cb4a37;
}

.dataRightOTwo > div:nth-child(1) small:nth-child(2) {
  font-size: 1.451rem;
  color: #cb4a37;
}

.dataRightOTwo > div:nth-child(2) {
  width: 4.096rem;
  text-align: center;
  line-height: 1.71rem;
  color: #fff;
  height: 1.71rem;
  font-size: 1.024rem;
  background-color: #cb4a37;
  border-radius: 0.256rem;
  margin-left: 0.85rem;
}

.dataRightThr {
  display: flex;
  align-items: center;
  margin-top: 0.425rem;
}

.dataRightThr > div:nth-child(1) {
  width: 3.243rem;
  text-align: center;
  height: 1.536rem;
  color: #eb4242;
  height: 1.536rem;
  font-size: 0.939rem;
  border: 1px solid #cb4a37;
  border-radius: 0.256rem;
}

.dataRightThr > div:nth-child(2) {
  margin-left: 0.425rem;
  display: flex;
  align-items: center;
}

.dataRightThr > div:nth-child(2) small {
  font-size: 1.024rem;
  color: #030303;
  opacity: 0.45;
}

.dataRight {
  overflow: hidden;
  margin-top: 0.86rem;
  margin-left: 1.28rem;
  height: 9.8rem;
  width: calc(100vw - 12.36rem);
  overflow: hidden;
}

.dataLeft {
  width: 9.8rem;
  height: 9.8rem;
  overflow: hidden;
  margin-top: 0.86rem;
}

.dataLeft img {
  width: 100%;
  height: 100%;
}

.mallList .dataLi {
  height: 11.52rem;
  width: 100%;
  display: flex;
  border-bottom: 1px solid #d1d1d1;
}

.mallList .dataLi:nth-last-child(1) {
  border-bottom: 0;
}

.mallList {
  min-height: 205px;
  width: 100%;
}

.mallList .nullLi {
  height: 135px;
  width: 100%;
  text-align: center;
  line-height: 135px;
  font-size: 1.9rem;
  font-weight: 600;
  color: #cb4a37;
  opacity: 0.75;
}
</style>