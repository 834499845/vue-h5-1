<template>
  <div class="customerServiceIssue">
    <div class="issueList-input">
      <div class="issueList-inputLeft">
        用户账号<small>*</small>
      </div>
      <div class="issueList-inputRight">
        <input type="number" placeholder="请输入正确账号" v-model.trim="phoneVal">
      </div>
    </div>
    <div class="issueList-input">
      <div class="issueList-inputLeft">
        操作系统<small>*</small>
      </div>
      <div :class="systemClassObject">
        {{systemVal}}
      </div>
      <div class="issueList-inputSelect" @click="setMessageClick(1)">
        <img src="static/img/Combined Shape@3x.png" alt="">
      </div>
    </div>
    <div class="issueList-input">
      <div class="issueList-inputLeft">
        发生时间<small>*</small>
      </div>
      <div :class="jobTimeClassObject">
        {{jobTimeVal}}
      </div>
      <div class="issueList-inputSelect" @click="setDateClick">
        <img src="static/img/Combined Shape@3x.png" alt="">
      </div>
    </div>
    <div class="issueList-input">
      <div class="issueList-inputLeft">
        所属模块<small>*</small>
      </div>
      <div :class="modelClassObject">
        {{modelVal}}
      </div>
      <div class="issueList-inputSelect" @click="setMessageClick(2)">
        <img src="static/img/Combined Shape@3x.png" alt="">
      </div>
    </div>
    <div class="issueList-input">
      <div class="issueList-inputLeft">
        问题类型<small>*</small>
      </div>
      <div :class="typeClassObject">
        {{typeVal}}
      </div>
      <div class="issueList-inputSelect" @click="setMessageClick(3)">
        <img src="static/img/Combined Shape@3x.png" alt="">
      </div>
    </div>
    <div class="issueList-text">
      <div class="issueList-textLeft">
        问题描述<small>*</small>
      </div>
      <div class="issueList-textRight">
        <pre><br>{{presentVal}}</pre>
        <textarea placeholder="请简要阐述反馈问题" v-model.trim="presentVal"></textarea>
      </div>
    </div>
    <div class="issueList-img">
      <div class="issueList-imgLeft">
        相关截图
        <small>（最多6张）</small>
      </div>
      <div class="issueList-imgRight">
        <ul>
          <li class="imgRightLi" v-for="(item,index) in imgLists" @click="LookFileIndeClick(index)" :key="index">
            <img :src="item.img" alt="">
            <div class="imgRightLiDelete" @click="deleteImgClick(index)">
              <img src="static/img/取消@3x.png" alt="">
            </div>
          </li>
          <li class="imgRightLi" onclick="updateFileClick()">
            <img src="static/img/Group 2@3x.png" alt="">
          </li>
        </ul>
      </div>
    </div>
    <div class="issueList-but">
      <div @click="issueListbutClick" :class="{'issueList-butCLick':true,'issueList-butGoCLick':issueListBut}">提交</div>
    </div>
    <div class="goTost" v-show="isGoTostShow">
      <div>
        <img src="static/img/Group@Go3x.png" alt="">
      </div>
      <div>
        提交成功
      </div>
      <div>
        我们会尽快给您答复
      </div>
      <div>
        <div @click="goListClick">
          查看记录
        </div>
      </div>
    </div>
     <!--选择提醒类型方式弹出框-->
    <v-singleSelect :pockerunit="pockerUnitShow" :numLists='numLists' :defStateIndex='defStateIndex' :defIndex='defIndex' @confirm="confirmClick" @cancel="cancelClick" ></v-singleSelect>
    <!--选择提醒时间方式弹出框-->
    <v-timeModel @message="canifmDateClick" :time="timeVal" @cancel="cancelDateClick" :dataState="dataStateVal"></v-timeModel>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapActions } from "vuex";
