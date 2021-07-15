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
            + '/purchaseStat?status=[1,3]';

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
            + '/purchaseRefundStat?storageType=' + sysConst.STORAGE_TYPE[1].value + '&refundStorageFlag=' + sysConst.REFUND_STORAGE_FLAG[0].value;

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