<template>
  <div class="announcementContentBoxScorll">
    <v-scroll :on-infinite="onInfinite" :loading-text="loadingText">
      <div class="announcementContent" v-for="(item,index) in informations" :key="index" @click="goToDetailsClick(index)">
        <div class="content">
          <div class="contentLeft">
            <div class="leftText ifmt-list-bottomLeftTop">
              {{item.title}}
            </div>
            <div class="leftTime">
              <span class="name">{{item.author|authorFun}}</span>
              <span class="time">{{item.createTime|timeFun}}</span>
            </div>
          </div>
          <div v-if="item.cover" class="ifmt-list-bottomRight" @click="goToDetailsClick(index)">
            <div v-show="item.width < item.height" class="ifmt-list-bottomRightBgW" :style="{'background-image': 'url('+ item.cover +')'}"></div>
            <div v-show="!item.width < item.height" class="ifmt-list-bottomRightBgH" :style="{'background-image': 'url('+ item.cover +')'}"></div>
          </div>
          <div v-else class="ifmt-list-bottomRight" @click="goToDetailsClick(index)">
            <img class="ifmt-list-bottomRightImg" src="/static/notice/Group 2@3x.png" alt="">
          </div>
        </div>
        <div class="borderBottom" v-show="!(index==informations.length-1)"></div>
      </div>
    </v-scroll>
    <div v-show="informations.length == 0" class="acceptAnnouncementBoxNull">
      <div class="nullContent"></div>
      <img class="nullImg" src="../../../static/img/gonggao.png" alt="">
      <div class="nullText">暂无公告</div>
    </div>
    <div class="spinnerLoad" v-show="spinnerLoadShow">
      <mt-spinner type="snake" color="#4390E1"></mt-spinner>
    </div>
  </div>
