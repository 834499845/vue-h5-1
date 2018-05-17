<template>
    <div class="views">
        <router-view class="view" keep-alive></router-view>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { Toast } from "mint-ui";
export default {
  data() {
    return {};
  },
  created: function() {
    var self = this;
    var urlStr = location.href;
    // alert('AppUrl--' + urlStr)
    if (urlStr.indexOf("?")) {
      if (urlStr.indexOf("?") != -1) {
        if (urlStr.indexOf("=")) {
          if (urlStr.indexOf("=") != -1) {
            var sortStr = "";
            sortStr = self.$route.query.sort;
            if (sortStr == 1) {
              this.$router.push({
                path: "/news",
                query: self.$route.query
              });
            } else if (sortStr == 2) {
              this.$router.push({
                path: "/mall",
                query: self.$route.query
              });
            } else if (sortStr == 3) {
              this.$router.push({
                path: "/commodity",
                query: self.$route.query
              });
            } else if (sortStr == 4) {
              this.$router.push({
                path: "/newspaper",
                query: self.$route.query
              });
            } else if (sortStr == 5) {
              this.$router.push({
                path: "/encourage",
                query: self.$route.query
              });
            } else if (sortStr == 6) {
              this.$router.push({
                path: "/rule",
                query: self.$route.query
              });
            } else if (sortStr == 7) {
              this.$router.push({
                path: "/gujie",
                query: self.$route.query
              });
            } else if (sortStr == 8) {
              this.$router.push({
                path: "/medical",
                query: self.$route.query
              });
            } else if (sortStr == 9) {
              this.$router.push({
                path: "/dynamic",
                query: self.$route.query
              });
            } else if (sortStr == 10) {
              this.$router.push({
                path: "/healthReport",
                query: self.$route.query
              });
            } else if (sortStr == 11) {
              this.$router.push({
                path: "/complaint",
                query: self.$route.query
              });
            } else if (sortStr == 12) {
              this.$router.push({
                path: "/issue",
                query: self.$route.query
              });
            } else if (sortStr == 13) {
              this.$router.push({
                path: "/newsVideo",
                query: self.$route.query
              });
            } else if (sortStr == 14) {
              this.$router.push({
                path: "/answer",
                query: self.$route.query
              });
            } else if (sortStr == 14) {
              this.$router.push({
                path: "/answer",
                query: self.$route.query
              });
            } else if (sortStr == 15) {
              this.$router.push({
                path: "/integral",
                query: self.$route.query
              });
            } else if (sortStr == 16) {
              this.$router.push({
                path: "/bigV",
                query: self.$route.query
              });
            } else if (sortStr == 17) {
              this.$router.push({
                path: "/newsDynamic",
                query: self.$route.query
              });
            }
          } else {
            console.log("网址错误");
            Toast({
              message: "服务器错误",
              className: "toastLoad"
            });
          }
        } else {
          console.log("网址错误");
          Toast({
            message: "服务器错误",
            className: "toastLoad"
          });
        }
      } else {
        console.log("网址错误");
        Toast({
          message: "网址错误",
          className: "toastLoad"
        });
      }
    } else {
      console.log("网址错误");
      Toast({
        message: "网址错误",
        className: "toastLoad"
      });
    }
  },
  beforeDestroy: function() {},
  methods: {
    ...mapActions([])
  }
};
</script>
<style>
html,
body,
form,
fieldset,
p,
div,
h1,
h2,
h3,
h4,
h5,
h6 {
  -webkit-text-size-adjust: 100%;
}
html,
body {
  min-height: 100%;
}
* {
  -webkit-overflow-scrolling: touch;
}
p {
  text-align: justify;
  text-justify: inter-ideograph;
  line-height: calc(1.365rem + 13px);
  font-size: 1.365rem;
}

body {
  /*-webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
        transform: translateZ(0);
        webkit-transform: translateZ(0);
        -moz-transform: translateZ(0);
        -ms-transform: translateZ(0);
        -o-transform: translateZ(0);
        transform: translateZ(0);
        webkit-transform: translate3d(0, 0, 0);
        -moz-transform: translate3d(0, 0, 0);
        -ms-transform: translate3d(0, 0, 0);
        -o-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);*/
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-perspective: 1000;
  perspective: 1000;
}

a {
  text-decoration: none;
}

img {
  border: 0px solid #ddd;
  outline: none;
}

[v-cloak] {
  display: none;
}

ul {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

.mint-button {
  height: 5rem;
}

p {
  margin: 0;
  padding: 0;
}

.infinite-loading-container .infinite-status-prompt {
  height: 10rem;
  /*border: 1px solid red !important;*/
}

.infinite-loading-container .infinite-status-prompt > span {
  /*color: red;*/
}

a,
button,
input,
optgroup,
select,
textarea,
div {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

body,
html {
  margin: 0;
  padding: 0;
  font-family: "Microsoft YaHei", Arial, "Helvetica Neue", Helvetica, sans-serif;
  overflow-x: hidden;
  overflow-y: auto;
  min-width: 320px;
}

input,
textarea {
  -webkit-appearance: none;
  outline: none;
}

a,
img {
  -webkit-touch-callout: none;
  max-width: 100% !important;
}
</style>