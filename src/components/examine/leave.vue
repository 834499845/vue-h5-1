<!--审批操作-->
<template>
    <div :class="{'leave':true,'leaveShow':isleaveShow}">
        <div v-for="(item,index) in leaveList" class="leaveFor" :key="index">
            <ul>
                <li v-if="item.type == '8'" class="explain">
                    <!-- <pre> -->
                    {{item.label}}
                    <!-- </pre> -->
                </li>
                <li v-if="item.type == '6'" class="leaveLI">
                    <div class="leaveLIFont">
                        <!-- 单行输入框 -->
                        {{item.label}}
                    </div>
                    <input class="inpFont" @change="inputCha(index)" maxlength="50" v-model.trim='item.value' :placeholder="item.help" type="text">
                    <!-- <input class="inpFont" maxlength="50" v-model.trim='item.value' :placeholder="item.help" type="text" oninput="value=value.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/g, '')"> -->
                </li>
                <li v-if="item.type == '1'" class="leaveLI">
                    <div class="leaveLIFont">
                        <!-- 多行输入框 -->
                        {{item.label}}
                    </div>
                    <textarea @input="textChg($event,index)" maxlength="50" v-model.trim='item.value' :placeholder="item.help" oninput="value=value.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/g, '')">

                    </textarea>
                </li>
                <li v-if="item.type == '2'" class="leaveLI">
                    <div class="leaveLIFont">
                        <!-- 数字输入框 -->
                        {{item.label}}
                    </div>
                    <input type="number" class="inpFont" maxlength="50" v-model.trim='item.value' :placeholder="item.help" oninput="value=value.replace(/^(\d*\.?\d?).*/,'$1')"
                        @change="numInp(index)">
                </li>
                <li v-if="item.type == '3'" class="leaveLI" @click="radioButtonClick(index)">
                    <div class="leaveLIFont">
                        <!-- 单选框 -->
                        {{item.label}}
                    </div>
                    <div class="rightClick">
                        <div class="rightFont">
                            <span v-if='item.value != ""'>{{item.value}}</span>
                            <span v-else class="fontGray">{{item.help}}</span>
                        </div>
                        <div class="ringhtIcon">
                            <img src="/static/img/右箭头@3x.png" alt="">
                        </div>
                    </div>
                </li>
                <li v-if="item.type == '4'" class="leaveLI" @click="dataClick(index,'2')">
                    <div class="leaveLIFont">
                        <!-- 日期 -->
                        {{item.label}}
                    </div>
                    <div class="rightClick">
                        <div class="rightFont">
                            <span v-if='item.value !="" && item.format == "yyyy-MM-dd HH:mm"'>{{item.value | timeFun}}</span>
                            <span v-if='item.value !="" && item.format == "yyyy-MM-dd"'>{{item.value | dataFun}}</span>
                            <span v-show="item.value == ''" class="fontGray">{{item.help}}</span>
                        </div>
                        <div class="ringhtIcon">
                            <img src="/static/img/右箭头@3x.png" alt="">
                        </div>
                    </div>
                </li>
                <li v-if="item.type == '5'" class="leaveTime">
                    <div class="leaveTimeStart" @click="dataClick(index,'1')">
                        <div class="leaveLIFont">
                            <!-- 开始时间 -->
                            {{item.label}}
                        </div>
                        <div class="rightClick">
                            <div class="rightFont">
                                <span v-if='item.value !="" && item.format == "yyyy-MM-dd HH:mm"'>{{item.value | timeFun}}</span>
                                <span v-if='item.value !="" && item.format == "yyyy-MM-dd"'>{{item.value | dataFun}}</span>
                                <span v-show="item.value == ''" class="fontGray">{{item.help}}</span>
                            </div>
                            <div class="ringhtIcon">
                                <img src="/static/img/右箭头@3x.png" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="leaveTimeFinish" @click="dataClick(index,'0')">
                        <div class="leaveLIFont">
                            <!-- 结束时间 -->
                            {{item.labels}}
                        </div>
                        <div class="rightClick">
                            <div class="rightFont">
                                <span v-if='item.values !="" && item.format == "yyyy-MM-dd HH:mm"'>{{item.values | timeFun}}</span>
                                <span v-if='item.values !="" && item.format == "yyyy-MM-dd"'>{{item.values | dataFun}}</span>
                                <span v-show="item.values == ''" class="fontGray">{{item.help}}</span>
                            </div>
                            <div class="ringhtIcon">
                                <img src="/static/img/右箭头@3x.png" alt="">
                            </div>
                        </div>
                    </div>
                </li>
                <li v-if="item.type == '9'" class="leaveLI">
                    <div class="leaveLIFont">
                        <!-- 金额（元） -->
                        {{item.label}}
                    </div>
                    <input type="number" maxlength="50" v-model.trim='item.value' class="inpFont" :placeholder="item.help" oninput="value=value.replace(/^(\d*\.?\d*).*/,'$1')">
                </li>
                <li v-if="item.type == '10'" class="leaveImg">
                    <div class="leaveLI">
                        <div class="leaveLIFont">
                            <!-- 图片 -->
                            {{item.label}}
                        </div>
                        <div class="rightClick rightClickImage">
                            <div class="rightFont" onclick="updateFileClick(event)">
                                <span v-if="item.value.length == '0'" class="fontGray">{{item.help}}</span>
                            </div>
                            <div v-if="item.value.length == 0" :id="index" onclick="updateFileClick(event)" class="imgIcon">
                                <img src="/static/img/图片@3x.png" alt="">
                            </div>
                            <div v-else class="imgIcon">
                                <img src="/static/img/图片@3x.png" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="leaveImgCenter">
                        <div class="leaveImgFor" v-for="(imgs,imgInd) in item.value" :key="imgInd">
                            <div class="leaveImgDelect" @click='imgDelectClick(index,imgInd)'>
                                <img src="/static/img/取消@3x.png" alt="">
                            </div>
                            <img @click="lookImgClick(index,imgInd)" :src="imgs.url" alt="">
                        </div>
                        <div v-if='item.value.length > 0 && item.value.length < 5' class="leaveImgAdd" :id="index" onclick="updateFileClick(event)"></div>
                    </div>
                </li>
                <!-- <li v-if="item.type == '11'" class="leaveImg">
                    <div class="leaveLI">
                        <div class="leaveLIFont">
                            附件
                            {{item.label}}
                        </div>
                        <div class="rightClick">
                            <div class="rightFont">
                                <span class="fontGray">{{item.help}}</span>
                            </div>
                            <div class="accessoryIcon"></div>
                        </div>
                    </div>
                    <div class="accessory">
                        <img src="/static/img/20@3x.png" alt="">
                        <div class="accessoryFont">
                            <p class="accessoryFontTop">文件名.后缀</p>
                            <p class="accessoryFontFoot">文件大小KB</p>
                        </div>
                        <div class="accessoryDelect"></div>
                    </div>
                </li> -->
                <li v-if="item.type == '7'" class="detail">
                    <div class="detailCon" v-for="(itec,indc) in item.content" :key="indc">
                        <div class="detailTop">
                            <div class="detailTopLeft">
                                {{itec.label}}
                                <span v-if="itec.detaildel">（{{indc}}）</span>
                            </div>
                            <div class="detailTopRight" v-if="itec.detaildel" @click="detailDeleteClick(index,indc)">
                                删除
                            </div>
                        </div>
                        <div v-for="(iten,ind) in itec.items" :key="ind" class="detailLidetailTop">
                            <ul>
                                <li v-if="iten.dataType == '8'" class="explain">
                                    <!-- <pre> -->
                                    <!-- 说明 -->
                                    {{iten.itemLabel}}
                                    <!-- </pre> -->
                                </li>
                                <li v-if="iten.dataType == '6'" class="detailLi">
                                    <div class="leaveLIFont">
                                        <!-- 单行输入框 -->
                                        {{iten.itemLabel}}
                                    </div>
                                    <input class="inpFont" @change="inputsCha(index,indc,ind)" maxlength="50" v-model.trim="iten.value" :placeholder="iten.help"
                                        type="text">
                                    <!-- <input class="inpFont" maxlength="50" v-model.trim="iten.value" :placeholder="iten.help" type="text" oninput="iten.value=iten.value.replace( /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, '')"> -->
                                </li>
                                <li v-if="iten.dataType == '1'" class="detailLi">
                                    <div class="leaveLIFont">
                                        <!-- 多行输入框 -->
                                        {{iten.itemLabel}}
                                    </div>
                                    <textarea @input="textChg($event)" maxlength="50" v-model.trim="iten.value" :placeholder="iten.help" oninput="value=value.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/g, '')">
                                
                                            </textarea>
                                </li>
                                <li v-if="iten.dataType == '2'" class="detailLi">
                                    <div class="leaveLIFont">
                                        <!-- 数字输入框 -->
                                        {{iten.itemLabel}}
                                    </div>
                                    <input type="number" class="inpFont" maxlength="50" v-model.trim="iten.value" :placeholder="iten.help" oninput="value=value.replace(/^(\d*\.?\d?).*/,'$1')">
                                </li>
                                <li v-if="iten.dataType == '3'" class="detailLi" @click="detailRadioButtonClick(index,indc,ind)">
                                    <div class="leaveLIFont">
                                        <!-- 单选框 -->
                                        {{iten.itemLabel}}
                                    </div>
                                    <div class="rightClick">
                                        <div class="rightFont">
                                            <span v-if='iten.value != ""'>{{iten.value}}</span>
                                            <span v-else class="fontGray">{{iten.help}}</span>
                                        </div>
                                        <div class="ringhtIcon">
                                            <img src="/static/img/右箭头@3x.png" alt="">
                                        </div>
                                    </div>
                                </li>
                                <li v-if="iten.dataType == '4'" class="detailLi" @click="detailDataClick(index,indc,ind,'2')">
                                    <div class="leaveLIFont">
                                        <!-- 日期 -->
                                        {{iten.itemLabel}}
                                    </div>
                                    <div class="rightClick">
                                        <div class="rightFont">
                                            <span v-if='iten.value !="" && iten.dateFormat == "yyyy-MM-dd HH:mm"'>{{iten.value | timeFun}}</span>
                                            <span v-if='iten.value !="" && iten.dateFormat == "yyyy-MM-dd"'>{{iten.value | dataFun}}</span>
                                            <span v-show="iten.value == ''" class="fontGray">{{iten.help}}</span>
                                        </div>
                                        <div class="ringhtIcon">
                                            <img src="/static/img/右箭头@3x.png" alt="">
                                        </div>
                                    </div>
                                </li>
                                <li v-if="iten.dataType == '5'" class="detailTime">
                                    <div class="leaveTimeStart" @click="detailDataClick(index,indc,ind,'1')">
                                        <div class="leaveLIFont">
                                            <!-- 开始时间 -->
                                            {{iten.itemLabel}}
                                        </div>
                                        <div class="rightClick">
                                            <div class="rightFont">
                                                <span v-if='iten.value !="" && iten.dateFormat == "yyyy-MM-dd HH:mm"'>{{iten.value | timeFun}}</span>
                                                <span v-if='iten.value !="" && iten.dateFormat == "yyyy-MM-dd"'>{{iten.value | dataFun}}</span>
                                                <span v-show="iten.value == ''" class="fontGray">{{iten.help}}</span>
                                            </div>
                                            <div class="ringhtIcon">
                                                <img src="/static/img/右箭头@3x.png" alt="">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="leaveTimeFinish" @click="detailDataClick(index,indc,ind,'0')">
                                        <div class="leaveLIFont">
                                            <!-- 结束时间 -->
                                            {{iten.itemLabels}}
                                        </div>
                                        <div class="rightClick">
                                            <div class="rightFont">
                                                <span v-if='iten.values !="" && iten.dateFormat == "yyyy-MM-dd HH:mm"'>{{iten.values | timeFun}}</span>
                                                <span v-if='iten.values !="" && iten.dateFormat == "yyyy-MM-dd"'>{{iten.values | dataFun}}</span>
                                                <span v-show="iten.values == ''" class="fontGray">{{iten.help}}</span>
                                            </div>
                                            <div class="ringhtIcon">
                                                <img src="/static/img/右箭头@3x.png" alt="">
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li v-if="iten.dataType == '9'" class="detailLi">
                                    <div class="leaveLIFont">
                                        <!-- 金额（元） -->
                                        {{iten.itemLabel}}
                                    </div>
                                    <input type="number" class="inpFont" maxlength="50" v-model.trim="iten.value" :placeholder="iten.help" oninput="value=value.replace(/^(\d*\.?\d*).*/,'$1')">
                                </li>
                                <li v-if="iten.dataType == '10'" class="leaveImg">
                                    <div class="leaveLI">
                                        <div class="leaveLIFont">
                                            <!-- 图片 -->
                                            {{iten.itemLabel}}
                                        </div>
                                        <div class="rightClick">
                                            <div class="rightFont">
                                                <span v-if="iten.value.length == '0'" class="fontGray">{{iten.help}}</span>
                                            </div>
                                            <div v-if="iten.value.length == 0" class="imgIcon" :id="index+','+indc+','+ind" onclick="itenUpateClick(event)">
                                                <img src="/static/img/图片@3x.png" alt="">
                                            </div>
                                            <div v-else class="imgIcon">
                                                <img src="/static/img/图片@3x.png" alt="">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="leaveImgCenter">
                                        <div class="leaveImgFor" v-for="(imgItem,imgInd) in iten.value">
                                            <div class="leaveImgDelect" @click='detailImgDelectClick(index,indc,ind,imgInd)'>
                                                <img src="/static/img/取消@3x.png" alt="">
                                            </div>
                                            <img @click="detaillLookImgClick(index, indc, ind, imgInd)" :src="imgItem.url" alt="">
                                        </div>
                                        <div v-show="iten.value.length>0 && iten.value.length < 5" class="leaveImgAdd" :id="index+','+indc+','+ind" onclick="itenUpateClick(event)"></div>
                                    </div>
                                </li>
                                <!-- <li v-if="iten.dataType == '11'" class="leaveImg">
                                    <div class="leaveLI">
                                        <div class="leaveLIFont">
                                            附件
                                            {{iten.itemLabel}}
                                        </div>
                                        <div class="rightClick">
                                            <div class="rightFont">
                                                <span class="fontGray">{{iten.help}}</span>
                                            </div>
                                            <div class="accessoryIcon"></div>
                                        </div>
                                    </div>
                                    <div class="accessory">
                                        <img src="/static/img/20@3x.png" alt="">
                                        <div class="accessoryFont">
                                            <p class="accessoryFontTop">文件名.后缀</p>
                                            <p class="accessoryFontFoot">文件大小KB</p>
                                        </div>
                                        <div class="accessoryDelect"></div>
                                    </div>
                                </li> -->
                            </ul>
                        </div>
                        <div v-if='indc == item.content.length-1' class="addDetail" @click="detailAddClick(index,indc)">
                            <div class="addDetailFont">+</div>{{item.help}}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="department" @click="departmentClick()">
            <div class="leaveLIFont">
                所在部门
            </div>
            <div class="rightClick">
                <div class="rightFont">
                    <span v-show="departmentVal == ''" class="fontGray">请选择部门（必填）</span>
                    <span v-show="departmentVal != ''" class="fontGray">{{departmentVal}}</span>
                </div>
                <div class="ringhtIcon">
                    <img src="/static/img/右箭头@3x.png" alt="">
                </div>
            </div>
        </div>
        <div class="approver">
            <div class="approverTop">
                <div class="approverTopLeft">
                    审批人
                </div>
                <div class="approverTopRight">
                    {{approverTitle}}
                </div>
            </div>
            <div class="approverFor">
                <ul>
                    <li class="approverLi" v-for="(item,index) in approverokList" :key="index" @click="approverokClick()">
                        <div v-if='item.profile' class="approverLiTop">
                            <img :src="item.profile" alt="">
                        </div>
                        <div v-else class="approverImgNo">
                            {{item.name | nameFun}}
                        </div>
                        <div class="approverLiFont">
                            {{item.name}}
                        </div>
                    </li>
                    <li class="approverLi" v-for="(item,index) in approverList" :key="index" @click="approverDelectClick(index)">
                        <div v-if='item.profile' class="approverLiTop">
                            <img :src="item.profile" alt="">
                        </div>
                        <div v-else class="approverImgNo">
                            {{item.name | nameFun}}
                        </div>
                        <div class="approverLiFont">
                            {{item.name}}
                        </div>
                    </li>
                    <li class="approverLi" v-show="addApproverShow" onclick="addapproverListsClick()">
                        <div class="approverLiAdd addButton">
                            <img src="/static/img/添加人@3x.png" alt="">
                        </div>
                        <div class="approverLiFont">
                            添加
                        </div>
                    </li>
                </ul>

            </div>
        </div>
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
                    <li class="approverLi" v-for="(item,index) in copyokList" :key="index" @click='copyokClick()'>
                        <div v-if='item.profile' class="approverLiTop">
                            <img :src="item.profile" alt="">
                        </div>
                        <div v-else class="approverImgNo">
                            {{item.name | nameFun}}
                        </div>
                        <div class="approverLiFont">
                            {{item.name}}
                        </div>
                    </li>
                    <li class="approverLi" v-for="(item,index) in copyList" :key="index" @click='copyDelectClick(index)'>
                        <div v-if='item.profile' class="approverLiTop">
                            <img :src="item.profile" alt="">
                        </div>
                        <div v-else class="approverImgNo">
                            {{item.name | nameFun}}
                        </div>
                        <div class="approverLiFont">
                            {{item.name}}
                        </div>
                    </li>
                    <li class="approverLi" onclick="addCopyListsClick()">
                        <div class="approverLiAdd addButton">
                            <img src="/static/img/添加人@3x.png" alt="">
                        </div>
                        <div class="approverLiFont">
                            添加
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="submits"></div>
        <div class="submit" @click='submitClick()'>
            提交
        </div>
        <!-- 年月日选择器 -->
        <v-dateModel @message="canifmDateClick" @cancel="cancelDateClick" :dataState="dataStateVal"></v-dateModel>
        <!-- 年-月-日-时-分选择器 -->
        <v-timeModel @message="canifmTimeClick" @cancel="cancelTimeClick" :dataState="timeStateVal"></v-timeModel>
        <!-- 单选框选择器 -->
        <v-singleSelect :pockerunit="pockerUnitShow" :numLists='numLists' :defStateIndex='defStateIndex' :defIndex='defIndex' @confirm="confirmClick"
            @cancel="cancelClick"></v-singleSelect>
        <!-- 询问框 -->
        <div v-show="cancelUpdateShow" class="cancelUpdate">
            <div class="cancelUpdateContent">
                <div>
                    暂未保存，确定返回吗？
                </div>
                <div>
                    <div @click="cancelUpdateCancelClick">取消</div>
                    <div @click="cancelUpdateaffrimClick">确定</div>
                </div>
            </div>
        </div>
        <!-- 新增审批加载中 -->
        <div v-show="isAddShowTost" class="AddShowTost">
            <mt-spinner type="snake" color="#4390E1"></mt-spinner>
        </div>
    </div>
