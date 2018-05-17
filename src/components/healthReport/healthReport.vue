<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="home">
        <div class="content" v-show="!pathShow">
            <ul>
                <li class="abnormal contentLi">
                    <div>
                        异常指标
                    </div>
                    <div>
                        <div class="abnormalList" v-show="lists.length > 0">
                            <ul>
                                <li v-for="(item,index) in lists" :key="item.id">
                                    <div class="abnormalLi">
                                        <div class="li-left">
                                            <div>
                                                <img src="/static/img/默认@2x.png" alt="">
                                            </div>
                                            <div class="li-left-right">
                                                <div>
                                                    <div>{{item.indexName}} </div>
                                                    <small>{{item.indexUnit}}</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="li-right">
                                            <div>
                                                {{item.status | statusFun}}
                                            </div>
                                            <div>
                                                {{item.indexValue}}
                                            </div>
                                            <div @touchstart="searchTouchstart($event)" @touchend="searchTouchend($event,index)">
                                                <img v-if="!item.tipImgShow" src="/static/img/Rectangle3.png" alt="">
                                                <img v-else src="/static/img/Rectangle4.png" alt="">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="abnormalTip" v-show="item.tipImgShow">
                                        <span v-show="item.status == 1">
                                            {{item.lowContent}}
                                        </span>
                                        <span v-show="item.status == -1">
                                            {{item.lowContent}}
                                        </span>
                                        <span v-show=" item.status != -1 && item.status != 1">
                                            您的{{item.indexName}}指标正常
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li class="suggest contentLi">
                    <div>
                        综合建议
                    </div>
                    <div v-show="lists.length == 0">
                        根据您的体检报告数据，发现您可能有一下部分可能：
                    </div>
                    <div>
                        <textarea readonly="readonly">{{tip}}</textarea>
                    </div>
                </li>
            </ul>
        </div>
        <div v-show="pathShow" class="nullShow">
            暂无数据
        </div>
    </div>
</template>
<script>
    import { mapActions, mapState } from "vuex";
    export default {
        data() {
            return {
                pathShow: false,
                startTouchSearch: 0,
                nullName: "暂无数据",
                lists: [],
                tip: "",
                tipImgShow: 0
            };
        },
        computed: mapState([""]),
        filters: {
            statusFun(val) {
                if (val) {
                    if (val == -1) {
                        return "偏低";
                    } else if (val == 0) {
                        return "正常";
                    } else if (val == 1) {
                        return "偏高";
                    }
                } else {
                    return "无";
                }
            }
        },
        created: function () {
            var urlStr = location.href;
            var self = this;
            document.title = "分析报告";
            var userId = self.$route.query.userId;
            var reportOrginalId = self.$route.query.reportOrginalId;
            if (userId != undefined && reportOrginalId != undefined) {
                var obj = {
                    userId: "",
                    reportOrginalId: ""
                };
                if (reportOrginalId == 0) {
                    obj = {
                        userId: userId,
                        reportOrginalId: ""
                    };
                } else {
                    obj = {
                        userId: userId,
                        reportOrginalId: reportOrginalId
                    };
                }
                self.gethealthReportgetAbnormalReport(obj)
                    .then(data => {
                        if (data.code == 200) {
                            if (data.data) {
                                self.tip = data.data.tip;
                                if (data.data.indexList.length > 0) {
                                    var arr = [];
                                    data.data.indexList.forEach(function (ele, ind) {
                                        self.lists.push({
                                            highContent: ele.highContent,
                                            indexName: ele.indexName,
                                            indexUnit: ele.indexUnit,
                                            indexValue: ele.indexValue,
                                            lowContent: ele.lowContent,
                                            status: ele.status,
                                            tipImgShow: false,
                                        })
                                    })
                                } else {
                                    self.lists = [];
                                }
                            } else {
                                self.lists = [];
                                self.pathShow = true;
                                self.tip = "您的身体很健康。继续保持哦";
                            }
                        } else {
                            self.lists = [];
                            self.pathShow = true;
                            self.tip = "您的身体很健康。继续保持哦";
                        }
                    })
                    .catch(msg => {
                        self.lists = [];
                        self.pathShow = true;
                        self.tip = "您的身体很健康。继续保持哦";
                    });
            } else {
                self.pathShow = true;
            }
        },
        beforeDestroy: function () { },
        watch: {},
        methods: {
            searchTouchstart(event) {
                this.startTouchSearch = event.changedTouches[0].clientY;
            },
            searchTouchend(event, index) {
                var self = this;
                var distance = event.changedTouches[0].clientY - this.startTouchSearch;
                if (15 > distance && distance > -15) {
                    this.lists[index].tipImgShow = !this.lists[index].tipImgShow
                }
            },
            ...mapActions(["gethealthReportgetAbnormalReport"])
        }
    };
