<template>
  <div>
    <div class="allLog-main">
      <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">
        <ul class="allLogMain-UL" id="listUl" v-show="logLists.length > 0">
          <li class="allLoglogLi" :key="index" v-for="(item,index) in logLists">
            <div class="logLi-top" @click="logListsClick(index)">
              <div class="logLi-top-left">
                <div class="ll-t-lf-img">
                  <img v-show="item.user.profile" :src="item.user.profile" alt="">
                  <div v-show="!item.user.profile">{{item.user.realName | userNickFun}}</div>
                </div>
                <div class="ll-t-lf-right">
                  <div class="ll-t-lf-right-name">
                    {{item.user.realName}}
                  </div>
                  <div class="ll-t-lf-right-time">
                    {{item.submitTime | timeFun}}
                  </div>
                </div>
              </div>
              <div class="logLi-top-right">
                <div class="ll-t-r-type">
                  {{item.templateName}}
                </div>
                <div v-show="itemStateShow" :class="{'ll-t-r-state':true,'ll-t-r-stateRed':islltrState = item.state == 1 ? true : false}">
                  <!-- {{item.state | stateFun}} -->
                </div>
              </div>
            </div>
            <div class="allLog-text">
              <div class="allLText-list" v-for="(modelVal,modelIndex) in item.contents" :key="modelIndex" @click="logListsClick(index)">
                <div class="aLT-list-left">
                  {{modelVal.name}}:
                </div>
                <div class="aLT-list-right">
                  <pre>{{modelVal.value | valueFun}}</pre>
                </div>
              </div>
              <div class="allLText-list" v-show="item.remark">
                <div class="aLT-list-left">
                  备注:
                </div>
                <div class="aLT-list-right">
                  <pre>{{item.remark | valueFun}}</pre>
                </div>
              </div>
              <div class="allLText-list" v-show="item.logImages">
                <div class="aLT-list-left">
                  图片:
                </div>
                <div class="aLT-list-img">
                  <ul>
                    <li @click="showImgListsClick(index)" class="aLT-list-imgLi" v-for="(imgItem,imgIndex) in item.logImages" :key="imgIndex">
                      <img :src="imgItem" alt="图片">
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="nullLI" v-show="logLists.length == 0">
          <div class="nullContent"></div>
          <img class="nullImg" src="/static/img/iconfont_default_list@3x.png" alt="">
          <div class="nullText">暂无日志</div>
        </div>
      </v-scroll>

    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapActions, mapState } from "vuex";
