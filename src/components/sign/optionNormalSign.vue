<!--日常签到-发送签到-->
<template>
  <div class="optionSign">
    <div class="main">
      <div>
        <div>签到时间：</div>
        <div>{{signTime | timeFun}}</div>
      </div>
      <div>
        <div>签到地点：</div>
        <div>{{signAddress}}{{signDetailAddress}}</div>
      </div>
    </div>
    <div class="content">
      <div>
        <textarea v-model.trim="remarkVal" maxlength="200" placeholder="请填写备注"></textarea>
      </div>
      <!-- <div class="contentImg">
        <ul>
          <li class="lastLi lastImgLi" v-for="(item,index) in imgLists" :key="index">
            <img :src="item.img" alt="">
            <div class="writeImgBotImgLiDelect" @click="delectImgClick(index)">
              <img src="/static/img/叉.png" alt="">
            </div>
          </li>
          <li v-show="imgLists.length < 5" class="lastLi" onclick="updateFileClick()">
            <img src="/static/img/上传图片.png" alt="">
          </li>
        </ul>
      </div> -->
      <div>
        <div>当前企业：</div>
        <div>{{currentCompany}}</div>
      </div>
    </div>
    <div class="button">
      <div @click="signClick">
        <div>提交</div>
      </div>
    </div>
    <!-- 签到成功弹框 -->
    <div class="signPopup" v-show="isShowSign">
      <transition name="slide-fade" mode="out-in">
        <div class="signContent" v-show="isShowSignContent">
          <div>
            <div>
              <img src="/static/img/签到成功.png" alt="">
            </div>
            <div>签到成功</div>
          </div>
          <div>
            <div>
              <div>时间</div>
              <div>{{signSuccessTime | timeFuns}}</div>
            </div>
            <div>快乐工作，从守时开始</div>
          </div>
          <div>
            <div @click="closeSignClick">我知道了</div>
          </div>
        </div>
      </transition>
    </div>
    <!-- 签到失败弹框 -->
    <div class="signPopup" v-show="isShowNoSign">
      <transition name="slide-fade" mode="out-in">
        <div class="signNoContent" v-show="isShowNoSignContent">
          <div>
            <div>
              <img src="/static/img/签到失败.png" alt="">
            </div>
            <div>签到失败</div>
          </div>
          <div>
            <div>{{signFailed}}</div>
          </div>
          <div>
            <div id="Iknow" @click="closeNoSignClick">我知道了</div>
          </div>
        </div>
      </transition>
    </div>
    <div v-show="isAddShowTost" class="AddShowTost">
      <mt-spinner type="snake" color="#4390E1"></mt-spinner>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      isAddShowTost: false,
      imgLists: [],
      remarkVal: "", //备注
      isShowSign: false,
      isShowSignContent: false,
      isShowNoSign: false,
      isShowNoSignContent: false,
      signTime: "",
      signSuccessTime: "",
      signFailed: "",
      userIdVal: "",
      orgIdVal: "",
      lngVal: "",
      latVal: "",
      signAddress: "", //地址头
      imgUrlsVal: [],
      signDetailAddress: "", // 详细地址
      signClickTrueOrFalse: true,
      uploading: true
    };
  },
  components: {},
  created: function() {
    var self = this;
    self.signTime = sessionStorage.getItem("currentTime");
    if (sessionStorage.getItem("siteaddress")) {
      self.signAddress = sessionStorage.getItem("siteaddress");
    } else {
      self.signAddress = sessionStorage.getItem("address");
    }
    if (sessionStorage.getItem("sitename")) {
      self.signDetailAddress = sessionStorage.getItem("sitename");
    } else {
      self.signDetailAddress = sessionStorage.getItem("detailAddress");
    }
    if (
      sessionStorage.getItem("normalSignO") &&
      sessionStorage.getItem("normalSignP")
    ) {
      self.lngVal = sessionStorage.getItem("normalSignO");
      self.latVal = sessionStorage.getItem("normalSignP");
    }
    self.currentCompany = sessionStorage.getItem("currentCompany");
    document.title = "签到";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setTitle("签到");
        window.BenchJSInterface.setRightBtn(" ", " ");
        window.BenchJSInterface.setRightTwoBut(" ", " ");
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
  mounted: function() {
    var self = this;
    // 上传图片
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    window.updateFileClick = function() {
      if (isAndroid) {
        if (window.BenchJSInterface) {
          window.BenchJSInterface.setBtnOnClickEvent(
            "99",
            "javascript:window.updateAnImgFun(->path<-);"
          );
        }
      } else {
        var messgaeObjImg = {
          methodName: "invokeCameraFromJS",
          params: { sign: 1 },
          callbackMethod: "updateIosImgFun"
        };
        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterCameraJSHandler.postMessage(
            messgaeObjImg
          );
        }
      }
    };
    // 获取上传安卓图片结果
    window.updateAnImgFun = function(val) {
      var imgPathObj = JSON.parse(JSON.stringify(val));
      imgPathObj.forEach(function(ele) {
        self.imgLists.push({ img: ele.imgPath });
      });
    };
    // 获取上传ios图片结果
    window.updateIosImgFun = function(val) {
      var imgList = JSON.parse(JSON.stringify(val));
      self.imgLists.push({ img: imgList.url });
    };
  },
  watch: {
    remarkVal(val) {
      var self = this;
      if (val.length > 0) {
        // self.remarkVal = val.replace(/^\s+|\s+$/g, "");
        if (val.length <= 2000) {
        } else {
          self.remarkVal = val.slice(0, 2000);
        }
      }
    }
  },
  filters: {
    // 过滤时间
    timeFun: function(val) {
      if (val) {
        var standardTime = new Date(val);
        var h, f, m;
        h = standardTime.getHours();
        h = h > 9 ? h : "0" + h;
        f = standardTime.getMinutes();
        f = f > 9 ? f : "0" + f;
        m = standardTime.getSeconds();
        m = m > 9 ? m : "0" + m;
        return h + ":" + f;
      } else {
        return "暂无";
      }
    },
    // 过滤时间
    timeFuns: function(val) {
      if (val) {
        val = Number(val);
        var standardTime = new Date(val);
        var h, f, m;
        h = standardTime.getHours();
        h = h > 9 ? h : "0" + h;
        f = standardTime.getMinutes();
        f = f > 9 ? f : "0" + f;
        m = standardTime.getSeconds();
        m = m > 9 ? m : "0" + m;
        return h + ":" + f;
      } else {
        return "暂无";
      }
    }
  },
  methods: {
    // 删除图片
    delectImgClick(index) {
      var self = this;
      self.imgLists.splice(index, 1);
    },
    upLoadClick() {},
    // 签到
    signClick() {
      var self = this;
      // if (self.imgLists.length > 0) {
      // self.imgUrlsVal = [];
      // self.imgLists.forEach(function(ele, ind) {
      //   self.imgUrlsVal.push(ele.img);
      // });
      var obj = {
        userId: sessionStorage.getItem("singMemberId"),
        orgId: sessionStorage.getItem("singOrgId"),
        lng: self.lngVal, // 经度
        lat: self.latVal, // 维度
        addressTitle: self.signAddress, //地址头
        // imgUrls: self.imgUrlsVal.join(","), //签到图片，号间隔
        address: self.signDetailAddress // 详细地址
      };
      if (self.remarkVal.length > 0) {
        obj.remark = self.remarkVal; // 备注
      }
      var object = JSON.stringify(obj);
      if (self.signClickTrueOrFalse == true) {
        self.signClickTrueOrFalse = false;
        self.isAddShowTost = true;
        self
          .getSignApiSignToSign(object)
          .then(data => {
            self.isAddShowTost = false;
            self.signClickTrueOrFalse = true;
            if (data.statusCode == 200) {
              self.isShowSign = true;
              self.isShowSignContent = true;
              self.signSuccessTime = data.data.signDate;
            } else {
              self.isShowNoSign = true;
              self.isShowNoSignContent = true;
              self.signFailed = data.statusMessage;
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            self.isAddShowTost = false;
            self.signClickTrueOrFalse = true;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
      // if (sessionStorage.getItem("siteaddress")) {
      // } else {
      //   Toast({
      //     message: "地址错误",
      //     position: "bottom"
      //   });
      // }
    },
    // 关闭签到失败弹框
    closeNoSignClick() {
      var self = this;
      self.isShowNoSign = false;
      self.isShowNoSignContent = false;
    },
    // 关闭签到成功弹框
    closeSignClick() {
      var self = this;
      self.isShowSign = false;
      self.isShowSignContent = false;
      self.$router.go(-1);
    },
    ...mapActions(["getSignApiSignToSign"])
  }
};
</script>
<style scoped>
/* 新增加载框 */
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

.optionSign {
  height: 100vh;
  width: 100%;
  background: rgba(247, 247, 247, 1);
  overflow: hidden;
}

.main {
  margin-top: 0.32rem;
  background: rgba(255, 255, 255, 1);
  min-height: 1.7067rem;
  padding-top: 0.4rem;
  padding-bottom: 0.32rem;
  user-select: none;
}

.main > div {
  display: flex;
  padding-left: 0.4267rem;
}

.main > div > div:nth-child(1) {
  /* width:1.6rem; */
  height: 0.42rem;
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  line-height: 0.42rem;
  color: rgba(132, 132, 132, 1);
}

.main > div > div:nth-child(2) {
  width: 6.7rem;
  height: 0.42rem;
  font-size: 0.3733rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.42rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main > div:nth-child(1) {
  margin-bottom: 0.2667rem;
}

.content > div:nth-child(1) {
  padding-left: 0.4267rem;
}

.content textarea {
  width: 9.1467rem;
  height: 4.4267rem;
  font-size: 0.3733rem;
  border: none;
  resize: none;
}

.content {
  margin-top: 0.32rem;
  background: rgba(255, 255, 255, 1);
  min-height: 5.6533rem;
  padding-top: 0.4rem;
  padding-bottom: 0.32rem;
  margin-top: 0.32rem;
  background: rgba(255, 255, 255, 1);
  min-height: 5.6533rem;
  padding-top: 0.4rem;
  padding-bottom: 0.32rem;
}

.contentImg ul {
  display: flex;
}
.writeImgBotImgLiDelect {
  position: absolute;
  width: 0.4267rem;
  height: 0.4267rem;
  top: -0.16rem;
  right: -0.16rem;
}
.writeImgBotImgLiDelect img {
  width: 100%;
  height: 100%;
}
.lastLi {
  width: 1.6rem;
  height: 1.6rem;
  position: relative;
  margin-left: 0.3133rem;
}
/* .lastImgLi {
  border: 1px dashed #ccc;
} */
.lastLi img {
  width: 100%;
  height: 100%;
}

.content ul li:nth-child(1) {
  margin-left: 0.4267rem;
}

.content span img {
  position: absolute;
  right: -0.16rem;
  top: -0.16rem;
  width: 0.32rem;
  height: 0.32rem;
}

.content > div:nth-child(2) {
  margin-top: 0.3467rem;
  display: flex;
  padding-left: 0.4267rem;
}

.content > div:nth-child(2) > div:nth-child(1) {
  min-width: 1.6rem;
  height: 0.42rem;
  font-size: 0.32rem;
  color: rgba(132, 132, 132, 1);
  line-height: 0.42rem;
}

.content > div:nth-child(2) > div:nth-child(2) {
  width: 7rem;
  height: 0.42rem;
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
  line-height: 0.42rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.button {
  margin-top: 0.96rem;
  padding-left: 0.96rem;
  user-select: none;
}

.button > div {
  text-align: center;
  width: 8.08rem;
  height: 1.1733rem;
  line-height: 1.1733rem;
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
  border-radius: 2px;
}

.button > div > div {
  font-size: 0.48rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
}

/* 签到成功弹框 */

.signPopup {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.signContent > div:nth-child(1) > div:nth-child(1) {
  width: 0.6933rem;
  height: 0.8267rem;
  margin-right: 0.32rem;
}

.signContent > div:nth-child(1) > div:nth-child(1) img {
  /* width: 0.6933rem; */
  height: 0.8rem;
}

.signContent > div:nth-child(1) > div:nth-child(2) {
  min-width: 3.2rem;
  height: 0.8rem;
  font-size: 0.8rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  line-height: 0.8rem;
}

.signContent > div:nth-child(1) {
  display: flex;
  margin-top: 1.3333rem;
  margin-left: 1.12rem;
}

.signContent > div:nth-child(2) > div:nth-child(1) {
  width: 3.68rem;
  height: 1.4933rem;
  background: rgba(255, 255, 255, 1);
  margin-left: 1.5467rem;
  display: flex;
}

.signContent > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) {
  width: 0.3733rem;
  height: 1.0667rem;
  font-size: 0.3733rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.5333rem;
  margin-left: 0.2667rem;
  margin-right: 0.2933rem;
  margin-top: 0.2133rem;
}

.signContent > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) {
  width: 2.1333rem;
  height: 1.12rem;
  font-size: 0.8rem;

  color: rgba(132, 132, 132, 1);
  line-height: 1.12rem;
  margin-top: 0.2133rem;
}

.signContent > div:nth-child(2) {
  margin-top: 1.52rem;
}

.signContent > div:nth-child(2) > div:nth-child(2) {
  min-width: 4.2667rem;
  height: 0.4267rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  line-height: 0.4267rem;
  text-align: center;
  margin-top: 0.64rem;
  text-align: center;
}

.signContent > div:nth-child(3) > div:nth-child(1) {
  min-width: 1.7067rem;
  height: 0.4267rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  line-height: 0.4267rem;
  margin-left: 2.5333rem;
}

.signContent > div:nth-child(3) {
  margin-top: 1.3067rem;
  padding-top: 0.3467rem;
  border-top: 1px solid rgba(255, 255, 255, 1);
}

.signContent {
  width: 6.7733rem;
  height: 8.6933rem;
  background: rgba(67, 144, 225, 1);
}

.signNoContent > div:nth-child(1) > div:nth-child(1) {
  width: 0.8533rem;
  height: 0.8533rem;
  margin-right: 0.24rem;
}

.signNoContent > div:nth-child(1) > div:nth-child(1) img {
  width: 0.8533rem;
  height: 0.8533rem;
}

.signNoContent > div:nth-child(1) > div:nth-child(2) {
  min-width: 3.2rem;
  height: 0.8rem;
  font-size: 0.8rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  line-height: 0.8rem;
}

.signNoContent > div:nth-child(1) {
  display: flex;
  margin-top: 1.3333rem;
  margin-left: 1.04rem;
}

.signNoContent > div:nth-child(2) {
  height: 5.3867rem;
  /* border: 1px solid red; */
  padding-top: 1.9733rem;
  /* padding-left: 1.4667rem; */
}

.signNoContent > div:nth-child(2) > div:nth-child(1) {
  /* min-width: 3.84rem; */
  height: 0.4267rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  line-height: 0.4267rem;
  text-align: center;
}

.signNoContent > div:nth-child(3) > div:nth-child(1) {
  min-width: 1.7067rem;
  height: 0.4267rem;
  font-size: 0.4267rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
  line-height: 0.4267rem;
  margin-left: 2.5333rem;
}

.signNoContent > div:nth-child(3) {
  /* margin-top: 49px; */
  padding-top: 0.3467rem;
  border-top: 1px solid rgba(255, 255, 255, 1);
}

.signNoContent {
  width: 6.7733rem;
  height: 8.6933rem;
  background: rgba(67, 144, 225, 1);
}

.slide-fade-enter-active {
  transition: all 0.7s ease;
}

.slide-fade-enter,
.slide-fade-leave-active {
  transform: translateY(-0.8rem);
  opacity: 0;
  width: 8.08rem;
  height: 1.1733rem;
  line-height: 1.1733rem;
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
  border-radius: 2px;
}

.button > div > div {
  font-size: 0.48rem;
  font-family: PingFangSC-Regular;
  color: rgba(255, 255, 255, 1);
}
</style>