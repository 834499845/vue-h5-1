<!--日常签到-我的-->
<template>
    <div :class="{outSign:isoutSign,noScroll:isnoScroll}">
      <div>
          <div class="top">
            <div class="topHeadImg">
              <img v-show="userNameValprofileShow" :src="userNameValprofile" alt="">
              <div v-show="!userNameValprofileShow">{{userNameVal | userNickFun}}</div>
            </div>
            <div>
              <div>{{userNameVal}}</div>
              <div>您本月已签到{{signCount}}次</div>
            </div>
            <div @click="selectTimeClick">
              <div >{{messageWayVal | timeStr}}</div>       
              <div><img src="/static/img/下拉.png" alt=""></div>
            </div>
          </div>
      </div>
      <div class="main">
        <ul>
          <li v-for="(item,index) in signedLists" :key="index">
            <div>{{item.signDate | timeFun}}</div>
            <div class="item" v-for="(itemChild,ind) in item.detailList" :key="ind">            
              <div class="time">打卡时间 &nbsp;{{itemChild.signDate | timesFun}}</div>
              <div class="address"><img src="/static/img/地图坐标.png" alt="">{{itemChild.addressTitle+itemChild.address | strFun}}</div>
            </div>  
          </li>
        </ul>
      </div>
      <!-- 选择时间弹框 -->
      <v-singleSelect :pockerunit="pockerUnitShow" :numLists='numLists' :defStateIndex='defStateIndex' :defIndex='defIndexVal' @confirm="confirmClick" @cancel="cancelClick" ></v-singleSelect>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import singleSelect from "../cModule/singleSelectNormal";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      isoutSign: true,
      isnoScroll: false,
      signedLists: [],
      signCount: "",
      pockerUnitShow: false,
      numLists: [],
      numDataLists: [
        "2018.03",
        "2018.04",
        "2018.05",
        "2018.06",
        "2018.07",
        "2018.08",
        "2018.09",
        "2018.10",
        "2018.11",
        "2018.12",
        "2019.01",
        "2019.02",
        "2019.03",
        "2019.04",
        "2019.05",
        "2019.06",
        "2019.07",
        "2019.08",
        "2019.09",
        "2019.10",
        "2019.11",
        "2019.12"
      ],
      defStateIndex: 9999,
      defIndexVal: 2,
      defIndexValCopy: 2,
      messageWayVal: new Date(),
      userIdVal: "",
      orgIdVal: "",
      userNameValprofile: "",
      userNameValprofileShow: false,
      userNameVal: "",
      currentTimeVlaue: ""
    };
  },
  components: {
    "v-singleSelect": singleSelect
  },
  created: function() {
    var self = this;
    self.userNameVal = sessionStorage.getItem("singUserName") || "暂无";
    self.userNameValprofile = sessionStorage.getItem("singUserImg") || "暂无";
    if (self.userNameValprofile.indexOf("http") > -1) {
      self.userNameValprofileShow = true;
    } else {
      self.userNameValprofileShow = false;
    }
    var y, m;
    y = self.messageWayVal.getFullYear();
    m = self.messageWayVal.getMonth();
    m = m > 9 ? m + 1 : "0" + (m + 1);
    self.messageWayVal = y + "." + m;
    var currentTimeVl = self.messageWayVal;
    this.numDataLists.forEach(function(ele, ind) {
      if (ele == currentTimeVl) {
        self.defIndexValCopy = ind;
      }
    });
    self.currentTimeVlaue = y + "." + m;
    this.normalSignList();
    document.title = "我的";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setTitle("我的");
        window.BenchJSInterface.setTopBarColor(1);
      }
    } else {
      var setNav = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          naviType: 0,
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
  filters: {
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
    strFun: function(val) {
      if (val) {
        return val;
      } else {
        return "暂无数据";
      }
    },
    // 过滤时间
    timeFun: function(val) {
      if (val) {
        return val.replace("-", ".").replace("-", ".");
      } else {
        return "暂无";
      }
    },
    timeStr: function(val) {
      if (val) {
        if (val.indexOf(".") > -1) {
          val = val.split(".").join("-");
        }
        var standardTime = new Date(val);
        var y, m;
        y = standardTime.getFullYear();
        m = standardTime.getMonth() + 1;
        m = m > 9 ? m : "0" + m;
        return y + "-" + m;
      }
    },
    timesFun: function(val) {
      if (val) {
        val = Number(val);
        var standardTime = new Date(val);
        var h, f;
        h = standardTime.getHours();
        h = h > 9 ? h : "0" + h;
        f = standardTime.getMinutes();
        f = f > 9 ? f : "0" + f;
        return h + ":" + f;
      } else {
        return "暂无";
      }
    }
  },
  methods: {
    // 选择模板确定
    confirmClick(val1, val2) {
      var self = this;
      this.isnoScroll = false;
      this.messageWayVal = val1;
      var currentTimeVl = self.messageWayVal;
      this.pockerUnitShow = false;
      this.numDataLists.forEach(function(ele, ind) {
        if (ele == currentTimeVl) {
          self.defIndexValCopy = ind;
        }
      });
      this.normalSignList();
    },
    // 选择模板取消
    cancelClick() {
      this.pockerUnitShow = false;
      this.isnoScroll = false;
    },
    // 选中筛选时间
    selectTimeClick() {
      var self = this;
      self.isnoScroll = true;
      self.defIndexVal = self.defIndexValCopy;
      this.numLists = this.numDataLists;
      this.pockerUnitShow = true;
      this.defStateIndex = 2;
      this.normalSignList();
    },
    // 日常-按月查询我的签到列表
    normalSignList() {
      var self = this;
      var timeVal = self.messageWayVal.split(".").join("-");
      var obj = {
        userId: sessionStorage.getItem("singMemberId"),
        signDate: timeVal
      };
      var object = JSON.stringify(obj);
      self.$store.commit("setMutVuexisLoading", true);
      self
        .getSignApiSignQueryMonthInfo(object)
        .then(data => {
          self.$store.commit("setMutVuexisLoading", false);
          if (data.statusCode == 200) {
            self.signCount = data.data.signCount;
            if (data.data.signList) {
              self.signedLists = data.data.signList;
            } else {
              self.signedLists = [];
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
    ...mapActions(["getSignApiSignQueryMonthInfo"])
  },
  watch: {}
};
</script>
<style scoped>
.outSign {
  position: relative;
  height: 100vh;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  user-select: none;
  overflow-y: auto;
}
.noScroll {
  overflow: hidden;
}
.outSign > div:nth-child(1) {
  border-bottom: 1px solid #f7f7f7;
  background-color: #fff;
}

.top {
  padding-left: 0.4267rem;
  padding-right: 0.4267rem;
  display: flex;
  width: 100%;
  justify-content: flex-start;
}

.topHeadImg {
  margin-top: 0.2667rem;
  min-width: 1.1733rem;
  height: 1.1733rem;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}

.topHeadImg div {
  position: absolute;
  top: 0;
  left: 0;
  width: 1.1733rem;
  height: 1.1733rem;
  overflow: hidden;
  background-color: #4592e2;
  text-align: center;
  line-height: 1.1733rem;
  color: #fff;
  font-size: 0.3733rem;
  user-select: none;
}

.topHeadImg img {
  width: 1.1733rem;
  height: 1.1733rem;
  border-radius: 22px;
}

.top > div:nth-child(2) {
  margin-left: 0.32rem;
  margin-top: 0.2667rem;
  margin-bottom: 0.2667rem;
  min-width: 3.2267rem;
  margin-right: 25%;
}
.top > div:nth-child(2) > div:nth-child(1) {
  margin-top: 0.1067rem;
  min-width: 1.28rem;
  height: 0.4267rem;
  font-size: 0.4267rem;
  user-select: none;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
  line-height: 0.4267rem;
}
.top > div:nth-child(2) > div:nth-child(2) {
  width: 5.3333rem;
  height: 0.4733rem;
  font-size: 0.3733rem;
  user-select: none;
  overflow: hidden;
  color: rgba(132, 132, 132, 1);
  line-height: 0.4733rem;
  margin-top: 0.2667rem;
}

.top > div:nth-child(3) {
  display: flex;
  width: 4.4267rem;
  height: 0.32rem;
  font-size: 0.3733rem;
  user-select: none;
  font-family: PingFangSC-Regular;
  color: rgba(67, 144, 225, 1);
  line-height: 0.32rem;
  margin-top: 0.72rem;
  justify-content: flex-end;
  align-items: center;
  text-align: right;
}

.top > div:nth-child(3) > div:nth-child(2) {
  width: 0.2933rem;
  margin-left: 0.2667rem;
}

.top > div:nth-child(3) > div:nth-child(2) img {
  width: 0.2933rem;
  /* vertical-align:top; */
  margin-bottom: 0.1333rem;
}

.main li {
  /* border-top: 12px solid rgba(247, 247, 247, 1); */
  width: 10rem;
  min-height: 2.2933rem;
  background: rgba(255, 255, 255, 1);
  border-bottom: 12px solid rgba(247, 247, 247, 1);
  /* padding-bottom: 0.2667rem; */
}

.main li:nth-child(1) {
  border-top: 12px solid rgba(247, 247, 247, 1);
}

.main li > div {
  padding-left: 0.4267rem;
  padding-right: 0.4267rem;
}

.main li > div:nth-child(1) {
  margin-top: 0.32rem;
  margin-bottom: 0.32rem;
  width: 1.9467rem;
  height: 0.3733rem;
  font-size: 0.3733rem;
  user-select: none;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.3733rem;
}

.main li > div:nth-child(2) {
  margin-top: 0.32rem;
}

.main li > .item > div:nth-child(2) {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.time {
  margin-top: 0.32rem;
  margin-bottom: 0.2667rem;
  /* width:122px; */
  height: 0.4267rem;
  font-size: 0.4267rem;
  user-select: none;
  font-family: PingFangSC-Medium;
  color: rgba(44, 44, 44, 1);
  line-height: 0.4267rem;
}

.address {
  /* width:270px; */
  height: 0.37rem;
  font-size: 0.32rem;
  user-select: none;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
  line-height: 0.37rem;
  margin-bottom: 0.2667rem;
}

.address img {
  width: 0.2667rem;
  /* margin-top: 0.03rem; */
  vertical-align: top;
  margin-right: 0.184rem;
}

.selectTime {
  width: 10rem;
  height: 7.68rem;
  position: fixed;
  bottom: 0;
  left: 0;
  overflow-x: auto;
  z-index: 10000000;
  border-top: 1px solid #f7f7f7;
}

.selectTime ul {
  margin: 0;
  padding: 0;
  overflow-x: auto;
}

.selectTime ul li {
  padding: 0;
  margin: 0;
  height: 0.96rem;
  line-height: 0.96rem;
  text-align: center;
  color: #707274;
  border-top: 1px solid #f7f7f7;
  font-size: 0.4rem;
  user-select: none;
}

.selectTime ul li:nth-child(1) {
  border-top: none;
}

.timeTop {
  display: flex;
  width: 8.9333rem;
  height: 0.96rem;
  line-height: 0.96rem;
  margin-left: 0.5333rem;
  justify-content: space-between;
  position: fixed;
  bottom: 7.68rem;
}

.timeTop > div {
  color: #4592e2;
  font-size: 0.4rem;
  user-select: none;
}
</style>