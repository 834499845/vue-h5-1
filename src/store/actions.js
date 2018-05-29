import Vue from 'vue'
require("../../API/config")
import notice from '../assets/notice'
import sign from '../assets/sign'
import exam from '../assets/exam'
import log from '../assets/log'
import info from '../assets/info'
import comments from '../assets/comments'
import feed from '../assets/feed'
export default {
    // 签到-日常签到
    // 日常签到-查看部门签到设置
    getSignApiSignGetSetting({ }, postdata) {
        return sign.SignApiSignGetSetting(global.SignApiSignGetSettingPath, postdata)
    },
    // 日常签到-按月查询我的签到列表
    getSignApiSignQueryMonthInfo({ }, postdata) {
        return sign.SignApiSignQueryMonthInfo(global.SignApiSignQueryMonthInfoPath, postdata)
    },
    // 日常签到-查询当日签到次数
    getSignApiSignGetSignInfo({ }, postdata) {
        return sign.SignApiSignGetSignInfo(global.SignApiSignGetSignInfoPath, postdata)
    },
    // 日常签到-日常签到设置
    getSignApiSignSetting({ }, postdata) {
        return sign.SignApiSignSetting(global.SignApiSignSettingPath, postdata)
    },
    // 日常签到-日常统计接口
    getSignApiSignSignCount({ }, postdata) {
        return sign.SignApiSignSignCount(global.SignApiSignSignCountPath, postdata)
    },
    // 日常签到-日常签到接口
    getSignApiSignToSign({ }, postdata) {
        return sign.SignApiSignToSign(global.SignApiSignToSignPath, postdata)
    },

    // 签到-外出签到
    // 外出签到-查看部门签到设置
    getSignApiSignOutGetSetting({ }, postdata) {
        return sign.SignApiSignOutGetSetting(global.SignApiSignOutGetSettingPath, postdata)
    },
    // 外出签到-按月查询我的签到列表
    getSignApiSignDetailOutQueryMonthInfo({ }, postdata) {
        return sign.SignApiSignDetailOutQueryMonthInfo(global.SignApiSignDetailOutQueryMonthInfoPath, postdata)
    },
    // 外出签到-查询当日签到次数
    getSignApiSignDetailOutGetSignInfo({ }, postdata) {
        return sign.SignApiSignDetailOutGetSignInfo(global.SignApiSignDetailOutGetSignInfoPath, postdata)
    },
    // 外出签到-外出签到接口
    getSignApiSignDetailOutToSign({ }, postdata) {
        return sign.SignApiSignDetailOutToSign(global.SignApiSignDetailOutToSignPath, postdata)
    },
    // 外出签到-外出签到统计
    getSignApiSignDetailOutSignCount({ }, postdata) {
        return sign.SignApiSignDetailOutSignCount(global.SignApiSignDetailOutSignCountPath, postdata)
    },
    // 外出签到-外出签到设置
    getSignApiSignOutSetting({ }, postdata) {
        return sign.SignApiSignOutSetting(global.SignApiSignOutSettingPath, postdata)
    },




    // 创建Dang消息并发送
    getdangSend({ }, postdata) {
        return sign.dangSend(global.dangSendPath, postdata)
    },









    // 公告-删除公告
    getNoticedeleteNotice({ }, postdata) {
        return notice.NoticedeleteNotice(global.NoticedeleteNoticePath, postdata)
    },
    // 公告-修改已读和未读状态接口
    getNoticeupdateNotice({ }, postdata) {
        return notice.NoticeupdateNotice(global.NoticeupdateNoticePath, postdata)
    },
    // 公告-新增公告接口
    getNoticeinsertNotice({ }, postdata) {
        return notice.NoticeinsertNotice(global.NoticeinsertNoticePath, postdata)
    },
    // 公告-查询公告列表接口
    getNoticeselectNoticePage({ }, postdata) {
        return notice.NoticeselectNoticePage(global.NoticeselectNoticePagePath, postdata)
    },
    // 公告-根据id查询已读未读的用户接口
    getNoticeselectNoticeUser({ }, postdata) {
        return notice.NoticeselectNoticeUser(global.NoticeselectNoticeUserPath, postdata)
    },
    // 公告-根据公告id查询公告详情接口
    getNoticeselectNoticeDetail({ }, postdata) {
        return notice.NoticeselectNoticeDetail(global.NoticeselectNoticeDetailPath, postdata)
    },

    // 签到-日常签到
    getSignDailyToSign({ }, postdata) {
        return sign.SignDailyToSign(global.SignDailyToSign, postdata)
    },
    // 签到-查看当天某人签到情况
    getSignGetSignInfo({ }, postdata) {
        return sign.SignGetSignInfo(global.SignGetSignInfoPath, postdata)
    },




    //审批
    getapprovalIndex({ }, postdata) {
        return exam.approvalIndex(global.getapprovalIndexPath, postdata)
    },
    // 审批模型详情
    getapprovalModelItemDetail({ }, postdata) {
        return exam.approvalModelItemDetail(global.getapprovalModelItemDetailPath, postdata)
    },
    // 提交审批
    getapprovalSubmitl({ }, postdata) {
        return exam.approvalSubmitl(global.getapprovalSubmitlPath, postdata)
    },
    // 待我审批的
    getapprovalWaitedApproval({ }, postdata) {
        return exam.approvalWaitedApproval(global.getapprovalWaitedApprovalPath, postdata)
    },
    // 我已审批的
    getapprovalCompletedApproval({ }, postdata) {
        return exam.approvalCompletedApproval(global.getapprovalCompletedApprovalPath, postdata)
    },
    // 我发起的
    getapprovalLaunchedApproval({ }, postdata) {
        return exam.approvalLaunchedApproval(global.getapprovalLaunchedApprovalPath, postdata)
    },
    // 抄送我的
    getapprovalCopiedApproval({ }, postdata) {
        return exam.approvalCopiedApproval(global.getapprovalCopiedApprovalPath, postdata)
    },
    // 抄送我的-全部已读
    getapprovalupdateisread({ }, postdata) {
        return exam.approvalupdateisread(global.getapprovalupdateisreadPath, postdata)
    },
    // 审批详情
    getapprovalApprovalDetail({ }, postdata) {
        return exam.approvalApprovalDetail(global.getapprovalApprovalDetailPath, postdata)
    },
    // 审批处理操作
    getapprovalSolve({ }, postdata) {
        return exam.approvalSolve(global.getapprovalSolvePath, postdata)
    },
    // 审批转交
    getapprovalTransfer({ }, postdata) {
        return exam.approvalTransfer(global.getapprovalTransferPath, postdata)
    },
    // 审批撤销
    getapprovalRevoke({ }, postdata) {
        return exam.approvalRevoke(global.getapprovalRevokePath, postdata)
    },
    // 根据审批条件获取审批人与抄送人
    getapprovalgetapprover({ }, postdata) {
        return exam.approvalgetapprover(global.getapprovalgetapproverPath, postdata)
    },
    // 审批首页
    getapprovalindex({ }, postdata) {
        return exam.approvalindex(global.getapprovalindexPath, postdata)
    },





    // 日志-按日期查询已提交列表
    getlogreportmanagersubmitlist({ }, postdata) {
        return log.logreportmanagersubmitlist(global.logreportmanagersubmitlistPath, postdata)
    },
    // 查看日志详情
    getloglogsearchget({ }, postdata) {
        return log.loglogsearchget(global.loglogsearchgetPath, postdata)
    },
    // 日志-按日期查询未提交列表
    getlogreportmanagerunsubmitlist({ }, postdata) {
        return log.logreportmanagerunsubmitlist(global.logreportmanagerunsubmitlistPath, postdata)
    },
    // 日志-查询日志模板列表
    getlogtemplatequeryAll({ }, postdata) {
        return log.logtemplatequeryAll(global.getlogtemplatequeryAllPath, postdata)
    },
    // 日志-查询日志模板明细
    getlogtemplatequery({ }, postdata) {
        return log.logtemplatequery(global.getlogtemplatequeryPath, postdata)
    },
    // 日志-发布日志
    getloglogadd({ }, postdata) {
        return log.loglogadd(global.getloglogaddPath, postdata)
    },
    // 日志-日志报表列表
    getlogreportlist({ }, postdata) {
        return log.logreportlist(global.getlogreportlistPath, postdata)
    },
    // 日志-未读全部设为已读
    getlogsearchchangestatus({ }, postdata) {
        return log.logsearchchangestatus(global.getlogsearchchangestatusPath, postdata)
    },
    // 日志-我发送的列表
    getlogsearchsendpage({ }, postdata) {
        return log.logsearchsendpage(global.getlogsearchsendpagePath, postdata)
    },
    // 日志-我收到的列表
    getlogsearchreceivepage({ }, postdata) {
        return log.logsearchreceivepage(global.getlogsearchreceivepagePath, postdata)
    },
    // 日志-保存提醒
    getlogremindsave({ }, postdata) {
        return log.logremindsave(global.getlogremindsavePath, postdata)
    },
    // 日志-获取已保存的提醒详情
    getlogremindinfo({ }, postdata) {
        return log.logremindinfo(global.getlogremindinfoPath, postdata)
    },
    // 日志-获取已保存的提醒详情
    getlogsearchread({ }, postdata) {
        return log.logsearchread(global.logsearchreadPath, postdata)
    },


    // 查看管理员权限-签到
    getsignoutisadmin({ }, postdata) {
        return log.signoutisadmin(global.signoutisadminPath, postdata)
    },
    // 查看管理员权限-日志
    getloglogtemplateverifymanager({ }, postdata) {
        return log.loglogtemplateverifymanager(global.loglogtemplateverifymanagerPath, postdata)
    },
    // 查看管理员权限-公告
    getnoticenoticeauthority({ }, postdata) {
        return log.noticenoticeauthority(global.noticenoticeauthorityPath, postdata)
    },
    // 查看管理员权限-资讯
    getinfoinfohority({ }, postdata) {
        return log.infoinfohority(global.infoinfohorityPath, postdata)
    },

    // 资讯-查询资讯父级目录
    getapiinfoappselectparent({ }, postdata) {
        return info.apiinfoappselectparent(global.apiinfoappselectparentPath, postdata)
    },
    // 资讯-查询资讯父级目录下分页列表
    getapiinfoappselectparentall({ }, postdata) {
        return info.apiinfoappselectparentall(global.apiinfoappselectparentallPath, postdata)
    },
    // 资讯-查询资讯详情接口
    getapiinfoappselectdetail({ }, postdata) {
        return info.apiinfoappselectdetail(global.apiinfoappselectdetailPath, postdata)
    },
    // 资讯-更新阅读数接口
    getapiinfoappupdatenumber({ }, postdata) {
        return info.apiinfoappupdatenumber(global.apiinfoappupdatenumberPath, postdata)
    },
    // 资讯-新增资讯接口
    getapiinfoappinsertinfo({ }, postdata) {
        return info.apiinfoappinsertinfo(global.apiinfoappinsertinfoPath, postdata)
    },
    // 资讯-资讯搜索接口
    getapiinfoappsearchpage({ }, postdata) {
        return info.apiinfoappsearchpage(global.apiinfoappsearchpagePath, postdata)
    },


    // 评论-新增评论接口
    getapicomment({ }, postdata) {
        return comments.apicomment(global.getapicommentPath, postdata)
    },
    // 评论-获取评论接口
    getapicomments({ }, postdata) {
        return comments.apicomments(global.getapicommentsPath, postdata)
    },
    // 添加收藏
    getapifavouritefavouritesave({ }, postdata) {
        return comments.apifavouritefavouritesave(global.apifavouritefavouritesavePath, postdata)
    },
    //删除收藏
    getapifavouritefavouritedelete({ }, postdata) {
        return comments.apifavouritefavouritedelete(global.apifavouritefavouritedeletePath, postdata)
    },


    //工单-新增反馈
    getfeedBacksave({ }, postdata) {
        return feed.feedBacksave(global.feedBacksavePath, postdata)
    },
    //工单-列表
    getfeedBackList({ }, postdata) {
        return feed.feedBackList(global.feedBackListPath, postdata)
    },
    //工单-详情
    getfeedBackDetails({ }, postdata) {
        return feed.feedBackDetails(global.feedBackDetailsPath, postdata)
    },
    //工单-用户补充反馈的回复
    getfeedBackreply({ }, postdata) {
        return feed.feedBackreply(global.feedBackreplyPath, postdata)
    },
    //工单-已解决未解决接口
    getfeedBackresult({ }, postdata) {
        return feed.feedBackresult(global.feedBackresultPath, postdata)
    },
    //工单-评论列表
    getfeedBackreplyList({ }, postdata) {
        return feed.feedBackreplyList(global.feedBackreplyListPath, postdata)
    },

}
