<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="particulars">
        <div class="navBar">
            <div>
                <ul>
                    <li v-for="(nav,index) in navs" :key="index" :class="{selectNav:isSelectNav == index}" @touchend="navTouchend(index)">{{nav.name}}</li>
                </ul>
            </div>
        </div>
        <div class="content">
            <router-view class="viewA" keep-alive></router-view>
        </div>
        <div class="replaceFootBar">
        </div>
        <div class="footBar">
            <div class="footBarLeft">
                <div @touchend="personalTouchend">
                    <img src="/static/img/ren.png" alt="个人中心">
                </div>
                <div @touchend="attentionTouchend">
                    <img src="/static/img/xin.png" alt="关注">
                </div>
                <div @touchend="shopingCatTouchend">
                    <img src="/static/img/che.png" alt="加入购物车">
                </div>
            </div>
            <div class="footBarCenter" @touchend="shopCatTouchend">
                加入购物车
            </div>
            <div class="footBarRight" @touchend="purchaseTouchend">
                立即购买
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      isSelectNav: 0,
      navs: [
        {
          name: "商品",
          path: "commodity"
        },
        {
          name: "评价",
          path: "evaluate"
        },
        {
          name: "详情",
          path: "details"
        }
      ]
    };
  },
  computed: mapState([""]),
  filters: {},
  created: function() {
    var self = this;
    document.title = "商品分享";
    self.fetchData();
  },
  beforeDestroy: function() {},
  watch: {},
  methods: {
    // 路由监视
    fetchData() {
      var self = this;
      var paths = this.$route.path.split("/");
      var oneStr = paths[3];
      switch (oneStr) {
        case "commodity":
          self.isSelectNav = 0;
          break;
        case "evaluate":
          self.isSelectNav = 1;
          break;
        case "details":
          self.isSelectNav = 2;
          break;
        default:
          break;
      }
    },
    // navbar touch event
    navTouchend(index) {
      var self = this;
      this.isSelectNav = index;
      var pathStr = this.navs[index].path;
      this.$router.push({
        path: "/mall/particulars/" + pathStr,
        query: self.$route.query
      });
    },
    // personal touch event
    personalTouchend() {
      var self = this;
      var urlStr = location.href;
      var paths = "";
      var code = "";
      if (urlStr.indexOf("?")) {
        if (urlStr.indexOf("?") != -1) {
          paths = urlStr.split("?")[1];
          if (paths.indexOf("=")) {
            if (paths.indexOf("=") != -1) {
              var id = self.$route.query.id;
              if (id) {
                window.open("BKLShopDetail://?goodsId=" + id);
                // window.location = "BKLShopDetail://?goodsId=" + id
                // OCModel.didFinishLoad();
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
    // attention touch event
    attentionTouchend() {
      var self = this;
      var id = self.$route.query.id;
      window.open("BKLShopDetail://?goodsId=" + id);
      // window.location = "BKLShopDetail://?goodsId=" + id
      // OCModel.didFinishLoad()
    },
    // shoping touch event
    shopingCatTouchend() {
      var self = this;
      var id = self.$route.query.id;
      window.open("BKLShopDetail://?goodsId=" + id);
      // window.location = "BKLShopDetail://?goodsId=" + id
      // OCModel.didFinishLoad()
    },
    // shopCat touch event
    shopCatTouchend() {
      var self = this;
      var id = self.$route.query.id;
      window.open("BKLShopDetail://?goodsId=" + id);
      // window.location = "BKLShopDetail://?goodsId=" + id
      // OCModel.didFinishLoad()
    },
    // purchase touch event
    purchaseTouchend() {
      var self = this;
      var id = self.$route.query.id;
      window.open("BKLShopDetail://?goodsId=" + id);
      // window.location = "BKLShopDetail://?goodsId=" + id
      // OCModel.didFinishLoad();
    },
    ...mapActions([
      "getproductListGetProductList",
      "getproductListGetProductInfo"
    ])
  },
  // 监视
  watch: {
    $route: "fetchData"
  }
};
</script>
<style scoped>
.content {
  width: 100%;
  min-height: calc(100vh - 7.765rem);
  background-color: #f5f5f5;
}

.replaceFootBar {
  height: 3.925rem;
}

.footBarLeft {
  display: flex;
  width: calc(100vw - 18.774rem);
  align-items: center;
}

.footBarLeft > div {
  width: 1.877rem;
  height: 1.877rem;
}

.footBarLeft > div:nth-child(1) {
  margin-left: 1.707rem;
}

.footBarLeft > div:nth-child(2) {
  margin-left: 2.1333rem;
}

.footBarLeft > div:nth-child(3) {
  margin-left: 2.1333rem;
}

.footBarLeft > div img {
  width: 100%;
  height: 100%;
}

.footBarCenter {
  width: 9.387rem;
  text-align: center;
  line-height: 3.925rem;
  height: 100%;
  background-color: #fd8f4b;
  font-size: 1.365rem;
  color: #fff;
}

.footBarRight {
  width: 9.387rem;
  text-align: center;
  line-height: 3.925rem;
  height: 100%;
  background-color: #ed5236;
  font-size: 1.365rem;
  color: #fff;
}

.footBar {
  position: fixed;
  -webkit-overflow-scroll: touch;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3.925rem;
  border-top: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  background-color: #fff;
  -webkit-transform: translateZ(0);
}

.navBar > div li {
  width: 2.816rem;
  height: 3.669rem;
  text-align: center;
  line-height: 3.669rem;
  color: #2e2e2e;
  font-size: 1.28rem;
}

.navBar > div .selectNav {
  border-bottom: 0.171rem solid #ff9f4d;
  color: #ff9f4d;
}

.navBar > div ul {
  display: flex;
  justify-content: space-between;
}

.navBar > div {
  width: 14.51rem;
  height: 100%;
}

.navBar {
  height: 3.84rem;
  width: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.particulars {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>