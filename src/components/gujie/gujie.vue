<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div id="app" class="home">
        <div v-show="pathShow" class="error">
            暂无信息
        </div>
        <div class="main" v-show="!pathShow">
            <div class="mainlogo">
                <div>
                    <img src="/static/img/logo.png" alt="LOGO">
                </div>
            </div>
            <div class="mainsearch">
                <div>
                    <div class="mainsearch-i">
                        <input type="text" v-model="searchVal" placeholder="">
                    </div>
                    <div class="mainsearch-s" @touchstart="searchTouchstart($event)" @touchend="searchTouchend($event)">
                        SO一下
                    </div>
                </div>
            </div>
            <div class="mainList">
                <ul>
                    <li class="dataLi" v-for="(item,index) in list" @touchstart="listTouchstart($event)" @touchend="listTouchend($event,index)">
                        <div class="listTitle" v-html="titleFun(item.title)" style="font-size: 1.365rem;color:#030303;">
                        </div>
                        <div class="listContent" v-html="contentFun(item.content)" style="font-size: 1.28rem;color:#4c4c4c;">
                        </div>
                        <div class="listUrl">
                            <a :href="item.url">{{item.url}}</a>
                        </div>
                    </li>
                    <infinite-loading @infinite="onInfinite" ref="infiniteLoading">
                        <span slot="no-more" class="noMore">
                               没有更多的信息了！
                        </span>
                        <span slot="no-results" class="noRwsults"> 
                               暂无数据！
                        </span>
                    </infinite-loading>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapState } from 'vuex'
    import InfiniteLoading from 'vue-infinite-loading';
    import { Spinner } from 'mint-ui';
    export default {
        components: {
            InfiniteLoading,
            Spinner
        },
        data() {
            return {
                loading: true,
                pathShow: false,
                list: [],
                searchVal: '',
                startTouchSearch: 0,
                startTouchList: 0
            }
        },
        computed: mapState(['']),
        filters: {},
        created: function () {
            var self = this
            if (self.$route.query.text) {
                var text = ''
                text = self.$route.query.text
                // console.log(text)
                if (text.length > 0) {
                    self.searchVal = text
                } else {
                    self.searchVal = ''
                }
            }
        },
        beforeDestroy: function () { },
        watch: {},
        mounted() {
        },
        beforeRouteLeave(to, from, next) {
        },
        methods: {
            // search click
            listFun() {
                var self = this
                var text = self.searchVal.toString()
                if (text.length > 0) {
                    self.list = []
                    self.$router.push({
                        path: '/gujie',
                        query: { text: text, sort: self.$route.query.sort }
                    })
                    self.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                } else {
                    self.list = []
                    self.$router.push({
                        path: '/gujie',
                        query: { text: text, sort: self.$route.query.sort }
                    })
                    self.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                }
            },
            // infinite click
            onInfinite($state) {
                var self = this
                var urlStr = location.href
                var paths = ''
                if (urlStr.indexOf('?')) {
                    if (urlStr.indexOf('?') != -1) {
                        if (urlStr.indexOf('=')) {
                            if (urlStr.indexOf('=') != -1) {
                                let page = Math.ceil(self.list.length / 10) + 1
                                if (self.$route.query.text) {
                                    var text = ''
                                    text = self.$route.query.text
                                    if (text.length > 0) {
                                        self.getGusosearchartdoList({
                                            text: text,
                                            curpage: page,
                                        }).then((data) => {
                                            // console.log('搜索详情列表', JSON.parse(JSON.stringify(data)))
                                            if (data.status == 'success') {
                                                if (data.resList.length) {
                                                    self.list = self.list.concat(data.resList);
                                                    $state.loaded();
                                                } else {
                                                    $state.complete();
                                                }
                                            } else {
                                                $state.complete();
                                            }
                                        }).catch(msg => {
                                            $state.complete();
                                        })
                                    } else {
                                        self.list = []
                                        $state.complete();
                                    }
                                } else {
                                    self.list = []
                                    $state.complete();
                                }
                            } else {
                                self.list = []
                                $state.complete();
                            }
                        } else {
                            self.list = []
                            $state.complete();
                        }
                    } else {
                        self.list = []
                        $state.complete();
                    }
                } else {
                    self.list = []
                    $state.complete();
                }
            },
            // SO search
            searchTouchstart(event) {
                this.startTouchSearch = event.changedTouches[0].clientY
            },
            searchTouchend(event) {
                var self = this
                var distance = event.changedTouches[0].clientY - this.startTouchSearch
                if (15 > distance && distance > -15) {
                    self.listFun()
                }
            },
            // list click
            listTouchstart(event) {
                this.startTouchList = event.changedTouches[0].clientY
            },
            listTouchend(event, index) {
                var self = this
                var distance = event.changedTouches[0].clientY - this.startTouchList
                if (15 > distance && distance > -15) {
                    window.location.href = self.list[index].url
                }
            },
             ...mapActions(['getGusosearchartdoList'])
        }
    }

