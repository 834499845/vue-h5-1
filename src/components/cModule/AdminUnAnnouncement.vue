<template>
  <div class="unAdminAnnouncement">
    <div class="announcementTop">
      <div :class="{'announcementNav':true,'borderShow':isselectAnnouncementNav == 1}" @click='bordersClick(1)'>未读</div>
      <div :class="{'announcementNav':true,'borderShow':isselectAnnouncementNav == 0}" @click='bordersClick(0)'>已读</div>
    </div>
    <div class="announcementContentBox">
      <v-AdminUnLAnnouncement v-show="isselectAnnouncementNav == 1" :isselectAnnouncementNav="isselectAnnouncementNavL"></v-AdminUnLAnnouncement>
      <v-AdminUnRAnnouncement v-show="isselectAnnouncementNav == 0" :isselectAnnouncementNav="isselectAnnouncementNavC"></v-AdminUnRAnnouncement>
    </div>
  </div>
</template>
<script>
import AdminUnLAnnouncement from "./AdminUnLAnnouncement";
import AdminUnRAnnouncement from "./AdminUnRAnnouncement";
import { mapActions } from "vuex";
export default {
  props: ["createdShow"],
  components: {
    "v-AdminUnRAnnouncement": AdminUnRAnnouncement,
    "v-AdminUnLAnnouncement": AdminUnLAnnouncement
  },
  data() {
    return {
      spinnerLoadShow: false, // 加载中
      isselectAnnouncementNav: 1, //未读，已读，已发送切换
      isselectAnnouncementNavL: 3,
      isselectAnnouncementNavC: 3,
      companyName: "" //企业名称
    };
  },
  created: function() {
    var self = this;
  },
  mounted: function() {},
  methods: {
    //未读 已读 的切换
    bordersClick(index) {
      var self = this;
      if (index != sessionStorage.getItem("selectAnn")) {
        self.isselectAnnouncementNav = index;
        sessionStorage.setItem("selectAnn", self.isselectAnnouncementNav);
        if (index == 0) {
          self.isselectAnnouncementNavC = 0;
          self.isselectAnnouncementNavL = 3;
        } else if (index == 1) {
          self.isselectAnnouncementNavL = 1;
          self.isselectAnnouncementNavC = 3;
        }
      }
    },
    // 初始化数据
    listFun() {
      var self = this;
      if (sessionStorage.getItem("selectAnn")) {
        self.isselectAnnouncementNav = sessionStorage.getItem("selectAnn");
      } else {
        self.isselectAnnouncementNav = 1;
        sessionStorage.setItem("selectAnn", 1);
      }
      if (self.isselectAnnouncementNav == 0) {
        self.isselectAnnouncementNavC = 0;
        self.isselectAnnouncementNavL = 3;
      } else if (self.isselectAnnouncementNav == 1) {
        self.isselectAnnouncementNavL = 1;
        self.isselectAnnouncementNavC = 3;
      }
    },
    ...mapActions([
      "getNoticeupdateNotice",
      "getNoticedeleteNotice",
      "getNoticeselectNoticePage",
      "getnoticenoticeauthority"
    ])
  },
  mounted() {},
  watch: {
    createdShow(val) {
      var self = this;
      if (val == true) {
        self.listFun();
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
.unAdminAnnouncement {
  height: 100vh;
  overflow: hidden;
  width: 100vw;
  position: relative;
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

.contentsRight {
  width: 2.9333rem;
  height: 2.24rem;
  overflow: hidden;
  position: relative;
  background-repeat: no-repeat;
  background: center center;
  background-size: auto 2.24rem;
}

.contentsRightImg {
  width: 2.9333rem;
  height: 2.24rem;
}
</style>