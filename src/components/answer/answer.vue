<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="news">
    <div class="main" v-show="!pathShow">
      <div class="main-title">
        <div>
          {{answerObj.title}}
        </div>
      </div>
      <div class="main-main">
        <div>
          <div class="main-user">
            <div>
              <div>
                <img :src="answerObj.smallImg" alt="">
              </div>
              <div>
                {{answerObj.nickName}}
              </div>
            </div>
            <div>
              {{answerObj.createDate | timeFun}}
            </div>
          </div>
          <div class="main-content" v-html="answerObj.content">

          </div>
        </div>
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
      pathShow: false,
      answerObj: {
        title: "", //问题标题
        content: "",
        updateDate: "", //最后修改时间，eg：计算xx小时前使用
        type: "", //内容类型（0：文字,1：图文 ,2：视频,3：语音）
        picture: "", //地址集合，以逗号隔开
        cover: "", //封面
        longTime: "", //视频时长：回答内容中有视频时
        size: 0, //视频大小：回答内容中有视频时，int
        praiseCount: 0, //点赞数量
        praise: false, //是否点赞
        collect: false, //是否关注
        collectCount: 0, //关注数量
        userId: "", //用户id
        smallImg: "", //用户头像
        nickName: "", //用户昵称
        shareAddress: "" //分享地址
      }
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
    document.title = "回答详情";
    // answerId=32eb2e5480484723a0b19a52dcff1945
    var idStr = self.$route.query.id;
    if (self.$route.query.id) {
      self
        .getapiquestionAnsweranswerDetail({
          answerId: self.$route.query.id
        })
        .then(data => {
          if (data.code == 200) {
            self.answerObj = data.data;
            self.pathShow = false;
            document.title = self.answerObj.title;
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
    ...mapActions(["getapiquestionAnsweranswerDetail"])
  }
};
</script>
<style scoped>
.main-content {
  margin-top: 0.8rem;
}

.main-user {
  display: flex;
  height: 3rem;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.main-user > div:nth-child(1) {
  display: flex;
  align-items: center;
}

.main-user > div:nth-child(1) > div:nth-child(1) {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
}

.main-user > div:nth-child(1) > div:nth-child(2) {
  color: #303030;
  font-size: 1.33rem;
  margin-left: 0.8rem;
}

.main-user > div:nth-child(1) > div:nth-child(1) img {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}

.main-user > div:nth-child(2) {
  color: #999;
  font-size: 1rem;
}

.main-main {
  background-color: #fff;
  overflow: hidden;
  margin-top: 0.8rem;
}

.main-main > div:nth-child(1) {
  width: 92%;
  margin: 0 auto;
}

.main-title {
  min-height: 4rem;
  width: 100%;
  color: #303030;
  font-size: 1.33rem;
  overflow: hidden;
  background-color: #fff;
}

.main-title > div {
  margin: 0 auto;
  margin-top: 1.33rem;
  margin-bottom: 1.33rem;
  width: 92%;
  color: #303030;
  font-size: 1.33rem;
  line-height: 1.67rem;
}

.nullLi {
  height: 8rem;
  width: 100%;
  text-align: center;
  line-height: 8rem;
  font-size: 1.3rem;
  color: #ccc;
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

.news {
  background-color: #f7f7f7 !important;
  overflow-x: hidden;
  min-height: 100vh;
  /* padding: 1.07rem; */
}
</style>