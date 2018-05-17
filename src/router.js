export default [
    {
        path: '/mall/particulars',
        redirect: '/mall/particulars/commodity'
    },
    {
        // 大V
        path: '/bigV',
        component: function (resolve) {
            require(['./components/bigV/bigV.vue'], resolve)
        }
    },
    {
        // 积分
        path: '/integral',
        component: function (resolve) {
            require(['./components/integral/integral.vue'], resolve)
        }
    },
    {
        // 回答详情
        path: '/answer',
        component: function (resolve) {
            require(['./components/answer/answer.vue'], resolve)
        }
    },
    {
        // 问题详情
        path: '/issue',
        component: function (resolve) {
            require(['./components/issue/issue.vue'], resolve)
        }
    },
    {
        // 投诉
        path: '/complaint',
        component: function (resolve) {
            require(['./components/complaint/complaint.vue'], resolve)
        }
    },
    {
        // 投诉
        path: '/complaintSucceed',
        component: function (resolve) {
            require(['./components/complaint/complaintSucceed.vue'], resolve)
        }
    },
    {
        // 投诉
        path: '/complaintContent',
        component: function (resolve) {
            require(['./components/complaint/complaintContent.vue'], resolve)
        }
    },
    {
        // 新闻
        path: '/news',
        component: function (resolve) {
            require(['./components/news/news.vue'], resolve)
        }
    },
    {
        // 新闻动态
        path: '/newsDynamic',
        component: function (resolve) {
            require(['./components/newsDynamic/newsDynamic.vue'], resolve)
        }
    },
    {
        // 体检报告H5
        path: '/healthReport',
        component: function (resolve) {
            require(['./components/healthReport/healthReport.vue'], resolve)
        }
    },
    {
        // 医疗文章类分享
        path: '/medical',
        component: function (resolve) {
            require(['./components/medical/medical.vue'], resolve)
        }
    },
    {
        // 医疗圈子分享
        path: '/dynamic',
        component: function (resolve) {
            require(['./components/dynamic/dynamic.vue'], resolve)
        }
    },
    {
        // 商城
        path: '/mall',
        component: function (resolve) {
            require(['./components/mall/mall.vue'], resolve)
        },
        children: [{
            path: 'lists',
            component: function (resolve) {
                require(['./components/mall/mallLists.vue'], resolve)
            }
        },
        {
            path: 'particulars',
            component: function (resolve) {
                require(['./components/mall/mallParticulars.vue'], resolve)
            },
            children: [{
                path: 'commodity',
                component: function (resolve) {
                    require(['./components/mall/commodity.vue'], resolve)
                }
            }, {
                path: 'details',
                component: function (resolve) {
                    require(['./components/mall/details.vue'], resolve)
                }
            }, {
                path: 'evaluate',
                component: function (resolve) {
                    require(['./components/mall/evaluate.vue'], resolve)
                }
            },]
        }
        ]
    },
    {
        // 商品详情
        path: '/commodity',
        component: function (resolve) {
            require(['./components/commodity/commodity.vue'], resolve)
        }
    },
    {
        // 健身H5周报
        path: '/newspaper',
        component: function (resolve) {
            require(['./components/finance/newspaper.vue'], resolve)
        }
    },
    {
        // 激励banner
        path: '/encourage',
        component: function (resolve) {
            require(['./components/encourage/encourage.vue'], resolve)
        }
    },
    {
        // app条款说明
        path: '/rule',
        component: function (resolve) {
            require(['./components/rule/rule.vue'], resolve)
        }
    },
    {
        // app条款说明
        path: '/gujie',
        component: function (resolve) {
            require(['./components/gujie/gujie.vue'], resolve)
        }
    },
    {
        //新闻视频分享
        path: '/newsVideo',
        component: function (resolve) {
            require(['./components/newsVideo/newsVideo.vue'], resolve)
        }
    }
]
