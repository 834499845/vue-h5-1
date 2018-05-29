// 版权信息
<template>
  <div class="privacy">
    <div class="privacyContent">
      <div class="contentItem">伯通 尊重并保护所有使用服务用户的个人隐私权。为了给您提供更准确、更有个性化的服务，伯通会按照本隐私权政策的规定使用和披露您的个人信息。但伯通将以高度的勤勉、审慎义务对待这些信息。除本隐私权政策另有规定外，在未征得您事先许可的情况下，伯通不会将这些信息对外披露或向第三方提供。伯通会不时更新本隐私权政策。您在同意伯通服务使用协议之时，即视为您已经同意本隐私权政策全部内容。本隐私权政策属于伯通服务使用协议不可分割的一部分。</div>
      <div class="contentItem contentItemTitle">1.适用范围</div>
      <div class="contentItem">在您注册伯通帐号时，您根据伯通要求提供的个人注册信息;</div>
      <div class="contentItem">在您使用伯通网络服务，伯通自动接收并记录的您的手机上的信息，包括但不限于您的IP地址、浏览器的类型、使用的语言、访问日期和时间、软硬件特征信息及您需求的网页记录等数据;</div>
      <div class="contentItem contentItemTitle">2.信息的使用</div>
      <div class="contentItem">在获得您的数据之后，伯通会将其上传至服务器，以生成您的排行榜数据，以便您能够更好地使用服务。</div>
      <div class="contentItem contentItemTitle">3.信息披露</div>
      <div class="contentItem">伯通不会将您的信息披露给不受信任的第三方。</div>
      <div class="contentItem">根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露;</div>
      <div class="contentItem">如您出现违反中国有关法律、法规或者伯通服务协议或相关规则的情况，需要向第三方披露;</div>
      <div class="contentItem contentItemTitle">4.信息存储和交换</div>
      <div class="contentItem">伯通收集的有关您的信息和资料将保存在伯通及（或）其关联公司的服务器上，这些信息和资料可能传送至您所在国家、地区或伯通收集信息和资料所在地的境外并在境外被访问、存储和展示。</div>
      <div class="contentItem contentItemTitle">5.信息安全</div>
      <div class="contentItem">伯通帐号均有安全保护功能，请妥善保管您的用户名及密码信息。伯通通过对用户密码进行加密等安全措施确保您的信息不丢失，不被滥用和变造。尽管有前述安全措施，但同时也请您注意在信息网络上不存在“完善的安全措施”。</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  components: {},
  methods: {},
  created: function() {
    var self = this;
    document.title = "隐私政策";
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      if (window.BenchJSInterface) {
        window.BenchJSInterface.setRightBtn("", "");
        window.BenchJSInterface.setTitle("隐私政策");
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
  },
  watch: {}
};
</script>
<style scoped>
.contentItemTitle {
  color: #2c2c2c !important;
  font-size: 0.4rem !important;
}

.privacy {
  height: 100vh;
  width: 100%;
}

.privacyContent {
  padding: 0.45rem;
}

.contentItem {
  font-size: 0.3733rem;
  margin-bottom: 0.125rem;
  color: #848484;
}
</style>