import timeModel from "../cModule/dateTimeModel";
import singleSelect from "../cModule/singleSelect";
export default {
  props: ["createdShow"],
  components: {
    "v-timeModel": timeModel,
    "v-singleSelect": singleSelect
  },
  computed: {
    systemClassObject: function() {
      return {
        "issueList-selectRight": true,
        "issueList-selectRightColor": this.systemVal == "请选择" ? false : true
      };
    },
    jobTimeClassObject: function() {
      return {
        "issueList-selectRight": true,
        "issueList-selectRightColor":
          this.jobTimeVal == this.timefiltersFun() ? false : true
      };
    },
    modelClassObject: function() {
      return {
        "issueList-selectRight": true,
        "issueList-selectRightColor": this.modelVal == "请选择" ? false : true
      };
    },
    typeClassObject: function() {
      return {
        "issueList-selectRight": true,
        "issueList-selectRightColor": this.typeVal == "请选择" ? false : true
      };
    }
  },
  data() {
    return {
      systemVal: "请选择", // 系统
      modelVal: "请选择", // 模块
      typeVal: "请选择", // 模块
      phoneVal: "", // 账户
      presentVal: "", // 问题阐述
      jobTimeVal: "", // 发生时间
      issueListbutClickTrue: false,
      pockerUnitShow: false,
      numLists: [],
      numDatasystemLists: ["安卓", "苹果"],
      numDataModelLists: ["DANG", "工作", "联系人", "我的", "其他"],
      numDataTypeLists: ["闪退", "功能有误", "数据异常", "其他"],
      defStateIndex: 1,
      defIndex: 1,
      timeVal: "",
      dataStateVal: false,
      isGoTostShow: false,
      issueListBut: false,
      imgLists: [],
      LookFileIndex: 0
    };
  },
  created: function() {
    var self = this;
    this.jobTimeVal = this.timefiltersFun();
  },
  methods: {
    // 图片预览
    LookFileIndeClick(index) {
      var self = this;
      this.WatchBigPicture(self.imgLists, index);
    },
    // 查看记录
    goListClick() {
      var self = this;
      self.$router.push({
        path: "/customerServiceList"
      });
    },
    // 提交问题
    issueListbutClick() {
      var self = this;
      var reg = new RegExp(/^\d{11}$/);
      if (
        self.systemVal != "请选择" &&
        reg.test(self.phoneVal) == true &&
        self.modelVal != "请选择" &&
        self.typeVal != "请选择" &&
        self.presentVal.length > 0
      ) {
        if (self.issueListbutClickTrue == false) {
          self.issueListbutClickTrue = true;
          var timeStr = new Date(self.jobTimeVal).getTime();
          var obj = {
            userAccount: self.phoneVal,
            clientOs: self.systemVal,
            time: timeStr,
            module: self.modelVal,
            type: self.typeVal,
            desc: self.presentVal,
            advise: 0,
            userId: sessionStorage.getItem("customerServiceUserId")
          };
          if (self.imgLists.length > 0) {
            var imgArr = [];
            self.imgLists.forEach(function(ele, ind) {
              imgArr.push(ele.img);
            });
            obj["images"] = JSON.stringify(imgArr);
          }
          self.$store.commit("setMutVuexisLoading", true);
          self
            .getfeedBacksave(JSON.stringify(obj))
            .then(data => {
              self.$store.commit("setMutVuexisLoading", false);
              self.issueListbutClickTrue = false;
              if (data.statusCode == 200) {
                self.$emit("issueListbutIsClick", 1);
              } else {
                Toast({
                  message: data.statusMessage,
                  position: "bottom"
                });
              }
            })
            .catch(msg => {
              self.$store.commit("setMutVuexisLoading", false);
              self.issueListbutClickTrue = false;
              Toast({
                message: "服务器异常",
                position: "bottom"
              });
            });
        }
      } else {
        if (reg.test(self.phoneVal) == false) {
          Toast({
            message: "请输入正确用户账号",
            position: "bottom"
          });
        } else if (self.systemVal == "请选择") {
          Toast({
            message: "请选择操作系统",
            position: "bottom"
          });
        } else if (self.modelVal == "请选择") {
          Toast({
            message: "请选择所属模块",
            position: "bottom"
          });
        } else if (self.typeVal == "请选择") {
          Toast({
            message: "请选择问题类型",
            position: "bottom"
          });
        } else if (self.presentVal.length == 0) {
          Toast({
            message: "请选择输入问题描述",
            position: "bottom"
          });
        }
      }
    },
    // 时间过滤
    timefiltersFun(val) {
      var standardTime = "";
      if (val) {
        standardTime = new Date(val);
      } else {
        standardTime = new Date();
      }
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
    },
    // 选择模板弹出
    setMessageClick(index) {
      this.defStateIndex = index;
      if (index == 1) {
        this.numLists = this.numDatasystemLists;
      } else if (index == 2) {
        this.numLists = this.numDataModelLists;
      } else if (index == 3) {
        this.numLists = this.numDataTypeLists;
      }
      this.pockerUnitShow = true;
    },
    // 选择模板确认
    confirmClick(val, index) {
      if (index == 1) {
        this.systemVal = val;
      } else if (index == 2) {
        this.modelVal = val;
      } else if (index == 3) {
        this.typeVal = val;
      }
      this.pockerUnitShow = false;
    },
    // 选择模板取消
    cancelClick() {
      this.pockerUnitShow = false;
    },
    // 时间选择弹出
    setDateClick() {
      this.dataStateVal = true;
      this.timeVal = this.jobTimeVal;
    },
    // 提醒时间取消
    cancelDateClick() {
      this.dataStateVal = false;
    },
    // 提醒时间选中
    canifmDateClick(val) {
      this.dataStateVal = false;
      this.jobTimeVal = this.timefiltersFun(val);
    },
    // 删除图片
    deleteImgClick(index) {
      var self = this;
      self.imgLists.splice(index, 1);
    },
    ...mapActions(["getfeedBacksave"])
  },
  mounted() {
    var self = this;
    document.title = "问题反馈";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    // 上传图片
    window.updateFileClick = function(e) {
      if (isAndroid) {
        if (window.BenchJSInterface) {
          window.BenchJSInterface.setBtnOnClickEvent(
            "100",
            "javascript:window.updateAnImgFun(->path<-);"
          );
        }
      } else {
        var messgaeObjImg = {
          methodName: "invokeCameraFromJS",
          params: {},
          callbackMethod: "updateIosImgFun"
        };
        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterCameraJSHandler.postMessage(
            messgaeObjImg
          );
        }
      }
    };
    // 获取上传图片结果
    window.updateAnImgFun = function(val) {
      var imgPathObj = JSON.parse(JSON.stringify(val));
      imgPathObj.forEach(function(ele) {
        self.imgLists.push({ img: ele.imgPath });
      });
    };
    // 获取上传图片结果
    window.updateIosImgFun = function(val) {
      var imgList = JSON.parse(JSON.stringify(val));
      self.imgLists.push({ img: imgList.url });
    };
  },
  watch: {
    systemVal(val) {
      var self = this;
      if (
        val != "请选择" &&
        self.phoneVal.length > 0 &&
        self.modelVal != "请选择" &&
        self.typeVal != "请选择" &&
        self.presentVal.length > 0
      ) {
        self.issueListBut = true;
      } else {
        self.issueListBut = false;
      }
    },
    modelVal(val) {
      var self = this;
      if (
        self.systemVal != "请选择" &&
        self.phoneVal.length > 0 &&
        val != "请选择" &&
        self.typeVal != "请选择" &&
        self.presentVal.length > 0
      ) {
        self.issueListBut = true;
      } else {
        self.issueListBut = false;
      }
    },
    typeVal(val) {
      var self = this;
      if (
        self.systemVal != "请选择" &&
        self.phoneVal.length > 0 &&
        self.modelVal != "请选择" &&
        val != "请选择" &&
        self.presentVal.length > 0
      ) {
        self.issueListBut = true;
      } else {
        self.issueListBut = false;
      }
    },
    presentVal(val) {
      var self = this;
      if (val) {
        if (
          self.systemVal != "请选择" &&
          self.phoneVal.length > 0 &&
          self.modelVal != "请选择" &&
          self.typeVal != "请选择" &&
          val.length > 0
        ) {
          self.issueListBut = true;
        } else {
          self.issueListBut = false;
        }
      } else {
        self.issueListBut = false;
      }
    },
    phoneVal(val) {
      var self = this;
      if (val) {
        if (val.length > 11) {
          self.phoneVal = val.slice(0, 11);
        }
        var self = this;
        if (
          self.systemVal != "请选择" &&
          val.length > 0 &&
          self.modelVal != "请选择" &&
          self.typeVal != "请选择" &&
          self.presentVal.length > 0
        ) {
          self.issueListBut = true;
        } else {
          self.issueListBut = false;
        }
      } else {
        self.issueListBut = false;
      }
    },
    createdShow(val) {
      var self = this;
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
        return y + "." + m + "." + d;
      } else {
        return "暂无";
      }
    }
  }
};
</script>
<style scoped>
.goTost > div:nth-child(4) div {
  width: 3.7333rem;
  height: 0.96rem;
  background: rgba(67, 144, 225, 1);
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  line-height: 0.96rem;
  text-align: center;
}
.goTost > div:nth-child(4) {
  width: 100vw;
  display: flex;
  justify-content: center;
  margin-top: 0.64rem;
}
.goTost > div:nth-child(3) {
  width: 100vw;
  text-align: center;
  overflow: hidden;
  height: 0.5333rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.5333rem;
  margin-top: 0.32rem;
}
.goTost > div:nth-child(2) {
  width: 100vw;
  text-align: center;
  height: 0.6667rem;
  font-size: 0.48rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.6667rem;
  margin-top: 0.48rem;
  overflow: hidden;
}
.goTost > div:nth-child(1) {
  height: 1.92rem;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2.3467rem;
}
.goTost > div:nth-child(1) img {
  width: 1.92rem;
  height: 1.92rem;
}
.goTost {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  z-index: 100000000000000;
  overflow: hidden;
}
.issueList-butGoCLick {
  color: rgba(255, 255, 255, 1) !important;
}

