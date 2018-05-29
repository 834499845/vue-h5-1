<template>
  <div>
    <div class="managementList-bot">
      <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">
        <ul v-show="logLists.length > 0">
          <li class="managementListLi" :key="index" v-for="(item,index) in logLists">
            <div class="managementListLi-left">
              <img v-if="item.profile" :src="item.profile" alt="">
              <div v-if="!item.profile">{{item.memberName | userNickFun}}</div>
            </div>
            <div class="managementListLi-right">
              <div class="managementListLi-r-top">
                {{item.memberName}}
              </div>
              <div class="managementListLi-r-bot">
                {{item.mobile}}
              </div>
            </div>
          </li>
        </ul>
        <div class="nullLI" v-show="logLists.length == 0">
          <div class="nullContent"></div>
          <img class="nullImg" src="/static/img/iconfont_default_list@3x.png" alt="">
          <div class="nullText">暂无联系人</div>
        </div>
      </v-scroll>
    </div>
  </div>
</template>
<script>
import scroll from "./AllLogScroll";
import { mapActions } from "vuex";
import { Toast } from "mint-ui";
export default {
  props: ["lists"],
  components: { "v-scroll": scroll },
  data() {
    return {
      onInfiniteTrue: false, // 上拉加载防重复
      onRefreshTrue: false, // 下拉加载防重复
      pageNoVal: 1,
      pageSizeVal: 30,
      dataList: [], //上拉更多的数据存放数组
      loadingText: "", //往插件传递的提示文字
      page: 1, //当前页码
      logLists: [] // 列表
    };
  },
  updated: function() {},
  created: function() {},
  mounted: function() {
    var self = this;
    self.logLists = self.lists;
  },
  watch: {
    lists: {
      handler(val) {
        var self = this;
        self.logLists = val;
      },
      deep: true
    }
  },
  methods: {
    // 下拉刷新
    onRefresh(done) {
      let self = this;
      sessionStorage.removeItem("messageTimeValTime");
      sessionStorage.removeItem("messageWayValMessage");
      if (self.onRefreshTrue == false) {
        self.onRefreshTrue = true;
        self.pageNoVal = 1;
        done(1);
        var standardTime = new Date();
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
        var NewDate = y + "-" + m + "-" + d;
        var listObj = {
          memberId: sessionStorage.getItem("logMemberId"),
          orgId: sessionStorage.getItem("logOrgId"),
          submitType: 0,
          date: NewDate,
          pageNo: self.pageNoVal,
          pageSize: self.pageSizeVal
        };
        self
          .getlogreportmanagersubmitlist(JSON.stringify(listObj))
          .then(data => {
            done(2);
            self.onRefreshTrue = false;
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  self.logLists = [];
                  self.pageNoVal++;
                  self.logLists = data.data.records;
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
        var standardTime = new Date();
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

        var listObj = {};
        if (sessionStorage.getItem("messageTimeValTime")) {
          listObj = {
            memberId: sessionStorage.getItem("logMemberId"),
            orgId: sessionStorage.getItem("logOrgId"),
            submitType: sessionStorage.getItem("messageWayValMessage"),
            date: sessionStorage.getItem("messageTimeValTime"),
            pageNo: self.pageNoVal,
            pageSize: self.pageSizeVal
          };
        } else {
          var NewDate = y + "-" + m + "-" + d;
          listObj = {
            memberId: sessionStorage.getItem("logMemberId"),
            orgId: sessionStorage.getItem("logOrgId"),
            submitType: 0,
            date: NewDate,
            pageNo: self.pageNoVal,
            pageSize: self.pageSizeVal
          };
        }
        self.loadingText = "加载中···";
        self
          .getlogreportmanagersubmitlist(JSON.stringify(listObj))
          .then(data => {
            self.onInfiniteTrue = false;
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  done(1);
                  self.pageNoVal++;
                  self.logLists = self.logLists.concat(data.data.records);
                } else {
                  done(2);
                  self.loadingText = "暂无更多数据";
                }
              } else {
                done(2);
                self.loadingText = "暂无更多数据";
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
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    ...mapActions(["getlogreportmanagersubmitlist"])
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
    }
  }
};
</script>
<style scoped>
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
#listUl {
  height: 100%;
}

.managementListLi-left div {
  position: absolute;
  top: 0;
  left: 0;
  width: 1.1733rem;
  height: 1.1733rem;
  overflow: hidden;
  border-radius: 50%;
  background-color: #4592e2;
  text-align: center;
  line-height: 1.1733rem;
  color: #fff;
  font-size: 0.3733rem;
}

.managementListLi-left img {
  overflow: hidden;
  width: 1.1733rem;
  border-radius: 50%;
  height: 1.1733rem;
}

.managementListLi-left {
  margin-left: 0.4267rem;
  width: 1.1733rem;
  position: relative;
  height: 1.1733rem;
  overflow: hidden;
  border-radius: 50%;
  margin-top: 0.2667rem;
}

/* .managementListLi:nth-child(1) .managementListLi-right {
  border: 0;
} */

.managementListLi-right {
  margin-left: 0.32rem;
  width: calc(100% - 0.32rem - 1.1733rem - 0.4267rem);
  border-bottom: 1px solid #e3e3e3;
}

.managementListLi-r-top {
  min-width: 1.3333rem;
  height: 0.4967rem;
  margin-top: 0.32rem;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.4967rem;
  max-width: 4.2667rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.managementListLi-r-bot {
  min-width: 2.64rem;
  height: 0.3733rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.3733rem;
  margin-top: 0.2667rem;
}

.managementListLi {
  width: 100%;
  height: 1.7067rem;
  display: flex;
  overflow: hidden;
}

.managementList-bot {
  position: relative;
  background-color: #fff;
  width: 100%;
  height: calc(100vh - 1.0133rem - 1.2rem);
  overflow: hidden;
}
</style>