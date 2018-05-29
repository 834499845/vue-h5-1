<!--我发起的-筛选-->
<template>
    <div class="sponsorScreen">
        <div class="screenLi" @click="setDateClick">
            <div class="screenLiLeft">日期</div>
            <div class="screenLiRight">{{dateVal | timeFun}}</div>
            <div class="screenLiIcon">
               <img src="/static/img/右箭头@3x.png" alt="">
            </div>
        </div>
        <div class="screenLi" @click='typeClick()'>
            <div class="screenLiLeft">类型</div>
            <div class="screenLiRight">{{typeVal}}</div>
            <div class="screenLiIcon">
               <img src="/static/img/右箭头@3x.png" alt="">
            </div>
        </div>
        <div class="screenLi" @click='stateClick()'>
            <div class="screenLiLeft">状态</div>
            <div class="screenLiRight">{{stateVal}}</div>
            <div class="screenLiIcon">
               <img src="/static/img/右箭头@3x.png" alt="">
            </div>
        </div>
        <div class="okScreen" @click="okScreenClick()">
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
      dataStateVal: false, // 时间弹出控制
      dateVal: "请选择", //时间
      typeVal: "请选择", //类型
      stateVal: "请选择", //状态
      pockerUnitShow: false, //单选框弹出控制
      numLists: [], //单选框数组
      typeLists: [], //类型数组
      typeIdLists: [], //类型id数组
      stateLists: ["全部", "审批中", "审批完成", "已撤销"], //状态数组
      defStateIndex: "1",
      defIndex: "1"
    };
  },
  created: function() {
    document.title = "我发起的";
    sessionStorage.removeItem("isDetailsExamineLook");
    this.$store.commit("setMutVuexStartedListsTop", 0);
    var self = this;
    self
      .getapprovalindex({
        companyId: sessionStorage.getItem("companyId")
      })
      .then(data => {
        if (data.statusCode == 200) {
          if (data.data) {
            data.data.forEach(function(ele, ind) {
              self.typeLists.push(ele.modelName);
              self.typeIdLists.push({
                modelName: ele.modelName,
                modelId: ele.modelId
              });
            });
          }
        } else {
          Toast.$message("服务器异常");
        }
      })
      .catch(mas => {
        Toast.$message("服务器异常");
      });
  },
  mounted() {
    var self = this;
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    //获取用户信息
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("我发起的");
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setRightImageType(10, "");
      }
    } else {
      if (window.webkit) {
        window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
          {
            methodName: "invokeNavigationRightItemFromJS",
            params: {
              naviType: 0,
              titles: [{ name: "", code: "shai", notEnable: 0 }]
            }
          }
        );
      }
    }
  },
  methods: {
    // 时间弹出
    setDateClick() {
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
    // 类型选择弹出
    typeClick() {
      this.numLists = this.typeLists;
      this.defStateIndex = "type";
      this.pockerUnitShow = true;
    },
    // 状态选择弹出
    stateClick() {
      this.numLists = this.stateLists;
      this.defStateIndex = "state";
      this.pockerUnitShow = true;
    },
    // 单选取消
    cancelClick() {
      this.pockerUnitShow = false;
    },
    // 单选确定
    confirmClick(val) {
      if (this.defStateIndex == "type") {
        this.typeVal = val;
      } else if (this.defStateIndex == "state") {
        this.stateVal = val;
      }
      this.pockerUnitShow = false;
    },
    //提交
    okScreenClick() {
      var self = this;
      var dateStr;
      var typeStr;
      var stateStr;
      if (
        self.dateVal == "请选择" &&
        self.typeVal == "请选择" &&
        self.stateVal == "请选择"
      ) {
        Toast({
          message: "最少选择一个条件",
          position: "bottom"
        });
        return;
      } else {
        if (self.dateVal == "请选择") {
          dateStr = "";
        } else {
          if (self.dateVal) {
            dateStr = self.dateVal.getTime();
          } else {
            dateStr = "";
          }
        }
        if (self.typeVal == "请选择") {
          typeStr = "";
        } else {
          for (var i = 0; i < self.typeIdLists.length; i++) {
            if (self.typeIdLists[i].modelName == self.typeVal) {
              typeStr = self.typeIdLists[i].modelId;
            }
          }
        }
        if (self.stateVal == "请选择") {
          stateStr = "";
        } else if (self.stateVal == "全部") {
          stateStr = "9";
        } else if (self.stateVal == "审批中") {
          stateStr = "0";
        } else if (self.stateVal == "审批完成") {
          stateStr = "1";
        } else if (self.stateVal == "已撤销") {
          stateStr = "2";
        }
        var obj = {
          dateVal: dateStr,
          typeVal: typeStr,
          stateVal: stateStr
        };
        var str = JSON.stringify(obj);
        sessionStorage.setItem("sponsor", str);
        this.$router.go(-1);
      }
    },
    ...mapActions(["getapprovalindex"])
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
  line-height: 1.1733rem;
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