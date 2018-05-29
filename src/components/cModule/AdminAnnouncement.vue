<template>
  <div class="AdminAnnouncement">
    <div class="announcementsTop">
      <div :class="{'announcementsNav':true,'selectAnnouncementsNav':isselectAnnouncementNav == 1}" @click='bordersClick(1)'>未读</div>
      <div :class="{'announcementsNav':true,'selectAnnouncementsNav':isselectAnnouncementNav == 0}" @click='bordersClick(0)'>已读</div>
      <div :class="{'announcementsNav':true,'selectAnnouncementsNav':isselectAnnouncementNav == 2}" @click='bordersClick(2)'>已发送</div>
    </div>
    <div class="announcementContentBox">
      <v-AdminNavLAnnouncement v-show="isselectAnnouncementNav == 1" :isselectAnnouncementNav="isselectAnnouncementNavL"></v-AdminNavLAnnouncement>
      <v-AdminNavCAnnouncement v-show="isselectAnnouncementNav == 0" :isselectAnnouncementNav="isselectAnnouncementNavC"></v-AdminNavCAnnouncement>
      <v-AdminNavRAnnouncement v-show="isselectAnnouncementNav == 2" :isselectAnnouncementNav="isselectAnnouncementNavR"></v-AdminNavRAnnouncement>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import scroll from "./announcementScroll";
import AdminNavLAnnouncement from "./AdminNavLAnnouncement";
import AdminNavCAnnouncement from "./AdminNavCAnnouncement";
import AdminNavRAnnouncement from "./AdminNavRAnnouncement";
import { mapActions } from "vuex";
export default {
  props: ["createdShow"],
  components: {
    "v-scroll": scroll,
    "v-AdminNavLAnnouncement": AdminNavLAnnouncement,
    "v-AdminNavCAnnouncement": AdminNavCAnnouncement,
    "v-AdminNavRAnnouncement": AdminNavRAnnouncement
  },
  data() {
    return {
      isselectAnnouncementNav: 1, //未读，已读，已发送切换
      isselectAnnouncementNavL: 3,
      isselectAnnouncementNavC: 3,
      isselectAnnouncementNavR: 3,
      companyName: "" //企业名称
    };
  },
  created: function() {
    var self = this;
  },
  mounted() {
    var self = this;
  },
  watch: {
    createdShow(val) {
      var self = this;
      if (val == true) {
        self.listFun();
      }
    }
  },
  methods: {
    //未读 已读 已发送的切换
    bordersClick(index) {
      var self = this;
      if (index != sessionStorage.getItem("selectAnn")) {
        self.isselectAnnouncementNav = index;
        sessionStorage.setItem("selectAnn", self.isselectAnnouncementNav);
        if (index == 0) {
          self.isselectAnnouncementNavC = 0;
          self.isselectAnnouncementNavL = 3;
          self.isselectAnnouncementNavR = 3;
        } else if (index == 1) {
          self.isselectAnnouncementNavL = 1;
          self.isselectAnnouncementNavC = 3;
          self.isselectAnnouncementNavR = 3;
        } else if (index == 2) {
          self.isselectAnnouncementNavR = 2;
          self.isselectAnnouncementNavL = 3;
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
        self.isselectAnnouncementNavR = 3;
      } else if (self.isselectAnnouncementNav == 1) {
        self.isselectAnnouncementNavL = 1;
        self.isselectAnnouncementNavC = 3;
        self.isselectAnnouncementNavR = 3;
      } else if (self.isselectAnnouncementNav == 2) {
        self.isselectAnnouncementNavR = 2;
        self.isselectAnnouncementNavL = 3;
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
.AdminAnnouncement {
  height: 100vh;
  overflow: hidden;
  width: 100vw;
  position: relative;
}
.acceptAnnouncementBoxNull {
  height: calc(100vh - 1.0667rem);
  width: 100%;
  text-align: center;
  /* line-height: calc(100vh - 1.0667rem); */
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

.announcementContentBox {
  width: 100vw;
  position: absolute;
  top: 1.0667rem;
  overflow: hidden;
  left: 0;
  height: calc(100vh - 1.0667rem);
  background-color: #f1f1f1;
}

.announcementsTop {
  width: 100%;
  height: 1.0667rem;
  display: flex;
  justify-content: space-between;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 1000;
}

.selectAnnouncementsNav {
  color: #4390e1 !important;
  border-bottom: 2px solid #4390e1 !important;
}

.announcementsNav {
  width: calc(100% / 3);
  font-size: 0.3733rem;
  display: inline-block;
  text-align: center;
  line-height: 1.0667rem;
  font-family: PingFangSC-Regular;
  color: rgba(44, 44, 44, 1);
  cursor: pointer;
}

.leftsTime {
  width: calc(100vw - 0.8533rem - 2.9333rem - 0.64rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.names {
  width: 2rem;
  height: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.names,
.times {
  height: 0.37rem;
  line-height: 0.37rem;
  font-size: 0.32rem;
  color: rgba(132, 132, 132, 1);
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