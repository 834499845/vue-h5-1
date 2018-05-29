// 写日志
<template>
  <div class="writeLog">
    <div class="writeList">
      <div class="writeList-left">
        <!--  v-show="leftOBj.oneTrue" -->
        <small>*</small>{{leftOBj.one}}
      </div>
      <div class="writeList-right">
        <pre><br>{{presentVal}}</pre>
        <textarea placeholder="请输入" v-model.trim="presentVal"></textarea>
      </div>
    </div>
    <div class="writeList">
      <div class="writeList-left">
        <!--  v-show="leftOBj.twoTrue" -->
        <small>*</small>{{leftOBj.two}}
      </div>
      <div class="writeList-right">
        <pre><br>{{futureVal}}</pre>
        <textarea placeholder="请输入" v-model.trim="futureVal"></textarea>
      </div>
    </div>
    <div class="writeList">
      <div class="writeList-left">
        <!--  v-show="leftOBj.threeTrue" -->
        <small>*</small>{{leftOBj.three}}
      </div>
      <div class="writeList-right">
        <pre><br>{{collaborateVal}}</pre>
        <textarea placeholder="请输入" v-model.trim="collaborateVal"></textarea>
      </div>
    </div>
    <div class="writeList">
      <div class="writeList-left">
        <!--  v-show="leftOBj.fourTrue" -->
        <small></small>{{leftOBj.four}}
      </div>
      <div class="writeList-right">
        <pre><br>{{summaryVal}}</pre>
        <textarea placeholder="请输入" v-model.trim="summaryVal"></textarea>
      </div>
    </div>
    <div class="writeList">
      <div class="writeList-left">
        <small></small>备注
      </div>
      <div class="writeList-right">
        <pre><br>{{remarkVal}}</pre>
        <textarea placeholder="请输入" v-model.trim="remarkVal"></textarea>
      </div>
    </div>
    <div class="writeImg">
      <div class="writeImgTop">
        <div class="writeImgT-left">
          图片
        </div>
        <div class="writeImgT-right" onclick="updateFileClick()" v-show="imgLists.length < 5">
          <img src="/static/img/图片@3x.png" alt="">
        </div>
      </div>
      <div class="writeImgBot" v-show="imgLists.length != 0">
        <ul>
          <li class="writeImgBotImgLi writeImgBotLi" v-for="(item,index) in imgLists" :key="index">
            <img :src="item.img" alt="">
            <div class="writeImgBotImgLiDelect" @click="delectImgClick(index)">
              <img src="/static/img/取消@3x.png" alt="">
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="writeObjList">
      <div class="writeObjListTop">
        发给谁
        <small>(点击头像可以删除)</small>
      </div>
      <div class="writeObjListbot">
        <ul>
          <li class="writeObjListbotLi" v-for="(item,index) in objLists" :key="index">
            <div class="writeObjListbotLiTop writeObjListbotLiTopObj" @click="deleteImgClick(index)">
              <img v-show="item.profile" :src="item.profile" alt="">
              <div v-show="!item.profile">{{item.name | userNickFun}}</div>
            </div>
            <div class="writeObjListbotLiBot">
              {{item.name}}
            </div>
          </li>
          <li class="writeObjListbotLi" v-show="objLists.length < 20" onclick="addListsClick()">
            <div class="writeObjListbotLiTop">
              <img src="/static/img/添加人@3x.png" alt="">
            </div>
            <div class="writeObjListbotLiBot">
              添加
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div :class="{'writeBut':true,'writeBut-Select':isWriteBut}" @click="confirmClick">
      提交
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
        sendUserLists: [], // 默认发送人
        isAddShowTost: false,
        modelValVal: "",
        approverList: [], // 选中人员列表
        leftOBj: {}, // 列表对象
        presentVal: "", // 第一个输入框值
        ispresentHeight: "84px", // 第一个输入框高度变更

        futureVal: "", // 第2个输入框值
        isfutureHeight: "84px", // 第2个输入框高度变更

        collaborateVal: "", // 第3个输入框值
        iscollaborateHeight: "84px", // 第3个输入框高度变更

        summaryVal: "", // 第4个输入框值
        issummaryHeight: "84px", // 第4个输入框高度变更

        remarkVal: "", // 第5个输入框值
        isremarkHeight: "84px", // 第5个输入框高度变更

        isWriteBut: false, // 提交按钮变更
        objLists: [], // 发送人列表
        imgLists: [] // 图片列表
      };
    },
    components: {},
    mounted() {
      var self = this;
      document.title = "写日志";
      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isAndroid) {
        if (window.BenchJSInterface) {
          window.BenchJSInterface.setRightBtn("", "");
          window.BenchJSInterface.setTitle("写日志");
          window.BenchJSInterface.setTopBarColor(1);
        }
      } else {
        var setNav = {
          methodName: "invokeNavigationRightItemFromJS",
          params: {
            titles: [{ name: "", code: "" }]
          }
        };
        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
            setNav
          );
        }
      }
      // 上传图片
      window.updateFileClick = function () {
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
      window.updateAnImgFun = function (val) {
        var imgPathObj = JSON.parse(JSON.stringify(val));
        imgPathObj.forEach(function (ele) {
          self.imgLists.push({ img: ele.imgPath });
        });
      };
      // 获取上传图片结果
      window.updateIosImgFun = function (val) {
        var imgList = JSON.parse(JSON.stringify(val));
        self.imgLists.push({ img: imgList.url });
      };
      // 选择人员
      window.addListsClick = function () {
        if (isAndroid) {
          if (window.BenchJSInterface) {
            if (self.objLists.length > 0) {
              window.BenchJSInterface.setLargeMaxMembers(
                "101",
                "javascript:window.updateAnListFun(->path<-);",
                JSON.stringify(self.objLists),
                20
              );
            } else {
              window.BenchJSInterface.setLargeMaxMembers(
                "101",
                "javascript:window.updateAnListFun(->path<-);",
                20
              );
            }
          }
        } else {
          var messgaeObj = {};
          if (self.objLists.length > 0) {
            var selectedArr;
            var arrSele = [];
            if (self.objLists.length > 0) {
              self.objLists.forEach(function (ele, ind) {
                arrSele.push(ele.passportId);
              });
              selectedArr = arrSele.join(",");
            }
            messgaeObj = {
              methodName: "BotongApplicationCenterContactsJSHandler",
              params: {
                selected: JSON.stringify(self.objLists), // 已选中
                limitCount: 20 //可选人数 传0为不限制
              },
              callbackMethod: "updateIosListFun"
            };
          } else {
            messgaeObj = {
              methodName: "BotongApplicationCenterContactsJSHandler",
              params: {
                selected: "", // 已选中
                limitCount: 20 //可选人数 传0为不限制
              },
              callbackMethod: "updateIosListFun"
            };
          }

          if (window.webkit) {
            window.webkit.messageHandlers.BotongApplicationCenterContactsJSHandler.postMessage(
              messgaeObj
            );
          }
        }
      };
      // 选中结果安卓
      window.updateAnListFun = function (val) {
        var arrList = JSON.parse(JSON.stringify(val));
        self.objLists = [];
        self.objLists = arrList;
      };
      // 选中结果ios
      window.updateIosListFun = function (val) {
        var arrList = JSON.parse(JSON.stringify(val));
        self.objLists = [];
        self.objLists = arrList;
      };
    },
    methods: {
      // 删除选中人
      deleteImgClick(index) {
        var self = this;
        self.objLists.splice(index, 1);
      },
      // 确认
      confirmClick() {
        var self = this;
        if (self.isWriteBut == true && self.objLists.length > 0) {
          var sendToUserLists = [];
          self.objLists.forEach(function (ele, ind) {
            sendToUserLists.push(ele.memberId);
          });
          var listObj = {
            memberId: sessionStorage.getItem("logMemberId"),
            templateId: self.$route.query.id,
            logValues: [
              {
                filedId: self.leftOBj.oneId,
                value: self.presentVal
              },
              {
                filedId: self.leftOBj.twoId,
                value: self.futureVal
              },
              {
                filedId: self.leftOBj.threeId,
                value: self.collaborateVal
              },
              {
                filedId: self.leftOBj.fourId,
                value: self.summaryVal
              }
            ],
            sendToUser: sendToUserLists,
            remark: self.remarkVal
          };
          if (self.imgLists.length > 0) {
            var imgStr = [];
            self.imgLists.forEach(function (ele, ind) {
              imgStr.push(ele.img);
            });
            listObj["images"] = imgStr;
          }
          self.isAddShowTost = true;
          self
            .getloglogadd(JSON.stringify(listObj))
            .then(data => {
              self.isAddShowTost = false;
              if (data.statusCode == 200) {
                this.$router.go(-1);
                sessionStorage.setItem("sendLogIndex", "101");
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
          if (this.presentVal.length == 0) {
            Toast({
              message: "请填写" + self.leftOBj.one,
              position: "bottom"
            });
          } else if (this.futureVal.length == 0) {
            Toast({
              message: "请填写" + self.leftOBj.two,
              position: "bottom"
            });
          } else if (this.collaborateVal.length == 0) {
            Toast({
              message: "请填写" + self.leftOBj.three,
              position: "bottom"
            });
          } else if (this.objLists.length == 0) {
            Toast({
              message: "请选择发送人",
              position: "bottom"
            });
          }
        }
      },
      // 删除图片
      delectImgClick(index) {
        var self = this;
        self.imgLists.splice(index, 1);
      },
      listFun() {
        var self = this;
        self.$store.commit("setMutVuexisLoading", true);
        var listObj = {
          id: self.$route.query.id,
          memberId: sessionStorage.getItem("logMemberId")
        };
        self
          .getlogtemplatequery(listObj)
          .then(data => {
            self.$store.commit("setMutVuexisLoading", false);
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.sendToUser) {
                  self.objLists = data.data.sendToUser;
                  self.objLists.forEach(function (ele, ind) {
                    ele["state"] = 1;
                  });
                }
                if (data.data.items) {
                  var dataOBJ = data.data.items;
                  self.leftOBj = {
                    one: dataOBJ[0].fieldLabel,
                    oneTrue: dataOBJ[0].required,
                    oneId: dataOBJ[0].id,
                    two: dataOBJ[1].fieldLabel,
                    twoTrue: dataOBJ[1].required,
                    twoId: dataOBJ[1].id,
                    three: dataOBJ[2].fieldLabel,
                    threeTrue: dataOBJ[2].required,
                    threeId: dataOBJ[2].id,
                    four: dataOBJ[3].fieldLabel,
                    fourId: dataOBJ[3].id,
                    fourTrue: dataOBJ[3].required
                  };
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
            self.$store.commit("setMutVuexisLoading", false);
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      },
      ...mapActions(["getlogtemplatequery", "getloglogadd"])
    },
    created: function () {
      var self = this;
      self.listFun();
    },
    watch: {
      presentVal(val) {
        var self = this;
        if (val.length > 0) {
          self.presentVal = val.replace(
            /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,
            ""
          );
          if (val.length > 2000) {
            self.presentVal = val.slice(0, 2000);
          }
        }
        if (
          val.length > 0 &&
          self.futureVal.length > 0 &&
          self.collaborateVal.length > 0
        ) {
          self.isWriteBut = true;
        } else {
          self.isWriteBut = false;
        }
      },
      futureVal(val) {
        var self = this;
        if (val.length > 0) {
          self.futureVal = val.replace(
            /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,
            ""
          );
          if (val.length > 2000) {
            self.futureVal = val.slice(0, 2000);
          }
        }
        if (
          val.length > 0 &&
          this.presentVal.length > 0 &&
          this.collaborateVal.length > 0
        ) {
          self.isWriteBut = true;
        } else {
          self.isWriteBut = false;
        }
      },
      collaborateVal(val) {
        var self = this;
        if (val.length > 0) {
          self.collaborateVal = val.replace(
            /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,
            ""
          );
          if (val.length > 2000) {
            self.collaborateVal = val.slice(0, 2000);
          }
        }

        if (
          val.length > 0 &&
          this.presentVal.length > 0 &&
          this.futureVal.length > 0
        ) {
          self.isWriteBut = true;
        } else {
          self.isWriteBut = false;
        }
      },
      summaryVal(val) {
        var self = this;
        if (val.length > 0) {
          self.summaryVal = val.replace(
            /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,
            ""
          );
          if (val.length > 2000) {
            self.summaryVal = val.slice(0, 2000);
          }
        }
      },
      remarkVal(val) {
        var self = this;
        if (val.length > 0) {
          self.remarkVal = val.replace(
            /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,
            ""
          );
          if (val.length > 2000) {
            self.remarkVal = val.slice(0, 2000);
          }
        }
      }
    },
    filters: {
      userNickFun: function (val) {
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
      // 过滤时间
      timeFun: function (val) {
        if (val) {
          var standardTime = new Date(val);
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
    z-index: 100000000000000000;
  }

  /* 新增加载框 */

  .writeBut-Select {
    color: rgba(255, 255, 255, 1) !important;
  }

  .writeBut {
    user-select: none;
    position: fixed;
    z-index: 100000;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.1733rem;
    background: linear-gradient( 151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1));
    font-size: 0.48rem;
    text-align: center;
    line-height: 1.1733rem;
    margin-top: 0.8rem;
    color: rgba(255, 255, 255, 0.4);
  }

  .writeObjListbotLiBot {
    height: 0.4267rem;
    display: block;
    user-select: none;
    font-size: 0.3733rem;
    color: rgba(132, 132, 132, 1);
    line-height: 0.4267rem;
    margin-top: 0.16rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    width: 100%;
  }

  .writeObjListbotLiTopObj div {
    position: absolute;
    top: 0;
    left: 0;
    min-width: 0.96rem;
    height: 0.96rem;
    overflow: hidden;
    border-radius: 0.453rem;
    background-color: #4592e2;
    text-align: center;
    line-height: 1rem;
    color: #fff;
    font-size: 0.3733rem;
  }

  .writeObjListbotLiTopObj {
    position: relative;
    min-width: 0.96rem;
    height: 0.96rem;
    border-radius: 50%;
  }

  .writeObjListbotLiTopObj img {
    min-width: 0.96rem;
    height: 0.96rem;
    border-radius: 50%;
  }

  .writeObjListbotLiTop {
    width: 0.96rem;
    height: 0.96rem;
    border-radius: 50%;
    border: 1px solid #f7f7f7;
    user-select: none;
  }

  .writeObjListbotLiTop img {
    width: 0.96rem;
    height: 0.96rem;
  }

  .writeObjListbotLi {
    width: 20%;
    height: 1.76rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0.3733rem;
    overflow: hidden;
  }

  .writeObjListbot ul {
    display: flex;
    flex-wrap: wrap;
  }

  .writeObjList {
    min-height: 3.2rem;
    background-color: #fff;
    margin-top: 0.32rem;
    overflow: hidden;
    margin-bottom: 1.76rem;
  }

  .writeObjListTop {
    height: 1.1733rem;
    padding-left: 0.4267rem;
    width: 100%;
    font-size: 0.4267rem;
    color: rgba(43, 43, 43, 1);
    line-height: 1.1733rem;
    user-select: none;
  }

  .writeObjListTop small {
    font-size: 0.3733rem;
    color: rgba(132, 132, 132, 1);
    margin-left: 0.1067rem;
  }

  .writeImgBot ul {
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 0.2rem;
  }

  .writeImgBotLi:nth-child(1) {
    margin-left: 0.4267rem;
  }

  .writeImgBotLi {
    width: 1.6533rem;
    height: 1.6533rem;
    margin-left: 0.2133rem;
    position: relative;
  }

  .writeImgBotImgLiDelect {
    position: absolute;
    width: 0.4267rem;
    height: 0.4267rem;
    top: -0.16rem;
    right: -0.16rem;
    /* border-radius: 0.2133rem; */
    /* background: rgba(132, 132, 132, 1); */
    /* overflow: hidden; */
    /* border: 1px solid red; */
  }

  .writeImgBotImgLi img {
    width: 100%;
    height: 100%;
  }

  .writeImgT-right {
    display: flex;
    justify-content: flex-end;
    width: 5.5333rem;
    height: 0.5333rem;
  }

  .writeImgT-right img {
    width: 0.5333rem;
    height: 0.5333rem;
  }

  .writeImgT-left {
    font-size: 0.4267rem;
    color: rgba(44, 44, 44, 1);
    user-select: none;
  }

  .writeImgTop {
    height: 1.1733rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 0.4267rem;
    padding-right: 0.4267rem;
    width: 100%;
  }

  .writeImg {
    min-height: 1.1733rem;
    background-color: #fff;
    margin-top: 0.32rem;
    overflow: hidden;
  }

  .writeList-left {
    width: 3.9467rem;
    height: 0.5867rem;
    font-size: 0.4267rem;
    color: rgba(44, 44, 44, 1);
    line-height: 0.5867rem;
    margin-top: 0.4267rem;
    text-align: left;
    padding-left: 0.4267rem;
    user-select: none;
  }

  .writeList-left small {
    color: #ea6262;
    margin-right: 0.0533rem;
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
    /* border: 1px solid red; */
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
    word-wrap: break-word;
    text-justify: inter-ideograph;
  }

  .writeList {
    min-height: 2.9867rem;
    background-color: #fff;
    margin-top: 0.32rem;
    display: flex;
  }

  .writeLog {
    overflow: hidden;
    min-height: 100vh;
    width: 100%;
    background-color: rgba(241, 241, 241, 1);
  }
</style>