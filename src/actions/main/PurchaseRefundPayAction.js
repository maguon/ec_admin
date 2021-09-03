import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, PurchaseRefundPayActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');

export const getPurchaseRefundList = (params) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = params.dataStart;
        // 检索条件：每页数量
        const size = getState().PurchaseRefundPayReducer.purchaseRefundData.size;

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseRefund?start=' + start + '&size=' + size;

        // 检索条件
        let conditionsObj = {
            purchaseId: params.purchaseId,
            supplierId: params.supplier == null ? '' : params.supplier.id,
            paymentStatus: params.paymentStatus,
            dateIdStart: commonUtil.formatDate(params.paymentDateStart, 'yyyyMMdd'),
            dateIdEnd: commonUtil.formatDate(params.paymentDateEnd, 'yyyyMMdd')
        };
        let conditions = httpUtil.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newData = getState().PurchaseRefundPayReducer.purchaseRefundData;
        if (res.success) {
            newData.start = start;
            newData.dataSize = res.rows.length;
            newData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: PurchaseRefundPayActionType.getPurchaseRefundData, payload: newData});
        } else if (!res.success) {
            Swal.fire("获取采购退款列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const confirmPayment = (id, params) => async (dispatch, getState) => {
    try {
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseRefund/' + id + '/paymentStatus?paymentStatus=' + sysConst.REFUND_PAYMENT_STATUS[1].value;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            Swal.fire("修改成功", "", "success");
            // 刷新列表
            dispatch(getPurchaseRefundList({...params, dataStart: getState().PurchaseRefundPayReducer.purchaseRefundData.start}));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getPurchaseRefundPayStat = (params) => async (dispatch) => {
    try {
        // 检索条件
        let conditionsObj = {
            purchaseId: params.purchaseId,
            supplierId: params.supplier == null ? '' : params.supplier.id,
            paymentStatus: params.paymentStatus,
            dateIdStart: commonUtil.formatDate(params.paymentDateStart, 'yyyyMMdd'),
            dateIdEnd: commonUtil.formatDate(params.paymentDateEnd, 'yyyyMMdd')
        };
        let conditions = httpUtil.objToUrl(conditionsObj);
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchaseRefundStat?';
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: PurchaseRefundPayActionType.setPurchaseRefundPayStatData, payload: res.rows[0]});
            } else {
                return
            }
        } else if (!res.success) {
            Swal.fire("获取汇总信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};