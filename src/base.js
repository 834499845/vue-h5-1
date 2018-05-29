
export default {
    install(Vue, options) {
        Vue.prototype.WatchBigPicture = function (m, n) {
            var u = navigator.userAgent;
            var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if (isAndroid) {
                if (window.BenchJSInterface) {
                    if (window.BenchJSInterface.WatchBigPicture) {
                        var obj = {
                            imgLists: m,
                            index: n
                        };
                        window.BenchJSInterface.WatchBigPicture(JSON.stringify(obj));
                    }
                }
            } else {
                var messgaeObjImg = {
                    methodName: "invokeCameraFromJS",
                    params: {
                        imageArray: m,
                        currentCount: n
                    },
                    callbackMethod: "updateIosImgFun"
                };
                if (window.webkit) {
                    if (window.webkit.messageHandlers) {
                        if (window.webkit.messageHandlers.BotongApplicationCenterPictureBrowserJSHandler) {
                            window.webkit.messageHandlers.BotongApplicationCenterPictureBrowserJSHandler.postMessage(
                                messgaeObjImg
                            );
                        }
                    }
                }
            }
        }
    }
}