.issueList-butCLick {
  height: 1.28rem;
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
  border-radius: 0.0533rem;
  width: calc(100vw - 1.92rem);
  margin-left: 0.96rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.48rem;
  text-align: center;
  line-height: 1.28rem;
}

.issueList-but {
  width: 100vw;
  margin-top: 0.96rem;
  margin-bottom: 0.9333rem;
}

.imgRightLi {
  width: 2.1333rem;
  height: 2.1333rem;
  margin-right: 0.2133rem;
  position: relative;
  margin-bottom: 0.4267rem;
}

.imgRightLiDelete img {
  width: 100%;
  height: 100%;
}

.imgRightLiDelete {
  position: absolute;
  z-index: 1000;
  top: -0.2133rem;
  right: -0.2133rem;
  width: 0.4267rem;
  height: 0.4267rem;
}

.imgRightLi img {
  width: 100%;
  height: 100%;
}

.issueList-imgRight ul {
  display: flex;
  flex-wrap: wrap;
}

.issueList-imgRight {
  width: calc(100vw - 0.5867rem);
  min-height: 2.1333rem;
  margin-bottom: 0.4267rem;
  margin-left: 0.4267rem;
}

.issueList-imgLeft {
  height: 1.0667rem;
  width: 100%;
  line-height: 1.0667rem;
  padding-left: 0.4267rem;
  font-size: 0.4267rem;
  color: #2b2b2b;
}

