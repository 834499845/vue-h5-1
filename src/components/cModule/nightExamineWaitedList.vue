<template>
  <div>
    <div class="allLog-main" v-show="nightlist.length > 0">
      <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">
        <ul class="nightExamineUl">
          <li v-for="(item,index) in nightlist" :key="index" class="nightExamineLi" @click="nightExamineClick(index)">
            <div class="nightExamineImg" v-if="item.userAvatar">
              <img :src="item.userAvatar" alt="">
            </div>
            <div class="nightExamineImgFont" v-if="!item.userAvatar">
              {{item.userNick | nameFun}}
            </div>
            <div class="nightExamineFont">
              <p class="nightExamineFontTop">
                {{item.userNick}}的{{item.modelName}}
              </p>
              <p class="nightExamineFontFoot fontGray">
                {{item.message}}
              </p>
            </div>
            <div class="nightExamineTime">
              {{item.createTime | timeFun}}
            </div>
          </li>
        </ul>
      </v-scroll>
    </div>
    <div class="nullLI" v-show="nightlist.length == 0">
      <div class="nullContent"></div>
      <img class="nullImg" src="/static/img/iconfont_default_list@3x.png" alt="">
      <div class="nullText">暂无审批</div>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapActions, mapState } from "vuex";
import scroll from "./startedScroll";
export default {
  props: ["lists", "listIndex", "sleectIndex", "searchObj"],
  components: { "v-scroll": scroll },
  data() {
    return {
      onRefreshTrue: false,
      onInfiniteTrue: false,
      itemStateShow: true,
      searchObjVal: {},
      state: "", //审批状态 0:审批中 1:审批完成 2:已撤回
      deptId: "", //部门id
      searchVal: "", //搜索关键字
      loadingText: "", //往插件传递的提示文字
      pageNoVal: 2,
      pageSizeVal: 20,
      nightlist: [] // 列表
    };
  },
  updated: function() {
    this.$nextTick(function() {
      let position = this.$store.state.VuexWaitedApprovalTop || 0; //返回页面取出来
      this.$el.querySelector(".yo-scroll").scrollTop = position * 1;
    });
  },
  created: function() {},
  mounted: function() {
    var self = this;
  },
  methods: {
    //我审批的详情
    nightExamineClick(index) {
      var self = this;
      this.$emit("logListsIndex", this.nightlist[index].approvalId);
      self.$store.commit("setMutVuexWaitedApprovalClickIndex", index);
    },
    // 下拉刷新
    onRefresh(done) {
      let self = this;
      if (self.onRefreshTrue == false) {
        self.onRefreshTrue = true;
        done(1);
        self.$store.commit("setMutVuexWaitedApprovalTop", 0);
        self.state = "";
        self.deptId = "";
        self.searchVal = "";
        sessionStorage.removeItem("waitedSaerch");
        sessionStorage.removeItem("await");
        sessionStorage.removeItem("nightExamineSaechIndex");
        self.pageNoVal = 1;
        self.$store.commit("setMuVuexWaitedApprovalLists", []);
        self.$store.commit("setMutVuexWaitedApprovalIndex", 9999);
        self
          .getapprovalWaitedApproval({
            companyId: sessionStorage.getItem("companyId"),
            memberId: sessionStorage.getItem("memberId"),
            currentPage: self.pageNoVal,
            pageSize: self.pageSizeVal
          })
          .then(data => {
            self.onRefreshTrue = false;
            done(2);
            if (data.statusCode == "200") {
              self.$store.commit(
                "setMutVuexawaitNumberIndex",
                data.data.totalCount
              );
              self.$emit("onRefreshWaitedFun", "111");
              if (data.data.rows) {
                if (data.data.rows.length > 0) {
                  self.nightlist = data.data.rows;
                  self.pageNoVal++;
                  self.$store.commit(
                    "setMuVuexWaitedApprovalLists",
                    self.nightlist
                  );
                  self.$store.commit(
                    "setMutVuexWaitedApprovalIndex",
                    self.pageNoVal
                  );
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
            self.onRefreshTrue = false;
            done(2);
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
        if (sessionStorage.getItem("await")) {
          var awaitObj = JSON.parse(sessionStorage.getItem("await")); //筛选的条件
          this.state = awaitObj.genderVal;
          this.deptId = awaitObj.departmentVal;
        }
        if (sessionStorage.getItem("waitedSaerch")) {
          var waitedSaerchStr = JSON.parse(
            sessionStorage.getItem("waitedSaerch")
          ); //筛选的条件
          this.searchVal = waitedSaerchStr;
        }
        self.loadingText = "加载中···";
        self
          .getapprovalWaitedApproval({
            companyId: sessionStorage.getItem("companyId"),
            memberId: sessionStorage.getItem("memberId"),
            state: self.state,
            deptId: self.deptId,
            searchKey: self.searchVal,
            currentPage: self.pageNoVal,
            pageSize: self.pageSizeVal
          })
          .then(data => {
            self.onInfiniteTrue = false;
            if (data.statusCode == "200") {
              if (data.data) {
                if (data.data.rows) {
                  if (data.data.rows.length > 0) {
                    var VuexStartedListsTopNum =
                      this.$store.state.VuexWaitedApprovalTop + 56;
                    this.$store.commit(
                      "setMutVuexWaitedApprovalTop",
                      VuexStartedListsTopNum
                    );
                    done(1);
                    var arr = data.data.rows;
                    self.nightlist = self.nightlist.concat(arr);
                    self.pageNoVal++;
                    self.$store.commit(
                      "setMuVuexWaitedApprovalLists",
                      self.nightlist
                    );
                    self.$store.commit(
                      "setMutVuexWaitedApprovalIndex",
                      self.pageNoVal
                    );
                  } else {
                    done(2);
                    self.loadingText = "已加载全部数据";
                    var VuexStartedListsTopNum =
                      this.$store.state.VuexWaitedApprovalTop + 56;
                    this.$store.commit(
                      "setMutVuexWaitedApprovalTop",
                      VuexStartedListsTopNum
                    );
                  }
                } else {
                  done(2);
                  self.loadingText = "已加载全部数据";
                  var VuexStartedListsTopNum =
                    this.$store.state.VuexWaitedApprovalTop + 56;
                  this.$store.commit(
                    "setMutVuexWaitedApprovalTop",
                    VuexStartedListsTopNum
                  );
                }
              } else {
                done(2);
                self.loadingText = "已加载全部数据";
                var VuexStartedListsTopNum =
                  this.$store.state.VuexWaitedApprovalTop + 56;
                this.$store.commit(
                  "setMutVuexWaitedApprovalTop",
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
            self.onInfiniteTrue = false;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
            done();
          });
      }
    },
    ...mapActions(["getapprovalWaitedApproval"])
  },
  watch: {
    lists: {
      handler(val) {
        var self = this;
        self.nightlist = val;
        self.$store.commit("setMuVuexWaitedApprovalLists", self.nightlist);
        if (self.$store.state.VuexWaitedApprovalIndex != 9999) {
          self.pageNoVal = self.$store.state.VuexWaitedApprovalIndex;
        } else {
          self.pageNoVal = 2;
        }
      },
      deep: true
    },
    searchObj: {
      handler(val) {
        var self = this;
        this.searchObjVal = val;
      },
      deep: true
    },
    listIndex(val) {
      var self = this;
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
        var standardTime = new Date(Number(val));
        var y, m, d, h, f;
        y = standardTime.getFullYear();
        m = standardTime.getMonth() + 1;
        m = m > 9 ? m : "0" + m;
        d = standardTime.getDate();
        d = d > 9 ? d : "0" + d;
        return y + "-" + m + "-" + d;
      } else {
        return "暂无";
      }
    },
    nameFun: function(val) {
      if (val) {
        if (val.length > 2) {
          return val.slice(val.length - 2);
        } else {
          return val;
        }
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
          var str = val.slice(0, 100) + "....";
          return str;
        } else {
          return val;
        }
      } else {
        return "";
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
  height: calc(100vh - 1.1733rem - 1.1733rem);
  position: relative;
}

.nightExamineUl {
  margin-bottom: 0.2rem;
  background: rgba(255, 255, 255, 1);
}

.nightExamineLi {
  width: 100%;
  height: 1.7067rem;
  /* height: 5.7067rem; */
  display: flex;
  /* border-bottom: 1px solid #e3e3e3; */
  position: relative;
}

.nightExamineLi::after {
  position: absolute;
  bottom: 0;
  left: 0.3733rem;
  width: calc(100% - 0.3733rem);
  height: 1px;
  background-color: #e3e3e3;
  content: "";
}
.nightExamineImg {
  width: 1.1733rem;
  height: 1.1733rem;
  border-radius: 50%;
  margin: 0.2667rem 0.32rem 0.2667rem 0.4267rem;
}

.nightExamineImg img {
  width: 1.1733rem;
  height: 1.1733rem;
  border-radius: 50%;
}

.nightExamineImgFont {
  width: 1.1733rem;
  height: 1.1733rem;
  border-radius: 100%;
  margin: 0.2667rem 0.32rem 0.2667rem 0.4267rem;
  background: #1e90ff;
  border-radius: 100%;
  text-align: center;
  line-height: 1.1733rem;
  color: white;
}

.nightExamineFont {
  width: calc(100vw - 1.1733rem - 1.667rem - 1.8rem);
  height: 1.1733rem;
  margin: 0.2667rem 0 0.2667rem 0;
}

.nightExamineFontTop,
.nightExamineFontFoot {
  width: calc(100vw - 1.1733rem - 1.667rem - 2.8rem);
  height: 0.5867rem;
  line-height: 0.5867rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.nightExamineFontTop {
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
}

.nightExamineFontFoot {
  font-size: 0.3733rem;
}

.fontGray {
  color: rgba(132, 132, 132, 1);
}

.fontRed {
  color: rgba(234, 98, 98, 1);
}

.nightExamineTime {
  min-width: 2rem;
  height: 0.32rem;
  font-size: 0.32rem;
  color: rgba(192, 192, 192, 1);
  line-height: 0.32rem;
  margin: 0.4267rem 0.4267rem 0.96rem 0;
}
</style>