// 资讯编辑发布
<template>
  <div class="informationNewly">
    <div class="informationNewly-input">
      <div class="informationNewly-inputLeft">
        标题
      </div>
      <div class="informationNewly-inputRight">
        <input type="text" v-model="titleVal" placeholder="请输入标题" maxlength="35">
      </div>
    </div>
    <div class="informationNewly-inputBumen" onclick="addListsClick()">
      <div class="informationNewly-inputLefts">
        发送部门
      </div>
      <div class="informationNewly-inputBumeninputRight">
        <div>
          {{inputBumenVal}}
        </div>
        <div>
          <img src="/static/img/右箭头@3x.png" alt="">
        </div>
      </div>
    </div>
    <div class="informationNewly-text">
      <div class="writeList-right">
        <pre><br>{{ariterVal}}</pre>
        <textarea placeholder="请输入" v-model="ariterVal"></textarea>
      </div>
    </div>
    <div class="informationNewly-file">
      <div class="informationNewlyFile-left" v-if="infoImg">
        <img :src="infoImg" @click="LookFileIndeClick">
        <div class="deleteImg" @click="deleteClick">
          <img src="/static/notice/delete.png" class="deleteImage" alt="">
        </div>
      </div>
      <div class="informationNewlyFile-left" v-else onclick="updateFileClick()">
        <img src="/static/notice/camera.png" alt="">
      </div>
      <div class="informationNewlyFile-right">
        <small>{{ariterValNumber}}</small>
      </div>
    </div>
    <div :class="{'informationNewly-but':true,'settingLog-selbut':isSettingLogSelbut}" @click="configClick">
      发布
    </div>
    <!-- 询问框 -->
    <div v-show="cancelUpdateShow" class="cancelUpdate">
      <div class="cancelUpdateContent">
        <div>
          确定取消编辑吗？
        </div>
        <div>
          <div @click="cancelUpdateCancelClick">取消</div>
          <div @click="cancelUpdateaffrimClick">确定</div>
        </div>
      </div>
    </div>
    <div v-show="isAddShowTost" class="AddShowTost">
      <mt-spinner type="snake" color="#4390E1"></mt-spinner>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isAddShowTost: false,
      canSend: false, //防止多次发送
      toPath: "",
      cancelUpdateShowTrue: false,
      cancelUpdateShow: false,
      infoImg: "",
      ariterValNumber: 0,
      inputBumenVal: "请选择", // 部门id
      inputBumenValPostVal: "", // 部门名称
      titleVal: "",
      isSettingLogSelbut: false,
      ariterVal: "",
      isHeight: "226px",
      objLists: [],
      configClickShowTrue: false, // 发送成功后离开界面状态
      approverList: [], // 选中人员json
      sendDeptInfo: "", //给ios发送的信息
      deleteImgTrue: false
    };
  },
  //跳转拦截
  beforeRouteLeave(to, from, next) {
    var self = this;
    if (self.configClickShowTrue == true) {
      next();
    } else {
      self.cancelUpdateShow = true;
      self.toPath = to.path;
      if (self.cancelUpdateShowTrue == true) {
        self.cancelUpdateShowTrue = false;
        next();
      } else {
        next(false);
      }
    }
  },
  mounted() {
    var self = this;
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    // 上传图片
    window.updateFileClick = function() {
      if (isAndroid) {
        if (window.BenchJSInterface) {
          window.BenchJSInterface.setBtnOnClickEvent(
            "100",
            "javascript:window.updateAdImgFun(->path<-);"
          );
        }
      } else {
        var messgaeObj = {
          methodName: "invokeCameraFromJS",
          params: {},
          callbackMethod: "updateIosImgFun"
        };

        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterCameraJSHandler.postMessage(
            messgaeObj
          );
        }
      }
    };
    // 获取上传图片结果
    window.updateIosImgFun = function(val) {
      var imgList = JSON.parse(JSON.stringify(val));
      self.infoImg = imgList.url;
      self.deleteImgTrue = true;
    };
    // 获取上传图片结果
    window.updateAdImgFun = function(val) {
      var imgPathObj = JSON.parse(JSON.stringify(val));
      self.infoImg = imgPathObj[0].imgPath;
      self.deleteImgTrue = true;
    };
    // 选择部门
    window.addListsClick = function() {
      if (isAndroid) {
        if (window.BenchJSInterface) {
          if (self.inputBumenVal != "请选择") {
            window.BenchJSInterface.setBtnOnClickEvent(
              "106",
              "javascript:window.updateAnListFun(->path<-);",
              JSON.stringify(self.objLists)
            );
          } else {
            window.BenchJSInterface.setBtnOnClickEvent(
              "106",
              "javascript:window.updateAnListFun(->path<-);"
            );
          }
        }
      } else {
        var messgaeObj = {};
        if (self.objLists.length > 0) {
          messgaeObj = {
            methodName: "BotongApplicationCenterDeptJSHandler",
            params: {
              limitCount: 1,
              deptInfo: JSON.stringify(self.sendDeptInfo)
            },
            callbackMethod: "updateIosListFun"
          };
        } else {
          messgaeObj = {
            methodName: "BotongApplicationCenterDeptJSHandler",
            params: {
              limitCount: 1,
              deptInfo: ""
            },
            callbackMethod: "updateIosListFun"
          };
        }

        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterDeptJSHandler.postMessage(
            messgaeObj
          );
        }
      }
    };
    // 选中结果安卓
    window.updateAnListFun = function(val) {
      var arrList = JSON.parse(JSON.stringify(val));
      self.objLists = [];
      self.objLists = arrList;
      self.inputBumenValPostVal = self.objLists[0].deptName;
      self.inputBumenVal = "选中了" + self.objLists[0].deptName + "部门";
    };
    // 选中结果ios
    window.updateIosListFun = function(val) {
      self.sendDeptInfo = JSON.parse(JSON.stringify(val));
      var arrList = JSON.parse(JSON.stringify(val.deptInfo));
      self.objLists = [];
      self.objLists = arrList;
      self.inputBumenValPostVal = self.objLists[0].name;
      self.inputBumenVal = "选中了" + self.objLists[0].name + "部门";
    };
  },
  components: {},
  methods: {
    // 图片预览
    LookFileIndeClick() {
      var self = this;
      var arr = [{ img: self.infoImg }];
      this.WatchBigPicture(arr, 0);
    },
    //删除图片
    deleteClick() {
      var self = this;
      self.infoImg = "";
      self.deleteImgTrue = false;
    },
    // 确认离开页面
    cancelUpdateaffrimClick() {
      this.cancelUpdateShow = false;
      this.cancelUpdateShowTrue = true;
      this.$router.go(-1);
    },
    // 取消离开页面
    cancelUpdateCancelClick() {
      this.cancelUpdateShow = false;
    },
    // 发布
    configClick() {
      var self = this;
      self.configClickShowTrue = false;
      if (self.isSettingLogSelbut == true) {
        var listObj = {};
        if (sessionStorage.getItem("infoCatalogId")) {
          listObj = {
            catalogId: sessionStorage.getItem("infoCatalogId"),
            oneCatalogId: sessionStorage.getItem("infoOneCatalogId"),
            orgId: sessionStorage.getItem("infoOrgId"),
            departmentName: self.inputBumenValPostVal,
            title: self.titleVal,
            content: self.ariterVal
          };
        } else {
          listObj = {
            oneCatalogId: sessionStorage.getItem("infoOneCatalogId"),
            orgId: sessionStorage.getItem("infoOrgId"),
            departmentName: self.inputBumenValPostVal,
            title: self.titleVal,
            content: self.ariterVal
          };
        }
        if (self.infoImg.indexOf("http") != -1) {
          listObj["pictureUrl"] = self.infoImg;
        }
        self.isAddShowTost = true;
        self
          .getapiinfoappinsertinfo(JSON.stringify(listObj))
          .then(data => {
            self.isAddShowTost = false;
            if (data.statusCode == 200) {
              Toast({
                message: "发布成功",
                position: "bottom"
              });
              self.configClickShowTrue = true;
              self.$router.go(-1);
              sessionStorage.removeItem("infoCatalogId");
              sessionStorage.removeItem("infoOneCatalogId");
            } else {
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            self.isAddShowTost = false;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      } else {
        if (this.titleVal.length == "") {
          Toast({
            message: "请填写标题",
            position: "bottom"
          });
        } else if (this.inputBumenVal == "请选择") {
          Toast({
            message: "请选择部门",
            position: "bottom"
          });
        } else if (this.ariterVal.length == "") {
          Toast({
            message: "请填写内容",
            position: "bottom"
          });
        }
      }
    },
    ...mapActions(["getapiinfoappinsertinfo"])
  },
  created: function() {
    var self = this;
    document.title = "编辑";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setTitle("编辑");
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
  watch: {
    titleVal(val) {
      var self = this;
      self.titleVal = val.replace(/^\s+|\s+$/g, "");
      if (
        val.length > 0 &&
        self.ariterVal.length > 0 &&
        self.inputBumenVal != "请选择"
      ) {
        self.isSettingLogSelbut = true;
      } else {
        self.isSettingLogSelbut = false;
      }
    },
    ariterVal(val) {
      var self = this;
      // console.log(val.length)
      // self.ariterValNumber = val.length;
      // self.ariterVal = val.replace(/^\s+|\s+$/g, "");
      if (val.length <= 200000) {
        if (
          val.length > 0 &&
          self.titleVal.length > 0 &&
          self.inputBumenVal != "请选择"
        ) {
          self.isSettingLogSelbut = true;
        } else {
          self.isSettingLogSelbut = false;
        }
        self.ariterValNumber = val.length;
      } else {
        self.ariterVal = val.slice(0, 200000);
      }
    },
    inputBumenVal(val) {
      if (
        val != "请选择" &&
        this.ariterVal.length > 0 &&
        this.titleVal.length > 0
      ) {
        this.isSettingLogSelbut = true;
      } else {
        this.isSettingLogSelbut = false;
      }
    }
  },
  filters: {}
};
</script>
<style scoped>
.deleteImg {
  width: 0.4267rem;
  height: 0.4267rem;
  position: absolute;
  top: 10.25rem;
  left: 1.725rem;
}

.AddShowTost {
  width: 100vw;
  height: 100vh;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0);
}

/* 新增加载框 */

/* 询问框 */

.cancelUpdateContent > div:nth-child(2) > div {
  width: 50%;
  text-align: center;
  font-size: 0.48rem;
  color: rgba(67, 144, 225, 1);
  height: 1.1733rem;
  line-height: 1.1733rem;
}

.cancelUpdateContent > div:nth-child(2) > div:nth-child(1) {
  border-right: 1px solid rgba(195, 222, 250, 1);
}

.cancelUpdateContent > div:nth-child(2) {
  display: flex;
  justify-content: space-between;
  height: 1.1733rem;
  align-items: center;
}

.cancelUpdateContent > div:nth-child(1) {
  height: 1.44rem;
  width: 100%;
  text-align: center;
  font-size: 0.4533rem;
  line-height: 1.44rem;
  border-bottom: 1px solid rgba(195, 222, 250, 1);
  color: rgba(44, 44, 44, 1);
}

.cancelUpdateContent {
  width: 7.2rem;
  height: 2.6133rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.0533rem;
}

.cancelUpdate {
  width: 100vw;
  height: 100vh;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
}

/* 询问框 */

.settingLog-selbut {
  color: rgba(255, 255, 255, 1) !important;
}

.informationNewly-but {
  position: fixed;
  z-index: 100000000;
  bottom: 0;
  left: 0;
  text-align: center;
  line-height: 1.1733rem;
  font-size: 0.48rem;
  color: rgba(255, 255, 255, 0.4);
  width: 100%;
  height: 1.1733rem;
  background: rgba(67, 144, 225, 1);
}

.informationNewlyFile-right {
  width: 3.2rem;
  height: 1.6rem;
  font-size: 0.3733rem;
  text-align: right;
  color: rgba(192, 192, 192, 1);
  margin-right: 0.4267rem;
  line-height: 2.5333rem;
  margin-top: 1.3333rem;
}

.informationNewlyFile-right small {
  font-size: 0.3733rem;
  color: rgba(192, 192, 192, 1);
}

.informationNewlyFile-left img {
  width: 100%;
  height: 100%;
}

.informationNewlyFile-left {
  width: 1.6rem;
  height: 1.6rem;
  /* border: 0.0267rem dashed #ccc; */
  margin-left: 0.4267rem;
  margin-top: 1.3333rem;
  overflow: hidden;
}

.informationNewly-file {
  display: flex;
  justify-content: space-between;
  height: 3.36rem;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  margin-bottom: 1.6rem;
}

.informationNewly-text {
  margin-top: 0.2133rem;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  min-height: 6.0267rem;
}

.informationNewly-text > div {
  margin: 0 auto;
  width: 95%;
  margin-top: 10px;
  min-height: 6.0267rem;
}

.writeList-right {
  width: calc(100% - 3.28rem - 0.64rem - 0.5067rem);
  color: rgba(44, 44, 44, 1);
  position: relative;
  margin: 0;
  padding: 0;
  line-height: normal;
  font-size: 0.4267rem;
  line-height: 0.5867rem;
  margin-top: 0.3733rem;
  margin-bottom: 0.3733rem;
}

.writeList-right textarea {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  overflow-y: hidden;
  font-size: 0.4267rem;
  line-height: 0.5867rem;
  text-align: justify;
  text-justify: inter-ideograph;
  border: 0;
  word-wrap: break-word;
  resize: none;
}

.writeList-right pre {
  display: block;
  white-space: pre-wrap;
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
  text-justify: inter-ideograph;
  word-wrap: break-word;
}

.informationNewly ::-webkit-input-placeholder {
  color: rgba(192, 192, 192, 1);
  font-size: 0.3733rem;
}

.informationNewly-inputBumen {
  margin-top: 0.2133rem;
  width: 100%;
  height: 1.1733rem;
  display: flex;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
}

.informationNewly-inputBumeninputRight > div:nth-child(1) {
  min-width: 1.1467rem;
  height: 0.4533rem;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.4833rem;
  text-align: right;
  max-width: 5.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.informationNewly-inputBumeninputRight > div:nth-child(2) {
  width: 0.2933rem;
  margin-right: 0.3rem;
  margin-top: 1px;
}

.informationNewly-inputBumeninputRight > div:nth-child(2) img {
  width: 100%;
  height: 100%;
}

.informationNewly-inputBumeninputRight {
  display: flex;
  margin-right: 0.1067rem;
  height: 0.3533rem;
}

.informationNewly-inputLeft {
  width: 1.28rem;
  text-align: right;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  height: 1.1733rem;
  line-height: 1.1733rem;
}

.informationNewly-inputLefts {
  width: 2.125rem;
  text-align: right;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  height: 1.1733rem;
  line-height: 1.1733rem;
}

.informationNewly-inputRight {
  height: 1.1733rem;
  width: calc(100% - 2.0267rem);
  margin-left: 0.32rem;
  display: flex;
  align-items: center;
}

.informationNewly-inputRight input {
  height: 0.72rem;
  width: 100%;
  border: 0rem solid #fff;
  line-height: 0.72rem;
  font-size: 0.3733rem;
}

.informationNewly-input {
  width: 100%;
  height: 1.1733rem;
  display: flex;
  background-color: #fff;
}

.informationNewly {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  width: 100%;
  background-color: rgba(241, 241, 241, 1);
}
</style>