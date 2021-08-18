import Swal from 'sweetalert2';
import {AppActionType, FinancePanelActionType} from '../../types';
import {apiHost} from '../../config';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 未完成的采购付款
export const getPurchaseStat = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseStat?paymentStatus=' + sysConst.PAYMENT_STATUS[0].value;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: FinancePanelActionType.getPurchaseStat, payload: res.rows[0]});
            } else {
                dispatch({type: FinancePanelActionType.getPurchaseStat, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取采购统计信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// 未完成的采购退款
export const getPurchaseRefundStat = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseRefundStat?paymentStatus=' + sysConst.REFUND_PAYMENT_STATUS[0].value;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: FinancePanelActionType.getPurchaseRefundStat, payload: res.rows[0]});
            } else {
                dispatch({type: FinancePanelActionType.getPurchaseRefundStat, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取采购退款信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// 未付款的订单
export const getOrderStat = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderStat?paymentStatus=' + sysConst.ORDER_PAYMENT_STATUS[0].value;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: FinancePanelActionType.getOrderStat, payload: res.rows[0]});
            } else {
                dispatch({type: FinancePanelActionType.getOrderStat, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取未付款的订单信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// 未付款的退单
export const getOrderRefundStat = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderRefundStat?paymentStatus=' + sysConst.ORDER_PAYMENT_STATUS[0].value;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: FinancePanelActionType.getOrderRefundStat, payload: res.rows[0]});
            } else {
                dispatch({type: FinancePanelActionType.getOrderRefundStat, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取未付款的退单信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};