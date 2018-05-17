<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="commodity">
        <div class="commImg">
            <mt-swipe :auto="4000">
                <mt-swipe-item v-for="swipe in swipeImgs" :key="swipe.productUrl">
                    <img :src="swipe.productUrl" alt="image">
                </mt-swipe-item>
            </mt-swipe>
        </div>
        <div class="commContent">
            <ul>
                <li class="commAttribute">
                    <div>
                        规格
                    </div>
                    <div>
                        {{commityObj.skuName}}
                    </div>
                </li>
                <li class="commAttribute" v-show="productTranceShow">
                    <div>
                        定制
                    </div>
                    <div>
                        已完成定制
                    </div>
                </li>
                <li class="commAttribute">
                    <div>
                        送至
                    </div>
                    <div>
                        {{commityObj.productRegion}}
                    </div>
                </li>
                <li class="commComment">
                    <div class="commCommentOne">
                        <div>
                            评价（4）
                        </div>
                        <div class="commCommentList">
                            <ul>
                                <li v-show="comments.length > 0" v-for="item in comments" class="commCommentListLi">
                                    <div class="commentLeft">
                                        <div>
                                            <img :src="item.img" alt="">
                                        </div>
                                    </div>
                                    <div class="commentRight">
                                        <div>
                                            {{item.name}}
                                        </div>
                                        <div>
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
                                        <div>
                                            {{item.comments}}
                                        </div>
                                    </div>
                                </li>
                                <li v-show="comments.length == 0" class="nullTextLi">
                                    暂无评价
                                </li>
                            </ul>
                        </div>
                        <div v-show="comments.length > 0" class="commCommentLook">
                            <div @touchend="commmentsTouchend">
                                查看更多评价
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import {
        mapActions,
        mapState
    } from 'vuex'
    import { Toast } from 'mint-ui';
    export default {
        data() {
            return {
                commityObj: {
                    img: '/static/img/01.jpg',
                    productRegion: '',
                    skuName: ''
                },
                swipeImgs: [
                    { productUrl: '/static/img/01.png' }
                ],
                productTranceShow: false,
                comments: [
                    { name: '我的名字叫lila', img: '/static/img/11@3x.png', comments: '第二次购买了，个人感觉还可以，下次会再来买其他的。', date: '2017-08-19', color: '白色', chima: 'L' },
                    { name: '遥远的北方', img: '/static/img/16@3x.png', comments: '质量很好，物流也很快，各方面都满意！', date: '2017-08-27', color: '白色', chima: 'L' }
                ]
            }
        },
        computed: mapState(['']),
        filters: {},
        created: function () {
            var self = this
            var urlStr = location.href
            var paths = ''
            var code = ''
            document.title = "商品详情"
            if (urlStr.indexOf('?')) {
                if (urlStr.indexOf('?') != -1) {
                    paths = urlStr.split('?')[1]
                    if (paths.indexOf('=')) {
                        if (paths.indexOf('=') != -1) {
                            var id = self.$route.query.id
                            if (id) {
                                self.getproductListGetProductInfo({
                                    productId: id
                                }).then((data) => {
                                    console.log('商品详情', JSON.parse(JSON.stringify(data)))
                                    self.loading = false
                                    if (data.code == 200) {
                                        if (data.data) {
                                            if (data.data.pictureList) {
                                                if (data.data.pictureList.length > 0) {
                                                    self.swipeImgs = data.data.pictureList
                                                } else {
                                                    self.swipeImgs = [
                                                        { productUrl: '/static/img/01.jpg' }
                                                    ]
                                                }
                                            } else {
                                                self.commityObj.skuName = '/static/img/01.jpg'
                                            }
                                            if (data.data.repertoryList) {
                                                self.commityObj.skuName = data.data.repertoryList[0].skuName
                                            } else {
                                                self.commityObj.skuName = '暂无信息'
                                            }
                                            if (data.data.productTrance == 1 && data.data.TranceState == 1) {
                                                self.productTranceShow = true
                                            } else {
                                                self.productTranceShow = false
                                            }
                                            if (data.data.product.description) {
                                                if (data.data.product.description.length > 0) {
                                                    self.commityObj.productRegion = data.data.product.description
                                                } else {
                                                    self.commityObj.productRegion = '暂无信息'
                                                }
                                            } else {
                                                self.commityObj.productRegion = '暂无信息'
                                            }
                                        } else {
                                            Toast({
                                                message: '暂无数据',
                                                className: 'toastLoad'
                                            });
                                        }
                                    } else {
                                        Toast({
                                            message: '暂无数据',
                                            className: 'toastLoad'
                                        });
                                    }
                                }).catch(msg => {
                                    self.newstitle = '暂无数据'
                                    console.log(msg)
                                    Toast({
                                        message: '服务器错误',
                                        className: 'toastLoad'
                                    });
                                })
                            } else {
                                console.log('网址错误')
                                Toast({
                                    message: '网址错误',
                                    className: 'toastLoad'
                                });
                            }
                        } else {
                            console.log('网址错误')
                            Toast({
                                message: '网址错误',
                                className: 'toastLoad'
                            });
                        }
                    } else {
                        console.log('网址错误')
                        Toast({
                            message: '网址错误',
                            className: 'toastLoad'
                        });
                    }
                } else {
                    console.log('网址错误')
                    Toast({
                        message: '网址错误',
                        className: 'toastLoad'
                    });
                }
            } else {
                console.log('网址错误')
                Toast({
                    message: '网址错误',
                    className: 'toastLoad'
                });
            }
        },
        beforeDestroy: function () { },
        watch: {},
        methods: {
            commmentsTouchend() {
                var self = this
                this.$router.push({
                    path: '/mall/particulars/evaluate',
                    query: self.$route.query
                })
            },
            ...mapActions(['getproductListGetProductInfo'])
        }
    }

