<template>
  <div>
    <div class="allLog-main">
      <div class="allLog-search-first">
        <div class="aL-s-f-title">
          选择发送人
        </div>
        <div class="aL-s-f-list">
          <ul>
            <li class="aL-s-f-listLi" v-for="(item,index) in lists" :key="index">
              <div class="aL-s-f-listLiL writeObjListbotLiTopObj" @click="deleteImgClick(index)">
                <img v-show="item.profile" :src="item.profile" alt="">
                <div v-show="!item.profile">{{item.name | userNickFun}}</div>
              </div>
              <div class="aL-s-f-listLir aL-s-f-listLirName">
                {{item.name}}
              </div>
            </li>
            <li class="aL-s-f-listLi" onclick="addListsClick()">
              <div class="aL-s-f-listLiL">
                <img src="/static/img/添加@3x.png" alt="">
              </div>
              <div class="aL-s-f-listLir">
                添加人
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="allLog-search-select">
        <div class="sl-l-left">
          未读
        </div>
        <div :class="{'sl-l-right-select':true}" @click="selectSearchClcik(true)">
              <img v-show="!isSllRightSelect" src="/static/img/未选中@3x.png" alt="">
              <img v-show="isSllRightSelect" src="/static/img/选中@3x.png" alt="">
        </div>
      </div>
      <div class="allLog-search-select">
        <div class="sl-l-left">
          已读
        </div>
        <div :class="{'sl-l-right-select':true}" @click="selectSearchClcik(false)">
              <img v-show="isSllRightSelect" src="/static/img/未选中@3x.png" alt="">
              <img v-show="!isSllRightSelect" src="/static/img/选中@3x.png" alt="">
        </div>
      </div>
      <div class="allLog-search-but" @click="searchClick">
        提交
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["listOrSearch"],
  data() {
    return {
      isSllRightSelect: true, // 已读未读
      lists: [] // 发送人列表
    };
  },
  filters: {
    userNickFun: function(val) {
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
    timeFun: function(val) {
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
  },
  updated: function() {},
  created: function() {},
  mounted() {
    var self = this;
    // 选择人员
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    window.addListsClick = function() {
      if (isAndroid) {
        if (window.BenchJSInterface) {
          if (self.lists.length > 0) {
            window.BenchJSInterface.setBtnOnClickEvent(
              "101",
              "javascript:window.updateAnListFun(->path<-);",
              JSON.stringify(self.lists)
            );
          } else {
            window.BenchJSInterface.setBtnOnClickEvent(
              "101",
              "javascript:window.updateAnListFun(->path<-);"
            );
          }
        }
      } else {
        var selectedArr;
        var arrSele = [];
        if (self.lists.length > 0) {
          self.lists.forEach(function(ele, ind) {
            arrSele.push(ele.passportId);
          });
          selectedArr = arrSele.join(",");
        }
        var messgaeObj = {
          methodName: "BotongApplicationCenterContactsJSHandler",
          params: {
            ignoreIds: selectedArr, // 已经选中的
            limitCount: 0 //可选人数 传0为不限制
          },
          callbackMethod: "updateIosListFun"
        };
        if (window.webkit) {
          window.webkit.messageHandlers.BotongApplicationCenterContactsJSHandler.postMessage(
            messgaeObj
          );
        }
      }
    };
    // 选中结果安卓
    window.updateAnListFun = function(val) {
      var arrList = JSON.parse(JSON.stringify(val));
      self.lists = [];
      self.lists = arrList;
    };
    // 选中结果ios
    window.updateIosListFun = function(val) {
      var arrList = JSON.parse(JSON.stringify(val));
      //这里必须这样解析Json
      self.lists = [];
      self.lists = arrList;
      // [
      //     {memberId:''},
      //     {state:''},
      //     {mobile:''},
      //     {name:''},   //人名
      //     {passpottld:''},
      //     {profile:''} //头像地址
      // ]};
    };
  },
  watch: {
    listOrSearch(val) {
      this.lists = [];
    }
  },
  methods: {
    // 删除选中人
    deleteImgClick(index) {
      var self = this;
      self.lists.splice(index, 1);
    },
    //  选择
    selectSearchClcik(val) {
      this.isSllRightSelect = val;
    },
    // 确认搜索
    searchClick() {
      var self = this;
      var readStatusNum = 0;
      if (this.isSllRightSelect == false) {
        readStatusNum = 1;
      } else {
        readStatusNum = 0;
      }
      var searchArr = {
        arr: self.lists,
        readStatus: readStatusNum
      };
      this.$emit("search", searchArr);
      this.lists = [];
    }
  }
};
</script>
<style scoped>
.writeObjListbotLiTopObj div {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 1.0667rem;
  height: 1.0667rem;
  overflow: hidden;
  border-radius: 50%;
  background-color: #4592e2;
  text-align: center;
  line-height: 1.096rem;
  color: #fff;
  font-size: 0.3733rem;
}

.writeObjListbotLiTopObj {
  position: relative;
  min-width: 1.0667rem;
  height: 1.0667rem;
  overflow: hidden;
  border-radius: 50%;
  top: 0;
  left: 0;
}

.writeObjListbotLiTopObj img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.aL-s-f-listLiL {
  width: 1.0667rem;
  height: 1.0667rem;
  border-radius: 50%;
  overflow: hidden;
}

.aL-s-f-listLiL img {
  width: 100%;
  height: 100%;
}

.aL-s-f-listLir {
  height: 0.34rem;
  font-size: 0.32rem;
  width: 100%;
  color: rgba(132, 132, 132, 1);
  line-height: 0.34rem;
  width: 1.0667rem;
  text-align: center;
  overflow: hidden;
  margin-top: 0.2133rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.aL-s-f-listLi {
  width: 1.0667rem;
  height: 1.6rem;
  overflow: hidden;
  margin-right: 0.4rem;
  margin-bottom: 0.4rem;
}

.aL-s-f-list ul {
  display: flex;
  min-height: 1.6rem;
  background: rgba(255, 255, 255, 1);
  flex-wrap: wrap;
}

.allLog-search-first {
  width: 100vw;
  /* min-height: 3.0933rem; */
  background: rgba(255, 255, 255, 1);
}

.aL-s-f-list {
  min-height: 1.6rem;
  width: calc(100vw - 0.8533rem);
  margin-left: 0.4267rem;
  margin-right: 0.4267rem;
  background: rgba(255, 255, 255, 1);
}

.aL-s-f-title {
  height: 1.12rem;
  width: 100%;
  font-size: 0.3733rem;
  color: rgba(44, 44, 44, 1);
  line-height: 1.2267rem;
  padding-left: 0.4267rem;
  overflow: hidden;
}

.sl-l-right {
  width: 0.5867rem;
  height: 0.5867rem;
  background: url("/static/img/选中.png") no-repeat;
  /* background-position: -94px -109px; */
  margin-right: 0.4267rem;
  background-size: 100% 100%;
}

.sl-l-right-select {
  width: 0.5867rem;
  height: 0.5867rem;
  margin-right: 0.4267rem;
}
.sl-l-right-select img {
  width: 100%;
  height: 100%;
}
.allLog-search-select {
  position: relative;
  width: 100%;
  height: 1.28rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 1);
}

.sl-l-left {
  font-size: 0.4267rem;
  color: rgba(44, 44, 44, 1);
  margin-left: 0.4267rem;
}

.allLog-search-but {
  width: 8.08rem;
  height: 1.1733rem;
  background: linear-gradient(
    151.7deg,
    rgba(102, 173, 247, 1),
    rgba(67, 144, 225, 1)
  );
  border-radius: 0.0533rem;
  font-size: 0.48rem;
  color: rgba(255, 255, 255, 1);
  line-height: 1.1733rem;
  text-align: center;
  margin: 0 auto;
  margin-top: 0.96rem;
}

.allLog-search-select {
  margin-top: 0.32rem;
  width: 100%;
  height: 1.28rem;
  background: rgba(255, 255, 255, 1);
}

.allLog-main {
  overflow-x: hidden;
  overflow-y: scroll;
  height: calc(100vh - 2.2667rem);
}
</style>