<!--我审批的-我已审批的-筛选-->
<template>
    <div class="sponsorScreen">
        <div class="screenLi" @click='genderClick()'>
            <div class="screenLiLeft">日期</div>
            <div class="screenLiRight">{{dateVal | timeFun}}</div>
            <div class="screenLiIcon">
                <img src="/static/img/右箭头@3x.png" alt="">
            </div>
        </div>
        <div class="screenLi" @click='departmentClick()'>
            <div class="screenLiLeft">状态</div>
            <div class="screenLiRight">{{departmentVal}}</div>
            <div class="screenLiIcon">
                <img src="/static/img/右箭头@3x.png" alt="">
            </div>
        </div>
        <div class="okScreen" @click="submitClick()">
            提交
        </div>
        <!-- 年月日选择器 -->
        <v-dateModel @message="canifmDateClick" @cancel="cancelDateClick" :dataState="dataStateVal"></v-dateModel>
        <!-- 单选框选择器 -->
        <v-singleSelect :pockerunit="pockerUnitShow" :numLists='numLists' :defStateIndex='defStateIndex' :defIndex='defIndex' @confirm="confirmClick"
            @cancel="cancelClick"></v-singleSelect>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import dateModel from "../cModule/dateModel";
import singleSelect from "../cModule/singleSelect";
import { Toast } from "mint-ui";
export default {
  components: {
    "v-dateModel": dateModel,
    "v-singleSelect": singleSelect
  },
  data() {
    return {
      defStateIndex: 2,
      dataStateVal: false, // 时间弹出控制
      dateVal: "请选择", //性别
      departmentVal: "请选择", //部门
      pockerUnitShow: false, //单选框弹出控制
      numLists: [], //单选框数组
      departmentList: ["全部", "审批中", "审批完成", "已撤销"], //部门数组
      defIndex: "1"
    };
  },
  methods: {
    // 日期选择弹出
    genderClick() {
      this.dataStateVal = true;
    },
    // 时间取消
    cancelDateClick() {
      this.dataStateVal = false;
    },
    // 时间选中
    canifmDateClick(val) {
      this.dateVal = val;
      this.dataStateVal = false;
    },
    //部门选择
    departmentClick() {
      this.numLists = this.departmentList;
      this.pockerUnitShow = true;
    },
    // 单选取消
    cancelClick() {
      this.pockerUnitShow = false;
    },
    // 单选确定
    confirmClick(val) {
      this.pockerUnitShow = false;
      this.departmentVal = val;
    },
    //提交
    submitClick() {
      var dateStr;
      var deparStr;
      if (this.dateVal == "请选择" && this.departmentVal == "请选择") {
        Toast({
          message: "最少选择一个条件",
          position: "bottom"
        });
      } else {
        if (this.dateVal == "请选择") {
          dateStr = "";
        } else {
          if (this.dateVal) {
            dateStr = this.dateVal.getTime();
          } else {
            dateStr = "";
          }
        }
        if (this.departmentVal == "请选择") {
          deparStr = "";
        } else if (this.departmentVal == "全部") {
          deparStr = "9";
        } else if (this.departmentVal == "审批中") {
          deparStr = "0";
        } else if (this.departmentVal == "审批完成") {
          deparStr = "1";
        } else if (this.departmentVal == "已撤销") {
          deparStr = "2";
        }
        var obj = {
          dateVal: dateStr,
          departmentVal: deparStr
        };
        var str = JSON.stringify(obj);
        sessionStorage.setItem("copyTo", str);
        this.$router.go(-1);
      }
    },
    ...mapActions([""])
  },
  created: function() {
    document.title = "抄送我的";
    sessionStorage.removeItem("copyToDetailsLook");
  },
  mounted() {
    var self = this;
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("抄送我的");
        window.BenchJSInterface.setRightBtn("", "");
      }
    } else {
      var setNav = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          naviType: 0,
          titles: [{ name: "", code: "shai" }]
        },
        callbackMethod: "pathFun"
      };
      if (window.webkit) {
        window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
          setNav
        );
      }
    }
  },
  watch: {},
  filters: {
    // 过滤时间
    timeFun: function(val) {
      if (val && val != "请选择") {
        var standardTime = new Date(val);
        var y, m, d, h, f;
        y = standardTime.getFullYear();
        m = standardTime.getMonth() + 1;
        m = m > 9 ? m : "0" + m;
        d = standardTime.getDate();
        d = d > 9 ? d : "0" + d;
        return y + "-" + m + "-" + d;
      } else {
        return "请选择";
      }
    }
  }
};
</script>
<style scoped>
.sponsorScreen {
  height: 100vh;
  width: 100%;
  background: #f1f1f1;
  user-select: none;
}

.screenLi {
  width: 10rem;
  height: 1.1733rem;
  display: flex;
  background: white;
  border-top: 1px solid #e3e3e3;
}

.screenLiLeft,
.screenLiRight {
  width: 45%;
  height: 1.1733rem;
  line-height: 1.2733rem;
}

.screenLiLeft {
  padding-left: 0.4267rem;
  font-size: 0.4267rem;
  color: #2b2b2b;
}

.screenLiRight {
  font-size: 0.3733rem;
  color: #848484;
  text-align: right;
}

.screenLiIcon {
  width: 0.2933rem;
  display: flex;
  align-items: center;
  margin-left: 0.1333rem;
}
.screenLiIcon img {
  width: 100%;
  height: 0.2933rem;
}

.okScreen {
  width: 100%;
  height: 1.28rem;
  line-height: 1.28rem;
  font-size: 0.48rem;
  color: white;
  text-align: center;
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
  position: fixed;
  bottom: 0;
}
</style>