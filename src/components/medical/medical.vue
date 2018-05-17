<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="home">
        <div v-show="!pathShow" class="main">
            <div class="title">
                {{newstitle}}
            </div>
            <div style="margin-top:5px;">{{date | UnFormatDates}}</div>
            <div class="content" v-html="newscontent">

            </div>
        </div>
        <div v-show="pathShow" class="nullShow">
            暂无数据
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
      pathShow: false,
      image: ""
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
    var self = this;
    document.title = "文章分享";
    var urlStr = location.href;
    if (urlStr.indexOf("?")) {
      if (urlStr.indexOf("?") != -1) {
        if (urlStr.indexOf("=")) {
          if (urlStr.indexOf("=") != -1) {
            if (urlStr.indexOf("id")) {
              if (urlStr.indexOf("id") != -1) {
                var idStr = self.$route.query.id;
                if (idStr) {
                  self
                    .getmedicalarticleSelectById({
                      articleId: idStr
                    })
                    .then(data => {
                      console.log("医疗分享列表", data);
                      if (data.code == 200) {
                        document.title = data.data.articleTitle;
                        self.newstitle = data.data.articleTitle;
                        self.date = data.data.createDate;
                        self.newscontent = data.data.articleContent;
                      } else {
                        Toast({
                          message: data.message,
                          className: "toastLoad"
                        });
                      }
                    })
                    .catch(msg => {
                      console.log(msg);
                      Toast({
                        message: "服务器错误",
                        className: "toastLoad"
                      });
                    });
                } else {
                  console.log("网址错误");
                  self.pathShow = true;
                }
              } else {
                console.log("网址错误");
                self.pathShow = true;
              }
            } else {
              console.log("网址错误");
              self.pathShow = true;
            }
          } else {
            console.log("网址错误");
            self.pathShow = true;
          }
        } else {
          console.log("网址错误");
          self.pathShow = true;
        }
      } else {
        console.log("网址错误");
        self.pathShow = true;
      }
    } else {
      console.log("网址错误");
      self.pathShow = true;
    }
  },
  beforeDestroy: function() {},
  watch: {},
  methods: {
    ...mapActions(["getmedicalarticleSelectById"])
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

.home {
  background-color: #fff;
  overflow-x: hidden;
  height: 100vh;
  /*border: 1px solid red;*/
  padding: 1.07rem;
}

.title {
  color: #2d2a2a;
  font-size: 1.636rem;
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