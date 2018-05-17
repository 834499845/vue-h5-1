<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="evaluate">
        <div class="evaNavbar">
            <ul>
                <li v-for="(nav,index) in navs" :key="index" :class="{selectNav:isSelectNav == index}" @touchend="navTouchend(index)">
                    <div>
                        {{nav.name}}
                    </div>
                    <div>
                        {{nav.num}}
                    </div>
                </li>
            </ul>
        </div>
        <div class="evaList">
            <template v-if="textOrImgShow">
                <div class="evaTextList">
                    <ul>
                        <li v-show="comments.length > 0" :key="index" v-for="(item,index) in comments" class="evaTextListLi">
                            <div class="commTextLeft">
                                <div>
                                    <img :src="item.img" alt="">
                                </div>
                            </div>
                            <div class="commTextRight">
                                <div class="commTextRightOne">
                                    <div>
                                        {{item.name}}
                                    </div>
                                    <div>
                                        {{item.date}}
                                    </div>
                                </div>
                                <div class="commTextRightTwo">
                                    <div>
                                        <img src="/static/img/hxingxing.png" alt="">
                                    </div>
                                    <div>
                                        <img src="/static/img/hxingxing.png" alt="">
                                    </div>
                                    <div>
                                        <img src="/static/img/hxingxing.png" alt="">
                                    </div>
                                    <div>
                                        <img src="/static/img/huixingxing.png" alt="">
                                    </div>
                                    <div>
                                        <img src="/static/img/huixingxing.png" alt="">
                                    </div>
                                </div>
                                <div class="commTextRightThr">
                                    {{item.comments}}
                                </div>
                                <div class="commTextRightFour">
                                    <div class="commTextRightFourL">
                                        <div>
                                            <div>
                                                颜色:
                                            </div>
                                            <div>
                                                {{item.color}}
                                            </div>
                                            <div>
                                                尺码:
                                            </div>
                                            <div>
                                                {{item.chima}}
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                购买日期:
                                            </div>
                                            <div>
                                                {{item.date}}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="commTextRightFourR">
                                        <div>
                                            <div>
                                                <img src="/static/img/xin.png" alt="">
                                            </div>
                                            <div>
                                                0
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <img src="/static/img/xiaoxi.png" alt="">
                                            </div>
                                            <div>
                                                0
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li v-show="comments.length == 0" class="nullTextLi">
                            暂无评价
                        </li>
                    </ul>
                </div>
            </template>
            <template v-else>
                <div class="evaImgList">
                    <ul>
                        <li v-show="commentImgs.length > 0" v-for="(item,index) in commentImgs" :key="item.name" class="evaImgListLi">
                            <div class="commTextLeft">
                                <div>
                                    <img :src="item.img" alt="">
                                </div>
                            </div>
                            <div class="commTextRight">
                                <div class="commTextRightOne">
                                    <div>
                                        {{item.name}}
                                    </div>
                                    <div>
                                        {{item.date}}
                                    </div>
                                </div>
                                <div class="commTextRightTwo">
                                    <div>
                                        <img src="/static/img/hxingxing.png" alt="">
                                    </div>
                                    <div>
                                        <img src="/static/img/hxingxing.png" alt="">
                                    </div>
                                    <div>
                                        <img src="/static/img/hxingxing.png" alt="">
                                    </div>
                                    <div>
                                        <img src="/static/img/hxingxing.png" alt="">
                                    </div>
                                    <div>
                                        <img src="/static/img/hxingxing.png" alt="">
                                    </div>
                                </div>
                                <div class="commTextRightThr">
                                    {{item.comments}}
                                </div>
                                <div class="commTextRightImg">
                                    <ul>
                                        <li v-for="image in item.imgs">
                                            <img :src="image.images" alt="">
                                        </li>
                                    </ul>
                                </div>
                                <div class="commTextRightFour">
                                    <div class="commTextRightFourL">
                                        <div>
                                            <div>
                                                颜色:
                                            </div>
                                            <div>
                                                {{item.color}}
                                            </div>
                                            <div>
                                                尺码:
                                            </div>
                                            <div>
                                                {{item.chima}}
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                购买日期:
                                            </div>
                                            <div>
                                                {{item.date}}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="commTextRightFourR">
                                        <div>
                                            <div>
                                                <img src="/static/img/xin.png" alt="">
                                            </div>
                                            <div>
                                                0
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <img src="/static/img/评论.png" alt="">
                                            </div>
                                            <div>
                                                0
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li v-show="commentImgs.length == 0" class="nullTextLi">
                            暂无评价
                        </li>
                    </ul>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      isSelectNav: 0,
      navs: [
        { name: "全部", num: "4" },
        { name: "好评", num: "2" },
        { name: "中评", num: "1" },
        { name: "差评", num: "1" },
        { name: "有图", num: "0" }
      ],
      textOrImgShow: true,
      comments: [],
      quanbus: [
        {
          name: "我的名字叫lila",
          img: "/static/img/5@3x.png",
          comments:
            "物流快 客服好 客服很耐心的解答问题 服务态度超好 一拿到哥哥马上玩 爱不释手呀 质量也好很舒服 ！",
          date: "2017-08-19",
          color: "白色",
          chima: "L"
        },
        {
          name: "另一个天堂",
          img: "/static/img/5@3x.png",
          comments: "看起来不错的样子，看了一下，个人感觉值得购买！",
          date: "2017-08-21",
          color: "白色",
          chima: "L"
        },
        {
          name: "猜火车",
          img: "/static/img/5@3x.png",
          comments:
            "宝贝已收到，包装结实，试了一下，非常舒服。效果确实不错，蛮好的，绝对的超值。",
          date: "2017-08-11",
          color: "白色",
          chima: "L"
        },
        {
          name: "遥远的北方",
          img: "/static/img/5@3x.png",
          comments:
            "与描述的完全一致，非常满意，真的很喜欢，完全超出期望值，非常不错",
          date: "2017-08-27",
          color: "白色",
          chima: "L"
        }
      ],
      haos: [
        {
          name: "我的名字叫lila",
          img: "/static/img/5@3x.png",
          comments: "适用年龄： 都能用 总结： 很喜欢，就是等的时间太久了",
          date: "2017-08-19",
          color: "白色",
          chima: "L"
        },
        {
          name: "另一个天堂",
          img: "/static/img/5@3x.png",
          comments:
            "自己买了3个，推荐又加了一单；取快递时，代收点老板问起，又要了一个。大品牌值得信赖。",
          date: "2017-08-21",
          color: "白色",
          chima: "L"
        }
      ],
      zhongs: [
        {
          name: "猜火车",
          img: "/static/img/5@3x.png",
          comments: "宝贝不错，很精致，很喜欢。非常满意，希望宝贝能耐久。",
          date: "2017-08-11",
          color: "白色",
          chima: "L"
        }
      ],
      chas: [
        {
          name: "遥远的北方",
          img: "/static/img/5@3x.png",
          comments: "暂时没啥毛病，有再追评",
          date: "2017-08-27",
          color: "白色",
          chima: "L"
        }
      ],
      commentImgs: []
    };
  },
  computed: mapState([""]),
  filters: {},
  created: function() {
    document.title = "商品分享";
    this.comments = this.quanbus;
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  },
  beforeDestroy: function() {},
  watch: {},
  methods: {
    // nav select event
    navTouchend(index) {
      this.isSelectNav = index;
      if (index == 4) {
        this.textOrImgShow = false;
      } else {
        this.textOrImgShow = true;
        if (index == 0) {
          this.comments = this.quanbus;
        } else if (index == 1) {
          this.comments = this.haos;
        } else if (index == 2) {
          this.comments = this.zhongs;
        } else if (index == 3) {
          this.comments = this.chas;
        }
      }
    },
    ...mapActions([])
  }
};
</script>
<style scoped>
.nullTextLi {
  height: 19rem;
  width: 100%;
  background-color: #f5f5f5;
  color: #e5e5e5;
  font-size: 3rem;
  text-align: center;
  line-height: 19rem;
}