</script>
<style scoped>
    .li-left-right>div:nth-child(1) {
        font-size: 1.365rem;
        color: #303030;
        line-height: 4.779rem;
        height: 100%;
        display: flex;
    }

    .li-left-right>div:nth-child(1)>div:nth-child(1) {
        max-width: 65%;
        height: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .li-left-right>div:nth-child(1) small {
        font-size: 0.853rem;
        color: #999;
        margin-left: 0.3rem;
    }

    .li-left-right {
        margin-left: 1.024rem;
        max-height: 4.779rem;
        max-width: 62%;
    }

    .li-right>div:nth-child(1) {
        min-width: 3.755rem;
        height: 1.58rem;
        border-radius: 2px;
        background-color: #f43530;
        color: #fff;
        font-size: 0.824rem;
        line-height: 1.58rem;
        text-align: center;
        margin-right: 0.3rem;
    }

    .li-right>div:nth-child(2) {
        font-size: 1.2rem;
        color: #303030;
        margin-right: 0.9rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 4rem;
        min-width: 3.5rem;
        text-align: right;
    }

    .li-right>div:nth-child(3) {
        width: 3.072rem;
        height: 3.072rem;
        margin-right: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .li-left> :nth-child(1) img {
        width: 1.26rem;
        height: 1.26rem;
    }

    .li-left> :nth-child(1) {
        width: 3.072rem;
        height: 3.072rem;
        margin-left: 0.853rem;
    }

    .li-left> :nth-child(1) img {
        width: 100%;
        height: 100%;
    }

    .li-left {
        display: flex;
        align-items: center;
        height: 100%;
        max-width: 53%;
    }

    .li-right {
        display: flex;
        align-items: center;
        height: 100%;
    }

    .abnormalLi {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .abnormalList {
        width: 100%;
        min-height: 1rem;
    }

    .abnormalList li {
        width: 100%;
    }

    .abnormalTipGood {
        padding-left: 1.779rem;
        padding-right: 1.8rem;
        font-size: 1.28rem;
        color: #303030;
        line-height: 1.09rem;
        margin-bottom: 1.5rem;
    }

    .abnormalTip {
        padding-left: 4.779rem;
        padding-right: 1.8rem;
        font-size: 1.28rem;
        color: #303030;
        line-height: 2.09rem;
    }

    .suggest {
        margin-top: 0.683rem;
    }

    .suggest>div:nth-child(2) {
        padding-left: 1.024rem;
        padding-right: 1.024rem;
        font-size: 1.24rem;
        color: #303030;
        line-height: 1.92rem;
        margin-bottom: 0.9rem;
    }

    .suggest>div:nth-child(3){
        width: 90%; 
        margin: auto;
        margin-bottom: 3rem;
    }

    textarea {
        font-size: 1.24rem;
        color: #303030;
        resize: none;
        width: 100%;
        height: 22rem;
        border: none;
        overflow-x: hidden;
    }

    .contentLi {
        width: 100%;
        min-height: 4.096rem;
        background-color: #fff;
        overflow: hidden;
    }

    .contentLi>div:nth-child(1) {
        height: 4.096rem;
        width: 100%;
        font-size: 1.365rem;
        color: #303030;
        line-height: 4.096rem;
        overflow: hidden;
        margin-left: 1.024rem;
    }

    .content {
        min-height: 5rem;
        width: 100%;
    }

    .nullShow {
        height: 10rem;
        color: #e6e6e6;
        font-size: 3rem;
        text-align: center;
        line-height: 10rem;
    }

    .home {
        width: 100vw;
        background-color: #f7f7f7;
        overflow-x: hidden;
        /* overflow-y: scroll; */
        min-height: 100vh;
    }
</style>