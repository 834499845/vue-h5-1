<template>
  <div>
    <div class="managementList-allselect" v-show="logLists.length > 0">
      <div :class="{'managementListAllSe-left':true}" @click="allSelectClick">
            <img v-show="!isManagementListAllSeLeft" src="/static/img/未选中@3x.png" alt="">
            <img v-show="isManagementListAllSeLeft" src="/static/img/选中@3x.png" alt="">
      </div>
      <div class="managementListAllSe-right">
        全选
      </div>
    </div>
    <div class="managementList-bot">
      <v-scroll :on-infinite="onInfinite" :loading-text="loadingText">
        <ul v-show="logLists.length > 0">
          <li class="managementListLi" :key="index" v-for="(item,index) in logLists" @click="listsCLick(index)">
            <div :class="{'managementListLi-selelct':true}">
              <img v-show="item.show" src="/static/img/未选中@3x.png" alt="">
              <img v-show="!item.show" src="/static/img/选中@3x.png" alt="">
            </div>
            <div class="managementListLi-left">
              <img v-if="item.profile" :src="item.profile" alt="">
              <div v-if="!item.profile">{{item.name | userNickFun}}</div>
            </div>
            <div class="managementListLi-right">
              <div class="managementListLi-r-top">
                {{item.name}}
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
    <div :class="{'managementList-dang':true,'managementList-dangSelect':isManagementListDang}" @click="dangClick">
      DANG一下
    </div>
  </div>
</template>
<script>
import scroll from "./logScroll";
import { mapActions } from "vuex";
import { Toast } from "mint-ui";
export default {
  props: ["lists"],
  components: { "v-scroll": scroll },
  data() {
    return {
      onInfiniteTrue: false, // 上拉防重复
      onRefreshTrue: false, // 下拉加载防重复
      pageNoVal: 2,
      pageSizeVal: 30,
      dangClickTrue: false,
      isManagementListDang: false,
      isManagementListAllSeLeft: false, // 全选状态变更
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
  },
  watch: {
    lists: {
      handler(val) {
        var self = this;
        self.isManagementListAllSeLeft = false;
        self.logLists = val;
      }
      // deep: true
    }
  },
  methods: {
    // 全选状态
    allSelectClick() {
      var self = this;
      this.isManagementListAllSeLeft = !this.isManagementListAllSeLeft;
      self.logLists.forEach(function(ele, ind) {
        ele.show = !self.isManagementListAllSeLeft;
      });
      this.isManagementListDang = this.isManagementListAllSeLeft;
    },
    // 确认dang
    dangClick() {
      var self = this;
      var receiveBodyArrs = [];
      if (self.isManagementListDang == true) {
        if (self.logLists.length > 0) {
          self.logLists.forEach(function(ele, ind) {
            if (ele.show == false) {
              receiveBodyArrs.push({ userId: ele.id });
            }
          });
          if (receiveBodyArrs.length > 0) {
            var listObj = {
              userId: sessionStorage.getItem("logUserId"),
              receiveBody: receiveBodyArrs,
              dangType: 1,
              remindType: 1,
              sendType: 1,
              sendContent: "您当日还未提交日志，请及时提交",
              sendTelephone: sessionStorage.getItem("logPhone"),
              isAccessory: 0
            };
            if (self.dangClickTrue == false) {
              self.dangClickTrue = true;
              self
                .getdangSend(JSON.stringify(listObj))
                .then(data => {
                  self.dangClickTrue = false;
                  self.isManagementListDang = false;
                  if (data.statusCode == 200) {
                    Toast({
                      message: "发送成功!",
                      position: "bottom"
                    });
                  } else {
                    self.loadingText = "暂无更多数据";
                    Toast({
                      message: data.statusMessage,
                      position: "bottom"
                    });
                  }
                })
                .catch(msg => {
                  self.dangClickTrue = false;
                  self.loadingText = "暂无更多数据";
                  Toast({
                    message: "服务器异常",
                    position: "bottom"
                  });
                });
            }
          } else {
            Toast({
              message: "请选择人员",
              position: "bottom"
            });
          }
        } else {
          Toast({
            message: "请选择人员",
            position: "bottom"
          });
        }
      }
    },
    // 选中点击跳转
    listsCLick(index) {
      this.logLists[index].show = !this.logLists[index].show;
      var trueStrs = [];
      this.logLists.forEach(function(ele, ind) {
        if (ele.show == false) {
          trueStrs.push(ele);
        }
      });
      if (trueStrs.length > 0) {
        this.isManagementListDang = true;
      } else {
        this.isManagementListDang = false;
      }
      if (trueStrs.length == this.logLists.length) {
        this.isManagementListAllSeLeft = true;
      } else {
        this.isManagementListAllSeLeft = false;
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
          .getlogreportmanagerunsubmitlist(JSON.stringify(listObj))
          .then(data => {
            self.onInfiniteTrue = false;
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.records) {
                  self.pageNoVal++;
                  done(1);
                  var array = [];
                  data.data.records.forEach(function(ele, ind) {
                    array.push({
                      color: ele.color,
                      id: ele.id,
                      name: ele.memberName,
                      mobile: ele.mobile,
                      profile: ele.profile,
                      show: true
                    });
                  });
                  self.logLists = self.logLists.concat(array);
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
            self.loadingText = "";
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    ...mapActions(["getlogreportmanagerunsubmitlist", "getdangSend"])
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
        return "无";
      }
    }
  }
};
</script>
<style scoped>
.managementList-dangSelect {
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  ) !important;
  color: rgba(255, 255, 255, 1) !important;
}
.managementList-dang {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 44px;
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
  font-size: 18px;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  line-height: 44px;
}
.managementListAllSe-Selectleft {
  width: 22px;
  height: 22px;
  margin-left: 16px;
}
.managementListAllSe-left {
  width: 22px;
  height: 22px;
  margin-left: 16px;
}
.managementListAllSe-left img {
  width: 100%;
  height: 100%;
}
.managementListLi-selelctShow {
  width: 22px;
  height: 22px;
  margin-top: 21px;
  margin-left: 16px;
}
.managementListLi-selelct {
  width: 22px;
  height: 22px;
  margin-left: 16px;
  margin-top: 21px;
}
.managementListLi-selelct img {
  width: 100%;
  height: 100%;
}
.managementListAllSe-right {
  min-width: 32px;
  height: 16px;
  font-size: 16px;
  color: rgba(44, 44, 44, 1);
  line-height: 16px;
  margin-left: 12px;
}

.managementList-allselect {
  height: 40px;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #e3e3e3;
  display: flex;
  align-items: center;
}

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
  line-height: 1.2733rem;
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
  border-radius: 50%;
  margin-top: 0.2667rem;
}

.managementListLi-right {
  margin-left: 0.32rem;
  width: calc(100% - 0.32rem - 1.1733rem - 0.4267rem - 0.5867rem - 0.4267rem);
  border-bottom: 1px solid #e3e3e3;
}

.managementListLi-r-top {
  width: 10.3333rem;
  height: 0.4967rem;
  margin-top: 0.32rem;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.4767rem;
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
  height: calc(100vh - 1.0133rem - 1.2rem - 2.1733rem);
  overflow: hidden;
}
</style>