import scroll from "./AllLogScroll";
export default {
  props: ["lists", "listIndex", "sleectIndex", "searchObj"],
  components: { "v-scroll": scroll },
  data() {
    return {
      onRefreshTrue: false,
      onInfiniteTrue: false,
      itemStateShow: true,
      searchObjVal: {},
      dataList: [], //上拉更多的数据存放数组
      loadingText: "", //往插件传递的提示文字
      pageNoVal: 2,
      pageSizeVal: 20,
      logLists: [] // 日志列表
    };
  },
  computed: {
    ...mapState(["VuexMyLogListsIndex", "VuexMylogScrollTop"])
  },
  updated: function() {
    this.$nextTick(function() {
      let position = this.VuexMylogScrollTop || 0; //返回页面取出来
      this.$el.querySelector(".yo-scroll").scrollTop = position * 1;
    });
  },
  created: function() {},
  mounted: function() {
    var self = this;
    // self.logLists = self.lists;
  },
  methods: {
    // 图片预览
    showImgListsClick(index) {
      var self = this;
      var arr = [];
      this.logLists[index].logImages.forEach(function(ele, ind) {
        arr.push({ img: ele });
      });
      this.WatchBigPicture(arr, index);
    },
    // 选中点击跳转
    logListsClick(index) {
      var self = this;
      this.$emit("logListsIndex", index);
      sessionStorage.setItem(
        "logListsIndexObj",
        JSON.stringify(self.logLists[index])
      );
    },
    // 下拉刷新
    onRefresh(done) {
      let self = this;
      if (self.onRefreshTrue == false) {
        self.pageNoVal = 1;
        done(1);
        self.$store.commit("MutVuexMylogScrollTop", 0);
        self.onRefreshTrue = true;
        var listObj = {
          orgId: sessionStorage.getItem("logOrgId"),
          userId: sessionStorage.getItem("logMemberId"),
          pageNo: self.pageNoVal,
          pageSize: self.pageSizeVal
        };
        self
          .getlogsearchsendpage(JSON.stringify(listObj))
          .then(data => {
            done(2);
            self.onRefreshTrue = false;
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  self.pageNoVal++;
                  self.logLists = data.data.records;
                  self.$store.commit("MutVuexMyLogListsIndex", self.pageNoVal);
                  self.$store.commit("MutVuexMyLogLists", self.logLists);
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
            done(2);
            self.onRefreshTrue = false;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    // 上拉加载
    onInfinite(done) {
      var self = this;
      done(3);
      if (self.onInfiniteTrue == false) {
        self.onInfiniteTrue = true;
        var listObj = {
          orgId: sessionStorage.getItem("logOrgId"),
          userId: sessionStorage.getItem("logMemberId"),
          pageNo: self.pageNoVal,
          pageSize: self.pageSizeVal
        };
        self.loadingText = "加载中....";
        self
          .getlogsearchsendpage(JSON.stringify(listObj))
          .then(data => {
            self.onInfiniteTrue = false;
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  var VuexStartedListsTopNum =
                    this.$store.state.VuexMylogScrollTop + 56;
                  this.$store.commit(
                    "MutVuexMylogScrollTop",
                    VuexStartedListsTopNum
                  );
                  self.pageNoVal++;
                  done(1);
                  self.logLists = self.logLists.concat(data.data.records);
                  self.$store.commit("MutVuexMyLogListsIndex", self.pageNoVal);
                  self.$store.commit("MutVuexMyLogLists", self.logLists);
                } else {
                  done(2);
                  self.loadingText = "暂无更多数据";
                  var VuexStartedListsTopNum =
                    this.$store.state.VuexMylogScrollTop + 56;
                  this.$store.commit(
                    "MutVuexMylogScrollTop",
                    VuexStartedListsTopNum
                  );
                }
              } else {
                done(2);
                self.loadingText = "暂无更多数据";
                var VuexStartedListsTopNum =
                  this.$store.state.VuexMylogScrollTop + 56;
                this.$store.commit(
                  "MutVuexMylogScrollTop",
                  VuexStartedListsTopNum
                );
              }
            } else {
              done(2);
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            done(2);
            self.onInfiniteTrue = false;
            self.loadingText = "暂无更多数据";
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }

      done();
    },
    ...mapActions([
      "getlogsearchsendpage",
      "getlogsearchreceivepage",
      "getlogsearchchangestatus"
    ])
  },
  watch: {
    lists: {
      handler(val) {
        var self = this;
        self.logLists = val;
        self.$store.commit("MutVuexMyLogLists", self.logLists);
        if (self.VuexMyLogListsIndex != 9999) {
          self.pageNoVal = self.VuexMyLogListsIndex;
        } else {
          self.pageNoVal = 2;
        }
      },
      deep: true
    },
    searchObj: {
      handler(val) {
        var self = this;
        self.loadingText = "";
        this.searchObjVal = val;
      },
      deep: true
    },
    listIndex(val) {
      var self = this;
      self.pageNoVal = 2;
      self.loadingText = "";
      if (val == 1) {
        self.itemStateShow = true;
      } else {
        self.itemStateShow = false;
      }
    }
  },
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
        return y + "-" + m + "-" + d + " " + h + ":" + f;
      } else {
        return "暂无";
      }
    },
    stateFun: function(val) {
      if (val == 1) {
        return "已读";
      } else {
        return "未读";
      }
    },
    userNickFun: function(val) {
      if (val) {
        if (val.length > 2) {
          return val.slice(val.length - 2, val.length);
        } else {
          return val;
        }
      } else {
        return "";
      }
    },
    valueFun(val) {
      if (val) {
        if (val.length > 100) {
          var str = val.slice(0, 100) + "...";
          return str;
        } else {
          return val;
        }
      } else {
        return "无";
      }
    }
  }
};
</script>
<style scoped>
#listUl {
  height: 100%;
}

