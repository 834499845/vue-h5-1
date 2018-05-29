<!--抄送我的详情-->
<template>
    <div>
        <div class="detailsExamine" v-if='codeShow'>
            <div class="detailsTop">
                <div class="detailsTopImg" v-if="detailsImg">
                    <img v-lazy="detailsImg" alt="">
                </div>
                <div class="detailsTopImgFont" v-if="!detailsImg">
                    {{detailsName | nameFun}}
                </div>
                <div class="detailsTopFont">
                    <p class="detailsTopFontTop">{{detailsName}}</p>
                    <p class="detailsTopFontFoot">
                        <span class="detailsTopFontFootLeft">{{department}}</span>
                        <span class="detailsTopFontFootRight">{{position}}</span>
                    </p>
                </div>
                <div class="iconImg" v-if='state == "1"'>
                    <img v-if='result == "1"' src="/static/img/审批通过@3x.png" alt="">
                    <img v-if='result == "2"' src="/static/img/审批失败@3x.png" alt="">
                </div>
            </div>
            <ul class="detailsContent">
                <li v-for="(item,eInd) in explainList" :key="eInd">
                    <div class="detailsContentLabel" v-if="item.contents">
                        {{item.label}}
                        <small v-if="item.contents && item.contents[0].num > 0">（{{item.contents[0].num}}）</small>
                    </div>
                    <div v-if="item.type == '1'" class="detailsContentLI">
                        <div class="detailsContentLeft">{{item.label}}</div>
                        <div class="detailsContentRight">
                            <pre>{{item.value}}</pre>
                        </div>
                    </div>
                    <div v-if=" item.type == '2' || item.type == '3' || item.type == '6' || item.type == '9' " class="detailsContentLI">
                        <div class="detailsContentLeft">{{item.label}}</div>
                        <div class="detailsContentRight">{{item.value}}</div>
                    </div>
                    <div v-if="item.type == '4' && item.dateFormat == 'yyyy-MM-dd HH:mm'" class="detailsContentLI">
                        <div class="detailsContentLeft">{{item.label}}</div>
                        <div class="detailsContentRight">{{item.value | timeFun}}</div>
                    </div>
                    <div v-if="item.type == '4' && item.dateFormat == 'yyyy-MM-dd'" class="detailsContentLI">
                        <div class="detailsContentLeft">{{item.label}}</div>
                        <div class="detailsContentRight">{{item.value | dataFun}}</div>
                    </div>
                    <div v-if="item.type == '8'" class="detailsFont">
                        {{item.label}}
                    </div>
                    <div v-if="item.type == '7'">
                        <div v-for='(itec,conInd) in item.contents' :key="conInd">
                            <ul v-for='(itea,attInd) in itec.attrs' :key="attInd">
                                <li>
                                    <div v-if="itea.type == '1'" class="detailsContentLI">
                                        <div class="detailsContentLeft">{{itea.label}}</div>
                                        <div class="detailsContentRight">
                                            <pre>{{itea.value}}</pre>
                                        </div>
                                    </div>
                                    <div v-if="itea.type == '2' || itea.type == '3' || itea.type == '4' || itea.type == '6' || itea.type == '9' " class="detailsContentLI">
                                        <div class="detailsContentLeft">{{itea.label}}</div>
                                        <div class="detailsContentRight">{{itea.value}}</div>
                                    </div>
                                    <div v-if="itea.type == '4' && itea.dateFormat == 'yyyy-MM-dd HH:mm'" class="detailsContentLI">
                                        <div class="detailsContentLeft">{{itea.label}}</div>
                                        <div class="detailsContentRight">{{itea.value | timeFun}}</div>
                                    </div>
                                    <div v-if="itea.type == '4' && itea.dateFormat == 'yyyy-MM-dd'" class="detailsContentLI">
                                        <div class="detailsContentLeft">{{itea.label}}</div>
                                        <div class="detailsContentRight">{{itea.value | dataFun}}</div>
                                    </div>
                                    <div v-if="itea.type == '8'" class="detailsFont">
                                        {{itea.label}}
                                    </div>
                                    <div v-if="itea.type == '5' && itea.dateFormat == 'yyyy-MM-dd HH:mm'">
                                        <div class="detailsContentLI">
                                            <div class="detailsContentLeft">{{itea.label}}</div>
                                            <div class="detailsContentRight">{{itea.value | timeFun}}</div>
                                        </div>
                                        <div class="detailsContentLI">
                                            <div class="detailsContentLeft">{{itea.labels}}</div>
                                            <div class="detailsContentRight">{{itea.values | timeFun}}</div>
                                        </div>
                                    </div>
                                    <div v-if="itea.type == '5' && itea.dateFormat == 'yyyy-MM-dd'">
                                        <div class="detailsContentLI">
                                            <div class="detailsContentLeft">{{itea.label}}</div>
                                            <div class="detailsContentRight">{{itea.value | dataFun}}</div>
                                        </div>
                                        <div class="detailsContentLI">
                                            <div class="detailsContentLeft">{{itea.labels}}</div>
                                            <div class="detailsContentRight">{{itea.values | dataFun}}</div>
                                        </div>
                                    </div>
                                    <div v-if="itea.type == '10'">
                                        <div class="detailsContentLI">
                                            <div class="detailsContentLeft">
                                                {{itea.label}}
                                            </div>
                                        </div>
                                        <div class="leaveImgCenter">
                                            <div class="leaveImgFor" v-for="(iteimg,imgInd) in itea.images" :key="imgInd">
                                                <img v-lazy="iteimg.url" alt="" @click="detaillLookImgClick(index, indc, ind, imgInd)">
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div v-if="item.type == '5' && item.dateFormat == 'yyyy-MM-dd HH:mm'">
                        <div class="detailsContentLI">
                            <div class="detailsContentLeft">{{item.label}}</div>
                            <div class="detailsContentRight">{{item.value | timeFun}}</div>
                        </div>
                        <div class="detailsContentLI">
                            <div class="detailsContentLeft">{{item.labels}}</div>
                            <div class="detailsContentRight">{{item.values | timeFun}}</div>
                        </div>
                    </div>
                    <div v-if="item.type == '5' && item.dateFormat == 'yyyy-MM-dd'">
                        <div class="detailsContentLI">
                            <div class="detailsContentLeft">{{item.label}}</div>
                            <div class="detailsContentRight">{{item.value | dataFun}}</div>
                        </div>
                        <div class="detailsContentLI">
                            <div class="detailsContentLeft">{{item.labels}}</div>
                            <div class="detailsContentRight">{{item.values | dataFun}}</div>
                        </div>
                    </div>
                    <div v-if="item.type == '10'">
                        <div class="detailsContentLI">
                            <div class="detailsContentLeft">
                                <!-- 图片 -->
                                {{item.itemLabel}}
                            </div>
                        </div>
                        <div class="leaveImgCenter">
                            <div class="leaveImgFor" v-for="(iteimg,imgInd) in item.images" :key="imgInd">
                                <img v-lazy="iteimg.url" alt="" @click='lookImgClick()'>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <ul class="detailsPerson">
                <li class="personLi" v-for="(item,personListIndex) in personList" :key="personListIndex">
                    <div class="personImg" v-if="item.avatar">
                        <img v-lazy="item.avatar" alt="">
                    </div>
                    <div class="personImgFont" v-if="!item.avatar">
                        {{item.name|nameFun}}
                    </div>
                    <div class="personContent">
                        <span class="personName">{{item.name}}</span>
                        <span class="personType" :class="{fontGreen:item.processState == '1' || item.processState == '0'|| item.processState == '3',fontRed:item.processState == '2'}">{{item.message}}</span>
                    </div>
                    <div class="personTime">{{item.approvalTime|timeFun}}</div>
                </li>
            </ul>
            <div class="approver">
                <div class="approverTop">
                    <div class="approverTopLeft">
                        抄送人
                    </div>
                    <div class="approverTopRight">
                        （审批人全部同意后，将抄送给以下成员）
                    </div>
                </div>
                <div class="approverFor">
                    <ul>
                        <li class="approverLi" v-for="(item,index) in copyList" :key="index">
                            <div class="approverLiTop" v-if='item.avatar'>
                                <img v-lazy="item.avatar" alt="">
                            </div>
                            <div class="approverLiTopFont" v-if='!item.avatar'>
                                {{item.name | nameFun}}
                            </div>
                            <div class="approverLiFont">
                                {{item.name}}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="codeNo" v-else>
            <div class="nullContent"></div>
            <img class="nullImg" src="/static/img/zixun.png" alt="">
            <div class="nullText">暂无数据</div>
        </div>
    </div>
