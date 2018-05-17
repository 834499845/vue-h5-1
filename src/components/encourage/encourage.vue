<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div id="app" class="home">
        <div v-show="!pathShow" class="main">
            <div class="title">
                {{newstitle}}
            </div>
            <div style="margin-top:5px;">{{date | UnFormatDates}}</div>
            <div class="content" v-html="newscontent">

            </div>
        </div>
        <div v-show="pathShow" class="nullShow">
            怎么会暂无数据呢？
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
      pathShow: false
    };
  },
  computed: mapState([""]),
  filters: {
    // 返回日期格式化
    UnFormatDates(date) {
      if (date == "") {
        return;
      } else {
        var y, m, d, h, f, s;
        var t = new Date(date);
        y = t.getFullYear();
        m = t.getMonth() + 1;
        d = t.getDate();
        h = t.getHours();
        f = t.getMinutes();
        return (
          y +
          "." +
          (m < 10 ? "0" + m : m) +
          "." +
          (d < 10 ? "0" + d : d) +
          "  " +
          (h < 10 ? "0" + h : h) +
          ":" +
          (f < 10 ? "0" + f : f)
        );
      }
    }
  },
  created: function() {
    var urlStr = location.href;
    document.title = "活动详情";
    var self = this;
    if (urlStr.indexOf("?")) {
      if (urlStr.indexOf("?") != -1) {
        if (urlStr.indexOf("=")) {
          if (urlStr.indexOf("=") != -1) {
            if (urlStr.indexOf("code")) {
              if (urlStr.indexOf("code") != -1) {
                var code = self.$route.query.code;
                if (code) {
                  self
                    .getpageContextselect({
                      dictionaryCode: code
                    })
                    .then(data => {
                      // console.log('获取轮播详情', JSON.parse(JSON.stringify(data)))
                      if (data.code == 200) {
                        if (data.data) {
                          if (data.data.length > 0) {
                            self.newscontent = data.data[0].content;
                            self.newstitle = data.data[0].title;
                            document.title = data.data[0].title;
                            self.date = data.data[0].createDate;
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

.content {
  min-height: 35.7rem;
  width: 100%;
  /*border:1px solid #000;*/
  margin: 1.43rem 0;
  /*overflow-x: auto;*/
}

.content p {
  font-size: 20px !important;
}
</style>