</template>
<script>
    import { mapActions } from "vuex";
    import { Toast } from "mint-ui";
    import dateModel from "../cModule/dateModel";
    import timeModel from "../cModule/dateTimeModel";
    import singleSelect from "../cModule/singleSelect";
    export default {
        components: {
            "v-dateModel": dateModel,
            "v-timeModel": timeModel,
            "v-singleSelect": singleSelect
        },
        data() {
            return {
                isAddShowTost: false,
                isleaveShow: false, // 背景是否可移动
                leaveList: [], //列表数组
                // type：类型；8-说明文字；6-单行输入框；1-多行输入框；2-数字输入框；
                // 3-单选框；4-日期；5-日期区间；9-金额；10-图片；11-附件；7-明细；
                // name： 操作名称；
                // hint：提示语；
                // value: 内容；
                // required: 必填， 0-非必填；1-必填；
                // option: 选项；单选框的选项。
                approverList: [], //审批人列表
                approverokList: [], //不可操作审批人列表
                copyList: [], //抄送人列表
                copyokList: [], //不可操作抄送人列表
                pockerUnitShow: false, //单选框弹出控制
                numLists: [], //单选框数组
                defStateIndex: "1", //单选数组出现时选中的序号
                defIndex: "", //当前点击索引
                contentDefIndc: "", //明细副本的当前点击索引
                detailDefIndex: "", //明细操作选项的当前点击索引
                dataStateVal: false, // 年月日时间弹出控制
                timeStateVal: false, // 年月日时分时间弹出控制
                dataTimeShow: "", // 时间点击 2-单个日期选择；1-开始时间，0-结束时间
                itemIndex: "", //   控件索引值
                itenIndc: "", //   明细索引值
                itenInd: "", //   明细控件索引值
                detailRadioButton: false, //点击的操作是否是明细的
                departmentVal: "", //部门名称
                departmentId: "", //部门id
                departmentShow: false, //部门选择
                departmentList: [], //部门数组
                cancelUpdateShow: false, //弹出框
                cancelUpdateShowTrue: false, //弹出框
                judgeArr: [],//获取审批人的条件
                approverTitle: '（点击头像可删除）',//审批人提示语
                addApproverShow: true,//审批人添加按钮
            };
        },
        created: function () {
            var self = this;
            self.getList();
            document.title = self.$route.query.modelName;
        },
        //跳转拦截
        beforeRouteLeave(to, from, next) {
            var self = this;
            self.cancelUpdateShow = true;
            self.isleaveShow = true;
            self.dataStateVal = false;
            self.timeStateVal = false;
            self.pockerUnitShow = false;
            self.toPath = to.path;
            // alert(self.toPath);
            if (self.cancelUpdateShowTrue == true) {
                self.cancelUpdateShowTrue = false;
                next(true);
            } else {
                next(false);
            }
        },
        mounted() {
            var self = this;
            var u = navigator.userAgent;
            var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if (isAndroid) {
                if (window.BenchJSInterface) {
                    window.BenchJSInterface.setTitle(self.$route.query.modelName);
                }
            }
            // 明细上传图片
            window.itenUpateClick = function (e) {
                var indexArr = e.currentTarget.id.split(",");
                self.itemIndex = indexArr[0];
                self.itenIndc = indexArr[1];
                self.itenInd = indexArr[2];
                if (
                    self.leaveList[self.itemIndex].content[self.itenIndc].items[
                        self.itenInd
                    ].value.length < 5
                ) {
                    if (isAndroid) {
                        if (window.BenchJSInterface) {
                            window.BenchJSInterface.setBtnOnClickEvent(
                                "100",
                                "javascript:window.itenUpdateImgAndroidFun(->path<-);"
                            );
                        }
                    } else {
                        var messgaeObj = {
                            methodName: "invokeCameraFromJS",
                            params: {},
                            callbackMethod: "itenUpdateImgIosFun"
                        };
                        if (window.webkit) {
                            window.webkit.messageHandlers.BotongApplicationCenterCameraJSHandler.postMessage(
                                messgaeObj
                            );
                        }
                    }
                }
            };
            // 获取明细上传图片结果Android
            window.itenUpdateImgAndroidFun = function (val) {
                var imgObj = JSON.parse(JSON.stringify(val));
                self.leaveList[self.itemIndex].content[self.itenIndc].items[
                    self.itenInd
                ].value.push({ url: imgObj[0].imgPath });
                // {imgPath:'http://192......png'}
            };
            // 获取明细上传图片结果ios
            window.itenUpdateImgIosFun = function (val) {
                self.leaveList[self.itemIndex].content[self.itenIndc].items[
                    self.itenInd
                ].value.push({ url: val.url });
            };
            // 上传图片
            window.updateFileClick = function (e) {
                var index = e.currentTarget.id;
                self.itemIndex = index;
                if (self.leaveList[index].value.length < 5) {
                    if (isAndroid) {
                        if (window.BenchJSInterface) {
                            window.BenchJSInterface.setBtnOnClickEvent(
                                "100",
                                "javascript:window.updateImgAndriodFun(->path<-);"
                            );
                        }
                    } else {
                        var messgaeObj = {
                            methodName: "invokeCameraFromJS",
                            params: {},
                            callbackMethod: "updateImgIosFun"
                        };
                        if (window.webkit) {
                            window.webkit.messageHandlers.BotongApplicationCenterCameraJSHandler.postMessage(
                                messgaeObj
                            );
                        }
                    }
                }
            };
            // 获取上传图片结果Andriod
            window.updateImgAndriodFun = function (val) {
                var imgObj = JSON.parse(JSON.stringify(val));
                self.leaveList[self.itemIndex].value.push({ url: imgObj[0].imgPath });
                // {imgPath:'http://192......png'}
            };
            // 获取上传图片结果Ios
            window.updateImgIosFun = function (val) {
                self.leaveList[self.itemIndex].value.push({ url: val.url });
            };
            // 选择审批人员
            window.addapproverListsClick = function () {
                //ios 传已选人员
                // self.approverokList 默认自带审批人   self.approverList  添加的审批人
                var ignoreIdsArr = "";
                var arrIgn = [];
                var ignoreIdsAndArr = [];
                if (self.approverokList.length > 0) {
                    self.approverokList.forEach(function (ele, ind) {
                        arrIgn.push(ele.passportId);
                        ignoreIdsAndArr.push({ passportId: ele.passportId });
                    });
                    ignoreIdsArr = arrIgn.join(",");
                }
                var paraArr = {
                    ignoreIds: self.ignoreIdsAndArr, // 默认选中人员
                    selected: self.approverList // 选中搜索人员
                };
                if (isAndroid) {
                    if (window.BenchJSInterface) {
                        window.BenchJSInterface.setBtnOnClickEvent(
                            "105",
                            "javascript:window.updateistFunAndroid(->path<-);",
                            JSON.stringify(paraArr)
                        );
                    }
                } else {
                    var messgaeObjs = {
                        methodName: "BotongApplicationCenterContactsJSHandler",
                        params: {
                            ignoreIds: ignoreIdsArr, //
                            selected: JSON.stringify(self.approverList),
                            limitCount: 0 //
                        },
                        callbackMethod: "updateistFunIos"
                    };
                    if (window.webkit) {
                        window.webkit.messageHandlers.BotongApplicationCenterContactsJSHandler.postMessage(
                            messgaeObjs
                        );
                    }
                }
            };
            // 审批人员选中结果Android
            window.updateistFunAndroid = function (val) {
                self.approverList = val;
            };
            // 审批人员选中结果ios
            window.updateistFunIos = function (val) {
                self.approverList = val;
            };
            // 选择抄送人员
            window.addCopyListsClick = function () {
                var ignoreIdsArr = "";
                var arrIgn = [];
                var ignoreIdsAndArr = [];
                // self.copyokList 默认自带抄送人   self.copyList  添加的抄送人
                if (self.copyokList.length > 0) {
                    self.copyokList.forEach(function (ele, ind) {
                        arrIgn.push(ele.passportId);
                        ignoreIdsAndArr.push({ passportId: ele.passportId });
                    });
                    ignoreIdsArr = arrIgn.join(",");
                }
                var paraArr = {
                    ignoreIds: self.ignoreIdsAndArr, // 默认自带人员
                    selected: self.copyList // 选中人员
                };
                if (isAndroid) {
                    if (window.BenchJSInterface) {
                        window.BenchJSInterface.setBtnOnClickEvent(
                            "105",
                            "javascript:window.updateistAndroidFun(->path<-);",
                            JSON.stringify(paraArr)
                        );
                    }
                } else {
                    var messgaeObjs = {
                        methodName: "BotongApplicationCenterContactsJSHandler",
                        params: {
                            ignoreIds: ignoreIdsArr,
                            selected: JSON.stringify(self.copyList),
                            limitCount: 0
                        },
                        callbackMethod: "updateistIosFun"
                    };
                    if (window.webkit) {
                        window.webkit.messageHandlers.BotongApplicationCenterContactsJSHandler.postMessage(
                            messgaeObjs
                        );
                    }
                }
            };
            // 抄送人员选中结果Android
            window.updateistAndroidFun = function (val) {
                // alert(JSON.stringify(val));
                self.copyList = val;
            };
            // 抄送人员选中结果Ios
            window.updateistIosFun = function (val) {
                self.copyList = val;
            };
        },
        methods: {
            // 确认离开页面
            cancelUpdateaffrimClick() {
                this.cancelUpdateShow = false;
                this.cancelUpdateShowTrue = true;
                this.$router.go(-1);
                this.isleaveShow = false;
            },
            // 取消离开页面
            cancelUpdateCancelClick() {
                this.isleaveShow = false;
                this.cancelUpdateShow = false;
            },
            // 获取列表数据
            getList() {
                var self = this;
                self.$store.commit("setMutVuexisLoading", true);
                self.getapprovalModelItemDetail({
                    modelId: self.$route.query.modelId,
                    memberId: sessionStorage.getItem("memberId"),
                    companyId: sessionStorage.getItem("companyId")
                }).then(data => {
                    self.$store.commit("setMutVuexisLoading", false);
                    if (data.statusCode == "200") {
                        if (data.data.items) {
                            var array = data.data.items;
                            var arrb = [];
                            array.forEach(function (ele, ind) {
                                if (
                                    array[ind].type != "5" &&
                                    array[ind].type != "7" &&
                                    array[ind].type != "10"
                                ) {
                                    arrb.push({
                                        type: ele.type,
                                        field: ele.field,
                                        label: ele.label,
                                        isJudge: ele.isJudge ? ele.isJudge : ele.judge,
                                        help: ele.help
                                            ? ele.required == "1" ? ele.help + "(必填)" : ele.help
                                            : ele.required == "1" ? "(必填)" : "",
                                        value: "",
                                        required: ele.required,
                                        format: ele.format != "" ? ele.format : "",
                                        option: ele.option != "" ? ele.option : ""
                                    });
                                } else if (array[ind].type == "5") {
                                    arrb.push({
                                        type: ele.type,
                                        field: ele.field,
                                        label: ele.label,
                                        labels: ele.labels,
                                        help: ele.help
                                            ? ele.required == "1" ? ele.help + "(必填)" : ele.help
                                            : ele.required == "1" ? "(必填)" : "",
                                        value: "",
                                        values: "",
                                        required: ele.required,
                                        format: ele.format,
                                        option: ele.option
                                    });
                                } else if (array[ind].type == "7") {
                                    arrb.push({
                                        type: ele.type,
                                        content: [
                                            {
                                                num: "",
                                                field: ele.field,
                                                label: ele.label,
                                                help: ele.help
                                                    ? ele.required == "1" ? ele.help + "(必填)" : ele.help
                                                    : ele.required == "1" ? "(必填)" : "",
                                                value: "",
                                                required: ele.required,
                                                format: ele.format,
                                                option: ele.option,
                                                items: ele.items
                                            }
                                        ]
                                    });
                                } else if (array[ind].type == "10") {
                                    arrb.push({
                                        type: ele.type,
                                        field: ele.field,
                                        label: ele.label,
                                        help: ele.help
                                            ? ele.required == "1" ? ele.help + "(必填)" : ele.help
                                            : ele.required == "1" ? "(必填)" : "",
                                        value: [],
                                        required: ele.required,
                                        format: ele.format,
                                        option: ele.option
                                    });
                                }
                            });
                            for (var i = 0; i < arrb.length; i++) {
                                if (arrb[i].type == "7") {
                                    for (var j = 0; j < arrb[i].content[0].items.length; j++) {
                                        if (arrb[i].content[0].items[j].isRequired == 1) {
                                            arrb[i].content[0].items[j].help = arrb[i].content[0]
                                                .items[j].help
                                                ? arrb[i].content[0].items[j].help + "（必填）"
                                                : "（必填）";
                                        }
                                        if (arrb[i].content[0].items[j].dataType == "10") {
                                            arrb[i].content[0].items[j].value = [];
                                        } else if (arrb[i].content[0].items[j].dataType == "5") {
                                            arrb[i].content[0].items[j].value = "";
                                            arrb[i].content[0].items[j].values = "";
                                        } else {
                                            arrb[i].content[0].items[j].value = "";
                                        }
                                    }
                                }
                            }
                            self.leaveList = arrb;
                            if (data.data.copyerVOS) {
                                self.copyokList = data.data.copyerVOS;
                            }
                            if (data.data.approverVOS) {
                                self.approverokList = data.data.approverVOS;
                                if (data.data.approverVOS.length > 0) {
                                    self.addApproverShow = false
                                    self.approverTitle = '（已由管理员配置）'
                                } else {
                                    if (data.data.approverShow && data.data.approverShow != '') {
                                        if (data.data.approverShow == 'false') {
                                            self.addApproverShow = false
                                            self.approverTitle = '（已由管理员配置）'
                                        }
                                    } else {
                                        self.addApproverShow = true
                                        self.approverTitle = '（点击头像可删除）'
                                    }
                                }
                            } else {
                                if (data.data.approverShow && data.data.approverShow != '') {
                                    if (data.data.approverShow == 'false') {
                                        self.addApproverShow = false
                                        self.approverTitle = '（已由管理员配置）'
                                    }
                                } else {
                                    self.addApproverShow = true
                                    self.approverTitle = '（点击头像可删除）'
                                }
                            }
                            self.departmentList = data.data.deptList;
                            self.departmentId = data.data.deptList[0].deptId;
                            self.departmentVal = data.data.deptList[0].deptName;
                        } else {
                            Toast({
                                message: "服务器异常",
                                position: "bottom"
                            });
                        }
                    } else {
                        Toast({
                            message: data.statusMessage,
                            position: "bottom"
                        });
                    }
                }).catch(msg => {
                    self.$store.commit("setMutVuexisLoading", false);
                    Toast({
                        message: "服务器异常",
                        position: "bottom"
                    });
                });
            },
            // textarea 输入框高度自适应
            textChg(e, index) {
                e.currentTarget.style.height = "0px";
                var tex = e.currentTarget;
                var textH = tex.scrollHeight;
                e.currentTarget.style.height = textH + "px";
            },
            // input 正则
            inputCha(index) {
                var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
                this.leaveList[index].value = this.leaveList[index].value.replace(
                    regStr,
                    ""
                );
            },
            // input 明细正则
            inputsCha(index, indc, ind) {
                var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
                this.leaveList[index].content[indc].items[ind].value = this.leaveList[
                    index
                ].content[indc].items[ind].value.replace(regStr, "");
            },


            // 图片预览
            lookImgClick(index,imgInd) {
              var self = this;
              var arr = [];
              self.leaveList[index].value.forEach(function(ele, ind) {
                arr.push({ img: ele.url });
              });
              this.WatchBigPicture(arr, imgInd);
            },
            // 明细图片预览
            detaillLookImgClick(index, indc, ind, imgInd) {
              var self = this;
              var arr = [];
              this.leaveList[index].content[indc].items[ind].value.forEach(function(ele, ind) {
                arr.push({ img: ele.url });
              });
              this.WatchBigPicture(arr, imgInd);
            },


            //审批人删除
            approverDelectClick(index) {
                this.approverList.splice(index, 1);
            },
            //不可操作审批人
            approverokClick() {
                Toast({
                    message: "管理员配置不可操作",
                    position: "bottom"
                });
            },
            //抄送人删除
            copyDelectClick(index) {
                this.copyList.splice(index, 1);
            },
            //不可操作抄送人
            copyokClick() {
                Toast({
                    message: "管理员配置不可操作",
                    position: "bottom"
                });
            },
            //单选框点击
            radioButtonClick(index) {
                this.pockerUnitShow = true;
                if (this.leaveList[index].value) {
                    for (var i = 0; i < this.leaveList[index].option.length; i++) {
                        if (this.leaveList[index].value == this.leaveList[index].option[i]) {
                            this.defStateIndex = i;
                        }
                    }
                }
                this.departmentShow = false;
                this.detailRadioButton = false; //点击的操作是否是明细
                this.numLists = this.leaveList[index].option.split(",");
                this.defIndex = index;
                this.pockerUnitShow = true; //弹出选控件
                this.isleaveShow = true;
            },
            //明细单选框点击
            detailRadioButtonClick(index, indc, ind) {
                this.isleaveShow = true;
                this.pockerUnitShow = true; //弹出选控件
                this.defIndex = index;
                this.contentDefIndc = indc;
                this.detailDefIndex = ind;
                this.departmentShow = false; //部门选择
                this.detailRadioButton = true; //点击的操作是否是明细
                this.numLists = this.leaveList[index].content[indc].items[
                    ind
                ].optValue.split(",");
            },
            //选择部门
            departmentClick() {
                var arr = [];
                this.isleaveShow = true;
                this.departmentList.forEach(function (ele, ind) {
                    arr.push(ele.deptName);
                });
                this.numLists = arr;
                this.departmentShow = true; //部门选择
                this.detailRadioButton = false; //点击的操作是否是明细
                this.pockerUnitShow = true; //弹出选控件
                this.isleaveShow = true;
            },
            // 单选取消
            cancelClick() {
                this.isleaveShow = false;
                this.pockerUnitShow = false;
            },
            // 单选确定
            confirmClick(val) {
                var self = this;
                if (this.detailRadioButton == true) {
                    //点击的操作是否是明细//明细单选
                    //确定其他单选
                    this.leaveList[this.defIndex].content[this.contentDefIndc].items[
                        this.detailDefIndex
                    ].value = val;
                } else {
                    //明细外单选
                    if (this.departmentShow == true) {
                        //是否部门选择//确定部门单选
                        this.departmentVal = val;
                        for (var i = 0; i < self.departmentList.length; i++) {
                            if (self.departmentList[i].deptName == val) {
                                self.departmentId = self.departmentList[i].deptId;
                            }
                        }
                        self.getshenpiren()
                    } else {
                        this.leaveList[this.defIndex].value = val;
                        if (this.leaveList[this.defIndex].isJudge == 1) {
                            if (self.judgeArr.length > 0) {
                                var judgeArrShow = false
                                var judgeArrI = i
                                for (var i = 0; i < self.judgeArr.length; i++) {
                                    if (self.judgeArr[i].field == self.leaveList[self.defIndex].field) {
                                        judgeArrShow = true
                                    }
                                }
                                if (judgeArrShow) {
                                    self.judgeArr.splice(judgeArrI, 1, {
                                        type: 3,
                                        field: self.leaveList[self.defIndex].field,
                                        value: self.leaveList[self.defIndex].value
                                    });
                                } else {
                                    self.judgeArr.push({
                                        type: 3,
                                        field: self.leaveList[self.defIndex].field,
                                        value: self.leaveList[self.defIndex].value
                                    });
                                }
                            } else {
                                self.judgeArr.push({
                                    type: 3,
                                    field: self.leaveList[self.defIndex].field,
                                    value: self.leaveList[self.defIndex].value
                                });
                            }
                            this.getshenpiren();
                        }
                    }
                }
                this.pockerUnitShow = false;
                this.isleaveShow = false;
            },
            //请假天数获取审批人
            numInp(index) {
                var self = this
                if (self.leaveList[index].value == '') {
                    return;
                }
                if (self.leaveList[index].isJudge == 1) {
                    if (self.judgeArr.length > 0) {
                        var judgeArrShow = false
                        var judgeArrI
                        for (var i = 0; i < self.judgeArr.length; i++) {
                            if (self.judgeArr[i].field == self.leaveList[index].field) {
                                judgeArrShow = true
                                judgeArrI = i
                            }
                        }
                        if (judgeArrShow) {
                            self.judgeArr.splice(judgeArrI, 1, {
                                type: 2,
                                field: self.leaveList[index].field,
                                value: self.leaveList[index].value
                            });
                        } else {
                            self.judgeArr.push({
                                type: 2,
                                field: self.leaveList[index].field,
                                value: self.leaveList[index].value
                            });
                        }
                    } else {
                        self.judgeArr.push({
                            type: 2,
                            field: self.leaveList[index].field,
                            value: self.leaveList[index].value
                        });
                    }
                    self.getshenpiren();
                }
            },
            //按条件获取审批人
            getshenpiren() {
                var self = this;
                self.getapprovalgetapprover({
                    companyId: sessionStorage.getItem("companyId"), //公司id
                    memberId: sessionStorage.getItem("memberId"), //成员id
                    modelId: self.$route.query.modelId,
                    departId: self.departmentId,
                    judge: JSON.stringify(self.judgeArr)
                }).then(data => {
                    if (data.statusCode == 200) {
                        self.copyokList = []
                        self.approverokList = []
                        if (data.data) {
                            if (data.data.copys) {
                                self.copyokList = data.data.copys;
                            }
                            if (data.data.approvers) {
                                self.approverokList = data.data.approvers;
                                if (data.data.approvers.length > 0) {
                                    this.addApproverShow = false
                                    self.approverTitle = '（已由管理员配置）'
                                } else {
                                    if (data.data.approverShow && data.data.approverShow != '') {
                                        if (data.data.approverShow == 'false') {
                                            self.addApproverShow = false
                                            self.approverTitle = '（已由管理员配置）'
                                        }
                                    } else {
                                        self.addApproverShow = true
                                        self.approverTitle = '（点击头像可删除）'
                                    }
                                }
                            } else {
                                if (data.data.approverShow && data.data.approverShow != '') {
                                    if (data.data.approverShow == 'false') {
                                        self.addApproverShow = false
                                        self.approverTitle = '（已由管理员配置）'
                                    }
                                } else {
                                    self.addApproverShow = true
                                    self.approverTitle = '（点击头像可删除）'
                                }
                            }
                        }
                    } else {
                        Toast({
                            message: "服务器异常",
                            position: "bottom"
                        });
                    }
                }).catch(msg => {
                    Toast({
                        message: "服务器异常",
                        position: "bottom"
                    });
                });
            },
            // 日期选择器弹出
            dataClick(index, num) {
                this.defIndex = index;
                this.isleaveShow = true;
                if (this.leaveList[index].format == "yyyy-MM-dd") {
                    this.dataStateVal = true;
                } else if (this.leaveList[index].format == "yyyy-MM-dd HH:mm") {
                    this.timeStateVal = true;
                }
                this.detailRadioButton = false;
                this.dataTimeShow = num;
            },
            // 明细日期选择器弹出
            detailDataClick(index, indc, ind, num) {
                this.isleaveShow = true;
                if (
                    this.leaveList[index].content[indc].items[ind].dateFormat ==
                    "yyyy-MM-dd"
                ) {
                    this.dataStateVal = true;
                } else if (
                    this.leaveList[index].content[indc].items[ind].dateFormat ==
                    "yyyy-MM-dd HH:mm"
                ) {
                    this.timeStateVal = true;
                }
                this.dataTimeShow = num;
                this.defIndex = index;
                this.contentDefIndc = indc;
                this.detailDefIndex = ind;
                this.detailRadioButton = true;
            },
            // 年月日时间取消
            cancelDateClick() {
                this.isleaveShow = false;
                this.dataStateVal = false;
            },
            // 年月日时间选中
            canifmDateClick(val) {
                this.isleaveShow = false;
                var standardTime = val.getTime();
                if (this.dataTimeShow == "2") {
                    //单个日期
                    if (this.detailRadioButton == true) {
                        this.leaveList[this.defIndex].content[this.contentDefIndc].items[
                            this.detailDefIndex
                        ].value = standardTime;
                    } else {
                        this.leaveList[this.defIndex].value = standardTime;
                    }
                } else if (this.dataTimeShow == "1") {
                    //开始日期
                    if (this.detailRadioButton == true) {
                        this.leaveList[this.defIndex].content[this.contentDefIndc].items[
                            this.detailDefIndex
                        ].value = standardTime;
                    } else {
                        this.leaveList[this.defIndex].value = standardTime;
                    }
                } else if (this.dataTimeShow == "0") {
                    //结束日期
                    if (this.detailRadioButton == true) {
                        this.leaveList[this.defIndex].content[this.contentDefIndc].items[
                            this.detailDefIndex
                        ].values = standardTime;
                    } else {
                        this.leaveList[this.defIndex].values = standardTime;
                    }
                }
                this.dataStateVal = false;
            },
            // 年月日时分时间取消
            cancelTimeClick() {
                this.isleaveShow = false;
                this.timeStateVal = false;
            },
            // 年月日时分时间选中
            canifmTimeClick(val) {
                this.isleaveShow = false;
                var standardTime = val.getTime();
                if (this.dataTimeShow == "2") {
                    //单个日期
                    if (this.detailRadioButton == true) {
                        this.leaveList[this.defIndex].content[this.contentDefIndc].items[
                            this.detailDefIndex
                        ].value = standardTime;
                    } else {
                        this.leaveList[this.defIndex].value = standardTime;
                    }
                } else if (this.dataTimeShow == "1") {
                    //开始日期
                    if (this.detailRadioButton == true) {
                        this.leaveList[this.defIndex].content[this.contentDefIndc].items[
                            this.detailDefIndex
                        ].value = standardTime;
                    } else {
                        this.leaveList[this.defIndex].value = standardTime;
                    }
                } else if (this.dataTimeShow == "0") {
                    //结束日期
                    if (this.detailRadioButton == true) {
                        this.leaveList[this.defIndex].content[this.contentDefIndc].items[
                            this.detailDefIndex
                        ].values = standardTime;
                    } else {
                        this.leaveList[this.defIndex].values = standardTime;
                    }
                }
                this.timeStateVal = false;
            },
            // 图片删除
            imgDelectClick(index, imgInd) {
                this.leaveList[index].value.splice(imgInd, 1);
            },
            // 明细图片删除
            detailImgDelectClick(index, indc, ind, imgInd) {
                this.leaveList[index].content[indc].items[ind].value.splice(imgInd, 1);
            },
            //添加明细
            detailAddClick(index, indc) {
                var arr = [];
                var self = this;
                self.leaveList[index].content[indc].items.forEach(function (ele, ind) {
                    arr.push({
                        dateFormat: ele.dateFormat ? ele.dateFormat : "",
                        dataType: ele.dataType,
                        field: ele.field,
                        itemLabel: ele.itemLabel,
                        itemLabels: ele.itemLabels ? ele.itemLabels : "",
                        help: ele.help,
                        value: "",
                        values: "",
                        isRequired: ele.isRequired,
                        format: ele.format,
                        option: ele.option
                    });
                });
                self.leaveList[index].content.push({
                    detaildel: true,
                    label: self.leaveList[index].content[0].label,
                    items: arr
                });
            },
            //删除明细
            detailDeleteClick(index, indc) {
                this.leaveList[index].content.splice(indc, 1);
            },
            //提交
            submitClick() {
                var self = this;
                self.getapprovalgetapprover({
                    companyId: sessionStorage.getItem("companyId"), //公司id
                    memberId: sessionStorage.getItem("memberId"), //成员id
                    modelId: self.$route.query.modelId,
                    departId: self.departmentId,
                    judge: JSON.stringify(self.judgeArr)
                }).then(data => {
                    if (data.statusCode == 200) {
                        self.copyokList = []
                        self.approverokList = []
                        var approverShows = true
                        if (data.data) {
                            if (data.data.copys) {
                                self.copyokList = data.data.copys;
                            }
                            if (data.data.approvers) {
                                self.approverokList = data.data.approvers;
                                if (data.data.approvers.length > 0) {
                                    self.addApproverShow = false
                                    self.approverTitle = '（已由管理员配置）'
                                } else {
                                    if (data.data.approverShow && data.data.approverShow != '') {
                                        if (data.data.approverShow == 'false') {
                                            approverShows = false
                                            self.addApproverShow = false
                                            self.approverTitle = '（已由管理员配置）'
                                        }
                                    } else {
                                        self.addApproverShow = true
                                        self.approverTitle = '（点击头像可删除）'
                                    }
                                }

                            } else {
                                if (data.data.approverShow && data.data.approverShow != '') {
                                    if (data.data.approverShow == 'false') {
                                        approverShows = false
                                        self.addApproverShow = false
                                        self.approverTitle = '（已由管理员配置）'
                                    }
                                } else {
                                    self.addApproverShow = true
                                    self.approverTitle = '（点击头像可删除）'
                                }
                            }
                        }
                        for (var i = 0; i < self.leaveList.length; i++) {
                            if (
                                self.leaveList[i].type == "1" ||
                                self.leaveList[i].type == "2" ||
                                self.leaveList[i].type == "3" ||
                                self.leaveList[i].type == "4" ||
                                self.leaveList[i].type == "6" ||
                                self.leaveList[i].type == "9"
                            ) {
                                if (self.leaveList[i].required == "1") {
                                    if (self.leaveList[i].value == "") {
                                        Toast({
                                            message: "必填项不能为空",
                                            position: "bottom"
                                        });
                                        return;
                                    }
                                }
                            }
                            if (self.leaveList[i].type == "5") {
                                if (self.leaveList[i].required == "1") {
                                    if (
                                        self.leaveList[i].value == "" ||
                                        self.leaveList[i].values == ""
                                    ) {
                                        Toast({
                                            message: "必填项不能为空",
                                            position: "bottom"
                                        });
                                        return;
                                    }
                                }
                            }
                            if (self.leaveList[i].type == "7") {
                                var detailList = this.leaveList[i].content;
                                for (var j = 0; j < detailList.length; j++) {
                                    this.leaveList[i].content[j].num = j;
                                    var modelItemsList = detailList[j].items;
                                    for (var k = 0; k < modelItemsList.length; k++) {
                                        if (
                                            modelItemsList[k].dataType == "1" ||
                                            modelItemsList[k].dataType == "2" ||
                                            modelItemsList[k].dataType == "3" ||
                                            modelItemsList[k].dataType == "4" ||
                                            modelItemsList[k].dataType == "6" ||
                                            modelItemsList[k].dataType == "9"
                                        ) {
                                            if (modelItemsList[k].isRequired == "1") {
                                                if (modelItemsList[k].value == "") {
                                                    Toast({
                                                        message: "必填项不能为空",
                                                        position: "bottom"
                                                    });
                                                    return;
                                                }
                                            }
                                        }
                                        if (modelItemsList[k].dataType == "5") {
                                            if (modelItemsList[k].isRequired == "1") {
                                                if (
                                                    modelItemsList[k].value == "" ||
                                                    modelItemsList[k].values == ""
                                                ) {
                                                    Toast({
                                                        message: "必填项不能为空",
                                                        position: "bottom"
                                                    });
                                                    return;
                                                }
                                            }
                                        }
                                        if (modelItemsList[k].dataType == "10") {
                                            if (modelItemsList[k].required == "1") {
                                                if (modelItemsList[k].value.length == "0") {
                                                    Toast({
                                                        message: "必填项不能为空",
                                                        position: "bottom"
                                                    });
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (self.leaveList[i].type == "10") {
                                if (self.leaveList[i].required == "1") {
                                    if (self.leaveList[i].length == "0") {
                                        if (modelItemsList[k].value.length == "0") {
                                            Toast({
                                                message: "必填项不能为空",
                                                position: "bottom"
                                            });

                                            return;
                                        }
                                    }
                                }
                            }
                        }
                        var strleaveObj = JSON.stringify(self.leaveList); //字符串格式
                        var sendUserIdArr = [];
                        if (self.approverokList.length == 0 && self.approverList.length == 0) {
                            if (approverShows == false) {
                                Toast({
                                    message: "暂无审批人，请联系管理员",
                                    position: "bottom"
                                });
                            } else {
                                Toast({
                                    message: "请添加审批人",
                                    position: "bottom"
                                });
                            }
                            return;
                        } else {
                            if (self.approverokList.length > 0) {
                                self.approverokList.forEach(function (val) {
                                    sendUserIdArr.push(val.memberId);
                                });
                            }
                            if (self.approverList.length > 0) {
                                self.approverList.forEach(function (val) {
                                    sendUserIdArr.push(val.memberId);
                                });
                            }
                        }
                        var sendCopyIdArr = [];
                        if (self.copyokList.length > 0) {
                            self.copyokList.forEach(function (val) {
                                sendCopyIdArr.push(val.memberId);
                            });
                        }
                        if (self.copyList.length > 0) {
                            self.copyList.forEach(function (val) {
                                sendCopyIdArr.push(val.memberId);
                            });
                        }
                        // 请选择部门(必填)
                        if (self.departmentId == "") {
                            Toast({
                                message: "请选择部门",
                                position: "bottom"
                            });
                            return;
                        }
                        self.isAddShowTost = true;
                        self.getapprovalSubmitl({
                            companyId: sessionStorage.getItem("companyId"),
                            memberId: sessionStorage.getItem("memberId"),
                            modelId: self.$route.query.modelId,
                            jsonData: strleaveObj,
                            deptId: self.departmentId,
                            sendUserIds: sendUserIdArr.join(","),
                            sendCopyIds: sendCopyIdArr.join(",")
                        }).then(data => {
                            self.isAddShowTost = false;
                            if (data.statusCode == "200") {
                                sessionStorage.setItem("leavrShow", "true");
                                self.cancelUpdateShow = false;
                                self.cancelUpdateShowTrue = true;
                                self.$router.go(-1);
                            } else {
                                Toast({
                                    message: data.statusMessage,
                                    position: "bottom"
                                });
                            }
                        }).catch(msg => {
                            self.isAddShowTost = false;
                            Toast({
                                message: "服务器异常",
                                position: "bottom"
                            });
                        });
                    } else {
                        Toast({
                            message: "服务器异常",
                            position: "bottom"
                        });
                    }
                }).catch(msg => {
                    Toast({
                        message: "服务器异常",
                        position: "bottom"
                    });
                });

            },
            ...mapActions([
                "getapprovalModelItemDetail",
                "getapprovalSubmitl",
                "getapprovalgetapprover"
            ])
        },
        watch: {
            // leaveList: {
            //     handler(val) {
            //         var self = this;
            //        alert(val[0].value)
            //     },
            //     deep: true
            // }
        },
        filters: {
            // 过滤时间：年-月-日-时-分
            timeFun: function (val) {
                if (val) {
                    var standardTime = new Date(val);
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
                    return "暂无";
                }
            },
            // 过滤时间：年-月-日
            dataFun: function (val) {
                if (val) {
                    var standardTime = new Date(val);
                    var y, m, d;
                    y = standardTime.getFullYear();
                    m = standardTime.getMonth() + 1;
                    m = m > 9 ? m : "0" + m;
                    d = standardTime.getDate();
                    d = d > 9 ? d : "0" + d;
                    return y + "-" + m + "-" + d;
                } else {
                    return "暂无";
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
    .leave {
        min-height: 100vh;
        width: 100%;
        background: rgba(241, 241, 241, 1);
    }

    .leaveShow {
        overflow: hidden !important;
        height: 100vh !important;
    }

    .explain {
        width: 100%;
        padding: 0 0.4267rem;
        font-size: 0.3733rem;
        color: #848484;
        line-height: calc(0.5333rem + 0.3733rem);
        height: calc(0.5333rem + 0.3733rem);
        overflow: hidden;
        background-color: #fff;
        /* border-top: 1px solid #e3e3e3; */
        position: relative;
    }

    .leaveFor:nth-child(1) {
        margin-top: 0;
    }

    .explain::after {
        position: absolute;
        top: 0;
        left: 16px;
        width: calc(100% - 16px);
        height: 1px;
        content: "";
        background-color: #e3e3e3;
    }

    .leaveFor {
        margin-top: 0.32rem;
        overflow: hidden;
    }

    .department {
        margin-top: 0.32rem;
        overflow: hidden;
    }

    .leaveLI,
    .department {
        width: 100%;
        background: white;
        overflow: hidden;
        display: flex;
    }

    .leaveLIFont {
        width: 2.9867rem;
        height: 0.4267rem;
        line-height: 0.4267rem;
        color: #2b2b2b;
        font-size: 0.4267rem;
        margin: 0.3467rem 0.4267rem 0.4rem;
    }

    .inpFont {
        width: 5.0667rem;
        height: 1.1733rem;
        font-size: 0.3733rem;
        line-height: 1.1733rem;
        letter-spacing: 1px;
    }

    textarea {
        width: 5.0667rem;
        margin: 0.3467rem 0;
        resize: none;
        border: 0;
        font-size: 0.3733rem;
        line-height: 0.5333rem;
        min-height: 1.3333rem;
        overflow: hidden;
        letter-spacing: 1px;
    }

    .rightClick {
        display: flex;
        height: 1.1733rem;
        line-height: 1.1733rem;
    }

    .rightClickImage {}

    .ringhtIcon {
        height: 1.1733rem;
        width: 1.1733rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .ringhtIcon img {
        width: 0.2933rem;
        height: 0.2933rem;
    }

    .imgIcon {
        height: 1.1733rem;
        width: 1.1733rem;
        display: flex;
        align-items: center;
    }

    .imgIcon img {
        height: 0.5733rem;
        width: 0.5733rem;
    }

    .accessoryIcon img {
        height: 0.5733rem;
        width: 0.5733rem;
    }

    .accessoryIcon {
        height: 1.1733rem;
        width: 1.1733rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .rightFont {
        width: 5.0667rem;
        font-size: 0.3733rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .fontGray {
        color: #848484;
    }

    .leaveTime {
        width: 100%;
        background: white;

        overflow: hidden;
    }

    .leaveTimeStart {
        /* border-bottom: 1px solid #e3e3e3; */
        position: relative;
    }

    .leaveTimeStart::after {
        position: absolute;
        bottom: 0;
        left: 14px;
        width: calc(100% - 14px);
        height: 1px;
        background-color: #e3e3e3;
        content: "";
    }

    .leaveTimeStart,
    .leaveTimeFinish {
        display: flex;
    }

    .leaveImg {
        width: 100%;
        background: white;
    }

    .leaveImgCenter {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding: 0 0.32rem;
    }

    .leaveImgFor,
    .leaveImgAdd {
        width: 1.6533rem;
        height: 1.6533rem;
        border: 1px solid #e3e3e3;
        position: relative;
        margin: 0 0.1067rem 0.3733rem 0.1067rem;
    }

    .leaveImgAdd {
        background: url("/static/img/上传照片.png") 55% -0.2133rem no-repeat;
        background-size: 120%;
    }

    .accessory {
        display: flex;
        width: 100%;
        position: relative;
    }

    .accessory img {
        width: 1.28rem;
        height: 1.28rem;
        margin: 0 0.32rem 0.7467rem 0.4267rem;
    }

    .accessoryFont {
        width: 6.6667rem;
        height: 1.28rem;
        margin: 0 0.32rem 0.7467rem 0;
    }

    .accessoryFontTop,
    .accessoryFontFoot {
        width: 6.6667rem;
        height: 0.64rem;
        line-height: 0.64rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.4267rem;
    }

    .accessoryFontTop {
        color: #2c2c2c;
    }

    .accessoryFontFoot {
        color: #c0c0c0;
    }

    .accessoryDelect {
        width: 0.4267rem;
        height: 0.4267rem;
        position: absolute;
        top: 0.4267rem;
        right: 0.48rem;
        background: url("/static/img/取消@3x.png") no-repeat;
    }

    .leaveImgFor img {
        width: 100%;
        height: 100%;
    }

    .leaveImgDelect {
        width: 0.4267rem;
        height: 0.4267rem;
        position: absolute;
        top: -0.2133rem;
        right: -0.2133rem;
    }

    .leaveImgDelect img {
        width: 100%;
        height: 100%;
    }

    .detail {
        overflow: hidden;
        width: 100%;
    }

    .detailCon {
        /* margin-top: 0.32rem; */
    }

    .detailTop {
        display: flex;
        justify-content: space-between;
        padding: 0 0.4267rem;
        font-size: 0.3733rem;
        /* margin-bottom: 0.2133rem; */
        height: 27px;
        line-height: 27px;
    }

    .detailTopLeft {
        color: #2b2b2b;
    }

    .detailTopRight {
        color: rgb(14, 154, 248);
    }

    .detailLidetailTop:nth-child(2) .detailLi {
        border-top: 0;
    }

    .detailLi {
        width: 100%;
        background: white;
        overflow: hidden;
        display: flex;
        /* border-top: 1px solid #e3e3e3; */
        position: relative;
    }

    .detailLidetailTop:nth-child(2) .detailLi::after {
        position: absolute;
        top: 0;
        left: 16px;
        width: calc(100% - 16px);
        height: 0px;
        content: "";
        background-color: #fff;
    }

    .detailLi::after {
        position: absolute;
        top: 0;
        left: 16px;
        width: calc(100% - 16px);
        height: 1px;
        content: "";
        background-color: #e3e3e3;
    }

    .detailTime {
        background: white;
        /* border-top: 1px solid #e3e3e3; */
        position: relative;
    }

    .detailTime::after {
        position: absolute;
        top: 0;
        left: 16px;
        width: calc(100% - 16px);
        height: 1px;
        content: "";
        background-color: #e3e3e3;
    }

    .addDetail {
        width: 100%;
        height: 1.1733rem;
        font-size: 0.4267rem !important;
        line-height: 1.1733rem;
        background: white;
        color: rgb(14, 154, 248);
        display: flex;
        justify-content: center;
        align-items: center;
        /* border-top: 1px solid #e3e3e3; */
        position: relative;
    }

    .addDetail::after {
        position: absolute;
        top: 0;
        left: 16px;
        width: calc(100% - 16px);
        height: 1px;
        content: "";
        background-color: #e3e3e3;
    }

    .addDetailFont {
        transform: scale(2.5);
        -webkit-transform: scale(2.5);
        -moz-transform: scale(2.5);
        -o-transform: scale(2.5);
        -ms-transform: scale(2.5);
        height: 0.6667rem;
        display: flex;
        align-items: center;
    }

    .approver {
        width: 100%;
        background: white;
        margin-top: 0.32rem;
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

    .addButton img {
        width: 0.96rem;
        height: 0.96rem;
        border-radius: 50%;
    }

    .addButton {
        width: 0.96rem;
        height: 0.96rem;
        border-radius: 50%;
    }

    .approverLiTop {
        width: 0.96rem;
        height: 0.96rem;
        border-radius: 50%;
        margin-bottom: 0.2133rem;
    }

    .approverLiTop img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }

    .approverLiAdd {
        width: 0.9333rem;
        height: 0.9333rem;
        text-align: center;
        line-height: 0.72rem;
        font-size: 0.9333rem;
        margin-bottom: 0.2133rem;
        color: #e3e3e3;
    }

    .approverLiFont {
        width: 1.4933rem;
        height: 0.3733rem;
        margin-left: -0.2667rem;
        text-align: center;
        color: #848484;
        line-height: 0.3733rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .submits {
        width: 10rem;
        height: 1.28rem;
        background: rgba(255, 255, 255, 1);
        overflow: hidden;
    }

    .submit {
        width: 10rem;
        height: 1.28rem;
        line-height: 1.28rem;
        text-align: center;
        font-size: 0.48rem;
        color: rgba(255, 255, 255, 1);
        background: linear-gradient( 151.7deg,
        rgba(102, 173, 247, 1),
        rgba(67, 144, 225, 1));
        position: fixed;
        bottom: 0;
        overflow: hidden;
    }

    .approverImgNo {
        width: 0.96rem;
        height: 0.96rem;
        border-radius: 100%;
        margin-bottom: 0.2133rem;
        line-height: 0.96rem;
        text-align: center;
        color: white;
        background: #4390e1;
    }

    /* 询问框 */

    .cancelUpdateContent>div:nth-child(2)>div {
        width: 50%;
        text-align: center;
        font-size: 0.48rem;
        color: rgba(67, 144, 225, 1);
        height: 1.1733rem;
        line-height: 1.1733rem;
    }

    .cancelUpdateContent>div:nth-child(2)>div:nth-child(1) {
        border-right: 1px solid rgba(195, 222, 250, 1);
    }

    .cancelUpdateContent>div:nth-child(2) {
        display: flex;
        justify-content: space-between;
        height: 1.1733rem;
        align-items: center;
    }

    .cancelUpdateContent>div:nth-child(1) {
        height: 1.44rem;
        width: 100%;
        text-align: center;
        font-size: 0.4533rem;
        line-height: 1.44rem;
        border-bottom: 1px solid rgba(195, 222, 250, 1);
        color: rgba(44, 44, 44, 1);
    }

    .cancelUpdateContent {
        width: 7.2rem;
        height: 2.6133rem;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 0.0533rem;
    }

    .cancelUpdate {
        width: 100vw;
        height: 100vh;
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.4);
    }

    /* 询问框 */

    /* 新增加载框 */

    .AddShowTost {
        width: 100vw;
        height: 100vh;
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0);
    }

    input {
        -webkit-user-select: auto;
        /*ios Input 光标问题*/
        height: 0.8rem !important;
        overflow: hidden;
        margin-top: 0.2134rem;
        line-height: 0.8rem !important;
        font-size: 0.4267rem;
    }
</style>