import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, StorageCheckDetailActionType} from '../../types';
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getStorageCheckInfo = (storageCheckId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageCheck?storageCheckId=' + storageCheckId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: StorageCheckDetailActionType.getStorageCheckInfo, payload: res.rows[0]});
            } else {
                dispatch({type: StorageCheckDetailActionType.getStorageCheckInfo, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取仓库盘点信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getStorageCheckRelList = (storageCheckId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageCheckRel?storageCheckId=' + storageCheckId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: StorageCheckDetailActionType.getDetailList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取仓库盘点详细列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveStorageCheck = () => async (dispatch, getState) => {
    try {
        const storageCheckInfo = getState().StorageCheckDetailReducer.storageCheckInfo;
        const params = {
            remark: storageCheckInfo.remark
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageCheck/' + storageCheckInfo.id;
        console.log('',url);
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("保存成功", "", "success");
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveStorageCheckRel = (data) => async (dispatch, getState) => {
    try {
        const storageCheckInfo = getState().StorageCheckDetailReducer.storageCheckInfo;
        const params = {
            checkCount: data.checkCount,
            remark: data.remark
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageCheckRel/' + data.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("保存成功", "", "success");
            dispatch(getStorageCheckInfo(storageCheckInfo.id));
            dispatch(getStorageCheckRelList(storageCheckInfo.id));
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const changeStorageCheckStatus = (storageCheckId, status) => async (dispatch) => {
    try {
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageCheck/' + storageCheckId + '/status?status=' + status;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            // 刷新
            dispatch(getStorageCheckInfo(storageCheckId));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const downLoadPDF = () => async () => {
    try {
        html2canvas(document.getElementById("pdf"), {
            // allowTaint: true, //避免一些不识别的图片干扰，默认为false，遇到不识别的图片干扰则会停止处理html2canvas
            // taintTest: false,
            useCORS: true,
            // Create a canvas with double-resolution.
            scale: 2,
            // Create a canvas with 144 dpi (1.5x resolution).
            dpi: 192,
            // 背景设为白色（默认为黑色）
            background: "#fff"
        }).then(function (canvas) {
            // Html / Canvas 画面 尺寸
            let contentWidth = canvas.width;
            let contentHeight = canvas.height;

            // 一页pdf显示html页面生成的canvas高度;（根据比例，算出来的固定值）
            let htmlPageHeight = contentWidth / 595.28 * 841.89;
            //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
            let pdfPageWidth = 595.28;
            let pdfPageHeight = 595.28 / contentWidth * contentHeight;
            let pageData = canvas.toDataURL('image/jpeg', 1.0);

            // var pdf = new jsPDF('', 'pt', 'a4');
            // 画面尺寸小于 一页，则默认为A4，否则：设定指定高度画面
            let pdf = new jsPDF('', 'pt', contentHeight < htmlPageHeight ? 'a4' : [pdfPageWidth, pdfPageHeight + 30]);
            pdf.addImage(pageData, 'JPEG', 0, 0, pdfPageWidth, pdfPageHeight);

            // 保存PDF文件
            pdf.save('仓库盘点详情.pdf');
        });
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};