</template>
<script>
    import { mapActions } from "vuex";
    import { Toast } from "mint-ui";
    export default {
        components: {},
        data() {
            return {
                explainList: [], //内容列表
                personList: [], //审批人及其结果列表
                copyList: [], //抄送人列表
                state: "0", //审批是否结束。撤回
                result: "0", //审批通过/拒绝
                detailsImg: "", //头像
                detailsName: "", //被审批者名称
                department: "", //部门
                position: "", //职位
                codeShow: false
            };
        },
        created: function () {
            document.title = "抄送我的";
            sessionStorage.setItem("copyToDetailsLook", 1);
            var self = this;
            self.$store.commit("setMutVuexisLoading", true);
            self
                .getapprovalApprovalDetail({
                    companyId: sessionStorage.getItem("companyId"),
                    memberId: sessionStorage.getItem("memberId"),
                    approvalId: self.$route.query.approvalId
                })
                .then(data => {
                    self.$store.commit("setMutVuexisLoading", false);
                    if (data.statusCode == 200) {
                        if (data.data) {
                            if (data.data.approveAttrVO) {
                                self.codeShow = true;
                                self.detailsImg = data.data.avatar;
                                self.detailsName = data.data.name;
                                self.department = data.data.deptName;
                                self.position = data.data.position;
                                self.state = data.data.state;
                                self.explainList = data.data.approveAttrVO;
                                self.personList = data.data.approvalUserList;
                                self.copyList = data.data.copyUserList;
                                self.result = data.data.result;
                                self
                                    .getapprovalupdateisread({
                                        approvalId: self.$route.query.approvalId
                                    })
                                    .then(data => {
                                        if (data.statusCode == 200) {
                                            var WaitedApprovalLists = self.$store.state.VuexCopyLists;
                                            var nightlistStrIndex =
                                                self.$store.state.VuexCopyListsClickIndex;
                                            WaitedApprovalLists[nightlistStrIndex].isRead = 1;
                                            self.$store.commit(
                                                "setMutVuexCopyLists",
                                                WaitedApprovalLists
                                            );
                                            for (var i = 0; i < self.copyList.length; i++) {
                                                self.copyList[i].isRead = 1;
                                            }
                                        } else {
                                            Toast({
                                                message: "服务器异常",
                                                position: "bottom"
                                            });
                                        }
                                    })
                                    .catch(msg => {
                                        Toast({
                                            message: "服务器异常",
                                            position: "bottom"
                                        });
                                    });
                            } else {
                                self.codeShow = false;
                            }
                        } else {
                            self.codeShow = false;
                        }
                    } else {
                        Toast({
                            message: "服务器异常",
                            position: "bottom"
                        });
                        self.codeShow = false;
                    }
                })
                .catch(msg => {
                    self.$store.commit("setMutVuexisLoading", false);
                    Toast({
                        message: "服务器异常",
                        position: "bottom"
                    });
                    self.codeShow = false;
                });
        },
        mounted() {
            var self = this;
            var u = navigator.userAgent;
            var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if (isAndroid) {
                if (window.BenchJSInterface) {
                    window.BenchJSInterface.setTitle("抄送我的");
                    window.BenchJSInterface.setRightBtn("", "");
                }
            } else {
                var setNav = {
                    methodName: "invokeNavigationRightItemFromJS",
                    params: {
                        naviType: 0,
                        titles: [{ name: "", code: "shai" }]
                    },
                    callbackMethod: "pathFun"
                };
                if (window.webkit) {
                    window.webkit.messageHandlers.BotongApplicationCenterNavigationJSHandler.postMessage(
                        setNav
                    );
                }
            }
        },
        methods: {
            // 图片预览
            lookImgClick(eInd,imgInd) {
              var self = this;
              var arr = [];
              self.explainList[eInd].images.forEach(function(ele, ind) {
                arr.push({ img: ele.url });
              });
              this.WatchBigPicture(arr, imgInd);
            },
            // 明细图片预览
            detaillLookImgClick(eInd, conInd, attInd, imgInd) {
              var self = this;
              var arr = [];
              this.explainList[eInd].contents[conInd].attrs[attInd].images.forEach(function(ele, ind) {
                arr.push({ img: ele.url });
              });
              this.WatchBigPicture(arr, imgInd);
            },

            ...mapActions(["getapprovalApprovalDetail", "getapprovalupdateisread"])
        },

        watch: {},
        filters: {
            // 过滤时间
            dataFun: function (val) {
                if (val) {
                    var standardTime = new Date(Number(val));
                    var y, m, d, h, f;
                    y = standardTime.getFullYear();
                    m = standardTime.getMonth() + 1;
                    m = m > 9 ? m : "0" + m;
                    d = standardTime.getDate();
                    d = d > 9 ? d : "0" + d;
                    return y + "-" + m + "-" + d;
                } else {
                    return "无";
                }
            },
            // 过滤时间
            timeFun: function (val) {
                if (val) {
                    var standardTime = new Date(Number(val));
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
                    return "";
                }
            },
            typeFun: function (val) {
                if (val == "4") {
                    return "已撤销";
                } else if (val == "3") {
                    return "已转交";
                } else if (val == "2") {
                    return "已拒绝";
                } else if (val == "1") {
                    return "已同意";
                } else if (val == "0") {
                    return "等待审批";
                } else if (val == "10") {
                    return "发起申请";
                }
            },
            nameFun: function (val) {
                if (val) {
                    if (val.length > 2) {
                        return val.slice(val.length - 2);
                    } else {
                        return val;
                    }
                }
            }
        }
    };
