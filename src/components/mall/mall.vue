<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div id="app" class="home">
        <div v-show="pathShow" class="nullTextLi">
            {{newstitle}}
        </div>
        <div class="main">
            <router-view class="view" keep-alive></router-view>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      newscontent: "",
      newstitle: "",
      date: "",
      pathShow: false
    };
  },
  computed: mapState([""]),
  filters: {},
  created: function() {
    var self = this;
    document.title = "商品分享";
    var pathStr,
      id = "";
    pathStr = self.$route.query.path;
    if (pathStr == 1) {
      this.$router.push({
        path: "/mall/lists",
        query: self.$route.query
      });
      this.pathShow = false;
    } else if (pathStr == 2) {
      this.$router.push({
        path: "/mall/particulars/commodity",
        query: self.$route.query
      });
      this.pathShow = false;
    } else {
      this.pathShow = true;
      this.newstitle = "暂无数据";
      this.$router.push({
        path: "/mall",
        query: self.$route.query
      });
    }
  },
  beforeDestroy: function() {},
  watch: {},
  methods: {
    ...mapActions([
      "getproductListGetProductList",
      "getproductListGetProductInfo"
    ])
  }
};
</script>
<style scoped>
#app {
  background-color: #fff;
  overflow-x: hidden;
  min-height: 100vh;
}

.nullTextLi {
  height: 19rem;
  width: 100%;
  background-color: #fff;
  color: #e5e5e5;
  font-size: 3rem;
  text-align: center;
  line-height: 19rem;
}

.main {
  width: 100%;
  height: 100%;
}
</style>