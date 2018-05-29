export default [
    // ---------------------------分享---------------------
    {
        // 分享公告
        path: '/noticeShare',
        component: function (resolve) {
            require(['./components/share/announcementShare.vue'], resolve)
        }
    },
    {
        // 分享日志
        path: '/logShare',
        component: function (resolve) {
            require(['./components/share/logShare.vue'], resolve)
        }
    },
    {
        // 收藏资讯
        path: '/enterpriseDetailsShare',
        component: function (resolve) {
            require(['./components/share/enterpriseDetailsShare.vue'], resolve)
        }
    },
    {
        //新功能介绍
        path: '/newFunction',
        component: function (resolve) {
            require(['./components/share/newFunctionIntroduction.vue'], resolve)
        }
    },
    {
        //服务协议
        path: '/serviceAgreement',
        component: function (resolve) {
            require(['./components/share/serviceAgreement.vue'], resolve)
        }
    },
    {
        //版权信息
        path: '/copyRight',
        component: function (resolve) {
            require(['./components/share/copyRight.vue'], resolve)
        }
    },
    {
        //隐私政策
        path: '/privacy',
        component: function (resolve) {
            require(['./components/share/privacy.vue'], resolve)
        }
    },
    {
        // 通告审批
        path: '/examineHandle',
        component: function (resolve) {
            require(['./components/share/examineHandle.vue'], resolve)
        }
    },
    // ---------------------------审批---------------------
    {
        // 审批列表
        path: '/examine',
        component: function (resolve) {
            require(['./components/examine/examine.vue'], resolve)
        }
    },
    {
        // 审批操作
        path: '/leave',
        component: function (resolve) {
            require(['./components/examine/leave.vue'], resolve)
        }
    },
    {
        // 我发起的
        path: '/started',
        component: function (resolve) {
            require(['./components/examine/started.vue'], resolve)
        }
    },
    {
        // 我发起的筛选
        path: '/sponsorScreen',
        component: function (resolve) {
            require(['./components/examine/sponsorScreen.vue'], resolve)
        }
    },
    {
        // 审批-我发起的详情
        path: '/detailsExamine',
        component: function (resolve) {
            require(['./components/examine/detailsExamine.vue'], resolve)
        }
    },
    {
        // 我审批的筛选列表
        path: '/nightExamine',
        component: function (resolve) {
            require(['./components/examine/nightExamine.vue'], resolve)
        }
    },
    {
        // 我审批的-待我审批的-筛选
        path: '/awaitExamineScreen',
        component: function (resolve) {
            require(['./components/examine/awaitExamineScreen.vue'], resolve)
        }
    },
    {
        // 审批-我审批的审批详情
        path: '/iAmDetailsExamine',
        component: function (resolve) {
            require(['./components/examine/iAmDetailsExamine.vue'], resolve)
        }
    },
    {
        // 抄送我的
        path: '/copyTo',
        component: function (resolve) {
            require(['./components/examine/copyTo.vue'], resolve)
        }
    },
    {
        // 抄送我的-详情
        path: '/copyToDetails',
        component: function (resolve) {
            require(['./components/examine/copyToDetails.vue'], resolve)
        }
    },
    {
        // 抄送我的-筛选
        path: '/copyToScreen',
        component: function (resolve) {
            require(['./components/examine/copyToScreen.vue'], resolve)
        }
    },

    // ---------------------------资讯---------------------
    {
        // 资讯首页
        path: '/information',
        component: function (resolve) {
            require(['./components/information/information.vue'], resolve)
        }
    },
    {
        // 资讯首页搜索
        path: '/informationSearch',
        component: function (resolve) {
            require(['./components/information/informationSearch.vue'], resolve)
        }
    },
    {
        // 企业文化列表
        path: '/enterpriseINformation',
        component: function (resolve) {
            require(['./components/information/enterpriseINformation.vue'], resolve)
        }
    },
    {
        // 企业文化详情
        path: '/enterpriseDetails',
        component: function (resolve) {
            require(['./components/information/enterpriseDetails.vue'], resolve)
        }
    },
    {
        // 公司制度
        path: '/informationList',
        component: function (resolve) {
            require(['./components/information/informationList.vue'], resolve)
        }
    },
    {
        // 培训制度
        path: '/trainList',
        component: function (resolve) {
            require(['./components/information/trainList.vue'], resolve)
        }
    },
    {
        // 查看资讯
        path: '/informationLook',
        component: function (resolve) {
            require(['./components/information/informationLook.vue'], resolve)
        }
    },
    {
        // 资讯编辑发布
        path: '/informationNewly',
        component: function (resolve) {
            require(['./components/information/informationNewly.vue'], resolve)
        }
    },
    {
        // 资讯查看和未查看人
        path: '/informationNy',
        component: function (resolve) {
            require(['./components/information/informationNy.vue'], resolve)
        }
    },
    // ---------------------------公告选择通讯录---------------------
    {
        // 多选-选择首页
        path: '/multipleSelectHome',
        component: function (resolve) {
            require(['./components/cModule/multipleSelectHome.vue'], resolve)
        }
    },
    {
        // 多选-选择
        path: '/multipleSelect',
        component: function (resolve) {
            require(['./components/cModule/multipleSelect.vue'], resolve)
        }
    },
    // ---------------------------签到---------------------
    {
        // 签到首页
        path: '/sign',
        component: function (resolve) {
            require(['./components/sign/sign.vue'], resolve)
        }
    },
    {
        // 日常签到
        path: '/normalSign',
        component: function (resolve) {
            require(['./components/sign/normalSign.vue'], resolve)
        }
    },
    {
        // 外出签到
        path: '/outSign',
        component: function (resolve) {
            require(['./components/sign/outSign.vue'], resolve)
        }
    },
    {
        // 日常签到-地点微调
        path: '/siteNormalSign',
        component: function (resolve) {
            require(['./components/sign/siteNormalSign.vue'], resolve)
        }
    },
    {
        // 外出签到-地点微调
        path: '/siteOutSign',
        component: function (resolve) {
            require(['./components/sign/siteOutSign.vue'], resolve)
        }
    },
    {
        // 日常签到-地点微调搜索结果
        path: '/siteNormalSearchResult',
        component: function (resolve) {
            require(['./components/sign/siteNormalSearchResult.vue'], resolve)
        }
    },
    {
        // 外出签到-地点微调搜索结果
        path: '/siteOutSearchResult',
        component: function (resolve) {
            require(['./components/sign/siteOutSearchResult.vue'], resolve)
        }
    },
    {
        // 日常签到操作主页
        path: '/optionNormalSign',
        component: function (resolve) {
            require(['./components/sign/optionNormalSign.vue'], resolve)
        }
    },
    {
        // 外出签到操作主页
        path: '/optionOutSign',
        component: function (resolve) {
            require(['./components/sign/optionOutSign.vue'], resolve)
        }
    },
    {
        //  日常统计主页
        path: '/statisticsNormalSign',
        component: function (resolve) {
            require(['./components/sign/statisticsNormalSign.vue'], resolve)
        }
    },
    {
        // 外出统计主页
        path: '/statisticsOutSign',
        component: function (resolve) {
            require(['./components/sign/statisticsOutSign.vue'], resolve)
        }
    },
    {
        // 日常签到设置
        path: '/setNormalSign',
        component: function (resolve) {
            require(['./components/sign/setNormalSign.vue'], resolve)
        }
    },
    {
        // 设置
        path: '/setOutSign',
        component: function (resolve) {
            require(['./components/sign/setOutSign.vue'], resolve)
        }
    },
    {
        // 日常签到我的
        path: '/myNormalSign',
        component: function (resolve) {
            require(['./components/sign/myNormalSign.vue'], resolve)
        }
    },
    {
        // 外出签到我的
        path: '/myOutSign',
        component: function (resolve) {
            require(['./components/sign/myOutSign.vue'], resolve)
        }
    },
    // ---------------------------------日志---------------------
    {
        // 写日志
        path: '/writeLog',
        component: function (resolve) {
            require(['./components/log/writeLog.vue'], resolve)
        }
    },
    {
        // 查看日志
        path: '/lookLog',
        component: function (resolve) {
            require(['./components/log/lookLog.vue'], resolve)
        }
    },
    {
        // 所有日志
        path: '/allLog',
        component: function (resolve) {
            require(['./components/log/allLog.vue'], resolve)
        }
    },
    {
        // 日志报表
        path: '/logList',
        component: function (resolve) {
            require(['./components/log/logList.vue'], resolve)
        }
    },
    {
        // 日志报表搜索
        path: '/logSearchList',
        component: function (resolve) {
            require(['./components/log/logSearchList.vue'], resolve)
        }
    },
    {
        // 日志管理员-管理
        path: '/managementList',
        component: function (resolve) {
            require(['./components/log/managementList.vue'], resolve)
        }
    },
    {
        // 日志-图片展示
        path: '/imgList',
        component: function (resolve) {
            require(['./components/log/imgList.vue'], resolve)
        }
    },
    {
        // 日志管理员-管理筛选
        path: '/managementListSearch',
        component: function (resolve) {
            require(['./components/log/managementListSearch.vue'], resolve)
        }
    },
    {
        // 未读日志
        path: '/unreadLog',
        component: function (resolve) {
            require(['./components/log/unreadLog.vue'], resolve)
        }
    },
    {
        // 日志主页
        path: '/homeLog',
        component: function (resolve) {
            require(['./components/log/homeLog.vue'], resolve)
        }
    },
    {
        // 日志设置
        path: '/settingLog',
        component: function (resolve) {
            require(['./components/log/settingLog.vue'], resolve)
        }
    },
    {
        // 日志设置-提醒周期
        path: '/settingPeriod',
        component: function (resolve) {
            require(['./components/log/settingPeriod.vue'], resolve)
        }
    },
    {
        // 日志设置-提醒月
        path: '/settingPeriodmonth',
        component: function (resolve) {
            require(['./components/log/settingPeriodmonth.vue'], resolve)
        }
    },
    {
        // 日志设置选择模板
        path: '/settingSelectModelLog',
        component: function (resolve) {
            require(['./components/log/settingSelectModelLog.vue'], resolve)
        }
    },
    {
        // 日志设置详细操作页面-管理员
        path: '/settingDetailsLogG',
        component: function (resolve) {
            require(['./components/log/settingDetailsLogG.vue'], resolve)
        }
    },
    {
        // 日志已读未读人员列表
        path: '/readStateLog',
        component: function (resolve) {
            require(['./components/log/readStateLog.vue'], resolve)
        }
    },
    // -----------------------------公告-------------------------
    {
        // 公告列表
        path: '/announcement',
        component: function (resolve) {
            require(['./components/announcement/announcement.vue'], resolve)
        }
    },
    {
        // 查看公告 公告详情
        path: '/lookAnnouncement',
        component: function (resolve) {
            require(['./components/announcement/lookAnnouncement.vue'], resolve)
        }
    },
    {
        // 编写公告-第二步
        path: '/writeSecondAnnouncement',
        component: function (resolve) {
            require(['./components/announcement/writeSecondAnnouncement.vue'], resolve)
        }
    },
    {
        // 编写公告-第一步
        path: '/writeFirstAnnouncement',
        component: function (resolve) {
            require(['./components/announcement/writeFirstAnnouncement.vue'], resolve)
        }
    },
    {
        // 公告-已读未读人列表
        path: '/acceptannouncement',
        component: function (resolve) {
            require(['./components/announcement/acceptannouncement.vue'], resolve)
        }
    },
    // ------------------------问题反馈-------------------
    {
        // 问题反馈-首页
        path: '/customerService',
        component: function (resolve) {
            require(['./components/customerService/customerService.vue'], resolve)
        }
    },
    {
        // 问题反馈-列表
        path: '/customerServiceList',
        component: function (resolve) {
            require(['./components/customerService/customerServiceList.vue'], resolve)
        }
    },
    {
        // 问题反馈-详情
        path: '/customerServiceIssueLook',
        component: function (resolve) {
            require(['./components/customerService/customerServiceIssueLook.vue'], resolve)
        }
    },
    {
        // 意见反馈-详情
        path: '/customerServiceIssueOpinionLook',
        component: function (resolve) {
            require(['./components/customerService/customerServiceIssueOpinionLook.vue'], resolve)
        }
    },
    {
        // 问题反馈-补充
        path: '/customerServiceSupplement',
        component: function (resolve) {
            require(['./components/customerService/customerServiceSupplement.vue'], resolve)
        }
    }
]