</script>
<style scoped>
    .detailsExamine {
        min-height: 100vh;
        width: 100%;
        overflow-x: hidden;
        background: #e3e3e3;
        user-select: none;
    }

    .codeNo {
        width: 100vw;
        text-align: center;
        height: 100vh;
        font-size: 0.3733rem;
        color: rgba(132, 132, 132, 1);
        line-height: 0.3733rem;
        background-color: #f1f1f1;
        margin: 0 auto;
    }

    .nullContent {
        height: 2.6133rem;
    }

    .nullImg {
        width: 2.24rem;
        height: 2.6133rem;
    }

    .nullText {
        height: 0.6667rem;
        width: 100%;
        height: 0.3733rem;
        font-size: 0.3733rem;
        font-family: PingFangSC-Regular;
        color: rgba(132, 132, 132, 1);
        line-height: 0.3733rem;
        text-align: center;
        margin-top: 0.6133rem;
    }

    .detailsTop {
        width: 100%;
        height: 1.7067rem;
        display: flex;
        background: white;
        border-top: 1px solid #e3e3e3;
        border-bottom: 1px solid #e3e3e3;
        position: relative;
    }

    .detailsTopImg {
        width: 1.1733rem;
        height: 1.1733rem;
        margin: 0.2667rem 0.32rem 0.2667rem 0.4267rem;
    }

    .detailsTopImg img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }

    .detailsTopImgFont {
        width: 1.1733rem;
        height: 1.1733rem;
        margin: 0.2667rem 0.32rem 0.2667rem 0.4267rem;
        background: #1e90ff;
        border-radius: 100%;
        text-align: center;
        line-height: 1.1733rem;
        color: white;
    }

    .detailsTopFont {
        width: 280px;
        height: 44px;
        margin: 0.2667rem 0 0.2667rem 0;
    }

    .detailsTopFontTop,
    .detailsTopFontFoot {
        width: 7.4667rem;
        height: 0.5867rem;
        line-height: 0.5867rem;
    }

    .detailsTopFontTop {
        font-size: 0.4267rem;
        color: #2c2c2c;
    }

    .detailsTopFontFoot {
        font-size: 0.3733rem;
        color: #848484;
    }

    .detailsTopFontFootRight {
        margin-left: 0.3733rem;
    }

    .detailsContent {
        width: 100%;
        padding: 0.32rem 0;
        background: white;
    }

    .detailsContentLI {
        display: flex;
        width: 100%;
        margin: 0.1067rem 0;
        padding-left: 0.4267rem;
        padding-bottom: 1px;
    }

    .detailsContentLeft {
        width: 2rem;
        line-height: 0.4267rem;
        font-size: 0.3733rem;
        color: #848484;
    }

    .detailsContentLabel {
        width: 100%;
        padding-left: 18px;
        overflow: hidden;
    }

    .detailsFont {
        width: 100%;
        margin: 0.1067rem 0;
        padding-left: 0.4267rem;
        padding-bottom: 1px;
        font-size: 0.3733rem;
        color: #848484;
    }

    .detailsContentRight {
        width: 6.5333rem;
        font-size: 0.3733rem;
        line-height: 0.4267rem;
        margin-left: 0.3733rem;
        color: #2c2c2c;
    }

    .detailsContentRight pre {
        width: 100%;
        white-space: pre-wrap;
        /*css-3*/
        white-space: -moz-pre-wrap;
        /*Mozilla,since1999*/
        white-space: -pre-wrap;
        /*Opera4-6*/
        white-space: -o-pre-wrap;
        /*Opera7*/
        word-wrap: break-word;
        /*InternetExplorer5.5+*/
    }

    .leaveImgCenter {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding: 0 0.32rem;
    }

    .leaveImgFor {
        width: 1.6533rem;
        height: 1.6533rem;
        border: 1px solid #e3e3e3;
        margin: 0 0.1067rem 0.3733rem 0.1067rem;
    }

    .leaveImgFor img {
        width: 100%;
        height: 100%;
    }

    .detailsPerson {
        width: 100%;
        background: white;
        padding-top: 0.4267rem;
        margin: 0.32rem 0;
        display: table;
    }

    .personLi {
        width: 100%;
        height: 0.96rem;
        margin-bottom: 0.4267rem;
        display: flex;
    }

    .personImg {
        width: 0.96rem;
        height: 0.96rem;
        margin-left: 0.4267rem;
    }

    .personImg img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }

    .personImgFont {
        width: 0.96rem;
        height: 0.96rem;
        margin-left: 0.4267rem;
        background: #1e90ff;
        border-radius: 100%;
        text-align: center;
        line-height: 0.96rem;
        color: white;
    }

    .personContent {
        width: 5rem;
        height: 0.96rem;
        line-height: 0.96rem;
        font-size: 0.3733rem;
        margin-left: 0.3733rem;
        color: #848484;
    }

    .personType {
        margin-left: 0.3733rem;
    }

    .fontRed {
        color: #ea6262 !important;
    }

    .fontGreen {
        color: #4fa97d !important;
    }

    .personTime {
        width: 3.4667rem;
        height: 0.96rem;
        line-height: 0.96rem;
        font-size: 0.32rem;
        color: #c0c0c0;
    }

    .approver {
        width: 100%;
        background: white;
        margin-bottom: 1.2rem;
        overflow: hidden;
        padding-bottom: 0.4267rem;
    }

    .approverTop {
        display: flex;
    }

    .approverTopLeft {
        min-width: 1.28rem;
        height: 0.4267rem;
        font-size: 0.4267rem;
        line-height: 0.4267rem;
        color: #2b2b2b;
        margin: 0.4267rem 0.1067rem 0 0.4267rem;
    }

    .approverTopRight {
        min-width: 2.88rem;
        height: 0.3733rem;
        line-height: 0.3733rem;
        margin-top: 0.48rem;
        color: #848484;
    }

    .approverFor ul {
        width: 100%;
        padding: 0 0.16rem;
        display: flex;
        flex-wrap: wrap;
    }

    .approverLi {
        width: 0.96rem;
        height: 1.5467rem;
        margin: 0.4267rem 0.48rem 0 0.48rem;
    }

    .approverLiTop {
        width: 0.96rem;
        height: 0.96rem;
        margin-bottom: 0.2133rem;
    }

    .approverLiTop img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }

    .approverLiTopFont {
        width: 0.96rem;
        height: 0.96rem;
        margin-bottom: 0.2133rem;
        background: #1e90ff;
        border-radius: 100%;
        text-align: center;
        line-height: 0.96rem;
        color: white;
    }

    .approverLiFont {
        width: 1.4933rem;
        height: 0.3733rem;
        margin-left: -0.2667rem;
        text-align: center;
        color: #848484;
        line-height: 0.3733rem;
    }

    .revocation {
        width: 100%;
        height: 1.28rem;
        line-height: 1.28rem;
        text-align: center;
        font-size: 0.48rem;
        color: #4390e1;
        background: white;
    }

    .iconImg {
        width: 98px;
        height: 98px;
        position: absolute;
        top: 10px;
        right: 29px;
    }

    .iconImg img {
        width: 100%;
        height: 100%;
    }
</style>