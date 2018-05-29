// 企业文化
<template>
  <div class="enterpriseDetails">
    <div class="enterpriseDetailsTitle">
      {{lookObj.title}}
    </div>
    <div class="enterpriseDetailsTime">
      <div class="enterpriseDetailsTimel">
        {{lookObj.departmentName}}
      </div>
      <div class="enterpriseDetailsTimet">
        {{lookObj.createTime | timeFun}}
      </div>
    </div>
    <div v-show="stateShow" class="enterpriseDetailsMain" v-html="lookObj.content">
      
    </div>
    <div v-show="!stateShow" class="enterpriseDetailsMain">
        <pre>{{lookObj.content}}</pre>
    </div>
    <div class="enterPictureUrl" v-show="lookObj.pictureUrl">
      <img :src="lookObj.pictureUrl" alt="">
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      lookObj: {},
      stateShow: true
    };
  },
  components: {},
  methods: {
    // 获取初始数据
    listFun() {
      var self = this;
      var listObj = {
        id: self.$route.query.id,
        userId: self.$route.query.userId
      };
      self
        .getapiinfoappselectdetail(listObj)
        .then(data => {
          if (data.statusCode == 200) {
            if (data.data) {
              self.lookObj = data.data;
              var reg = /<[^>]+>/g;
              if (reg.test(self.lookObj.content)) {
                self.stateShow = true;
              } else {
                self.stateShow = false;
              }
            }
          } else {
            Toast({
              message: data.statusMessage,
              position: "bottom"
            });
          }
        })
        .catch(msg => {
          Toast({
            message: "服务器异常",
            position: "bottom"
          });
        });
    },
    ...mapActions(["getapiinfoappselectdetail"])
  },
  mounted() {},
  created: function() {
    var self = this;
    self.listFun();
  },
  watch: {},
  filters: {
    // 过滤时间
    timeFun: function(val) {
      if (val) {
        var standardTime = new Date(val * 1);
        var y, m, d, h, f;
        y = standardTime.getFullYear();
        m = standardTime.getMonth() + 1;
        m = m > 9 ? m : "0" + m;
        d = standardTime.getDate();
        d = d > 9 ? d : "0" + d;
        h = standardTime.getHours();
        h = h > 9 ? h : "0" + h;
        f = standardTime.getMinutes();
        f = f > 9 ? f : "0" + f;
        return y + "." + m + "." + d;
      } else {
        return "暂无";
      }
    }
  }
};
</script>
<style scoped>
.enterPictureUrl {
  width: 100%;
  /* height: 4rem; */
  margin-top: 0.32rem;
  padding-left: 0.4rem;
  padding-right: 0.4rem;
}
.enterPictureUrl img {
  width: 100%;
  height: 100%;
}

.enterpriseDetailsMain {
  width: calc(100% - 0.8533rem);
  margin: 0 auto;
  min-width: 1.3333rem;
  margin-top: 0.32rem;
  font-size: 0.4267rem;
}
.enterpriseDetailsMain pre {
  width: 100%;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.5757rem;
  white-space: pre-wrap; /*css-3*/
  white-space: -moz-pre-wrap; /*Mozilla,since1999*/
  white-space: -pre-wrap; /*Opera4-6*/
  white-space: -o-pre-wrap; /*Opera7*/
  word-wrap: break-word; /*InternetExplorer5.5+*/
}
.enterpriseDetailsMain > p {
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
}
.enterpriseDetailsTimet {
  margin-left: 0.2133rem;
}
.enterpriseDetailsTimel {
  margin-left: 0.4267rem;
}
.enterpriseDetailsTime {
  margin-top: 0.2667rem;
  height: 0.32rem;
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.32rem;
  display: flex;
}
.enterpriseDetailsTitle {
  margin: 0 auto;
  width: calc(100% - 0.8533rem);
  min-height: 0.6933rem;
  font-size: 0.5333rem;
  font-family: PingFangSC-Medium;
  color: rgba(44, 44, 44, 1);
  line-height: 0.6933rem;
  margin-top: 0.4267rem;
}
.enterpriseDetails {
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
}
</style>