import Swal from 'sweetalert2';
import {AppActionType, PurchasePanelActionType} from '../../types';
import {apiHost} from '../../config';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 未完成的采购
export const getPurchaseItemStat = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseStat?status='+sysConst.PURCHASE_STATUS[0].value+','+sysConst.PURCHASE_STATUS[1].value;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: PurchasePanelActionType.getPurchaseItemStat, payload: res.rows[0]});
            } else {
                dispatch({type: PurchasePanelActionType.getPurchaseItemStat, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取未完成的采购信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// 未完成的退货
export const getPurchaseRefundStat = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseRefundStat?status=' + sysConst.REFUND_STATUS[0].value;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: PurchasePanelActionType.getPurchaseRefundStat, payload: res.rows[0]});
            } else {
                dispatch({type: PurchasePanelActionType.getPurchaseRefundStat, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取未完成的退货信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
//未出库的订单商品
export const getOrderStat = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderItemProdStorage?orderItemType=' + sysConst.STORAGE_OP_TYPE[0].value;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: PurchasePanelActionType.getOrderStat, payload: res.count});
            } else {
                dispatch({type: PurchasePanelActionType.getOrderStat, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取未出库的订单商品信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};