.issueList-imgLeft small {
  font-size: 0.4267rem;
  color: rgba(192, 192, 192, 1);
}

.issueList-img {
  width: 100%;
  overflow: hidden;
  min-height: 3.2rem;
}

.issueList-textRight {
  min-height: 3.7333rem;
  width: 100%;
}

.issueList-textRight {
  width: calc(100vw - 1.2267rem);
  color: rgba(44, 44, 44, 1);
  position: relative;
  margin-left: 0.4267rem;
}

.issueList-textRight textarea {
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  overflow-y: hidden;
  text-align: justify;
  text-justify: inter-ideograph;
  word-wrap: break-word;
  width: 100%;
  border: 1px solid #e3e3e3;
  resize: none;
  font-size: 0.4267rem;
  padding-top: 0.1867rem;
  padding-left: 0.1867rem;
  padding-right: 0.1867rem;
  line-height: 0.5867rem;
  overflow: hidden;
}

.issueList-textRight pre {
  display: block;
  white-space: pre-wrap;
  padding-top: 0.1867rem;
  padding-left: 0.1867rem;
  padding-right: 0.1867rem;
  word-wrap: break-word !important;
  visibility: hidden;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 100%;
  font-size: 0.4267rem;
  line-height: 0.5867rem;
  text-align: justify;
  word-wrap: break-word;
  text-justify: inter-ideograph;
}

