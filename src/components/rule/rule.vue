<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div id="app" class="home">
        <div v-show="!pathShow" class="content" v-html="newscontent">
        </div>
        <div v-show="pathShow" class="nullShow">
            暂无数据
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      newscontent: "",
      newstitle: "",
      date: "",
      pathShow: false,
      nullName: "暂无数据"
    };
  },
  computed: mapState([""]),
  filters: {},
  created: function() {
    var urlStr = location.href;
    document.title = "详情";
    var self = this;
    if (urlStr.indexOf("?")) {
      if (urlStr.indexOf("?") != -1) {
        if (urlStr.indexOf("=")) {
          if (urlStr.indexOf("=") != -1) {
            if (urlStr.indexOf("code")) {
              if (urlStr.indexOf("code") != -1) {
                var code = self.$route.query.code;
                if (code) {
                  if (code == "termsOfService") {
                    document.title = "服务条款";
                  } else if (code == "privacyPolicy") {
                    document.title = "隐私条款";
                  } else {
                    document.title = "身份认证协议";
                  }
                  self
                    .getpageContextselect({
                      dictionaryCode: code
                    })
                    .then(data => {
                      // console.log('根据code获取单页详情', JSON.parse(JSON.stringify(data)))
                      self.loading = false;
                      if (data.code == 200) {
                        if (data.data) {
                          if (data.data.length > 0) {
                            self.newscontent = data.data[0].content;
                          } else {
                            self.nullShow = false;
                            self.nullName = "暂无数据";
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
    ...mapActions(["getpageContextselect"])
  }
};
</script>
<style scoped>
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
  height: 100vh;
  /*border: 1px solid red;*/
  padding: 1.07rem;
}

.title {
  color: #2d2a2a;
  font-size: 1.28rem;
  line-height: 2rem;
}

p {
  font-size: 15px !important;
}

.content {
  min-height: 35.7rem;
  width: 100%;
  /*border:1px solid #000;*/
  margin-bottom: 1.43rem;
  /*overflow-x: auto;*/
}

.content p {
  font-size: 20px !important;
}
</style>