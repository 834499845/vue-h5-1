// 意见列表
<template>
  <div class="customerServiceIssueOpinion">
    <ul>
      <li class="OpinionLi" v-show="lists.length > 0" v-for="(item,index) in lists" :key="index" @click="listClick(index)">
        <div class="OpinionLiTop">
          <div class="OpinionLiTopLeft">
            {{item.desc}}
          </div>
          <div class="OpinionLiTopRight">
            <img src="static/img/Combined Shape Copy@3x.png" alt="">
          </div>
        </div>
        <div class="OpinionLiBot">
          <div class="OpinionLiBotLeft">
            类型：{{item.advise | adviseFun}}
          </div>
          <div class="OpinionLiBotCenter">
            状态：
            <small :class="{'statusOne':item.status == 1,'statusTwo':item.status == 2,'statusThr':item.status == 4,'statusFour':item.status == 8}">{{item.status | statusFun}}</small>
          </div>
          <div class="OpinionLiBotRight">
            {{item.time | timeFun}}
          </div>
        </div>
      </li>
      <div class="nullLI" v-show="lists.length == 0">
        <div class="nullContent"></div>
        <img class="nullImg" src="/static/img/iconfont_default_list@3x.png" alt="">
        <div class="nullText">暂无反馈</div>
      </div>
    </ul>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapActions } from "vuex";
export default {
  props: ["createdShow"],
  components: {},
  data() {
    return {
      lists: []
    };
  },
  created: function() {
    var self = this;
    self.$store.commit("setMutVuexisLoading", true);
    self
      .getfeedBackList({
        userId: sessionStorage.getItem("customerServiceUserId")
      })
      .then(data => {
        self.$store.commit("setMutVuexisLoading", false);
        if (data.statusCode == 200) {
          if (data.data) {
            self.lists = data.data;
          }
        } else {
          Toast({
            message: data.statusMessage,
            position: "bottom"
          });
        }
      })
      .catch(msg => {
        self.$store.commit("setMutVuexisLoading", false);
        Toast({
          message: "服务器异常",
          position: "bottom"
        });
      });
  },
  mounted() {
    var self = this;
    document.title = "反馈记录";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setTitle("反馈记录");
        window.BenchJSInterface.setTopBarColor(1);
      }
    } else {
      var setNav = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          titles: [{ name: "", code: "" }]
        }
      };
      if (window.webkit) {
        window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
          setNav
        );
      }
    }
  },
  watch: {},
  methods: {
    listClick(index) {
      var self = this;
      if (self.lists[index].advise == 1) {
        this.$router.push({
          path: "/customerServiceIssueOpinionLook"
        });
      } else {
        this.$router.push({
          path: "/customerServiceIssueLook"
        });
      }
      sessionStorage.setItem(
        "customerServiceId",
        JSON.stringify(self.lists[index].id)
      );
    },
    ...mapActions(["getfeedBackList"])
  },
  filters: {
    adviseFun(val) {
      if (val == 1) {
        return "意见建议";
      } else {
        return "问题反馈";
      }
    },
    // 状态
    statusFun(val) {
      if (val) {
        if (val == 1) {
          return "待处理";
        } else if (val == 2) {
          return "已处理";
        } else if (val == 4) {
          return "已解决";
        } else if (val == 8) {
          return "未解决";
        }
      } else {
        return "暂无";
      }
    },
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
        return y + "." + m + "." + d + " " + h + ":" + f;
      } else {
        return "暂无";
      }
    }
  }
};
</script>
<style scoped>
.nullContent {
  height: 2.6133rem;
}

.nullImg {
  width: 2.24rem;
  height: 2.6133rem;
}

.nullText {
  height: 0.6667rem;
  width: 100%;
  height: 0.3733rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.3733rem;
  text-align: center;
  margin-top: 0.6133rem;
}

.nullLI {
  width: 2.52rem;
  text-align: center;
  height: 0.3733rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.3733rem;
  margin: 0 auto;
}

.OpinionLiBotLeft {
  margin-left: 0.4267rem;
  min-width: 2.2933rem;
  font-size: 0.32rem;
  color: rgba(192, 192, 192, 1);
}

.OpinionLiBotCenter .statusOne {
  color: #4390e1;
}

.OpinionLiBotCenter .statusTwo {
  color: #24b9c7;
}

.OpinionLiBotCenter .statusFour {
  color: #ea6262;
}

.OpinionLiBotCenter .statusThr {
  color: #24b9c7;
}

.OpinionLiBotCenter {
  font-size: 0.32rem;
}

.OpinionLiBotRight {
  margin-right: 0.4267rem;
  font-size: 0.32rem;
  color: rgba(192, 192, 192, 1);
}

.OpinionLiBot {
  display: flex;
  height: 0.3467rem;
  width: 100%;
  margin-top: 0.2933rem;
  justify-content: space-between;
  align-items: center;
}

.OpinionLiTopLeft {
  width: calc(100vw - 0.8533rem - 1.8667rem);
  height: 0.48rem;
  margin-left: 0.4267rem;
  font-size: 0.3733rem;
  color: rgba(44, 44, 44, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.OpinionLiTopRight {
  width: 0.1867rem;
  height: 0.4rem;
  margin-right: 0.4267rem;
}

.OpinionLiTopRight img {
  width: 0.1867rem;
}

.OpinionLiTop {
  display: flex;
  justify-content: space-between;
  height: 0.48rem;
  align-items: center;
  margin-top: 0.3733rem;
}

.OpinionLi {
  overflow: hidden;
  width: 100%;
  height: 1.92rem;
  background-color: #fff;
  margin-top: 0.32rem;
}

.customerServiceIssueOpinion {
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: rgba(241, 241, 241, 1);
  padding-bottom: 0.4267rem;
}
</style>