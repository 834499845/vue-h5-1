<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="integral">
    <div class="main">
      <div class="nav">
        <div class="nav-left">
          <div class="nav-left-img">
            <img :src="headImg | imgFun" alt="">
          </div>
          <div class="nav-left-name">
            {{headName}}
          </div>
        </div>
        <div class="nav-rightNum">
          <div class="nav-rightNum-top">
            {{headNum}}/{{headMaxNum}}
          </div>
          <div class="nav-rightNum-bottom">
            勋章数
          </div>
        </div>
      </div>
      <div class="content-fister">
      </div>
      <div class="content">
        <ul>
          <li class="content-li" v-for="(item,index) in lists" :key="index">
            <div>
              <img :src="item.itemBrightImage | imgFun" alt="">
            </div>
            <div>
              {{item.name}}
            </div>
          </li>
        </ul>
      </div>
      <div class="footer-code">
        <div class="footer-code-top">
          <div>
            伯&nbsp;&nbsp;&nbsp;图&nbsp;&nbsp;&nbsp;全&nbsp;&nbsp;&nbsp;景
          </div>
        </div>
        <div class="footer-code-bottom">
          <div>
            <img src="/static/img/vorue.png" alt="">
          </div>
          <div>
            <img src="/static/img/伯图图标@2x.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="nullShow">
      暂无数据
    </div> -->
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      lists: [],
      headImg: "",
      headName: "",
      headMaxNum: "",
      headNum: ""
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
    document.title = "积分管理";
    // id=73db26dc2e5743c3bf98a0f0d78e2398
    var idStr = self.$route.query.id;
    if (self.$route.query.id) {
      self
        .getapiuserMedalgetUserMedal({
          userId: self.$route.query.id
        })
        .then(data => {
          if (data.code == 200) {
            self.headImg = data.data.userMedalDTO.smallImg;
            self.headName = data.data.userMedalDTO.userName;
            self.headNum = data.data.userMedalDTO.obtainedNum;
            self.headMaxNum = data.data.userMedalDTO.medalTotal;
            self.lists = data.data.medalDTOList;
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
    ...mapActions(["getapiuserMedalgetUserMedal"])
  }
};
</script>
<style scoped>
.footer-code-top > div::after {
  position: absolute;
  left: -3.955rem;
  width: 3.755rem;
  height: 1px;
  top: 0.64rem;
  background: rgba(96, 93, 92, 1);
  content: "";
}
.footer-code-top > div::before {
  position: absolute;
  right: -3.955rem;
  width: 3.755rem;
  height: 1px;
  top: 0.64rem;
  background: rgba(96, 93, 92, 1);
  content: "";
}
.footer-code-top > div {
  color: rgba(0, 0, 0, 1);
  text-align: center;
  font-size: 1.108rem;
  height: 1.28rem;
  line-height: 1.28rem;
  position: relative;
  min-width: 8.533rem;
}
.footer-code-top {
  width: 100%;
  margin-top: 0.5rem;
  height: 1.28rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer-code-bottom {
  width: 100%;
  height: 6.4rem;
  margin-top: 1.224rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.footer-code-bottom ::after {
  position: absolute;
  right: calc(50% - 1px);
  width: 1px;
  height: 100%;
  top: 0;
  background: rgba(194, 193, 193, 1);
  content: "";
}
.footer-code-bottom > div:nth-child(1) {
  margin-right: 2.048rem;
}
.footer-code-bottom > div:nth-child(2) {
  margin-left: 2.048rem;
}
.footer-code-bottom > div {
  width: 5.632rem;
  height: 5.632rem;
}
.footer-code-bottom > div img {
  width: 100%;
  height: 100%;
}
.footer-code {
  height: 11.093355rem;
  width: 100%;
  background-color: #fff;
  overflow: hidden;
}

.nav-rightNum > div {
  width: 100%;
}
.nav-rightNum {
  position: absolute;
  min-width: 4.69rem;
  height: 4.073rem;
  bottom: 1.024rem;
  right: 1.707rem;
  z-index: 10000000000000;
}
.nav-rightNum-top {
  color: rgba(255, 255, 255, 1);
  font-size: 1.536rem;
  text-align: right;
  height: 1.536em;
  line-height: 1.536rem;
}

.nav-rightNum-bottom {
  color: rgba(255, 255, 255, 1);
  font-size: 1.536rem;
  text-align: right;
  margin-top: 0.112rem;
  height: 1.536em;
  line-height: 1.536rem;
}
.nav-left-img {
  width: 5.913rem;
  height: 5.913rem;
  border-radius: 50%;
  overflow: hidden;
  /* border: 2px solid #fff; */
}
.nav-left-img img {
  width: 100%;
  height: 100%;
}
.nav-left-name {
  color: rgba(255, 255, 255, 1);
  font-size: 1.024rem;
  height: 3.9866667rem;
  line-height: 3.9866667rem;
  margin-left: 1.28rem;
}
.nav-left {
  min-width: 8.5333rem;
  height: 5.973rem;
  position: absolute;
  bottom: -2.0866667rem;
  left: 1.707rem;
  z-index: 100000;
  display: flex;
}
.content-fister {
  height: 2.248rem;
  width: 100%;
  background-color: #fff;
}
.content-li > div:nth-child(1) {
  width: 100%;
  height: 4.693rem;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content-li > div:nth-child(1) img {
  width: 4.693rem;
  height: 4.693rem;
}
.content-li > div:nth-child(2) {
  width: 100%;
  color: rgba(85, 85, 85, 1);
  font-size: 0.97rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.content-li {
  background-color: #fff;
  width: 33%;

  height: calc((100vh - 11.093355rem - 1.707667rem - 2.248rem - 12.8rem) / 3);
  display: flex;
  flex-wrap: wrap;
}
.content ul {
  background-color: #fff;
  margin-top: 1.707667rem;
  display: flex;
  flex-wrap: wrap;
  /* border: 1px solid red; */
  width: 100%;
}
.content {
  background-color: #fff;
  overflow: hidden;
  min-height: calc(100vh - 11.093355rem - 1.707667rem - 2.248rem - 12.8rem);
}

.nav {
  height: 12.8rem;
  /* background-color: chocolate; */
  position: relative;
  width: 100%;
  background: url("/static/img/背景@2x.png") no-repeat;
  background-size: 100% 100%;
}
.main {
  overflow: hidden;
  background-color: #f7f7f7 !important;
  width: 100%;
}

.nullShow {
  height: 10rem;
  color: #e6e6e6;
  font-size: 3rem;
  text-align: center;
  line-height: 10rem;
}

.integral {
  background-color: #f7f7f7 !important;
  overflow-x: hidden;
  min-height: 100vh;
  /* padding: 1.07rem; */
}
</style>