<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div id="app" class="home">
        <div v-show="pathShow" class="nullShow">
            暂无数据
        </div>
        <div class="main" v-show="!pathShow">
            <div class="detailsTitle">
                <!--<div>
                    商品介绍
                </div>-->
            </div>
            <div id="detailsHtml">
                <div class="htmlCont" v-html="detailsCont">
                </div>
            </div>
        </div>
        <div id="backTop" @touchstart="backTopTouchstart($event)" @touchend="backTopTouchend($event)">
            <img src="/static/img/top.png" alt="返回">
        </div>
        <!--<a href="javascript:scrollTo(0,0);" id="backTop"></a>-->
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      detailsCont: "",
      startTouchBackTop: 0,
      pathShow: false
    };
  },
  computed: mapState([""]),
  filters: {},
  created: function() {
    var self = this;
    var urlStr = location.href;
    var paths = "";
    var code = "";
    document.title = "商品详情";
    // alert('commodity==' + urlStr)
    if (urlStr.indexOf("?")) {
      if (urlStr.indexOf("?") != -1) {
        if (urlStr.indexOf("=")) {
          if (urlStr.indexOf("=") != -1) {
            if (urlStr.indexOf("id")) {
              if (urlStr.indexOf("id") != -1) {
                var id = self.$route.query.id;
                if (id) {
                  self
                    .getproductListGetProductInfo({
                      productId: id
                    })
                    .then(data => {
                      // console.log('商品详情', JSON.parse(JSON.stringify(data)))
                      self.loading = false;
                      if (data.code == 200) {
                        if (data.data) {
                          if (data.data.product) {
                            if (data.data.product.details) {
                              self.detailsCont = data.data.product.details;
                              self.pathShow = false;
                            } else {
                              self.pathShow = true;
                            }
                          } else {
                            self.pathShow = true;
                          }
                        } else {
                          self.pathShow = true;
                        }
                      } else {
                        self.pathShow = true;
                      }
                    })
                    .catch(msg => {
                      self.pathShow = true;
                      // console.log(msg)
                    });
                } else {
                  // console.log('网址错误')
                  self.pathShow = true;
                }
              } else {
                // console.log('网址错误')
                self.pathShow = true;
              }
            } else {
              // console.log('网址错误')
              self.pathShow = true;
            }
          } else {
            // console.log('网址错误')
            self.pathShow = true;
          }
        } else {
          // console.log('网址错误')
          self.pathShow = true;
        }
      } else {
        // console.log('网址错误')
        self.pathShow = true;
      }
    } else {
      // console.log('网址错误')
      self.pathShow = true;
    }
  },
  beforeDestroy: function() {},
  watch: {},
  methods: {
    // back top touch event
    backTopTouchstart(event) {
      this.startTouchBackTop = event.changedTouches[0].clientY;
    },
    backTopTouchend(event) {
      var self = this;
      var distance = event.changedTouches[0].clientY - this.startTouchBackTop;
      if (15 > distance && distance > -15) {
        // console.log('商品详情')
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        window.scrollTo(0, 0);
      }
    },
    ...mapActions(["getproductListGetProductInfo"])
  },
  mounted: function() {}
};
</script>
<style scoped>
#backTop {
  position: fixed;
  bottom: 6.827rem;
  right: 1.365rem;
  width: 3.84rem;
  height: 3.94rem;
  z-index: 999999;
  overflow: hidden;
}

#backTop img {
  width: 100%;
  height: 100%;
}

.nullShow {
  height: 10rem;
  color: #e6e6e6;
  font-size: 3rem;
  text-align: center;
  line-height: 10rem;
}

#app {
  background-color: #fff;
  overflow-x: hidden;
  height: 100%;
}

.main {
  width: 100%;
  height: 100%;
}

.detailsTitle > div {
  padding-left: 1.109rem;
  width: 100%;
  line-height: 3.755rem;
  font-size: 1.28rem;
  color: #454545;
  border-bottom: 1px solid #e6e6e6;
}

.detailsTitle {
  height: 0.255rem;
  width: 100%;
  background-color: #fff;
  overflow: hidden;
  position: relative;
}

#detailsHtml {
  width: 100%;
  overflow: hidden;
}

#detailsHtml img {
  width: 100% !important;
}
</style>