</template>
<script>
import scroll from "./announcementScroll";
import { mapActions } from "vuex";
export default {
  props: ["isselectAnnouncementNav"],
  components: { "v-scroll": scroll },
  data() {
    return {
      spinnerLoadShow: false, // 加载中
      companyName: "", //企业名称
      loadingText: "",
      pageSizeVal: 20,
      pageNoVal: 1,
      informations: []
    };
  },
  created: function() {
    var self = this;
  },
  mounted: function() {},
  methods: {
    // 上拉加载
    onInfinite(done) {
      var self = this;
      self.loadingText = "加载中...";
      done(3);
      self
        .getNoticeselectNoticePage({
          userId: sessionStorage.getItem("noticeMemberId"),
          state: 1,
          orgId: sessionStorage.getItem("noticeOrgId"),
          pageSize: self.pageSizeVal,
          pageNo: self.pageNoVal
        })
        .then(data => {
          if (data.statusCode == 200) {
            if (data.data) {
              if (data.data.page) {
                if (data.data.page.records) {
                  done(1);
                  self.pageNoVal++;

                  var recordsList = data.data.page.records;
                  var coverTrue = [];
                  data.data.page.records.forEach(function(ele, ind) {
                    if (ele.cover) {
                      var img_url = ele.cover + "?" + Date.parse(new Date());
                      var img = new Image();
                      img.src = img_url;
                      img.onload = function() {
                        var recordsListObj = {
                          width: img.width,
                          height: img.height,
                          readNumber: ele.readNumber,
                          id: ele.id,
                          cover: ele.cover,
                          title: ele.title,
                          author: ele.author,
                          notReadNumber: ele.notReadNumber,
                          createTime: ele.createTime
                        };
                        recordsList.splice(ind, 1, recordsListObj);
                        self.informations = self.informations.concat(
                          recordsList
                        );
                      };
                    } else {
                      coverTrue.push(ind);
                    }
                  });
                  if (coverTrue.length == data.data.page.records.length) {
                    self.spinnerLoadShow = false;
                    self.informations = self.informations.concat(
                      data.data.page.records
                    );
                  }
                } else {
                  done(2);
                  self.loadingText = "暂无更多数据";
                }
              } else {
                done(2);
                self.loadingText = "暂无更多数据";
              }
            } else {
              done(2);
              self.loadingText = "暂无更多数据";
            }
          } else {
            done(2);
            Toast({
              message: data.statusMessage,
              position: "bottom"
            });
          }
        })
        .catch(msg => {
          done(2);
          Toast({
            message: "服务器异常",
            position: "bottom"
          });
        });
    },
    //去详情
    goToDetailsClick(index) {
      var self = this;
      this.$router.push({
        path: "/lookAnnouncement",
        query: {
          noticeId: self.informations[index].id
        }
      });
    },
    // 初始化数据
    listFun() {
      var self = this;
      self.pageNoVal = 1;
      self.spinnerLoadShow = true;
      self
        .getNoticeselectNoticePage({
          userId: sessionStorage.getItem("noticeMemberId"),
          state: 1,
          orgId: sessionStorage.getItem("noticeOrgId"),
          pageSize: self.pageSizeVal,
          pageNo: self.pageNoVal
        })
        .then(data => {
          if (data.statusCode == 200) {
            if (data.data) {
              if (data.data.page) {
                if (data.data.page.records) {
                  self.pageNoVal++;
                  var recordsList = data.data.page.records;
                  var coverTrue = [];
                  data.data.page.records.forEach(function(ele, ind) {
                    if (ele.cover) {
                      var img_url = ele.cover + "?" + Date.parse(new Date());
                      var img = new Image();
                      img.src = img_url;
                      img.onload = function() {
                        var recordsListObj = {
                          width: img.width,
                          height: img.height,
                          readNumber: ele.readNumber,
                          id: ele.id,
                          cover: ele.cover,
                          title: ele.title,
                          author: ele.author,
                          notReadNumber: ele.notReadNumber,
                          createTime: ele.createTime
                        };
                        recordsList.splice(ind, 1, recordsListObj);
                        self.informations = recordsList;
                        self.spinnerLoadShow = false;
                      };
                    } else {
                      coverTrue.push(ind);
                    }
                  });
                  if (coverTrue.length == data.data.page.records.length) {
                    self.spinnerLoadShow = false;
                    self.informations = data.data.page.records;
                  }
                }else {
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
    },
    ...mapActions([
      "getNoticeupdateNotice",
      "getNoticedeleteNotice",
      "getNoticeselectNoticePage",
      "getnoticenoticeauthority"
    ])
  },
  mounted() {
    var self = this;
    self.informations.forEach(function(ele, ind) {
      var node = document.getElementsByClassName("ifmt-list-bottomLeftTop")[
        ind
      ];
      $clamp(node, { clamp: 2 });
    });
  },
  watch: {
    isselectAnnouncementNav: {
      handler(val) {
        var self = this;
        if (val == 1) {
          self.listFun();
          self.$el.querySelector(".yo-scroll").scrollTop = 0;
        }
      },
      deep: true
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
    },
    //图片过滤
    pictureFun: function(val) {
      if (val) {
        return val;
      } else {
        return "/static/notice/Group 2@3x.png";
      }
    },
    //作者过滤
    authorFun: function(val) {
      if (val) {
        return val;
      } else {
        return sessionStorage.getItem("noticeCompanyName");
      }
    }
  }
};
</script>
<style scoped>
.announcementContentBoxScorll {
  width: 100vw;
  position: relative;
  top: 0rem;
  overflow-x: hidden;
  left: 0;
  height: calc(100vh - 1.0667rem);
  background-color: #f1f1f1;
  overflow-y: scroll;
}

.spinnerLoad {
  width: 100vw;
  /* height: calc(100vh - 0.5rem); */
  height: calc(100vh - 1.0667rem);
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 1.0667rem;
  left: 0;
  background: rgba(255, 255, 255, 1);
  z-index: 100000000000000000;
}

.acceptAnnouncementBoxNull {
  height: calc(100vh - 1.0667rem);
  width: 100%;
  text-align: center;
  font-size: 0.3733rem;
  color: #848484;
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

.announcementTop {
  width: 100%;
  height: 1.0667rem;
  display: flex;
  justify-content: space-between;
}

.announcementNav {
  width: 50%;
  font-size: 0.3733rem;
  text-align: center;
  line-height: 1.0667rem;
  font-family: PingFangSC-Regular;
}

.borderShow {
  color: rgba(67, 144, 225, 1);
  border-bottom: 2px solid #4390e1;
}

.announcementContentBox {
  width: 100vw;
  position: absolute;
  top: 1.0667rem;
  left: 0;
  height: calc(100vh - 1.0667rem);
  background-color: #f1f1f1;
  overflow-y: scroll;
}

.announcementContent {
  width: 100%;
  height: 3.0933rem;
  /* height: 7rem; */
  background-color: #ffffff;
  overflow: hidden;
  position: relative;
}

.borderBottom {
  position: absolute;
  bottom: 0;
  right: 0;
  width: calc(100% - 0.4267rem);
  height: 1px;
  background-color: #eaeaea;
}

.content {
  margin-left: 0.4267rem;
  margin-top: 0.4267rem;
  height: 2.24rem;
  width: calc(100vw - 0.8533rem);
  display: flex;
  justify-content: space-between;
}

.contentLeft {
  width: calc(100vw - 0.8533rem - 2.9333rem - 0.64rem);
  height: 2.24rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.leftText {
  color: rgba(44, 44, 44, 1);
}

.ifmt-list-bottomLeftTop {
  width: calc(100vw - 0.8533rem - 2.9333rem - 0.64rem);
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

.leftTime {
  width: calc(100vw - 0.8533rem - 2.9333rem - 0.64rem);
  display: flex;
  align-items: center;
}

.name {
  width: 2rem;
  overflow: hidden;
  height: 0.38rem;
  line-height: 0.38rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
}

.name,
.time {
  height: 0.38rem;
  line-height: 0.38rem;
  font-size: 0.32rem;
  color: rgba(132, 132, 132, 1);
}

.time {
  margin-left: 0.32rem;
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
}

.ifmt-list-bottomRightImg {
  width: 2.9333rem;
  height: 2.24rem;
}
</style>