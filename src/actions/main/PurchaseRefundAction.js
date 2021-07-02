import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, PurchasePayActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getPurchasePayList = (params) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = params.dataStart;
        // 检索条件：每页数量
        const size = getState().PurchasePayReducer.purchasePayData.size;

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchase?start=' + start + '&size=' + size;

        // 检索条件
        let conditionsObj = {
            purchaseId: params.purchaseId,
            supplierId: params.supplier == null ? '' : params.supplier.id,
            planDateStart: params.planDateStart.replace(/-/g, ""),
            planDateEnd: params.planDateEnd.replace(/-/g, ""),
            paymentStatus: params.paymentStatus,
            paymentDateStart: params.paymentDateStart.replace(/-/g, ""),
            paymentDateEnd: params.paymentDateEnd.replace(/-/g, "")
        };
        let conditions = httpUtil.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let appData = getState().PurchasePayReducer.purchasePayData;
        if (res.success) {
            appData.start = start;
            appData.dataSize = res.rows.length;
            appData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: PurchasePayActionType.getPurchasePayData, payload: appData});
        } else if (!res.success) {
            Swal.fire("获取采购支付列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const confirmPayment = (id, params) => async (dispatch, getState) => {
    try {
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchase/' + id + '/paymentStatus?paymentStatus=' + sysConst.PAYMENT_STATUS[1].value;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            Swal.fire("修改成功", "", "success");
            // 刷新列表
            dispatch(getPurchasePayList({...params, dataStart: getState().PurchasePayReducer.purchasePayData.start}));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getPurchaseItem = (purchaseId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseItem?purchaseId=' + purchaseId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: PurchasePayActionType.setModalData, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取采购支付详情失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};