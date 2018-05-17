<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="news">
    <div class="main" v-show="!pathShow">
      <div class="main-top">
        <img src="/static/img/大V上.png" alt="">
      </div>
      <div class="main-center">
        <div>
          {{textareaVal}}
        </div>
      </div>
      <div class="main-bottom">
        <img src="/static/img/大V下.png" alt="">
      </div>
    </div>
    <div class="nullShow" v-show="pathShow">
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
      pathShow: false,
      textareaVal: "暂无数据"
    };
  },
  filters: {
    // 返回日期格式化
    timeFun(date) {
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
    },
    numFun(val) {
      if (val == 0) {
        return val;
      } else {
        if (val) {
          return val;
        } else {
          return 0;
        }
      }
    },
    contentFun(val) {
      return val;
      //   if (val) {
      //     if (val.length > 30) {
      //       val = val.substring(0, 30);
      //       val = val + "...";
      //       return val;
      //     } else {
      //       return val;
      //     }
      //   } else {
      //     return "无";
      //   }
    },
    imgFun(val) {
      if (val) {
        return val;
      } else {
        return "/static/img/ren.png";
      }
    },
    strFun(val) {
      if (val) {
        return val;
      } else {
        return "无";
      }
    }
  },
  created: function() {
    var self = this;
    document.title = "大V特权详情";
    // answerId=32eb2e5480484723a0b19a52dcff1945
    var token = self.$route.query.token;
    if (self.$route.query.token) {
      self
        .getapiuserPermissionApigetWhetherVDescribe({
          token: token
        })
        .then(data => {
          if (data.code == 200) {
            self.pathShow = false;
            if (data.data) {
              self.textareaVal = data.data;
            } else {
              self.textareaVal = "暂无特权";
            }
          } else {
            self.pathShow = true;
            Toast({
              message: data.message,
              className: "toastLoad"
            });
          }
        })
        .catch(msg => {
          self.pathShow = true;
          Toast({
            message: "服务器错误",
            className: "toastLoad"
          });
        });
    } else {
      self.pathShow = true;
    }
  },
  beforeDestroy: function() {},
  watch: {},
  methods: {
    ...mapActions(["getapiuserPermissionApigetWhetherVDescribe"])
  }
};
</script>
<style scoped>
.main {
  overflow: hidden;
  background-color: #000 !important;
  width: 100%;
  min-height: 100vh;
}
.main-top {
  height: 370px;
  margin: 0;
  overflow: hidden;
  padding: 0;
  width: 100vw;
}
.main-top img {
  height: 100%;
}
.main-center div {
  color: #fff;
  font-size: 14px;
  color: rgba(253, 233, 143, 1);
  background-color: #000;
  border: 0;
  resize: none;
  width: 80%;
  margin-top: 2.5rem;
}
.main-center {
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
  overflow: hidden;
  min-height: calc(100vh - 370px - 79px);
}
.main-bottom {
  position: fixed;
  bottom: 0;
  margin: 0;
  overflow: hidden;
  left: 0;
}

.nullShow {
  height: 10rem;
  color: #e6e6e6;
  font-size: 3rem;
  text-align: center;
  line-height: 10rem;
}

.news {
  background-color: #f7f7f7 !important;
  overflow-x: hidden;
  min-height: 100vh;
  /* padding: 1.07rem; */
}
</style>