</script>
<style scoped>
    .listTitle {
        margin-top: 1.28rem;
        width: calc(100vw - 2.36rem);
        overflow: hidden;
        margin-left: 1.28rem;
        min-height: 1.413rem;
        text-align: justify;
        text-justify: inter-ideograph;
        line-height: calc(1.365rem + 10px);
    }
    
    .listContent .font {
        color: #000 !important;
    }
    
    .listContent {
        margin-top: 0.853rem;
        width: calc(100vw - 2.36rem);
        overflow: hidden;
        margin-left: 1.28rem;
        min-height: 1.413rem;
    }
    
    .listUrl {
        margin-top: 0.853rem;
        width: calc(100vw - 2.36rem);
        overflow: hidden;
        margin-left: 1.28rem;
        margin-bottom: 1.365rem;
    }
    
    .listUrl a {
        display: block;
        color: #999;
        width: calc(100vw - 2.36rem);
        font-size: 1.024rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    
    .mainList li {
        min-height: 8.201rem;
        margin-bottom: 0.853rem;
        background-color: #fff;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
    }
    
    .mainList {
        background-color: #fbfbfb;
        min-height: calc(100vh - 12.118rem);
    }
    
    .fadingShow {
        background-color: #fff;
        min-height: calc(100vh - 12.118rem);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }
    
    .mainsearch {
        height: 4.779rem;
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
    }
    
    .mainsearch-i input {
        width: 22rem;
        height: 3.072rem;
        border: 0px solid rgba(0, 0, 0, 0);
        font-size: 1.365rem;
        line-height: 3.072rem;
        color: #000;
        padding-left: 1.28rem;
    }
    
    .mainsearch-i {
        width: 22.423rem;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background-color: #fff;
    }
    
    .mainsearch-s {
        width: 6.823rem;
        background-color: #ed8251;
        text-align: center;
        line-height: 3.072rem;
        font-size: 1.365rem;
        color: #fff;
    }
    
    .mainsearch>div:nth-child(1) {
        width: 29.27rem;
        border: 1px solid #ed8251;
        display: flex;
        justify-content: space-between;
        height: 3.072rem;
    }
    
    .mainlogo {
        height: 7.339rem;
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
    }
    
    .mainlogo>div:nth-child(1) {
        height: 3.925rem;
        width: 8.533rem;
        margin-top: 2.133rem;
    }
    
    .mainlogo>div:nth-child(1) img {
        width: 100%;
        height: 100%;
    }
    
    .main {
        width: 100%;
        height: 100%;
        background-color: #f9f9f9;
    }
    
    #app {
        background-color: #fff;
        overflow-x: hidden;
        height: 100vh;
        background-color: #f9f9f9;
    }
    
    .error {
        height: 20rem;
        line-height: 20rem;
        color: #ccc;
        text-align: center;
        font-size: 3rem;
        background-color: #f9f9f9;
    }
</style>