import Swal from 'sweetalert2';
import {AppActionType, OrderPanelActionType} from '../../types';
import {apiHost} from '../../config';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');

export const getOrderStat = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order?status='+sysConst.ORDER_STATUS[0].value;
        let url2 = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order?status='+sysConst.ORDER_STATUS[1].value;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        let res2 = await httpUtil.httpGet(url2);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success&&res2.success) {
            if (res.count&&res2.count) {
                dispatch({type: OrderPanelActionType.getOrderStat, payload: res.count});
                dispatch({type: OrderPanelActionType.getOrderStatIng, payload: res2.count});
            } else {
                dispatch({type: OrderPanelActionType.getOrderStat, payload: {}});
                dispatch({type: OrderPanelActionType.getOrderStatIng, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取未完成的采购信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getTodayOrderStat = () => async (dispatch) => {
    try {
        let today = commonUtil.getDateFormat(new Date());
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderStat?dateStart=' + today + '&dateEnd=' + today;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: OrderPanelActionType.getTodayOrderStat, payload: res.rows[0]});
            } else {
                dispatch({type: OrderPanelActionType.getTodayOrderStat, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取今日订单信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getOrderRefundStat = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderRefundStat?status=' + sysConst.ORDER_REFUND_STATUS[0].value;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: OrderPanelActionType.getOrderRefundStat, payload: res.rows[0]});
            } else {
                dispatch({type: OrderPanelActionType.getOrderRefundStat, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取未完成的退单信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};