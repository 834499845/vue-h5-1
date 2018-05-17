<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="complaint">
        <div class="title">
            请选择投诉该朋友圈的原因:
        </div>
        <div class="content">
            <ul>
                <li v-for="item in lists"  @click="complaintSucceedClick">
                    <div>
                        {{item.content}}
                    </div>
                </li>
            </ul>
        </div>
        <div class="footer" @click="complaintClick">
            投诉须知
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      lists: [
        { content: "发布不适当内容对我造成骚扰" },
        { content: "传播带有道分享形式的内容" },
        { content: "传播谣言信息" },
        { content: "存在侵权行为" },
        { content: "发布仿冒信息" }
      ],
      pathShow: true
    };
  },
  filters: {},
  created: function() {
    var self = this;
    document.title = "投诉";
  },
  beforeDestroy: function() {},
  watch: {},
  methods: {
    complaintSucceedClick() {
      this.$router.push({
        path: "/complaintSucceed",
        query: { sort: this.$route.query.sort }
      });
    },
    complaintClick() {
      this.$router.push({
        path: "/complaintContent",
        query: { sort: this.$route.query.sort }
      });
    },
    ...mapActions([""])
  }
};
</script>
<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5rem;
  line-height: 5rem;
  text-align: center;
  color: #0f64f4;
  font-size: 1.024rem;
}
.nullShow {
  height: 10rem;
  color: #e6e6e6;
  font-size: 3rem;
  text-align: center;
  line-height: 10rem;
}
.title {
  width: 100%;
  height: 3.58rem;
  line-height: 3.58rem;
  font-size: 1.024rem;
  padding-left: 1.28rem;
  color: #959597;
}
.complaint {
  background-color: #f0eff5;
  overflow-x: hidden;
  min-height: calc(100vh);
}
.content li {
  width: 100%;
  height: 3.84rem;
  background-color: #fff;
  position: relative;
}
.content li::after {
  position: absolute;
  width: 100%;
  height: 1px;
  background-color: #e6e6e6;
  bottom: 0;
  left: 1.28rem;
  content: "";
}
.content li div {
  margin-left: 1.28rem;
  height: 100%;
  height: 3.84rem;
  line-height: 3.84rem;
  color: #000;
  font-size: 1.28rem;
}
.content {
  height: 100%;
  width: 100%;
  /* border: 1px solid #000; */
}
</style>