.nullContent {
  height: 3.68rem;
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
  font-family: PingFangSC-Regular;
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
.allLog-main {
  overflow-x: hidden;
  overflow-y: scroll;
  height: calc(100vh - 1.3867rem);
  position: relative;
}

.aLT-l-f-r-top {
  min-width: 1.4933rem;
  height: 0.48rem;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.3733rem;
  margin-top: 0.1067rem;
  max-width: 4.2667rem;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.aLT-l-f-r-bot {
  min-width: 1.8133rem;
  margin-top: 0.16rem;
  height: 0.4267rem;
  font-size: 0.4267rem;
  color: rgba(192, 192, 192, 1);
  line-height: 0.4267rem;
  max-width: 4.2667rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.aLT-list-file-right {
  margin-left: 0.32rem;
}

.aLT-list-file-left {
  width: 1.28rem;
  height: 1.28rem;
  /* border: 1px dashed #ccc; */
}

.aLT-list-file-left img {
  width: 100%;
  height: 100%;
}

.aLT-list-file {
  margin-left: 0.1067rem;
  width: calc(100% - 2.8267rem);
  display: flex;
}

.aLT-list-imgLi {
  width: 1.6533rem;
  height: 1.6533rem;
  /* border: 1px dashed #ccc; */
  margin-right: 0.2133rem;
  margin-bottom: 0.2133rem;
}

.aLT-list-imgLi img {
  width: 100%;
  height: 100%;
}

.aLT-list-img ul {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.aLT-list-img {
  margin-left: 0.1067rem;
  width: calc(100% - 2.8267rem);
  overflow: hidden;
}
.allLoglogLi:nth-last-child(1) {
  margin-bottom: 0 !important;
}
.aLT-list-left {
  width: 2.8rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.56rem;
  margin-left: 0.4267rem;
}

.aLT-list-right {
  margin-left: 0.1067rem;
  width: calc(100% - 3.76rem);
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.56rem;
}
.aLT-list-right pre {
  width: 100%;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.56rem;
  white-space: pre-wrap; /*css-3*/
  white-space: -moz-pre-wrap; /*Mozilla,since1999*/
  white-space: -pre-wrap; /*Opera4-6*/
  white-space: -o-pre-wrap; /*Opera7*/
  word-wrap: break-word; /*InternetExplorer5.5+*/
}
.allLText-list:nth-child(1) {
  margin: 0;
}

.allLText-list {
  display: flex;
  margin-top: 0.4rem;
}

.allLog-text {
  min-height: 3rem;
  width: 100%;
  margin-bottom: 0.3733rem;
}

.ll-t-lf-right-time {
  height: 0.3733rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.3733rem;
  margin-top: 0.2133rem;
}

.ll-t-lf-right-name {
  margin-top: 0.08rem;
  height: 0.4767rem;
  font-size: 0.4067rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.4767rem;
  max-width: 4.2667rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ll-t-lf-right {
  margin-left: 0.32rem;
  overflow: hidden;
}

.ll-t-lf-img div {
  position: absolute;
  top: 0;
  left: 0;
  width: 1.1733rem;
  height: 1.1733rem;
  overflow: hidden;
  border-radius: 50%;
  background-color: #4592e2;
  text-align: center;
  line-height: 1.3533rem;
  color: #fff;
  font-size: 0.3733rem;
}
.ll-t-lf-img {
  position: relative;
  width: 1.1733rem;
  height: 1.1733rem;
  border-radius: 50%;
}

.ll-t-lf-img img {
  width: 1.1733rem;
  height: 1.1733rem;
  border-radius: 50%;
}

.logLi-top-left {
  display: flex;
  height: 1.1733rem;

  min-width: 1.1733rem;
  margin-left: 0.4267rem;
}

.ll-t-r-type {
  height: 0.4267rem;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.4267rem;
  margin-top: 0.08rem;
  text-align: right;
}
.ll-t-r-stateRed {
  color: rgba(132, 132, 132, 1) !important;
}
.ll-t-r-state {
  margin-top: 0.2133rem;
  height: 0.32rem;
  font-size: 0.32rem;
  text-align: right;
  color: rgba(234, 98, 98, 1);
  line-height: 0.32rem;
}

.logLi-top-right {
  min-width: 0.88rem;
  height: 1.1733rem;
  margin-right: 0.4267rem;
}

.logLi-top {
  height: 1.92rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.allLogMain-UL {
  width: 100%;
  height: 100%;
}

.allLoglogLi {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  min-height: 5rem;
  background-color: #fff;
  margin-bottom: 0.32rem;
  overflow: hidden;
}
</style>