<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div id="app" class="home">
    <div v-show="spinnerShow" class="fullpage-containerX">
      <div class="page-1 page">
        <div class="part-time">
          <div>
            {{rankingWeekTime}}
          </div>
        </div>
        <div class="part-1-back">
          <img src="/static/img/back.png" alt="">
        </div>
      </div>
      <div class="page-2 page">
        <div class="part-2-week">
          <div class="week">
            <div class="week-title">
              上周运动总时长
            </div>
            <div class="week-time">
              <div>
                {{totalTime}}
              </div>
              <div>
                <p>
                  消耗卡路里
                </p>
                <p>
                  {{totalCalorie}}
                </p>
              </div>
            </div>
            <div class="week-minute" :key="index" v-for="(item,index) in weekLists">
              <div class="minute-left">
                {{item.week | weekFun}}
              </div>
              <div class="minute-right">
                <div class="minute-right-plan" data-id="1">
                  <div class="minute-right-planBg">
                  </div>
                  <div :style="{'width':item.width + 'rem'}" class="minute-right-planColor">
                  </div>
                </div>
                <div class="minute-right-time">
                  {{item.time | timeFun}}分钟
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="part-2-drill">
          <div class="drill">
            <div class="drill-title">
              上周训练完成次数
            </div>
            <div class="drill-cont">
              <div class="drill-contOne">
                <div>
                  {{walkTimes}}
                </div>
                <div>
                  健步
                </div>
              </div>
              <div>
                <div>
                  {{runTimes}}
                </div>
                <div>
                  跑步
                </div>
              </div>
              <div>
                <div>
                  {{cycleTimes}}
                </div>
                <div>
                  骑行
                </div>
              </div>
              <div>
                <div>
                  {{courseTimes}}
                </div>
                <div>
                  课程
                </div>
              </div>
              <div>
                <div>
                  {{trainTimes}}
                </div>
                <div>
                  单节
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="part-2-back">
          <img src="/static/img/back.png" alt="">
        </div>
      </div>
      <div class="page-3 page">
        <div class="part-3-ranking">
          <div class="ranking">
            <div class="ranking-title">
              上周排名最高
            </div>
            <div class="ranking-time">
              <div>
                {{ranking}}
              </div>
            </div>
            <div class="ranking-week">
              {{rankingTime}}
            </div>
          </div>
        </div>
        <div class="part-3-text">
          <div class="parttext">
            <div>
              健康周报
            </div>
            <div>
              {{rankingWeekTime}}
            </div>
            <div>
              生命不息&nbsp;运动不止
            </div>
            <div>
              下周我会做的更好
            </div>
          </div>
        </div>
        <div class="part-3-back">
          <div>
            求围观求监督
          </div>
        </div>
      </div>
    </div>
    <div v-show="!spinnerShow" class="spinner-double">
      <div>
        <div>
          <mt-spinner type="double-bounce"></mt-spinner>
        </div>
        <div>
          正在加载你的周报信息...
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { Toast } from "mint-ui";
import { Spinner } from "mint-ui";
export default {
  data() {
    return {
      expression: true,
      spinnerShow: true,
      time: "",
      trainTimes: 0,
      courseTimes: 0,
      cycleTimes: 0,
      runTimes: 0,
      walkTimes: 0,
      totalTime: 0,
      totalCalorie: 0,
      ranking: 0,
      rankingTime: 0,
      rankingWeekTime: 0,
      weekLists: [
        { week: "2017-10-31", time: "0", width: "0" },
        { week: "2017-10-31", time: "0", width: "0" },
        { week: "2017-10-31", time: "0", width: "0" },
        { week: "2017-10-31", time: "0", width: "0" },
        { week: "2017-10-31", time: "0", width: "0" },
        { week: "2017-10-31", time: "0", width: "0" },
        { week: "2017-10-31", time: "0", width: "0" }
      ]
    };
  },
  computed: mapState([""]),
  filters: {
    timeFun: function(val) {
      if (val) {
        return val;
      } else {
        return 0;
      }
    },
    weekFun: function(val) {
      if (val.indexOf("-") > -1) {
        var time = val.split("-");
        return time[1] + "." + time[2];
      } else {
        return val;
      }
    }
  },
  mounted() {
    var self = this;
    self.spinnerShow = false;
    setTimeout(function() {
      self.spinnerShow = true;
    }, 1000);
  },
  created: function() {
    var self = this;
    document.title = "健身周报";
    var y, m, d;
    var t = new Date();
    y = t.getFullYear();
    m = t.getMonth() + 1;
    d = t.getDate();
    var datTtime =
      y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
    self.time = datTtime;
    document.title = "健身周报";
    //格式化日期：yyyy-MM-dd
    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
    nowYear += nowYear < 2000 ? 1900 : 0; //
    function formatDate(date) {
      var myyear = date.getFullYear();
      var mymonth = date.getMonth() + 1;
      var myweekday = date.getDate();
      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
        myweekday = "0" + myweekday;
      }
      return myyear + "-" + mymonth + "-" + myweekday;
    }
    function weekTimeFun(ind) {
      var now = new Date(); //当前日期
      var nowDayOfWeek = now.getDay(); //今天本周的第几天
      var nowDay = now.getDate(); //当前日
      var nowMonth = now.getMonth(); //当前月
      var nowYear = now.getYear(); //当前年
      nowYear += nowYear < 2000 ? 1900 : 0; //
      var getUpWeekStartDates = new Date(
        nowYear,
        nowMonth,
        nowDay - nowDayOfWeek - ind
      );
      return getUpWeekStartDates;
    }

    var getUpWeekStartDate = formatDate(weekTimeFun(6));
    var getUpWeekStartDate5 = formatDate(weekTimeFun(5));
    var getUpWeekStartDate4 = formatDate(weekTimeFun(4));
    var getUpWeekStartDate3 = formatDate(weekTimeFun(3));
    var getUpWeekStartDate2 = formatDate(weekTimeFun(2));
    var getUpWeekStartDate1 = formatDate(weekTimeFun(1));
    var getUpWeekStartDate0 = formatDate(weekTimeFun(0));
    self.weekLists[0].week = getUpWeekStartDate;
    self.weekLists[1].week = getUpWeekStartDate5;
    self.weekLists[2].week = getUpWeekStartDate4;
    self.weekLists[3].week = getUpWeekStartDate3;
    self.weekLists[4].week = getUpWeekStartDate2;
    self.weekLists[5].week = getUpWeekStartDate1;
    self.weekLists[6].week = getUpWeekStartDate0;
    var getUpWeekEndDate = new Date(
      nowYear,
      nowMonth,
      nowDay + (6 - nowDayOfWeek - 6)
    );
    var getUpWeekEndDate = formatDate(getUpWeekEndDate);
    self.rankingWeekTime = getUpWeekStartDate + "-" + getUpWeekEndDate;
    var idStr = self.$route.query.id;
    if (idStr) {
      self
        .getfinanceCourseControllerselectSportWeekly({
          userId: idStr,
          date: datTtime
        })
        .then(data => {
          console.log("健身周报", JSON.parse(JSON.stringify(data)));
          if (data.code == 200) {
            data.data.times.forEach(function(ele, ind) {
              if (ele.sportType == "walk") {
                self.walkTimes = ele.times || 0;
              }
              if (ele.sportType == "train") {
                self.trainTimes = ele.times || 0;
              }
              if (ele.sportType == "run") {
                self.runTimes = ele.times || 0;
              }
              if (ele.sportType == "cycle") {
                self.cycleTimes = ele.times || 0;
              }
              if (ele.sportType == "course") {
                self.courseTimes = ele.times || 0;
              }
            });
            if (data.data.totalTime) {
              self.totalTime = Math.floor(data.data.totalTime.time) + "分钟";
              self.totalCalorie = data.data.totalTime.calorie;
            }
            if (data.data.weekRank.length > 0) {
              var max = data.data.weekRank[0].rank;
              data.data.weekRank.forEach(function(ele, ind) {
                if (max < ele.rank) {
                  max = ele.rank;
                }
              });
              self.ranking = max;
              data.data.weekRank.forEach(function(ele, ind) {
                if (self.ranking == ele.rank) {
                  self.rankingTime = ele.date;
                }
              });
            }
            if (data.data.dayTime.length == 7) {
              self.weekLists.forEach(function(ele, ind) {
                if (data.data.dayTime.length > ind) {
                  if (data.data.dayTime[ind].date) {
                    ele.week = data.data.dayTime[ind].date;
                  }
                  if (data.data.dayTime[ind].time) {
                    ele.time = data.data.dayTime[ind].time;
                  }
                }
                var s = ele.time / 1440;
                ele.width = 14.5067 * s;
              });
            }
          } else {
            Toast({
              message: "服务器错误",
              className: "toastLoad"
            });
          }
        })
        .catch(msg => {
          console.log(msg);
          Toast({
            message: "服务器错误",
            className: "toastLoad"
          });
        });
    } else {
      console.log("网址错误");
      self.pathShow = true;
    }
  },
  beforeDestroy: function() {},
  watch: {},
  methods: {
    ...mapActions(["getfinanceCourseControllerselectSportWeekly"])
  }
};
</script>
<style scoped>
.spinner-double {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-double > div {
  width: 200px;
  height: 50px;
  color: #fff;
}

.spinner-double > div > div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullpage-containerX {
  width: 100%;
  transform-style: preserve-3d;
  display: flex;
  flex-wrap: wrap;
}

.page {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
}

.animated {
  opacity: 1;
}

.page-2 {
  background: url("/static/img/e2.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
}

.part-2-week {
  position: absolute;
  left: 0;
  top: 13.84731vh;
  height: 17.49333rem;
  width: 100%;
  display: flex;
  justify-content: center;
}

.week-time > div:nth-child(1) {
  color: #fff;
  font-size: 2.1rem;
}

.week-time > div:nth-child(2) {
  overflow: hidden;
}

.week-time > div:nth-child(2) p {
  height: 0.939rem;
  font-size: 0.939rem;
  line-height: 0.939rem;
  min-width: 3.755rem;
  text-align: center;
}

.week-time > div:nth-child(2) p:nth-child(1) {
  color: #9a9f9e;
}

.week-time > div:nth-child(2) p:nth-child(2) {
  color: #fff;
  margin-top: 0.256rem;
}

.week-time {
  overflow: hidden;
  height: 2.133rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.week-title {
  height: 4.4373rem;
  width: 100%;
  text-align: center;
  line-height: 4.4373rem;
  color: #ef7726;
  font-size: 1.451rem;
}

.week .week-one {
  margin-top: 0.939rem;
}

.week-minute {
  height: 0.768rem;
  font-size: 0.768rem;
  color: #fff;
  display: flex;
  align-items: center;
  margin-top: 0.441rem;
}

.minute-left {
  width: 3.072rem;
  text-align: right;
  height: 0.768rem;
  font-size: 0.768rem;
  line-height: 0.768rem;
  overflow: hidden;
}

.minute-right {
  width: 19.668rem;
  height: 0.768rem;
  display: flex;
  align-items: center;
  margin-left: 0.3rem;
}

.minute-right-plan {
  width: 14.5067rem;
  height: 0.597rem;
  overflow: hidden;
  position: relative;
}

.minute-right-planBg {
  position: absolute;
  top: 0;
  left: 0;
  width: 14.5067rem;
  height: 0.597rem;
  background-color: #4f4c4d;
}

.minute-right-planColor {
  position: absolute;
  top: 0;
  left: 0;
  height: 0.597rem;
  background-color: #ef7726;
  z-index: 1000000;
}

.planColor1 {
  width: 3rem;
  opacity: 0;
}

.planColor2 {
  width: 4rem;
}

.planColor3 {
  width: 3.9rem;
}

.planColor4 {
  width: 7rem;
}

.planColor5 {
  width: 1.5rem;
}

.planColor6 {
  width: 10rem;
}

.planColor7 {
  width: 2rem;
}

.minute-right-time {
  margin-left: 0.3rem;
  height: 0.768rem;
  line-height: 0.768rem;
  font-size: 0.7rem;
  overflow: hidden;
}

.week {
  width: 23.04rem;
  height: 17.49333rem;
  background: url("/static/img/2-1.png") no-repeat;
  background-size: 100% 100%;
}

.part-2-drill {
  position: absolute;
  left: 0;
  top: 58.383233vh;
  height: 12.8rem;
  width: 100%;
  display: flex;
  justify-content: center;
}

.drill {
  width: 23.04rem;
  height: 12.8rem;
  background: url("/static/img/2-1.png") no-repeat;
  background-size: 100% 100%;
}

.drill-cont {
  height: 5.12rem;
  display: flex;
  align-items: center;
}

.drill .drill-contOne {
  margin-left: 1.707rem;
}

.drill-cont > div {
  height: 5.12rem;
  width: 3.1573rem;
  margin-left: 0.868rem;
}

.drill-cont > div > div:nth-child(1) {
  width: 3.0573rem;
  height: 3.0573rem;
  border-radius: 50%;
  border: 3px solid #ef7726;
  line-height: 3.0573rem;
  text-align: center;
  color: #fff;
}

.drill-cont > div > div:nth-child(2) {
  color: #fff;
  width: 3.3573rem;
  text-align: center;
  font-size: 1.109rem;
  margin-top: 0.597rem;
}

.drill-title {
  height: 4.77867rem;
  width: 100%;
  text-align: center;
  line-height: 4.77867rem;
  color: #ef7726;
  font-size: 1.451rem;
}

.part-2-back {
  position: absolute;
  top: 94.001198vh;
  width: 100%;
  display: flex;
  height: 1.32133rem;
  justify-content: center;
  overflow: hidden;
}

.part-2-back img {
  width: 2.98667rem;
  height: 1.32133rem;
}

.page-1 {
  background: url("/static/img/e1.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
}

.part-time {
  position: absolute;
  top: 72.6796vh;
  left: 0;
  width: 100%;
  height: 2.2187rem;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.part-time div {
  width: 8.5333rem;
  height: 2.2187rem;
  color: #fff;
  line-height: 2.4187rem;
  text-align: center;
  font-size: 0.709rem;
  background: url("/static/img/time.png") no-repeat;
  background-size: 100% 100%;
}

.part-1-back {
  position: absolute;
  top: 94.001198vh;
  width: 100%;
  display: flex;
  height: 1.32133rem;
  justify-content: center;
  overflow: hidden;
}

.part-1-back img {
  width: 2.98667rem;
  height: 1.32133rem;
}

.page-3 {
  background: url("/static/img/e3.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
}

.part-3-text {
  position: absolute;
  width: 100%;
  height: 9.38667rem;
  top: 56.137725vh;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.parttext {
  width: 23.04rem;
  height: 9.38667rem;
}

.parttext > div {
  text-align: center;
  color: #ef7726;
  width: 100%;
}

.parttext > div:nth-child(1) {
  font-size: 2.048rem;
  height: 2.048rem;
  line-height: 2.048rem;
}

.parttext > div:nth-child(2) {
  margin-top: 0.598rem;
  font-size: 0.703rem;
  height: 0.683rem;
  line-height: 0.683rem;
}

.parttext > div:nth-child(3) {
  margin-top: 2.987rem;
  font-size: 1.18rem;
  height: 1.18rem;
  line-height: 1.18rem;
}

.parttext > div:nth-child(4) {
  margin-top: 0.598rem;
  font-size: 0.939rem;
  height: 0.939rem;
  line-height: 0.939rem;
}

.part-3-ranking {
  position: absolute;
  width: 100%;
  height: 15.36rem;
  top: 13.999701vh;
  left: 0;
  display: flex;
  justify-content: center;
}

.ranking {
  width: 23.04rem;
  height: 15.36rem;
  background: url("/static/img/2-1.png") no-repeat;
  background-size: 100% 100%;
}

.ranking-title {
  height: 4.864rem;
  width: 100%;
  text-align: center;
  line-height: 4.864rem;
  color: #ef7726;
  font-size: 1.451rem;
}

.ranking-week {
  height: 2.133rem;
  width: 100%;
  text-align: center;
  line-height: 2.133rem;
  font-size: 2.133rem;
  color: #fff;
  margin-top: 1.109rem;
}

.ranking-time {
  height: 4.864rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ranking-time div {
  width: 4.864rem;
  height: 4.864rem;
  border-radius: 50%;
  border: 2px solid #ef7726;
  text-align: center;
  line-height: 4.864rem;
  font-size: 2.5rem;
  color: #fff;
}

.part-3-back {
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 100%;
  height: 3.755rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.part-3-back div {
  width: 19.3707rem;
  height: 3.755rem;
  background-color: #ef7726;
  color: #fff;
  font-size: 1.365rem;
  text-align: center;
  line-height: 3.755rem;
  border-radius: 1.7rem;
}

.home {
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100vh;
  width: 100%;
  position: relative;
}
</style>