.commTextRightImg {
  margin-top: 1.109rem;
  height: 7.68rem;
  overflow: hidden;
  width: 100%;
}

.commTextRightImg ul {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.commTextRightImg li {
  width: 7.68rem;
  height: 7.68rem;
  overflow: hidden;
}

.commTextRightImg li img {
  width: 100%;
  height: 100%;
}

.commTextRightFourR {
  display: flex;
  width: 9.387rem;
}

.commTextRightFourR > div:nth-child(1) {
  display: flex;
  align-items: center;
}

.commTextRightFourR > div > div:nth-child(1) {
  width: 1.28rem;
  height: 1.28rem;
  margin-left: 0.427rem;
  display: flex;
  align-items: center;
}

.commTextRightFourR > div > div:nth-child(1) img {
  width: 100%;
  height: 100%;
}

.commTextRightFourR > div > div:nth-child(2) {
  text-align: center;
  margin-left: 0.256rem;
  width: 2rem;
  font-size: 0.853rem;
  color: #030303;
  opacity: 0.45;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.commTextRightFourR > div:nth-child(2) {
  margin-left: 0.853rem;
  display: flex;
  align-items: center;
}

.commTextRightFourR > div {
  width: 4.267rem;
  height: 2.048rem;
  border: 1px solid #e5e5e5;
  border-radius: 3px;
  text-align: center;
  line-height: 2.048rem;
  margin-top: 1.451rem;
}

.commTextRightFourL {
  overflow: hidden;
}

.commTextRightFourL > div:nth-child(1) {
  display: flex;
  height: 1.024rem;
  font-size: 1.024rem;
  line-height: 1.024rem;
  color: #030303;
  opacity: 0.45;
  overflow: hidden;
}

.commTextRightFourL > div:nth-child(1) > div:nth-child(1) {
  min-width: 2.731rem;
}

.commTextRightFourL > div:nth-child(1) > div:nth-child(2) {
  /*margin-left: 0.427rem;*/
  max-width: 10.24rem;
  overflow: hidden;
}

.commTextRightFourL > div:nth-child(1) > div:nth-child(3) {
  margin-left: 0.427rem;
  min-width: 2.731rem;
}

.commTextRightFourL > div:nth-child(1) > div:nth-child(4) {
  /*margin-left: 0.427rem;*/
}

.commTextRightFourL > div:nth-child(2) {
  display: flex;
  height: 1.024rem;
  font-size: 1.024rem;
  line-height: 1.024rem;
  margin-top: 0.853rem;
  color: #030303;
  opacity: 0.45;
  overflow: hidden;
}

.commTextRightFourL > div:nth-child(2) > div:nth-child(1) {
  min-width: 5rem;
}

.commTextRightFourL > div:nth-child(2) > div:nth-child(2) {
  /*margin-left: 0.427rem;*/
}

.commTextRightFour {
  margin-top: 1.28rem;
  height: 3.413rem;
  display: flex;
  justify-content: space-between;
}

.commTextRightThr {
  margin-top: 1.2rem;
  font-size: 1.2rem;
  color: #030303;
  height: 1.3rem;
  line-height: 1.3rem;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.commTextRightTwo {
  width: 100%;
  height: 1.109rem;
  line-height: 1.109rem;
  margin-top: 0.853rem;
  display: flex;
  align-items: center;
}

.commTextRightTwo > div {
  width: 1.28rem;
  height: 1.28rem;
  overflow: hidden;
  margin-right: 0.427rem;
}

.commTextRightTwo > div img {
  width: 100%;
  height: 100%;
}

.commTextRightOne {
  display: flex;
  height: 1.365rem;
  align-items: center;
  overflow: hidden;
  justify-content: space-between;
}

.commTextRightOne > div:nth-child(1) {
  font-size: 1.3rem;
  color: #030303;
  opacity: 0.8;
  height: 1.365rem;
  line-height: 1.365rem;
  width: calc(100% - 5.973rem);
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.commTextRightOne > div:nth-child(2) {
  font-size: 1.024rem;
  color: #030303;
  opacity: 0.45;
  width: 5.973rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.commTextRight {
  margin-left: 0.853rem;
  width: calc(100vw - 6.57rem);
  height: 10.752rem;
  margin-top: 1.28rem;
}

.commTextLeft > div {
  width: 3.84rem;
  height: 3.84rem;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 1.024rem;
  margin-top: 1.28rem;
}

.commTextLeft > div img {
  width: 100%;
  height: 100%;
}

.commTextLeft {
  width: 4.864rem;
  height: 13.227rem;
  overflow: hidden;
}

.evaImgListLi:nth-child(1) {
  margin-top: 0.427rem;
}

.evaImgListLi {
  height: 22.187rem;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  margin-bottom: 0.853rem;
}

.evaTextListLi:nth-child(1) {
  margin-top: 0.427rem;
}

.evaTextListLi {
  height: 13.227rem;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  margin-bottom: 0.853rem;
}

.evaNavbar {
  border-bottom: 1px solid #efefef;
  border-top: 1px solid #efefef;
  height: 3.755rem;
  background-color: #fff;
}

.evaNavbar > ul {
  display: flex;
  justify-content: space-around;
}

.evaNavbar > ul li {
  width: 20%;
  height: 3.755rem;
  overflow: hidden;
}

.evaNavbar > ul li > div {
  text-align: center;
}

.evaNavbar > ul .selectNav > div:nth-child(1),
.evaNavbar > ul .selectNav > div:nth-child(2) {
  color: #ef7726;
}

.evaNavbar > ul li > div:nth-child(1) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 1.2rem;
  color: #030303;
  height: 1.28rem;
  line-height: 1.28rem;
  margin-top: 0.427rem;
}

.evaNavbar > ul li > div:nth-child(2) {
  width: 90%;
  margin-top: 0.512rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 5%;
  font-size: 1.024rem;
  color: #030303;
  height: 1.024rem;
  line-height: 1.024rem;
}

.evaluate {
  width: 100%;
  min-height: 3.755rem;
  overflow: hidden;
  background-color: #f5f5f5;
}
</style>