</script>
<style scoped>
    .nullTextLi {
        height: 10rem;
        width: 100%;
        background-color: #fff;
        color: #e5e5e5;
        font-size: 3rem;
        text-align: center;
        line-height: 10rem;
    }
    
    .commentLeft {
        width: 3.84rem;
        height: 100%;
    }
    
    .commentLeft>div {
        width: 3.84rem;
        height: 3.84rem;
        border-radius: 50%;
        overflow: hidden;
        margin-top: 1.28rem;
    }
    
    .commentLeft>div img {
        width: 100%;
        height: 100%;
    }
    
    .commentRight {
        margin-top: 1.28rem;
        margin-left: 0.853rem;
        width: calc(100vw - 6.629rem);
        border-bottom: 1px solid #efefef;
    }
    
    .commentRight>div:nth-child(1) {
        height: 1.3653rem;
        font-size: 1.3rem;
        line-height: 1.3653rem;
        color: #030303;
        opacity: 0.8;
        width: 100%;
        overflow-y: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    
    .commentRight>div:nth-child(2) {
        margin-top: 0.8533rem;
        height: 1.3653rem;
        font-size: 1.30rem;
        width: 100%;
        display: flex;
        align-items: center;
    }
    
    .commentRight>div:nth-child(2)>div {
        width: 1.28rem;
        height: 1.28rem;
        overflow: hidden;
        margin-right: 0.427rem;
    }
    
    .commentRight>div:nth-child(2)>div img {
        width: 100%;
        height: 100%;
    }
    
    .commentRight>div:nth-child(3) {
        margin-top: 1.28rem;
        height: 1.3rem;
        font-size: 1.2rem;
        line-height: 1.3rem;
        color: #030303;
        opacity: 0.8;
        width: 100%;
        overflow-y: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    
    .commCommentListLi {
        height: 8.5333rem;
        width: 100%;
        display: flex;
        padding-left: 1.109rem;
        overflow: hidden;
    }
    
    .commCommentOne>div:nth-child(1) {
        height: 3.755rem;
        width: 100%;
        line-height: 3.755rem;
        font-size: 1.109rem;
        color: #b0b0b0;
        border-bottom: 1px solid #efefef;
        padding-left: 1.109rem;
        overflow: hidden;
    }
    
    .commCommentLook {
        height: 5.632rem;
        line-height: 5.632rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #efefef;
    }
    
    .commCommentLook>div {
        width: 22.955rem;
        height: 2.731rem;
        border: 1px solid #ff9a54;
        line-height: 2.731rem;
        color: #ff9a54;
        font-size: 1.28rem;
        border-radius: 3px;
    }
    
    .commCommentOne {
        min-height: 3.755rem;
        /*height: 26.027rem;*/
        background-color: #fcfcfc;
        overflow: hidden;
        width: 100%;
        margin-bottom: 1.451rem;
    }
    
    .commComment {
        margin-top: 0.853rem;
        min-height: 5.206rem;
        /*height: 27.648rem;*/
        overflow: hidden;
        width: 100%;
        background-color: #f5f5f5;
    }
    
    .commContent {
        min-height: 22.527rem;
        /*height: 46.42rem;*/
        width: 100%;
        overflow: hidden;
    }
    
    .commAttribute {
        width: 100%;
        height: 3.84rem;
        display: flex;
        align-items: center;
        background-color: #fcfcfc;
    }
    
    .commAttribute:nth-child(2) {
        margin-top: 0.853rem;
    }
    
    .commAttribute:nth-child(3) {
        margin-top: 0.853rem;
    }
    
    .commAttribute:nth-child(4) {
        margin-top: 0.853rem;
    }
    
    .commAttribute>div:nth-child(1) {
        width: 3.413rem;
        text-align: right;
        font-size: 1.109rem;
        color: #b0b0b0;
    }
    
    .commAttribute>div:nth-child(2) {
        margin-left: 1.28rem;
        width: calc(100vw - 6.06rem);
        font-size: 1.28rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #393939;
    }
    
    .commImg {
        width: 100%;
        height: 29.867rem;
        border: 0;
        background-color: #f3f3f3;
    }
    
    .commImg img {
        width: 100%;
        height: 100%;
        border: 0;
    }
    
    .commodity {
        width: 100%;
        min-height: 52.394rem;
        overflow: hidden;
        background-color: #f5f5f5;
    }
</style>