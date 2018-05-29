
export default {
    // 日志
    VuexMylogScrollTop: 0, // 所有移动日志移动位置
    VuexVuexUnreadLogTop: 0, // 未读日志日志移动位置

    VuexMyLogLists: [], // 已发送日志缓存列表
    VuexMyLogListsIndex: 9999, // 已发送日志缓存列表index
    VuexLogLists: [], // 我收到日志缓存列表
    VuexLogListsIndex: 9999, // 我收到日志缓存列表index
    VuexMangerShow: 9, // 日志首页权限
    VuexModelLists: [], // 日志模板列表
    VuexUnreadLogLists: [], // 未读日志列表
    VuexUnreadLogListsIndex: 9999, // 未读日志缓存列表
    // 审批
    VuexNighttotalCount: 0,
    VuexNightIndex: 9999,
    VuexNightLists: [], // 我审批的列表
    VuexExamineLists: [],  // 审批首页列表

    VuexWaitedApprovalTop: 0, // 待我审批的审批位置
    VuexCompletedApprovalTop: 0, // 我已审批的审批位置

    VuexWaitedApprovalLists: [], // 待我审批列表缓存
    VuexWaitedApprovalIndex: 9999, // 待我审批列表page
    VuexWaitedApprovalClickIndex: 0, // 待我审批列表index
    VuexawaitNumberIndex: 0, // 待我审批列表数量

    VuexCompletedApprovalLists: [], // 我已审批列表缓存
    VuexCompletedApprovalIndex: 9999, // 我已审批列表page
    VuexCompletedApprovalClickIndex: 0, // 我已审批列表index


    VuexStartedListsTop: 0, // 我发出的审批的审批位置
    VuexStartedLists: [], // 我发出的审批列表缓存
    VuexStartedIndex: 9999, // 我发出的审批列表page
    VuexStartedClickIndex: 0, // 我发出的审批列表index


    VuexCopyListsTop: 0, // 抄送我的审批的审批位置
    VuexCopyLists: [], // 抄送我的审批列表缓存
    VuexCopyListsIndex: 9999, // 抄送我的审批列表page
    VuexCopyListsClickIndex: 0, // 抄送我的审批列表index

    // 公告
    VuexAdminAnnouncement: '', // 是否为管理员


    // 加载
    isLoading: false // 加载中
}
