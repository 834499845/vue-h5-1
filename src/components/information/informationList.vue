// 公司制度
<template>
  <div class="informationList">
    <div class="informationList-nav" v-show="Lists.length > 0">
         <div class="imgList-main" @touchstart="imgtouchStart($event)" @touchmove="imgtouchMove($event)" @touchend="imgtouchEnd($event)"
        :style="{'transform':istranslate3d,'transition':istransition,'webkitTransform':iswebkitTransform,'webkitTransition':iswebkitTransition}">
        <div @click="navListsClick(index)" v-for="(item,index) in imgLists" :key="index" :style="{'position': isAbsolute,'left':index * (item.widths) + 'px'}"
          :class="{'imgList-main-one':true,'selectimgListMainOne':isimgListMainOne == index}">
          {{item.name}}
        </div>
      </div>
    </div>
    <div class="informationList-main">
      <ul>
        <li v-show="enterLists.length > 0" class="ifmt-list-bottom" v-for="(item,index) in enterLists" :key="index" @click="enterListsClick(index)">
          <div class="ifmt-list-bottomLeft">
            <div class="ifmt-list-bottomLeftTop">
              {{item.title}}
            </div>
            <div class="ifmt-list-bottomLeftBottom">
              {{item.createTime | timeFun}}
            </div>
          </div>
          <div v-if="item.pictureUrl" class="ifmt-list-bottomRight">
            <div v-show="item.width < item.height" class="ifmt-list-bottomRightBgW" :style="{'background-image': 'url('+ item.pictureUrl +')'}"></div>
            <div v-show="!item.width < item.height" class="ifmt-list-bottomRightBgH" :style="{'background-image': 'url('+ item.pictureUrl +')'}"></div>
          </div>
          <div v-else class="ifmt-list-bottomRight">
            <img class="ifmt-list-bottomRightImg" src="/static/img/文化.png" alt="">
          </div>
        </li>
        <li v-show="enterLists.length == 0" class="ifmt-listNull">
          <div class="nullContent"></div>
          <img class="nullImg" src="../../../static/img/zixun.png" alt="">
          <div class="nullText">暂无数据</div>
        </li>
      </ul>
    </div>
    <div class="spinnerLoad" v-show="spinnerLoadShow">
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
      pageSizeVal: 100,
      spinnerLoadShow: false, // 加载中
      isimgListMainOne: 0,
      isAbsolute: "absolute", // 滑动内容绝对经纬
      isLeft: "0px", // 定位left
      selectIndex: 1, // 当前的idnex
      allIndex: 0, // 所有idnex
      pockerShowstartY: 0,
      pockerShowEndY: 0,
      pockerShowMoveY: 0,
      isWidth: 0, // 屏幕的宽度
      maxHeight: 0, // 总位移
      temps: 0,
      istranslate3d: "translate3d(0, 0, 0)",
      iswebkitTransform: "translate3d(0, 0, 0)",
      istransition: "transform 0.2s ease-out",
      iswebkitTransition: "transform 0.2s ease-out",
      imgLists: [], // 图片替代数组
      Lists: [], // 图片数据
      enterLists: []
    };
  },
  mounted() {
    var self = this;

    this.isWidth = screen.width / 3;
    this.Lists.forEach(function(ele, ind) {
      self.imgLists.push({ name: ele.name, widths: self.isWidth });
    });
    this.enterLists.forEach(function(ele, ind) {
      var node = document.getElementsByClassName("ifmt-list-bottomLeftTop")[
        ind
      ];

      $clamp(node, { clamp: 2 });
    });
    this.maxHeight = (this.imgLists.length - 3) * self.isWidth;
    this.allIndex = this.imgLists.length;
  },
  components: {},
  methods: {
    // 点击查看详情
    enterListsClick(index) {
      this.$router.push({
        path: "/enterpriseDetails?id=" + this.enterLists[index].id
      });
    },
    // 获取初始数据
    listFun() {
      var self = this;
      var lowrs = "";
      if (sessionStorage.getItem("informationListLowerId")) {
        lowrs = JSON.parse(sessionStorage.getItem("informationListLowerId"));
      }

      if (sessionStorage.getItem("infoisimgListMainOneIndex")) {
        self.isimgListMainOne = sessionStorage.getItem(
          "infoisimgListMainOneIndex"
        );
      }

      var listObj = {};
      if (lowrs.lower) {
        if (lowrs.lower.length > 0) {
          self.Lists = JSON.parse(
            sessionStorage.getItem("informationListLowerId")
          ).lower;
          listObj = {
            userId: sessionStorage.getItem("infoMemberId"),
            orgId: sessionStorage.getItem("infoOrgId"),
            catalogId: self.Lists[self.isimgListMainOne].id,
            pageNo: 1,
            pageSize: self.pageSizeVal
          };
        } else {
          self.Lists = [];
          listObj = {
            userId: sessionStorage.getItem("infoMemberId"),
            orgId: sessionStorage.getItem("infoOrgId"),
            catalogId: lowrs.id,
            pageNo: 1,
            pageSize: self.pageSizeVal
          };
        }
      } else {
        self.Lists = [];
        listObj = {
          userId: sessionStorage.getItem("infoMemberId"),
          orgId: sessionStorage.getItem("infoOrgId"),
          catalogId: lowrs.id,
          pageNo: 1,
          pageSize: self.pageSizeVal
        };
      }
      self.$store.commit("setMutVuexisLoading", true);
      self
        .getapiinfoappselectparentall(listObj)
        .then(data => {
          if (data.statusCode == 200) {
            if (data.data) {
              if (data.data.page) {
                if (data.data.page.records) {
                  var recordsListTrue = [];
                  var recordsList = data.data.page.records;
                  data.data.page.records.forEach(function(ele, ind) {
                    if (ele.pictureUrl) {
                      var img_url =
                        ele.pictureUrl + "?" + Date.parse(new Date());
                      var img = new Image();
                      img.src = img_url;
                      img.onload = function() {
                        var recordsListObj = {
                          width: img.width,
                          height: img.height,
                          createTime: ele.createTime,
                          id: ele.id,
                          pictureUrl: ele.pictureUrl,
                          title: ele.title,
                          createTime: ele.createTime
                        };
                        recordsList.splice(ind, 1, recordsListObj);
                        self.enterLists = recordsList;
                        self.$store.commit("setMutVuexisLoading", false);
                      };
                    } else {
                      recordsListTrue.push(ind);
                    }
                  });
                  if (recordsListTrue.length == data.data.page.records.length) {
                    self.enterLists = data.data.page.records;
                    self.$store.commit("setMutVuexisLoading", false);
                  }
                } else {
                  self.$store.commit("setMutVuexisLoading", false);
                }
              } else {
                self.$store.commit("setMutVuexisLoading", false);
              }
            } else {
              self.$store.commit("setMutVuexisLoading", false);
            }
          } else {
            self.$store.commit("setMutVuexisLoading", false);
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
    // 导航切换
    navListsClick(index) {
      var self = this;
      if (index != sessionStorage.getItem("infoselectAnn")) {
        self.isimgListMainOne = index;
        sessionStorage.setItem("infoselectAnn", self.isimgListMainOne);
        var listObj = {
          userId: sessionStorage.getItem("infoMemberId"),
          orgId: sessionStorage.getItem("infoOrgId"),
          catalogId: self.Lists[index].id,
          pageNo: 1,
          pageSize: self.pageSizeVal
        };
        self.enterLists = [];
        self.spinnerLoadShow = true;
        self
          .getapiinfoappselectparentall(listObj)
          .then(data => {
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data.page) {
                  if (data.data.page.records) {
                    var recordsList = data.data.page.records;
                    var recordsListTrue = [];
                    data.data.page.records.forEach(function(ele, ind) {
                      if (ele.pictureUrl) {
                        var img_url =
                          ele.pictureUrl + "?" + Date.parse(new Date());
                        var img = new Image();
                        img.src = img_url;
                        img.onload = function() {
                          var recordsListObj = {
                            width: img.width,
                            height: img.height,
                            createTime: ele.createTime,
                            id: ele.id,
                            pictureUrl: ele.pictureUrl,
                            title: ele.title,
                            createTime: ele.createTime
                          };
                          recordsList.splice(ind, 1, recordsListObj);
                          self.enterLists = recordsList;
                          self.spinnerLoadShow = false;
                        };
                      } else {
                        recordsListTrue.push(ind);
                      }
                    });
                    if (
                      recordsListTrue.length == data.data.page.records.length
                    ) {
                      self.enterLists = data.data.page.records;
                      self.spinnerLoadShow = false;
                    }
                  } else {
                    self.spinnerLoadShow = false;
                  }
                } else {
                  self.spinnerLoadShow = false;
                }
              } else {
                self.spinnerLoadShow = false;
              }
            } else {
              self.spinnerLoadShow = false;
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            self.spinnerLoadShow = false;
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
      }
    },
    imgtouchStart(event) {
      this.pockerShowstartY = 0;
      this.pockerShowstartY = event.changedTouches[0].pageX;
    },
    imgtouchMove(event) {
      var self = this;
      if (self.imgLists.length > 3) {
        self.pockerShowMoveY = event.changedTouches[0].pageX;
        var moveNum = self.pockerShowstartY - self.pockerShowMoveY;
        if (self.temps == self.maxHeight || self.temps == 0) {
          if (self.temps == 0) {
            self.istranslate3d = "translate3d(-" + moveNum + "px,0, 0)";
            self.iswebkitTransform = "translate3d(-" + moveNum + "px,0, 0)";
          } else {
            self.istranslate3d =
              "translate3d(-" + (self.temps + moveNum) + "px,0, 0)";
            self.iswebkitTransform =
              "translate3d(-" + (self.temps + moveNum) + "px,0, 0)";
          }
        } else {
          if (self.temps == 0 && moveNum < 0) {
            self.istranslate3d =
              "translate3d( " + 1.5 * this.isWidth + "px,0, 0)";
            self.iswebkitTransform =
              "translate3d(" + 1.5 * this.isWidth + "px,0, 0)";
          } else {
            self.istranslate3d =
              "translate3d(-" + (self.temps + moveNum) + "px,0, 0)";
            self.iswebkitTransform =
              "translate3d(-" + (self.temps + moveNum) + "px,0, 0)";
          }
        }
      }
    },
    imgtouchEnd(event) {
      var self = this;
      if (self.imgLists.length > 3) {
        self.pockerShowEndY = 0;
        self.pockerShowEndY = Math.abs(event.changedTouches[0].pageX);
        var tempDis =
          self.temps + (self.pockerShowstartY - self.pockerShowEndY);
        self.temps =
          tempDis < 0 ? 0 : tempDis < self.maxHeight ? tempDis : self.maxHeight;
        var yNumber = self.temps % self.isWidth;
        if (yNumber < self.isWidth / 2) {
          self.temps = self.temps - yNumber;
        } else {
          self.temps = self.temps + (self.isWidth - yNumber);
        }
        self.istranslate3d = "translate3d(-" + self.temps + "px,0, 0)";
        self.iswebkitTransform = "translate3d(-" + self.temps + "px,0, 0)";
      }
    },
    ...mapActions(["getapiinfoappselectparentall", "getsignoutisadmin"])
  },
  created: function() {
    var self = this;
    sessionStorage.removeItem("informationContent");
    sessionStorage.removeItem("informationobjLists");
    sessionStorage.removeItem("informationinfoImg");
    sessionStorage.removeItem("informationTitleVal");


    if (sessionStorage.getItem("infoselectAnn")) {
      self.isimgListMainOne = sessionStorage.getItem("infoselectAnn");
    } else {
      sessionStorage.setItem("infoselectAnn", 0);
    }
    self.listFun();
    document.title = "公司制度";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightImageType(10, "");
        self
          .getsignoutisadmin({
            memberId: sessionStorage.getItem("infoMemberId")
          })
          .then(data => {
            if (data.statusCode == 200) {
              if (data.data) {
                if (data.data == true) {
                  window.BenchJSInterface.setRightBtn(
                    "发资讯",
                    "javascript:window.pathFun();"
                  );
                  window.BenchJSInterface.setTopBarColor(1);
                } else {
                  window.BenchJSInterface.setRightBtn("", "");
                }
              } else {
                window.BenchJSInterface.setRightBtn("", "");
              }
            } else {
              window.BenchJSInterface.setRightBtn("", "");
              Toast({
                message: data.statusMessage,
                position: "bottom"
              });
            }
          })
          .catch(msg => {
            window.BenchJSInterface.setRightBtn("", "");
            Toast({
              message: "服务器异常",
              position: "bottom"
            });
          });
        window.BenchJSInterface.setTitle("公司制度");
      }
    } else {
      self
        .getsignoutisadmin({
          memberId: sessionStorage.getItem("infoMemberId")
        })
        .then(data => {
          if (data.statusCode == 200) {
            if (data.data) {
              if (data.data == true) {
                var setNav = {
                  methodName: "invokeNavigationRightItemFromJS",
                  params: {
                    naviType: 0,
                    titles: [{ name: "发资讯", code: "bianji", notEnable: 0 }]
                  },
                  callbackMethod: "pathFun"
                };
                if (window.webkit) {
                  window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                    setNav
                  );
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
            Toast({
              message: data.statusMessage,
              position: "bottom"
            });
          }
        })
        .catch(msg => {
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
          Toast({
            message: "服务器异常",
            position: "bottom"
          });
        });
    }
    window.pathFun = function(val) {
      var lowrs = JSON.parse(sessionStorage.getItem("informationListLowerId"));
      if (lowrs.lower) {
        if (lowrs.lower.length > 0) {
          var twoLists = lowrs.lower;
          sessionStorage.setItem(
            "infoCatalogId",
            twoLists[self.isimgListMainOne].id
          );
          sessionStorage.setItem(
            "infoisimgListMainOneIndex",
            self.isimgListMainOne
          );
          sessionStorage.setItem("infoOneCatalogId", lowrs.id);
        } else {
          sessionStorage.setItem("infoOneCatalogId", lowrs.id);
        }
      } else {
        sessionStorage.setItem("infoOneCatalogId", lowrs.id);
      }
      self.$router.push({
        path: "/informationNewly"
      });
    };
  },
  watch: {},
  filters: {
    imgFun(val) {
      var self = this;
      // 图片地址 后面加时间戳是为了避免缓存
      if (val) {
        return 1111;
      } else {
        return "/static/img/制度.png";
      }
    },
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
.spinnerLoad {
  width: 100vw;
  height: calc(100vh - 1.12rem);
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 1.12rem;
  left: 0;
  background: rgba(255, 255, 255, 1);
  z-index: 100000000000000000;
}
.ifmt-listNull {
  width: 100%;
  height: 100vh;
  /* line-height: 100vh; */
  /* margin-top: 50px; */
  text-align: center;
  font-size: 0.3733rem;
  color: rgba(132, 132, 132, 1);
}
.nullContent {
  height: 3.65rem;
}
.nullText {
  margin-top: 0.575rem;
  color: #848484;
}
.nullImg {
  width: 2.1rem;
  height: 2.45rem;
}

/* .selectimgListMainOne{
  border-bottom: 0.05rem solid #4390E1
} */
.selectimgListMainOne::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #4390e1;
  content: "";
}
.selectimgListMainOne {
  color: #4390e1 !important;
}
.imgList-main-one {
  position: relative;
  top: 0;
  width: 33%;
  height: 1.1rem;
  line-height: 1.17rem;
  font-size: 0.4rem;
  text-align: center;
  font-size: 0.3733rem;
  color: rgba(44, 44, 44, 1);
}

.imgList-main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.informationList-nav {
  height: 1.12rem;
  width: 100vw;
  position: relative;
  border-bottom: 1px solid rgba(221, 221, 221, 1);
  background-color: #fff;
}

.informationList-main {
  min-height: calc(100vh - 1.12rem);
}
.informationList {
  min-height: 100vh;
  width: 100%;
  background-color: #f1f1f1;
  overflow-x: hidden;
  overflow-y: scroll;
}
.ifmt-list-bottomLeftTop {
  width: 5.28rem;
  height: 1.28rem;
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  line-height: 0.64rem;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ifmt-list-bottomLeftBottom {
  min-width: 1.6rem;
  height: 0.32rem;
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  color: rgba(132, 132, 132, 1);
  line-height: 0.32rem;
  margin-top: 0.64rem;
}

.ifmt-list-bottomLeft {
  max-width: 5.28rem;
  height: 2.24rem;
  margin-left: 0.4267rem;
  margin-top: 0.4267rem;
}

.ifmt-list-bottomRightBgH {
  width: 2.9333rem;
  height: 2.24rem;
  overflow: hidden;
  background-repeat: no-repeat;
  background: center center;
  background-size: auto 2.24rem;
}
.ifmt-list-bottomRightBgW {
  width: 2.9333rem;
  height: 2.24rem;
  overflow: hidden;
  background-repeat: no-repeat;
  background: center center;
  background-size: 2.9333rem auto;
}
.ifmt-list-bottomRight {
  width: 2.9333rem;
  height: 2.24rem;
  overflow: hidden;
  margin-right: 0.4267rem;
  margin-top: 0.4267rem;
}

.ifmt-list-bottomRightImg {
  width: 2.9333rem;
  height: 2.24rem;
}

.ifmt-list-bottom::after {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 1px;
  width: calc(100% - 0.4267rem);
  background-color: #eaeaea;
  content: "";
}
.informationList-main ul li:nth-last-child(2)::after {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 0px !important;
  width: calc(100% - 0.4267rem);
  background-color: transparent !important;
  content: "";
}

.ifmt-list-bottom {
  height: 3.0933rem;
  background-color: #fff;
  width: 100%;
  display: flex;
  justify-content: space-between;
  /* overflow: hidden; */
  position: relative;
}

.ifmt-list {
  margin-top: 0.2133rem;
  height: 3.84rem;
  width: 100%;
  background-color: #fff;
  overflow: hidden;
}

.information {
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: rgba(241, 241, 241, 1);
}
</style>