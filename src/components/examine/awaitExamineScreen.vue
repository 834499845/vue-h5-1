<!--我审批的-我已审批的-筛选-->
<template>
    <div class="sponsorScreen">
        <div class="screenLi" onclick='departmentClick()'>
            <div class="screenLiLeft">部门</div>
            <div class="screenLiRight">{{departmentVal}}</div>
            <div class="screenLiIcon">
               <img src="/static/img/右箭头@3x.png" alt="">
            </div>
        </div>
          <div class="screenLi" @click='genderClick()'>
            <div class="screenLiLeft">状态</div>
            <div class="screenLiRight">{{genderVal}}</div>
            <div class="screenLiIcon">
                <img src="/static/img/右箭头@3x.png" alt="">
            </div>
        </div>
        <div class="okScreen" @click="submitClick()">
            提交
        </div>
        <!-- 单选框选择器 -->
        <v-singleSelect :pockerunit="pockerUnitShow" :numLists='numLists' :defStateIndex='defStateIndex' :defIndex='defIndex' @confirm="confirmClick"
            @cancel="cancelClick"></v-singleSelect>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import singleSelect from "../cModule/singleSelect";
import { Toast } from "mint-ui";
export default {
  components: {
    "v-singleSelect": singleSelect
  },
  data() {
    return {
      genderVal: "请选择", //性别
      departmentVal: "请选择", //部门
      departmentId: "", //部门id
      pockerUnitShow: false, //单选框弹出控制
      numLists: [], //单选框数组
      genderLists: ["全部", "审批中", "审批完成", "已撤销"], //性别数组
      departmentList: ["开发一部", "行政部", "财务部", "开发二部", "人事部门"], //部门数组
      defStateIndex: "1",
      defIndex: "1"
    };
  },
  created: function() {
    sessionStorage.setItem("nightExamineSaechIndex", 98);
    document.title = "我审批的";
  },
  mounted() {
    var self = this;
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("我审批的");
      }
    }
    // 选择部门
    window.departmentClick = function(e) {
      if (isAndroid) {
        if (window.BenchJSInterface) {
          window.BenchJSInterface.setBtnOnClickEvent(
            "102",
            "javascript:window.UpdepartmentFunAndroid(->path<-);"
          );
        }
      } else {
        var messgaeObj = {
          methodName: "BotongApplicationCenterDeptJSHandler",
          params: {},
          callbackMethod: "UpdepartmentFunIos"
        };
        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterDeptJSHandler.postMessage(
            messgaeObj
          );
        }
      }
      //选择部门返回Android
      window.UpdepartmentFunAndroid = function(val) {
        self.departmentVal = val[0].deptName;
        self.departmentId = val[0].deptId;
        //    {deptId:'部门id',deptName:'部门名称'} // 返回数据
      };
      //选择部门返回Ios
      window.UpdepartmentFunIos = function(val) {
        self.departmentVal = val[0].deptName;
        self.departmentId = val[0].deptId;
        //    {deptId:'部门id',deptName:'部门名称'} // 返回数据
      };
    };
  },
  methods: {
    // 状态选择弹出
    genderClick() {
      this.numLists = this.genderLists;
      this.pockerUnitShow = true;
    },
    // 单选取消
    cancelClick() {
      this.pockerUnitShow = false;
    },
    // 单选确定
    confirmClick(val) {
      this.genderVal = val;
      this.pockerUnitShow = false;
    },
    //提交
    submitClick() {
      var genderStr;
      if (this.genderVal == "请选择" && this.departmentVal == "请选择") {
        Toast({
          message: "最少选择一个条件",
          position: "bottom"
        });
      } else {
        if (this.genderVal == "请选择") {
          genderStr = "";
        } else if (this.genderVal == "全部") {
          genderStr = "9";
        } else if (this.genderVal == "审批中") {
          genderStr = "0";
        } else if (this.genderVal == "审批完成") {
          genderStr = "1";
        } else if (this.genderVal == "已撤销") {
          genderStr = "2";
        }
        var obj = {
          examineScreenTopShow: this.$route.query.examineScreenTopShow,
          genderVal: genderStr,
          departmentVal: this.departmentId
        };
        var str = JSON.stringify(obj);
        sessionStorage.removeItem("examineScreenTopShow");
        sessionStorage.setItem("await", str);
        sessionStorage.removeItem("iAmDetailsExamineTrue");
        this.$router.go(-1);
      }
    },
    ...mapActions([""])
  },

  watch: {},
  filters: {}
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