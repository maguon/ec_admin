import Swal from 'sweetalert2';
import {AppActionType, StoragePanelActionType} from '../../types';
import {apiHost} from '../../config';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 未入库的商品
export const getPurchaseItemStat = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseItemStat?storageStatus=' + sysConst.STORAGE_STATUS[0].value;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: StoragePanelActionType.getPurchaseItemStat, payload: res.rows[0]});
            } else {
                dispatch({type: StoragePanelActionType.getPurchaseItemStat, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取未入库的商品信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// 需要出库，但未出库的统计
export const getPurchaseRefundStat = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseRefundStat?storageType=' + sysConst.STORAGE_TYPE[1].value + '&refundStorageFlag=' + sysConst.REFUND_STORAGE_FLAG[0].value;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: StoragePanelActionType.getPurchaseRefundStat, payload: res.rows[0]});
            } else {
                dispatch({type: StoragePanelActionType.getPurchaseRefundStat, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取未出库的商品信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// 盘点未完成
export const getStorageCheckStat = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageCheckStat?status=1';

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: StoragePanelActionType.getStorageCheckStat, payload: res.rows[0]});
            } else {
                dispatch({type: StoragePanelActionType.getStorageCheckStat, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取盘点未完成信息失败", res.msg, "warning");
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
            + '/orderItemProdStorage?status=1&&orderItemType=' + sysConst.STORAGE_OP_TYPE[0].value;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            if (res.rows.length > 0) {
                let prodCnt = 0;
                res.rows.forEach((item) => {
                    prodCnt = prodCnt + parseInt(item.prod_count)
                });
                dispatch({type: StoragePanelActionType.getOrderStat, payload: {count: res.rows.length, prodCnt : prodCnt}});
            } else {
                dispatch({type: StoragePanelActionType.getOrderStat, payload: {count: 0, prodCnt : 0}});
            }
        } else if (!res.success) {
            Swal.fire("获取未出库的订单商品信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// 获取未入库的退单商品信息
export const getOrderRefundProd = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderRefundProd?status=' + sysConst.ORDER_REFUND_STORAGE_STATUS[0].value;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                let prodCnt = 0;
                res.rows.forEach((item) => {
                    prodCnt = prodCnt + parseInt(item.prod_refund_count)
                });
                dispatch({type: StoragePanelActionType.getOrderRefundStat, payload: {count: res.rows.length, prodCnt : prodCnt}});
            } else {
                dispatch({type: StoragePanelActionType.getOrderRefundStat, payload: {count: 0, prodCnt : 0}});
            }
        } else if (!res.success) {
            Swal.fire("获取未入库的退单商品信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};