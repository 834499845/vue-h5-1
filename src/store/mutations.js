
export default {

    // 未读滚动
    MutVuexVuexUnreadLogTop(state, val) {
        state.VuexVuexUnreadLogTop = val;
    },
    // 未读日志列表
    MutVuexUnreadLogLists(state, val) {
        state.VuexUnreadLogLists = val;
    },
    // 未读日志页面index
    MutVuexUnreadLogListsIndex(state, val) {
        state.VuexUnreadLogListsIndex = val;
    },
    // 所有滚动
    MutVuexMylogScrollTop(state, val) {
        state.VuexMylogScrollTop = val;
    },
    MutVuexMyLogLists(state, val) {
        state.VuexMyLogLists = val;
    },
    // 日志首页权限
    MutVuexMangerShow(state, val) {
        state.VuexMangerShow = val;
    },
    // 日志模板列表
    MutVuexModelLists(state, val) {
        state.VuexModelLists = val;
    },
    // 我收到的
    MutVuexMyLogListsIndex(state, val) {
        state.VuexMyLogListsIndex = val;
    },

    // 我发出的
    MutVuexLogLists(state, val) {
        state.VuexLogLists = val;
    },
    MutVuexLogListsIndex(state, val) {
        state.VuexLogListsIndex = val;
    },
    // 审批列表
    setMutVuexNightList(state, val) {
        state.VuexNightLists = val;
    },
    // 审批页码
    setMutVuexNightIndex(state, val) {
        state.VuexNightIndex = val;
    },
    // 审批总数
    setMutVuexNighttotalCount(state, val) {
        state.VuexNighttotalCount = val;
    },
    // 审批首页数据
    setMutVuexExamineLists(state, val) {
        state.VuexExamineLists = val;
    },
    // 待我审批的位置
    setMutVuexWaitedApprovalTop(state, val) {
        state.VuexWaitedApprovalTop = val;
    },
    // 我已审批的位置
    setMutVuexCompletedApprovalTop(state, val) {
        state.VuexCompletedApprovalTop = val;
    },
    // 待我审批列表缓存
    setMuVuexWaitedApprovalLists(state, val) {
        state.VuexWaitedApprovalLists = val;
    },
    // 待我审批列表page
    setMutVuexWaitedApprovalIndex(state, val) {
        state.VuexWaitedApprovalIndex = val;
    },
    // 待我审批列表index
    setMutVuexWaitedApprovalClickIndex(state, val) {
        state.VuexWaitedApprovalClickIndex = val;
    },
    // 待我审批列表数量
    setMutVuexawaitNumberIndex(state, val) {
        state.VuexawaitNumberIndex = val;
    },
    // 我已审批列表缓存
    setMutVuexCompletedApprovalLists(state, val) {
        state.VuexCompletedApprovalLists = val;
    },
    // 我已审批列表page
    setMutVuexCompletedApprovalIndex(state, val) {
        state.VuexCompletedApprovalIndex = val;
    },
    // 我已审批列表index
    setMutVuexCompletedApprovalClickIndex(state, val) {
        state.VuexCompletedApprovalClickIndex = val;
    },
    // 我发出的审批列表
    setMutVuexStartedLists(state, val) {
        state.VuexStartedLists = val;
    },
    // 我发出的审批page
    setMutVuexStartedIndex(state, val) {
        state.VuexStartedIndex = val;
    },
    // 我发出的审批位置
    setMutVuexStartedListsTop(state, val) {
        state.VuexStartedListsTop = val;
    },
    // 我发出的审批index
    setMutVuexStartedClickIndex(state, val) {
        state.VuexStartedClickIndex = val;
    },
    // 抄送我的审批列表
    setMutVuexCopyLists(state, val) {
        state.VuexCopyLists = val;
    },
    // 抄送我的审批page
    setMutVuexCopyListsIndex(state, val) {
        state.VuexCopyListsIndex = val;
    },
    // 抄送我的审批位置
    setMutVuexCopyListsTop(state, val) {
        state.VuexCopyListsTop = val;
    },
    // 抄送我的审批index
    setMutVuexCopyListsClickIndex(state, val) {
        state.VuexCopyListsClickIndex = val;
    },
    // 公告是否为管理员
    setMutVuexAdminAnnouncement(state, val) {
        state.VuexAdminAnnouncement = val;
    },
    // 加载中-显示
    setMutVuexisLoading(state, val) {
        state.isLoading = val;
    },
    // 加载中-消失
    setMutVuexisLoadingHide(state, val) {
        state.isLoading = false;
    },
}
