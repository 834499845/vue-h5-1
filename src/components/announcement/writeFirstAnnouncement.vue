// 发公告
<template>
  <div class="writeFirstAnnouncement">

    <div class="announcementLines a-line1">
      <span class="announcementLinesLeft">标题 : </span>
      <input type="text" placeholder="请输入标题(必填)" class="titleContent" v-model="titleVal" maxlength="35">
      <div></div>
    </div>
    <div class="announcementLines a-line2">
      <span class="announcementLinesLeft">作者 : </span>
      <input type="text" class="titleContent" v-model="authorVal" maxlength="10">
      <div></div>
    </div>
    <div class="announcementLineSend a-line3">
      <div class="announcementLinesLeft">发送给</div>
      <div class="announcementChooseTextRifght" onclick="addListsClick()">
        <div class="announcementChooseText">
          {{sendTo}}
        </div>
        <div class="chooseImg">
          <img src="/static/notice/choose.png" alt="">
        </div>
      </div>
    </div>
    <div class="announcementDang">
      <div class="announcementLinesLeft">DANG一下</div>
      <div class="announcementChoose">
        <v-swtich :switchMsg="dangStateVal" @switchmodel="switchmodelClick"></v-swtich>
      </div>
    </div>
    <div class="blank1"></div>
    <div class="uploadImage">
      <div class="uploadText">上传封面图</div>

      <div class="uploadImg" v-if="imgSrc">
        <img :src="imgSrc" class="uploadPicture" alt="" @click="LookFileIndeClick">
        <div class="deleteImg" @click="deleteImageClick">
          <img src="/static/notice/delete.png" class="deleteImage" alt="">
        </div>
      </div>
      <div class="cameraImg" v-else onclick="updateFileClick()">
        <img src="/static/notice/camera.png" class="uploadPicture" alt="">
      </div>
    </div>
    <div class="blank1"></div>
    <div class="enterContent" @click="inputContentClick">
      <div class="enterContentSpan" v-show="!contentVal">在此输入内容…</div>
      <div class="contentVal" v-show="contentVal" v-html="contentVal">

      </div>
      <div style="width:100%;height:1px;"></div>
    </div>
    <div class="sendNotice" @click="sendNoticeClick">
      <div :class="{'sendNoticeTextT':true,'sendNoticeTextF':isSettingNotice}">发送</div>
    </div>
    <!-- 询问 -->
    <div v-show="cancelUpdateShow" class="cancelUpdate">
      <div class="cancelUpdateContent">
        <div>
          确定要放弃本次编辑？
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
import swtich from "../cModule/swtichModel";
import { Toast } from "mint-ui";
import { mapActions } from "vuex";
export default {
  components: {
    "v-swtich": swtich
  },
  data() {
    return {
      isAddShowTost: false,
      userId: "", //用户id
      canSend: false, //防止多次发送
      isSettingNotice: false, //完成按钮样式变更
      imgSrc: "", //封面图片
      cover: "",
      sendList: [], //发送人列表
      sendTo: "选择发送公告部门", // 发送范围文字
      dangState: 1, //dang开关
      dangStateVal: "",
      titleVal: "", //标题
      authorVal: "", //作者
      ischeckedPeople: false, //是否选中人员
      userInfo: "", //公告范围 发送公告需要的数据
      contentVal: "", //公告信息
      secrecyState: 1, //非保密
      iosSendSunccess: true,
      androidSendSuccess: true,
      cancelUpdateShow: false, //弹出框
      cancelUpdateShowTrue: false, //弹出框
      configClickShowTrue: false, // 发送成功后离开界面状态
      sendDeptInfo: ""
    };
  },
  methods: {
    // 图片预览
    LookFileIndeClick() {
      var self = this;
      var arr = [{ img: self.cover }];
      this.WatchBigPicture(arr, 0);
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
    //删除图片
    deleteImageClick() {
      this.imgSrc = "";
      this.cover = "";
    },
    //dang开关
    switchmodelClick(val) {
      var self = this;
      if (val == false) {
        self.dangState = 0;
        self.dangStateVal = 1;
      } else {
        self.dangState = 1;
        self.dangStateVal = 0;
      }
    },
    //跳转至公告内容编辑页
    inputContentClick() {
      var self = this;
      if (self.titleVal) {
        sessionStorage.setItem("noticeTitle", self.titleVal);
      }
      if (self.authorVal) {
        sessionStorage.setItem("noticeAuthor", self.authorVal);
      }
      if (self.imgSrc) {
        sessionStorage.setItem("noticeImgSrc", self.imgSrc);
      }
      if (self.cover) {
        sessionStorage.setItem("noticeCover", self.cover);
      }
      if (self.ischeckedPeople == true) {
        sessionStorage.setItem("noticeSendTo", self.sendTo);
      }
      if (self.userInfo) {
        sessionStorage.setItem("noticeUserInfo", self.userInfo);
      }
      sessionStorage.setItem("noticeDang", self.dangState);
      sessionStorage.setItem("noticeDangState", self.dangStateVal);
      this.$router.push("/writeSecondAnnouncement");
    },
    //发布公告
    sendNoticeClick() {
      var self = this;
      self.configClickShowTrue = false;
      if (self.canSend == false) {
        self.canSend = true;
        if (self.titleVal == "") {
          Toast({
            message: "标题不能为空",
            position: "bottom"
          });
          self.canSend = false;
        } else if (self.userInfo == "") {
          Toast({
            message: "发送范围不能为空",
            position: "bottom"
          });
          self.canSend = false;
        } else if (self.contentVal == "") {
          Toast({
            message: "内容不能为空",
            position: "bottom"
          });
          self.canSend = false;
        } else {
          var user = {
            issueUserId: sessionStorage.getItem("noticeMemberId"),
            title: self.titleVal,
            content: self.contentVal,
            cover: self.cover,
            author: self.authorVal
              ? self.authorVal
              : sessionStorage.getItem("noticeCompanyName"),
            // memberIds: self.userInfo,
            departmentIds: self.userInfo,
            secrecyState: self.secrecyState,
            dangState: self.dangState,
            orgId: sessionStorage.getItem("noticeOrgId"),
            phone: sessionStorage.getItem("noticephone")
          };
          user = JSON.stringify(user);
          self.isAddShowTost = true;
          //发送公告
          self
            .getNoticeinsertNotice(user)
            .then(data => {
              self.canSend = false;
              self.isAddShowTost = false;
              if (data.statusCode == 200) {
                Toast({
                  message: "发送成功",
                  position: "bottom"
                });
                self.configClickShowTrue = true;
                // sessionStorage.removeItem("noticeTitle");
                // sessionStorage.removeItem("noticeAuthor");
                // sessionStorage.removeItem("noticeContent");
                // sessionStorage.removeItem("noticeDang");
                sessionStorage.removeItem("noticeDangState");
                sessionStorage.removeItem("noticeUserInfo");
                self.$router.go(-1);
              } else {
                Toast({
                  message: data.statusMessage,
                  position: "bottom"
                });
              }
            })
            .catch(msg => {
              self.canSend = false;
              self.isAddShowTost = false;
              Toast({
                message: "服务器异常",
                position: "bottom"
              });
            });
        }
      }
    },
    ...mapActions(["getNoticeinsertNotice"])
  },
  created: function() {
    var self = this;
    if (sessionStorage.getItem("noticeUserId")) {
      self.userId = sessionStorage.getItem("noticeUserId");
    }
    if (sessionStorage.getItem("noticeTitle")) {
      self.titleVal = sessionStorage.getItem("noticeTitle");
    }
    if (sessionStorage.getItem("noticeAuthor")) {
      self.authorVal = sessionStorage.getItem("noticeAuthor");
    }
    if (sessionStorage.getItem("noticeContent")) {
      self.contentVal = sessionStorage.getItem("noticeContent");
    }
    if (sessionStorage.getItem("noticeDang")) {
      self.dangState = sessionStorage.getItem("noticeDang");
    }
    if (sessionStorage.getItem("noticeImgSrc")) {
      self.imgSrc = sessionStorage.getItem("noticeImgSrc");
    }
    if (sessionStorage.getItem("noticeCover")) {
      self.cover = sessionStorage.getItem("noticeCover");
    }
    if (sessionStorage.getItem("noticeUserInfo")) {
      self.userInfo = sessionStorage.getItem("noticeUserInfo");
    }
    if (sessionStorage.getItem("noticeSendTo")) {
      self.sendTo = sessionStorage.getItem("noticeSendTo");
    }
    if (sessionStorage.getItem("noticeDangState")) {
      self.dangStateVal = sessionStorage.getItem("noticeDangState");
    }

    document.title = "发公告";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setTitle("发公告");
      }
    } else {
      var setNav = {
        methodName: "invokeNavigationRightItemFromJS",
        params: {
          naviType: 0,
          titles: [{ name: "", code: "shai" }]
        }
      };
      if (window.webkit) {
        window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
          setNav
        );
      }
    }
  },
  //跳转拦截
  beforeRouteLeave(to, from, next) {
    var self = this;
    if (self.configClickShowTrue == true) {
      next();
    } else if (to.path == "/writeSecondAnnouncement") {
      self.cancelUpdateShow = false;
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
    //选择联系人
    window.addListsClick = function() {
      if (isAndroid) {
        if (window.BenchJSInterface) {
          if (self.sendList.length > 0) {
            window.BenchJSInterface.setBtnOnClickEvent(
              102,
              "javascript:window.updateListAndroidFun(->path<-);",
              JSON.stringify(self.sendList)
            );
          } else {
            window.BenchJSInterface.setBtnOnClickEvent(
              102,
              "javascript:window.updateListAndroidFun(->path<-);"
            );
          }
        }
      } else {
        var messgaeObj = {};
        if (self.sendList.length > 0) {
          messgaeObj = {
            methodName: "BotongApplicationCenterDeptJSHandler",
            params: {
              limitCount: 0,
              deptInfo: JSON.stringify(self.sendDeptInfo)
              // deptId: self.sendList[0].deptId, // 部门id
              // deptName: self.sendList[0].deptName // 部门名称
            },
            callbackMethod: "updateListIosFun"
          };
        } else {
          messgaeObj = {
            methodName: "BotongApplicationCenterDeptJSHandler",
            params: {
              limitCount: 0,
              deptInfo: ""
              // deptId: "", // 部门id
              // deptName: "" // 部门名称
            },
            callbackMethod: "updateListIosFun"
          };
        }
        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterDeptJSHandler.postMessage(
            messgaeObj
          );
        }
      }
    };
    //可读人员安卓选中结果
    window.updateListAndroidFun = function(val) {
      var arrList = JSON.parse(JSON.stringify(val));
      self.sendList = [];
      self.sendList = arrList;
      var arr = [];
      self.sendList.forEach(function(ele, ind) {
        arr.push(ele.deptId);
      });
      self.userInfo = arr.toString();
      // self.userInfo = self.sendList[0].deptId;
      self.sendTo =
        "发送部门：" +
        self.sendList[0].deptName +
        "等" +
        self.sendList.length +
        "个部门";
      self.ischeckedPeople = true;
    };
    // 可读人员ios选中结果
    window.updateListIosFun = function(val) {
      var arrList = JSON.parse(JSON.stringify(val.deptInfo));
      // var deptObj={}
      self.sendDeptInfo = JSON.parse(JSON.stringify(val));

      self.sendList = [];
      self.sendList = arrList;

      var arr = [];
      self.sendList.forEach(function(ele, ind) {
        arr.push(ele.deptId);
      });
      // self.userInfo = self.sendList[0].deptId;
      self.userInfo = arr.toString();
      self.sendTo =
        "发送部门：" +
        self.sendList[0].name +
        "等" +
        self.sendList.length +
        "个部门";
      self.ischeckedPeople = true;
    };
    //获取图片
    window.updateFileClick = function() {
      if (isAndroid) {
        if (window.BenchJSInterface) {
          window.BenchJSInterface.setBtnOnClickEvent(
            "100",
            "javascript:window.updateImgAndroidFun(->path<-);"
          );
        }
      } else {
        var messgaeObj = {
          methodName: "invokeCameraFromJS",
          params: {},
          callbackMethod: "updateImgIosFun" //图片选择完成调用的函数
        };
        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterCameraJSHandler.postMessage(
            messgaeObj
          );
        }
      }
    };
    // 获取上传图片ios结果
    window.updateImgIosFun = function(val) {
      var imgList = JSON.parse(JSON.stringify(val));
      self.imgSrc = "";
      self.cover = "";
      self.imgSrc = imgList.smallUrl;
      self.cover = imgList.url;
    };
    // 获取上传图片Andriod结果
    window.updateImgAndroidFun = function(val) {
      var imgObj = JSON.parse(JSON.stringify(val));
      self.imgSrc = imgObj[0].imgPath;
      self.cover = imgObj[0].imgPath;
    };
  },
  watch: {
    titleVal: function(val) {
      this.titleVal = val.replace(/^\s+|\s+$/g, "");
      this.titleVal = val.replace(
        /[\uD83C|\uD83D|\uD83E ][\uDC00-\uDFFF ][\u200D|\uFE0F ]|[\uD83C|\uD83D|\uD83E ][\uDC00-\uDFFF ]|[0-9|*|# ]\uFE0F\u20E3|[0-9|# ]\u20E3|[\u203C-\u3299 ]\uFE0F\u200D|[\u203C-\u3299 ]\uFE0F|[\u2122-\u2B55 ]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi,
        ""
      );

      if (val == "") {
        sessionStorage.removeItem("noticeTitle");
      }
      if (
        val.length > 0 &&
        this.sendTo != "选择发送公告部门" &&
        this.contentVal
      ) {
        this.isSettingNotice = true;
      } else {
        this.isSettingNotice = false;
      }
    },
    authorVal: function(val) {
      this.authorVal = val.replace(/^\s+|\s+$/g, "");
      this.authorVal = val.replace(
        /[\uD83C|\uD83D|\uD83E ][\uDC00-\uDFFF ][\u200D|\uFE0F ]|[\uD83C|\uD83D|\uD83E ][\uDC00-\uDFFF ]|[0-9|*|# ]\uFE0F\u20E3|[0-9|# ]\u20E3|[\u203C-\u3299 ]\uFE0F\u200D|[\u203C-\u3299 ]\uFE0F|[\u2122-\u2B55 ]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi,
        ""
      );
      if (val == "") {
        sessionStorage.removeItem("noticeAuthor");
      }
    },
    sendTo: function(val) {
      if (
        val != "选择发送公告部门" &&
        this.titleVal.length > 0 &&
        this.contentVal
      ) {
        this.isSettingNotice = true;
      } else {
        this.isSettingNotice = false;
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
    }
  }
};
</script>
<style scoped>
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

.writeFirstAnnouncement {
  height: 100vh;
  width: 100%;
}

.announcementLines {
  width: 100%;
  height: 1.1733rem;
  padding-left: 0.4267rem;
  padding-right: 0.4267rem;
  /* border-bottom: 1px solid #e3e3e3; */
  /* border: 1px solid red */
}

.a-line1 :after {
  position: absolute;
  top: 2.2rem;
  right: 0;
  width: calc(100% - 0.4267rem);
  height: 1px;
  background-color: #e3e3e3;
  content: "";
}

.a-line2 :after {
  position: absolute;
  top: 1.1rem;
  right: 0;
  width: calc(100% - 0.4267rem);
  height: 1px;
  background-color: #e3e3e3;
  content: "";
}

.a-line3 :after {
  position: absolute;
  top: 1.1rem;
  right: 0;
  width: calc(100% - 0.4267rem);
  height: 1px;
  background-color: #e3e3e3;
  content: "";
}

.announcementLinesLeft {
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
  line-height: 1.1733rem;
}

.titleContent {
  /* height: 100vh; */
  width: 7.68rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
}

.titleContent::-webkit-input-placeholder {
  /* WebKit browsers */
  font-size: 0.3733rem;
  line-height: 0.6667rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
}

/* .titleContent:-moz-placeholder { */

/* Mozilla Firefox 4 to 18 */

/* font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
} */

/* .titleContent::-moz-placeholder { */

/* Mozilla Firefox 19+ */

/* font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
} */

/* .titleContent:-ms-input-placeholder { */

/* Internet Explorer 10+ */

/* font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
} */

.announcementLineSend {
  width: 100%;
  height: 1.1733rem;
  padding-left: 0.4267rem;
  display: flex;
  justify-content: space-between;
  position: relative;
}

.announcementChooseTextRifght {
  display: flex;
  justify-content: space-between;
  width: 6rem;
  margin-right: 0.4rem;
}

.announcementChooseText {
  font-size: 0.35rem;
  color: rgba(192, 192, 192, 1);
  text-align: right;
  margin-right: 0.2rem;
  width: 5.5rem;
  overflow: hidden;
  line-height: 1.223rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chooseImg {
  /* line-height: 1.225rem; */
  display: flex;
  align-items: center;
}

.announcementSendTo {
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
  line-height: 1.1733rem;
}

.announcementDang {
  width: 100%;
  height: 1.1733rem;
  padding-left: 0.4267rem;
  padding-right: 0.4267rem;
  display: flex;
  justify-content: space-between;
}

.announcementChoose {
  /* font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1); */
  /* line-height: 1.1733rem; */
  display: flex;
  align-items: center;
}

.switchOn {
  width: 1.2267rem;
  height: 0.7467rem;
  border: 1px solid red;
  margin-top: 0.2133rem;
}

.switchOff {
  width: 1.2267rem;
  height: 0.7467rem;
  border: 1px solid blue;
  margin-top: 0.2133rem;
}

.blank1 {
  width: 100%;
  height: 0.3rem;
  background-color: #e3e3e3;
}

.uploadImage {
  width: 100%;
  height: 2.9867rem;
  padding-left: 0.4267rem;
}

.uploadText {
  height: 1.0133rem;
  line-height: 1.0133rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
}

.cameraImg {
  width: 1.6533rem;
  height: 1.6533rem;
  position: relative;
}

.uploadImg {
  width: 1.55rem;
  height: 1.55rem;
  position: relative;
  /* border: 1px dashed #848484; */
  /* border:1px solid red; */
}

.uploadPicture {
  width: 1.55rem;
  height: 1.55rem;
}

.deleteImg {
  width: 0.4267rem;
  height: 0.4267rem;
  position: absolute;
  /* background:rgba(132,132,132,1); */
  left: 1.225rem;
  bottom: 1.225rem;
}

.deleteImage {
  width: 0.4267rem;
  height: 0.4267rem;
}

.enterContent {
  /* margin-top: 0.32rem; */
  width: 100%;
  height: 7.44rem;
}

.enterContentSpan {
  padding-left: 0.4267rem;
  padding-top: 0.4267rem;
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(192, 192, 192, 1);
}

/* 发布成功ios */

.iosSend {
  width: 3.2rem;
  height: 3.2rem;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 0.1067rem;
  position: absolute;
  top: 5.3333rem;
  left: 50%;
  margin-left: -1.6rem;
}

.iosSendImg {
  width: 1.3333rem;
  height: 0.96rem;
  border: 1px solid red;
  position: absolute;
  top: 0.6933rem;
  left: 50%;
  margin-left: -0.6667rem;
}

.iosText {
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  position: absolute;
  left: 50%;
  margin-left: -0.6667rem;
  top: 2.1333rem;
}

/* 发布成功安卓 */

.androidSend {
  width: 2.4rem;
  height: 1.0667rem;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 0.1067rem;
  position: absolute;
  top: 13.2533rem;
  left: 50%;
  margin-left: -1.2rem;
}

.androidText {
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -0.7467rem;
  margin-top: -0.25rem;
}

.sendNotice {
  width: 100%;
  height: 1.2rem;
  position: fixed;
  bottom: 0;
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
}

.sendNoticeTextT {
  font-size: 0.48rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  line-height: 1.28rem;
  position: absolute;
  left: 50%;
  margin-left: -0.5rem;
  opacity: 0.4;
}

.sendNoticeTextF {
  opacity: 1 !important;
}

.contentVal {
  width: 100%;
  margin-bottom: 70px;
  padding: 0.4267rem;
  line-height: 0.7267rem;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  word-wrap: break-word;
}

/* 询问框 */

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
</style>