.issueList-textLeft {
  height: 1.0133rem;
  width: 100%;
  padding-left: 0.4267rem;
  line-height: 1.0133rem;
  font-size: 0.4267rem;
  color: rgba(43, 43, 43, 1);
}

.issueList-text {
  min-height: 5.3333rem;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.issueList-text::after {
  position: absolute;
  bottom: 0;
  height: 1px;
  width: calc(100vw - 0.4267rem);
  left: 0.4267rem;
  background-color: #e3e3e3;
  content: "";
}

.issueList-inputLeft small,
.issueList-textLeft small {
  color: red;
}

.issueList-inputLeft {
  width: 2.4rem;
  height: 1.1733rem;
  line-height: 1.1733rem;
  font-size: 0.4267rem;
  color: rgba(43, 43, 43, 1);
  padding-left: 0.4267rem;
}

.issueList-inputSelect {
  height: 1.1733rem;
  width: 1.1467rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.issueList-inputSelect::after {
  position: absolute;
  height: 0.7467rem;
  width: 1px;
  background-color: #c0c0c0;
  top: 0.1867rem;
  left: 0;
  content: "";
}

input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: rgba(192, 192, 192, 1);
}

.issueList-inputSelect img {
  width: 0.32rem;
}

.issueList-inputRight input {
  height: 0.7467rem;
  line-height: 0.7467rem;
  font-size: 0.4267rem;
  width: calc(100vw - 2.4rem - 1.1467rem - 0.4267rem);
  color: #2c2c2c;
}

.issueList-inputRight {
  height: 1.1733rem;
  width: calc(100vw - 2.4rem - 1.1467rem - 0.4267rem);
  display: flex;
  align-items: center;
  margin-left: 0.4267rem;
}
.issueList-selectRightColor {
  color: #2c2c2c !important;
}
.issueList-selectRight {
  height: 1.1733rem;
  width: calc(100vw - 2.4rem - 1.1467rem - 0.4267rem);
  display: flex;
  align-items: center;
  margin-left: 0.4267rem;
  font-size: 0.4267rem;
  color: rgba(192, 192, 192, 1);
  font-size: 0.4267rem;
}

.issueList-input::after {
  position: absolute;
  bottom: 0;
  height: 1px;
  width: calc(100vw - 0.4267rem);
  left: 0.4267rem;
  background-color: #e3e3e3;
  content: "";
}

.issueList-input {
  height: 1.1733rem;
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
}

.customerServiceIssue {
  overflow-y: scroll;
  overflow-x: hidden;
  height: calc(100vh - 1.0667rem);
  width: 100vw;
  user-select: none;
}
</style>